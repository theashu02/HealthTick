import React from "react";
import { cn } from "@/lib/utils";

const colorClasses = {
  primary: "text-primary",
  secondary: "text-secondary",
  muted: "text-muted-foreground",
};

export interface LoaderProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "spinner" | "pulse" | "dots" | "skeleton" | "progress";
  color?: "primary" | "secondary" | "muted";
  className?: string;
}

const DotsLoader = ({ size = "md", color = "primary", className }: LoaderProps) => {
  const dotSize = {
    sm: "h-1 w-1",
    md: "h-2 w-2",
    lg: "h-3 w-3",
    xl: "h-4 w-4",
  };

  return (
    <div className={`cn("flex space-x-1", className) w-screen h-screen flex items-center justify-center space-x-3`}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            "rounded-full animate-bounce space-x-4",
            dotSize["xl"],
            color === "primary" && "bg-primary",
            color === "secondary" && "bg-secondary",
            color === "muted" && "bg-muted-foreground"
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
};

export const Loader: React.FC<LoaderProps> = ({
  variant = "spinner",
  ...props
}) => {
  return <DotsLoader {...props} />;
};
