"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import Image from "next/image";
import SAFlag from "@/assets/images/SA_flag.svg";
import USFlag from "@/assets/images/US_flag.svg";
import { cn } from "@/lib/utils";
import { IoIosArrowDown } from "react-icons/io";
import { checkAuthStatus } from "@/lib/auth/authClient";

export const LangSwitch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    setAuth(checkAuthStatus());
  }, []);

  const switchLanguage = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const currentFlag = locale === "ar" ? SAFlag : USFlag;
  const currentLabel = locale === "ar" ? "AR" : "EN";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1 rounded-lg backdrop-blur-md text-white hover:bg-white/20 transition-all duration-300"
      >
        <div>
          <Image
            src={currentFlag}
            alt={currentLabel}
            width={5}
            height={5}
            className="object-cover p-0"
          />
        </div>

        <span
          className={cn(
            "text-sm font-medium text-black",
            auth ? "lg:text-black" : "lg:text-white"
          )}
        >
          {currentLabel}
        </span>
        <IoIosArrowDown
          className={cn(
            "w-5 h-5 transition-transform duration-300 text-black",
            auth ? "lg:text-black" : "lg:text-white",
            isOpen && "rotate-180"
          )}
        />
      </button>

      <div
        className={cn(
          "absolute top-full mt-2 right-0 w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden shadow-lg transition-all duration-300 origin-top-right z-50",
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        )}
      >
        <div className="flex flex-col p-1 gap-1">
          <button
            onClick={() => switchLanguage("ar")}
            className={cn(
              "flex items-center gap-1 px-3 text-white   rounded-lg text-sm font-medium transition-colors",
              locale === "ar" ? "bg-(--primary)" : "hover:bg-white/10  "
            )}
          >
            <div>
              <Image
                src={SAFlag}
                alt="Arabic"
                width={6}
                height={6}
                className="object-cover px-2 py-1"
              />
            </div>

            <span className={cn(auth ? "lg:text-black" : "lg:text-white")}>
              AR
            </span>
          </button>
          <button
            onClick={() => switchLanguage("en")}
            className={cn(
              "flex items-center gap-1 px-3  rounded-lg text-sm font-medium transition-colors",
              locale === "en"
                ? "bg-(--primary) text-white "
                : "text-white hover:bg-white/10"
            )}
          >
            <div>
              <Image
                src={USFlag}
                alt="English"
                width={5}
                height={5}
                className="object-cover px-2 py-1"
              />
            </div>
            <span className={cn(auth ? "lg:text-black" : "lg:text-white")}>
              EN
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
