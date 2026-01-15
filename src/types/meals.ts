// ============================
// Meals Section

import { BaseAPIResponse } from "./auth";

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
  description?: string;
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

export interface GetAllMealsResponse extends BaseAPIResponse {
  data: MealItem[];
}
export interface GetSingleMealResponse extends BaseAPIResponse {
  data: MealItem;
}
export interface DeleteSingleMealResponse extends BaseAPIResponse {
  data: any;
}