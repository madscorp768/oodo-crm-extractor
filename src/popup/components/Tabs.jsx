import React, { useState } from "react";
import ContactsTab from "./ContactsTab";
import OpportunitiesTab from "./OpportunitiesTab";
import ActivitiesTab from "./ActivitiesTab";

function Tabs({ data }) {
  const [activeTab, setActiveTab] = useState("contacts");

  return (
    <div>
      {/* Tab headers */}
      <div className="flex border-b mb-3">
        {["contacts", "opportunities", "activities"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 text-sm capitalize ${
              activeTab === tab
                ? "border-b-2 border-blue-600 font-semibold"
                : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "contacts" && (
          <ContactsTab data={data.contacts} />
        )}

        {activeTab === "opportunities" && (
          <OpportunitiesTab data={data.opportunities} />
        )}

        {activeTab === "activities" && (
          <ActivitiesTab data={data.activities} />
        )}
      </div>
    </div>
  );
}

export default Tabs;
