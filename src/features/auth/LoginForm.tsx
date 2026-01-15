"use client";

import React, { useEffect, useActionState, startTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Phone, Lock } from "lucide-react";
import { AuthInput } from "@/components/ui/AuthInput";
import { AuthButton } from "@/components/ui/AuthButton";
import { AuthHeader } from "@/components/ui/AuthHeader";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/Store";
import { resetAuth, setStep, updateForm } from "@/store/services/authSlice";
import { toast } from "sonner";
import { loginAction } from "@/lib/actions/loginAction";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLoginSchema, LoginInput } from "@/lib/schemas/authSchema";
import { setAuthTokenClient } from "@/lib/auth/authClient";
import { useRouter } from "next/navigation";

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const t = useTranslations("Auth.login");
  const router = useRouter();
  const locale = useLocale();
  const dispatch = useDispatch();
  const { formData } = useSelector((state: RootState) => state.auth);

  // useActionState from react (React 19)
  const [state, formAction, isPending] = useActionState(loginAction, {
    success: false,
  });

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
    // Save client-side token if returned from server action
    if (state.token) {
      setAuthTokenClient(state.token);
    }

    if (state.success && state.needVerification === false) {
      toast.success(t("title"), {
        description: state.message || "Login successful",
      });
      // Redirect or handle successful login
      if (onSuccess) onSuccess();
      dispatch(resetAuth());
      router.push(`/${locale}/dashboard`);
      // Optional: Redirect to home using router if onSuccess doesn't handle it
    } else if (state.success && state.needVerification === true) {
      // Logic for unverified account
      const phoneNumber = form.getValues("phone");
      const normalizedPhone = `966${phoneNumber.replace(/^0/, "")}`;

      // Update Redux state so VerificationForm has the phone number
      dispatch(updateForm({ phoneNumber: normalizedPhone }));
      dispatch(setStep("VERIFICATION"));

      toast.message(state.message || "Please verify your account");
    } else if (state.message && !state.success) {
      toast.error(state.message);
    }
  }, [state, t, dispatch, onSuccess, form]);

  const onSubmit = (data: LoginInput) => {
    const formData = new FormData();
    formData.append("phone", data.phone);
    formData.append("password", data.password);
    formData.append("lang", locale);

    startTransition(() => {
      formAction(formData);
    });
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
          <div className="text-end">
            <button
              type="button"
              onClick={() => dispatch(setStep("FORGET_PASSWORD"))}
              className="text-xs text-(--primary) font-medium hover:underline"
            >
              {t("forgotPassword")}
            </button>
          </div>
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
