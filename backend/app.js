const express = require("express");
const app = express();
const errorhandler = require("./middlewars/error");
const cookieParser = require("cookie-parser");

const dotenv = require("dotenv").config();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
const users = require("./routes/user.routes");
const expense = require("./routes/expense.routes");
const stats = require("./routes/stats.routes");
const auth = require("./routes/auth.routes");
app.use("/api/v1", users);
app.use("/api/v1", expense);
app.use("/api/v1", stats);
app.use("/api/v1", auth);
app.use(errorhandler);
module.exports = app;
