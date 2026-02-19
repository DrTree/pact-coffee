"""Asyncio client for Pact Coffee web API endpoints inferred from front-end bundles."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from aiohttp import ClientResponse, ClientSession
from aiohttp.client_exceptions import ClientConnectionError


@dataclass(slots=True)
class PactAsyncConfig:
    """Runtime configuration for API calls."""

    base_url: str = "https://api.pactcoffee.com"
    version: str = "v3"
    timeout_seconds: int = 30

    @property
    def api_root(self) -> str:
        return f"{self.base_url.rstrip('/')}/{self.version}"


class PactAsyncioApi:
    """Asyncio client for Pact customer API routes."""

    def __init__(self, session: ClientSession, token: str | None = None, config: PactAsyncConfig | None = None) -> None:
        self._session = session
        self._token = token
        self._config = config or PactAsyncConfig()

    def set_token(self, token: str) -> None:
        self._token = token

    async def login(self, email: str, password: str) -> dict[str, Any]:
        data = await self._request("POST", "/tokens", json={"email": email, "password": password}, auth=False)
        token = data.get("token", {}).get("id")
        if token:
            self._token = token
        return data

    async def logout(self) -> dict[str, Any]:
        return await self._request("DELETE", "/tokens/me")

    async def get_user(self) -> dict[str, Any]:
        return await self._request("GET", "/users/me")

    async def get_recurrables(self) -> dict[str, Any]:
        return await self._request("GET", "/users/me/recurrables/switch_list")

    async def get_recurrable(self, recurrable_id: str | int) -> dict[str, Any]:
        return await self._request("GET", f"/users/me/recurrables/{recurrable_id}")

    async def pause_recurrable(self, recurrable_id: str | int, payload: dict[str, Any] | None = None) -> dict[str, Any]:
        return await self._request("PATCH", f"/users/me/recurrables/{recurrable_id}/pause", json=payload or {})

    async def unpause_recurrable(self, recurrable_id: str | int) -> dict[str, Any]:
        return await self._request("PATCH", f"/users/me/recurrables/{recurrable_id}/unpause", json={})

    async def cancel_recurrable(self, recurrable_id: str | int, payload: dict[str, Any] | None = None) -> dict[str, Any]:
        return await self._request("PATCH", f"/users/me/recurrables/{recurrable_id}/cancel", json=payload or {})

    async def asap_order(self, order_id: str | int) -> dict[str, Any]:
        return await self._request("PATCH", f"/users/me/orders/{order_id}/asap", json={})

    async def reschedule_order(self, order_id: str | int, dispatch_on: str) -> dict[str, Any]:
        return await self._request(
            "PATCH",
            f"/users/me/orders/{order_id}/reschedule",
            json={"order_id": order_id, "dispatch_on": dispatch_on},
        )

    async def delay_order(self, order_id: str | int, days: int) -> dict[str, Any]:
        return await self._request("PATCH", f"/users/me/orders/{order_id}/delay", json={"days": days})

    async def skip_order(self, order_id: str | int) -> dict[str, Any]:
        return await self._request("PATCH", f"/users/me/orders/{order_id}/skip", json={})

    async def get_order_history(self, year: int | None = None) -> dict[str, Any]:
        params = {"year": year} if year is not None else None
        return await self._request("GET", "/users/me/orders/history", params=params)

    async def get_order(self, order_id: str | int) -> dict[str, Any]:
        return await self._request("GET", f"/users/me/orders/{order_id}")

    async def redeem_voucher(self, code: str, payload: dict[str, Any] | None = None) -> dict[str, Any]:
        return await self._request("POST", f"/vouchers/{code}/redeem", json=payload or {})

    async def validate_voucher(self, code: str, payload: dict[str, Any] | None = None) -> dict[str, Any]:
        return await self._request("POST", f"/vouchers/{code}/validate", json=payload or {})

    async def _request(
        self,
        method: str,
        path: str,
        *,
        json: dict[str, Any] | None = None,
        params: dict[str, Any] | None = None,
        auth: bool = True,
    ) -> dict[str, Any]:
        if auth and not self._token:
            raise ClientConnectionError("No auth token configured")

        headers = {"Accept": "application/json"}
        if auth:
            headers["Authorization"] = f"Bearer {self._token}"

        url = f"{self._config.api_root}{path}"
        async with self._session.request(
            method,
            url,
            headers=headers,
            json=json,
            params=params,
            timeout=self._config.timeout_seconds,
        ) as response:
            return await self._parse_response(response)

    async def _parse_response(self, response: ClientResponse) -> dict[str, Any]:
        if response.status >= 400:
            body = await response.text()
            raise ClientConnectionError(f"Unexpected error code {response.status}: {body}")
        if response.content_type == "application/json":
            return await response.json()
        text = await response.text()
        return {"raw": text}
