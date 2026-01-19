import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ReusableCard from "@/components/ui/cards";
import { User, Mail, Upload, CreditCard, FileText } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { useGetProfileDetailsQuery } from "@/store/services/authSlice";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data: user } = useGetProfileDetailsQuery({});

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-10">
      {/* User Info Card */}
      <ReusableCard title="User Information" description="Your account details">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{user?.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="text-sm">
              {user?.lastName} {user?.firstName}
            </span>
          </div>
        </div>
      </ReusableCard>

      {/* Stats Card */}
      <ReusableCard title="Quick Stats" description="Your activity overview">
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
            <Upload className="h-4 " />
            Print Station
          </Button>
          <Button
            onClick={() => navigate(ROUTES.APP.PRINT_JOBS)}
            className="w-full justify-start"
            variant="outline"
          >
            <FileText className="h-4 " />
            My Print Jobs
          </Button>
          <Button
            onClick={() => navigate(ROUTES.APP.WALLET)}
            className="w-full justify-start"
            variant="outline"
          >
            <CreditCard className="h-4 " />
            Manage Wallet
          </Button>
        </div>
      </ReusableCard>
    </div>
  );
};

export default Dashboard;
