"use client";

import React from "react";
import { OrderItem } from "@/types/orders";
import { useTranslations, useLocale } from "next-intl";
import {
  Calendar,
  MapPin,
  Utensils,
  Info,
  DollarSign,
  Package,
  Layers,
  Repeat,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface OrderDetailsProps {
  order: OrderItem;
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  const t = useTranslations("Orders");
  const locale = useLocale();

  const InfoCard = ({
    icon: Icon,
    label,
    value,
    className = "bg-(--secondary-foreground)",
  }: {
    icon: any;
    label: string;
    value: React.ReactNode;
    className?: string;
  }) => (
    <div
      className={cn(
        "p-4 rounded-xl flex flex-col justify-between gap-2 h-full",
        className
      )}
    >
      <div className="flex justify-start items-start gap-2">
        <Icon size={18} className="text-(--primary)" />
        <span className="text-xs lg:text-sm text-(--primary) font-medium">
          {label}
        </span>
      </div>
      <div className="text-sm lg:text-base lg:font-semibold font-medium text-(--details-title) line-clamp-2">
        {value}
      </div>
    </div>
  );

  const statusBg =
    order.status === "pending" || order.status === "قيد الانتظار"
      ? "bg-(--primary)/10"
      : "bg-(--secondary-foreground)";
  return (
    <div className="flex flex-col gap-6">
      <div className="sec-class">
        <div className="flex flex-col items-center gap-2 mb-8">
          <h1 className="text-lg font-semibold text-black">
            {t("details.title", { id: order.id })}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Row 1 */}
          <InfoCard
            icon={Utensils}
            label={t("details.mealName")}
            value={
              <Link
                href={`/${locale}/dashboard/meals/${order.meal?.id}`}
                className="hover:text-(--secondary) hover:underline transition-colors"
              >
                {order.meal?.name}
              </Link>
            }
          />
          <InfoCard
            icon={Repeat} // Changed to Repeat icon for "recurrence/type"
            label={t("details.type")}
            value={t(`tabs.${order.recurrence}`)}
          />

          {/* Row 2 */}
          <InfoCard
            icon={Package}
            label={t("details.quantity")}
            value={`${order.quantity} ${t("details.meals") || ""}`} // "Meals" typically in translation, handle fallback
          />
          <InfoCard
            icon={Info}
            label={t("details.status")}
            value={(() => {
              // If status contains non-english chars, show it directly (it's already localized)
              if (/[^\u0000-\u007F]+/.test(order.status)) return order.status;

              // Try to translate, if key missing/same, show original
              const key = `tabs.${order.status}`;
              // Note: t() throws error if missing in some setups, but next-intl usually returns key
              // Safe approach: check if it's a known key or let it fallback gracefully
              // Simplest hook-safe way:
              try {
                return t(key);
              } catch (e) {
                return order.status;
              }
            })()}
            className={statusBg}
          />

          {/* Row 3 */}
          <InfoCard
            icon={Calendar}
            label={t("details.startDate")}
            value={order.delivery_start_date}
          />
          <InfoCard
            icon={Calendar}
            label={t("details.endDate")}
            value={order.delivery_end_date}
          />

          {/* Row 4 - Location */}
          {/* Positioned to take one cell, leaving the other empty or filling depending on content order */}
          <div className="md:col-span-1">
            <InfoCard
              icon={MapPin}
              label={t("details.location")}
              value={order?.company_location?.name ?? ""}
            />
          </div>
        </div>

        {/* Total Price */}
        <div className="w-fit bg-(--primary) text-white py-2 px-16 mx-auto rounded-xl flex flex-col items-center justify-center shadow-md mt-6">
          <div className="flex items-center gap-1 text-white/90">
            <DollarSign className="lg:size-6 size-4" />
            <span className="text-xs lg:text-base font-medium">
              {t("details.totalPrice")}
            </span>
          </div>
          <p className="text-sm lg:text-lg font-bold">
            {order.total} {t("details.sar")}
          </p>
        </div>
      </div>
    </div>
  );
};
