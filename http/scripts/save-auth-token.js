// Script to extract and store token from auth response globally
client.test("Store auth token", function () {
    if (response.status === 200 || response.status === 201) {
        if (response.body.accessToken) {
            client.global.set("authToken", response.body.accessToken);
            client.log("Successfully saved accessToken to global environment.");
        } else if (response.body.token) {
            client.global.set("authToken", response.body.token);
            client.log("Successfully saved token to global environment.");
        }
    }
});
