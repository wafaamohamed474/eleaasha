import { BaseAPIResponse } from "./auth";

// ============================
// Home Page Response
// ============================
export interface HomeResponse extends BaseAPIResponse {
  data: HomeData;
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
  price_without_tax: string;
}

// ============================
// Locations Management
// ============================
export interface LocationsManagement {
  title: string;
  items: LocationItem[];
}

export interface LocationItem {
  id?: number;
  name?: string;
}

export interface FinancialAnalysis {
  month_name: string;
  series: FinancialSeriesItem[];
}

export interface FinancialSeriesItem {
  name?: string;
  data?: number[];
}
