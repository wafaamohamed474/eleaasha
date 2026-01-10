"use client";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { User, LogOutIcon } from "lucide-react";
import { FaGlobe, FaKey, FaRegTrashAlt, FaToggleOn } from "react-icons/fa";
import { MdPrivacyTip } from "react-icons/md";
import { LuFileSpreadsheet } from "react-icons/lu";
import BackButton from "@/components/molecules/BackButton";
import { SettingMenuItem } from "../molecules/SettingMenuItem";
import { usePathname } from "next/navigation";
import { HiMiniQuestionMarkCircle } from "react-icons/hi2";
import { useGetUserInfoQuery } from "@/store/services/authApi";

import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import UserInfoSkeleton from "../molecules/UserInfoSkeleton";
import ConfirmationDialog from "../molecules/ConfirmationDialog";
import { useState } from "react";

export default function SettingsMenu() {
  const t = useTranslations("sidebar");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const isRTL = locale === "ar";
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false);
  const menuItems = [
    {
      title: t("profile"),
      icon: User,
      href: `/${locale}/dashboard/profile`,
    },
    {
      title: t("changePassword"),
      icon: FaKey,
      href: `/${locale}/dashboard/settings/password`,
    },
    {
      title: t("support"),
      icon: HiMiniQuestionMarkCircle,
      href: `/${locale}/dashboard/settings/support`,
    },
    {
      title: t("terms"),
      icon: LuFileSpreadsheet,
      href: `/${locale}/dashboard/settings/terms`,
    },
    {
      title: t("privacy"),
      icon: MdPrivacyTip,
      href: `/${locale}/dashboard/settings/privacy`,
    },
  ];

  const toggleLanguage = () => {
    const segments = pathname.split("/");
    const newLocale = locale === "en" ? "ar" : "en";
    segments[1] = newLocale;
    const newPath = segments.join("/") || "/";
    router.push(newPath);
  };

  const { data: userInfo, isLoading } = useGetUserInfoQuery(locale);
  return (
    <div className="flex flex-col lg:hidden">
      {/* Mobile-Only Menu: Only visible on screens smaller than lg (desktop) */}
      <BackButton title={t("settings")} />

      <div className="flex flex-col gap-3">
        {/* User Profile Card */}

        <Link
          href={`/${locale}/dashboard/profile`}
          className="bg-white rounded-2xl p-6 border border-gray-50 gap-2 shadow-sm flex items-center justify-start hover:bg-gray-50 transition-colors"
        >
          <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center relative">
            {userInfo?.data?.user?.image ? (
              <Image
                src={userInfo.data.user.image}
                alt={userInfo.data.user.name ?? "User"}
                fill
                className="object-cover"
              />
            ) : (
              <User size={32} className="text-gray-400" />
            )}
          </div>
          {isLoading ? (
            <UserInfoSkeleton />
          ) : (
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-sm text-gray-900 text-start">
                {userInfo?.data?.user?.name}
              </span>
              <span className="text-xs text-gray-400 text-start">
                {userInfo?.data?.user?.phone}
              </span>
            </div>
          )}
        </Link>

        <SettingMenuItem
          label={locale === "en" ? "Language" : "اللغة"}
          icon={<FaGlobe className="w-5" />}
          onClick={toggleLanguage}
          showArrow={false}
          trailing={<FaToggleOn className="text-2xl text-gray-400" />}
        />
        {/* Settings Menu */}

        {menuItems.map((item, idx) => (
          <div key={idx}>
            <SettingMenuItem
              icon={<item.icon className="w-5" />}
              label={item.title}
              href={item.href}
            />
          </div>
        ))}

        {/* Logout */}

        <SettingMenuItem
          icon={<LogOutIcon className={`w-5 ${!isRTL && "rotate-180"} `} />}
          label={t("logout")}
          onClick={() => setLogoutDialogOpen(true)}
          showArrow={false}
        />

        {/* Delete Account */}
        <SettingMenuItem
          icon={<FaRegTrashAlt className="w-5" />}
          label={t("deleteAccount")}
          onClick={() => setDeleteAccountDialogOpen(true)}
          showArrow={false}
          color="text-red-500"
        />
      </div>

      {/* Logout Confirmation Dialog */}
      <ConfirmationDialog
        open={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
        title={t("logoutConfirm.title")}
        description={t("logoutConfirm.description")}
        confirmText={t("logoutConfirm.confirm")}
        cancelText={t("logoutConfirm.cancel")}
        onConfirm={() => {
          // TODO: Implement logout logic
          console.log("Logout confirmed");
          setLogoutDialogOpen(false);
        }}
        variant="destructive"
      />

      {/* Delete Account Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteAccountDialogOpen}
        onOpenChange={setDeleteAccountDialogOpen}
        title={t("deleteAccountConfirm.title")}
        description={t("deleteAccountConfirm.description")}
        confirmText={t("deleteAccountConfirm.confirm")}
        cancelText={t("deleteAccountConfirm.cancel")}
        onConfirm={() => {
          // TODO: Implement delete account logic
          console.log("Delete account confirmed");
          setDeleteAccountDialogOpen(false);
        }}
        variant="destructive"
      />
    </div>
  );
}
