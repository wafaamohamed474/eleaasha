import Image from "next/image";
import { useLocale } from "next-intl";
import {
  Calendar,
  Utensils,
  Users,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { TodaySummary } from "@/types/dashboard";

interface TodaySummaryCardProps {
  summary: TodaySummary;
}

export default function TodaySummaryCard({ summary }: TodaySummaryCardProps) {
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <div className="bg-(--primary) rounded-3xl p-6 text-white flex flex-col md:flex-row gap-6 items-center shadow-lg shadow-orange-200/50 relative overflow-hidden">
      {/* Image Side */}
      <div className="w-full md:w-1/3 aspect-square relative rounded-2xl overflow-hidden shadow-xl">
        <Image
          src="https://eaasha.computinggate.com/uploads/banners/1733230897_0.png" // Fallback for demo, should be dynamic if possible
          alt="Order Summary"
          fill
          className="object-cover"
        />
      </div>

      {/* Details Side */}
      <div className="w-full md:w-2/3 flex flex-col gap-5 py-2">
        <div className="flex items-center justify-between">
          <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold">
            <Calendar size={14} />
            {isRTL ? "طلب اليوم" : "Today's Order"}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DetailItem
            icon={Utensils}
            label={isRTL ? "نوع الوجبة" : "Meal Type"}
            value={summary.top_meal_name || "---"}
            isRTL={isRTL}
          />
          <DetailItem
            icon={Users}
            label={isRTL ? "عدد الوجبات اليوم" : "Total Meals"}
            value={summary.num_of_meals.toString()}
            isRTL={isRTL}
          />
          <DetailItem
            icon={MapPin}
            label={isRTL ? "اسم الموقع" : "Site Name"}
            value={summary.site_name || "---"}
            isRTL={isRTL}
          />
          <DetailItem
            icon={Clock}
            label={isRTL ? "موعد التسليم" : "Delivery Time"}
            value={`${summary.next_delivery_time} - ${summary.next_delivery_time_end}`}
            isRTL={isRTL}
          />
        </div>

        <button className="mt-2 w-full sm:w-fit bg-white text-orange-500 px-6 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-orange-50 transition-colors uppercase tracking-wider">
          {isRTL ? "عرض التفاصيل" : "View Details"}
          {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
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
    <div
      className={cn(
        "flex items-center gap-3",
        isRTL ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div className="p-2 bg-white/10 rounded-lg">
        <Icon size={16} className="text-white" />
      </div>
      <div
        className={cn(
          "flex flex-col gap-0.5",
          isRTL ? "items-end" : "items-start"
        )}
      >
        <span className="text-[10px] text-white/70 font-medium">{label}</span>
        <span className="text-sm font-bold truncate max-w-[150px]">
          {value}
        </span>
      </div>
    </div>
  );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");
