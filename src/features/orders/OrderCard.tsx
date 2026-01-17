"use client";
import React, { useState } from "react";
import { OrderItem } from "@/types/orders";
import { useTranslations, useLocale } from "next-intl";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Utensils,
  CheckCircle2,
  AlertCircle,
  Truck,
  ChefHat,
  XCircle,
} from "lucide-react";
import { AiFillPrinter } from "react-icons/ai";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { FaClock, FaMapMarkerAlt } from "react-icons/fa";
import OrderStepper from "./OrderStepper";
import { FaX } from "react-icons/fa6";
import ConfirmationDialog from "@/components/molecules/ConfirmationDialog";
import { useDeleteSingleOrderMutation } from "@/store/services/authApi";
import { toast } from "sonner";
import { formatTimeToArabic } from "@/utils/time";

interface OrderCardProps {
  order: OrderItem;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const t = useTranslations("Orders");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };
  const [deleteOrder, { isLoading }] = useDeleteSingleOrderMutation();
  const handleConfirmDelete = async () => {
    try {
      const res = await deleteOrder({
        id: order.id.toString(),
        lang: locale,
      }).unwrap();

      toast.success("", {
        description: res?.message || "Order deleted successfully",
      });

      setShowDeleteDialog(false);
    } catch (err) {
      console.error("Failed to delete Order:", err);
      toast.error("", { description: "Failed to delete Order" });
    }
  };

  const EndTime =
    order.recurrence === "daily" ? t("card.today") : order.delivery_end_date;
  const startTime =
    locale === "ar"
      ? formatTimeToArabic(order?.delivery_time_start ?? "")
      : order?.delivery_time_start ?? "";

  const endTime =
    locale === "ar"
      ? formatTimeToArabic(order?.delivery_time_end ?? "")
      : order?.delivery_time_end ?? "";
  return (
    <>
      <Card
        className="p-6 border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white rounded-2xl"
        dir={locale === "ar" ? "rtl" : "ltr"}
      >
        <div className="flex flex-col h-full justify-between gap-4 lg:gap-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-(--primary) bg-(--primary)/10 px-3 py-1.5 rounded-lg">
              {t(`tabs.${order.recurrence}`)}
            </span>
            <Badge
              variant="outline"
              className={cn(
                "px-3 py-1.5 text-sm font-medium border-0 rounded-lg flex flex-col items-center gap-2"
              )}
            >
              {order.status === "completed" || order.status === "مكتمل" ? (
                <span className="text-[10px] text-(--main-text)">
                  {t("tabs.expired")}
                </span>
              ) : (
                <>
                  <span className="text-[10px] text-(--main-text)">
                    {t("card.endIn")}
                  </span>
                  <span className="text-xs text-(--primary) block">
                    {EndTime}
                  </span>
                </>
              )}
            </Badge>
          </div>

          {/* Meal Info */}

          <div className="flex justify-start items-end gap-2">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 group-hover:opacity-90 transition-opacity">
              <Image
                src={order.meal?.image || "/placeholder-meal.png"}
                alt={order.meal?.name || "Meal"}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-semibold text-xs lg:text-sm text-(--item-text)">
                <Utensils size={14} />
                <span>{t("card.mealName")}</span>
              </div>
              <h3 className="font-bold text-sm lg:text-base text-(--secondary)   group-hover:text-(--secondary) transition-colors">
                {order.meal?.name}
              </h3>
            </div>
          </div>
          {/* Meal Status */}
          <OrderStepper status={order.status} locale={locale} />

          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-2 lg:gap-4 text-sm">
            {/* Location */}
            <div className="flex flex-col gap-1 lg:gap-2 p-3 rounded-xl bg-(--secondary)/10">
              <p className="text-[10px] lg:text-xs text-(--main-text)">
                {t("card.deliveryLocation")}
              </p>
              <div className="flex justify-start gap-2 text-[10px] lg:text-sm">
                <FaMapMarkerAlt className="text-(--secondary) text-sm lg:text-lg" />
                <p className="font-semibold text-(--secondary)">
                  {order?.company_location?.name ?? ""}
                </p>
              </div>
            </div>
            {/* Timeline */}
            <div className="flex flex-col gap-1 lg:gap-2 p-3 rounded-xl bg-(--primary)/10">
              <p className="text-[10px] lg:text-xs text-(--main-text)">
                {t("card.deliveryTime")}
              </p>
              <div className="flex justify-start gap-2 text-[10px] lg:text-sm">
                <FaClock className=" text-(--primary) text-sm lg:text-lg" />
                <p className="font-semibold text-(--primary)">
                  {startTime ?? ""} - {endTime ?? ""}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 lg:gap-3  lg:max-w-2/3 w-full">
            {(order.status === "pending" ||
              order.status === "قيد الانتظار") && (
              <Button
                variant="destructive"
                onClick={handleDeleteClick}
                className="hidden lg:block w-fit h-10 rounded-lg text-xs md:text-sm font-semibold bg-(--warning-text) hover:bg-(--warning-text)/70 text-white"
              >
                <span className="hidden lg:block">{t("card.cancelOrder")}</span>
              </Button>
            )}

            <Button
              asChild
              className="flex-1 lg:flex-none text-xs md:text-sm  bg-(--primary) hover:bg-(--primary)/90 text-white shadow-sm hover:shadow font-semibold py-5 rounded-lg"
            >
              <Link href={`/${locale}/dashboard/orders/${order.id}`}>
                {t("card.viewDetails")}
              </Link>
            </Button>

            <Button
              asChild
              className="flex bg-(--primary)/10   hover:bg-(--primary)/20 text-(--primary) shadow-sm hover:shadow font-bold py-5 rounded-lg"
            >
              <a
                href={order?.invoice_url}
                className="text-3xl! "
                target="_blank"
                rel="noopener noreferrer"
              >
                <AiFillPrinter />
              </a>
            </Button>
            {(order.status === "pending" ||
              order.status === "قيد الانتظار") && (
              <Button
                variant="destructive"
                onClick={handleDeleteClick}
                className="lg:hidden w-fit h-10 rounded-lg text-xs md:text-sm font-semibold bg-(--warning-text) hover:bg-(--warning-text)/70 text-white"
              >
                <span>
                  <FaX className="text-sm lg:hidden" />
                </span>
              </Button>
            )}
          </div>
        </div>
      </Card>
      <ConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title={isRTL ? "حذف الطلب" : "Delete Order"}
        description={
          isRTL
            ? `هل تريد حذف طلب "${order.meal?.name ?? ""}" ؟`
            : `Do you want to delete Order "${order.meal?.name ?? ""}"?`
        }
        warningText={
          isRTL
            ? "تنبيه! هذا الإجراء لا يمكن التراجع عنه."
            : "Warning! This action cannot be undone."
        }
        confirmText={isRTL ? "نعم، حذف الطلب" : "Yes, Delete Order"}
        cancelText={isRTL ? "إلغاء" : "Cancel"}
        onConfirm={handleConfirmDelete}
        variant="destructive"
        isLoading={isLoading}
      />
    </>
  );
};
