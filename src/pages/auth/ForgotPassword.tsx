import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ReusableCard from "@/components/ui/cards";
import { ArrowLeft, Mail } from "lucide-react";
import { useForgotPasswordMutation } from "@/store/services/authSlice";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

const ForgotPassword: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await forgotPassword({ email: values.email }).unwrap();
        setIsSubmitted(true);
      } catch {
        toast.error("Failed to send reset link. Please try again.");
      }
    },
  });

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <ReusableCard
          title="Check your email"
          description={
            <div className="flex flex-col gap-4">
              <span>
                We've sent a password reset link to{" "}
                <strong>{formik.values.email}</strong>
              </span>
            </div>
          }
          className="w-full max-w-md text-center"
        >
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-green-600" />
          </div>
          <Alert>
            <AlertDescription>
              If you don't see the email, check your spam folder or try again.
            </AlertDescription>
          </Alert>{" "}
          <div className="flex flex-col space-y-4">
            <Button
              onClick={() => {
                setIsSubmitted(false);
                formik.resetForm();
              }}
              variant="outline"
              className="w-full"
            >
              Try another email
            </Button>
            <div className="text-center text-sm">
              <Link
                to={ROUTES.AUTH.LOGIN}
                className="text-primary hover:underline"
              >
                Back to sign in
              </Link>
            </div>
          </div>
        </ReusableCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <ReusableCard
        title="Forgot Password"
        description="Enter your email address and we'll send you a link to reset your password"
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
          </form>
          <div className="flex flex-col space-y-4">
            <Button
              onClick={() => formik.handleSubmit()}
              type="button"
              className="w-full"
              disabled={isLoading || !formik.isValid}
            >
              {isLoading ? "Sending reset link..." : "Send Reset Link"}
            </Button>

            <div className="text-center text-sm">
              <Link
                to={ROUTES.AUTH.LOGIN}
                className="text-primary hover:underline flex items-center justify-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </ReusableCard>
    </div>
  );
};

export default ForgotPassword;
