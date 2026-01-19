import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/redux";
import { ROUTES } from "@/constants/routes";
import { User, LogIn, Home, LogOut, Wallet } from "lucide-react";
import { useGetProfileDetailsQuery } from "@/store/services/authSlice";
import { logOut } from "@/store/features/auth/authSlice";
import { useDispatch } from "react-redux";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { accessToken } = useAppSelector((state) => state.auth);
  const { data: user } = useGetProfileDetailsQuery({});

  const handleLogout = () => {
    dispatch(logOut());
    navigate(ROUTES.AUTH.LOGIN);
  };
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto ">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-xl "
            >
              PrintLoop
            </Button>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
            >
              <Home className="h-4 " />
              Print Station
            </Button>
            {accessToken && (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate(ROUTES.APP.PRINT_JOBS)}
                >
                  My Print Jobs
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate(ROUTES.APP.WALLET)}
                >
                  <Wallet className="h-4 " />
                  Wallet
                </Button>
              </>
            )}
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center space-x-4">
            {accessToken ? (
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => navigate(ROUTES.APP.DASHBOARD)}
                >
                  <User className="h-4 " />
                  Dashboard
                </Button>
                <Button onClick={handleLogout} variant="outline">
                  <LogOut className="h-4 " />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  onClick={() => navigate(ROUTES.AUTH.LOGIN)}
                >
                  <LogIn className="h-4 " />
                  Sign In
                </Button>
                <Button onClick={() => navigate(ROUTES.AUTH.REGISTER)}>
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
