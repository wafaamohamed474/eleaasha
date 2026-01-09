"use client";
import { useTranslations, useLocale } from "next-intl";
import { LangSwitch } from "../molecules/LangSwitch";
import NotificationsBtn from "../molecules/NotificationsBtn";
import { useGetUserInfoQuery } from "@/store/services/authApi";
import UserInfoSkeleton from "../molecules/UserInfoSkeleton";

export default function DashboardNavbar() {
  const t = useTranslations("Dashboard");
  const locale = useLocale();

  const { data: userInfo, isLoading } = useGetUserInfoQuery(locale);
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-white/80 backdrop-blur shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          {isLoading ? (
            <UserInfoSkeleton />
          ) : (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-(--secondary)">
                {t("welcome")} {userInfo?.data?.user?.name}
              </span>
              <span className="text-xs text-(--secondary-text)">
                {userInfo?.data?.user?.Company_name}
              </span>
            </div>
          )}
        </div>

        {/* Left: Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notifications */}
          <NotificationsBtn />
          {/* Language Switch */}
          <div className="hidden lg:block">
            <LangSwitch />
          </div>
        </div>
      </div>
    </header>
  );
}
