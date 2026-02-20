import unittest

from aiohttp.client_exceptions import ClientConnectionError

from api_v3 import (
    API_V3_BASE_URL,
    _build_url,
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


class TestUrlBuilder(unittest.TestCase):
    def test_build_url_normalizes_slashes(self):
        expected = f"{API_V3_BASE_URL.rstrip('/')}/tokens"
        self.assertEqual(_build_url('tokens'), expected)
        self.assertEqual(_build_url('/tokens'), expected)


class TestIntegrationApiV3(unittest.IsolatedAsyncioTestCase):
    async def test_async_authenticate_success(self):
        session = FakeSession(FakeResponse(payload={'token': {'id': 'token123'}}))
        token = await async_authenticate(session, 'user', 'pass')
        self.assertEqual(token, 'token123')
        method, url, kwargs = session.calls[0]
        self.assertEqual(method, 'POST')
        self.assertEqual(url, f'{API_V3_BASE_URL.rstrip('/')}/tokens')
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
        base = API_V3_BASE_URL.rstrip('/')
        self.assertIn(f'{base}/users/me/recurrables/switch_list', urls)
        self.assertIn(f'{base}/users/me/orders/88/asap', urls)
        self.assertIn(f'{base}/users/me/orders/88/reschedule', urls)


if __name__ == '__main__':
    unittest.main()
