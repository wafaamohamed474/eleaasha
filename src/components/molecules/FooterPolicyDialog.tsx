"use client";

import { useTranslations, useLocale } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetPagesByTypeQuery } from "@/store/services/authApi";
import ContentSkeleton from "@/components/molecules/ContentSkeleton";
import SectionHeader from "@/components/atoms/SectionHeader";

interface FooterPolicyDialogProps {
  type: "terms" | "privacy" | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function FooterPolicyDialog({
  type,
  isOpen,
  onClose,
}: FooterPolicyDialogProps) {
  const t = useTranslations("sidebar");
  const locale = useLocale();

  const { data: pages, isLoading } = useGetPagesByTypeQuery(
    {
      lang: locale,
      type: type || "terms",
    },
    { skip: !type }
  );

  const title = type === "terms" ? t("terms") : t("privacy");
  const description = pages?.data?.items?.[0]?.description || "";

  // Logic for Terms (split by numbered sections)
  const termsSections =
    type === "terms"
      ? description
          .split(/\r\n(?=\d+\.)/)
          .filter((section: string) => section.trim() !== "")
      : [];

  // Logic for Privacy (split into main description + numbered sections)
  let privacyMainDescription = "";
  let privacySections: { title: string; subPoints: string[] }[] = [];

  if (type === "privacy") {
    const match = description.match(/(\d+\..*)/s);
    privacyMainDescription = match
      ? description.slice(0, match.index).trim()
      : description;
    const sectionsText = match ? description.slice(match.index).trim() : "";

    privacySections = sectionsText
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
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className=" max-h-[80vh] overflow-y-auto w-[95vw] rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-(--primary) text-center mb-4">
            {title}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <ContentSkeleton />
        ) : (
          <div className="space-y-6">
            {type === "terms" &&
              termsSections.map((section: string, index: number) => {
                const lines: string[] = section
                  .split("\r\n")
                  .filter((line) => line.trim() !== "");
                const mainTitle: string = lines[0];
                const subPoints: string[] = lines.slice(1);

                return (
                  <div key={index} className="w-full">
                    <p className="font-medium text-sm mb-2 text-gray-700 w-full break-words">
                      {mainTitle}
                    </p>
                    {subPoints.length > 0 && (
                      <ul className="list-disc list-outside ps-6 space-y-1 text-gray-600 w-full break-words text-xs">
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

            {type === "privacy" && (
              <>
                {privacyMainDescription && (
                  <p className="mb-4 text-sm text-gray-600 text-center">
                    {privacyMainDescription}
                  </p>
                )}
                {privacySections.map((section, idx) => (
                  <div key={idx} className="w-full">
                    <p className="font-medium text-sm mb-2 text-gray-700 break-words">
                      {section.title}
                    </p>
                    {section.subPoints.length > 0 && (
                      <ul className="list-disc list-outside ps-6 space-y-1 text-gray-600 text-xs break-words">
                        {section.subPoints.map((line, i) => (
                          <li key={i} className="break-words">
                            {line}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
