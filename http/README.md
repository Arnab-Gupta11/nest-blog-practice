# HTTP API Testing Framework (`kulala.nvim`)

Modular, scalable RFC 7230/2616 HTTP client testing setup designed for **Neovim** using `kulala.nvim` (also compatible with VS Code REST Client and JetBrains HTTP Client).

---

## Directory Structure

```
http/
├── http-client.env.json                  # Environment variables (local, dev, production) - committed
├── http-client.private.env.json.example     # Template for private credentials & secrets - committed
├── http-client.private.env.json          # Your local secrets (JWT tokens, passwords) - gitignored
├── .gitignore                            # Ignores local secret files and response logs
├── smoke-test.http                       # End-to-end integration test flow
├── scripts/
│   └── save-auth-token.js                # Handler script to extract & save JWT tokens dynamically
└── modules/                              # Feature-based domain request folders
    ├── auth/
    │   └── auth.http                     # Authentication requests
    ├── users/
    │   ├── create-user.http              # POST /users
    │   ├── create-many-users.http        # POST /users/create-many
    │   ├── get-users.http                # GET /users (with pagination)
    │   ├── get-user-by-id.http           # GET /users/:id
    │   └── update-user.http              # PATCH /users
    ├── posts/
    │   ├── create-post.http              # POST /posts
    │   ├── get-posts.http                # GET /posts
    │   ├── update-post.http              # PATCH /posts
    │   └── delete-post.http              # DELETE /posts/:id
    ├── tags/
    │   ├── create-tag.http               # POST /tags
    │   └── delete-tag.http               # DELETE /tags/:id
    └── meta-options/
        └── create-meta-option.http       # POST /meta-options
```

---

## Setup Instructions

### 1. Configure Private Secrets (First-Time Setup)

Copy the private environment template:

```bash
cp http/http-client.private.env.json.example http/http-client.private.env.json
```

Update `http/http-client.private.env.json` with real tokens or test passwords. This file is gitignored and will never be committed.

---

## Using `kulala.nvim` Keybindings

| Keybinding | Action | Description |
|---|---|---|
| `<leader>Rs` | **Run Request** | Executes the request under the cursor |
| `<leader>Ra` | **Run All Requests** | Executes all requests in the current file sequentially (e.g. `smoke-test.http`) |
| `<leader>Re` | **Select Environment** | Switch between `local`, `dev`, and `production` |
| `<leader>Rv` | **Toggle View** | Switch response window view (body, headers, verbose) |
| `<leader>Ru` | **Auth Configs** | Manage interactive authentication tokens |

---

## Request Chaining (`# @name`)

Downstream requests can dynamically reference data returned from previous requests:

```http
### 1. Create User
# @name createUser
POST {{baseUrl}}/users
Content-Type: application/json

{
  "firstName": "John",
  "email": "john@example.com",
  "password": "Password123!"
}

### 2. Create Post referencing the created User ID
POST {{baseUrl}}/posts
Content-Type: application/json

{
  "title": "My Post",
  "authorId": {{createUser.response.body.$.id}}
}
```

---

## E2E Smoke Testing

Open `http/smoke-test.http` in Neovim and press `<leader>Ra` to run the full end-to-end flow:
1. Creates a test user.
2. Creates a test tag.
3. Creates a post linking the user and tag dynamically.
4. Reads all posts to verify associations.
5. Cleans up created post and tag.
