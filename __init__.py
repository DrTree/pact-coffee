"""The pact integration."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import timedelta
import logging

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers import aiohttp_client
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator

from .pact.api import PactApiClient
from .pact.model import Recurable

_LOGGER = logging.getLogger(__name__)

# TODO List the platforms that you want to support.
# For your initial PR, limit it to 1 platform.
PLATFORMS: list[Platform] = [Platform.DATE]

# TODO: Import this
DOMAIN = "pact_coffee"


@dataclass
class PactCoordinatorData:
    recurrables: list[Recurable]
    reccurables_dict: dict[str, Recurable]


# type MyCoordinator = DataUpdateCoordinator[PactCoordinatorData]


@dataclass
class PactRuntimeData:
    coordinator: DataUpdateCoordinator[PactCoordinatorData]
    client: PactApiClient


# TODO Create ConfigEntry type alias with API object
# TODO Rename type alias and update all entry annotations
type PactConfigEntry = ConfigEntry[PactRuntimeData]  # noqa: F821


# TODO Update entry annotation
async def async_setup_entry(hass: HomeAssistant, entry: PactConfigEntry) -> bool:
    """Set up pact from a config entry."""

    # TODO 1. Create API instance
    # TODO 2. Validate the API connection (and authentication)
    # TODO 3. Store an API object for your platforms to access
    # entry.runtime_data = MyAPI(...)

    _LOGGER.info(entry.data)
    session = aiohttp_client.async_get_clientsession(hass, verify_ssl=False)
    api = PactApiClient(session, entry.data["username"], entry.data["password"])
    await api.get_token()

    async def perform_update():
        recurrables = await api.recurrables()
        return PactCoordinatorData(
            recurrables=recurrables, reccurables_dict={r.name: r for r in recurrables}
        )

    # async def handle_service_asap(call):
    #     """."""
    #     return True

    # hass.services.async_register(DOMAIN, "asap", handle_service_asap)

    coordinator = DataUpdateCoordinator[PactCoordinatorData](
        hass=hass, logger=_LOGGER, name="pact_coffee", update_method=perform_update,
        update_interval=timedelta(minutes=10)
    )
    await coordinator.async_config_entry_first_refresh()
    entry.runtime_data = PactRuntimeData(coordinator=coordinator, client=api)
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    return True


# TODO Update entry annotation
async def async_unload_entry(hass: HomeAssistant, entry: PactConfigEntry) -> bool:
    """Unload a config entry."""
    return await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
