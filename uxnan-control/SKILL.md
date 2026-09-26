---
name: uxnan-control
description: Operate a running Uxnan Desktop from a shell or from an agent through its control surface — the `uxnan-cli` console client and the MCP tools Uxnan injects into the agents it launches. Use to read the projects, worktrees, terminals, agents and orchestration runs Uxnan holds, to show the person a file or a diff, to open, read and use pages in the integrated browser (outline with element refs, click, type, press, scroll, screenshot, console — under the person's approval policy), to give a subtask its own worktree and agent, to talk to a running agent (send, wait, read) or to one of the chats the Uxnan bridge drives (start one with any bridge agent in a worktree, list, open, send, wait for it and read what it answered — the same conversations the phone shows), and to coordinate a run of workers (tasks, workers in their own worktrees, an inbox, questions) — with stable `--json` output and documented exit codes. Selectors (`current`, `id:`, `path:`, `branch:`, `name:`) name things without copying ids.
---

# Uxnan control surface

## Purpose

Use this skill when **Uxnan Desktop** is running on the machine and you need to
read or operate it: which projects and worktrees it holds, which remote machines
they live on, which terminals are open and which agents run in them (and their
live state), what an orchestration run captured, what a saved automation would
actually do; or to show the person a file or a diff — in Uxnan or in their own
editor — draft an automation for them to save, focus the window, or open, read
and test a page in the integrated browser.

If Uxnan launched you, you already have these entries as **MCP tools**
(`uxnan_status`, `project_list`, `worktree_show`, `terminal_list`, `file_diff`,
`browser_open`, …) — call `uxnan_status` first and skip the CLI. This skill is
for the other case: you run in a shell Uxnan did not launch, or you have no
MCP, and you reach the app through **`uxnan-cli`**. Both are one catalog: an
MCP tool `worktree_list` and `uxnan-cli worktree ls` are the same entry.

## First Reads

Load only what the task needs:

- For every entry — its CLI form, MCP tool, arguments, result fields, a
  request and the errors it answers — and for calling the app **without** the
  CLI (a script in any language: discovery file, JSON-RPC envelope, headers,
  HTTP statuses, error codes): read `references/catalog.md`. It is generated
  from the app's own catalog and constants, so it cannot describe something the
  app does not do.
- For recipes — show the person a diff, find your own worktree, tell which agents
  are busy, coordinate a run of workers, behave as a worker, handle a missing
  app: read `references/workflows.md`.

## Commands

```
uxnan-cli status
uxnan-cli project ls | show <project>
uxnan-cli worktree ls [--project <project>] | show <worktree>
uxnan-cli worktree create --project <project> --branch <name> [--base <ref>] [--from-existing]
                          [--agent <agent>] [--prompt-file <file>] [--idempotency-key <key>]
uxnan-cli terminal ls [--worktree <worktree>] | show <terminal> | reveal <terminal>
uxnan-cli terminal create --worktree <worktree> [--title <t>] [--agent <agent>] [--prompt-file <file>]
uxnan-cli agent ls
uxnan-cli agent send --to <terminal> --message-file <file> [--force] [--idempotency-key <key>]
uxnan-cli agent wait --to <terminal> --for idle|waiting|exit [--timeout <seconds>]
uxnan-cli chat ls [--worktree <worktree>] [--archived]
uxnan-cli chat open <chat>
uxnan-cli chat send --to <chat> --message-file <file> [--idempotency-key <key>]
uxnan-cli chat start --agent <agent> [--worktree <worktree>] [--model <model>] [--title <t>]
                     [--message-file <file>] [--no-open] [--idempotency-key <key>]
uxnan-cli chat read <chat> [--turns <n>]
uxnan-cli chat wait <chat> [--for idle|waiting] [--timeout <seconds>]
uxnan-cli terminal read <terminal> [--lines <n>]
uxnan-cli run ls | show <run-id> | start <run-id> [--idempotency-key <key>]
uxnan-cli host ls | show <host-id> | connect <host-id> [--idempotency-key <key>]
uxnan-cli run create --title <t> | finish <run-id> --outcome success|failure|blocked [--summary <text>]
uxnan-cli task create --run <run-id> --title <t> --prompt-file <file> [--depends-on <task>]... [--headless <agent>]
uxnan-cli task ls --run <run-id> | update --run <run-id> <task> [--status completed|failed|skipped] [--output <text>]
uxnan-cli worker start --run <run-id> --task <task> --agent <agent> [--worktree current|new|<worktree>] [--unattended | --attended]
uxnan-cli inbox check --run <run-id> [--ack <id>]... [--wait] [--timeout <seconds>]
uxnan-cli ask --question <text> [--option <o>]...      # from a worker's terminal
uxnan-cli answer --run <run-id> --question <id> --answer <text> [--reject]
uxnan-cli automation ls | show <automation-id> | run <automation-id> [--idempotency-key <key>]
uxnan-cli automation propose --spec-file <draft.json>   # the person reviews and saves it
uxnan-cli app focus
uxnan-cli file open <path> [--worktree <worktree>] [--with <editor>]
uxnan-cli file diff <path> [--worktree <worktree>] [--staged]
uxnan-cli browser open <url> | navigate <url> | reload | back | forward | status
uxnan-cli browser snapshot                                # the page as an outline; refs on interactive elements
uxnan-cli browser click <ref> [--snapshot] | type <ref> <text> [--append] [--snapshot]
uxnan-cli browser press <key> [--shift] | scroll [--direction down|up|left|right] [--amount <n>] [--ref <ref>]
uxnan-cli browser screenshot --out <file.png> | console [--since <n>] [--level all|warn|error] | wait <text> [--for <s>]
uxnan-cli rpc <method> [--params '<json>']      # any catalog entry, raw
uxnan-cli skills get control [--full]           # this guide / the full reference
Global: --json (stable machine output), --timeout <seconds>
```

## Selectors

- `current` — your own terminal, and from it your worktree and project. Works
  inside a terminal Uxnan launched (it knows `UXNAN_AGENT_ID`); from another
  shell, use an explicit form.
- `id:<id>` — a project id or a terminal id (from `ls`).
- `path:<absolute path>` — a project or worktree folder. A bare absolute path is
  accepted too.
- `branch:<name>` — a worktree by its branch.
- `name:<project name>` — a project by its name (must be unique).

A bare word is refused, not guessed: a branch and a project name can collide.

## Rules

- Prefer `--json`; parse the result object, never the human text. Fields may be
  added over time, never renamed or removed without a protocol bump.
- Branch on the **exit status**, not on the message:

  | Exit | Meaning |
  |---|---|
  | 0 | success |
  | 1 | the app failed while carrying the request out |
  | 2 | usage: unknown method, bad or missing argument, malformed selector |
  | 3 | Uxnan Desktop is not running, or its window did not answer |
  | 4 | the app and the CLI speak different protocol versions (or the app predates the control surface) |
  | 5 | denied: the capability group is switched off, or the token was refused |
  | 6 | timed out |
  | 7 | the selector named nothing |
  | 8 | the target is busy — for a launch, as many agents are running as the resource policy allows (`live`/`cap` in the error); wait for one to finish |
  | 9 | refused by a safety policy or by the person — a browser page action that is never allowed, a site the person has not allowed, or an approval declined or not answered in time |

- Never pass long content as an argument: a first message or a message to an
  agent always comes from a file (`--prompt-file`, `--message-file`), capped at
  64 KiB; put anything longer in a file and tell the agent to read it.
- Prefer the queue: `agent send` waits for the agent to be free. `--force`
  interrupts it and is for a person's decision, not a routine step.
- Every `create` and `converse` call is written to the app's audit log with
  your caller identity; a screen read is redacted before you see it.
- `current` only means something inside a terminal Uxnan launched. Elsewhere,
  list first (`project ls --json`, `worktree ls --json`, `terminal ls --json`)
  and use `id:` / `path:` / `branch:` / `name:`.
- Inside a terminal Uxnan launched you reach **only that terminal's project**:
  listings are narrowed to it and naming another project's worktree or
  terminal is *scope denied* (exit 5) — stop, do not retry with another
  selector. From the user's shell, `uxnan-cli` reaches every project.
- On exit 3 or 4, say so and stop; do not try to reach the app another way. The
  surface has no shell, no raw terminal input, no destructive git or filesystem
  entry — by construction, not by convention.
- The token is never printed and never needs to be handled: the CLI finds it
  (the environment inside a Uxnan terminal; a private `control.json` elsewhere).
- **The browser is per workspace.** Your browser calls act on the page of the
  workspace your terminal belongs to (from another shell: the workspace on
  screen). When that is not the one the person is looking at, the page loads
  hidden and works the same — `visible: false` in the answer.
- **Act on a page only by the `ref` a fresh `browser snapshot` gave you.** A ref
  names an element of one document: after a navigation or reload it is refused
  (exit 2, "take a new snapshot"). An element that is hidden, disabled or covered
  is refused with what covers it.
- **Respect the page policy; do not work around it.** Local pages (localhost,
  loopback, a forwarded port — your dev server) are yours to read and use.
  Submitting a form or anything that reads as deleting, paying, publishing or
  signing in waits for the person (up to 45 s); a site outside the machine is
  refused unless the person allowed it in Settings. Typing into password or file
  fields is always refused — ask the person. On exit 9, tell the person what you
  wanted to do and why, and try again only if they say so.

## Capability groups

`read` (including the machines projects live on, and the agent budget `status`
reports), `ui` (show the person something — a file in Uxnan or in their own
editor, a diff, a draft automation for them to decide on), `create` (worktrees,
terminals, chats, saved runs and automations, and connecting a registered host),
`converse` (send a message to an agent, wait for its state, read its screen, or
send a message to a chat, wait for it and read its answer) and
`orchestrate` (drive a run as its coordinator: tasks, workers, an inbox,
questions — see *Coordinate a run of workers* in `references/workflows.md`).
`uxnan-cli status --json` says which groups the running app has enabled —
check it before assuming an entry.
