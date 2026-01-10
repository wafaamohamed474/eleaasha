"use client";

import { usePathname } from "next/navigation";
import Logo from "@/assets/images/AboutImg.png";
import { motion, AnimatePresence } from "framer-motion";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { useLocale, useTranslations } from "next-intl";
import SidebarItem from "../molecules/SidebarItem";
import Image from "next/image";
import { RiBuildingFill } from "react-icons/ri";
import { FaUser, FaKey, FaRegCalendarAlt, FaRegTrashAlt } from "react-icons/fa";
import { MdDashboard, MdPrivacyTip } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { FaCircleQuestion } from "react-icons/fa6";
import { LuFileSpreadsheet } from "react-icons/lu";
import { CiLogin, CiLogout } from "react-icons/ci";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import ConfirmationDialog from "../molecules/ConfirmationDialog";

export default function DashboardSidebar() {
  const t = useTranslations("sidebar");
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const locale = useLocale();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false);

  const mainRoutes = [
    {
      label: t("dashboard"),
      href: `/${locale}/dashboard`,
      icon: MdDashboard,
    },
    {
      label: t("orders"),
      href: `/${locale}/dashboard/orders`,
      icon: FaRegCalendarAlt,
    },
    {
      label: t("profile"),
      href: `/${locale}/dashboard/profile`,
      icon: FaUser,
    },
    {
      label: t("company"),
      href: `/${locale}/dashboard/company`,
      icon: RiBuildingFill,
    },
  ];

  const settingsRoutes = [
    {
      label: t("changePassword"),
      href: `/${locale}/dashboard/settings/password`,
      icon: FaKey,
    },
    {
      label: t("support"),
      href: `/${locale}/dashboard/settings/support`,
      icon: FaCircleQuestion,
    },
    {
      label: t("terms"),
      href: `/${locale}/dashboard/settings/terms`,
      icon: LuFileSpreadsheet,
    },
    {
      label: t("privacy"),
      href: `/${locale}/dashboard/settings/privacy`,
      icon: MdPrivacyTip,
    },
  ];

  if (isMobile) {
    return (
      <MobileTabs
        items={mainRoutes.filter((route) => route.label !== t("profile"))}
        t={t}
        locale={locale}
        pathname={pathname}
      />
    );
  }

  return (
    <Sidebar
      side={locale === "ar" ? "right" : "left"}
      collapsible="icon"
      className="border-e border-(--secondary-foreground)/10 bg-white shadow-xl shadow-(--secondary-foreground)/5"
    >
      {/* -------- Content -------- */}
      <SidebarContent className="px-2 py-6">
        {/* Header / Logo */}
        <div className="flex items-center justify-between mb-8 px-2 min-h-[40px]">
          <div className="flex items-center gap-3 transition-opacity duration-200 group-data-[collapsible=icon]:group-data-[state=collapsed]:hidden">
            <Image src={Logo} alt="Logo" className="w-14 h-14 object-contain" />
          </div>
          <div className="group-data-[collapsible=icon]:group-data-[state=collapsed]:w-full group-data-[collapsible=icon]:group-data-[state=collapsed]:flex group-data-[collapsible=icon]:group-data-[state=collapsed]:justify-center">
            <SidebarTrigger className="w-8 h-8 rounded-lg hover:bg-(--secondary-foreground)/10 text-(--secondary) transition-all active:scale-90" />
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {mainRoutes.map((item) => (
                <SidebarItem
                  key={item.href}
                  {...item}
                  active={pathname === item.href}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings Section */}
        <SidebarGroup className="p-0">
          <SidebarMenuButton
            onClick={() => setSettingsOpen((prev) => !prev)}
            tooltip={t("settings")}
            className={cn(
              "justify-between transition-all px-3 py-2.5 rounded-xl group/item relative h-10",
              pathname.includes("/settings")
                ? "bg-transparent! group-data-[state=expanded]:bg-(--item-hover)! text-(--secondary)!"
                : "text-(--item-text) hover:text-(--secondary) group-data-[state=expanded]:hover:bg-(--item-hover) hover:bg-transparent"
            )}
          >
            <div className="flex items-center gap-3">
              <IoMdSettings
                className={cn(
                  "h-5 w-5 transition-colors group-hover/item:text-(--secondary)",
                  pathname.includes("/settings")
                    ? "text-(--secondary)"
                    : "text-(--item-text) group-hover/item:text-(--secondary)"
                )}
              />
              <span className="font-semibold text-xs group-data-[state=collapsed]:hidden">
                {t("settings")}
              </span>
            </div>

            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform text-(--item-text) group-data-[state=collapsed]:hidden",
                settingsOpen && "rotate-180"
              )}
            />

            {/* Active Indicator for Settings if any sub-item is active but closed */}
            {pathname.includes("/settings") && (
              <div className="absolute start-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-(--secondary) rounded-e-full" />
            )}
          </SidebarMenuButton>

          <AnimatePresence initial={false}>
            {settingsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <SidebarGroupContent>
                  <SidebarMenu className="mt-1">
                    {settingsRoutes.map((item) => (
                      <SidebarItem
                        key={item.href}
                        {...item}
                        active={pathname.startsWith(item.href)}
                        isSettingsItem={true}
                      />
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </motion.div>
            )}
          </AnimatePresence>
        </SidebarGroup>
      </SidebarContent>

      {/* -------- Footer -------- */}
      <SidebarFooter className="border-t border-(--secondary-foreground)/10 p-3 space-y-1">
        <SidebarMenuItem className="list-none">
          <SidebarMenuButton
            onClick={() => setLogoutDialogOpen(true)}
            tooltip={t("logout")}
            className="w-full h-11 px-3 rounded-xl group-data-[state=expanded]:hover:bg-red-50 hover:text-red-600 text-gray-500 transition-all group/logout"
          >
            {locale === "ar" ? (
              <CiLogin className="h-5 w-5 group-hover/logout:scale-110 transition-transform" />
            ) : (
              <CiLogout className="h-5 w-5 group-hover/logout:scale-110 transition-transform" />
            )}
            <span className="font-semibold text-sm group-data-[state=collapsed]:hidden">
              {t("logout")}
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem className="list-none">
          <SidebarMenuButton
            onClick={() => setDeleteAccountDialogOpen(true)}
            tooltip={t("deleteAccount")}
            className="w-full h-11 px-3 rounded-xl group-data-[state=expanded]:hover:bg-red-100 text-red-500 hover:text-red-700 transition-all group/delete"
          >
            <FaRegTrashAlt className="h-4 w-4 group-hover/delete:rotate-12 transition-transform" />
            <span className="font-semibold text-red-500 text-sm group-data-[state=collapsed]:hidden">
              {t("deleteAccount")}
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>

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
    </Sidebar>
  );
}

function MobileTabs({ items, t, locale, pathname }: any) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur shadow-sm pb-safe-area-inset-bottom">
      <nav className="flex items-center justify-around h-16 px-2">
        {items.map((item: any) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 min-w-[64px] transition-all px-2 py-1.5 rounded-xl",
                isActive
                  ? "text-(--secondary) "
                  : "text-(--item-text) hover:text-(--secondary)"
              )}
            >
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -top-2 w-12 h-1 bg-(--secondary) rounded-full shadow-[0_0_10px_rgba(var(--secondary-rgb),0.5)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </AnimatePresence>
              <Icon
                className={cn(
                  "h-5 w-5 transition-transform",
                  isActive && "scale-110"
                )}
              />
              <span className="text-[10px] font-medium truncate w-full text-center">
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Settings/More Trigger for Mobile */}
        <Link
          href={`/${locale}/dashboard/settings`}
          className={cn(
            "relative flex flex-col items-center justify-center gap-1 min-w-[64px] transition-all px-2 py-1.5 rounded-xl",
            pathname.startsWith(`/${locale}/dashboard/settings`) ||
              pathname.startsWith(`/${locale}/dashboard/profile`)
              ? "text-(--secondary) "
              : "text-(--item-text) hover:text-(--secondary)"
          )}
        >
          <AnimatePresence>
            {(pathname.startsWith(`/${locale}/dashboard/settings`) ||
              pathname.startsWith(`/${locale}/dashboard/profile`)) && (
              <motion.div
                layoutId="activeTab"
                className="absolute -top-2 w-12 h-1 bg-(--secondary) rounded-full shadow-[0_0_10px_rgba(var(--secondary-rgb),0.5)]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </AnimatePresence>
          <IoMdSettings
            className={cn(
              "h-5 w-5",
              (pathname.startsWith(`/${locale}/dashboard/settings`) ||
                pathname.startsWith(`/${locale}/dashboard/profile`)) &&
                "scale-110"
            )}
          />
          <span className="text-[10px] font-medium truncate w-full text-center">
            {t("settings")}
          </span>
        </Link>
      </nav>
    </div>
  );
}
