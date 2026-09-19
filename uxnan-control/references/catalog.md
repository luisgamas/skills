# Uxnan control surface (protocol v1)

Operate the running Uxnan Desktop from a shell or from an agent. Two doors to one catalog: MCP tools (available with nothing to install inside every terminal Uxnan launches) and `uxnan-cli` (any shell of the same user).

## Commands

```
uxnan-cli status
uxnan-cli project ls | show <project>
uxnan-cli worktree ls [--project <project>] | show <worktree>
uxnan-cli worktree create --project <project> --branch <name> [--base <ref>] [--from-existing]
                          [--agent <agent>] [--prompt-file <file>] [--idempotency-key <key>]
uxnan-cli terminal ls [--worktree <worktree>] | show <terminal> | reveal <terminal>
uxnan-cli terminal create --worktree <worktree> [--title <t>] [--agent <agent>] [--prompt-file <file>]
                          [--idempotency-key <key>]
uxnan-cli agent ls
uxnan-cli agent send --to <terminal> --message-file <file> [--force] [--idempotency-key <key>]
uxnan-cli agent wait --to <terminal> --for idle|waiting|exit [--timeout <seconds>]
uxnan-cli terminal read <terminal> [--lines <n>]
uxnan-cli run ls | show <run-id> | start <run-id> [--idempotency-key <key>]
uxnan-cli automation ls | run <automation-id> [--idempotency-key <key>]
uxnan-cli app focus
uxnan-cli file open <path> [--worktree <worktree>]
uxnan-cli file diff <path> [--worktree <worktree>] [--staged]
uxnan-cli browser open <url> | navigate <url> | reload | back | forward | status
uxnan-cli rpc <method> [--params '<json>']      # any catalog entry, raw
uxnan-cli skills get control [--full]           # this guide
Global: --json (stable machine output), --timeout <seconds>
```

## Selectors

- `current` — your own terminal, and from it your worktree and project. Works inside a terminal Uxnan launched (it knows `UXNAN_AGENT_ID`); from another shell, use an explicit form.
- `id:<id>` — a project id or a terminal id (from `ls`).
- `path:<absolute path>` — a project or worktree folder. A bare absolute path is accepted too.
- `branch:<name>` — a worktree by its branch.
- `name:<project name>` — a project by its name (must be unique).

## Catalog

### `read` (v1) — reads with no effect

- `status` (MCP tool `uxnan_status`)
- `project/list` (MCP tool `project_list`)
- `project/show` (MCP tool `project_show`)
- `worktree/list` (MCP tool `worktree_list`)
- `worktree/show` (MCP tool `worktree_show`)
- `terminal/list` (MCP tool `terminal_list`)
- `terminal/show` (MCP tool `terminal_show`)
- `agent/list` (MCP tool `agent_list`)
- `run/list` (MCP tool `run_list`)
- `run/show` (MCP tool `run_show`)
- `automation/list` (MCP tool `automation_list`)
- `browser/status` (MCP tool `browser_status`)

### `ui` (v1) — actions on the window that change nothing on disk or in a process

- `app/focus` (MCP tool `app_focus`)
- `terminal/reveal` (MCP tool `terminal_reveal`)
- `file/open` (MCP tool `file_open`)
- `file/diff` (MCP tool `file_diff`)
- `browser/open` (MCP tool `browser_open`)
- `browser/navigate` (MCP tool `browser_navigate`)
- `browser/reload` (MCP tool `browser_reload`)
- `browser/back` (MCP tool `browser_back`)
- `browser/forward` (MCP tool `browser_forward`)

### `create` (v1) — create a worktree or a terminal, start a saved run

- `worktree/create` (MCP tool `worktree_create`)
- `terminal/create` (MCP tool `terminal_create`)
- `run/start` (MCP tool `run_start`)
- `automation/run` (MCP tool `automation_run`)

### `converse` (v1) — talk to a running agent

- `agent/send` (MCP tool `agent_send`)
- `agent/wait` (MCP tool `agent_wait`)
- `terminal/read` (MCP tool `terminal_read`)

### `orchestrate` (v1) — coordinate several agents

- `orchestration/reportResult` (MCP tool `orchestration_report_result`)
- `orchestration/reportProgress` (MCP tool `orchestration_report_progress`)

## Reference

### `status`

MCP tool: `uxnan_status` · group: `read` · read-only

Report the running Uxnan Desktop: its version, the control protocol version, which capability groups are enabled, and how many projects, terminals and live agents it holds. Call this first to learn what you may ask for.

No arguments.

### `project/list`

MCP tool: `project_list` · group: `read` · read-only

List the projects registered in Uxnan: id, name, folder, whether it is a git repository, the machine it lives on, and its worktrees with branch and change counts.

No arguments.

### `project/show`

MCP tool: `project_show` · group: `read` · read-only

Describe one project: the same record `project/list` gives, for the project you select.

Arguments:

- `project` (string, required) — Which project: `current` (the project of the terminal you run in), `id:<projectId>`, `path:<absolute folder>`, or `name:<project name>`.

### `worktree/list`

MCP tool: `worktree_list` · group: `read` · read-only

List worktrees: path, branch, HEAD, whether it is the main checkout, and which live agents run in it. Filter by project or list them all.

Arguments:

- `project` (string, optional) — Which project: `current`, `id:<projectId>`, `path:<absolute folder>`, or `name:<project name>`. Omit for every project.

### `worktree/show`

MCP tool: `worktree_show` · group: `read` · read-only

Describe one worktree: path, branch, HEAD, the project it belongs to, its dirty/ahead/behind counts and the agents running in it.

Arguments:

- `worktree` (string, required) — Which worktree: `current` (the one your terminal runs in), `path:<absolute folder>`, or `branch:<branch name>`.

### `terminal/list`

MCP tool: `terminal_list` · group: `read` · read-only

List the terminal tabs open in Uxnan: id, title, working directory, the worktree it belongs to, and — when an agent runs in it — the agent, its model and its live state (working, waiting, blocked, done).

Arguments:

- `worktree` (string, optional) — Which worktree: `current` (the one your terminal runs in), `path:<absolute folder>`, or `branch:<branch name>`.

### `terminal/show`

MCP tool: `terminal_show` · group: `read` · read-only

Describe one terminal tab, including the agent state Uxnan knows for it. Use `current` to learn about your own terminal.

Arguments:

- `terminal` (string, required) — Which terminal: `current` (the one you run in, from UXNAN_AGENT_ID), or `id:<terminalId>` from `terminal/list`.

### `agent/list`

MCP tool: `agent_list` · group: `read` · read-only

List the agents Uxnan is currently tracking: terminal id, agent kind, state (working, waiting, blocked, done), the prompt and tool last reported, and the worktree they run in.

No arguments.

### `run/list`

MCP tool: `run_list` · group: `read` · read-only

List the orchestration runs (multi-step, multi-agent plans) with their status and step counts.

No arguments.

### `run/show`

MCP tool: `run_show` · group: `read` · read-only

Describe one orchestration run: every step with its kind, target, dependencies, status and captured output.

Arguments:

- `run` (string, required) — The run id from `run/list`.

### `automation/list`

MCP tool: `automation_list` · group: `read` · read-only

List the saved automations (unattended, recurring agent runs): id, name, whether it is enabled, its schedule and its working folder.

No arguments.

### `browser/status`

MCP tool: `browser_status` · group: `read` · read-only

Report the integrated browser's state: whether a page is open, the current URL, whether the in-app browser is enabled, and how opens are routed (in-app / external / ask).

No arguments.

### `app/focus`

MCP tool: `app_focus` · group: `ui` · mutates

Bring the Uxnan window to the front.

No arguments.

### `terminal/reveal`

MCP tool: `terminal_reveal` · group: `ui` · mutates

Show a terminal tab: switch to its workspace and make it the active tab, so the person sees what that agent is doing.

Arguments:

- `terminal` (string, required) — Which terminal: `current` (the one you run in, from UXNAN_AGENT_ID), or `id:<terminalId>` from `terminal/list`.

### `file/open`

MCP tool: `file_open` · group: `ui` · mutates

Open a file in Uxnan's editor tab (or reveal it if already open). The path must be inside a registered worktree.

Arguments:

- `path` (string, required) — Absolute path of the file, or a path relative to the selected worktree.
- `worktree` (string, optional) — Which worktree: `current` (the one your terminal runs in), `path:<absolute folder>`, or `branch:<branch name>`.

### `file/diff`

MCP tool: `file_diff` · group: `ui` · mutates

Open a file's working-tree diff in Uxnan (the Changes view of its tab), so the person can review what changed. `staged` shows the index-vs-HEAD diff instead.

Arguments:

- `path` (string, required) — Path of the file relative to the worktree, or absolute.
- `staged` (boolean, optional) — Show the staged diff instead of the unstaged one. Default false.
- `worktree` (string, optional) — Which worktree: `current` (the one your terminal runs in), `path:<absolute folder>`, or `branch:<branch name>`.

### `browser/open`

MCP tool: `browser_open` · group: `ui` · mutates

Open the integrated in-app browser and load a URL. Use it to preview or test a web app, page or dev server you are building (for example http://localhost:3000). Uxnan routes the open per the user's setting (in-app, external browser, or ask).

Arguments:

- `url` (string, required) — Absolute URL to open, e.g. http://localhost:3000 or https://example.com.

### `browser/navigate`

MCP tool: `browser_navigate` · group: `ui` · mutates

Navigate the integrated browser to a new URL (opening the panel first if it is not open). Same routing as browser/open.

Arguments:

- `url` (string, required) — Absolute URL to navigate to.

### `browser/reload`

MCP tool: `browser_reload` · group: `ui` · mutates

Reload the current page in the integrated browser. Use it after you change code and want to see the result. Errors if no page is open.

No arguments.

### `browser/back`

MCP tool: `browser_back` · group: `ui` · mutates

Go back one entry in the integrated browser's history. Errors if no page is open.

No arguments.

### `browser/forward`

MCP tool: `browser_forward` · group: `ui` · mutates

Go forward one entry in the integrated browser's history. Errors if no page is open.

No arguments.

### `worktree/create`

MCP tool: `worktree_create` · group: `create` · mutates

Create a git worktree on a new branch of a project — where Uxnan's worktree-location policy puts it — make it the active worktree, and optionally launch an agent in it with a first message. Use it to give a subtask its own isolated space and agent instead of running `git worktree add` yourself: Uxnan then sees, lists and can stop it. Returns a receipt with the worktree and, when an agent was launched, its terminal id.

Arguments:

- `agent` (string, optional) — Which configured agent to launch, by its profile name, its command (e.g. `claude`, `codex`) or its profile id. Omit for no agent (a plain terminal).
- `base` (string, optional) — The ref to branch from. Default: the project's default base (its main branch).
- `branch` (string, required) — The new branch name (also the worktree's folder name under the policy's root).
- `fromExisting` (boolean, optional) — Check out an existing branch named `branch` instead of creating it. Default false.
- `idempotencyKey` (string, optional) — Optional caller-chosen key (e.g. a UUID). Repeating a call with the same key returns the receipt of the first call instead of creating a second worktree/terminal/run. Held for the app's lifetime.
- `project` (string, required) — Which project: `current` (the project of the terminal you run in), `id:<projectId>`, `path:<absolute folder>`, or `name:<project name>`.
- `prompt` (string, optional) — A first message for the launched agent, typed into it once it is ready (queued behind Uxnan's backpressure, so it is never pasted into a busy agent). Requires `agent`. At most 64 KiB.

### `terminal/create`

MCP tool: `terminal_create` · group: `create` · mutates

Open a new terminal tab in a worktree, optionally launching a configured agent in it with a first message. Returns a receipt with the terminal id.

Arguments:

- `agent` (string, optional) — Which configured agent to launch, by its profile name, its command (e.g. `claude`, `codex`) or its profile id. Omit for no agent (a plain terminal).
- `idempotencyKey` (string, optional) — Optional caller-chosen key (e.g. a UUID). Repeating a call with the same key returns the receipt of the first call instead of creating a second worktree/terminal/run. Held for the app's lifetime.
- `prompt` (string, optional) — A first message for the launched agent, typed into it once it is ready (queued behind Uxnan's backpressure, so it is never pasted into a busy agent). Requires `agent`. At most 64 KiB.
- `title` (string, optional) — A tab title. Default: the worktree folder name.
- `worktree` (string, required) — Which worktree: `current` (the one your terminal runs in), `path:<absolute folder>`, or `branch:<branch name>`.

### `run/start`

MCP tool: `run_start` · group: `create` · mutates

Start (or re-run) a saved orchestration run by id: every step is reset and the engine begins dispatching. Refused with the validation errors when the run is not runnable. Only saved runs can be started; there is no way to inject steps from here.

Arguments:

- `idempotencyKey` (string, optional) — Optional caller-chosen key (e.g. a UUID). Repeating a call with the same key returns the receipt of the first call instead of creating a second worktree/terminal/run. Held for the app's lifetime.
- `run` (string, required) — The run id from `run/list`.

### `automation/run`

MCP tool: `automation_run` · group: `create` · mutates

Run a saved automation now, as a manual run of the same headless runner its schedule uses. Only saved definitions can be run.

Arguments:

- `automation` (string, required) — The automation id from `automation/list`.
- `idempotencyKey` (string, optional) — Optional caller-chosen key (e.g. a UUID). Repeating a call with the same key returns the receipt of the first call instead of creating a second worktree/terminal/run. Held for the app's lifetime.

### `agent/send`

MCP tool: `agent_send` · group: `converse` · mutates

Send a complete message to a running agent, as one paste-and-submit — never as keystrokes. By default the message waits in Uxnan's backpressure queue until that agent is free (not working); `force` types it now, which interrupts whatever the agent is doing and should be rare. Only an agent's terminal can receive a message; a plain shell has nobody to read it. Use `agent/wait` afterwards to learn when the agent has finished.

Arguments:

- `force` (boolean, optional) — Type it now even if the agent is working. Default false.
- `idempotencyKey` (string, optional) — Optional caller-chosen key (e.g. a UUID). Repeating a call with the same key returns the receipt of the first call instead of creating a second worktree/terminal/run. Held for the app's lifetime.
- `message` (string, required) — The whole message, as the person would type it. At most 64 KiB.
- `terminal` (string, required) — Which terminal: `current` (the one you run in, from UXNAN_AGENT_ID), or `id:<terminalId>` from `terminal/list`.

### `agent/wait`

MCP tool: `agent_wait` · group: `converse` · read-only

Wait until an agent reaches a state, as reported by its own hooks: `idle` (its turn finished — the state to wait for after sending a message), `waiting` (it stopped to ask the person something), or `exit` (its terminal is gone). Returns the state reached and how long it took, or a timeout. One call waits at most 15 seconds; call again to keep waiting (uxnan-cli does this for you and prints a heartbeat).

Arguments:

- `for` (string, required) — `idle`, `waiting` or `exit`.
- `terminal` (string, required) — Which terminal: `current` (the one you run in, from UXNAN_AGENT_ID), or `id:<terminalId>` from `terminal/list`.
- `timeoutMs` (integer, optional) — How long this call may wait, in milliseconds. Capped at 15000. Default 15000.

### `terminal/read`

MCP tool: `terminal_read` · group: `converse` · read-only

Read the last lines of a terminal's screen as plain text (escapes removed, blank rows dropped), with secrets redacted — tokens, keys, `Authorization` headers, `password=`. Use it to see what an agent printed or asked. Every read is written to Uxnan's audit log; a project can switch reads off in Settings.

Arguments:

- `lines` (integer, optional) — How many lines from the bottom. Default 120, at most 2000.
- `terminal` (string, required) — Which terminal: `current` (the one you run in, from UXNAN_AGENT_ID), or `id:<terminalId>` from `terminal/list`.

### `orchestration/reportResult`

MCP tool: `orchestration_report_result` · group: `orchestrate` · mutates

Report the final result of the task Uxnan's orchestration run gave you, so the run captures your output verbatim and can feed it to the next step. Call it once, when you are done. Pass your UXNAN_AGENT_ID as agentId.

Arguments:

- `agentId` (string, required) — The value of your UXNAN_AGENT_ID environment variable (identifies which run step you are).
- `result` (string, required) — Your full result/output for the task, captured verbatim by the run.
- `summary` (string, optional) — Optional one-line summary of the result.

### `orchestration/reportProgress`

MCP tool: `orchestration_report_progress` · group: `orchestrate` · mutates

Report a short progress update for your current orchestration-run step (optional; it surfaces what you are doing in the run view). Pass your UXNAN_AGENT_ID as agentId.

Arguments:

- `agentId` (string, required) — The value of your UXNAN_AGENT_ID environment variable.
- `message` (string, required) — A one-line progress message.

## Output and exit status

Human-readable output goes to stdout; errors go to stderr. `--json` prints the raw result object, stable across versions: fields may be added, never renamed or removed without a protocol bump. Prefer `--json` from a script or an agent.

`agent send` queues a whole message for a running agent until it is free (`--force` types it now and interrupts); `agent wait --for idle` blocks until the agent's own hooks report its turn finished, printing a heartbeat to stderr every 15 s; `terminal read` returns the screen with secrets redacted and is written to the audit log. Together they are the loop: send, wait, read.

A `create` entry answers with a **receipt**: `{ requestId, idempotencyKey?, … }` plus what was created. Pass `--idempotency-key` (any string you choose, e.g. a UUID) and a retry of the same call returns the first receipt instead of creating a second worktree, terminal or run — so a lost reply is safe to retry. Every `create` call, done or refused, is written to `control-audit.log` in the app's data directory (prompt text is recorded as its length only).

| Exit | Meaning |
|---|---|
| 0 | success |
| 1 | the app failed while carrying the request out |
| 2 | usage: unknown method, bad or missing argument |
| 3 | Uxnan Desktop is not running or its window did not answer |
| 4 | the app and the CLI speak different protocol versions |
| 5 | denied: the capability group is switched off, or the token was refused |
| 6 | timed out |
| 7 | the selector named nothing |
| 8 | the target is busy |
