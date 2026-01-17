# Odoo CRM Data Extractor (Chrome Extension)

A **Manifest V3 Chrome Extension** that extracts **Contacts, Opportunities, and Activities** from **Odoo CRM**, stores them locally with deduplication, and displays them in a React-based popup dashboard.

This project focuses on **DOM scraping in a modern SPA (Odoo OWL framework)** instead of API integration.

WORKING SS : 
![](Screenshot 2026-01-17 at 07.57.43.png)
---

## Features

- Extract **Opportunities** from CRM Pipeline (Kanban view)
- Extract **Contacts** from List view
- Extract **Activities** from record chatter (contextual)
- Persistent storage using `chrome.storage.local`
- **Idempotent extraction** (no duplicates on repeat or reload)
- React + Tailwind popup UI
- Delete records with persistence
- Export data as JSON / CSV
- Visual extraction indicator using Shadow DOM

---

## Tech Stack

- Chrome Extension (Manifest V3)
- Content Scripts (DOM scraping)
- Service Worker (single-writer storage)
- React + TailwindCSS (popup)
- `chrome.storage.local`

---

## Architecture (High Level)

- **Popup**: UI only (extract, delete, export)
- **Content Script**: Reads DOM and extracts data
- **Service Worker**: Single source of truth, handles deduplication and deletes

This separation avoids MV3 race conditions and ensures stable data flow.

---

## DOM Strategy

- View detection is **DOM-based**, not URL-based
- Kanban: `.o_kanban_record`
- List view: `.o_list_view`
- Activities: `.o_activity`
- Unstable Odoo client-side IDs are avoided
- Stable identifiers are derived using backend IDs or semantic hashing

---

## Storage Model

Data is stored as **ID-keyed maps** to prevent duplication:

```json
{
  "contacts": { "id": { ... } },
  "opportunities": { "id": { ... } },
  "activities": { "id": { ... } }
}
```

The popup normalizes maps → arrays for rendering.

---

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the popup:
   ```bash
   npm run build
   ```
4. Open `chrome://extensions`
5. Enable **Developer Mode**
6. Click **Load unpacked** and select the project root

---

## Usage

1. Open an Odoo CRM page (`/odoo/*`)
2. Navigate to:
   - Pipeline (Opportunities)
   - Contacts List (Contacts)
   - Open any record (Activities)
3. Open the extension popup
4. Click **Extract Now**
5. View, delete, or export data

---

## Limitations

- Contacts extraction assumes default column order
- Activities are extracted per record (chatter-based)
- DOM changes may require re-extraction
- API integration intentionally not used

---

## Demo Tip

Recommended demo flow:
1. Extract opportunities
2. Show popup data
3. Delete a record
4. Refresh popup and page (no duplicates)

---

## Conclusion

This project demonstrates:
- Correct Manifest V3 patterns
- Robust DOM scraping in a SPA
- Safe storage and deduplication
- Clean UI and data flow
