"use client";

import React, { useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Phone, Lock } from "lucide-react";
import { AuthInput } from "@/components/ui/AuthInput";
import { AuthButton } from "@/components/ui/AuthButton";
import { AuthHeader } from "@/components/ui/AuthHeader";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/Store";
import { setStep, updateForm } from "@/store/services/authSlice";
import { toast } from "sonner";
import { useLoginMutation } from "@/store/services/authApi";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLoginSchema, LoginInput } from "@/lib/schemas/authSchema";

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const t = useTranslations("Auth.login");

  const locale = useLocale();
  const dispatch = useDispatch();
  const { formData } = useSelector((state: RootState) => state.auth);

  // Use RTK Query mutatio
  const [
    login,
    {
      isLoading: isPending,
      isError,
      error: apiError,
      isSuccess,
      data: loginData,
    },
  ] = useLoginMutation();

  const tSchema = (key: string) => t(key);
  const schema = createLoginSchema(tSchema);

  const form = useForm<LoginInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      phone: formData.phoneNumber || "",
      password: formData.password || "",
    },
    mode: "onChange",
  });

  const {
    handleSubmit,
    formState: { errors, isValid },
    register,
  } = form;

  useEffect(() => {
    if (isSuccess && loginData) {
      toast.success(t("title"), {
        description: loginData.message || "Login successful",
      });
      const phoneNumber = form.getValues("phone");
      const normalizedPhone = `+966${phoneNumber.replace(/^0/, "")}`;
      dispatch(updateForm({ phoneNumber: normalizedPhone }));
      dispatch(setStep("VERIFICATION"));
    } else if (isError) {
      const errorMessage =
        isError &&
        "data" in (apiError as any) &&
        (apiError as any).data?.message
          ? (apiError as any).data.message
          : null;
      toast.error(errorMessage);
    }
  }, [isSuccess, isError, loginData, apiError, t, dispatch]);

  const onSubmit = async (data: LoginInput) => {
    const normalizedPhone = `+966${data.phone.replace(/^0/, "")}`;
    try {
      await login({
        phone: normalizedPhone,
        password: data.password,
        lang: locale,
      }).unwrap();
    } catch {}
  };

  return (
    <div className="w-full px-4 py-10 md:p-10  bg-white rounded-2xl">
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

        <div className="space-y-1">
          <AuthInput
            label={t("password")}
            icon={Lock}
            isPassword
            placeholder={t("passwordPlaceholder")}
            error={errors.password?.message}
            {...register("password")}
          />
        </div>

        <AuthButton type="submit" loading={isPending} disabled={!isValid}>
          {t("submit")}
        </AuthButton>

        <div className="text-center text-xs text-(--main-text)">
          {t("noAccount")}{" "}
          <button
            type="button"
            onClick={() => dispatch(setStep("REGISTER"))}
            className="text-(--primary) font-bold hover:underline"
          >
            {t("createAccount")}
          </button>
        </div>
      </form>
    </div>
  );
};
