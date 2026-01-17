"use client";

import React, { useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Lock } from "lucide-react";
import { AuthInput } from "@/components/ui/AuthInput";
import { AuthButton } from "@/components/ui/AuthButton";
import { AuthHeader } from "@/components/ui/AuthHeader";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/Store";
import { setStep, updateForm } from "@/store/services/authSlice";
import { toast } from "sonner";
import { useResetPasswordMutation } from "@/store/services/authApi";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createResetPasswordSchema,
  ResetPasswordInput,
} from "@/lib/schemas/authSchema";

interface ResetPasswordFormProps {
  onSuccess?: () => void;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  onSuccess,
}) => {
  const t = useTranslations("Auth.resetPassword");
  const locale = useLocale();
  const dispatch = useDispatch();
  const { formData } = useSelector((state: RootState) => state.auth);

  const [
    resetPassword,
    {
      isLoading: isPending,
      isError,
      error: apiError,
      isSuccess,
      data: resetData,
    },
  ] = useResetPasswordMutation();

  const tSchema = (key: string) => t(key);
  const schema = createResetPasswordSchema(tSchema);

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      phone: formData.phoneNumber || "",
      new_password: "",
      new_password_confirmation: "",
    },
    mode: "onChange",
  });

  const {
    handleSubmit,
    formState: { errors, isValid },
    register,
  } = form;

  useEffect(() => {
    if (isSuccess && resetData) {
      toast.success(t("title"), {
        description: resetData.message || "Password reset successfully",
      });
      // Clear the verification purpose and go back to login
      dispatch(updateForm({ verificationPurpose: "default" }));
      dispatch(setStep("LOGIN"));
    } else if (isError) {
      console.log(apiError);
      const errorMessage =
        isError &&
        "data" in (apiError as any) &&
        (apiError as any).data?.message
          ? (apiError as any).data.message
          : null;
      toast.error(errorMessage);
    }
  }, [isSuccess, isError, resetData, apiError, t, dispatch, onSuccess]);

  const onSubmit = async (data: ResetPasswordInput) => {
    try {
      await resetPassword({
        phone: formData.phoneNumber,
        new_password: data.new_password,
        new_password_confirmation: data.new_password_confirmation,
        lang: locale,
      }).unwrap();
    } catch {}
  };

  return (
    <div className="w-full px-4 py-10 md:p-10 bg-white rounded-2xl">
      <AuthHeader title={t("title")} subtitle={t("subtitle")} />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 xl:space-y-2"
      >
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
          error={errors.new_password_confirmation?.message}
          {...register("new_password_confirmation")}
        />

        <AuthButton type="submit" loading={isPending} disabled={!isValid}>
          {t("submit")}
        </AuthButton>
      </form>
    </div>
  );
};
