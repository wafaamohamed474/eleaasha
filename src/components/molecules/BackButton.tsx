"use client";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

type BackButtonProps = {
  title: string;
};
export default function BackButton({ title }: BackButtonProps) {
  const router = useRouter();
  const locale = useLocale();
  return (
    <div className="flex items-center gap-2 lg:hidden mb-4 relative text-(--primary)">
      <button
        onClick={() => router.back()}
        className={locale === "ar" ? "absolute right-0" : "absolute left-0"}
      >
        {locale === "ar" ? (
          <IoIosArrowForward size={24} />
        ) : (
          <IoIosArrowBack size={24} />
        )}
      </button>
      <h1 className="text-xl font-bold text-center w-full">{title}</h1>
    </div>
  );
}
