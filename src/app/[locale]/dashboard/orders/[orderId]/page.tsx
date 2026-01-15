"use client";
import OrderDetailsTemplate from "@/components/templates/OrderDetails";
import { useParams } from "next/navigation";

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  return <OrderDetailsTemplate id={orderId} />;
}
