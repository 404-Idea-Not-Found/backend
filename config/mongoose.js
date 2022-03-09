/* eslint-disable no-console */
const mongoose = require("mongoose");

mongoose.set("debug", true);

mongoose.connect(process.env.DB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "❌ DB CONNECTION_ERROR"));
db.once("open", console.log.bind(console, "✅ DB CONNECTED_DATABASE"));
