"use client";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Loader2,
  Calendar,
  Clock,
  ChevronDown,
  ShoppingCart,
} from "lucide-react";

import { AuthInput } from "@/components/ui/AuthInput";
import { TimePicker } from "@/components/ui/TimePicker";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  useCreateOrderMutation,
  useGetAllLocationsQuery,
} from "@/store/services/authApi";
import {
  OrderInput,
  OrderOutput,
  createOrderSchema,
} from "@/lib/schemas/orderSchema";
import { useLocale } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { convertTo24Hour } from "@/utils/time";
import SectionHeader from "@/components/atoms/SectionHeader";
import { FaHashtag } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export default function CreateOrder() {
  const t = useTranslations("Orders");
  const tCompany = useTranslations("Company");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const mealId = searchParams.get("meal_id");

  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const { data: locationsData, isLoading: isLocationsLoading } =
    useGetAllLocationsQuery(locale);

  const isRTL = locale === "ar";

  const tSchema = (key: string) => t(key);
  const schema = createOrderSchema(tSchema);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OrderInput, any, OrderOutput>({
    resolver: zodResolver(schema),
    defaultValues: {
      company_location_id: undefined,
      quantity: undefined,
      recurrence: "daily",
      delivery_time_start: "",
      notes: "",
      day_from: "",
      day_to: "",
      meal_id: mealId ? parseInt(mealId) : undefined,
    },
  });

  const recurrence = watch("recurrence");
  useEffect(() => {
    if (!mealId) {
      toast.error(t("mealRequired"));
      router.back();
    }
  }, [mealId, router, t]);

  const WEEK_DAYS = [
    { label: t("weekDays.saturday"), value: "sat" },
    { label: t("weekDays.sunday"), value: "sun" },
    { label: t("weekDays.monday"), value: "mon" },
    { label: t("weekDays.tuesday"), value: "tue" },
    { label: t("weekDays.wednesday"), value: "wed" },
    { label: t("weekDays.thursday"), value: "thu" },
    { label: t("weekDays.friday"), value: "fri" },
  ];

  const onSubmit = async (data: OrderOutput) => {
    try {
      // 2. Convert time to 24h & calculate end time
      const startTime24 = convertTo24Hour(data.delivery_time_start);
      const [startH, startM] = startTime24.split(":").map(Number);

      let endH = startH + 1;
      let endM = startM;

      if (endH >= 24) endH -= 24;

      const endTime24 = `${endH.toString().padStart(2, "0")}:${endM
        .toString()
        .padStart(2, "0")}`;

      // 3. Prepare final payload
      const payload = {
        ...data,
        delivery_time_start: startTime24,
        delivery_time_end: endTime24,
        lang: locale,
      };

      console.log("Final Payload:", payload);
      await createOrder(payload).unwrap();
      toast.success(t("success"));
      router.push(`/${locale}/dashboard/orders`);
    } catch (error: any) {
      console.log(error);
      toast.error(error?.data?.message || "Fail to create order");
    }
  };

  return (
    <div className="sec-class">
      <SectionHeader title={t("createOrder")} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 lg:space-y-8"
      >
        {/* Order Details Section */}
        <section className="space-y-4 w-full">
          <h2 className="text-sm lg:text-lg font-semibold text-(--primary)">
            {t("orderDetails")}
          </h2>

          <div className="flex flex-col lg:flex-row justify-start items-start lg:gap-10 w-full ">
            <div className="space-y-2 w-full lg:w-1/2!">
              {/* Meal Count */}
              <AuthInput
                label={t("mealCount")}
                type="number"
                placeholder={t("enterCount")}
                icon={FaHashtag}
                className=" lg:placeholder:text-sm"
                error={errors.quantity?.message}
                {...register("quantity")}
              />
              <input type="hidden" {...register("meal_id")} />

              {/* Location Select */}
              <div className="space-y-2 w-full">
                <Label className="text-xs font-semibold text-(--label-text)">
                  {t("selectLocation")}
                </Label>

                <Controller
                  name="company_location_id"
                  control={control}
                  render={({ field, fieldState }) => {
                    const selectedLocation =
                      locationsData?.data?.locations?.find(
                        (loc) => loc.id === field.value
                      );

                    return (
                      <div className="space-y-2">
                        <div className="relative flex items-center">
                          {/* Icon */}
                          <div className="absolute start-3 text-(--primary) z-10 pointer-events-none">
                            <FaLocationDot size={18} />
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger
                              asChild
                              disabled={isLocationsLoading}
                            >
                              <button
                                type="button"
                                className={cn(
                                  "h-12 w-full bg-(--input-bg) border transition-all duration-200",
                                  "text-xs md:text-sm  text-start flex items-center justify-between",
                                  "hover:bg-white hover:border-(--secondary)/20",
                                  "ps-10 pe-5 rounded-lg",
                                  "focus-visible:bg-white focus-visible:border-(--secondary)",
                                  "focus-visible:outline-none focus-visible:ring-0",
                                  fieldState.error
                                    ? "border-(--error)"
                                    : "border-transparent"
                                )}
                              >
                                {selectedLocation
                                  ? selectedLocation.name
                                  : t("locationPlaceholder")}
                                <ChevronDown className="h-4 w-4 opacity-60 shrink-0" />
                              </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                              className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white p-1"
                              align="start"
                            >
                              {locationsData?.data?.locations?.map((loc) => (
                                <DropdownMenuItem
                                  key={loc.id}
                                  onClick={() => field.onChange(loc.id)}
                                  className={cn(
                                    "text-xs py-1.5 cursor-pointer",
                                    field.value === loc.id &&
                                      "bg-(--secondary)/10 font-medium"
                                  )}
                                >
                                  {loc.name}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {fieldState.error && (
                          <p className="text-xs text-(--error)">
                            {fieldState.error.message}
                          </p>
                        )}
                      </div>
                    );
                  }}
                />
              </div>
            </div>
            {/* Recurrence Select */}
            <div className="space-y-2 w-full lg:w-fit mt-2 lg:mt-0">
              <Label className="text-xs font-semibold text-(--label-text)">
                {t("recurrence")}
              </Label>
              <div className="grid grid-cols-3 gap-4">
                {["daily", "weekly", "monthly"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setValue("recurrence", type as any)}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-xl border-2   transition-all gap-2",
                      recurrence === type
                        ? "border-(--primary) bg-(--primary) text-white"
                        : "border-gray-100 hover:border-gray-200 text-gray-500"
                    )}
                  >
                    <Calendar
                      className={cn(
                        "w-5 h-5",
                        recurrence === type ? "text-white" : "text-gray-400"
                      )}
                    />
                    <span
                      className={cn(
                        "text-xs font-medium",
                        recurrence === type ? "text-white" : "text-gray-600"
                      )}
                    >
                      {t(`tabs.${type}`)}
                    </span>
                  </button>
                ))}
              </div>
              {errors.recurrence && (
                <p className="text-xs text-red-500">
                  {errors.recurrence.message}
                </p>
              )}
              <p className="text-xs text-(--main-text) py-2">
                {t("deliveryNote")}
              </p>
            </div>
          </div>
        </section>

        {/* Delivery Info Section */}
        <section className="space-y-4">
          <h2 className="text-sm lg:text-lg font-semibold text-(--primary)">
            {t("deliveryInfo")}
          </h2>
          <div className="flex flex-col lg:flex-row justify-start items-end lg:gap-10 gap-3 w-full">
            <div className="w-full lg:w-1/2!">
              {/* Delivery Time */}
              <Controller
                name="delivery_time_start"
                control={control}
                render={({ field, fieldState }) => (
                  <TimePicker
                    label={t("deliveryTime")}
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.error?.message}
                  />
                )}
              />
            </div>
            {/* Recurrence Days (Conditional) */}
            {recurrence !== "daily" && (
              <div className="w-full lg:flex-1">
                <Label className="text-xs font-semibold text-(--label-text)">
                  {t("workApply")}
                </Label>
                <div className="grid grid-cols-2 gap-2 w-full">
                  {/* FROM DAY */}
                  <div className="space-y-1  ">
                    <Label className="text-xs text-xs  text-(--main-text)">
                      {t("from")}
                    </Label>
                    <Controller
                      name="day_from"
                      control={control}
                      render={({ field, fieldState }) => {
                        const selectedFrom = WEEK_DAYS.find(
                          (d) => d.value === field.value
                        );

                        return (
                          <div className="space-y-1">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button
                                  type="button"
                                  className={cn(
                                    "h-12 w-full bg-(--input-bg) border transition-all duration-200",
                                    "text-xs md:text-sm   text-start flex items-center justify-between",
                                    "hover:bg-white hover:border-(--secondary)/20",
                                    "px-4 rounded-lg",
                                    "focus-visible:bg-white focus-visible:border-(--secondary)",
                                    "focus-visible:outline-none focus-visible:ring-0",
                                    fieldState.error
                                      ? "border-(--error)"
                                      : "border-transparent"
                                  )}
                                >
                                  <span className="truncate">
                                    {selectedFrom?.label ?? t("fromDay")}
                                  </span>
                                  <ChevronDown className="h-4 w-4 opacity-60" />
                                </button>
                              </DropdownMenuTrigger>

                              <DropdownMenuContent
                                className="w-[var(--radix-dropdown-menu-trigger-width)] p-1 bg-white  "
                                align={isRTL ? "end" : "start"}
                              >
                                {WEEK_DAYS.map((day) => (
                                  <DropdownMenuItem
                                    key={day.value}
                                    onClick={() => field.onChange(day.value)}
                                    className={cn(
                                      "text-xs py-1.5",
                                      isRTL ? "justify-end" : "justify-start",
                                      field.value === day.value &&
                                        "bg-(--secondary)/10 font-medium"
                                    )}
                                  >
                                    {day.label}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>

                            {fieldState.error && (
                              <p className="text-xs text-(--error) mt-1">
                                {fieldState.error.message}
                              </p>
                            )}
                          </div>
                        );
                      }}
                    />
                  </div>

                  {/* TO DAY */}
                  <div className="space-y-1 ">
                    <Label className="text-xs  text-(--main-text)">
                      {t("to")}
                    </Label>
                    <Controller
                      control={control}
                      name="day_to"
                      render={({ field, fieldState }) => {
                        const selectedTo = WEEK_DAYS.find(
                          (d) => d.value === field.value
                        );

                        return (
                          <div className="space-y-1">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button
                                  type="button"
                                  className={cn(
                                    "h-12 w-full bg-(--input-bg) border transition-all duration-200",
                                    "text-xs md:text-sm   text-start flex items-center justify-between",
                                    "hover:bg-white hover:border-(--secondary)/20",
                                    "px-4 rounded-lg",
                                    "focus-visible:bg-white focus-visible:border-(--secondary)",
                                    "focus-visible:outline-none focus-visible:ring-0",
                                    fieldState.error
                                      ? "border-(--error)"
                                      : "border-transparent"
                                  )}
                                >
                                  <span className="truncate">
                                    {selectedTo?.label ?? t("toDay")}
                                  </span>
                                  <ChevronDown className="h-4 w-4 opacity-60" />
                                </button>
                              </DropdownMenuTrigger>

                              <DropdownMenuContent
                                className="p-1 bg-white w-[var(--radix-dropdown-menu-trigger-width)] "
                                align={isRTL ? "end" : "start"}
                              >
                                {WEEK_DAYS.map((day) => (
                                  <DropdownMenuItem
                                    key={day.value}
                                    onClick={() => field.onChange(day.value)}
                                    className={cn(
                                      "text-xs py-1.5",
                                      isRTL ? "justify-end" : "justify-start",
                                      field.value === day.value &&
                                        "bg-(--secondary)/10 font-medium"
                                    )}
                                  >
                                    {day.label}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>

                            {fieldState.error && (
                              <p className="text-xs text-(--error) mt-1">
                                {fieldState.error.message}
                              </p>
                            )}
                          </div>
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Notes Section */}
        <section className="space-y-4 lg:w-1/2">
          <h2 className="text-sm lg:text-lg font-semibold text-(--primary)">
            {t("additionalNotes")}
          </h2>
          <AuthInput
            label={t("additionalNotesOptional")}
            placeholder={t("enterNotes")}
            className=" lg:placeholder:text-sm"
            error={errors.notes?.message}
            {...register("notes")}
          />
        </section>

        <Button
          type="submit"
          className="w-full md:w-auto md:min-w-[200px] flex mx-auto bg-(--primary) font-bold text-sm lg:text-base hover:bg-(--primary)/80 text-white py-6"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <ShoppingCart className="w-5 h-5" />
          {t("confirmOrder")}
        </Button>
      </form>
    </div>
  );
}
