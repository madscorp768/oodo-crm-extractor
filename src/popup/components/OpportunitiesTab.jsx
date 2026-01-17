import React from "react";

function OpportunitiesTab({ data = [] }) {
  const handleDelete = (id) => {
    chrome.runtime.sendMessage({
      type: "DELETE_RECORD",
      payload: {
        entity: "opportunities",
        id,
      },
    });
  };

  if (!Array.isArray(data) || data.length === 0) {
    return <p className="text-sm text-gray-500">No opportunities</p>;
  }

  return (
    <ul className="space-y-2">
      {data.map((opp) => (
        <li
          key={opp.id}
          className="flex justify-between items-center border p-2 rounded"
        >
          <span>
            {opp.name}
            {opp.stage ? ` (${opp.stage})` : ""}
          </span>

          <button
            onClick={() => handleDelete(opp.id)}
            className="text-red-600 text-sm hover:underline"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}

export default OpportunitiesTab;
