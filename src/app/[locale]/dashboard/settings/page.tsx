"use client";
import SettingsMenu from "@/components/organisms/SettingsMenu";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { IoMdSettings } from "react-icons/io";

export default function Settings() {
  const t = useTranslations("sidebar");
  const locale = useLocale();
  const router = useRouter();

  return (
    <>
      <SettingsMenu />

      {/* Desktop-Only Landing View: Only visible on large screens */}
      <div className="hidden lg:flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-gray-200 w-full">
        <div className="w-20 h-20 bg-(--item-hover) text-(--secondary) rounded-full flex items-center justify-center mb-4">
          <IoMdSettings size={40} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {locale === "ar" ? "إعدادات الحساب" : "Account Settings"}
        </h2>
        <p className="text-gray-500 max-w-md mx-auto mb-8">
          {locale === "ar"
            ? "يرجى اختيار أحد الخيارات من القائمة الجانبية لإدارة إعدادات حسابك وتفضيلاتك."
            : "Please select an option from the sidebar to manage your account settings and preferences."}
        </p>
        <button
          onClick={() => router.push(`/${locale}/dashboard/settings/password`)}
          className="px-6 py-2.5 bg-(--primary) text-white rounded-xl font-bold hover:bg-(--primary)/90 transition-all active:scale-95"
        >
          {t("changePassword")}
        </button>
      </div>
    </>
  );
}
