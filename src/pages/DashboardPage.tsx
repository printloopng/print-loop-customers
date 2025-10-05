import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { logoutUser } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import ReusableCard from "@/components/ui/cards";
import { LogOut, User, Mail, Upload, CreditCard, FileText } from "lucide-react";
import { ROUTES } from "@/constants/routes";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user?.name}
              </span>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* User Info Card */}
            <ReusableCard
              title="User Information"
              description="Your account details"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{user?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{user?.name}</span>
                </div>
              </div>
            </ReusableCard>

            {/* Stats Card */}
            <ReusableCard
              title="Quick Stats"
              description="Your activity overview"
            >
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Projects</span>
                  <span className="text-sm font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Completed Tasks</span>
                  <span className="text-sm font-medium">48</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Pending Items</span>
                  <span className="text-sm font-medium">5</span>
                </div>
              </div>
            </ReusableCard>

            {/* Quick Actions Card */}
            <ReusableCard
              title="Quick Actions"
              description="Start printing or manage your account"
            >
              <div className="space-y-3">
                <Button
                  onClick={() => navigate("/")}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Print Station
                </Button>
                <Button
                  onClick={() => navigate(ROUTES.APP.PRINT_JOBS)}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  My Print Jobs
                </Button>
                <Button
                  onClick={() => navigate(ROUTES.APP.WALLET)}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Manage Wallet
                </Button>
              </div>
            </ReusableCard>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
