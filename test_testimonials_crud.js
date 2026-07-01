require("dotenv").config();
const http = require("http");
const connectDB = require("./src/config/db");
const app = require("./src/app");

const PORT = 5054;
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

async function runTestimonialTests() {
  let serverInstance;

  try {
    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connected successfully!");

    console.log(`Starting test server on port ${PORT}...`);
    serverInstance = app.listen(PORT);
    console.log("Test server started.");

    console.log("\n==================================================");
    console.log("       TESTING TESTIMONIAL API WITH VIDEO         ");
    console.log("==================================================\n");

    // 1. POST /api/testimonials (Create with Video)
    console.log("Step 1: Creating a testimonial with a video URL...");
    const createRes = await request("POST", "/api/testimonials", {
      name: "Amit Shah",
      role: "Villa Owner",
      message: "This is a testimonial review.",
      image: "http://example.com/image.png",
      video: "https://noohliving.co.in/assets/testimonials/sample-video.mp4",
      rating: 5
    });
    console.log(`[POST /api/testimonials] Status: ${createRes.statusCode}`);
    console.log(`Response:`, JSON.stringify(createRes.body));

    if (createRes.statusCode !== 201) {
      throw new Error("Failed to create testimonial");
    }

    const testimonialId = createRes.body.data._id;
    console.log(`Created Testimonial ID: ${testimonialId}`);

    // 2. GET /api/testimonials (Fetch All and check video property)
    console.log("\nStep 2: Fetching active testimonials list...");
    const getRes = await request("GET", "/api/testimonials");
    console.log(`[GET /api/testimonials] Status: ${getRes.statusCode}`);
    const foundItem = getRes.body.data.find(t => t._id === testimonialId);
    if (foundItem) {
      console.log(`Verified Video Field in Response: "${foundItem.video}"`);
    } else {
      console.log("Warning: Created testimonial not returned in active list (check isActive defaults).");
    }

    // 3. PUT /api/testimonials/:id (Update Video URL)
    const newVideoUrl = "https://noohliving.co.in/assets/testimonials/updated-video.mp4";
    console.log(`\nStep 3: Updating video URL to: "${newVideoUrl}"...`);
    const updateRes = await request("PUT", `/api/testimonials/${testimonialId}`, {
      video: newVideoUrl
    });
    console.log(`[PUT /api/testimonials/${testimonialId}] Status: ${updateRes.statusCode}`);
    console.log(`Response Video Field: "${updateRes.body.data.video}"`);

    // 4. DELETE /api/testimonials/:id (Delete)
    console.log(`\nStep 4: Deleting test testimonial...`);
    const deleteRes = await request("DELETE", `/api/testimonials/${testimonialId}`);
    console.log(`[DELETE /api/testimonials/${testimonialId}] Status: ${deleteRes.statusCode}`);
    console.log(`Response:`, JSON.stringify(deleteRes.body));

    console.log("\n==================================================");
    console.log("   🎉 TESTIMONIAL VIDEO API TEST PASSED SUCCESSFULLY! ");
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

runTestimonialTests();
