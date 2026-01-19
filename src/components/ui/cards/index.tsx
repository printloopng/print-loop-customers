import React from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface ReusableCardProps {
  title?: string;
  description?: string | React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  variant?: "default" | "outlined" | "elevated";
  size?: "default" | "sm" | "lg" | "xl" | "2xl";
}

const ReusableCard: React.FC<ReusableCardProps> = ({
  title,
  description,
  children,
  className,
  size = "default",
  variant = "default",
}) => {
  const variants = {
    default: "",
    outlined: "border-2",
    elevated: "shadow-lg",
  };

  const sizes = {
    default: "",
    sm: "max-w-sm",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };

  const rounded = {
    default: "rounded",
    sm: "rounded-lg",
    lg: "rounded-xl",
    xl: "rounded-2xl",
    "2xl": "rounded-3xl",
  };
  return (
    <Card className={cn(variants[variant], sizes[size], rounded[size], className)}>
      {(title || description) && (
        <CardHeader>
          {title && (
            <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          )}
          {description && (
            <CardDescription className="text-sm text-gray-500">
              {description}
            </CardDescription>
          )}
        </CardHeader>
      )}

      {children && <CardContent>{children}</CardContent>}
    </Card>
  );
};

export default ReusableCard;
