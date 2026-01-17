import React, { useEffect, useState } from "react";
import Tabs from "./components/Tabs";
import ExtractButton from "./components/ExtractButton";
import ExportButton from "./components/ExportButton";

/**
 * Normalize storage (maps) -> UI (arrays)
 * This is REQUIRED because service worker stores maps for dedup.
 */
function normalizeOdooData(data) {
  return {
    contacts: Object.values(data.contacts || {}),
    opportunities: Object.values(data.opportunities || {}),
    activities: Object.values(data.activities || {}),
    lastSync: data.lastSync || null,
    lastExtractionStatus: data.lastExtractionStatus || null,
  };
}

function App() {
  const [odooData, setOdooData] = useState({
    contacts: [],
    opportunities: [],
    activities: [],
    lastSync: null,
    lastExtractionStatus: null,
  });

  useEffect(() => {
    // Initial load
    chrome.storage.local.get(["odoo_data"], (result) => {
      if (result.odoo_data) {
        setOdooData(normalizeOdooData(result.odoo_data));
      }
    });

    // Realtime updates
    const listener = (changes, area) => {
      if (area === "local" && changes.odoo_data) {
        setOdooData(normalizeOdooData(changes.odoo_data.newValue));
      }
    };

    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }, []);

  return (
    <div className="p-4 w-[400px] bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Odoo CRM Dashboard
      </h1>

      {/* Buttons */}
      <div className="flex gap-2 mb-4">
        <ExportButton data={odooData} />
        <ExtractButton />
      </div>

      {/* Tabs */}
      <Tabs data={odooData} />

      {/* Metadata */}
      {odooData.lastSync && (
        <p className="mt-2 text-sm text-gray-500">
          Last Sync: {new Date(odooData.lastSync).toLocaleString()}
        </p>
      )}

      {odooData.lastExtractionStatus && (
        <p className="mt-1 text-sm text-gray-500">
          Status: {odooData.lastExtractionStatus}
        </p>
      )}
    </div>
  );
}

export default App;
