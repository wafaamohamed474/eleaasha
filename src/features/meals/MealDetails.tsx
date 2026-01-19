"use client";

import React from "react";
import { MealItem } from "@/types/meals";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import placeholderImg from "@/assets/images/Placeholder_view_vector.svg.png";
import Link from "next/link";

interface MealDetailsProps {
  meal: MealItem;
}

export const MealDetails: React.FC<MealDetailsProps> = ({ meal }) => {
  const t = useTranslations("MealDetails");
  const locale = useLocale();

  const NutritionalBadge = ({
    value,
    label,
    colorClass,
  }: {
    value: number | undefined;
    label: string;
    colorClass: string;
  }) => (
    <div className={"flex flex-col items-center justify-center"}>
      <span
        className={cn(
          "flex flex-col items-center justify-center rounded-full w-8 h-8 text-xs text-semibold",
          colorClass,
        )}
      >
        {value || 0}
      </span>
      <div className="flex lg:flex-col items-center justify-center gap-1 lg:gap-0">
        <span className="text-[10px] opacity-80 font-normal">{label}</span>
        <span className="text-[8px] opacity-80 font-normal p-0 m-0">
          {locale === "ar" ? "جم" : "gm"}
        </span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="sec-class">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Left Image (or Left in RTL) */}
          <div className="md:w-[45%] shrink-0">
            <div className="relative aspect-square w-full rounded-xl overflow-hidden shadow-xl shadow-slate-200">
              <Image
                src={meal.image || placeholderImg}
                alt={meal.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
          {/* Right Content (or Right in RTL) */}
          <div className="flex-1">
            {/* Header */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h1 className="text-sm md:text-base  font-bold text-(--details-title)">
                  {meal.name}
                </h1>
                <Badge
                  variant="secondary"
                  className="rounded-full px-3 py-1 bg-(--secondary)/10 border-(--secondary) text-(--secondary)"
                >
                  {meal.is_available ? t("available") : t("unavailable")}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="rounded-full px-3 py-1 bg-(--secondary)/10 border-(--secondary) text-(--secondary)"
                >
                  {t("main-dish")}
                </Badge>
                {meal.ratings && (
                  <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-full border border-(--primary)">
                    <Star className="w-3 h-3 fill-(--primary) text-(--primary)" />
                    <span className="text-xs font-bold text-(--primary)">
                      {typeof meal.ratings === "object"
                        ? meal.ratings.average
                        : meal.ratings}
                      {typeof meal.ratings === "object" && (
                        <span className="text-[10px] font-normal opacity-80 ms-1">
                          ({meal.ratings.count})
                        </span>
                      )}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-base font-bold text-(--secondary)">
                  {meal.price} {t("sar")}
                </p>
                <div className="flex items-center gap-2">
                  {meal.tags?.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      className="bg-(--primary)/10 text-(--primary) hover:bg-(--primary)/30 border border-(--primary) px-3 py-1 text-xs font-normal"
                    >
                      {tag?.name ?? ""}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3 bg-(--secondary-foreground) py-3 px-2 rounded-2xl mt-2">
              <h3 className="font-semibold text-sm md:text-base text-(--details-title)">
                {t("description")}
              </h3>
              <p className="text-(--secondary-text) leading-relaxed text-xs md:text-sm">
                {meal.description || "No description available."}
              </p>
            </div>

            {/* Ingredients */}
            {meal.ingredients && meal.ingredients.length > 0 && (
              <div className="space-y-3 mt-2">
                <h3 className="font-semibold text-sm md:text-base text-(--details-title)">
                  {t("ingredients")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {meal.ingredients.map((ing) => (
                    <Badge
                      key={ing.id}
                      variant="secondary"
                      className="bg-(--primary)/10 text-(--primary) hover:bg-(--primary)/30 border border-(--primary) px-4 py-2 text-xs font-normal"
                    >
                      {ing.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Nutritional Values */}
            <div className="space-y-3 mt-2">
              <h3 className="font-semibold text-sm md:text-base text-(--details-title)">
                {t("nutritionalValues")}
              </h3>
              <div className="flex gap-3 overflow-x-auto scrollbar-hide bg-(--secondary-foreground) py-3 px-4 rounded-2xl flex justify-center gap-5 w-full md:w-fit">
                <NutritionalBadge
                  value={meal.calories}
                  label={t("calories")}
                  colorClass="bg-orange-50 text-orange-600 border border-(--primary)"
                />
                <NutritionalBadge
                  value={meal.protein}
                  label={t("protein")}
                  colorClass=" bg-green-50 text-green-600 border border-green-600"
                />
                <NutritionalBadge
                  value={meal.carbs}
                  label={t("carbs")}
                  colorClass="bg-(--secondary)/10 text-(--secondary-text) border border-(--secondary-text)"
                />
                <NutritionalBadge
                  value={meal.fat}
                  label={t("fat")}
                  colorClass="bg-red-50 text-red-600 border border-red-600"
                />
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4 w-full flex justify-end">
              <Button className="btn-gradient border border-(--border) px-8! md:py-5! rounded-xl text-xs md:text-base font-semibold">
                <Link
                  href={`/${locale}/dashboard/orders/create?meal_id=${meal.id}`}
                  className="flex items-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {t("orderNow")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
