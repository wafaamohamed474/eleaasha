import React, { useEffect, useState, useActionState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { RefreshCcw } from "lucide-react";
import { AuthButton } from "@/components/ui/AuthButton";
import { AuthHeader } from "@/components/ui/AuthHeader";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/Store";
import { updateForm, resetAuth, setStep } from "@/store/services/authSlice";
import { cn } from "@/lib/utils";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  verifyOtpAction,
  resendOtpAction,
} from "@/lib/actions/verificationActions";
import { createVerifySchema, VerifyInput } from "@/lib/schemas/authSchema";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { setAuthTokenClient } from "@/lib/auth/authClient";

interface VerificationFormProps {
  onSuccess?: () => void;
}

export const VerificationForm: React.FC<VerificationFormProps> = ({
  onSuccess,
}) => {
  const t = useTranslations("Auth.verify");
  const locale = useLocale();
  const router = useRouter();
  const dispatch = useDispatch();
  const { formData } = useSelector((state: RootState) => state.auth);
  const [timeLeft, setTimeLeft] = useState(59);
  const [verifyState, verifyFormAction, isVerifyPending] = useActionState(
    verifyOtpAction,
    null,
  );

  const tSchema = (key: string) => t(key);
  const schema = createVerifySchema(tSchema);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    reset,
  } = useForm<VerifyInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      verificationCode: "",
      phone: formData.phoneNumber || "",
    },
    mode: "onChange",
  });

  // Update form when Redux phone changes (e.g. after login/register success)
  useEffect(() => {
    if (formData.phoneNumber) {
      setValue("phone", formData.phoneNumber);
    }
  }, [formData.phoneNumber, setValue]);

  const verificationCode = watch("verificationCode");

  const getTranslatedMessage = (key: string | undefined | null) => {
    if (!key) return "";
    const knownKeys = [
      "successMessage",
      "resendSuccess",
      "incompleteData",
      "verificationError",
      "resendError",
      "genericError",
      "phoneError",
      "otpError",
      "required",
    ];
    return knownKeys.includes(key) ? t(key) : key;
  };

  // Sync Redux
  useEffect(() => {
    if (verificationCode) {
      dispatch(updateForm({ verificationCode }));
    }
  }, [verificationCode, dispatch]);

  useEffect(() => {
    if (verifyState?.success && verifyState.data) {
      toast.success(t("title"), {
        description: getTranslatedMessage(verifyState.message),
      });
      const purpose = formData.verificationPurpose || "default";

      if (purpose === "reset_password") {
        // For password reset, go to reset password form
        dispatch(setStep("RESET_PASSWORD"));
      } else {
        // For default (login/register), set token and go to dashboard
        setAuthTokenClient(verifyState.data.token);
        dispatch(resetAuth());

        router.push(`/${locale}/dashboard`);
      }
    } else if (verifyState?.error) {
      toast.error(getTranslatedMessage(verifyState.error));
    }
  }, [
    verifyState,
    t,
    onSuccess,
    router,
    locale,
    dispatch,
    formData.verificationPurpose,
  ]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const secs = seconds % 60;
    return `${secs.toString().padStart(2, "0")}`;
  };

  const [isResendPending, startResendTransition] = React.useTransition();

  const onResendClick = () => {
    startResendTransition(async () => {
      const fd = new FormData();
      fd.append("phone", formData.phoneNumber);
      fd.append("lang", locale);
      fd.append("purpose", formData.verificationPurpose || "default");
      const res = await resendOtpAction(null, fd);
      if (res.success) {
        toast.success(getTranslatedMessage(res.message));
        setTimeLeft(59);
        setValue("verificationCode", "");
      } else {
        toast.error(getTranslatedMessage(res.error));
      }
    });
  };

  const [isSubmitPending, startSubmitTransition] = React.useTransition();
  const onSubmit = (data: VerifyInput) => {
    startSubmitTransition(() => {
      const fd = new FormData();
      fd.append("verificationCode", data.verificationCode);
      fd.append("phone", data.phone);
      fd.append("lang", locale);
      fd.append("purpose", formData.verificationPurpose || "default");
      console.log("purpose on submit", formData.verificationPurpose);
      verifyFormAction(fd);
    });
  };

  return (
    <div className="w-full px-4 py-10 md:p-10 bg-white rounded-2xl flex flex-col items-center">
      <AuthHeader
        title={t("title")}
        subtitle={t.rich("subtitle", {
          phone: formData.phoneNumber?.slice(3, 5) + "X XXX XXXX",
          highlight: (chunks) => (
            <span className="text-(--primary) font-semibold">{chunks}</span>
          ),
        })}
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full space-y-4 flex flex-col items-center"
      >
        <Controller
          control={control}
          name="verificationCode"
          render={({ field }) => (
            <InputOTP
              maxLength={4}
              value={field.value}
              onChange={field.onChange}
              ref={field.ref}
              onBlur={field.onBlur}
              autoFocus
              className=""
            >
              <InputOTPGroup className="gap-2 md:gap-3 rtl:flex-row-reverse">
                {[0, 1, 2, 3].map((index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className={cn(
                      "w-14 h-14 md:w-16 md:h-16 text-xl md:text-2xl font-bold border-2! rounded-2xl! transition-all duration-300 outline-none flex items-center justify-center",
                      "bg-origin-border [background-clip:padding-box,border-box] [background-image:linear-gradient(white,white),var(--gradient-btn)] border-transparent",
                      "text-slate-300",
                      "data-[active=true]:[background-image:none] data-[active=true]:bg-white data-[active=true]:border-(--primary) data-[active=true]:ring-5 data-[active=true]:ring-(--primary)/10 data-[active=true]:scale-102 data-[active=true]:shadow-sm data-[active=true]:text-(--primary) data-[active=true]:z-10",
                      "data-[status=filled]:[background-image:none] data-[status=filled]:bg-slate-50/50 data-[status=filled]:border-(--secondary)/40 data-[status=filled]:text-(--secondary)",
                      "hover:scale-105",
                    )}
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          )}
        />

        <div className="text-center text-sm text-(--main-text) font-medium">
          {t("timerPrefix")}{" "}
          <span className="text-(--secondary)">{formatTime(timeLeft)}</span>{" "}
          {t("minutes")}
        </div>

        {errors.verificationCode?.message && (
          <p className="text-xs text-red-500 font-medium">
            {errors.verificationCode.message}
          </p>
        )}

        <div className="flex flex-col items-center gap-6 w-full">
          <div className="text-center text-xs md:text-sm text-(--main-text)">
            {t("resendQuestion")}{" "}
            <button
              type="button"
              className="text-(--primary) font-bold hover:underline inline-flex items-center gap-1 disabled:opacity-50"
              onClick={onResendClick}
              disabled={timeLeft > 0 || isResendPending || isVerifyPending}
            >
              <RefreshCcw size={14} className="mt-0.5" />
              {t("resendAction")}
            </button>
          </div>

          <AuthButton
            type="submit"
            loading={isVerifyPending || isSubmitPending}
            disabled={!isValid}
          >
            {t("submit")}
          </AuthButton>
        </div>
      </form>
    </div>
  );
};
