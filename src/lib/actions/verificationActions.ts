"use server";

import { NAME_TOKEN_KEY } from "@/lib/auth/constants";
import { VerifyResponse } from "@/types/auth";
import { cookies } from "next/headers";

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://eaasha.computinggate.com/api";

export async function verifyOtpAction(prevState: any, formData: FormData) {
  const code = formData.get("verificationCode")?.toString();
  const identifier = formData.get("phone")?.toString();

  const lang = formData.get("lang")?.toString() || "ar";

  if (!code || !identifier) {
    return { success: false, error: "incompleteData" };
  }

  try {
    const res = await fetch(`${API_URL}/verify-otp?lang=${lang}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, identifier, purpose: "default" }),
      cache: "no-store",
    });

    const data: VerifyResponse = await res.json();

    if (!res.ok) {
      // Handle specific error messages from backend if possible
      return {
        success: false,
        error: data?.message || "verificationError",
      };
    }

    if (data?.data?.token) {
      const cookieStore = await cookies();
      cookieStore.set(NAME_TOKEN_KEY, data?.data?.token || "", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
      });
    }

    return {
      success: true,
      message: "successMessage",
      data: data.data,
    };
  } catch (err) {
    console.error("Verification Error:", err);
    return {
      success: false,
      error: "genericError",
    };
  }
}

export async function resendOtpAction(prevState: any, formData: FormData) {
  const identifier = formData.get("phone")?.toString();
  const lang = formData.get("lang")?.toString() || "ar";

  if (!identifier) {
    return { success: false, error: "phoneError" };
  }

  try {
    const res = await fetch(`${API_URL}/send-otp?lang=${lang}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, purpose: "default" }),
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: data?.message || "resendError",
      };
    }

    return { success: true, message: "resendSuccess" };
  } catch {
    return {
      success: false,
      error: "genericError",
    };
  }
}
