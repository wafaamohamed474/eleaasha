"use client";

import React, { useState } from "react";
import { OrderItem } from "@/types/orders";
import { useTranslations, useLocale } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderCard } from "./OrderCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface OrderListProps {
  orders: OrderItem[];
  isLoading: boolean;
  onFilterChange: (status: string | undefined) => void;
}

export const OrderList: React.FC<OrderListProps> = ({
  orders,
  isLoading,
  onFilterChange,
}) => {
  const t = useTranslations("Orders");
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { id: "all", label: t("tabs.all") },
    { id: "active", label: t("tabs.active") },
    { id: "pending", label: t("tabs.pending") },
    { id: "preparing", label: t("tabs.preparing") },
    { id: "out_for_delivery", label: t("tabs.out_for_delivery") },
    { id: "completed", label: t("tabs.completed") },
    { id: "cancelled", label: t("tabs.cancelled") },
  ];

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Pass 'undefined' for 'all' to clear the filter params
    onFilterChange(value === "all" ? undefined : value);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-lg shrink-0" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[300px] w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col  gap-4">
      <div className="flex flex-row justify-end">
        <Button
          asChild
          className="bg-(--primary) hover:bg-(--primary)/90 text-white rounded-xl shadow-sm hover:shadow-md transition-all font-bold"
        >
          <Link href={`/${locale}/dashboard/meals`}>
            <Plus className="w-5 h-5" />
            {t("createOrder")}
          </Link>
        </Button>
      </div>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <div
          className="overflow-x-auto scrollbar-hide"
          dir={locale === "ar" ? "rtl" : "ltr"}
        >
          <TabsList
            className={`bg-transparent gap-2 h-auto p-0 inline-flex w-max min-w-full
      ${locale === "ar" ? "justify-start" : "justify-end"}
    `}
          >
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="data-[state=active]:bg-(--primary) data-[state=active]:text-white data-[state=active]:shadow-md
                         bg-white text-slate-600 border border-slate-200  text-sm 
                         rounded-xl py-2.5 px-6 font-medium transition-all duration-200
                         hover:bg-slate-50 data-[state=active]:border-(--primary)"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-4">
          {orders.length === 0 ? (
            <EmptySection
              title={t("noOrders")}
              desc={t("noOrdersYet")}
              btnLabel={t("createOrder")}
              href="/dashboard/meals"
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2  gap-6">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

import EmptySection from "@/components/molecules/EmptySection";
