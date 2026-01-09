export type User = {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  status: "active" | "inactive" | string;
  type: "user" | "company" | string;

  Company_name: string | null;
  number_of_locations: number;
  account_verified: boolean;

  image: string;
  fcm: string | null;
  device_id: string | null;

  country: string | null;
  city: string | null;
};

export type AuthData = {
  token: string;
  user: User;
};

export interface BaseAPIResponse {
  message: string;
  status_code: number;
}

export interface LoginResponse extends BaseAPIResponse {
  data: AuthData;
}

export interface RegisterResponse extends BaseAPIResponse {
  data: AuthData;
}

export interface VerifyResponse extends BaseAPIResponse {
  data: AuthData;
}

export interface SendOtpResponse extends BaseAPIResponse {
  data: {
    action: "otp_sent" | string;
    purpose: "default" | string;
  };
}
export interface ChangePasswordResponse extends BaseAPIResponse {
  data: any;
}
export interface UpdateProfileResponse extends BaseAPIResponse {
  data:  {
    user: User;
  };
}

// Request Types (Payloads)
export interface LoginRequest {
  phone: string;
  password?: string;
}

export interface RegisterRequest {
  company_name: string;
  name: string;
  phone: string;
  password?: string;
  type?: "user" | "company";
}

export interface VerifyOtpRequest {
  identifier: string;
  code: string;
  purpose: "default" | string;
}

export interface SendOtpRequest {
  identifier: string;
  purpose: "default" | string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  company_name?: string;
  image?: File | string | null;
}
