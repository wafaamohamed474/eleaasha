"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "./button";

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "secondary" | "ghost";
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  children,
  loading,
  variant = "primary",
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles = "w-full py-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-smmd:text-base md:font-bold";
  
  const variants: Record<NonNullable<AuthButtonProps["variant"]>, string> = {
    primary: "bg-(--secondary) text-white hover:bg-(--secondary-hover) shadow-lg shadow-primary/20",
    secondary: "bg-white text-(--secondary) border-2 border-(--secondary) hover:bg-(--secondary)/5",
    ghost: "bg-transparent text-(--secondary) hover:bg-(--secondary)/10",
  };

  return (
    <Button
      {...props}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {loading && <Loader2 size={20} className="animate-spin" />}
      {children}
    </Button>
  );
};
