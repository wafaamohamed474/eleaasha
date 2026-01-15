// ============================
// Locations Management

import { BaseAPIResponse } from "./auth";

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
  longitude?: number;
  latitude?: number;
  note?: string;
  status?: string;
}
export interface Company {
  id: number;
  name: string;
  number_of_locations: number;
}
export interface CompanyLocation {
  id: number;
  name: string;
  lat: string;
  lng: string;
}

export interface GetAllLocationsResponse extends BaseAPIResponse {
  data: {
    locations: LocationItem[];
    company: Company;
  };
}

export interface AddLocationRequest {
  name: string;
  workers_count: number;
  address: string;
  city_id: number;
  latitude: number;
  longitude: number;
  note?: string;
}
export interface AddLocationResponse extends BaseAPIResponse {
  data: {
    locations: LocationItem[];
    company: Company;
  };
}

export interface GetSingleLocationResponse extends BaseAPIResponse {
  data: LocationItem;
}
export interface DeleteSingleLocationResponse extends BaseAPIResponse {
  data: any;
}
