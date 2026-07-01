require("dotenv").config();
const http = require("http");
const connectDB = require("./src/config/db");
const app = require("./src/app");

const PORT = 5052;
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

async function runServiceTests() {
  let serverInstance;

  try {
    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connected successfully!");

    console.log(`Starting test server on port ${PORT}...`);
    serverInstance = app.listen(PORT);
    console.log("Test server started.");

    console.log("\n==================================================");
    console.log("          TESTING ALL SERVICE APIs                ");
    console.log("==================================================\n");

    // 1. GET /api/services (Initially)
    console.log("Step 1: Fetching initial services list...");
    const getRes1 = await request("GET", "/api/services");
    console.log(`[GET /api/services] Status: ${getRes1.statusCode}`);
    console.log(`Found: ${getRes1.body.count || 0} services.`);

    // 2. POST /api/services (Create)
    const uniqueTitle = `Test Service ${Date.now()}`;
    console.log(`\nStep 2: Creating a new service: "${uniqueTitle}"...`);
    const createRes = await request("POST", "/api/services", {
      title: uniqueTitle,
      shortDescription: "Short description of test service",
      description: "Full detailed description of test service",
      icon: "fa-cog"
    });
    console.log(`[POST /api/services] Status: ${createRes.statusCode}`);
    console.log(`Response:`, JSON.stringify(createRes.body));

    if (createRes.statusCode !== 201) {
      throw new Error("Failed to create service");
    }

    const serviceId = createRes.body.data._id;
    console.log(`Created Service ID: ${serviceId}`);

    // 3. GET /api/services/:id (Get Single)
    console.log(`\nStep 3: Fetching the created service with ID: ${serviceId}...`);
    const getSingleRes = await request("GET", `/api/services/${serviceId}`);
    console.log(`[GET /api/services/${serviceId}] Status: ${getSingleRes.statusCode}`);
    console.log(`Response Title: "${getSingleRes.body.data.title}"`);

    // 4. PUT /api/services/:id (Update)
    const updatedTitle = `${uniqueTitle} - Updated`;
    console.log(`\nStep 4: Updating service title to: "${updatedTitle}"...`);
    const updateRes = await request("PUT", `/api/services/${serviceId}`, {
      title: updatedTitle,
      shortDescription: "Updated short desc",
      description: "Updated long desc",
      icon: "fa-wrench"
    });
    console.log(`[PUT /api/services/${serviceId}] Status: ${updateRes.statusCode}`);
    console.log(`Response Title: "${updateRes.body.data.title}"`);

    // 5. DELETE /api/services/:id (Delete)
    console.log(`\nStep 5: Deleting service with ID: ${serviceId}...`);
    const deleteRes = await request("DELETE", `/api/services/${serviceId}`);
    console.log(`[DELETE /api/services/${serviceId}] Status: ${deleteRes.statusCode}`);
    console.log(`Response:`, JSON.stringify(deleteRes.body));

    // 6. GET /api/services/:id (Verify deletion)
    console.log(`\nStep 6: Verifying deletion of ID: ${serviceId}...`);
    const verifyGet = await request("GET", `/api/services/${serviceId}`);
    console.log(`[GET /api/services/${serviceId}] Status: ${verifyGet.statusCode} (Expected 404)`);
    if (verifyGet.statusCode === 404) {
      console.log("✔ Deletion successfully verified!");
    } else {
      console.log("✘ Service still exists!");
    }

    console.log("\n==================================================");
    console.log("     🎉 ALL SERVICE CRUD TESTS PASSED SUCCESSFULLY! ");
    console.log("==================================================\n");

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

runServiceTests();
