const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const api = require("./api");

// load enviornment variables if exists
require("dotenv").config();

// create new express app
const app = express();

// register the logger for api requests
app.use(morgan("combined"));

// some best practices for security in one package
app.use(helmet());

// enable cors to be let frontend use local server api
app.use(cors());

// return data from apis as json always
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// this is our apis we append /api/v1 before any route
app.use("/api/v1", api);

// not found apis handler
app.use((req, res, next) => {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
});

// error handler to make response user friendly
app.use((req, res, next) => {
  // 1. check status code if it's not equal to 200 or not
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  // 2. return response having a field called message and a field called stack
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
});

module.exports = app;
