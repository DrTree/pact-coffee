# Troubleshooting

## Codex PR update error

If you see this message:

> "Codex does not currently support updating PRs that are updated outside of Codex. For now, please create a new PR."

Use this workflow:

1. Keep your latest commits on your current branch.
2. Create a **new PR** instead of trying to update the old one.
3. In the new PR description, reference the superseded PR and summarize what changed since then.
4. Close the old PR after the new one is opened and verified.

### Why this works

Codex can reliably create a new PR from current branch state, but it may fail to mutate PR metadata when that PR has been changed by external tooling/UI.

### Suggested PR note template

- "Supersedes #<old_pr_number> due to Codex PR update limitation."
- "Includes all prior commits plus the latest fixes in commit `<sha>`."
