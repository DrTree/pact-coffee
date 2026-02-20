from __future__ import annotations

import logging
from typing import Any

from homeassistant.components.button import ButtonEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import (
    CoordinatorEntity,
    DataUpdateCoordinator,
)

from . import PactConfigEntry, PactCoordinatorData
from .const import DOMAIN
from .date import _is_recurrable_active
from .pact.asyncio_api import PactAsyncioApi

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    config_entry: PactConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up button entities for each active recurrable."""
    del hass
    coordinator: DataUpdateCoordinator[PactCoordinatorData] = (
        config_entry.runtime_data.coordinator
    )
    entities = [
        PactDeliveryAsapButton(
            str(recurrable.get("id")),
            str(recurrable.get("name", recurrable.get("id"))),
            coordinator,
            config_entry.runtime_data.client,
        )
        for recurrable in coordinator.data.recurrables_dict.values()
        if _is_recurrable_active(recurrable)
    ]
    async_add_entities(entities, True)


class PactDeliveryAsapButton(
    CoordinatorEntity[DataUpdateCoordinator[PactCoordinatorData]], ButtonEntity
):
    """ASAP dispatch button for a Pact recurrable."""

    _attr_has_entity_name = True
    _attr_name = "ASAP"
    _api: PactAsyncioApi

    def __init__(
        self,
        recurrable_id: str,
        name: str,
        coordinator: DataUpdateCoordinator[PactCoordinatorData],
        api: PactAsyncioApi,
        context: Any = None,
    ) -> None:
        super().__init__(coordinator, context)
        self._id = recurrable_id
        self._api = api
        self._attr_unique_id = f"{recurrable_id}_asap"
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, recurrable_id)},
            name=f"Pact Delivery {name}",
        )

    async def async_press(self) -> None:
        """Send the next order for this device as soon as possible."""
        recurrable = self.coordinator.data.recurrables_dict.get(self._id, {})
        current_order = recurrable.get("current_order") or {}
        order_id = current_order.get("id")
        if order_id is None:
            _LOGGER.debug("No current order for recurrable %s; skipping ASAP", self._id)
            return
        await self._api.asap_order(order_id)
        await self.coordinator.async_refresh()
