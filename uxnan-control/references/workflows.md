# Workflows

Recipes over the `read`, `ui`, `create` and `converse` groups. Every example uses `--json` and reads the
exit status; the MCP tool form is the same entry with the same arguments.

## Check the app before anything else

```sh
uxnan-cli status --json
```

- exit 3 → not running (or its window is not up yet); tell the person, stop.
- exit 4 → the app predates the control surface or speaks another protocol; tell
  the person to update, stop.
- `.groups[]` says which capability groups are enabled; `.caller.kind` is
  `launch` (you are inside a Uxnan terminal — `current` works) or `control`.

## Find your own place (inside a Uxnan terminal)

```sh
uxnan-cli terminal show current --json     # your tab: id, title, workspace, agent state
uxnan-cli worktree show current --json     # the worktree you run in, its branch, its project
uxnan-cli project show current --json
```

From another shell there is no `current`: list and pick.

```sh
uxnan-cli project ls --json | jq -r '.projects[] | "\(.name)\t\(.path)"'
uxnan-cli worktree ls --project name:uxnan --json
```

## Tell which agents are busy, and where

```sh
uxnan-cli agent ls --json
# .agents[]: terminalId, kind (claude/codex/…), status (working|waiting|blocked|done), tool, cwd
uxnan-cli terminal ls --worktree branch:feat/x --json   # tabs of one worktree, with .agent when one runs there
```

`status` is the state the agent's own hooks reported — precise, not inferred
from output.

## Show the person something

```sh
uxnan-cli file diff src/app.ts --worktree branch:feat/x      # the Changes view of that file
uxnan-cli file diff src/app.ts --worktree current --staged   # the staged diff instead
uxnan-cli file open README.md --worktree path:/home/dev/app  # the editor tab
uxnan-cli terminal reveal id:<terminalId>                    # bring a tab forward
uxnan-cli app focus                                          # the window itself
```

A relative `path` needs a worktree (`current` by default); an absolute path must
lie inside a registered worktree — anything else is exit 2, and a file that does
not exist is exit 7.

## Preview what you built

```sh
uxnan-cli browser status --json          # is a page open, where, how opens are routed
uxnan-cli browser open http://localhost:3000
uxnan-cli browser reload                 # after changing code
```

Opens follow the person's link policy (in-app, system browser, or ask).

## Talk to a running agent: send, wait, read

```sh
uxnan-cli agent send --to id:<terminalId> --message-file next-step.md --json   # queued until the agent is free
uxnan-cli agent wait --to id:<terminalId> --for idle --timeout 900             # heartbeats on stderr, result on stdout
uxnan-cli terminal read id:<terminalId> --lines 60                             # its screen, secrets redacted
```

`--force` on `send` types the message now and interrupts the agent — rare.
`wait --for waiting` returns when the agent stopped to ask the person
something (answer it with another `send`); `--for exit` when its terminal is
gone. Exit 6 is the timeout; exit 5 on `read` means the project switched
reads off.

## Give a subtask its own space

```sh
uxnan-cli worktree create --project current --branch feat/sub --agent claude \
  --prompt-file task.md --idempotency-key "$(uuidgen)" --json
# → receipt: the worktree, and .terminal.id of the launched agent; retry with the same key is safe
uxnan-cli terminal create --worktree branch:feat/sub --title build --json
uxnan-cli run start <run-id> --json
```

## Read an orchestration run

```sh
uxnan-cli run ls --json
uxnan-cli run show <run-id> --json       # steps with kind, target, dependsOn, status, output
```

If you are a step of a run yourself, report through the MCP tool
`orchestration_report_result` (agentId = your `UXNAN_AGENT_ID`) — the CLI form is
`uxnan-cli rpc orchestration/reportResult --params '{"agentId":"…","result":"…"}'`.

## Reach any entry

```sh
uxnan-cli rpc worktree/show --params '{"worktree":"branch:main"}' --json
uxnan-cli skills get control --full      # the full reference, generated from the catalog
```
