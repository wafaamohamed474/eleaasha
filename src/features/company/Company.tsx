"use client";
import { useLocale } from "next-intl";
import {
  useGetAllLocationsQuery,
} from "@/store/services/authApi";
import SectionTitle from "@/components/atoms/SectionTitle";
import { Skeleton } from "@/components/ui/skeleton";
import LocationCard from "@/components/molecules/LocationCard";

export default function Company() {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const { data: locationsData, isLoading } = useGetAllLocationsQuery(locale);
  return (
    <section className="flex flex-col gap-6">
      <SectionTitle title={isRTL ? "المواقع" : "Locations"} />
      {isLoading ? (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
         <Skeleton className="h-[200px]" />
         <Skeleton className="h-[200px]" />
         <Skeleton className="h-[200px]" />
         </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {locationsData?.data.locations.map((location) => (
            <LocationCard key={location.id} item={location} isNotHome={true}/>
          ))}
        </div>
      )}
    </section>
  );
}
