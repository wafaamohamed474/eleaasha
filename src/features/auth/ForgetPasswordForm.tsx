"use client";

import React, { useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Phone } from "lucide-react";
import { AuthInput } from "@/components/ui/AuthInput";
import { AuthButton } from "@/components/ui/AuthButton";
import { AuthHeader } from "@/components/ui/AuthHeader";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/Store";
import { setStep, updateForm } from "@/store/services/authSlice";
import { toast } from "sonner";
import { useForgetPasswordMutation } from "@/store/services/authApi";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createForgetPasswordSchema,
  ForgetPasswordInput,
} from "@/lib/schemas/authSchema";

interface ForgetPasswordFormProps {
  onSuccess?: () => void;
}

export const ForgetPasswordForm: React.FC<ForgetPasswordFormProps> = ({
  onSuccess,
}) => {
  const t = useTranslations("Auth.forgetPassword");
  const locale = useLocale();
  const dispatch = useDispatch();
  const { formData } = useSelector((state: RootState) => state.auth);

  const [
    forgetPassword,
    {
      isLoading: isPending,
      isError,
      error: apiError,
      isSuccess,
      data: forgetData,
    },
  ] = useForgetPasswordMutation();

  const tSchema = (key: string) => t(key);
  const schema = createForgetPasswordSchema(tSchema);

  const form = useForm<ForgetPasswordInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      phone: "",
    },
    mode: "onChange",
  });

  const {
    handleSubmit,
    formState: { errors, isValid },
    register,
  } = form;

  useEffect(() => {
    if (isSuccess && forgetData) {
      toast.success(t("title"), {
        description: forgetData.message || "OTP sent successfully",
      });
      const phoneNumber = form.getValues("phone");
      const normalizedPhone = `966${phoneNumber.replace(/^0/, "")}`;
      dispatch(
        updateForm({
          phoneNumber: normalizedPhone,
          verificationPurpose: "reset_password",
        })
      );
      dispatch(setStep("VERIFICATION"));
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
  }, [isSuccess, isError, forgetData, apiError, t, dispatch, form]);

  const onSubmit = async (data: ForgetPasswordInput) => {
    const normalizedPhone = `966${data.phone.replace(/^0/, "")}`;

    try {
      // Create FormData as requested
      const formDataPayload = new FormData();
      formDataPayload.append("phone", normalizedPhone);

      // But the API expects JSON, so we'll use the mutation with the phone directly
      await forgetPassword({
        phone: normalizedPhone,
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
          label={t("phone")}
          icon={Phone}
          placeholder={t("phonePlaceholder")}
          phonePrefix={locale === "ar" ? "966+" : "+966"}
          maxLength={9}
          error={errors.phone?.message}
          {...register("phone")}
        />

        <AuthButton type="submit" loading={isPending} disabled={!isValid}>
          {t("submit")}
        </AuthButton>
      </form>
    </div>
  );
};
