/**
 * Private Chef Lombok — Google Apps Script CMS
 *
 * SETUP
 * 1. Create a Google Sheet with tabs: Settings, Reviews
 * 2. Create a Drive folder for images (hero, about, chef)
 * 3. Extensions → Apps Script → paste this file
 * 4. Set SCRIPT_SECRET, SPREADSHEET_ID, IMAGES_FOLDER_ID below
 * 5. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Paste the /exec URL into src/lib/google-script-config.ts
 *
 * Project editor:
 * https://script.google.com/home/projects/1_NrvcI6W4wj00KOF3LIPRME-dNKYBT1y5MzE9D5RWLgmd-hF-NTX_1Pf/edit
 *
 * Spreadsheet:
 * https://docs.google.com/spreadsheets/d/1NAPU542Lg7DyJYYdYbNFz2JkJJTpT55sKqz1pE-rip8/edit
 *
 * Settings sheet columns: key | value
 * Reviews sheet columns: id | quote | name | place | rating | review | photo_url | created_at | status
 *   status: show | hide  (empty = show)
 *
 * Image files in the folder should be named (any extension):
 *   hero.*   about.*   chef.*
 * Or set hero_image / about_image / chef_image in Settings (Drive file ID or share link).
 */

const SCRIPT_SECRET = "d0c48e2b-6f96-4e4d-a38b-c0a3c0a7f9f1";
const SPREADSHEET_ID = "1NAPU542Lg7DyJYYdYbNFz2JkJJTpT55sKqz1pE-rip8";
const IMAGES_FOLDER_ID = "1DzkzYWKExb_5DjU8mnMMi7C_dmTbNPBZ";

const SETTINGS_SHEET = "Settings";
const REVIEWS_SHEET = "Reviews";
const REVIEW_HEADERS = [
  "id",
  "quote",
  "name",
  "place",
  "rating",
  "review",
  "photo_url",
  "created_at",
  "status",
];

/** Visible on website when status is empty, show, yes, published, etc. */
function isReviewVisible_(status) {
  var s = String(status || "")
    .trim()
    .toLowerCase();
  if (!s) return true;
  if (
    s === "hide" ||
    s === "hidden" ||
    s === "no" ||
    s === "0" ||
    s === "false" ||
    s === "draft" ||
    s === "off" ||
    s === "pending"
  ) {
    return false;
  }
  return true;
}

function normalizeStatus_(value, fallback) {
  var s = String(value || "")
    .trim()
    .toLowerCase();
  if (!s) return fallback || "show";
  if (
    s === "hide" ||
    s === "hidden" ||
    s === "no" ||
    s === "0" ||
    s === "false" ||
    s === "draft" ||
    s === "off" ||
    s === "pending"
  ) {
    return "hide";
  }
  return "show";
}

function json_(payload, statusCode) {
  const output = ContentService.createTextOutput(
    JSON.stringify(payload),
  ).setMimeType(ContentService.MimeType.JSON);
  return output;
}

/** View in Apps Script → Executions → open a run → Logs */
function log_(label, data) {
  var message = label;
  try {
    if (data !== undefined) {
      message =
        label +
        " " +
        (typeof data === "string" ? data : JSON.stringify(data));
    }
  } catch (e) {
    message = label + " [unserializable]";
  }
  // Cap log size — Executions UI truncates very long lines
  if (message.length > 8000) {
    message = message.slice(0, 8000) + "…[truncated]";
  }
  Logger.log(message);
  console.log(message);
}

function summarizeBody_(body) {
  if (!body || typeof body !== "object") return {};
  return {
    action: body.action || "",
    id: body.id || "",
    name: body.name ? String(body.name).slice(0, 40) : "",
    quote: body.quote ? String(body.quote).slice(0, 60) : "",
    place: body.place || "",
    rating: body.rating,
    status: body.status || "",
    key: body.key || "",
    hasToken: Boolean(body.token),
    tokenOk: checkToken_(body.token),
  };
}

function summarizeContent_(content) {
  if (!content) return {};
  return {
    ok: content.ok,
    updatedAt: content.updatedAt,
    reviewCount: (content.reviews && content.reviews.length) || 0,
    meta: content.meta,
    images: {
      hero: Boolean(content.images && content.images.hero),
      about: Boolean(content.images && content.images.about),
      chef: Boolean(content.images && content.images.chef),
    },
    settingKeys: content.settings ? Object.keys(content.settings) : [],
  };
}

function unauthorized_() {
  log_("unauthorized");
  return json_({ ok: false, error: "Unauthorized" });
}

function checkToken_(token) {
  return SCRIPT_SECRET && token === SCRIPT_SECRET;
}

function getSpreadsheet_() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function ensureSheets_() {
  const ss = getSpreadsheet_();
  let settings = ss.getSheetByName(SETTINGS_SHEET);
  if (!settings) {
    settings = ss.insertSheet(SETTINGS_SHEET);
    settings.appendRow(["key", "value"]);
  }
  let reviews = ss.getSheetByName(REVIEWS_SHEET);
  if (!reviews) {
    reviews = ss.insertSheet(REVIEWS_SHEET);
    reviews.appendRow(REVIEW_HEADERS);
  } else if (reviews.getLastRow() === 0) {
    reviews.appendRow(REVIEW_HEADERS);
  } else {
    ensureReviewStatusColumn_(reviews);
  }
  return { ss: ss, settings: settings, reviews: reviews };
}

/** Add status header as last column if the Reviews sheet predates this field. */
function ensureReviewStatusColumn_(reviews) {
  var lastCol = Math.max(reviews.getLastColumn(), 1);
  var headers = reviews
    .getRange(1, 1, 1, lastCol)
    .getValues()[0]
    .map(function (h) {
      return String(h).trim().toLowerCase();
    });
  if (headers.indexOf("status") < 0) {
    reviews.getRange(1, lastCol + 1).setValue("status");
  }
}

function readSettings_() {
  const { settings } = ensureSheets_();
  const values = settings.getDataRange().getValues();
  const map = {};
  for (var i = 1; i < values.length; i++) {
    var key = String(values[i][0] || "").trim();
    var value = String(values[i][1] || "").trim();
    if (key) map[key] = value;
  }
  return map;
}

function readReviews_() {
  const { reviews } = ensureSheets_();
  const values = reviews.getDataRange().getValues();
  if (values.length < 2) return [];

  const headers = values[0].map(function (h) {
    return String(h).trim();
  });
  const rows = [];

  for (var i = 1; i < values.length; i++) {
    var row = {};
    var empty = true;
    for (var c = 0; c < headers.length; c++) {
      var cell = values[i][c];
      var text = cell == null ? "" : String(cell).trim();
      row[headers[c]] = text;
      if (text) empty = false;
    }
    if (!empty && row.quote && row.name) rows.push(row);
  }

  return rows;
}

function extractDriveId_(value) {
  var text = String(value || "").trim();
  if (!text) return "";
  var fromPath = text.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (fromPath) return fromPath[1];
  var fromQuery = text.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (fromQuery) return fromQuery[1];
  if (/^[a-zA-Z0-9_-]{20,}$/.test(text)) return text;
  return "";
}

function driveThumbnail_(fileId, size) {
  if (!fileId) return "";
  return (
    "https://drive.google.com/thumbnail?id=" +
    encodeURIComponent(fileId) +
    "&sz=" +
    (size || "w1920")
  );
}

/** Anyone-with-link view so <img> on the website can load the thumbnail. */
function ensurePublicView_(fileId) {
  if (!fileId) return "";
  try {
    var file = DriveApp.getFileById(fileId);
    file.setSharing(
      DriveApp.Access.ANYONE_WITH_LINK,
      DriveApp.Permission.VIEW,
    );
    log_("ensurePublicView_ ok", fileId);
  } catch (e) {
    log_("ensurePublicView_ failed", String(e));
  }
  return fileId;
}

/**
 * Optional proxy payload (DriveApp only — no UrlFetchApp scope needed).
 * Prefer public thumbnail URLs from resolveImage_ for the website.
 */
function readImagePayload_(fileId) {
  if (!fileId) return { ok: false, error: "Missing file id" };
  try {
    ensurePublicView_(fileId);
    var file = DriveApp.getFileById(fileId);
    var blob = file.getBlob();
    var type = String(blob.getContentType() || "application/octet-stream");
    var bytes = blob.getBytes();
    log_("readImagePayload_ file", {
      id: fileId,
      type: type,
      bytes: bytes.length,
    });
    return {
      ok: true,
      id: fileId,
      contentType: type,
      base64: Utilities.base64Encode(bytes),
      bytes: bytes.length,
      source: "file",
      thumbnail: driveThumbnail_(fileId),
    };
  } catch (error) {
    log_("readImagePayload_ error", String(error));
    return { ok: false, error: String(error) };
  }
}

function findImageInFolder_(baseName) {
  if (!IMAGES_FOLDER_ID || IMAGES_FOLDER_ID.indexOf("PASTE_") === 0) return "";
  try {
    var folder = DriveApp.getFolderById(IMAGES_FOLDER_ID);
    var files = folder.getFiles();
    var needle = String(baseName).toLowerCase();
    while (files.hasNext()) {
      var file = files.next();
      var name = file.getName().toLowerCase();
      var stem = name.replace(/\.[^.]+$/, "");
      if (stem === needle || name.indexOf(needle + ".") === 0) {
        return file.getId();
      }
    }
  } catch (e) {
    // Folder missing or no access
  }
  return "";
}

function resolveImage_(settings, key, folderName) {
  var fromSettings = extractDriveId_(settings[key] || "");
  var fileId = fromSettings || findImageInFolder_(folderName);
  if (!fileId) return "";
  ensurePublicView_(fileId);
  return driveThumbnail_(fileId);
}

function buildContent_() {
  var settings = readSettings_();
  var allReviews = readReviews_();
  var reviews = allReviews.filter(function (r) {
    return isReviewVisible_(r.status);
  });

  var ratings = reviews
    .map(function (r) {
      return Number(r.rating) || 0;
    })
    .filter(function (n) {
      return n > 0;
    });

  var average = ratings.length
    ? ratings.reduce(function (a, b) {
        return a + b;
      }, 0) / ratings.length
    : Number(settings.testimonials_average) || 0;

  return {
    ok: true,
    updatedAt: new Date().toISOString(),
    settings: settings,
    images: {
      hero: resolveImage_(settings, "hero_image", "hero"),
      about: resolveImage_(settings, "about_image", "about"),
      chef: resolveImage_(settings, "chef_image", "chef"),
    },
    reviews: reviews.map(function (r) {
      return {
        id: r.id || Utilities.getUuid(),
        quote: r.quote,
        name: r.name,
        place: r.place || "",
        rating: Math.min(5, Math.max(1, Number(r.rating) || 5)),
        review: r.review || "",
        photo_url: r.photo_url
          ? driveThumbnail_(extractDriveId_(r.photo_url)) || r.photo_url
          : "",
        created_at: r.created_at || "",
        status: normalizeStatus_(r.status, "show"),
      };
    }),
    meta: {
      average: Number(settings.testimonials_average) || average,
      count: Number(settings.testimonials_count) || reviews.length,
    },
  };
}

function findReviewRow_(reviewsSheet, id) {
  var values = reviewsSheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (String(values[i][0]).trim() === String(id).trim()) return i + 1;
  }
  return -1;
}

function createReview_(body) {
  var sheets = ensureSheets_();
  var id = body.id || Utilities.getUuid();
  // Public form submissions default to hide until approved in the sheet
  var status = normalizeStatus_(body.status, "hide");
  sheets.reviews.appendRow([
    id,
    String(body.quote || "").slice(0, 500),
    String(body.name || "").slice(0, 80),
    String(body.place || "").slice(0, 120),
    Number(body.rating) || 5,
    String(body.review || "").slice(0, 500),
    String(body.photo_url || "").slice(0, 500),
    new Date().toISOString(),
    status,
  ]);
  var created = { ok: true, id: id, status: status };
  log_("createReview_", created);
  return created;
}

function updateReview_(body) {
  if (!body.id) return { ok: false, error: "Missing review id" };
  var sheets = ensureSheets_();
  var row = findReviewRow_(sheets.reviews, body.id);
  if (row < 0) return { ok: false, error: "Review not found" };

  var current = sheets.reviews
    .getRange(row, 1, 1, REVIEW_HEADERS.length)
    .getValues()[0];

  var nextStatus =
    body.status != null
      ? normalizeStatus_(body.status, "show")
      : normalizeStatus_(current[8], "show");

  sheets.reviews.getRange(row, 1, 1, REVIEW_HEADERS.length).setValues([
    [
      body.id,
      body.quote != null ? String(body.quote).slice(0, 500) : current[1],
      body.name != null ? String(body.name).slice(0, 80) : current[2],
      body.place != null ? String(body.place).slice(0, 120) : current[3],
      body.rating != null ? Number(body.rating) || current[4] : current[4],
      body.review != null ? String(body.review).slice(0, 500) : current[5],
      body.photo_url != null ? String(body.photo_url).slice(0, 500) : current[6],
      current[7] || new Date().toISOString(),
      nextStatus,
    ],
  ]);

  return { ok: true, id: body.id, status: nextStatus };
}

function deleteReview_(body) {
  if (!body.id) return { ok: false, error: "Missing review id" };
  var sheets = ensureSheets_();
  var row = findReviewRow_(sheets.reviews, body.id);
  if (row < 0) return { ok: false, error: "Review not found" };
  sheets.reviews.deleteRow(row);
  return { ok: true, id: body.id };
}

function upsertSetting_(key, value) {
  var sheets = ensureSheets_();
  var values = sheets.settings.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (String(values[i][0]).trim() === key) {
      sheets.settings.getRange(i + 1, 2).setValue(value);
      return { ok: true, key: key };
    }
  }
  sheets.settings.appendRow([key, value]);
  return { ok: true, key: key };
}

function doGet(e) {
  try {
    var params = (e && e.parameter) || {};
    log_("doGet request", {
      action: params.action || "content",
      hasToken: Boolean(params.token),
      tokenOk: checkToken_(params.token),
    });

    if (!checkToken_(params.token)) return unauthorized_();

    var action = params.action || "content";
    if (action === "content" || action === "read") {
      var full = buildContent_();
      log_("doGet content result", summarizeContent_(full));
      return json_(full);
    }
    if (action === "reviews") {
      var content = buildContent_();
      var payload = {
        ok: true,
        reviews: content.reviews,
        meta: content.meta,
      };
      log_("doGet reviews result", {
        ok: true,
        reviewCount: content.reviews.length,
        meta: content.meta,
        names: content.reviews.map(function (r) {
          return r.name + " [" + (r.status || "show") + "]";
        }),
      });
      return json_(payload);
    }
    if (action === "setup") {
      ensureSheets_();
      log_("doGet setup ok");
      return json_({ ok: true, message: "Sheets ready" });
    }
    if (action === "image") {
      var imagePayload = readImagePayload_(String(params.id || "").trim());
      log_("doGet image result", {
        ok: imagePayload.ok,
        id: imagePayload.id || params.id || "",
        contentType: imagePayload.contentType || "",
        bytes: imagePayload.bytes || 0,
        error: imagePayload.error || "",
        source: imagePayload.source || "",
        thumbnail: imagePayload.thumbnail || "",
      });
      return json_(imagePayload);
    }
    log_("doGet unknown action", action);
    return json_({ ok: false, error: "Unknown action" });
  } catch (error) {
    log_("doGet error", String(error));
    if (error && error.stack) log_("doGet stack", error.stack);
    return json_({ ok: false, error: String(error) });
  }
}

function doPost(e) {
  try {
    var body = {};
    if (e && e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    }
    log_("doPost request", summarizeBody_(body));

    if (!checkToken_(body.token)) return unauthorized_();

    var action = body.action || "create";
    var result;

    if (action === "create") result = createReview_(body);
    else if (action === "update") result = updateReview_(body);
    else if (action === "delete") result = deleteReview_(body);
    else if (action === "setting")
      result = upsertSetting_(String(body.key || ""), String(body.value || ""));
    else if (action === "content") {
      var fullPost = buildContent_();
      log_("doPost content result", summarizeContent_(fullPost));
      return json_(fullPost);
    } else result = { ok: false, error: "Unknown action" };

    log_("doPost result", result);
    return json_(result);
  } catch (error) {
    log_("doPost error", String(error));
    if (error && error.stack) log_("doPost stack", error.stack);
    return json_({ ok: false, error: String(error) });
  }
}
