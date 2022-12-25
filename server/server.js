const { app, port } = require("./app");

const dotenv = require("dotenv");

const connectDatabase = require("./config/database");

// Configration
dotenv.config({ path: "config/config.env" });

// Database Configration
connectDatabase();

app.listen(port, () => {
  console.log(`server running on port: ${port}📡`);
});
