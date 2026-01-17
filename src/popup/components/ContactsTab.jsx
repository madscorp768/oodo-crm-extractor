import React from "react";

function ContactsTab({ data = [] }) {
  const handleDelete = (id) => {
    chrome.runtime.sendMessage({
      type: "DELETE_RECORD",
      payload: {
        entity: "contacts",
        id,
      },
    });
  };

  if (!Array.isArray(data) || data.length === 0) {
    return <p className="text-sm text-gray-500">No contacts</p>;
  }

  return (
    <ul className="space-y-2">
      {data.map((contact) => (
        <li
          key={contact.id}
          className="flex justify-between items-center border p-2 rounded"
        >
          <span>
            {contact.name || "Unnamed"}
            {contact.email ? ` (${contact.email})` : ""}
          </span>

          <button
            onClick={() => handleDelete(contact.id)}
            className="text-red-600 text-sm hover:underline"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}

export default ContactsTab;
