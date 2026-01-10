import { BaseAPIResponse } from "./auth";

// ============================
// Home Page Response
// ============================
export interface HomeResponse extends BaseAPIResponse {
  data: HomeData;
}
export interface GetAllMealsResponse extends BaseAPIResponse {
  data: MealItem[];
}

export interface GetAllLocationsResponse extends BaseAPIResponse {
  data: {
    locations: LocationItem[];
    company: Company;
  };
}

// ============================
// Root Data
// ============================
export interface HomeData {
  header: HeaderSection;
  banners_section: BannersSection;
  today_summary: TodaySummary;
  stats_cards: StatsCards;
  meals_section: MealsSection;
  locations_management: LocationsManagement;
  financial_analysis: FinancialAnalysis;
}

// ============================
// Header
// ============================
export interface HeaderSection {
  user_name: string;
  company_name: string;
  image: string;
}

// ============================
// Banners Section
// ============================
export interface BannersSection {
  title: string;
  items: BannerItem[];
}

export interface BannerItem {
  id: number;
  name: string;
  image: string;
  color: string; // HEX color
}

// ============================
// Today Summary
// ============================
export interface TodaySummary {
  is_order: boolean;
  progress_percent: number;
  num_of_meals: number;
  top_meal_name: string | null;
  next_delivery_time: string | null;
  next_delivery_time_end: string | null;
  site_name: string | null;
  last_order: string | null;
}

export type LastOrder = {
  id: number;
  status: "pending" | "completed" | "cancelled" | string;
  recurrence: "daily" | "weekly" | "monthly" | string;
  quantity: number;
  delivery_start_date: string; // YYYY-MM-DD
  delivery_end_date: string; // YYYY-MM-DD
  delivery_time_start: string; // "12:30 PM"
  delivery_time_end: string; // "01:00 PM"
  notes: string;
  total: string;
  invoice_url: string;
  site: OrderSite;
  meal: MealItem;
};
export type OrderSite = {
  id: number;
  name: string;
  address: string;
};
// ============================
// Stats Cards
// ============================
export interface StatsCards {
  locations_count: number;
  employees_total: number;
  revenue_this_month: number;
  orders_this_month: number;
}

// ============================
// Meals Section
// ============================
export interface MealsSection {
  title: string;
  items: MealItem[];
}

export interface MealItem {
  id: number;
  name: string;
  image: string;
  price: string;
  price_without_tax?: string;
  is_favorite?: boolean;
  is_available?: boolean;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  ingredients?: IngredientItem[];
  tags?: TagsItem[];
  ratings?: Ratings | number;
}
export interface IngredientItem {
  id: number;
  name: string;
}
export interface TagsItem {
  id: number;
  name: string;
}
export interface Ratings {
  count: number;
  comments_count: number;
  average: number;
}
// ============================
// Locations Management
// ============================
export interface LocationsManagement {
  title: string;
  items: LocationItem[];
}

export interface LocationItem {
  id: number;
  name?: string;
  workers_count?: number;
  address?: string;
  city?: string;
  lat?: number;
  lng?: number;
  note?: string;
  status?: string;
}
export interface Company {
  id: number;
  name: string;
  number_of_locations: number;
}
export interface FinancialAnalysis {
  month_name: string;
  series: FinancialSeriesItem[];
}

export interface FinancialSeriesItem {
  name?: string;
  data?: number[];
}
