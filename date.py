from datetime import date
import logging
from typing import Any

from homeassistant.helpers.device_registry import DeviceInfo

from .pact.api import PactApiClient
from homeassistant.components.date import DateEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import (
    CoordinatorEntity,
    DataUpdateCoordinator,
)
from homeassistant.helpers import config_validation as cv, entity_platform, service

from . import PactConfigEntry, PactCoordinatorData
from . import DOMAIN

_LOGGER = logging.getLogger(__name__)


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
        PactDeliveryDate(k, v.id, coordinator, config_entry.runtime_data.client)
        for k, v in coordinator.data.reccurables_dict.items()
        if v.active
    ]
    async_add_entities(d, True)
    _LOGGER.debug("Finished platform setup")


class PactDeliveryDate(
    CoordinatorEntity[DataUpdateCoordinator[PactCoordinatorData]], DateEntity
):
    """Entity implementation for the delivery date of next order."""

    # Implement one of these methods.
    _api: PactApiClient

    # TODO: Pass in the coordinator and pass on to the super
    def __init__(
        self,
        name: str,
        id: str,
        coordinator: DataUpdateCoordinator[PactCoordinatorData],
        api: PactApiClient,
        context: Any = None,
    ) -> None:
        """Init..."""
        _LOGGER.debug(f"Starting inner setup for {name} - {id}")
        super().__init__(coordinator, context)
        self._attr_unique_id = id
        self._name = name
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
        recurrable = self.coordinator.data.reccurables_dict[self._name]
        return recurrable.current_order.dispatch_on

    async def async_dispatch_asap(self, **kwargs: Any) -> None:
        """."""
        recurrable = self.coordinator.data.reccurables_dict[self._name]
        orderId = recurrable.current_order.id
        await self._api.asap(recurrable)
        await self.coordinator.async_refresh()
        return True

    async def async_set_value(self, value: date) -> None:
        """Update the current value."""
        recurrable = self.coordinator.data.reccurables_dict[self._name]
        await self._api.update_delivery_date(recurrable, value)
        await self.coordinator.async_refresh()
