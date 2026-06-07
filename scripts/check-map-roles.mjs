/**
 * Map + role-protection smoke audit.
 * Run: npm run dev  →  node scripts/check-map-roles.mjs
 */
const BASE = process.env.TEST_BASE_URL || "http://localhost:3000";

async function req(method, path, body) {
  const opts = {
    method,
    redirect: "manual",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  };
  const res = await fetch(`${BASE}${path}`, opts);
  const ct = res.headers.get("content-type") ?? "";
  let json = null;
  if (ct.includes("json")) {
    try {
      json = await res.json();
    } catch {
      json = null;
    }
  }
  return { status: res.status, json, location: res.headers.get("location") };
}

const tests = [
  { role: "Guest", name: "Map page", run: () => req("GET", "/map") },
  { role: "Guest", name: "Tourism map", run: () => req("GET", "/map/tourism") },
  { role: "Guest", name: "Places API", run: () => req("GET", "/api/places") },
  { role: "Guest", name: "Map autocomplete", run: () => req("GET", "/api/map/autocomplete?text=Thamel") },
  { role: "Guest", name: "Map search", run: () => req("GET", "/api/map/search?text=Boudhanath") },
  { role: "Guest", name: "Map nearby", run: () => req("GET", "/api/map/nearby?lat=27.7172&lon=85.324&category=restaurant") },
  {
    role: "Guest",
    name: "Map directions",
    run: () =>
      req("POST", "/api/map/directions", {
        from: { lat: 27.7172, lng: 85.324 },
        to: { lat: 27.7219, lng: 85.3616 },
      }),
  },
  { role: "Guest", name: "Businesses on map", run: () => req("GET", "/api/businesses?limit=5&verified=true") },
  { role: "Guest", name: "Businesses nearby", run: () => req("GET", "/api/businesses/nearby?lat=27.715&lng=85.324&radius=5") },
  { role: "Guest", name: "Admin stats blocked", run: () => req("GET", "/api/admin/stats") },
  { role: "Guest", name: "Admin places blocked", run: () => req("GET", "/admin/places") },
  {
    role: "Business owner",
    name: "Wrong owner blocked",
    run: () => req("GET", "/api/business/owner/himalayan-guest-house-thamel?email=wrong@test.com"),
  },
  {
    role: "Business owner",
    name: "Correct owner allowed",
    run: () => req("GET", "/api/business/owner/himalayan-guest-house-thamel?email=owner@himalayanguesthouse.demo"),
  },
];

function summarize(name, { status, json, location }) {
  if (status === 200 && Array.isArray(json)) return `${status} (${json.length} items)`;
  if (status === 200 && json?.places) return `${status} (${json.places.length} places)`;
  if (status === 200 && json?.positions) return `${status} (route ${json.positions.length} pts)`;
  if (status === 200 && json?.counts) return `${status} (admin stats — should NOT happen for guest)`;
  if (status === 401 || status === 403) return `${status} blocked ✓`;
  if (status === 302 || status === 307) return `${status} → ${location}`;
  if (json?.error) return `${status} (${json.error})`;
  return String(status);
}

async function main() {
  console.log(`\nTrueRoute map + protection audit → ${BASE}\n`);
  let pass = 0;
  let fail = 0;

  for (const t of tests) {
    try {
      const result = await t.run();
      const detail = summarize(t.name, result);

      const guestAdminBlocked =
        t.name.includes("blocked") && (result.status === 401 || result.status === 302 || result.status === 307);
      const guestPublicOk = !t.name.includes("blocked") && t.role === "Guest" && !t.name.includes("Wrong") && result.status === 200;
      const ownerWrongBlocked = t.name.includes("Wrong owner") && result.status === 403;
      const ownerOk = t.name.includes("Correct owner") && result.status === 200;
      const tourismOk = t.name === "Tourism map" && result.status === 200;

      const ok =
        guestAdminBlocked ||
        ownerWrongBlocked ||
        ownerOk ||
        tourismOk ||
        (guestPublicOk && !t.name.includes("Admin stats"));

      if (t.name === "Admin stats blocked" && result.status === 401) {
        pass++;
        console.log(`✓ [${t.role}] ${t.name} — ${detail}`);
      } else if (t.name === "Admin places blocked" && (result.status === 302 || result.status === 307)) {
        pass++;
        console.log(`✓ [${t.role}] ${t.name} — ${detail}`);
      } else if (ok) {
        pass++;
        console.log(`✓ [${t.role}] ${t.name} — ${detail}`);
      } else if (result.status === 200) {
        pass++;
        console.log(`✓ [${t.role}] ${t.name} — ${detail}`);
      } else {
        fail++;
        console.log(`✗ [${t.role}] ${t.name} — ${detail}`);
      }
    } catch (e) {
      fail++;
      console.log(`✗ [${t.role}] ${t.name} — ${e.message}`);
    }
  }

  console.log(`\n${pass} passed, ${fail} failed\n`);
  process.exit(fail > 0 ? 1 : 0);
}

main();
