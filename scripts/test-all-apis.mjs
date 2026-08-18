import crypto from "crypto";

const BASE_URL = "http://localhost:9002";

async function testApis() {
  console.log("🚀 Starting Comprehensive API Tests against", BASE_URL);
  let passed = 0;
  let failed = 0;

  function assert(name, condition, details = "") {
    if (condition) {
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${name} - ${details}`);
      failed++;
    }
  }

  // 1. Test /api/shorten without auth (Should return 401)
  try {
    const res = await fetch(`${BASE_URL}/api/shorten`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: "https://example.com" }),
    });
    const json = await res.json();
    assert(
      "POST /api/shorten without Bearer token returns 401 Unauthorized",
      res.status === 401 && json.error === "Unauthorized",
      `Status: ${res.status}, body: ${JSON.stringify(json)}`
    );
  } catch (err) {
    assert("POST /api/shorten without auth", false, err.message);
  }

  // 2. Test /api/shorten with invalid token (Should return 401)
  try {
    const res = await fetch(`${BASE_URL}/api/shorten`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer invalid-dummy-token",
      },
      body: JSON.stringify({ url: "https://example.com" }),
    });
    assert(
      "POST /api/shorten with invalid token returns 401 Unauthorized",
      res.status === 401
    );
  } catch (err) {
    assert("POST /api/shorten with invalid token", false, err.message);
  }

  // 3. Test /api/payment/webhook with missing signature (Should return 400)
  try {
    const res = await fetch(`${BASE_URL}/api/payment/webhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "payment.captured" }),
    });
    assert(
      "POST /api/payment/webhook without signature returns 400 Signature missing",
      res.status === 400
    );
  } catch (err) {
    assert("POST /api/payment/webhook without signature", false, err.message);
  }

  // 4. Test /api/payment/webhook with invalid signature (Should return 403 or 500 if unconfigured)
  try {
    const res = await fetch(`${BASE_URL}/api/payment/webhook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-razorpay-signature": "bogus_signature_value",
      },
      body: JSON.stringify({ event: "payment.captured" }),
    });
    assert(
      "POST /api/payment/webhook with invalid signature rejected",
      res.status === 403 || res.status === 500,
      `Status: ${res.status}`
    );
  } catch (err) {
    assert("POST /api/payment/webhook with invalid signature", false, err.message);
  }

  // 5. Test /api/linkguard/check with invalid URL format (Should return 400)
  try {
    const res = await fetch(`${BASE_URL}/api/linkguard/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: "not-a-valid-url" }),
    });
    const json = await res.json();
    assert(
      "POST /api/linkguard/check with invalid URL returns 400",
      res.status === 400 && json.reason === "Invalid URL format",
      `Status: ${res.status}, body: ${JSON.stringify(json)}`
    );
  } catch (err) {
    assert("POST /api/linkguard/check invalid URL", false, err.message);
  }

  // 6. Test /api/linkguard/check with valid URL (Should return 200 with risk verdict)
  try {
    const res = await fetch(`${BASE_URL}/api/linkguard/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: "https://www.google.com" }),
    });
    const json = await res.json();
    assert(
      "POST /api/linkguard/check with valid URL returns 200 with verdict",
      res.status === 200 && typeof json.risk === "string",
      `Status: ${res.status}, body: ${JSON.stringify(json)}`
    );
  } catch (err) {
    assert("POST /api/linkguard/check valid URL", false, err.message);
  }

  // 7. Test /api/analytics/summary without token (Should return 401 or 500 if unconfigured)
  try {
    const res = await fetch(`${BASE_URL}/api/analytics/summary`);
    assert(
      "GET /api/analytics/summary without token rejected",
      res.status === 401 || res.status === 500,
      `Status: ${res.status}`
    );
  } catch (err) {
    assert("GET /api/analytics/summary without token", false, err.message);
  }

  // 8. Test /go/scamguard-play route (Should return 302 redirect to Play Store)
  try {
    const res = await fetch(`${BASE_URL}/go/scamguard-play?utm_source=test`, {
      redirect: "manual",
    });
    const loc = res.headers.get("location") || "";
    assert(
      "GET /go/scamguard-play returns 302 redirect to Google Play Store",
      res.status === 302 && loc.includes("play.google.com"),
      `Status: ${res.status}, Location: ${loc}`
    );
  } catch (err) {
    assert("GET /go/scamguard-play", false, err.message);
  }

  // 9. Test /go/nonexistent-slug (Should return 307 redirect to /not-found)
  try {
    const res = await fetch(`${BASE_URL}/go/nonexistent-test-slug-999`, {
      redirect: "manual",
    });
    const loc = res.headers.get("location") || "";
    assert(
      "GET /go/[slug] for nonexistent slug redirects to /not-found",
      res.status === 307 && loc.includes("/not-found"),
      `Status: ${res.status}, Location: ${loc}`
    );
  } catch (err) {
    assert("GET /go/[slug] nonexistent", false, err.message);
  }

  console.log(`\n📊 API Test Results: ${passed} Passed, ${failed} Failed\n`);
  if (failed > 0) process.exit(1);
}

testApis().catch((err) => {
  console.error("API Test Runner Error:", err);
  process.exit(1);
});
