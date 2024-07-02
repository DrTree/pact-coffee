"""."""

from datetime import date, datetime, timedelta
import logging

from aiohttp import ClientSession
from aiohttp.client_exceptions import ClientConnectionError

from .model import Order, Recurable

_LOGGER = logging.getLogger(__name__)
TOKEN_VALIDITY = timedelta(hours=20)
BASE_URL = "https://api.pactcoffee.com"


class CommunicationClient:
    """."""

    session: ClientSession = None

    def __init__(self, session) -> None:
        self.session = session

    async def patch(self, path: str, data: dict[str, any], token):
        """Inner API PATCH request."""
        async with self.session.patch(
            url=BASE_URL + path,
            headers={"Authorization": f"Bearer {token}"},
            timeout=30,
            json=data,
        ) as response:
            if response.status != 200:
                raise ClientConnectionError(f"Unexpected error code {response.status}")
            json = await response.json()
            _LOGGER.debug(await response.read())
            return json

    async def get(self, path: str, token):
        """Inner API get request."""
        async with self.session.get(
            url=BASE_URL + path,
            headers={"Authorization": f"Bearer {token}"},
            timeout=30,
        ) as response:
            if response.status != 200:
                raise ClientConnectionError(f"Unexpected error code {response.status}")
            json = await response.json()
            _LOGGER.debug(await response.read())
            return json


class TokenStore:
    """."""

    client: CommunicationClient = None

    def __init__(self) -> None:
        self.client = CommunicationClient(self.session)


class PactApiClient:
    """."""

    token: str = None
    username: str = None
    password: str = None
    token_valid_until: datetime = None
    session: ClientSession = None
    client: CommunicationClient = None

    def __init__(
        self,
        session: ClientSession,
        username=None,
        password=None,
    ) -> None:
        """."""
        self.username = username
        self.password = password
        self.session = session
        self.client = CommunicationClient(self.session)

    def set_token(self, token: str, valid_until: datetime | None = None) -> None:
        """."""
        self.token = token
        if valid_until is not None:
            self.token_valid_until = valid_until
        else:
            self.token_valid_until = datetime.now() + TOKEN_VALIDITY

    async def get_token(self, force=False) -> str:
        """Return the current access token or requests a new token."""
        if (
            not force
            and self.token_valid_until is not None
            and self.token_valid_until > datetime.now()
        ):
            _LOGGER.debug("Returning token from cache %s", self.token[:4])
            return self.token
        _LOGGER.debug("Token expired or not set - obtaining new token")
        body = {"email": self.username, "password": self.password}
        async with self.session.post(
            url=BASE_URL + "/v2/tokens", json=body
        ) as response:
            if response.status != 200:
                raise ClientConnectionError(
                    f"Unable to obtain token.\n{response.content}"
                )
            data = await response.json()
            self.set_token(data["token"]["id"])
            _LOGGER.debug("Returning new token %s", self.token[:4])
            return self.token

    async def asap(self, recurrable: Recurable) -> date | None:
        """."""
        if not recurrable.active:
            return None
        _id = recurrable.current_order.id
        new_order_response = await self.client.patch(
            f"/v2/users/me/orders/{_id}/asap", {}, await self.get_token()
        )
        order = Order.from_dict(new_order_response["order"])
        return order.dispatch_on

    async def update_delivery_date(
        self, recurrable: Recurable, new_date: date
    ) -> date | None:
        """."""
        if not recurrable.active:
            return None
        _id = recurrable.current_order.id
        new_order_response = await self.patch(
            f"/v2/users/me/orders/{_id}",
            {
                "amount": recurrable.amount,
                "coffee_sku": recurrable.current_order.coffee_sku,
                "dispatch_on": new_date.strftime("%Y-%m-%d"),
                "item_id": recurrable.current_order.item_id,
                "order_id": recurrable.current_order.id,
            },
            token=await self.get_token(),
        )
        order = Order.from_dict(new_order_response["order"])
        return order.dispatch_on

    async def recurrables(self) -> list[Recurable]:
        """Obrains a list of recurrable subscriptions from the Pact API."""
        response_json = await self.client.get(
            "/v2/users/me/recurrables", token=await self.get_token()
        )
        return [Recurable.from_dict(r) for r in response_json]
