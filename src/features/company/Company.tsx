"use client";
import { useLocale } from "next-intl";
import { useGetAllLocationsQuery } from "@/store/services/authApi";
import SectionTitle from "@/components/atoms/SectionTitle";
import { Skeleton } from "@/components/ui/skeleton";
import LocationCard from "@/components/molecules/LocationCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import EmptySection from "@/components/molecules/EmptySection";

export default function Company() {
  const locale = useLocale();
  const t = useTranslations("Company");
  const isRTL = locale === "ar";
  const { data: locationsData, isLoading } = useGetAllLocationsQuery(locale);
  return (
    <section className="flex flex-col">
      <div className="flex flex-row justify-end">
        <Button
          asChild
          className="bg-(--primary) hover:bg-(--primary)/90 text-white rounded-xl shadow-sm hover:shadow-md transition-all font-bold"
        >
          <Link href={`/${locale}/dashboard/company/create`}>
            <Plus className="w-5 h-5" />
            {t("Add New Location")}
          </Link>
        </Button>
      </div>
      <div className="flex flex-col">
        <SectionTitle title={t("Locations")} />
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <Skeleton className="h-[200px]" />
            <Skeleton className="h-[200px]" />
            <Skeleton className="h-[200px]" />
          </div>
        ) : locationsData?.data.locations.length === 0 ? (
          <EmptySection title={t("noLocations")} desc={t("noLocationsMsg")} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {locationsData?.data.locations.map((location) => (
              <LocationCard
                key={location.id}
                item={location}
                isNotHome={true}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
