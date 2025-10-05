import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardPage from "@/pages/DashboardPage";
import PrintFlowPage from "@/pages/PrintFlowPage";
import PaymentPage from "@/pages/PaymentPage";
import WalletPage from "@/pages/WalletPage";
import PrintJobsPage from "@/pages/PrintJobsPage";

const IndexRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<PrintFlowPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/print-jobs" element={<PrintJobsPage />} />
      </Route>
    </Routes>
  );
};

export default IndexRoutes;
