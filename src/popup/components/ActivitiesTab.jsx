import React from "react";

function ActivitiesTab({ data = [] }) {
  const handleDelete = (id) => {
    chrome.runtime.sendMessage({
      type: "DELETE_RECORD",
      payload: {
        entity: "activities",
        id,
      },
    });
  };

  if (!Array.isArray(data) || data.length === 0) {
    return <p className="text-sm text-gray-500">No activities</p>;
  }

  return (
    <ul className="space-y-2">
      {data.map((activity) => (
        <li
          key={activity.id}
          className="flex justify-between items-center border p-2 rounded"
        >
          <span>{activity.summary || "Untitled activity"}</span>

          <button
            onClick={() => handleDelete(activity.id)}
            className="text-red-600 text-sm hover:underline"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}

export default ActivitiesTab;
