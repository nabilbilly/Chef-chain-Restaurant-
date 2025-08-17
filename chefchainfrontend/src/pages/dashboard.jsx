// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      setError("No access token found. Please log in.");
      return;
    }

    axios
      .get("http://127.0.0.1:8000/test/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setMessage(res.data.message || "Connected to backend successfully!");
      })
      .catch((err) => {
        setError(err.response?.data?.detail || "Error connecting to backend.");
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-4">
        {message && <span className="text-green-600">{message}</span>}
        {error && <span className="text-red-600">{error}</span>}
      </p>
    </div>
  );
}
