require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

// Connect to Database and start Server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Database connection failed. Starting server without database.", err.message);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} (database unavailable)`);
    });
  }
};

startServer();
