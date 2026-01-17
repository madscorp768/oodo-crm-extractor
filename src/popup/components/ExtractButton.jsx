import React from "react";

function ExtractButton() {
  const handleExtract = async () => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab?.id) return;

      await chrome.tabs.sendMessage(tab.id, {
        type: "START_EXTRACTION",
      });
    } catch (err) {
      // This is the error you're seeing
      alert("Please open an Odoo CRM page before extracting.");
    }
  };

  return (
    <button
      onClick={handleExtract}
      className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Extract Now
    </button>
  );
}

export default ExtractButton;
