"""The pact integration."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import timedelta
import logging
from typing import Any

from aiohttp.client_exceptions import ClientConnectionError
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers import aiohttp_client
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator

from .pact.asyncio_api import PactAsyncioApi

_LOGGER = logging.getLogger(__name__)

# TODO List the platforms that you want to support.
# For your initial PR, limit it to 1 platform.
PLATFORMS: list[Platform] = [Platform.DATE]

@dataclass
class PactCoordinatorData:
    recurrables: list[dict[str, Any]]
    recurrables_dict: dict[str, dict[str, Any]]


# type MyCoordinator = DataUpdateCoordinator[PactCoordinatorData]


@dataclass
class PactRuntimeData:
    coordinator: DataUpdateCoordinator[PactCoordinatorData]
    client: PactAsyncioApi


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

    session = aiohttp_client.async_get_clientsession(hass, verify_ssl=False)
    api = PactAsyncioApi(session)

    async def _login() -> None:
        await api.login(entry.data["username"], entry.data["password"])

    await _login()

    async def perform_update():
        try:
            recurrables_response = await api.get_recurrables()
        except ClientConnectionError:
            await _login()
            recurrables_response = await api.get_recurrables()

        if isinstance(recurrables_response, list):
            recurrables = recurrables_response
        else:
            recurrables = recurrables_response.get("recurrables", [])

        return PactCoordinatorData(
            recurrables=recurrables,
            recurrables_dict={str(r["id"]): r for r in recurrables if isinstance(r, dict) and "id" in r},
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
