"use client";

import { useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { Phone, Mail } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import BackButton from "@/components/molecules/BackButton";
import SectionHeader from "@/components/atoms/SectionHeader";
import supportImg from "@/assets/images/supportImg.png";
import { cn } from "@/lib/utils";
import { useGetFooterDataQuery } from "@/store/services/authApi";
import { Skeleton } from "@/components/ui/skeleton";

export default function Support() {
  const tSidebar = useTranslations("sidebar");
  const tSupport = useTranslations("Auth.Support");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const { data, isLoading } = useGetFooterDataQuery(locale);

  const contactMethods = useMemo(() => {
    const support = data?.data?.support;
    if (!support) return [];

    return [
      {
        icon: <Phone size={20} className="text-(--primary)" />,
        text: support.phone.slice(1),
        href: `tel:${support.phone?.replace(/\+/g, "")}`,
      },
      {
        icon: <FaWhatsapp size={20} className="text-green-500" />,
        text: tSupport("whatsapp"),
        href: `https://wa.me/${support.whatsapp?.replace(/[^0-9]/g, "")}`,
      },
      {
        icon: <Mail size={20} className="text-orange-400" />,
        text: support.email,
        href: support.email
          ? `https://mail.google.com/mail/?view=cm&to=${support.email}`
          : "#",
      },
    ];
  }, [data, tSupport]);

  return (
    <div className="flex flex-col gap-6 ">
      {/* Mobile Header */}
      <BackButton title={tSidebar("support")} />

      <div className="flex flex-col items-center text-center">
        <SectionHeader title={tSidebar("support")} />

        <div className=" mb-2 w-full max-w-xs flex justify-center">
          <Image
            src={supportImg}
            alt="Support Illustration"
            className="w-full h-auto max-h-48 object-contain"
          />
        </div>

        <h2 className="text-base font-semibold text-black mb-2">
          {tSupport("welcome")}
        </h2>

        <p className="text-[10px] md:text-xs text-(--item-text) max-w-sm leading-relaxed mb-8">
          {tSupport("description")}
        </p>

        <div className="w-full max-w-md flex flex-col gap-3">
          {isLoading ? (
            <>
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </>
          ) : (
            contactMethods.map((method, idx) => (
              <a
                key={idx}
                href={method.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex items-center justify-between p-3 md:p-4 rounded-xl bg-white border border-gray-100 transition-all hover:border-(--primary)/20 hover:shadow-sm group",
                  "flex-row-reverse"
                )}
              >
                <div className={cn("flex items-center ", "flex-row")}>
                  {isRTL ? (
                    <IoIosArrowBack
                      size={16}
                      className="text-gray-300 group-hover:text-(--primary) transition-colors"
                    />
                  ) : (
                    <IoIosArrowForward
                      size={16}
                      className="text-gray-300 group-hover:text-(--primary) transition-colors"
                    />
                  )}
                </div>

                <div
                  className={cn("flex items-center gap-3", "flex-row-reverse")}
                >
                  <span className="text-xs md:text-sm font-medium text-gray-700">
                    {method.text}
                  </span>
                  <span className="p-1.5 md:p-2 rounded-xl bg-gray-50 group-hover:bg-(--primary)/5 transition-colors">
                    {method.icon}
                  </span>
                </div>
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
