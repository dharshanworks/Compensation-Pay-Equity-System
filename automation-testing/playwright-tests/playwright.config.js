const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
    testDir: "./tests",
    timeout: 30000,

    use: {
        baseURL: "http://127.0.0.1:5600",
        browserName: "chromium",
        headless: false,
        screenshot: "only-on-failure",
        video: "retain-on-failure"
    },

    reporter: [
        ["html"],
        ["list"]
    ],

    webServer: {
        command: "npx http-server ../../frontend -p 5600 -c-1",
        url: "http://127.0.0.1:5600",
        reuseExistingServer: true
    }
});