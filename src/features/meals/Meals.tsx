"use client";
import { useLocale } from "next-intl";
import { useGetAllMealsQuery } from "@/store/services/authApi";
import SectionTitle from "@/components/atoms/SectionTitle";
import MealCard from "@/components/molecules/MealCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Meals() {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const { data: mealsData, isLoading } = useGetAllMealsQuery(locale);
  return (
    <section className="flex flex-col gap-6">
      <SectionTitle title={isRTL ? "الوجبات" : "Meals"} />
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <Skeleton className="lg:h-[200px] h-[150px]" />
          <Skeleton className="lg:h-[200px] h-[150px]" />
          <Skeleton className="lg:h-[200px] h-[150px]" />
          <Skeleton className="lg:h-[200px] h-[150px]" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {mealsData?.data.map((meal) => (
            <MealCard key={meal.id} item={meal} />
          ))}
        </div>
      )}
    </section>
  );
}
