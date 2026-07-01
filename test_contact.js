require("dotenv").config();
const http = require("http");
const connectDB = require("./src/config/db");
const app = require("./src/app");

const PORT = 5053;
const BASE_URL = `http://localhost:${PORT}`;

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}${path}`;
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        "Accept": "application/json"
      }
    };

    if (body) {
      options.headers["Content-Type"] = "application/json";
    }

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        try {
          resolve({
            statusCode: res.statusCode,
            body: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            body: data
          });
        }
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runContactTests() {
  let serverInstance;

  try {
    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connected successfully!");

    console.log(`Starting test server on port ${PORT}...`);
    serverInstance = app.listen(PORT);
    console.log("Test server started.");

    console.log("\n==================================================");
    console.log("          TESTING CONTACT API                     ");
    console.log("==================================================\n");

    // 1. POST /api/contact (Create Contact Message)
    console.log("Step 1: Sending a test contact message...");
    const postRes = await request("POST", "/api/contact", {
      name: "John Doe",
      email: "john@noohliving.co.in",
      phone: "1234567890",
      subject: "Test Subject",
      message: "This is a test message for noohliving.co.in"
    });
    console.log(`[POST /api/contact] Status: ${postRes.statusCode}`);
    console.log(`Response:`, JSON.stringify(postRes.body));

    // 2. GET /api/contact (Fetch Contacts)
    console.log("\nStep 2: Fetching all contact messages...");
    const getRes = await request("GET", "/api/contact");
    console.log(`[GET /api/contact] Status: ${getRes.statusCode}`);
    console.log(`Count: ${getRes.body.count}`);

  } catch (error) {
    console.error("\n❌ Test failed with error:", error.message);
  } finally {
    if (serverInstance) {
      console.log("Closing test server...");
      serverInstance.close();
    }
    const mongoose = require("mongoose");
    mongoose.disconnect();
    console.log("Database disconnected. Exiting test script.");
  }
}

runContactTests();
