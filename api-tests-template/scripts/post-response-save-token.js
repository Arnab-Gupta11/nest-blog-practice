// scripts/post-response-save-token.js
//
// Runs AFTER the response comes back (referenced with `>` in a .http file).
// Pulls the access token out of a login response and stores it as a GLOBAL
// variable — every other request's "Authorization: Bearer {{authToken}}"
// picks it up automatically, and it persists across neovim restarts too.
//
// Adjust `body.token` below to match your actual API's login response shape
// (e.g. body.accessToken, body.data.token, etc.)

const body = response.body;

if (body && body.token) {
  client.global.set("authToken", body.token);
} else {
  console.log("post-response-save-token: no token found in login response");
}
