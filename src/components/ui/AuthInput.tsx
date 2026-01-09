"use client";

import React, { useState } from "react";
import { Eye, EyeOff, LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // I should probably add label as well if not there, but let's see if I have it. Actually npx shadcn add label might be needed.
import { useTranslations } from "next-intl";

interface AuthInputProps extends React.ComponentProps<"input"> {
  label: string;
  icon?: LucideIcon;
  error?: string;
  isPassword?: boolean;
  phonePrefix?: string;
}

export const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
  (
    { label, icon: Icon, error, isPassword, phonePrefix, className, ...props },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="flex flex-col gap-2 w-full">
        <Label className="text-xs font-semibold text-(--label-text)">
          {label}
        </Label>
        <div className="relative flex items-center group">
          {Icon && (
            <div className="absolute start-3 text-(--primary) z-10 transition-colors group-focus-within:text-(--primary)">
              <Icon size={18} />
            </div>
          )}
          <Input
            {...props}
            ref={ref}
            type={
              isPassword ? (showPassword ? "text" : "password") : props.type
            }
            className={`
            h-12 bg-(--input-bg) border-1 border-transparent transition-all duration-200 text-xs md:text-sm lg:text-base
            hover:bg-white hover:border-(--secondary)/20
            focus-visible:bg-white focus-visible:border-(--secondary) focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none
            ${Icon ? " ps-10!" : ""}
            ${isPassword ? "pr-10" : "pr-4"}
            ${phonePrefix ? "pr-10" : " "}
            ${error ? "border-(--error) focus-visible:border-(--error)" : ""}
            ${className || ""}
          `}
          />

          {phonePrefix && (
            <div className="absolute end-3 flex items-center pointer-events-none z-10 h-full">
              <span className="text-(--primary) text-xs font-semibold">
                {phonePrefix}
              </span>
            </div>
          )}

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute end-3 text-(--main-text) hover:text-(--primary) transition-colors z-10"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && (
          <span className="text-xs text-(--error) font-semibold ml-1">
            {error}
          </span>
        )}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";
