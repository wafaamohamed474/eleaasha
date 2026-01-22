"use client";

import emptyImg from "@/assets/images/empty.png";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useLocale } from "next-intl";

type EmptySectionProps = {
  title: string;
  desc?: string;
  btnLabel?: string;
  href?: string;
  img?: string;
  className?: string;
};

export default function EmptySection({
  title,
  desc,
  btnLabel,
  href,
  img,
  className,
}: EmptySectionProps) {
  const locale = useLocale();
  return (
    <div className={`flex flex-col items-center justify-center py-20 text-center ${className}`}>
      <div className="w-24 h-24 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mb-4">
        <Image
          src={img || emptyImg}
          alt="empty"
          className="w-12 h-12 object-contain"
        />
      </div>

      <h3 className="text-sm lg:text-base font-bold text-(--primary)">
        {title}
      </h3>

      {desc && (
        <p className="text-(--item-text) max-w-sm mt-2 text-medium text-sm">
          {desc}
        </p>
      )}

      {btnLabel && href && (
        <Button
          asChild
          className="mt-6 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white rounded-xl shadow-sm hover:shadow-md transition-all lg:font-semibold text-xs! lg:text-sm!"
        >
          <Link href={`/${locale}${href}`} className="">
            {btnLabel}
            <Plus className="w-5 h-5 bg-white rounded-sm text-(--primary)" />
          </Link>
        </Button>
      )}
    </div>
  );
}
