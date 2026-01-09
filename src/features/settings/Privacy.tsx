"use client";

import { useTranslations, useLocale } from "next-intl";
import BackButton from "@/components/molecules/BackButton";
import SectionHeader from "@/components/atoms/SectionHeader";
import ContentSkeleton from "@/components/molecules/ContentSkeleton";
import { useGetPagesByTypeQuery } from "@/store/services/authApi";

export default function Privacy() {
  const t = useTranslations("sidebar");
  const locale = useLocale();
  const { data: pages, isLoading } = useGetPagesByTypeQuery({
    lang: locale,
    type: "privacy",
  });

  if (isLoading) return <ContentSkeleton />;

  const description = pages?.data?.items?.[0]?.description || "";

  // ===== Slice main description from numbered sections =====
  const match = description.match(/(\d+\..*)/s);
  const mainDescription = match
    ? description.slice(0, match.index).trim()
    : description;
  const sectionsText = match ? description.slice(match.index).trim() : "";

  // ===== Split sections into title + subpoints =====
  const sections = sectionsText
    ? sectionsText.split(/\r\n(?=\d+\.)/).map((section) => {
        const lines = section
          .split("\r\n")
          .filter((line) => line.trim() !== "");
        return {
          title: lines[0],
          subPoints: lines.slice(1),
        };
      })
    : [];

  return (
    <div className="flex flex-col gap-6">
      <BackButton title={t("privacy")} />

      <div className="">
        <SectionHeader title={t("privacy")} />

        <div className="w-full">
          {/* Main description */}
          {mainDescription && <p className="mb-4 text-sm text-gray-500 text-center">{mainDescription}</p>}

          {/* Numbered sections */}
          {sections.map((section, idx) => (
            <div key={idx} className="mb-6 w-full">
              <p className="font-medium text-sm mb-2 text-gray-500  break-words">
                {section.title}
              </p>

              {section.subPoints.length > 0 && (
                <ul className="list-disc list-outside ps-6 space-y-1 text-(--settings-content) text-xs break-words">
                  {section.subPoints.map((line, i) => (
                    <li key={i} className="break-words">
                      {line}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
