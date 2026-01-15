import { Check, Truck, Clock, FileText, Utensils } from "lucide-react";
import { ReactNode } from "react";

type Step = {
  id: number;
  labelAr: string;
  labelEn: string;
  icon: ReactNode;
};

interface OrderStepperProps {
  status: string; // backend status like "pending" or "قيد الانتظار"
  locale?: string;
}

const steps: Step[] = [
  {
    id: 0,
    labelAr: "في الانتظار",
    labelEn: "Pending",
    icon: <Clock className="w-3 h-3" />,
  },
  {
    id: 1,
    labelAr: "قيد التحضير",
    labelEn: "Preparing",
    icon: <Utensils className="w-3 h-3" />,
  },
  {
    id: 2,
    labelAr: "قيد التوصيل",
    labelEn: "Delivering",
    icon: <Truck className="w-3 h-3" />,
  },
  {
    id: 3,
    labelAr: "مكتمل",
    labelEn: "Completed",
    icon: <Check className="w-3 h-3" />,
  },
];

export default function OrderStepper({ status, locale }: OrderStepperProps) {
  // Map backend status to step index
  const statusMap: Record<string, number> = {
    pending: 0,
    "قيد الانتظار": 0,
    preparing: 1,
    "قيد التحضير": 1,
    delivering: 2,
    "قيد التوصيل": 2,
    completed: 3,
    مكتمل: 3,
  };

  const currentStep = statusMap[status] ?? 0;

  return (
    <div
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="flex items-center w-full"
    >
      {steps.map((step, index) => (
        <div
          key={step.id}
          className="flex-1 flex flex-col items-center relative!   w-full "
        >
          {/* Connector line */}

          <div
            className={`absolute top-2.5 left-0! w-full! right-0! h-[1px] z-1 ${
              index <= currentStep ? "bg-(--primary)" : "bg-slate-200"
            }`}
          />

          {/* Icon */}
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center mb-2 z-2
              ${
                index <= currentStep
                  ? "bg-(--primary) text-white"
                  : "bg-white border border-(--item-text) text-(--item-text)"
              }
            `}
          >
            {step.icon}
          </div>

          {/* Label */}
          <span
            className={`text-[10px] font-medium ${
              index <= currentStep ? "text-(--primary)" : "text-(--item-text)"
            }`}
          >
            {locale === "ar" ? step.labelAr : step.labelEn}
          </span>
        </div>
      ))}
    </div>
  );
}
