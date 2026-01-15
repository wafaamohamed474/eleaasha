"use client";

import React from "react";
import {
  useGetAllOrdersQuery,
  useDeleteSingleOrderMutation,
} from "@/store/services/authApi";
import { OrderList } from "@/features/orders/OrderList";
import { useLocale } from "next-intl";
import { toast } from "sonner";

export default function OrdersTemplate() {
  const locale = useLocale();
  const [status, setStatus] = React.useState<string | undefined>(undefined);
  const { data, isLoading } = useGetAllOrdersQuery({
    lang: locale,
    status,
  });

  const orders = data?.data || [];

  return (
    <div className="">
      <OrderList
        orders={orders}
        isLoading={isLoading}
        onFilterChange={setStatus}
      />
    </div>
  );
}
