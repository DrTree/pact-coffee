import os
import tempfile
import unittest
from unittest.mock import AsyncMock, patch

import cli


class TestCli(unittest.IsolatedAsyncioTestCase):
    def test_load_dotenv(self):
        with tempfile.TemporaryDirectory() as tmp:
            dotenv = os.path.join(tmp, '.env')
            with open(dotenv, 'w', encoding='utf-8') as f:
                f.write('PACT_USERNAME=user@example.com\nPACT_PASSWORD=secret\n')

            os.environ.pop('PACT_USERNAME', None)
            os.environ.pop('PACT_PASSWORD', None)
            cli.load_dotenv(dotenv)

            self.assertEqual(os.environ['PACT_USERNAME'], 'user@example.com')
            self.assertEqual(os.environ['PACT_PASSWORD'], 'secret')

    async def test_run_cli_missing_credentials(self):
        os.environ.pop('PACT_USERNAME', None)
        os.environ.pop('PACT_PASSWORD', None)
        rc = await cli.run_cli(['recurrables'])
        self.assertEqual(rc, 2)

    async def test_run_cli_recurrables(self):
        os.environ['PACT_USERNAME'] = 'user@example.com'
        os.environ['PACT_PASSWORD'] = 'secret'

        with patch('cli.async_authenticate', new=AsyncMock(return_value='tok')) as auth_mock, \
             patch('cli.async_fetch_recurrables', new=AsyncMock(return_value=[{'id': '1'}])) as rec_mock:
            rc = await cli.run_cli(['recurrables'])

        self.assertEqual(rc, 0)
        auth_mock.assert_awaited()
        rec_mock.assert_awaited()

    async def test_run_cli_reschedule(self):
        os.environ['PACT_USERNAME'] = 'user@example.com'
        os.environ['PACT_PASSWORD'] = 'secret'

        with patch('cli.async_authenticate', new=AsyncMock(return_value='tok')) as auth_mock, \
             patch('cli.async_reschedule_order', new=AsyncMock(return_value={'ok': True})) as reschedule_mock:
            rc = await cli.run_cli(['reschedule', '--order-id', '12', '--dispatch-on', '2026-03-04'])

        self.assertEqual(rc, 0)
        auth_mock.assert_awaited()
        reschedule_mock.assert_awaited()


if __name__ == '__main__':
    unittest.main()
