const STORAGE_KEY = 'odoo_data';

export async function getOdooData() {
  return new Promise((resolve) => {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
      resolve(
        result[STORAGE_KEY] || {
          contacts: [],
          opportunities: [],
          activities: [],
          lastSync: null
        }
      );
    });
  });
}

export async function saveOdooData(data) {
  return new Promise((resolve) => {
    chrome.storage.local.set(
      {
        [STORAGE_KEY]: data
      },
      resolve
    );
  });
}

// De duplication and merge logic

export function mergeById(existing = [], incoming = []) {
  const map = new Map();

  existing.forEach((item) => {
    map.set(item.id, item);
  });

  incoming.forEach((item) => {
    map.set(item.id, {
      ...map.get(item.id),
      ...item,
      updatedAt: Date.now()
    });
  });

  return Array.from(map.values());
}
