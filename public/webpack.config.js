module.exports = {
    context: __dirname + "/app",
    entry: "./src/main",
    output: {
        path: __dirname + "/app/dist",
        filename: "bundle.js"
    }
};
