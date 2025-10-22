import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLoginMutation } from "@/store/services/authSlice";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ReusableCard from "@/components/ui/cards";
import { Eye, EyeOff } from "lucide-react";

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      await login({
        email: values.email,
        password: values.password,
      }).unwrap();
      navigate(ROUTES.APP.DASHBOARD);
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <ReusableCard
        title="Sign in"
        description="Enter your email and password to access your account"
        className="w-full max-w-md"
      >
        <div className="flex flex-col gap-4">
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isLoading}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-sm text-red-600">{formik.errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-sm text-red-600">{formik.errors.password}</p>
              )}
            </div>
          </form>
          <div className="flex flex-col space-y-4">
            <Button
              onClick={() => formik.handleSubmit()}
              type="button"
              className="w-full"
              disabled={isLoading || !formik.isValid}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>

            <div className="text-center w-full text-sm ">
              <div>
                Don't have an account?{" "}
                <Link
                  to={ROUTES.AUTH.REGISTER}
                  className="text-primary hover:underline"
                >
                  Sign up
                </Link>
              </div>
              <div>
                <Link
                  to={ROUTES.AUTH.FORGOT_PASSWORD}
                  className="text-primary hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </ReusableCard>
    </div>
  );
};

export default Login;
