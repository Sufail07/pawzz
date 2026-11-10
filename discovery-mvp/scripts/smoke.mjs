import { chromium } from "@playwright/test";

const base = "http://127.0.0.1:5173";
const results = [];
function check(name, ok, extra = "") {
  results.push(`${ok ? "PASS" : "FAIL"} ${name}${extra ? " :: " + extra : ""}`);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
await page.addInitScript(() => localStorage.setItem("pawzz.datasource.v1", "sample"));
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });

await page.goto(base + "/", { waitUntil: "networkidle" });

// Emergency strip -> one tap
await page.locator('section[aria-label="Emergency help"] a').click();
await page.waitForURL(/emergency=1/);
check("emergency one-tap results", page.url().includes("emergency=1"));
await page.getByText(/Emergency mode:/).waitFor({ timeout: 5000 });
check("emergency banner visible", await page.getByText(/Emergency mode:/).isVisible());
const emergencyCount = await page.getByText(/\d+ providers? found/).textContent();
check("emergency has results", !/^0 /.test(emergencyCount ?? ""), emergencyCount ?? "");

// Category -> filtered results in one tap
await page.goto(base + "/", { waitUntil: "networkidle" });
await page.getByRole("link", { name: /Veterinary clinics/ }).first().click();
await page.waitForURL(/type=clinic/);
const clinicCount = await page.getByText(/\d+ providers? found/).textContent();
check("category one-tap results", !/^0 /.test(clinicCount ?? ""), clinicCount ?? "");

// Results search autocomplete
const searchCombo = page.getByRole("combobox", { name: "What do you need?" });
await searchCombo.click();
await page.getByRole("listbox").waitFor({ timeout: 5000 });
check("results autocomplete opens", await page.getByRole("listbox").isVisible());
await searchCombo.fill("boa");
await page.getByRole("listbox").getByRole("option", { name: "Boarding" }).click();
check("results autocomplete selects", (await searchCombo.inputValue()) === "Boarding");

// Mobile filter sheet
await page.getByRole("button", { name: /^Filters/ }).click();
check("filter sheet opens", await page.getByRole("dialog").isVisible());
await page.getByRole("switch", { name: /Open now/ }).click();
await page.getByRole("dialog").getByRole("button", { name: /Show \d+ results?/ }).click();
check("open-now chip applied", await page.getByRole("button", { name: /Remove filter: Open now/ }).isVisible());

// Shortlist persists
await page.goto(base + "/results?location=Kochi&open=1", { waitUntil: "networkidle" });
const save = page.getByRole("button", { name: /^Save .* shortlist$/ }).first();
if (await save.count()) {
  await save.click();
  const savedChip = page.getByRole("button", { name: /Shortlisted \(1\)/ });
  await savedChip.waitFor({ timeout: 5000 });
  check("shortlist toggles", await savedChip.isVisible());
  await page.reload({ waitUntil: "networkidle" });
  check("shortlist persists after reload", await page.getByRole("button", { name: /Shortlisted \(1\)/ }).isVisible());
} else {
  check("shortlist buttons present", false, "no saves after open-now filter");
}

// Profile + sticky actions
await page.goto(base + "/results?location=Kochi", { waitUntil: "networkidle" });
await page.getByRole("link", { name: "View" }).first().click();
await page.waitForURL(/\/provider\//);
check("profile loads", await page.getByRole("heading", { level: 1 }).isVisible());
const stickyCall = page.locator('a[href^="tel:"]').last();
check("mobile sticky call bar", await stickyCall.isVisible());
await page.locator('a[href^="/correction?provider="]').first().click();
await page.waitForURL(/provider=/);
await page.getByText("Correcting").waitFor({ timeout: 5000 });
check("correction prefilled", await page.getByText("Correcting").isVisible());

// All six provider types have results
for (const type of ["clinic", "hospital", "boarding", "diagnostics", "ambulance", "ngo"]) {
  await page.goto(`${base}/results?type=${type}`, { waitUntil: "networkidle" });
  const text = await page.getByText(/\d+ providers? found/).textContent();
  check(`type ${type} has results`, !/^0 /.test(text ?? ""), text ?? "");
}

// Desktop form flow
const desk = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await desk.addInitScript(() => localStorage.setItem("pawzz.datasource.v1", "sample"));
await desk.goto(base + "/list-business", { waitUntil: "networkidle" });
await desk.getByLabel("Business or organisation name").fill("Harbour Paws Clinic");
await desk.getByLabel("Provider type").selectOption("clinic");
await desk.getByLabel("Area or locality").fill("Fort Kochi");
await desk.getByLabel("Phone number").fill("+91 98470 12345");
await desk.getByLabel("Services offered").fill("Vaccination, dental");
await desk.getByLabel("Your name").fill("Anita");
await desk.getByRole("checkbox").check();
await desk.getByRole("button", { name: "Submit listing" }).click();
await desk.getByRole("heading", { name: "Listing submitted" }).waitFor({ timeout: 5000 });
check("listing form confirms", await desk.getByRole("heading", { name: "Listing submitted" }).isVisible());

// OpenStreetMap live mode
const osm = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await osm.addInitScript(() => localStorage.setItem("pawzz.datasource.v1", "osm"));
osm.on("pageerror", (e) => errors.push(String(e)));
osm.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
await osm.goto(base + "/", { waitUntil: "networkidle" });
check("OSM banner", await osm.getByText(/Live OpenStreetMap data/).isVisible());
check("OSM attribution", await osm.getByText(/OpenStreetMap contributors/).first().isVisible());
await osm.goto(base + "/results?location=Kochi", { waitUntil: "networkidle" });
const osmCount = await osm.getByText(/\d+ providers? found/).textContent();
check("OSM results", !/^0 /.test(osmCount ?? ""), osmCount ?? "");
check("OSM source badge on cards", await osm.getByText("OSM", { exact: true }).first().isVisible());
check("OSM Directions fallback", await osm.getByRole("link", { name: /Directions/ }).first().isVisible());
await osm.goto(base + "/results?location=Kochi&q=vacc", { waitUntil: "networkidle" });
const osmSearch = await osm.getByText(/\d+ providers? found/).textContent();
check("OSM service-word search", !/^0 /.test(osmSearch ?? ""), osmSearch ?? "");
await osm.goto(base + "/results?location=Kochi&q=boarding", { waitUntil: "networkidle" });
check("OSM empty state explains coverage", await osm.getByText(/Live coverage is incomplete/).isVisible());
await osm.getByRole("button", { name: "Search all areas" }).click();
await osm.waitForURL(/\/results\?q=boarding$/);
await osm.waitForTimeout(800);
const anywhere = await osm.getByText(/\d+ providers? found/).textContent();
check("OSM search all areas recovers", !/^0 /.test(anywhere ?? ""), anywhere ?? "");
await osm.locator('a[href^="/provider/osm-"]').first().click();
await osm.waitForURL(/\/provider\/osm-/);
await osm.getByText(/data source/i).waitFor({ timeout: 5000 });
check("OSM profile loads", await osm.getByText(/data source/i).isVisible());
await osm.getByText(/real listing from OpenStreetMap/i).first().waitFor({ timeout: 5000 });
check("OSM profile explains source", await osm.getByText(/real listing from OpenStreetMap/i).first().isVisible());
await osm.getByRole("link", { name: /Know the phone or hours/ }).click();
await osm.waitForURL(/issue=missing/);
check(
  "missing-details correction preselected",
  (await osm.getByLabel("What is wrong?").inputValue()) === "Missing phone or hours",
);
await osm.goto(base + "/results?emergency=1&location=Kochi", { waitUntil: "networkidle" });
const empty = await osm.getByText(/No providers match those filters/).isVisible();
if (empty) {
  check("OSM emergency empty state", await osm.getByRole("button", { name: "Switch to sample demo" }).isVisible());
} else {
  check("OSM emergency empty state", true, "had emergency results");
}
await osm.getByRole("button", { name: /Sample demo/ }).click();
check("mode switch back to sample", await osm.getByText(/Sample demo — all providers/).isVisible());

check("no console errors", errors.length === 0, errors.slice(0, 3).join(" | "));
console.log(results.join("\n"));
await browser.close();
