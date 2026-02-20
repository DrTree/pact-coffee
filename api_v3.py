"""Async Pact Coffee v3 API helpers used by the integration."""

from __future__ import annotations

import logging
import os
from typing import Any

from aiohttp import ClientSession
from aiohttp.client_exceptions import ClientConnectionError

API_BASE_URL = os.getenv("PACT_API_BASE", "https://api.pactcoffee.com")
API_VERSION = os.getenv("PACT_API_VERSION", "v3")
_LOGGER = logging.getLogger(__name__)


def _build_url(path: str) -> str:
    base = API_BASE_URL.rstrip("/")
    version = API_VERSION.strip("/")
    suffix = path if path.startswith("/") else f"/{path}"
    return f"{base}/{version}{suffix}"


async def async_authenticate(
    session: ClientSession,
    username: str,
    password: str,
) -> str:
    """Get a v3 API token."""
    url = _build_url("/tokens")
    _LOGGER.debug("Authenticating against %s", url)
    async with session.post(url, json={"email": username, "password": password}, timeout=30) as response:
        _LOGGER.debug("Auth response status=%s", response.status)
        if response.status != 200:
            body = await response.text()
            _LOGGER.error("Auth failed status=%s body=%s", response.status, body)
            raise ClientConnectionError(f"Unable to obtain token, status={response.status}: {body}")
        payload = await response.json()
        token = payload.get("token", {}).get("id")
        if not token:
            _LOGGER.error("Auth response did not contain token: %s", payload)
            raise ClientConnectionError("No token returned by Pact API")
        _LOGGER.debug("Auth succeeded, token prefix=%s", token[:4])
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
    url = _build_url(path)
    _LOGGER.debug("Pact API request method=%s url=%s", method, url)
    async with session.request(
        method,
        url,
        headers={"Authorization": f"Bearer {token}", "Accept": "application/json"},
        json=json_body,
        timeout=30,
    ) as response:
        _LOGGER.debug("Pact API response status=%s method=%s url=%s", response.status, method, url)
        if response.status != 200:
            body = await response.text()
            _LOGGER.error(
                "Pact API request failed method=%s url=%s status=%s body=%s",
                method,
                url,
                response.status,
                body,
            )
            raise ClientConnectionError(f"Unexpected error code {response.status}: {body}")
        return await response.json()


async def async_fetch_recurrables(session: ClientSession, token: str) -> list[dict[str, Any]]:
    """Fetch current recurrables from Pact v3."""
    # v3 route used by recovered frontend implementation.
    payload = await async_api_request(session, token, "GET", "/users/me/recurrables/switch_list")
    if isinstance(payload, list):
        return payload
    if isinstance(payload, dict):
        recurrables = payload.get("recurrables")
        if isinstance(recurrables, list):
            return recurrables
    _LOGGER.debug("Unexpected recurrables payload shape: %s", payload)
    return []


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
