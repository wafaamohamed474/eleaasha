import { BaseAPIResponse, User } from "./auth";

export type LangType = "en" | "ar";

export interface FooterDataResponse extends BaseAPIResponse {
  data: {
    social_links: {
      id: number;
      platform:
        | "tiktok"
        | "twitter"
        | "facebook"
        | "linkedin"
        | "Google-Play"
        | "APP-Store";
      url: string;
    }[];
    app_links: {
      google_play: string;
      app_store: string;
    };
    support: {
      email: string;
      phone: string;
      whatsapp: string;
    };
  };
}

export interface UserInfoResponse extends BaseAPIResponse {
  data: {
    user: User;
  };
}
export interface NotificationsResponse extends BaseAPIResponse {
  notifications: NotificationItem[];
  countUnreadNotifications: number;
}

export interface NotificationItem {
  id: string;
  type: string;
  notifiable_type: string;
  notifiable_id: number;
  data: {
    message_ar: string;
    title_ar: string;
    message_en: string;
    title_en: string;
    user_id: number;
    user_name: string;
    key: string | null;
    keyId: number | null;
  };
  read_at: string | null;
  created_at: string;
  updated_at: string;
};

export interface PagesResponse extends BaseAPIResponse {
  data: {
    items: PageItem[];
  };
}

export interface PageItem {
  id: number;
  type: string;
  title: string;
  description: string;
  seo_title: string;
  seo_description: string;
  created_at: string;
  updated_at: string;
};

export interface CityItem {
    id: number;
    name_ar: string;
    name_en: string;
    country_id: number;
}
export interface GetCitiesResponse extends BaseAPIResponse {
  data: CityItem[];
}
