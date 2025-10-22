import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/hooks/redux";
import { ROUTES } from "@/constants/routes";

const AuthRoute = () => {
  const { accessToken } = useAppSelector((state) => state.auth);

  if (accessToken) {
    return <Navigate to={ROUTES.APP.DASHBOARD} replace />;
  }

  return <Outlet />;
};

export default AuthRoute;
