import Image from "next/image";
import { useLocale } from "next-intl";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { FaHashtag, FaClock } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { PiForkKnifeFill } from "react-icons/pi";
import placeholderImg from "@/assets/images/Placeholder_view_vector.svg.png";
import { TodaySummary } from "@/types/dashboard";
import Link from "next/link";
import { formatTimeToArabic } from "@/utils/time";

interface TodaySummaryCardProps {
  summary: TodaySummary;
}

export default function TodaySummaryCard({ summary }: TodaySummaryCardProps) {
  const locale = useLocale();
  const isRTL = locale === "ar";

  const lastOrder = summary.last_order;

  const formattedStartTime =
    isRTL && lastOrder?.delivery_time_start
      ? formatTimeToArabic(lastOrder.delivery_time_start)
      : lastOrder?.delivery_time_start;

  const formattedEndTime =
    isRTL && lastOrder?.delivery_time_end
      ? formatTimeToArabic(lastOrder.delivery_time_end)
      : lastOrder?.delivery_time_end;

  return (
    <div
      className="bg-(--primary) rounded-3xl py-4 px-6 text-white flex flex-col md:flex-row gap-6 
    items-center shadow-lg shadow-(--shadow-primary-lg) relative overflow-hidden"
    >
      {/* Details Side */}
      <div className="w-full md:w-2/3 flex flex-col justify-start items-start gap-3 py-2">
        <div className="flex    ">
          <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold">
            <Calendar size={14} />
            {isRTL ? "طلب اليوم" : "Today's Order"}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-1 w-full">
          <DetailItem
            icon={PiForkKnifeFill}
            label={isRTL ? "نوع الوجبة" : "Meal Type"}
            value={lastOrder?.meal?.name || "---"}
            isRTL={isRTL}
          />
          <DetailItem
            icon={FaHashtag}
            label={isRTL ? "عدد الوجبات اليوم" : "Total Meals"}
            value={lastOrder?.quantity.toString() || "---"}
            isRTL={isRTL}
          />
          <DetailItem
            icon={FaLocationDot}
            label={isRTL ? "اسم الموقع" : "Site Name"}
            value={lastOrder?.site?.name || "---"}
            isRTL={isRTL}
          />
          <DetailItem
            icon={FaClock}
            label={isRTL ? "موعد التسليم" : "Delivery Time"}
            value={`${formattedStartTime || "---"} : ${
              formattedEndTime || "---"
            }`}
            isRTL={isRTL}
          />
        </div>

        <button
          className="mt-1   sm:w-fit bg-white 
        text-(--primary) px-6 py-2.5 rounded-xl text-xs font-bold flex  shadow-sm hover:bg-opacity-10  transition-colors   tracking-wider"
        >
          <Link
            href={`/${locale}/dashboard/orders/${lastOrder?.id}`}
            className="flex items-center gap-2"
          >
            {isRTL ? "عرض التفاصيل" : "View Details"}
            {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </Link>
        </button>
      </div>
      {/* Image Side */}
      <div className="w-full max-w-5/12 hidden md:block  aspect-square relative rounded-2xl overflow-hidden shadow-xl">
        <Image
          src={lastOrder?.meal?.image || placeholderImg}
          alt="Order Summary"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
  isRTL,
}: {
  icon: any;
  label: string;
  value: string;
  isRTL: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-1 w-full")}>
      <div className="p-1">
        <Icon size={16} className="text-white" />
      </div>
      <div className={cn("flex items-center justify-start w-full")}>
        <span className="text-[10px] text-white font-medium ">{label} : </span>
        <span className="text-[10px] font-medium truncate lg:max-w-[150px] ">
          {value}
        </span>
      </div>
    </div>
  );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");
