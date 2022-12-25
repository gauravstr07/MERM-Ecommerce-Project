const express = require("express");

const app = express();
const port = 5000;

// Middleware imports
const errorMiddleware = require("./middleware/error");

// Buildin middlewares
app.use(express.json());

// Routes Imports
const productRoutes = require("./routes/productRoutes");

// Routes Middlewares
app.use("/api/v1", productRoutes);

// Middleware for Error handler
app.use(errorMiddleware);

module.exports = { app, port };
