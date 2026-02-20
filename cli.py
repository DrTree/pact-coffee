"""Local async CLI for debugging Pact v3 calls without Home Assistant."""

from __future__ import annotations

import argparse
import asyncio
import json
import os
from pathlib import Path
from typing import Any

from aiohttp import ClientSession

from api_v3 import async_authenticate, async_fetch_recurrables, async_order_asap, async_reschedule_order


def load_dotenv(path: str = ".env") -> None:
    """Load simple KEY=VALUE pairs into environment."""
    dotenv = Path(path)
    if not dotenv.exists():
        return

    for raw in dotenv.read_text().splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key and key not in os.environ:
            os.environ[key] = value


def build_parser() -> argparse.ArgumentParser:
    """Build CLI parser."""
    parser = argparse.ArgumentParser(description="Pact Coffee v3 debug CLI")
    sub = parser.add_subparsers(dest="command", required=True)

    sub.add_parser("recurrables", help="List recurrables")

    asap = sub.add_parser("asap", help="Dispatch an order ASAP")
    asap.add_argument("--order-id", required=True, help="Order id")

    reschedule = sub.add_parser("reschedule", help="Reschedule an order")
    reschedule.add_argument("--order-id", required=True, help="Order id")
    reschedule.add_argument("--dispatch-on", required=True, help="YYYY-MM-DD")

    return parser


async def run_cli(argv: list[str] | None = None) -> int:
    """Execute CLI command."""
    load_dotenv()
    parser = build_parser()
    args = parser.parse_args(argv)

    username = os.environ.get("PACT_USERNAME") or os.environ.get("USERNAME")
    password = os.environ.get("PACT_PASSWORD") or os.environ.get("PASSWORD")
    if not username or not password:
        print("Missing credentials. Set PACT_USERNAME and PACT_PASSWORD in .env or env.")
        return 2

    async with ClientSession() as session:
        token = await async_authenticate(session, username, password)

        if args.command == "recurrables":
            result = await async_fetch_recurrables(session, token)
        elif args.command == "asap":
            result = await async_order_asap(session, token, str(args.order_id))
        elif args.command == "reschedule":
            result = await async_reschedule_order(
                session,
                token,
                str(args.order_id),
                args.dispatch_on,
            )
        else:
            parser.error("Unknown command")
            return 1

    print(json.dumps(result, indent=2, default=str))
    return 0


def main() -> None:
    """Entrypoint."""
    raise SystemExit(asyncio.run(run_cli()))


if __name__ == "__main__":
    main()
