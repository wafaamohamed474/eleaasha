import Link from "next/link";
import { Button } from "../ui/button";
import { useLocale } from "next-intl";
import { FaBell } from "react-icons/fa";
import { useGetNotificationsQuery } from "@/store/services/authApi";

export default function NotificationsBtn() {
  const locale = useLocale();
  const { data: notifications } = useGetNotificationsQuery(locale);
  return (
    <Button
      variant="default"
      asChild
      className="bg-(--secondary-foreground) rounded-full "
    >
      <div className=" flex items-center justify-between px-3! py-2!">
        <FaBell className="h-5 w-5 text-(--primary)" />
        <span className="rounded-full bg-[#F18B241A] text-(--primary) text-xs w-5 h-5 flex items-center justify-center">
          {notifications?.countUnreadNotifications}
        </span>
      </div>
    </Button>
  );
}
