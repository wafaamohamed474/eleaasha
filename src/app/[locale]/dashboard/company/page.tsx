"use client";

import { useTranslations } from "next-intl";

export default function CompanyPage() {
  const t = useTranslations("Dashboard");
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{t("nav.company") || "Company & Locations"}</h1>
      <p className="mt-2 text-slate-500">Manage your company locations and basic information here.</p>
    </div>
  );
}
