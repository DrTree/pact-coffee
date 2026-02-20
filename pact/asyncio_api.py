"""Asyncio client for Pact Coffee web API endpoints inferred from front-end bundles."""

from __future__ import annotations

from dataclasses import dataclass
import logging
from typing import Any

from aiohttp import ClientResponse, ClientSession
from aiohttp.client_exceptions import ClientConnectionError

_LOGGER = logging.getLogger(__name__)



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
    """Asyncio client for Pact customer API routes.

    Method names follow the v3 naming from the recovered web client where possible.
    """

    def __init__(
        self,
        session: ClientSession,
        token: str | None = None,
        config: PactAsyncConfig | None = None,
    ) -> None:
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

    async def get_user_info(self) -> dict[str, Any]:
        return await self._request("GET", "/users/me")

    async def update_user_info(self, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("PATCH", "/users/me", json=payload)

    async def update_user_email(self, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("PATCH", "/users/me/email", json=payload)

    async def update_user_password(self, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("PATCH", "/users/me/password", json=payload)

    async def get_cards(self) -> dict[str, Any]:
        return await self._request("GET", "/users/me/payment_cards")

    async def get_card_address(self, card_id: str | int) -> dict[str, Any]:
        return await self._request("GET", f"/users/me/payment_cards/{card_id}/billing_address")

    async def update_user_card(self, payload: dict[str, Any]) -> dict[str, Any]:
        # Kept aligned with front-end behavior: this path is still requested without explicit v3 base.
        return await self._request_base("POST", "/users/me/payment_cards", json=payload)

    async def get_addresses(self) -> dict[str, Any]:
        return await self._request("GET", "/users/me/addresses")

    async def create_address(self, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("POST", "/users/me/addresses", json=payload)

    async def edit_address(self, address_id: str | int, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("PATCH", f"/users/me/addresses/{address_id}", json=payload)

    async def delete_address(self, address_id: str | int, payload: dict[str, Any] | None = None) -> dict[str, Any]:
        return await self._request("DELETE", f"/users/me/addresses/{address_id}", json=payload or {})

    async def get_primary_recurrable(self) -> dict[str, Any]:
        return await self._request("GET", "/users/me/recurrables/primary")

    async def get_recurrables(self) -> dict[str, Any]:
        return await self._request("GET", "/users/me/recurrables")

    async def get_recurrable_by_id(self, recurrable_id: str | int) -> dict[str, Any]:
        return await self._request("GET", f"/users/me/recurrables/{recurrable_id}")

    async def get_recurrables_switch_list(self) -> dict[str, Any]:
        return await self._request("GET", "/users/me/recurrables/switch_list")

    async def get_paused_recurrables(self) -> dict[str, Any]:
        return await self._request("GET", "/users/me/recurrables/paused")

    async def get_recurrable_tiers(self, recurrable_id: str | int) -> dict[str, Any]:
        return await self._request("GET", f"/users/me/recurrables/{recurrable_id}/tiers")

    async def get_recurrable_sizes(self, recurrable_id: str | int) -> dict[str, Any]:
        return await self._request("GET", f"/users/me/recurrables/{recurrable_id}/bag_sizes")

    async def get_recurrable_coffee_types(self, recurrable_id: str | int) -> dict[str, Any]:
        return await self._request("GET", f"/users/me/recurrables/{recurrable_id}/coffee_types")

    async def get_recurrable_coffees(self, recurrable_id: str | int) -> dict[str, Any]:
        return await self._request("GET", f"/users/me/recurrables/{recurrable_id}/coffees")

    async def update_recurrable_name(self, recurrable_id: str | int, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("PATCH", f"/users/me/recurrables/{recurrable_id}/name", json=payload)

    async def update_recurrable_tier(self, recurrable_id: str | int, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("PATCH", f"/users/me/recurrables/{recurrable_id}/tier", json=payload)

    async def update_recurrable_brew_method(self, recurrable_id: str | int, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("PATCH", f"/users/me/recurrables/{recurrable_id}/brew_method", json=payload)

    async def update_recurrable_size(self, recurrable_id: str | int, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("PATCH", f"/users/me/recurrables/{recurrable_id}/bag_size", json=payload)

    async def update_recurrable_coffee_type(self, recurrable_id: str | int, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("PATCH", f"/users/me/recurrables/{recurrable_id}/coffee_type", json=payload)

    async def update_recurrable_frequency(self, recurrable_id: str | int, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("PATCH", f"/users/me/recurrables/{recurrable_id}/frequency", json=payload)

    async def update_recurrable_address(self, recurrable_id: str | int, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("PATCH", f"/users/me/recurrables/{recurrable_id}/address", json=payload)

    async def pause_recurrable(self, recurrable_id: str | int, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("PATCH", f"/users/me/recurrables/{recurrable_id}/pause", json=payload)

    async def unpause_recurrable(self, recurrable_id: str | int) -> dict[str, Any]:
        return await self._request("PATCH", f"/users/me/recurrables/{recurrable_id}/unpause", json={})

    async def cancel_recurrable(self, recurrable_id: str | int, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("PATCH", f"/users/me/recurrables/{recurrable_id}/cancel", json=payload)

    async def get_retention_plans(self, recurrable_id: str | int) -> dict[str, Any]:
        return await self._request("GET", f"/users/me/recurrables/{recurrable_id}/retention_plans")

    async def update_cancel_pause_flow_plan_amount(
        self,
        recurrable_id: str | int,
        amount: int,
        flow: str,
    ) -> dict[str, Any]:
        return await self._request(
            "PATCH",
            f"/users/me/recurrables/{recurrable_id}/coffee_plan_amount",
            json={"amount": amount, "flow": flow},
        )

    async def update_cancel_pause_flow_plan_tier(
        self,
        recurrable_id: str | int,
        tier: str,
        flow: str,
    ) -> dict[str, Any]:
        return await self._request(
            "PATCH",
            f"/users/me/recurrables/{recurrable_id}/coffee_plan_tier",
            json={"tier": tier, "flow": flow},
        )

    async def create_recurrable(self, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("POST", "/users/me/recurrables", json=payload)

    async def available_product_addons(self, recurrable_id: str | int) -> dict[str, Any]:
        return await self._request("GET", f"/users/me/recurrables/{recurrable_id}/addons")

    async def add_addons(self, recurrable_id: str | int, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("POST", f"/users/me/recurrables/{recurrable_id}/recurrable_addons", json=payload)

    async def update_addons(self, recurrable_id: str | int, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("PATCH", f"/users/me/recurrables/{recurrable_id}/recurrable_addons", json=payload)

    async def delete_addon(self, recurrable_id: str | int, addon_id: str | int) -> dict[str, Any]:
        return await self._request("DELETE", f"/users/me/recurrables/{recurrable_id}/recurrable_addons/{addon_id}", json={})

    async def get_order_details(self, order_id: str | int) -> dict[str, Any]:
        return await self._request("GET", f"/users/me/orders/{order_id}")

    async def get_orders_history(self, year: int | None = None) -> dict[str, Any]:
        params = {"year": year} if year is not None else None
        return await self._request("GET", "/users/me/orders/history", params=params)

    async def update_order_item(self, order_id: str | int, item_id: str | int, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("PATCH", f"/users/me/orders/{order_id}/order_items/{item_id}", json=payload)

    async def asap_order(self, order_id: str | int) -> dict[str, Any]:
        return await self._request("PATCH", f"/users/me/orders/{order_id}/asap", json={})

    async def delay_order(self, order_id: str | int, days: int) -> dict[str, Any]:
        return await self._request("PATCH", f"/users/me/orders/{order_id}/delay", json={"days": days})

    async def skip_order(self, order_id: str | int) -> dict[str, Any]:
        return await self._request("PATCH", f"/users/me/orders/{order_id}/skip", json={})

    async def check_schedule(self, order_id: str | int, dispatch_on: str) -> dict[str, Any]:
        return await self._request("GET", f"/users/me/orders/{order_id}/scheduler", params={"dispatch_on": dispatch_on})

    async def reschedule_order(self, order_id: str | int, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("PATCH", f"/users/me/orders/{order_id}/reschedule", json=payload)

    async def add_order_addons(self, order_id: str | int, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("POST", f"/users/me/orders/{order_id}/order_items", json=payload)

    async def delete_order_addon(self, order_id: str | int, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("DELETE", f"/users/me/orders/{order_id}/order_items/batch_destroy", json=payload)

    async def submit_user_gift_option(self, order_id: str | int, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("PATCH", f"/users/me/orders/{order_id}/gift", json=payload)

    async def get_coffees_ratings(self) -> dict[str, Any]:
        return await self._request("GET", "/users/me/coffee_ratings")

    async def get_rate_last_coffee(self) -> dict[str, Any]:
        return await self._request("GET", "/users/me/coffee_ratings/last_coffee")

    async def rate_new_coffee(self, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("POST", "/users/me/coffee_ratings", json=payload)

    async def edit_coffee_rating(self, rating_id: str | int, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("PATCH", f"/users/me/coffee_ratings/{rating_id}", json=payload)

    async def rate_recurrables(self, rating_id: str | int) -> dict[str, Any]:
        return await self._request("GET", f"/users/me/coffee_ratings/{rating_id}/recurrables")

    async def whitelist(self, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("POST", "/users/me/coffees/whitelist", json=payload)

    async def always_send(self, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("POST", "/users/me/coffees/always_send", json=payload)

    async def send_email_invites(self, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("POST", "/users/me/invite", json=payload)

    async def referral_stats(self) -> dict[str, Any]:
        return await self._request("GET", "/users/me/referral_stats/")

    async def redeem_voucher(self, code: str, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("POST", f"/vouchers/{code}/redeem", json=payload)

    async def validate_voucher(self, code: str, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("POST", f"/vouchers/{code}/validate", json=payload)

    # Backward-compatible aliases kept from initial implementation
    get_user = get_user_info
    get_order = get_order_details
    get_order_history = get_orders_history

    async def _request(
        self,
        method: str,
        path: str,
        *,
        json: dict[str, Any] | None = None,
        params: dict[str, Any] | None = None,
        auth: bool = True,
    ) -> dict[str, Any]:
        return await self._request_url(
            method,
            f"{self._config.api_root}{path}",
            json=json,
            params=params,
            auth=auth,
        )

    async def _request_base(
        self,
        method: str,
        path: str,
        *,
        json: dict[str, Any] | None = None,
        params: dict[str, Any] | None = None,
        auth: bool = True,
    ) -> dict[str, Any]:
        return await self._request_url(
            method,
            f"{self._config.base_url.rstrip('/')}{path}",
            json=json,
            params=params,
            auth=auth,
        )

    async def _request_url(
        self,
        method: str,
        url: str,
        *,
        json: dict[str, Any] | None,
        params: dict[str, Any] | None,
        auth: bool,
    ) -> dict[str, Any]:
        if auth and not self._token:
            raise ClientConnectionError("No auth token configured")

        headers: dict[str, str] = {"Accept": "application/json"}
        if auth:
            headers["Authorization"] = f"Bearer {self._token}"

        _LOGGER.debug(
            "Pact API request method=%s url=%s params=%s json=%s auth=%s headers=%s",
            method,
            url,
            params,
            json,
            auth,
            headers,
        )
        async with self._session.request(
            method,
            url,
            headers=headers,
            json=json,
            params=params,
            timeout=self._config.timeout_seconds,
        ) as response:
            response_body = await response.text()
            _LOGGER.debug(
                "Pact API response method=%s url=%s status=%s content_type=%s body=%s",
                method,
                url,
                response.status,
                response.content_type,
                response_body,
            )
            return await self._parse_response(response, response_body)

    async def _parse_response(self, response: ClientResponse, body: str | None = None) -> dict[str, Any]:
        if body is None:
            body = await response.text()
        if response.status >= 400:
            raise ClientConnectionError(f"Unexpected error code {response.status}: {body}")
        if response.content_type == "application/json":
            try:
                return await response.json(content_type=None)
            except Exception:
                return {"raw": body}
        return {"raw": body}
