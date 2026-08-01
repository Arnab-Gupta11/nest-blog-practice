// scripts/pre-request-timestamp.js
//
// Runs BEFORE the request is sent (referenced with `<` in a .http file).
// Sets a request-scoped variable with the current time — handy for APIs
// that require a timestamp/nonce header for request signing or replay
// protection. Only available in the request that includes it (use
// client.global.set instead if you need it across multiple requests).

request.variables.set("requestTime", Date.now().toString());
