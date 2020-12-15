"use strict";

const express = require("express");

const offersRoutes = require("./routes/offers-routes");
const myRoutes = require("./routes/my-routes");
const mainRoutes = require("./routes/main-routes");
const logger = require("../logger");

const DEFAULT_PORT = 8080;

const app = express();

app.use("/offers", offersRoutes);
app.use("/my", myRoutes);
app.use("/", mainRoutes);

app.listen(DEFAULT_PORT);

logger.success(`Приложение запущено на http://localhost:${DEFAULT_PORT}`);
