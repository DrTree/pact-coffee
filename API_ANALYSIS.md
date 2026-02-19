# Pact Coffee Front-end API Analysis

This document summarizes the JavaScript bundle/source-map analysis captured under `example_source/` and documents the customer-facing API surface used by the Pact front-end.

## What was collected

- Homepage HTML snapshot: `example_source/index.html`
- Downloaded JavaScript assets referenced by that page: `example_source/assets/js/*` and `example_source/dist/*/index.js`
- Downloaded source maps for distributed bundles: `example_source/dist/*/index.js.map`
- Reconstructed source files extracted from source maps (limited to application `src/` files): `example_source/reconstructed/src/**`
- Collection manifest: `example_source/manifest.json`

> Note: some third-party CDN scripts were blocked in this environment (HTTP tunnel 403), and are listed in `manifest.json` as discovered but not downloaded.

## Main API module discovered

Primary API wrapper source:

- `example_source/reconstructed/src/utils/api/modules/users.js`

Transport helpers:

- `example_source/reconstructed/src/utils/api/modules/generalRequest.js`

Store action call sites:

- `example_source/reconstructed/src/utils/stores/modules/authUser/actions.js`

## API behavior observed

### Host/version behavior

In `users.js`, the front-end uses:

- `DEFAULT_HOST = process.env.API_BASE ? process.env.API_BASE : 'http://127.0.0.1:4000'`
- `DEFAULT_VERSION = 'v3'`
- `v3BaseUrl = ${DEFAULT_HOST}/${DEFAULT_VERSION}`

Authenticated requests add:

- `Authorization: Bearer <token-from-cookie>`

### Authentication

- `POST /tokens` (v3 base URL) via `loginV3(email, password)`
- `DELETE /tokens/me` via `logoutV3()`

### User profile/payment/address

- `GET /users/me`
- `PATCH /users/me`
- `PATCH /users/me/email`
- `PATCH /users/me/password`
- `GET /users/me/payment_cards`
- `GET /users/me/payment_cards/{id}/billing_address`
- `POST /users/me/payment_cards` (comment notes temporary v2 rollback path)
- `GET /users/me/addresses`
- `POST /users/me/addresses`
- `PATCH /users/me/addresses/{id}`
- `DELETE /users/me/addresses/{id}`

### Recurrables (subscriptions)

- `GET /users/me/recurrables/primary`
- `GET /users/me/recurrables/{id}`
- `GET /users/me/recurrables/{id}/tiers`
- `GET /users/me/recurrables/{id}/bag_sizes`
- `GET /users/me/recurrables/{id}/coffee_types`
- `GET /users/me/recurrables/{id}/coffees`
- `PATCH /users/me/recurrables/{id}/name`
- `PATCH /users/me/recurrables/{id}/tier`
- `PATCH /users/me/recurrables/{id}/brew_method`
- `PATCH /users/me/recurrables/{id}/bag_size`
- `PATCH /users/me/recurrables/{id}/coffee_type`
- `PATCH /users/me/recurrables/{id}/frequency`
- `PATCH /users/me/recurrables/{id}/address`
- `GET /users/me/recurrables/switch_list`
- `GET /users/me/recurrables/paused`
- `PATCH /users/me/recurrables/{id}/pause`
- `PATCH /users/me/recurrables/{id}/unpause`
- `PATCH /users/me/recurrables/{id}/cancel`
- `GET /users/me/recurrables/{id}/retention_plans`
- `PATCH /users/me/recurrables/{id}/coffee_plan_amount`
- `PATCH /users/me/recurrables/{id}/coffee_plan_tier`
- `POST /users/me/recurrables`

### Orders

- `GET /users/me/orders/history` (optional year query)
- `GET /users/me/orders/{id}`
- `PATCH /users/me/orders/{order_id}/asap`
- `PATCH /users/me/orders/{id}/delay`
- `PATCH /users/me/orders/{order_id}/skip`
- `GET /users/me/orders/{id}/scheduler?dispatch_on=...`
- `PATCH /users/me/orders/{order_id}/reschedule`
- `PATCH /users/me/orders/{order_id}/order_items/{item_id}`
- `POST /users/me/orders/{order_id}/order_items`
- `DELETE /users/me/orders/{order_id}/order_items/batch_destroy`
- `PATCH /users/me/orders/{id}/gift`

### Coffee ratings / preferences

- `GET /users/me/coffee_ratings`
- `GET /users/me/coffee_ratings/last_coffee`
- `POST /users/me/coffee_ratings`
- `PATCH /users/me/coffee_ratings/{id}`
- `GET /users/me/coffee_ratings/{id}/recurrables`
- `POST /users/me/coffees/whitelist`
- `POST /users/me/coffees/always_send`

### Voucher / referral / identity

- `POST /vouchers/{code}/redeem`
- `POST /vouchers/{code}/validate`
- `POST /users/me/invite`
- `GET /users/me/referral_stats/`
- `POST /users/claim`

### Checkout / acquisition flows

- `POST /users/me/basket`
- `POST /users/me/basket/express`
- `POST /users/me/recurrables/express`
- `POST /users/d2c/funnel`
- `POST /users/d2c/store`

## Python implementation in this repository

A new asyncio-first client has been added at `pact/asyncio_api.py`. It mirrors the analyzed v3 user/recurrable/order API routes, uses bearer token auth, and provides a small typed facade around common operations.

