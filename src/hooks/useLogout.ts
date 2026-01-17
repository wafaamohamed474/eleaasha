import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { authApi } from "@/store/services/authApi";
import { useDispatch } from "react-redux";
import { removeAuthTokenClient } from "@/lib/auth/authClient";

export const useLogout = () => {
  const router = useRouter();
  const locale = useLocale();
  const dispatch = useDispatch();

  const logout = async () => {
    try {
      // 1. Call the local API to clear cookies (including server-side ones)
      // This ensures both CLIENT_TOKEN_KEY and SERVER_TOKEN_KEY are removed
      await fetch("/api/logout", { method: "POST" });

      // 2. Clear client-side token explicitly via utility
      removeAuthTokenClient();

      // 3. Reset Redux API state to clear cached user data
      dispatch(authApi.util.resetApiState());

      // 4. Redirect to landing page and refresh to update UI state
      router.push(`/${locale}`);
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);

      // Fallback: still attempt to redirect even if API call fails
      removeAuthTokenClient();
      router.push(`/${locale}`);
    }
  };

  return { logout };
};
