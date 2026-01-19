import PublicHeader from "./PublicHeader";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />
      <div className="container mx-auto py-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
