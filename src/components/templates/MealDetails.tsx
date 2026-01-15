"use client";
import { MealDetails } from "@/features/meals/MealDetails";
import { useGetSingleMealQuery } from "@/store/services/authApi";
import { useLocale } from "next-intl";
import { AlertCircle } from "lucide-react";
import MealSkeleton from "@/components/molecules/MealSkeleton";

export default function MealDetailsTemplate({id}: {id: string}) {
  const locale = useLocale();
 

  const { data, isLoading, isError } = useGetSingleMealQuery({
    lang: locale,
    id: id,
  });

  const meal = data?.data;

  if (isLoading) {
    return <MealSkeleton />;
  }

  if (isError || !meal) {
    return (
      <div className="container mx-auto py-20 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
          <AlertCircle size={40} />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Meal Not Found
        </h1>
        <p className="text-slate-500">
          The meal you are looking for does not exist or has been removed.
        </p>
      </div>
    );
  }

  return <MealDetails meal={meal} />;
}
