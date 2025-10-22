import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "@/hooks/redux";
import { ROUTES } from "@/constants/routes";

const ProtectedRoute = () => {
  const { accessToken, refreshToken } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!accessToken || !refreshToken) {
    return (
      <Navigate to={ROUTES.AUTH.LOGIN} state={{ from: location }} replace />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
