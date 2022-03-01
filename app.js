require("dotenv").config();
if (process.env.NODE_ENV !== "test") {
  require("./config/mongoose");
}
require("./config/firebase");

const path = require("path");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const logger = require("morgan");

const authRouter = require("./routes/auth");
const indexRouter = require("./routes/index");
const meetingRouter = require("./routes/meeting");

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};

const app = express();

app.use(helmet());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors(corsOptions));

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/meeting", meetingRouter);

app.use(function (error, req, res, next) {
  res.status(error.status || 500);
  res.json({
    result: error.result,
    errorMessage: error.message,
  });
});

module.exports = app;