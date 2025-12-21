"use client";

import React from "react";
import Image from "next/image";

const YourMembers = () => {
  const members = [
    {
      name: "Esthera Jackson",
      id: "533453873",
      image: "data:image/jpeg;base64,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",
    },
    {
      name: "Eva Jackson",
      id: "533453873",
      image: "/images/member2.jpg",
    },
    {
      name: "John Jackson",
      id: "533453873",
      image: "data:image/jpeg;base64,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",
    },
    {
      name: "John Jackson",
      id: "533453873",
      image: "", // intentionally empty to show dummy image fallback
    },
  ];

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-100 w-full max-w-md mx-auto p-6"
      style={{ minHeight: "280px", maxHeight: "280px" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-gray-900 font-semibold text-sm">Your Members</h2>
      </div>

      {/* Check if data exists */}
      {members && members.length > 0 ? (
        <div className="overflow-y-auto max-h-[180px]">
          {members.map((member, index) => (
            <div
              key={index}
              className={`flex items-center justify-between py-3 first:pt-0 last:pb-0 ${index === 0 ? 'border-b border-gray-100' : ''}`}
            >
              <div className="flex items-center space-x-3 ">
                <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
                  <Image
                    src={member.image || "/images/dummy-profile.png"}
                    alt={member.name}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    {member.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    ID - {member.id}
                  </span>
                </div>
              </div>
              <button className="text-xs font-medium text-[#001730] hover:underline">
                View
              </button>
            </div>
          ))}
        </div>
      ) : (
        // Empty state if no data
        <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
          <Image
            src="/images/dummy-profile.png"
            alt="No Members"
            width={80}
            height={80}
            className="mb-3 rounded-full object-cover opacity-70"
          />
          <p>No members available</p>
        </div>
      )}
    </div>
  );
};

export default YourMembers;
