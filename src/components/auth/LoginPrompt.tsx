import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ReusableCard from "@/components/ui/cards";
import { LogIn, User, Lock } from "lucide-react";
import { ROUTES } from "@/constants/routes";

interface LoginPromptProps {
  title?: string;
  description?: string;
  showRegisterLink?: boolean;
}

const LoginPrompt: React.FC<LoginPromptProps> = ({
  title = "Login Required",
  description = "Please log in to continue with your print job",
  showRegisterLink = true,
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto px-4">
        <ReusableCard title={title} className="text-center">
          <div className="space-y-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <LogIn className="h-8 w-8 text-blue-600" />
            </div>

            <div>
              <p className="text-gray-600 mb-4">{description}</p>
              <p className="text-sm text-gray-500">
                Create an account or sign in to access your print jobs, wallet,
                and more.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => navigate(ROUTES.AUTH.LOGIN)}
                className="w-full"
                size="lg"
              >
                <User className="h-4 " />
                Sign In
              </Button>

              {showRegisterLink && (
                <Button
                  variant="outline"
                  onClick={() => navigate(ROUTES.AUTH.REGISTER)}
                  className="w-full"
                >
                  <Lock className="h-4 " />
                  Create Account
                </Button>
              )}
            </div>

            <div className="pt-4 border-t">
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="w-full"
              >
                Continue as Guest (Upload Only)
              </Button>
            </div>
          </div>
        </ReusableCard>
      </div>
    </div>
  );
};

export default LoginPrompt;
