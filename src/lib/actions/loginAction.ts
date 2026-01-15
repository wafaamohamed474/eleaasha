"use server";

import { cookies } from "next/headers";
import { NAME_TOKEN_KEY } from "@/lib/auth/authServer"; // Server Key
import { LoginResponse } from "@/types/auth";

export type LoginState = {
  success: boolean;
  message?: string;
  errors?: {
    phone?: string[];
    password?: string[];
  };
  needVerification?: boolean;
  token?: string; // Token to be passed to client
};

export async function loginAction(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;
  const lang = (formData.get("lang") as string) || "ar";

  // Basic validation
  if (!phone || !password) {
    return {
      success: false,
      message: "Please fill in all fields",
    };
  }

  const normalizedPhone = `966${phone.replace(/^0/, "")}`;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/login?lang=${lang}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          phone: normalizedPhone,
          password: password,
        }),
      }
    );

    const data: LoginResponse = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Login failed",
      };
    }

    if (data.data?.token) {
      const isVerified = data.data.user.account_verified;

      // 1. Save to SERVER-SIDE cookie only if verified
      if (isVerified) {
        const cookieStore = await cookies();
        cookieStore.set(NAME_TOKEN_KEY, data.data.token, {
          path: "/",
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7,
          httpOnly: true, // Secure server-only access
        });
      }

      // Check account verification status
      if (isVerified) {
        return {
          success: true,
          message: data.message || "Login successful",
          needVerification: false,
          token: data.data.token, // Return token for client-side storage
        };
      } else {
        return {
          success: true,
          message: "Please verify your account",
          needVerification: true,
        };
      }
    }

    return {
      success: false,
      message: "An error occurred during login",
    };
  } catch (error) {
    console.error("Login Error:", error);
    return {
      success: false,
      message: "Network error or server is unreachable",
    };
  }
}
