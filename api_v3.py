"""Async Pact Coffee v3 API helpers used by the integration."""

from __future__ import annotations

from typing import Any

from aiohttp import ClientSession
from aiohttp.client_exceptions import ClientConnectionError

API_BASE_URL = "https://api.pactcoffee.com"
API_VERSION = "v3"


async def async_authenticate(
    session: ClientSession,
    username: str,
    password: str,
) -> str:
    """Get a v3 API token."""
    url = f"{API_BASE_URL}/{API_VERSION}/tokens"
    async with session.post(url, json={"email": username, "password": password}, timeout=30) as response:
        if response.status != 200:
            raise ClientConnectionError(f"Unable to obtain token, status={response.status}")
        payload = await response.json()
        token = payload.get("token", {}).get("id")
        if not token:
            raise ClientConnectionError("No token returned by Pact API")
        return token


async def async_api_request(
    session: ClientSession,
    token: str,
    method: str,
    path: str,
    *,
    json_body: dict[str, Any] | None = None,
) -> dict[str, Any] | list[dict[str, Any]]:
    """Make an authenticated v3 API request."""
    url = f"{API_BASE_URL}/{API_VERSION}{path}"
    async with session.request(
        method,
        url,
        headers={"Authorization": f"Bearer {token}", "Accept": "application/json"},
        json=json_body,
        timeout=30,
    ) as response:
        if response.status != 200:
            body = await response.text()
            raise ClientConnectionError(f"Unexpected error code {response.status}: {body}")
        return await response.json()


async def async_fetch_recurrables(session: ClientSession, token: str) -> list[dict[str, Any]]:
    """Fetch current recurrables from Pact v3."""
    payload = await async_api_request(session, token, "GET", "/users/me/recurrables")
    return payload if isinstance(payload, list) else []


async def async_order_asap(session: ClientSession, token: str, order_id: str) -> dict[str, Any]:
    """Dispatch an order ASAP."""
    payload = await async_api_request(session, token, "PATCH", f"/users/me/orders/{order_id}/asap", json_body={})
    return payload if isinstance(payload, dict) else {}


async def async_reschedule_order(
    session: ClientSession,
    token: str,
    order_id: str,
    dispatch_on: str,
) -> dict[str, Any]:
    """Reschedule an order."""
    payload = await async_api_request(
        session,
        token,
        "PATCH",
        f"/users/me/orders/{order_id}/reschedule",
        json_body={"dispatch_on": dispatch_on, "order_id": order_id},
    )
    return payload if isinstance(payload, dict) else {}
