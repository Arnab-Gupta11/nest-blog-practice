# API Tests — kulala.nvim Template

Drop this whole `api-tests/` folder into any project's repo root. Structure
is organized by **resource/domain**, one file per **endpoint action** — the
convention that scales best once you have dozens of endpoints.

## Structure

```
api-tests/
├── http-client.env.json               # public env vars (baseUrl, wsUrl) — committed
├── http-client.private.env.json.example  # template for secrets — committed
├── http-client.private.env.json       # YOUR real secrets — gitignored, create this
├── .gitignore
├── smoke-test.http                     # composed end-to-end flow (login→create→delete)
├── auth/
│   └── login.http                      # login + refresh, saves {{authToken}} globally
├── users/
│   ├── get-users.http
│   ├── get-user-by-id.http
│   ├── create-user.http
│   ├── update-user.http
│   └── delete-user.http
├── posts/
│   ├── get-all-posts.http
│   └── create-post.http
├── websocket/
│   └── chat.http
└── scripts/
    ├── post-response-save-token.js     # extracts + stores auth token globally
    └── pre-request-timestamp.js        # example pre-request header injection
```

## First-Time Setup

```bash
cp http-client.private.env.json.example http-client.private.env.json
```

Fill in real tokens/passwords in that file. It's gitignored — never gets
committed.

## Switching Environments (dev / staging / production)

```
<leader>Re
```

Picks which block of `http-client.env.json` (+ the matching block in your
peivate file) is active. Everything using `{{baseUrl}}`, `{{authToken}}`,
etc. automatically uses that environment's values — no editing `.http`
files needed when you switch.

## Two Auth Patterns (pick whichever matches your API)

- **Static token** (API gives you a long-lived token): use `{{apiToken}}`
  directly from the private env file in your requests.
- **Login flow** (API requires email/password → returns a short-lived
  token): run `auth/login.http` once per session (`<leader>Rs` on the
  `LOGIN` request) — its post-response script saves the token as
  `{{authToken}}` globally, and every other request in this folder already
  uses `{{authToken}}` in its `Authorization` header.

## Chaining Requests

Name a request with `# @name SOMETHING` above it, then reference its
response anywhere later:

```
{{SOMETHING.response.body.$.id}}
```

See `users/create-user.http` and `posts/create-post.http` for real
examples (create something, then immediately fetch it back using the ID
from the create response).

## Scripts Folder

Reusable JS logic that would clutter a `.http` file if written inline.
Reference with `<` (pre-request, runs before sending) or `>` (post-response,
runs after the reply comes back):

```http
POST {{baseUrl}}/users
> ./../scripts/post-response-save-token.js
```

Add new scripts here as your auth/signing logic grows — don't duplicate
inline scripts across many files.

## Scaling This for a Large / Multi-Service Project

- **One folder per microservice/domain**, not one giant flat folder:
  ```
  api-tests/
  ├── auth-service/
  ├── payments-service/
  ├── notifications-service/
  └── shared/
      ├── http-client.env.json
      └── scripts/
  ```
- **One `smoke-test.http` per service**, composed the same way as the root
  one here — lets a new team member (or CI) sanity-check a single service
  without running everything.
- **Naming convention**: `verb-resource.http` (`get-users.http`,
  `create-order.http`) — scannable in a file tree at a glance, and matches
  how most teams already name REST handlers.
- **Never put real secrets in `http-client.env.json`** — only in the
  private file. This is what lets the whole `api-tests/` folder (minus the
  one gitignored file) live safely in the same repo as your source code
  and be shared across the whole team.
- **Keep one script per concern** (`post-response-save-token.js`,
  `pre-request-timestamp.js`, etc.) rather than one giant shared script —
  easier to reuse selectively per request.

## Running Things

| Key          | What                                                            |
| ------------ | --------------------------------------------------------------- |
| `<leader>Rs` | Send the request under cursor                                   |
| `<leader>Ra` | Send every request in the current file (e.g. `smoke-test.http`) |
| `<leader>Re` | Switch environment                                              |
| `<leader>Ru` | Manage auth configs                                             |
| `<leader>Rv` | Toggle response view (body/headers/verbose)                     |
