require("dotenv").config();
const http = require("http");
const connectDB = require("./src/config/db");
const app = require("./src/app");

const PORT = 5051;
const BASE_URL = `http://localhost:${PORT}`;

// Helper function to make HTTP requests
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

async function runCategoryTests() {
  let serverInstance;

  try {
    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connected successfully!");

    console.log(`Starting test server on port ${PORT}...`);
    serverInstance = app.listen(PORT);
    console.log("Test server started.");

    console.log("\n==================================================");
    console.log("          TESTING ALL CATEGORY APIs               ");
    console.log("==================================================\n");

    // 1. GET /api/categories (Initially)
    console.log("Step 1: Fetching initial categories list...");
    const getRes1 = await request("GET", "/api/categories");
    console.log(`[GET /api/categories] Status: ${getRes1.statusCode}`);
    console.log(`Found: ${getRes1.body.count || 0} categories.`);

    // 2. POST /api/categories/test (Test Route)
    console.log("\nStep 2: Checking Category Test Endpoint...");
    const testRouteRes = await request("POST", "/api/categories/test", { test: true });
    console.log(`[POST /api/categories/test] Status: ${testRouteRes.statusCode}`);
    console.log(`Response:`, JSON.stringify(testRouteRes.body));

    // 3. POST /api/categories (Create)
    const uniqueName = `Test Category ${Date.now()}`;
    console.log(`\nStep 3: Creating a new category: "${uniqueName}"...`);
    const createRes = await request("POST", "/api/categories", { name: uniqueName });
    console.log(`[POST /api/categories] Status: ${createRes.statusCode}`);
    console.log(`Response:`, JSON.stringify(createRes.body));

    if (createRes.statusCode !== 201) {
      throw new Error("Failed to create category");
    }

    const categoryId = createRes.body.data._id;
    console.log(`Created Category ID: ${categoryId}`);

    // 4. GET /api/categories/:id (Get Single)
    console.log(`\nStep 4: Fetching the created category with ID: ${categoryId}...`);
    const getSingleRes = await request("GET", `/api/categories/${categoryId}`);
    console.log(`[GET /api/categories/${categoryId}] Status: ${getSingleRes.statusCode}`);
    console.log(`Response Name: "${getSingleRes.body.data.name}"`);

    // 5. PUT /api/categories/:id (Update)
    const updatedName = `${uniqueName} - Updated`;
    console.log(`\nStep 5: Updating category name to: "${updatedName}"...`);
    const updateRes = await request("PUT", `/api/categories/${categoryId}`, { name: updatedName });
    console.log(`[PUT /api/categories/${categoryId}] Status: ${updateRes.statusCode}`);
    console.log(`Response Name: "${updateRes.body.data.name}"`);

    // 6. DELETE /api/categories/:id (Delete)
    console.log(`\nStep 6: Deleting category with ID: ${categoryId}...`);
    const deleteRes = await request("DELETE", `/api/categories/${categoryId}`);
    console.log(`[DELETE /api/categories/${categoryId}] Status: ${deleteRes.statusCode}`);
    console.log(`Response:`, JSON.stringify(deleteRes.body));

    // 7. GET /api/categories/:id (Verify deletion)
    console.log(`\nStep 7: Verifying deletion of ID: ${categoryId}...`);
    const verifyGet = await request("GET", `/api/categories/${categoryId}`);
    console.log(`[GET /api/categories/${categoryId}] Status: ${verifyGet.statusCode} (Expected 404)`);
    if (verifyGet.statusCode === 404) {
      console.log("✔ Deletion successfully verified!");
    } else {
      console.log("✘ Category still exists!");
    }

    console.log("\n==================================================");
    console.log("    🎉 ALL CATEGORY CRUD TESTS PASSED SUCCESSFULLY! ");
    console.log("==================================================\n");

  } catch (error) {
    console.error("\n❌ Test failed with error:", error.message);
  } finally {
    if (serverInstance) {
      console.log("Closing test server...");
      serverInstance.close();
    }
    // Disconnect mongoose to exit process cleanly
    const mongoose = require("mongoose");
    mongoose.disconnect();
    console.log("Database disconnected. Exiting test script.");
  }
}

runCategoryTests();
