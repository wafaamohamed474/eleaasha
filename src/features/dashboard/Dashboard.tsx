"use client";

import { useLocale, useTranslations } from "next-intl";
import { useGetHomeDataQuery } from "@/store/services/authApi";
import StatsCard from "@/components/molecules/StatsCard";
import TodaySummaryCard from "@/components/molecules/TodaySummaryCard";
import MealCard from "@/components/molecules/MealCard";
import LocationCard from "@/components/molecules/LocationCard";
import {
  Users,
  Package,
  MapPin,
  CreditCard,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import SectionTitle from "@/components/atoms/SectionTitle";
import { BannersSlider } from "@/components/molecules/BannersSlider";
import { FaUser } from "react-icons/fa6";
import { BsCurrencyDollar } from "react-icons/bs";
import { FaClipboardList } from "react-icons/fa";
import { RiBuildingFill } from "react-icons/ri";
import Link from "next/link";

export function Dashboard() {
  const locale = useLocale();
  const t = useTranslations("Dashboard");
  const { data: homeResponse, isLoading } = useGetHomeDataQuery(locale);
  const isRTL = locale === "ar";

  if (isLoading) return <DashboardSkeleton />;

  const homeData = homeResponse?.data;
  if (!homeData) return null;

  const stats = [
    {
      title: isRTL ? "عدد العمال الكلي" : "Total Employees",
      value: `${homeData.stats_cards.employees_total} ${
        isRTL ? "عامل" : "Staff"
      }`,
      icon: FaUser,
      iconBg: "bg-(--primary)/20",
      iconColor: "text-(--primary)",
      shadow: "shadow-[var(--shadow-primary-sm)]",
      trend: "up" as const,
    },
    {
      title: isRTL ? "عدد المواقع" : "Locations Count",
      value: `${homeData.stats_cards.locations_count} ${
        isRTL ? "موقع" : "Site"
      }`,
      icon: RiBuildingFill,
      iconBg: "bg-(--secondary)/20",
      iconColor: "text-(--secondary)",
      shadow: "shadow-[var(--shadow-secondary-sm)]",
      trend: "down" as const,
    },

    {
      title: isRTL ? "الطلبات (هذا الشهر)" : "Orders (This Month)",
      value: `${homeData.stats_cards.orders_this_month} ${
        isRTL ? "طلب" : "Order"
      }`,
      icon: FaClipboardList,
      iconBg: "bg-(--secondary)/20",
      iconColor: "text-(--secondary)",
      shadow: "shadow-[var(--shadow-secondary-sm)]",
      trend: "down" as const,
    },
    {
      title: isRTL ? "إجمالي التكلفة (هذا الشهر)" : "Total Cost (This Month)",
      value: `${homeData.stats_cards.revenue_this_month} ${
        isRTL ? "ريال" : "SAR"
      }`,
      icon: BsCurrencyDollar,
      iconBg: "bg-(--primary)/20",
      iconColor: "text-(--primary)",
      shadow: "shadow-[var(--shadow-primary-sm)]",
      trend: "up" as const,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Top Stats and Summary Section */}
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Left:  Banners & Summary */}
        <div className="w-full xl:w-5/12 flex flex-col gap-4">
          <SectionTitle title={isRTL ? "الإعلانات" : "Banners"} />
          <BannersSlider items={homeData.banners_section.items} />
        </div>

        {/* Right: Stats Grid */}
        <div className="w-full xl:w-7/12 flex flex-col gap-4">
          <SectionTitle title={isRTL ? "الاحصائيات" : "Statistics"} />
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-2 gap-4 ">
            {stats.map((stat, idx) => (
              <StatsCard key={idx} {...stat} />
            ))}
          </div>
        </div>
      </div>

      {/* Meals Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <SectionTitle title={isRTL ? "الوجبات" : "Meals"} />
          <Link href={`/${locale}/dashboard/meals`} className="text-xs font-bold text-(--primary) flex items-center gap-1 hover:underline">
            {isRTL ? "عرض المزيد" : "Show More"}
            {isRTL ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {homeData.meals_section.items.slice(0, 4).map((meal) => (
            <MealCard
              key={meal.id}
              item={meal}
            />
          ))}
        </div>
      </section>

      {/* Locations Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <SectionTitle title={isRTL ? "المواقع" : "Locations"} />
          <Link href={`/${locale}/dashboard/company`} className="text-xs font-bold text-(--primary) flex items-center gap-1 hover:underline">
            {isRTL ? "عرض المزيد" : "Show More"}
            {isRTL ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {homeData.locations_management.items.slice(0, 4).map((location) => (
            <LocationCard
              key={location.id}
              item={location}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex flex-col xl:flex-row gap-6">
        <Skeleton className="w-full xl:w-5/12 h-[200px] lg:h-[280px] rounded-[2rem]" />
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 w-full xl:w-7/12">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      </div>
      {[1, 2].map((i) => (
        <div key={i} className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((j) => (
              <Skeleton key={j} className="h-48 rounded-2xl" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
