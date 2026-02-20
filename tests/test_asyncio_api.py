import unittest

from aiohttp.client_exceptions import ClientConnectionError

from pact.asyncio_api import PactAsyncConfig, PactAsyncioApi


class FakeResponse:
    def __init__(self, status=200, payload=None, content_type="application/json"):
        self.status = status
        self._payload = payload or {}
        self.content_type = content_type

    async def json(self):
        return self._payload

    async def text(self):
        return str(self._payload)


class FakeRequestCtx:
    def __init__(self, response):
        self._response = response

    async def __aenter__(self):
        return self._response

    async def __aexit__(self, exc_type, exc, tb):
        return False


class FakeSession:
    def __init__(self, response):
        self.response = response
        self.calls = []

    def request(self, method, url, **kwargs):
        self.calls.append((method, url, kwargs))
        return FakeRequestCtx(self.response)


class TestPactAsyncioApi(unittest.IsolatedAsyncioTestCase):
    async def test_login_uses_v3_tokens_and_sets_token(self):
        session = FakeSession(FakeResponse(payload={"token": {"id": "abc123"}}))
        api = PactAsyncioApi(session=session, config=PactAsyncConfig(base_url="https://api.pactcoffee.com"))

        result = await api.login_v3("a@b.com", "pw")

        self.assertEqual(result["token"]["id"], "abc123")
        method, url, kwargs = session.calls[0]
        self.assertEqual(method, "POST")
        self.assertEqual(url, "https://api.pactcoffee.com/v3/tokens")
        self.assertEqual(kwargs["json"], {"email": "a@b.com", "password": "pw"})

    async def test_update_user_card_v3_uses_base_url_not_v3(self):
        session = FakeSession(FakeResponse(payload={"ok": True}))
        api = PactAsyncioApi(session=session, token="tok")

        await api.update_user_card_v3({"token": "card"})

        _, url, kwargs = session.calls[0]
        self.assertEqual(url, "https://api.pactcoffee.com/users/me/payment_cards")
        self.assertEqual(kwargs["headers"]["Authorization"], "Bearer tok")

    async def test_missing_token_raises(self):
        session = FakeSession(FakeResponse(payload={"ok": True}))
        api = PactAsyncioApi(session=session)

        with self.assertRaises(ClientConnectionError):
            await api.get_user_info_v3()

    async def test_v3_order_and_recurrable_paths_match_frontend(self):
        session = FakeSession(FakeResponse(payload={"ok": True}))
        api = PactAsyncioApi(session=session, token="tok")

        await api.get_recurrables_switch_list_v3()
        await api.check_schedule_v3(12, "2026-02-03")
        await api.delete_order_addon_v3(88, {"ids": [1, 2]})

        urls = [call[1] for call in session.calls]
        self.assertIn("https://api.pactcoffee.com/v3/users/me/recurrables/switch_list", urls)
        self.assertIn("https://api.pactcoffee.com/v3/users/me/orders/12/scheduler", urls)
        self.assertIn("https://api.pactcoffee.com/v3/users/me/orders/88/order_items/batch_destroy", urls)


if __name__ == "__main__":
    unittest.main()
