// =======================================================
// Odoo CRM Service Worker (MV3)
// Single writer, deduplicated storage
// =======================================================

let writeQueue = Promise.resolve();

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "EXTRACTION_RESULT") {
    writeQueue = writeQueue.then(() => persistData(msg.payload));
  }

  if (msg.type === "DELETE_RECORD") {
    writeQueue = writeQueue.then(() =>
      deleteRecord(msg.payload.entity, msg.payload.id)
    );
  }
});

// ---------------- Persist & Deduplicate ----------------
async function persistData(payload) {
  const { contacts, opportunities, activities, timestamp } = payload;

  const stored = await chrome.storage.local.get("odoo_data");

  const odooData = stored.odoo_data || {
    contacts: {},
    opportunities: {},
    activities: {},
    lastSync: null,
    lastExtractionStatus: "idle",
  };

  mergeById(odooData.contacts, contacts);
  mergeById(odooData.opportunities, opportunities);
  mergeById(odooData.activities, activities);

  odooData.lastSync = timestamp;
  odooData.lastExtractionStatus = "success";

  await chrome.storage.local.set({ odoo_data: odooData });
}

// ---------------- Delete ----------------
async function deleteRecord(entity, id) {
  const stored = await chrome.storage.local.get("odoo_data");
  if (!stored.odoo_data || !stored.odoo_data[entity]) return;

  delete stored.odoo_data[entity][id];

  await chrome.storage.local.set({
    odoo_data: {
      ...stored.odoo_data,
    },
  });
}

// ---------------- Helpers ----------------
function mergeById(targetMap, items = []) {
  items.forEach((item) => {
    if (!item.id) return;

    targetMap[item.id] = {
      ...targetMap[item.id],
      ...item,
      updatedAt: Date.now(),
    };
  });
}
