import React, { useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Phone, Lock, User, Building2 } from "lucide-react";
import { AuthInput } from "@/components/ui/AuthInput";
import { AuthButton } from "@/components/ui/AuthButton";
import { AuthHeader } from "@/components/ui/AuthHeader";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/Store";
import { setStep, updateForm } from "@/store/services/authSlice";
import { toast } from "sonner";
import { useRegisterMutation } from "@/store/services/authApi";
import { createRegisterSchema, RegisterInput } from "@/lib/schemas/authSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const RegisterForm: React.FC = () => {
  const t = useTranslations("Auth.register");

  const locale = useLocale();
  const dispatch = useDispatch();
  const { formData } = useSelector((state: RootState) => state.auth);

  // Use RTK Query mutation
  const [
    registerUser,
    {
      isLoading: isPending,
      isError,
      error: apiError,
      isSuccess,
      data: registerData,
    },
  ] = useRegisterMutation();

  const tSchema = (key: string) => t(key);
  const schema = createRegisterSchema(tSchema);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<RegisterInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      company_name: formData.companyName || "",
      name: formData.cateringManagerName || "",
      phone: formData.phoneNumber || "",
      password: formData.password || "",
    },
    mode: "onChange",
  });
  useEffect(() => {
    if (isSuccess && registerData) {
      toast.success(t("title"), {
        description: registerData.message || "Registration successful",
      });
      const phoneNumber = watch("phone");
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
  }, [isSuccess, isError, registerData, apiError, t, dispatch]);

  const onSubmit = async (data: RegisterInput) => {
    const normalizedPhone = `+966${data.phone.replace(/^0/, "")}`;
    try {
      await registerUser({
        company_name: data.company_name,
        name: data.name,
        phone: normalizedPhone,
        password: data.password,
        lang: locale,
      }).unwrap();
    } catch {
      // Handled in useEffect
    }
  };

  return (
    <div className="w-full px-4 py-10 md:p-10  bg-white rounded-2xl">
      <AuthHeader title={t("title")} subtitle={t("subtitle")} />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 xl:space-y-2  "
      >
        <AuthInput
          label={t("companyName")}
          icon={Building2}
          placeholder={t("companyNamePlaceholder")}
          error={errors.company_name?.message}
          {...register("company_name")}
        />

        <AuthInput
          label={t("managerName")}
          icon={User}
          placeholder={t("managerNamePlaceholder")}
          error={errors.name?.message}
          {...register("name")}
        />

        <AuthInput
          label={t("phone")}
          icon={Phone}
          placeholder={t("phonePlaceholder")}
          phonePrefix="+966"
          error={errors.phone?.message}
          maxLength={9}
          {...register("phone")}
        />

        <AuthInput
          label={t("password")}
          icon={Lock}
          isPassword
          placeholder={t("passwordPlaceholder")}
          error={errors.password?.message}
          {...register("password")}
        />

        <AuthButton type="submit" loading={isPending} disabled={!isValid}>
          {t("submit")}
        </AuthButton>

        <div className="text-center text-xs text-(--main-text)">
          {t("hasAccount")}{" "}
          <button
            type="button"
            onClick={() => dispatch(setStep("LOGIN"))}
            className="text-(--primary) font-bold hover:underline"
          >
            {t("login")}
          </button>
        </div>
      </form>
    </div>
  );
};
