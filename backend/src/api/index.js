const express = require("express");
const lessons = require("./lessons");
const orders = require("./orders");

const api = express.Router();

// lessons api
api.use("/lessons", lessons);
// order api
api.use("/orders", orders);

module.exports = api;
