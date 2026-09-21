# Workflows

Recipes over the `read`, `ui`, `create`, `converse` and `orchestrate` groups. Every example uses `--json` and reads the
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

## Coordinate a run of workers (you are the coordinator)

A driven run is a real run in Uxnan's Runs console: the person watches it and can
step in. It stays running until you finish it. The loop:

```sh
R=$(uxnan-cli run create --title "Split the parser work" --json | jq -r .run.id)
uxnan-cli task create --run $R --title "Lexer"  --prompt-file lexer.md --json
uxnan-cli task create --run $R --title "Parser" --prompt-file parser.md --depends-on s1 --json
uxnan-cli task ls --run $R --json                 # s1 ready, s2 pending
uxnan-cli worker start --run $R --task s1 --agent codex --worktree new --unattended --json
uxnan-cli inbox check --run $R --wait --json      # blocks until a message; heartbeats on stderr
```

- `worker start` opens a terminal (in your worktree, in a **new worktree on a new
  branch** with `--worktree new`, or in a given one), launches the agent — any
  installed one: `claude`, `codex`, `opencode`, … — and types the task in behind a
  preamble that tells it its task id, its **dispatch id**, to report exactly once,
  and how to ask you a question. The receipt carries the terminal id: read its
  screen with `terminal read`, wait on it with `agent wait`. **Start a worker
  `--unattended`**: nobody sits at its terminal to click "Allow", so the flag
  launches the CLI in its reviewed automatic mode (Claude Code
  `--permission-mode auto`, Codex `--approve-for-me`); the receipt's
  `unattended` says `applied`, `configured` (the profile already picks a mode)
  or `unsupported` (no such flag — expect to answer its prompts with
  `terminal read` + `agent send --force`). Launches are budgeted: with as many
  agents running as the resource policy allows, `worker start` exits 8 (busy,
  with `live` and `cap`) before creating anything — wait for a `worker_done`
  and try again.
- `inbox check` returns `worker_done` (with the result), `worker_failed` (with
  the error), `question` (answer it) and `status` lines. **Acknowledge** what you
  handled (`--ack <deliveryId>`), or it comes back next time. A worker's
  `worker_done` text is its structured report — pass it on with
  `{{steps.<id>.output}}` in a later task's prompt, or read it here.
- When a `question` arrives (its `stepId` is the question id):
  `uxnan-cli answer --run $R --question s3 --answer "keep the old flag"` — the
  worker waiting on it continues at once. `--reject` tells it not to proceed.
- A task the run should not wait for: `task update --run $R s2 --status skipped`.
- A `--headless <agent>` task needs no worker: the engine runs the agent in print
  mode itself when the task becomes ready and posts `worker_done` with its stdout.
- End with `run finish $R --outcome success --summary "…"`; running workers keep
  their terminals.

Only the task's **current dispatch** can complete it: if you start a worker again
for a task that failed (retry), the old worker's late report is refused.

## Behave as a worker (a coordinator started you)

Your first message is the preamble: your run, task and dispatch ids. Rules:

- Do the task. When done, report **exactly once** with the MCP tool
  `orchestration_report_result` — `agentId` = your `UXNAN_AGENT_ID`, the `taskId`
  and `dispatchId` from the preamble, `outcome` (`success`, `failure` or
  `blocked`) and your result. Without the tools, `uxnan-cli` is on the PATH of
  every terminal Uxnan opens (and named by `$UXNAN_CLI`):
  `uxnan-cli rpc orchestration/reportResult --params '{"agentId":"…","taskId":"s1","dispatchId":"s1.1","outcome":"success","result":"…"}'`.
- A decision you are not entitled to make is the coordinator's:
  `question_ask` (or `uxnan-cli ask --question "…" --option yes --option no`)
  blocks until the answer arrives — do not guess and do not ask a prompt nobody
  reads. The person can answer instead of the coordinator; you get it the same way.
- Do not create your own runs or workers unless the task says so; you are one
  step of someone else's plan.

## Reach any entry

```sh
uxnan-cli rpc worktree/show --params '{"worktree":"branch:main"}' --json
uxnan-cli skills get control --full      # the full reference, generated from the catalog
```

The result of every entry is documented field by field in
`references/catalog.md`; read `--json` output against it rather than guessing a
field's name or whether it may be absent.
