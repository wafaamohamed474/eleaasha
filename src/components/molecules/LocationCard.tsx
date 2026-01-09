import { MapPin, Users, Building2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { IoMdTrendingDown } from "react-icons/io";

interface LocationCardProps {
  id?: number;
  name?: string;
}

export default function LocationCard({ id, name }: LocationCardProps) {
  const t = useTranslations("Dashboard");
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 flex flex-col gap-5 group hover:shadow-[var(--shadow-primary-sm)] transition-colors">
      <div className="flex items-center justify-between">
        {/* Location ID Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-500 text-white text-[10px] font-bold shadow-sm">
          <Building2 size={12} />
          {isRTL ? "موقع 1" : "Site 1"}
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-bold border border-green-100">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          {isRTL ? "نشط" : "Active"}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {/* Site Name */}
        <div className="flex items-center gap-2 text-(--item-text) group-hover:text-gray-600 transition-colors">
          <Building2 size={14} className="grow-0 text-(--item-text)" />

          <span className="text-[10px] font-medium grow-0 whitespace-nowrap ">
            {isRTL ? "أسم الموقع" : "Site Name"} :
          </span>
          <span className="text-xs font-bold text-gray-900 grow">
            {isRTL ? "جدة" : "Jeddah"}
          </span>
        </div>

        {/* Worker Count */}
        <div className="flex items-start gap-2 text-(--item-text) group-hover:text-gray-600 transition-colors">
          <Users size={14} className="grow-0 text-(--item-text)" />

          <span className="text-[10px] font-medium grow-0 whitespace-nowrap">
            {isRTL ? "عدد العمال" : "Workers"} :
          </span>
          <span className="text-xs font-bold text-gray-900 grow ">
            400 {isRTL ? "عامل" : "Staff"}
          </span>
        </div>

        {/* City */}
        <div className="flex items-start gap-2 text-(--item-text) group-hover:text-gray-600 transition-colors">
          <MapPin size={14} className="grow-0 text-(--item-text)" />

          <span className="text-[10px] font-medium grow-0 whitespace-nowrap">
            {isRTL ? "المدينة" : "City"} :
          </span>
          <span className="text-xs font-bold text-gray-900 grow">
            {isRTL ? "جدة" : "Jeddah"}
          </span>
        </div>
      </div>
    </div>
  );
}
