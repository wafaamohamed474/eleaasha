"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import aboutImage from "@/assets/images/AboutImg.png";

export default function About() {
  const t = useTranslations("About");
  return (
    <section className="sec-p" id="about">
      <div className="container-custom flex flex-col md:flex-row items-center justify-between">
        <div className="w-full lg:max-w-2/3">
          <h1 className="text-3xl font-bold text-(--secondary) pb-5">
            {t("title")}
          </h1>
          <p className="text-sm md:text-md lg:text-xl font-medium md:font-semibold whitespace-pre-line">
            {t("description")}
          </p>
        </div>
        <div>
          <Image
            src={aboutImage}
            alt="About"
            className="hidden lg:block md:w-40 md:h-40 lg:w-60 lg:h-60 xl:w-80 xl:h-80 object-contain"
          />
        </div>
      </div>
    </section>
  );
}
