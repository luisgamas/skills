# Talking to Uxnan Desktop without `uxnan-cli`

For a script in any language, or an agent runtime with an HTTP client. Everything
here is what `uxnan-cli` does internally; the CLI is the recommended door, this is
the contract behind it.

## 1. Find the app

Two ways, in this order.

**Inside a terminal Uxnan launched** — the environment already says:

| Variable | Meaning |
|---|---|
| `UXNAN_HOOK_URL` | `http://127.0.0.1:<port>/hook`; the server's origin is that URL without the path |
| `UXNAN_HOOK_TOKEN` | the per-launch token (the same one the agent's MCP config names as `UXNAN_MCP_TOKEN`) |
| `UXNAN_AGENT_ID` | this terminal's id — send it back so `current` resolves to it |

**Anywhere else** — read `control.json` under the app's data directory:

| Platform | Directory |
|---|---|
| macOS | `~/Library/Application Support/dev.luisgamas.uxnandesktop` |
| Windows | `%APPDATA%\dev.luisgamas.uxnandesktop` |
| Linux | `$XDG_DATA_HOME/dev.luisgamas.uxnandesktop` (or `~/.local/share/…`) |

`UXNAN_DATA_DIR` overrides it; a development build uses the `-dev` sibling.

```json
{
  "protocolVersion": 1,
  "appVersion": "0.0.51",
  "pid": 4242,
  "processStart": 1789840953,
  "endpoint": "http://127.0.0.1:56606",
  "token": "…"
}
```

Before using it: refuse a file readable by other users (mode other than `0600`
on Unix); refuse a `protocolVersion` you do not speak; confirm that `pid` is alive
**and** started at `processStart` (±2 s) — a file left behind by a crash then
points nowhere. The app removes the file on a clean exit and mints a new token on
every start.

## 2. Call an entry

`POST {endpoint}/control/v1/rpc` with a JSON-RPC 2.0 request, one per call:

```http
POST /control/v1/rpc HTTP/1.1
Host: 127.0.0.1
Content-Type: application/json
Authorization: Bearer <token>
X-Uxnan-Agent-Id: <UXNAN_AGENT_ID>      # only inside a Uxnan terminal; anchors `current`

{"jsonrpc":"2.0","id":1,"method":"worktree/list","params":{"project":"name:uxnan"}}
```

Reply, `200`:

```json
{"jsonrpc":"2.0","id":1,"result":{"worktrees":[…]}}
```

or, still `200`, an error:

```json
{"jsonrpc":"2.0","id":1,"error":{"code":-32002,"message":"no project matches `name:uxnan`"}}
```

`401` means the token was refused (the app restarted — re-read the discovery
file); `403` means the request's `Host`/`Origin` was not loopback; `404` means the
app predates the control surface; `400` with a JSON-RPC error means the body was
not JSON-RPC 2.0. No batches, no notifications: every request has an `id` and gets
one reply.

`params` is always an object and is validated against the entry's schema: an
unknown argument, a missing required one or a wrong type is `-32602` with a
message that names the accepted arguments.

## 3. Error codes

| Code | Name | Exit in `uxnan-cli` | Meaning |
|---|---|---|---|
| -32700 | parse error | 1 | the body was not JSON |
| -32600 | invalid request | 1 | not a JSON-RPC 2.0 request with an id and a method |
| -32601 | method not found | 2 | no catalog entry has this name |
| -32602 | invalid params | 2 | argument or selector rejected |
| -32603 | internal | 1 | the app failed while carrying the request out |
| -32001 | group disabled | 5 | the entry's capability group is switched off in Settings |
| -32002 | not found | 7 | a selector named nothing |
| -32003 | scope denied | 5 | the token is scoped to another project |
| -32004 | unavailable | 3 | the window that owns the resource did not answer |
| -32005 | busy | 8 | the target is busy |
| -32006 | timeout | 6 | a wait ran out of time |
| -32007 | protocol mismatch | 4 | a version the app does not speak |

## 4. The MCP door

The same server serves MCP (Streamable HTTP, request/response only) at
`{endpoint}/mcp` with the same tokens and gates. `tools/list` is the catalog:
each tool's `name` is the entry's tool name (`domain_verb`), its `description` the
entry's summary, its `inputSchema` the entry's params schema. A failed call is
reported in-band (`isError: true`, the reason as text). Agents Uxnan launches are
already pointed at it; a script may use it too, but the RPC route above is the
simpler one for a script.
