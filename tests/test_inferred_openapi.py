import json
import unittest
from pathlib import Path


class TestInferredOpenApi(unittest.TestCase):
    def test_inferred_spec_is_valid_json_and_has_v3_paths(self):
        data = json.loads(Path('docs/pact_v3_inferred_openapi.json').read_text())
        self.assertEqual(data['openapi'], '3.0.3')
        self.assertIn('paths', data)
        self.assertGreaterEqual(len(data['paths']), 40)
        self.assertIn('/tokens', data['paths'])
        self.assertIn('/users/me/orders/history', data['paths'])


if __name__ == '__main__':
    unittest.main()
