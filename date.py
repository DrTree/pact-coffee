"""Date platform for Pact Coffee orders."""

from __future__ import annotations

from datetime import date
import logging
from typing import Any

from homeassistant.components.date import DateEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers import entity_platform
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity, DataUpdateCoordinator

from . import DOMAIN, PactConfigEntry, PactCoordinatorData
from .api_v3 import async_order_asap, async_reschedule_order

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    config_entry: PactConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up entry."""
    coordinator: DataUpdateCoordinator[PactCoordinatorData] = config_entry.runtime_data.coordinator
    platform = entity_platform.async_get_current_platform()
    platform.async_register_entity_service("asap", {}, "async_dispatch_asap")

    entities = [
        PactDeliveryDate(name, coordinator, config_entry)
        for name in coordinator.data.recurrables_by_name
    ]
    async_add_entities(entities, True)


class PactDeliveryDate(
    CoordinatorEntity[DataUpdateCoordinator[PactCoordinatorData]], DateEntity
):
    """Entity implementation for next delivery date."""

    def __init__(
        self,
        name: str,
        coordinator: DataUpdateCoordinator[PactCoordinatorData],
        config_entry: PactConfigEntry,
    ) -> None:
        super().__init__(coordinator)
        self._name = name
        self._config_entry = config_entry
        recurrable = coordinator.data.recurrables_by_name[name]
        self._attr_unique_id = str(recurrable.get("id"))
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, str(recurrable.get("id")))},
            name=self.name,
        )

    @property
    def name(self) -> str:
        """Name."""
        return f"Pact Delivery {self._name}"

    @property
    def native_value(self) -> date | None:
        """Return next dispatch date."""
        recurrable = self.coordinator.data.recurrables_by_name.get(self._name)
        if not recurrable:
            return None
        dispatch_on = recurrable.get("current_order", {}).get("dispatch_on")
        if not dispatch_on:
            return None
        return date.fromisoformat(dispatch_on)

    async def async_set_value(self, value: date) -> None:
        """Update the current value."""
        recurrable = self.coordinator.data.recurrables_by_name[self._name]
        order_id = str(recurrable["current_order"]["id"])
        await async_reschedule_order(
            self._config_entry.runtime_data.session,
            self._config_entry.runtime_data.token,
            order_id,
            value.isoformat(),
        )
        await self.coordinator.async_refresh()

    async def async_dispatch_asap(self) -> None:
        """Dispatch this order ASAP."""
        recurrable = self.coordinator.data.recurrables_by_name[self._name]
        order_id = str(recurrable["current_order"]["id"])
        await async_order_asap(
            self._config_entry.runtime_data.session,
            self._config_entry.runtime_data.token,
            order_id,
        )
        await self.coordinator.async_refresh()
