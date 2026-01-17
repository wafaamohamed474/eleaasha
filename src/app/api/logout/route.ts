import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { NAME_TOKEN_KEY as SERVER_TOKEN_KEY } from "@/lib/auth/authServer";

export async function POST() {
  const cookieStore = await cookies();

  // Clear both client-side and server-side authentication cookies

  cookieStore.delete(SERVER_TOKEN_KEY);

  return NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });
}

