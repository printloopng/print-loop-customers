import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store";
import { useAppDispatch } from "@/hooks/redux";
import { checkAuthStatus } from "@/store/slices/authSlice";

// Routes
import AppRoutes from "@/routes";

// App Content Component (needs to be inside Provider)
const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Check authentication status on app load
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
