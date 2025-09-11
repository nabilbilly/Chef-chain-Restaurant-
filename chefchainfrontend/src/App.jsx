import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard.jsx";
import Login from "./pages/login.jsx";
import Ordering from "./pages/ordering.jsx";
import RiderPage from "./pages/riderpage";
import Register from "./pages/register.jsx";
import Kitchen from "./pages/kitchen.jsx";
import OrderHistory from "./pages/orderhistory.jsx";
import SimpleOrderHistory from "./pages/simpleorderhistory.jsx";
import UpdateMenu from "./pages/updatemenu.jsx";
import Payment from "./pages/payments.jsx";
import PaymentVerification from "./pages/payment.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/ordering" element={<Ordering />} />
        <Route path="/rider" element={<RiderPage />} />
        <Route path="/kitchen" element={<Kitchen />} />
        <Route path="/orderhistory" element={<OrderHistory />} />
        <Route path="/simpleorderhistory" element={<SimpleOrderHistory />} />
        <Route path="/updatemenu" element={<UpdateMenu />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/paymentverification" element={<PaymentVerification />} />
      
      </Routes>
    </Router>
  );
}
