import Image from "next/image";
import { Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { MealItem } from "@/types/dashboard";
import placeholderImg from "@/assets/images/Placeholder_view_vector.svg.png";

interface MealCardProps {
  item: MealItem;
}

export default function MealCard({ item }: MealCardProps) {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const t = useTranslations("Dashboard");

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50 flex flex-col group hover:shadow-md transition-shadow">
      <div className="relative aspect-video w-full">
        <Image
          src={item.image || placeholderImg}
          alt={item.name}
          fill
          className="object-cover transition-transform group-hover:scale-105 duration-300"
        />
        {/* Rating Badge */}
        {item.ratings && (
          <div
            className={cn(
              "absolute top-2 z-10 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-white text-[10px] font-bold",
              isRTL ? "right-2" : "left-2"
            )}
          >
            <Star size={10} className="fill-yellow-400 text-yellow-400" />
            <span>
              {typeof item.ratings === "object"
                ? item.ratings?.average ?? ""
                : item.ratings ?? ""}
            </span>
          </div>
        )}
      </div>

      <div className="p-3 md:p-4 flex flex-col gap-1 md:gap-2">
        <h3 className="text-[10px] md:text-xs font-semibold text-black  w-full">
          {item.name}
        </h3>
        <div className="flex items-center justify-between   md:gap-2 text-xs">
          <span className="text-[10px] md:text-xs text-(--primary) font-bold">
            {item.price} {t("sar")}
          </span>
        </div>
      </div>
    </div>
  );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");
