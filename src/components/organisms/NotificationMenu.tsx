"use client";

import Image from "next/image";
import { FaX } from "react-icons/fa6";
import { XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import alertNotificationImg from "@/assets/images/noticationBell.png";
import notificationImg from "@/assets/images/notificationImg.jpg";

import {
  useDeleteSpecificNotificationMutation,
  useGetNotificationsQuery,
  useMarkSpecificNotificationAsReadMutation,
} from "@/store/services/authApi";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useLocale } from "next-intl";
import NotificationsBtn from "../molecules/NotificationsBtn";
import { NotificationItem } from "@/types/globals";

export function NotificationMenu() {
  const lang = useLocale();
  const t = useTranslations("Notifications");
  const { data } = useGetNotificationsQuery(lang);
  const [readNotification] = useMarkSpecificNotificationAsReadMutation();
  const [deleteNotification] = useDeleteSpecificNotificationMutation();

  const [readIds, setReadIds] = useState<string[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  // Sync initial read notifications from API
  useEffect(() => {
    if (data?.notifications) {
      setReadIds(
        data.notifications.filter((n: any) => n.read_at).map((n: any) => n.id)
      );
    }
  }, [data]);

  const handleRead = async (id: string) => {
    if (readIds.includes(id)) return; // already read
    setReadIds((prev) => [...prev, id]); // optimistic UI
    try {
      await readNotification({ id, lang }).unwrap();
    } catch {
      setReadIds((prev) => prev.filter((rid) => rid !== id)); // rollback on error
    }
  };

  const handleDelete = async (id: string) => {
    if (deletedIds.includes(id)) return;

    // Optimistic Delete: Remove from UI immediately
    setDeletedIds((prev) => [...prev, id]);

    try {
      await deleteNotification({ id, lang }).unwrap();
    } catch (error) {
      // Rollback on error
      setDeletedIds((prev) => prev.filter((did) => did !== id));
      console.error("Failed to delete notification", error);
    }
  };

  const isRead = (notify: NotificationItem) => readIds.includes(notify.id);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <NotificationsBtn count={data?.countUnreadNotifications ?? 0} />
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="w-full max-w-md  h-full sm:h-auto  md:max-w-2xl lg:max-w-3xl bg-(--background)  z-10000  flex flex-col px-0 
            shadow-[0_0_2px_#008AEF]  border-0 lg:top-22 
            lg:translate-y-0 
            "
      >
        {" "}
        <div className="h-full ">
          <div className="">
            <DialogHeader className="relative flex items-center justify-center px-5 pb-4 border-b border-(--border)">
              <DialogTitle className="leading-none font-semibold text-base text-(--primary)">
                {t("title")}
              </DialogTitle>
              <DialogClose className="absolute right-5 ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 bg-(--card-bg) text-(--primary) p-1">
                <XIcon />
              </DialogClose>
            </DialogHeader>
          </div>
          <div className="h-full md:max-h-80 overflow-y-auto py-2">
            {data?.notifications?.length &&
            data.notifications.filter(
              (n: NotificationItem) => !deletedIds.includes(n.id)
            ).length > 0 ? (
              data.notifications
                .filter((n: NotificationItem) => !deletedIds.includes(n.id))
                .map((notify: NotificationItem) => (
                  <div
                    key={notify.id}
                    onClick={() => handleRead(notify.id)}
                    className={`flex items-start justify-between px-4 py-4 gap-3 cursor-pointer transition-all duration-200
                  border-b border-(--border) hover:bg-slate-50
                  ${isRead(notify) ? "bg-white" : "bg-[#F4F6F6]"}`}
                  >
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="relative w-10 h-10 md:w-12 md:h-12 overflow-hidden rounded-full border border-slate-100 shrink-0">
                        <Image
                          src={notificationImg}
                          alt="notification"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col   gap-1">
                        <p
                          className={`text-xs md:text-sm font-medium transition-colors ${
                            isRead(notify) ? "text-slate-600" : "text-slate-900"
                          }`}
                          dir={lang === "ar" ? "rtl" : "ltr"}
                        >
                          {lang === "ar"
                            ? notify.data.message_ar
                            : notify.data.message_en}
                        </p>
                        <span className="text-[10px] text-slate-400">
                          {new Date(notify.created_at).toLocaleDateString(
                            lang,
                            {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                    </div>

                    <button
                      aria-label="Delete notification"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notify.id);
                      }}
                      className="text-slate-300 hover:text-red-500 transition-colors p-1"
                    >
                      <FaX size={12} />
                    </button>
                  </div>
                ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-16 px-6 text-center">
                <div className="w-20 ">
                  <Image src={alertNotificationImg} alt="no-notifications" />
                </div>
                <p className="text-center text-sm   font-medium text-muted pt-4">
                  {t("empty")}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
