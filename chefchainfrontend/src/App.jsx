import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard.jsx";
import Login from "./pages/login.jsx";
import Ordering from "./pages/ordering.jsx";
import RiderPage from "./pages/riderpage";
import Register from "./pages/register.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/ordering" element={<Ordering />} />
        <Route path="/rider" element={<RiderPage />} />
      
      </Routes>
    </Router>
  );
}
