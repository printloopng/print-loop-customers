import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store";
import { Toaster } from "@/components/layout/Toast";
import AppRoutes from "@/routes";

const AppContent: React.FC = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Toaster />
      <AppContent />
    </Provider>
  );
};

export default App;
