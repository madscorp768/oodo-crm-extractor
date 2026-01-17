
console.log("Odoo content script loaded");

// ================= Shadow DOM Indicator =================
let indicatorHost = null;
let indicatorShadow = null;

function showIndicator(text) {
  if (indicatorHost) return;

  indicatorHost = document.createElement("div");
  indicatorHost.style.position = "fixed";
  indicatorHost.style.bottom = "20px";
  indicatorHost.style.right = "20px";
  indicatorHost.style.zIndex = "999999";

  indicatorShadow = indicatorHost.attachShadow({ mode: "open" });
  indicatorShadow.innerHTML = `
    <style>
      .indicator {
        background: #1f2937;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-family: system-ui;
      }
    </style>
    <div class="indicator">${text}</div>
  `;

  document.body.appendChild(indicatorHost);
}

function updateIndicator(text) {
  const el = indicatorShadow?.querySelector(".indicator");
  if (el) el.textContent = text;
}

function removeIndicator() {
  indicatorHost?.remove();
  indicatorHost = null;
  indicatorShadow = null;
}

// ================= Opportunities (Kanban) =================
function extractOpportunities() {
  const cards = document.querySelectorAll(".o_kanban_record");
  console.log("Found kanban cards:", cards.length);

  const opportunities = [];

  cards.forEach((card) => {
    // ✅ Prefer real backend ID
    let id =
      card.dataset.resId ||
      card.getAttribute("data-res-id") ||
      null;

    // ❌ Reject OWL datapoint IDs
    if (!id || id.startsWith("datapoint")) {
      // Fallback to stable semantic ID
      const name =
        card.querySelector("span.fw-bold.fs-5")?.innerText?.trim() ||
        card.querySelector("span")?.innerText?.trim() ||
        "Unknown";

      const column = card.closest(".o_kanban_group");
      const stage =
        column?.querySelector(".o_kanban_header_title")?.innerText?.trim() ||
        "";

      id = `opp_${hashString(`${name}|${stage}`)}`;
    }

    const name =
      card.querySelector("span.fw-bold.fs-5")?.innerText?.trim() ||
      card.querySelector("span")?.innerText?.trim() ||
      "Unknown";

    const column = card.closest(".o_kanban_group");
    const stage =
      column?.querySelector(".o_kanban_header_title")?.innerText?.trim() ||
      "";

    opportunities.push({
      id,
      name,
      stage,
      updatedAt: Date.now(),
    });
  });

  return opportunities;
}

// ================= Contacts (List View) =================
function extractContacts() {
  const rows = document.querySelectorAll(".o_list_view tbody tr");
  console.log("Found contact rows:", rows.length);

  const contacts = [];

  rows.forEach((row) => {
    const id = row.dataset.id || row.dataset.resId;
    if (!id) return;

    const cells = row.querySelectorAll("td");

    contacts.push({
      id,
      name: cells[0]?.innerText?.trim() || "Unknown",
      email: cells[1]?.innerText?.trim() || "",
      phone: cells[2]?.innerText?.trim() || "",
      company: cells[3]?.innerText?.trim() || "",
      updatedAt: Date.now(),
    });
  });

  return contacts;
}

// ================= Activities (Chatter – Contextual) =================
function extractActivities() {
  const activityEls = document.querySelectorAll(".o_activity");
  console.log("Found activities:", activityEls.length);

  const activities = [];

  activityEls.forEach((el) => {
    const summary =
      el.querySelector(".o_activity_summary")?.innerText?.trim() ||
      el.innerText?.trim().split("\n")[0] ||
      "";

    const due =
      el.querySelector(".o_activity_date")?.innerText?.trim() || "";

    // ✅ Stable, deterministic ID
    const stableIdSource = `${summary}|${due}`;
    const id = `activity_${hashString(stableIdSource)}`;

    activities.push({
      id,
      summary,
      due,
      updatedAt: Date.now(),
    });
  });

  return activities;
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

function runExtraction() {
  try {
    showIndicator("Extracting CRM data...");

    // Opportunities (Kanban)
    const opportunities = extractOpportunities();

    // Contacts only when list view exists
    const hasListView = document.querySelector(".o_list_view");
    const contacts = hasListView ? extractContacts() : [];

    // Activities are contextual (chatter)
    const activities = extractActivities();

    chrome.runtime.sendMessage({
      type: "EXTRACTION_RESULT",
      payload: {
        contacts,
        opportunities,
        activities,
        timestamp: Date.now(),
      },
    });

    updateIndicator("Extraction complete");
    setTimeout(removeIndicator, 1500);
  } catch (err) {
    console.error("Extraction failed:", err);
    updateIndicator("Extraction failed");
    setTimeout(removeIndicator, 2000);
  }
}

// ================= Message Listener =================
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "START_EXTRACTION") {
    runExtraction();
  }
});
