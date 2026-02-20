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

    async def login_v3(self, email: str, password: str) -> dict[str, Any]:
        data = await self._request("POST", "/tokens", json={"email": email, "password": password}, auth=False)
        token = data.get("token", {}).get("id")
        if token:
            self._token = token
        return data

    async def logout_v3(self) -> dict[str, Any]:
        return await self._request("DELETE", "/tokens/me")

    async def get_user_info_v3(self) -> dict[str, Any]:
        return await self._request("GET", "/users/me")

    async def update_user_info_v3(self, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("PATCH", "/users/me", json=payload)

    async def update_user_email_v3(self, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("PATCH", "/users/me/email", json=payload)

    async def update_user_password_v3(self, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("PATCH", "/users/me/password", json=payload)

    async def get_cards_v3(self) -> dict[str, Any]:
        return await self._request("GET", "/users/me/payment_cards")

    async def get_card_address_v3(self, card_id: str | int) -> dict[str, Any]:
        return await self._request("GET", f"/users/me/payment_cards/{card_id}/billing_address")

    async def update_user_card_v3(self, payload: dict[str, Any]) -> dict[str, Any]:
        # Kept aligned with front-end behavior: this path is still requested without explicit v3 base.
        return await self._request_base("POST", "/users/me/payment_cards", json=payload)

    async def get_addresses_v3(self) -> dict[str, Any]:
        return await self._request("GET", "/users/me/addresses")

    async def create_address_v3(self, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("POST", "/users/me/addresses", json=payload)

    async def edit_address_v3(self, address_id: str | int, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("PATCH", f"/users/me/addresses/{address_id}", json=payload)

    async def delete_address_v3(self, address_id: str | int, payload: dict[str, Any] | None = None) -> dict[str, Any]:
        return await self._request("DELETE", f"/users/me/addresses/{address_id}", json=payload or {})

    async def get_primary_recurrable_v3(self) -> dict[str, Any]:
        return await self._request("GET", "/users/me/recurrables/primary")

    async def get_recurrables_v3(self) -> dict[str, Any]:
        return await self._request("GET", "/users/me/recurrables")

    async def get_recurrable_by_id_v3(self, recurrable_id: str | int) -> dict[str, Any]:
        return await self._request("GET", f"/users/me/recurrables/{recurrable_id}")

    async def get_recurrables_switch_list_v3(self) -> dict[str, Any]:
        return await self._request("GET", "/users/me/recurrables/switch_list")

    async def get_paused_recurrables_v3(self) -> dict[str, Any]:
        return await self._request("GET", "/users/me/recurrables/paused")

    async def get_recurrable_tiers_v3(self, recurrable_id: str | int) -> dict[str, Any]:
        return await self._request("GET", f"/users/me/recurrables/{recurrable_id}/tiers")

    async def get_recurrable_sizes_v3(self, recurrable_id: str | int) -> dict[str, Any]:
        return await self._request("GET", f"/users/me/recurrables/{recurrable_id}/bag_sizes")

    async def get_recurrable_coffee_types_v3(self, recurrable_id: str | int) -> dict[str, Any]:
        return await self._request("GET", f"/users/me/recurrables/{recurrable_id}/coffee_types")

    async def get_recurrable_coffees_v3(self, recurrable_id: str | int) -> dict[str, Any]:
        return await self._request("GET", f"/users/me/recurrables/{recurrable_id}/coffees")

    async def update_recurrable_name_v3(self, recurrable_id: str | int, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("PATCH", f"/users/me/recurrables/{recurrable_id}/name", json=payload)

    async def update_recurrable_tier_v3(self, recurrable_id: str | int, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("PATCH", f"/users/me/recurrables/{recurrable_id}/tier", json=payload)

    async def update_recurrable_brew_method_v3(self, recurrable_id: str | int, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("PATCH", f"/users/me/recurrables/{recurrable_id}/brew_method", json=payload)

    async def update_recurrable_size_v3(self, recurrable_id: str | int, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("PATCH", f"/users/me/recurrables/{recurrable_id}/bag_size", json=payload)

    async def update_recurrable_coffee_type_v3(self, recurrable_id: str | int, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("PATCH", f"/users/me/recurrables/{recurrable_id}/coffee_type", json=payload)

    async def update_recurrable_frequency_v3(self, recurrable_id: str | int, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("PATCH", f"/users/me/recurrables/{recurrable_id}/frequency", json=payload)

    async def update_recurrable_address_v3(self, recurrable_id: str | int, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("PATCH", f"/users/me/recurrables/{recurrable_id}/address", json=payload)

    async def pause_recurrable_v3(self, recurrable_id: str | int, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("PATCH", f"/users/me/recurrables/{recurrable_id}/pause", json=payload)

    async def unpause_recurrable_v3(self, recurrable_id: str | int) -> dict[str, Any]:
        return await self._request("PATCH", f"/users/me/recurrables/{recurrable_id}/unpause", json={})

    async def cancel_recurrable_v3(self, recurrable_id: str | int, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("PATCH", f"/users/me/recurrables/{recurrable_id}/cancel", json=payload)

    async def get_retention_plans_v3(self, recurrable_id: str | int) -> dict[str, Any]:
        return await self._request("GET", f"/users/me/recurrables/{recurrable_id}/retention_plans")

    async def update_cancel_pause_flow_plan_amount_v3(
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

    async def update_cancel_pause_flow_plan_tier_v3(
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

    async def create_recurrable_v3(self, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("POST", "/users/me/recurrables", json=payload)

    async def available_product_addons_v3(self, recurrable_id: str | int) -> dict[str, Any]:
        return await self._request("GET", f"/users/me/recurrables/{recurrable_id}/addons")

    async def add_addons_v3(self, recurrable_id: str | int, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("POST", f"/users/me/recurrables/{recurrable_id}/recurrable_addons", json=payload)

    async def update_addons_v3(self, recurrable_id: str | int, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("PATCH", f"/users/me/recurrables/{recurrable_id}/recurrable_addons", json=payload)

    async def delete_addon_v3(self, recurrable_id: str | int, addon_id: str | int) -> dict[str, Any]:
        return await self._request("DELETE", f"/users/me/recurrables/{recurrable_id}/recurrable_addons/{addon_id}", json={})

    async def get_order_details_v3(self, order_id: str | int) -> dict[str, Any]:
        return await self._request("GET", f"/users/me/orders/{order_id}")

    async def get_orders_history_v3(self, year: int | None = None) -> dict[str, Any]:
        params = {"year": year} if year is not None else None
        return await self._request("GET", "/users/me/orders/history", params=params)

    async def update_order_item_v3(self, order_id: str | int, item_id: str | int, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("PATCH", f"/users/me/orders/{order_id}/order_items/{item_id}", json=payload)

    async def asap_order_v3(self, order_id: str | int) -> dict[str, Any]:
        return await self._request("PATCH", f"/users/me/orders/{order_id}/asap", json={})

    async def delay_order_v3(self, order_id: str | int, days: int) -> dict[str, Any]:
        return await self._request("PATCH", f"/users/me/orders/{order_id}/delay", json={"days": days})

    async def skip_order_v3(self, order_id: str | int) -> dict[str, Any]:
        return await self._request("PATCH", f"/users/me/orders/{order_id}/skip", json={})

    async def check_schedule_v3(self, order_id: str | int, dispatch_on: str) -> dict[str, Any]:
        return await self._request("GET", f"/users/me/orders/{order_id}/scheduler", params={"dispatch_on": dispatch_on})

    async def reschedule_order_v3(self, order_id: str | int, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("PATCH", f"/users/me/orders/{order_id}/reschedule", json=payload)

    async def add_order_addons_v3(self, order_id: str | int, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("POST", f"/users/me/orders/{order_id}/order_items", json=payload)

    async def delete_order_addon_v3(self, order_id: str | int, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("DELETE", f"/users/me/orders/{order_id}/order_items/batch_destroy", json=payload)

    async def submit_user_gift_option_v3(self, order_id: str | int, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("PATCH", f"/users/me/orders/{order_id}/gift", json=payload)

    async def get_coffees_ratings_v3(self) -> dict[str, Any]:
        return await self._request("GET", "/users/me/coffee_ratings")

    async def get_rate_last_coffee_v3(self) -> dict[str, Any]:
        return await self._request("GET", "/users/me/coffee_ratings/last_coffee")

    async def rate_new_coffee_v3(self, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("POST", "/users/me/coffee_ratings", json=payload)

    async def edit_coffee_rating_v3(self, rating_id: str | int, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("PATCH", f"/users/me/coffee_ratings/{rating_id}", json=payload)

    async def rate_recurrables_v3(self, rating_id: str | int) -> dict[str, Any]:
        return await self._request("GET", f"/users/me/coffee_ratings/{rating_id}/recurrables")

    async def whitelist_v3(self, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("POST", "/users/me/coffees/whitelist", json=payload)

    async def always_send_v3(self, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("POST", "/users/me/coffees/always_send", json=payload)

    async def send_email_invites_v3(self, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("POST", "/users/me/invite", json=payload)

    async def referral_stats_v3(self) -> dict[str, Any]:
        return await self._request("GET", "/users/me/referral_stats/")

    async def redeem_voucher(self, code: str, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("POST", f"/vouchers/{code}/redeem", json=payload)

    async def validate_voucher(self, code: str, payload: dict[str, Any]) -> dict[str, Any]:
        return await self._request("POST", f"/vouchers/{code}/validate", json=payload)

    # Backward-compatible aliases kept from initial implementation
    login = login_v3
    logout = logout_v3
    get_user = get_user_info_v3
    get_order = get_order_details_v3
    get_order_history = get_orders_history_v3

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

        headers = {"Accept": "application/json"}
        if auth:
            headers["Authorization"] = f"Bearer {self._token}"

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
