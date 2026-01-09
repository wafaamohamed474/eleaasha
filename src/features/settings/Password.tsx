"use client";

import { useTranslations, useLocale } from "next-intl";
import { AuthButton } from "@/components/ui/AuthButton";
import { AuthInput } from "@/components/ui/AuthInput";
import { useState } from "react";
import BackButton from "@/components/molecules/BackButton";
import { Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createPasswordSchema,
  type PasswordInput,
} from "@/lib/schemas/authSchema";
import SectionHeader from "@/components/atoms/SectionHeader";
import { useChangePasswordMutation } from "@/store/services/authApi";
import { toast } from "sonner";

export default function Password() {
  const t = useTranslations("Auth.Password");
  const tSidebar = useTranslations("sidebar");
  const locale = useLocale();
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<PasswordInput>({
    resolver: zodResolver(createPasswordSchema(t)),
  });

  const onSubmit = async (data: PasswordInput) => {
    try {
      const response = await changePassword({ ...data, lang: locale }).unwrap();
      toast.success(
        response.message ||
          (locale === "ar"
            ? "تم تغيير كلمة المرور بنجاح"
            : "Password changed successfully")
      );
      reset();
    } catch (error: any) {
      console.log(error);
      toast.error(
        error?.data?.message ||
          (locale === "ar"
            ? "فشل تغيير كلمة المرور"
            : "Failed to change password")
      );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Mobile Header */}
      <BackButton title={tSidebar("changePassword")} />
      <div className="sec-class flex flex-col items-center">
        <div className="w-full max-w-md">
          <SectionHeader title={tSidebar("changePassword")} />
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 py-5">
            <AuthInput
              label={t("currentPassword")}
              icon={Lock}
              isPassword
              placeholder={t("currentPasswordPlaceholder")}
              error={errors.current_password?.message}
              {...register("current_password")}
            />
            <AuthInput
              label={t("newPassword")}
              icon={Lock}
              isPassword
              placeholder={t("newPasswordPlaceholder")}
              error={errors.new_password?.message}
              {...register("new_password")}
            />
            <AuthInput
              label={t("confirmPassword")}
              icon={Lock}
              isPassword
              placeholder={t("confirmPasswordPlaceholder")}
              error={errors.confirm_password?.message}
              {...register("confirm_password")}
            />

            <div className="">
              <AuthButton
                type="submit"
                loading={isLoading}
                disabled={isLoading || !isDirty}
                className="w-full bg-(--primary)"
              >
                {t("submit")}
              </AuthButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
