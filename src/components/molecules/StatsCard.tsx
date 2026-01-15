import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons";
import { cn } from "@/lib/utils";
import { IoMdTrendingDown } from "react-icons/io";
import Link from "next/link";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon | IconType;
  iconColor?: string;
  iconBg?: string;
  trend?: "up" | "down";
  shadow?: string;
  href?: string;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  iconColor = "text-white",
  iconBg = "bg-primary",
  trend = "up",
  shadow,
  href,
}: StatsCardProps) {
  const content = (
    <div
      className={cn(
        "bg-white rounded-2xl p-4 border border-gray-50 flex flex-col gap-4 transition-all duration-200",
        shadow,
        href && "hover:shadow-md cursor-pointer hover:border-(--primary)/20"
      )}
    >
      <div className="flex items-start justify-between w-full">
        <div className="flex flex-col gap-1 items-start">
          <div className={cn("p-2 rounded-lg", iconBg)}>
            <Icon className={cn("text-sm", iconColor)} />
          </div>
          <span className="text-[10px] md:text-xs text-(--item-text)">
            {title}
          </span>
          <span className="text-xs md:text-sm font-semibold ">{value}</span>
        </div>

        {/* Trend Indicator (Mock) */}

        <div
          className={cn(
            "flex items-center gap-1 text-lg font-semibold rotate-180 ",
            trend === "up" ? "text-(--primary)" : "text-(--secondary)"
          )}
        >
          <IoMdTrendingDown />
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block group">
        {content}
      </Link>
    );
  }

  return content;
}
