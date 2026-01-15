"use client";
import MealDetailsTemplate from "@/components/templates/MealDetails";
import { useParams } from "next/navigation";

export default function SingleMealPage() {
  const params = useParams();
  const mealId = params.mealId as string;
  return <MealDetailsTemplate id={mealId} />;
}
