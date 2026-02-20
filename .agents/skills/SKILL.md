---
name: home-assistant-integration-debug
description: Debug Home Assistant custom integrations in a local development checkout. Use when Codex needs to reproduce integration issues, run Home Assistant against a local dev config, inspect runtime errors, or validate fixes from logs. Trigger for requests about Home Assistant integration startup failures, config flow issues, entity setup/runtime exceptions, or "why is this custom integration failing?" style debugging.
---

# Home Assistant Integration Debug Workflow

1. Confirm the project virtual environment exists at `.venv/` and use it for all Home Assistant runs.
2. Start Home Assistant from the repository root with:
   ```bash
   python -m homeassistant --config ./.dev_config
   ```
3. Observe failures and warnings in real time from the console output.
4. If console output is incomplete or the process already exited, inspect log file output with:
   ```bash
   tail -n 200 ./.dev_config/home-assistant.log
   tail -f ./.dev_config/home-assistant.log
   ```
5. Reproduce the issue before editing code, then make the minimal fix.
6. Restart Home Assistant with the same command and confirm the error no longer appears in console/logs.
7. Report the exact traceback or log lines that changed and what code change resolved them.

# Execution Notes

- You may find that the python logs are blank - this means home assistant didn't start.
- As a last resort you can ask the user to run the server and tail the logs.
- Run commands from the integration repository root so relative paths resolve correctly.
- Prefer the same interpreter/environment for every rerun to avoid inconsistent behavior.
- Keep debugging loop tight: reproduce -> inspect logs -> patch -> rerun -> verify.

Once you have obtained new logs check to see if there are any new test cases you can build based on the new information. If so, add them to the test suite to prevent regressions. Be aware of PII in the logs and redact as necessary.
Ignore /v3/tokens as thsi always contains sensitve information.
