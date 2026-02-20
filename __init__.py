"""The pact integration."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import timedelta
import logging
from typing import Any

from aiohttp import ClientSession
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import CONF_PASSWORD, CONF_USERNAME, Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers import aiohttp_client
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator

from .api_v3 import API_BASE_URL, API_VERSION, async_authenticate, async_fetch_recurrables
from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

PLATFORMS: list[Platform] = [Platform.DATE]


@dataclass
class PactCoordinatorData:
    recurrables: list[dict[str, Any]]
    recurrables_by_name: dict[str, dict[str, Any]]


@dataclass
class PactRuntimeData:
    coordinator: DataUpdateCoordinator[PactCoordinatorData]
    session: ClientSession
    token: str


type PactConfigEntry = ConfigEntry[PactRuntimeData]  # noqa: F821


async def async_setup_entry(hass: HomeAssistant, entry: PactConfigEntry) -> bool:
    """Set up pact from a config entry."""
    session = aiohttp_client.async_get_clientsession(hass)
    _LOGGER.debug("Using Pact API base=%s version=%s", API_BASE_URL, API_VERSION)
    token = await async_authenticate(
        session,
        entry.data[CONF_USERNAME],
        entry.data[CONF_PASSWORD],
    )

    async def perform_update() -> PactCoordinatorData:
        recurrables = await async_fetch_recurrables(session, token)
        _LOGGER.debug("Fetched %s recurrables from Pact", len(recurrables))
        active = [r for r in recurrables if r.get("current_state") != "paused" and r.get("current_order")]
        _LOGGER.debug("Active recurrables with current order: %s", len(active))
        by_name = {r["name"]: r for r in active if r.get("name")}
        return PactCoordinatorData(recurrables=active, recurrables_by_name=by_name)

    coordinator = DataUpdateCoordinator[PactCoordinatorData](
        hass=hass,
        logger=_LOGGER,
        name="pact_coffee",
        update_method=perform_update,
        update_interval=timedelta(minutes=10),
    )
    await coordinator.async_config_entry_first_refresh()

    entry.runtime_data = PactRuntimeData(
        coordinator=coordinator,
        session=session,
        token=token,
    )
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: PactConfigEntry) -> bool:
    """Unload a config entry."""
    return await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
