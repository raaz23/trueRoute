/**
 * Demo smoke test — run with dev server: npm run dev
 * Then: node scripts/test-demo.mjs
 */
const BASE = process.env.TEST_BASE_URL || "http://localhost:3000";

const tests = [
  { name: "Homepage", path: "/", expectStatus: 200 },
  { name: "Map app", path: "/map", expectStatus: 200 },
  { name: "Prices", path: "/prices", expectStatus: 200 },
  { name: "Chat", path: "/chat", expectStatus: 200 },
  { name: "Translate", path: "/translate", expectStatus: 200 },
  { name: "Emergency", path: "/emergency", expectStatus: 200 },
  { name: "Places", path: "/places", expectStatus: 200 },
  { name: "Login", path: "/login", expectStatus: 200 },
  { name: "Offline bundle API", path: "/api/offline-bundle", expectStatus: 200 },
  { name: "Prices API", path: "/api/prices", expectStatus: 200 },
  { name: "Places API", path: "/api/places", expectStatus: 200 },
  { name: "Cities API", path: "/api/cities", expectStatus: 200 },
  { name: "FAQ API", path: "/api/faq", expectStatus: 200 },
  { name: "Content API", path: "/api/content", expectStatus: 200 },
  { name: "Manifest", path: "/manifest.webmanifest", expectStatus: 200 },
];

async function run() {
  console.log(`\nTrueRoute demo tests → ${BASE}\n`);
  let passed = 0;
  let failed = 0;

  for (const t of tests) {
    try {
      const res = await fetch(`${BASE}${t.path}`, { redirect: "follow" });
      const ok = res.status === t.expectStatus;
      if (ok) {
        passed++;
        console.log(`✓ ${t.name} (${res.status})`);
      } else {
        failed++;
        console.log(`✗ ${t.name} — expected ${t.expectStatus}, got ${res.status}`);
      }
    } catch (e) {
      failed++;
      console.log(`✗ ${t.name} — ${e.message}`);
    }
  }

  // POST chat (offline fallback should work without API keys)
  try {
    const res = await fetch(`${BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: "What is fair taxi price in Kathmandu?" }],
      }),
    });
    const data = await res.json();
    const text = data.reply || data.response || data.message?.content;
    if (res.ok && text) {
      passed++;
      console.log(`✓ Chat API (reply length ${String(text).length})`);
    } else {
      failed++;
      console.log(`✗ Chat API — ${res.status}`, data);
    }
  } catch (e) {
    failed++;
    console.log(`✗ Chat API — ${e.message}`);
  }

  console.log(`\n${passed} passed, ${failed} failed\n`);
  process.exit(failed > 0 ? 1 : 0);
}

run();
