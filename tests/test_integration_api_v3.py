import unittest

from aiohttp.client_exceptions import ClientConnectionError

from api_v3 import (
    API_BASE_URL,
    API_VERSION,
    async_authenticate,
    async_fetch_recurrables,
    async_order_asap,
    async_reschedule_order,
)


class FakeResponse:
    def __init__(self, status=200, payload=None, text='error'):
        self.status = status
        self._payload = payload or {}
        self._text = text

    async def json(self):
        return self._payload

    async def text(self):
        return self._text


class FakeCtx:
    def __init__(self, response):
        self.response = response

    async def __aenter__(self):
        return self.response

    async def __aexit__(self, exc_type, exc, tb):
        return False


class FakeSession:
    def __init__(self, response):
        self.response = response
        self.calls = []

    def post(self, url, **kwargs):
        self.calls.append(('POST', url, kwargs))
        return FakeCtx(self.response)

    def request(self, method, url, **kwargs):
        self.calls.append((method, url, kwargs))
        return FakeCtx(self.response)


class TestIntegrationApiV3(unittest.IsolatedAsyncioTestCase):
    async def test_async_authenticate_success(self):
        session = FakeSession(FakeResponse(payload={'token': {'id': 'token123'}}))
        token = await async_authenticate(session, 'user', 'pass')
        self.assertEqual(token, 'token123')
        method, url, kwargs = session.calls[0]
        self.assertEqual(method, 'POST')
        self.assertEqual(url, f'{API_BASE_URL}/{API_VERSION}/tokens')
        self.assertEqual(kwargs['json'], {'email': 'user', 'password': 'pass'})

    async def test_async_authenticate_failure(self):
        session = FakeSession(FakeResponse(status=401))
        with self.assertRaises(ClientConnectionError):
            await async_authenticate(session, 'user', 'pass')

    async def test_fetch_and_order_endpoints(self):
        recurrables = [{'id': '1', 'name': 'Main', 'current_order': {'id': '88'}, 'current_state': 'active'}]
        session = FakeSession(FakeResponse(payload=recurrables))
        token = 'abc'

        got = await async_fetch_recurrables(session, token)
        self.assertEqual(got, recurrables)

        await async_order_asap(session, token, '88')
        await async_reschedule_order(session, token, '88', '2026-03-04')

        urls = [c[1] for c in session.calls]
        self.assertIn(f'{API_BASE_URL}/{API_VERSION}/users/me/recurrables', urls)
        self.assertIn(f'{API_BASE_URL}/{API_VERSION}/users/me/orders/88/asap', urls)
        self.assertIn(f'{API_BASE_URL}/{API_VERSION}/users/me/orders/88/reschedule', urls)


if __name__ == '__main__':
    unittest.main()
