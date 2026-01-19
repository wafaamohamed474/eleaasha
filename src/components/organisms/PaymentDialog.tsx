"use client";

import React, { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Landmark,
  Apple,
  Phone,
  Wallet,
  ArrowLeft,
  XIcon,
  Calendar,
  DollarSign,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MealItem } from "@/types/meals";
import { FaClock, FaHashtag } from "react-icons/fa";
import { DetailItem } from "../molecules/TodaySummaryCard";
import { PiForkKnifeFill } from "react-icons/pi";
import { formatTimeToArabic } from "@/utils/time";
import { FaLocationDot } from "react-icons/fa6";
import { SiApplepay } from "react-icons/si";
import { IoIosListBox, IoIosPhonePortrait } from "react-icons/io";
import { CiCreditCard2 } from "react-icons/ci";

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (paymentMethod: string) => void;
  orderDetails: {
    meal?: MealItem;
    totalQuantity: number;
    mealsPerDay: number;
    locationName: string;
    deliveryTime: string;
  };
  isLoading?: boolean;
}

const PAYMENT_METHODS = [
  { id: "apple_pay", icon: SiApplepay, labelKey: "methods.apple_pay" },
  { id: "mada", icon: CreditCard, labelKey: "methods.mada" },
  { id: "stc_pay", icon: IoIosPhonePortrait, labelKey: "methods.stc_pay" },
  { id: "credit_card", icon: CiCreditCard2, labelKey: "methods.credit_card" },
  { id: "bank_transfer", icon: Landmark, labelKey: "methods.bank_transfer" },
];

export function PaymentDialog({
  isOpen,
  onClose,
  onConfirm,
  orderDetails,
  isLoading,
}: PaymentDialogProps) {
  const t = useTranslations("Payment");
  const [selectedMethod, setSelectedMethod] = useState("mada");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const mealPrice = parseFloat(orderDetails.meal?.price || "0");
  const totalPrice = mealPrice * orderDetails.totalQuantity;

  console.log(orderDetails.deliveryTime);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="w-full max-w-md  h-full  md:h-auto  md:max-w-xl   bg-(--background)  z-10000  flex flex-col   justify-start px-0 
            border-0  
            "
      >
        <div className="">
          <DialogHeader className="relative flex items-center justify-center px-5  lg:pb-4 border-b border-(--border)">
            <DialogTitle className="leading-none font-semibold text-base text-(--primary)">
              {t("title")}
            </DialogTitle>
            <DialogClose className="absolute right-5 ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 bg-(--card-bg) text-(--primary) p-1">
              <XIcon />
            </DialogClose>
          </DialogHeader>
        </div>

        <div className="px-6   lg:space-y-6 space-y-2">
          {/* Order Summary Card */}
          <div className="bg-(--primary) text-white lg:p-6 p-4 rounded-[2rem] relative overflow-hidden shadow-lg">
            <div className="flex">
              <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold">
                <IoIosListBox size={14} />
                {t("summary")}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-2">
              
                <DetailItem
                  icon={PiForkKnifeFill}
                  label={isRTL ? "نوع الوجبة" : "Meal Type"}
                  value={orderDetails?.meal?.name || "---"}
                  isRTL={isRTL}
                />
                <DetailItem
                  icon={FaHashtag}
                  label={isRTL ? "عدد الوجبات اليوم" : "Meals Per Day"}
                  value={orderDetails.mealsPerDay.toString() || "---"}
                  isRTL={isRTL}
                />
                <DetailItem
                  icon={Package}
                  label={isRTL ? "إجمالي الوجبات" : "Total Meals"}
                  value={orderDetails.totalQuantity.toString() || "---"}
                  isRTL={isRTL}
                />
                <DetailItem
                  icon={FaLocationDot}
                  label={isRTL ? "اسم الموقع" : "Site Name"}
                  value={orderDetails.locationName || "---"}
                  isRTL={isRTL}
                />
                <DetailItem
                  icon={FaClock}
                  label={isRTL ? "موعد التسليم" : "Delivery Time"}
                  value={`${orderDetails.deliveryTime || "---"}`}
                  isRTL={isRTL}
                />
             

              
                <DetailItem
                  icon={DollarSign}
                  label={t("mealPrice")}
                  value={mealPrice.toString() || "---"}
                  isRTL={isRTL}
                />

                <div className="flex justify-start items-center gap-1 underline">
                  <p className="lg:text-base text-xs">{t("totalPrice")}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="lg:text-lg text-base font-black">{totalPrice}</span>
                    <span className="lg:text-base text-xs">{t("sar")}</span>
                  </div>
                </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="lg:space-y-4 space-y-2">
            <h3 className="lg:text-base text-sm font-bold text-gray-900">
              {t("paymentMethod")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 lg:gap-3">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={cn(
                    "flex items-center justify-between lg:p-4 py-2 px-4 rounded-2xl border-2 transition-all group text-start",
                    selectedMethod === method.id
                      ? "border-[#F97316] bg-[#FFF7ED]"
                      : "border-gray-50 bg-[#F9FAFB] hover:border-gray-200",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <method.icon
                      size={20}
                      className={cn(
                        "transition-colors",
                        selectedMethod === method.id
                          ? "text-[#F97316]"
                          : "text-gray-400",
                      )}
                    />
                    <span
                      className={cn(
                        "text-[10px] font-bold transition-colors",
                        selectedMethod === method.id
                          ? "text-gray-900"
                          : "text-gray-600",
                      )}
                    >
                      {t(method.labelKey)}
                    </span>
                  </div>
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                      selectedMethod === method.id
                        ? "border-[#F97316] bg-[#F97316]"
                        : "border-gray-300 bg-white",
                    )}
                  >
                    {selectedMethod === method.id && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="lg:pt-2 pt-0">
            <Button
              onClick={() => onConfirm(selectedMethod)}
              disabled={isLoading}
              className="group w-full bg-[#EEF2F6] hover:bg-[#E2E8F0] border border-[#CBD5E1] text-[#334155] font-black lg:py-7 py-5 rounded-2xl flex items-center justify-center gap-3 transition-all"
            >
              <ArrowLeft
                size={20}
                className="transition-transform group-hover:-translate-x-1"
              />
              <span className="lg:text-lg text-sm">
                {t("pay", { amount: totalPrice })}
              </span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
