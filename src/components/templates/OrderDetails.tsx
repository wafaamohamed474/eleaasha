"use client";

import React from "react";
import { useGetSingleOrderQuery } from "@/store/services/authApi";
import { OrderDetails } from "@/features/orders/OrderDetails";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

export default function OrderDetailsTemplate({ id }: { id: string }) {
  const locale = useLocale();

  const { data, isLoading, isError } = useGetSingleOrderQuery({
    lang: locale,
    id: id,
  });

  const order = data?.data;

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-8">
        <Skeleton className="h-[500px] rounded-3xl" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="container mx-auto py-20 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
          <AlertCircle size={40} />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Order Not Found
        </h1>
        <p className="text-slate-500">
          The order you are looking for does not exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <div className="">
      <OrderDetails order={order} />
    </div>
  );
}
