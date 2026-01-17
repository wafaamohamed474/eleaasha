import { BaseAPIResponse } from "./auth";
import { CompanyLocation } from "./locations";
import { MealItem } from "./meals";

export type OrderSite = {
  id: number;
  name: string;
  address: string;
};

export interface OrderItem {
  id: number;
  status: string;
  recurrence: string;
  quantity: number;
  delivery_time_start?: string;
  delivery_time_end?: string;
  delivery_start_date?: string; // YYYY-MM-DD
  delivery_end_date?: string; // YYYY-MM-DD
  delivery_days?: string[];
  total?: string;
  invoice_url?: string;
  site?: OrderSite;
  meal?: MealItem;
  company_location?: CompanyLocation;
  created_at?: string;
  notes?: string;
}
export interface GetAllOrdersResponse extends BaseAPIResponse {
  data: OrderItem[];
}
export interface AddOrderRequest {
  company_location_id: number;
  meal_id: number;
  quantity: number;
  recurrence: string;
  delivery_time_start: string;
  delivery_time_end: string;
  payment_method: string;
  delivery_days?: string[];
  notes?: string;
}
export interface AddOrderResponse extends BaseAPIResponse {
  data: OrderItem;
}
export interface GetSingleOrderResponse extends BaseAPIResponse {
  data: OrderItem;
}
export interface DeleteSingleOrderResponse extends BaseAPIResponse {
  data: any;
}
