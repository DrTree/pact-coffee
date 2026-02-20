from datetime import date
import logging
from typing import Any

from homeassistant.helpers.device_registry import DeviceInfo

from homeassistant.components.date import DateEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import (
    CoordinatorEntity,
    DataUpdateCoordinator,
)
from homeassistant.helpers import entity_platform

from . import PactConfigEntry, PactCoordinatorData
from .const import DOMAIN
from .pact.asyncio_api import PactAsyncioApi

_LOGGER = logging.getLogger(__name__)


def _is_recurrable_active(recurrable: dict[str, Any]) -> bool:
    """Return whether a recurrable should create an entity."""
    if recurrable.get("active") is True:
        return True
    return str(recurrable.get("current_state", "")).lower() == "active"


async def async_setup_entry(
    hass: HomeAssistant,
    config_entry: PactConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up entry."""
    _LOGGER.debug("Starting platform setup")
    coordinator: DataUpdateCoordinator[PactCoordinatorData] = (
        config_entry.runtime_data.coordinator
    )
    platform = entity_platform.async_get_current_platform()

    platform.async_register_entity_service("asap", {}, "async_dispatch_asap")

    d = [
        PactDeliveryDate(
            str(recurrable.get("id")),
            str(recurrable.get("name", recurrable.get("id"))),
            coordinator,
            config_entry.runtime_data.client,
        )
        for recurrable in coordinator.data.recurrables_dict.values()
        if _is_recurrable_active(recurrable)
    ]
    async_add_entities(d, True)
    _LOGGER.debug("Finished platform setup")


class PactDeliveryDate(
    CoordinatorEntity[DataUpdateCoordinator[PactCoordinatorData]], DateEntity
):
    """Entity implementation for the delivery date of next order."""

    # Implement one of these methods.
    _api: PactAsyncioApi

    # TODO: Pass in the coordinator and pass on to the super
    def __init__(
        self,
        id: str,
        name: str,
        coordinator: DataUpdateCoordinator[PactCoordinatorData],
        api: PactAsyncioApi,
        context: Any = None,
    ) -> None:
        """Init..."""
        _LOGGER.debug(f"Starting inner setup for {name} - {id}")
        super().__init__(coordinator, context)
        self._attr_unique_id = id
        self._name = name
        self._id = id
        self._api = api
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, id)},
            name=self.name,
        )
        _LOGGER.debug(f"Finished inner setup for {name} - {id}")

    @property
    def name(self) -> str:
        """Name."""
        return f"Pact Delivery {self._name}"

    @property
    def native_value(self) -> date | None:
        """Return the value reported by the date."""
        recurrable = self.coordinator.data.recurrables_dict.get(self._id, {})
        current_order = recurrable.get("current_order") or {}
        dispatch_on = current_order.get("dispatch_on")
        if not dispatch_on:
            return None
        if isinstance(dispatch_on, date):
            return dispatch_on
        try:
            return date.fromisoformat(str(dispatch_on).split("T", maxsplit=1)[0])
        except ValueError:
            return None

    async def async_dispatch_asap(self, **kwargs: Any) -> None:
        """."""
        recurrable = self.coordinator.data.recurrables_dict.get(self._id, {})
        current_order = recurrable.get("current_order") or {}
        order_id = current_order.get("id")
        if order_id is None:
            return
        await self._api.asap_order(order_id)
        await self.coordinator.async_refresh()

    async def async_set_value(self, value: date) -> None:
        """Update the current value."""
        recurrable = self.coordinator.data.recurrables_dict.get(self._id, {})
        current_order = recurrable.get("current_order") or {}
        order_id = current_order.get("id")
        if order_id is None:
            return

        payload = {"dispatch_on": value.isoformat()}
        if "amount" in recurrable:
            payload["amount"] = recurrable.get("amount")
        if "coffee_sku" in current_order:
            payload["coffee_sku"] = current_order.get("coffee_sku")
        if "item_id" in current_order:
            payload["item_id"] = current_order.get("item_id")
        payload["order_id"] = order_id

        await self._api.reschedule_order(order_id, payload)
        await self.coordinator.async_refresh()
