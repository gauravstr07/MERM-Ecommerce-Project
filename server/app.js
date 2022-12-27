const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
const port = 5000;

// Middleware imports
const errorMiddleware = require("./middleware/error");

// Buildin middlewares
app.use(express.json());
app.use(cookieParser());

// Routes Imports
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");

// Routes Middlewares
app.use("/api/v1", productRoutes);
app.use("/api/v1", userRoutes);

// Middleware for Error handler
app.use(errorMiddleware);

module.exports = { app, port };
