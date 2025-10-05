import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthRoute from "@/components/auth/AuthRoute";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";

const AuthRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>
    </Routes>
  );
};

export default AuthRoutes;
