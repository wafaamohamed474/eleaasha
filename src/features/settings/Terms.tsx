"use client";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import BackButton from "@/components/molecules/BackButton";
import { useGetPagesByTypeQuery } from "@/store/services/authApi";
import SectionHeader from "@/components/atoms/SectionHeader";
import ContentSkeleton from "@/components/molecules/ContentSkeleton";

export default function Terms() {
  const t = useTranslations("sidebar");
  const locale = useLocale();

  const { data: pages, isLoading } = useGetPagesByTypeQuery({
    lang: locale,
    type: "terms",
  });

  const sections = pages?.data?.items?.[0]?.description
    ?.split(/\r\n(?=\d+\.)/)
    .filter((section: string) => section.trim() !== "");

  if (isLoading) {
    return <ContentSkeleton />;
  }
  return (
    <div className="flex flex-col gap-6">
      {/* Mobile Header */}
      <BackButton title={t("terms")} />

      <div className="">
        <SectionHeader title={t("terms")} />
        <div className="w-full ">
          {sections?.map((section: string, index: number) => {
            const lines: string[] = section
              .split("\r\n")
              .filter((line) => line.trim() !== "");
            const mainTitle: string = lines[0];
            const subPoints: string[] = lines.slice(1);

            return (
              <div key={index} className="mb-6 w-full">
                {/* Main numbered title */}
                <p className="font-medium text-sm  mb-2 text-gray-500 w-full break-words">
                  {mainTitle}
                </p>

                {/* Subpoints as bullets */}
                {subPoints.length > 0 && (
                  <ul className="list-disc list-outside ps-6 space-y-1 text-(--settings-content) w-full break-words text-xs ">
                    {subPoints.map((line, i) => (
                      <li key={i} className="w-full break-words">
                        {line}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
