const express = require("express");

const app = express();
const port = 5000;

// Buildin middlewares
app.use(express.json());

// Routes Imports
const productRoutes = require("./routes/productRoutes");

// Routes Middlewares
app.use("/api/v1", productRoutes);

module.exports = { app, port };
