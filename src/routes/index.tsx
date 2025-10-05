import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthRoutes from "./auth.routes";
import IndexRoutes from "./index.routes";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/auth/*" element={<AuthRoutes />} />

      {/* Main App Routes */}
      <Route path="/*" element={<IndexRoutes />} />
    </Routes>
  );
};

export default AppRoutes;
