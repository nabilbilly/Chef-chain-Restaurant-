import React from "react";

export default function RiderPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Rider Dashboard</h1>
      <p className="mt-2 text-gray-700">
        Welcome! Here you can view delivery requests, update statuses, and track assigned orders.
      </p>

      <div className="mt-4 space-y-2">
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          View Active Deliveries
        </button>
        <button className="bg-green-500 text-white px-4 py-2 rounded">
          Accept New Delivery
        </button>
      </div>
    </div>
  );
}
