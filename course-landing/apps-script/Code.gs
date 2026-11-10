/**
 * Lumen AI Academy — lead intake (sample Google Apps Script).
 *
 * Setup
 * 1. Create a Google Sheet with a tab named "Leads" (headers are added automatically).
 * 2. Extensions > Apps Script, paste this file, set SHEET_ID below.
 * 3. Deploy > New deployment > Web app.
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the /exec URL into VITE_FORMS_ENDPOINT (or the host's env vars)
 *    and redeploy the static site.
 *
 * The front end posts one JSON body with the columns from Doc 02 §6.3.
 * No email is sent at this stage: the syllabus PDF downloads directly in the
 * browser, and the email column records the address supplied for the download.
 * Intro leads are followed up manually on WhatsApp.
 */

var SHEET_ID = "PASTE_GOOGLE_SHEET_ID_HERE";
var SHEET_NAME = "Leads";

var HEADERS = [
  "timestamp",
  "name",
  "whatsapp",
  "email",
  "segment",
  "track",
  "preferred_time",
  "lead_type",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "page_variant",
  "consent",
  "status",
  "owner",
  "notes",
];

function doPost(event) {
  try {
    var data = JSON.parse((event.postData && event.postData.contents) || "{}");
    if (!data.name || !data.lead_type) {
      return json({ ok: false, error: "Missing name or lead_type" });
    }

    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error("Sheet not found: " + SHEET_NAME);
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);

    sheet.appendRow([
      new Date(),
      data.name,
      data.whatsapp || "",
      data.email || "",
      data.segment || "",
      data.track || "",
      data.preferred_time || "",
      data.lead_type,
      data.utm_source || "",
      data.utm_medium || "",
      data.utm_campaign || "",
      data.page_variant || "",
      data.consent === true ? "yes" : "no",
      "new",
      "",
      data.reference ? "Reference " + data.reference : "",
    ]);

    return json({ ok: true, reference: data.reference || "" });
  } catch (error) {
    return json({ ok: false, error: String(error) });
  }
}

function doGet() {
  return json({ ok: true, service: "lumen-lead-intake" });
}

function json(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
