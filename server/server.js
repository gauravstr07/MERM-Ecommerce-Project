const { app, port } = require("./app");

const dotenv = require("dotenv");

const connectDatabase = require("./config/database");

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`shutting down the server due to Unhandle rejection`);
  process.exit(1);
});

// Configration
dotenv.config({ path: "config/config.env" });

// Database Configration
connectDatabase();

const server = app.listen(port, () => {
  console.log(`server running on port: ${port}📡`);
});


// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to unhandle promise rejection`);

  server.close(() => {
    process.exit(1);
  });
});
