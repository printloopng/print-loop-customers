import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Layout from "@/components/layout/layout";
import PrintFlow from "@/pages/PrintFlow";
import Dashboard from "@/pages/Dashboard";
import Payments from "@/pages/Payments";
import Wallet from "@/pages/Wallet";
import PrintJobs from "@/pages/PrintJobs";
import PaymentPage from "@/pages/Payment";

const IndexRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<PrintFlow />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/payments/:paymentId" element={<PaymentPage />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/print-jobs" element={<PrintJobs />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default IndexRoutes;
