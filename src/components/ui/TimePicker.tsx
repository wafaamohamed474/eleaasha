"use client";

import React, { useState, useEffect } from "react";
import { Clock, ChevronUp, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";

interface TimePickerProps {
  value?: string;
  onChange: (value: string) => void;
  label: string;
  error?: string;
}

export const TimePicker = ({
  value,
  onChange,
  label,
  error,
}: TimePickerProps) => {
  const t = useTranslations("TimePicker");
  const [open, setOpen] = useState(false);
  const [hours, setHours] = useState(12); // 0-23
  const [minutes, setMinutes] = useState(0); // 0-59

  // Initialize from value prop
  useEffect(() => {
    if (value && value.includes(":")) {
      const [h, m] = value.split(":").map(Number);
      if (!isNaN(h)) setHours(h);
      if (!isNaN(m)) setMinutes(m);
    }
  }, [value]);

  const handleConfirm = () => {
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
    onChange(formattedTime);
    setOpen(false);
  };

  const isPM = hours >= 12;
  const displayHours = hours % 12 || 12;

  const toggleAMPM = (toPM: boolean) => {
    if (toPM && !isPM) {
      setHours(hours + 12);
    } else if (!toPM && isPM) {
      setHours(hours - 12);
    }
  };

  const incrementHours = () => {
    // Increment within 12h cycle or 24h? User expects 1-12
    let newDisplayHours = (displayHours % 12) + 1;
    let newHours = isPM
      ? newDisplayHours === 12
        ? 12
        : newDisplayHours + 12
      : newDisplayHours === 12
      ? 0
      : newDisplayHours;
    setHours(newHours);
  };

  const decrementHours = () => {
    let newDisplayHours = displayHours - 1;
    if (newDisplayHours < 1) newDisplayHours = 12;
    let newHours = isPM
      ? newDisplayHours === 12
        ? 12
        : newDisplayHours + 12
      : newDisplayHours === 12
      ? 0
      : newDisplayHours;
    setHours(newHours);
  };

  const incrementMinutes = () => setMinutes((m) => (m + 5) % 60);
  const decrementMinutes = () => setMinutes((m) => (m - 5 + 60) % 60);

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-xs font-semibold text-(--label-text)">
        {label}
      </Label>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            className={cn(
              "h-12 w-full bg-(--input-bg) border border-transparent transition-all duration-200",
              "text-xs md:text-sm  text-start flex items-center gap-3",
              "hover:bg-white hover:border-(--secondary)/20",
              "ps-3 pe-4 rounded-lg outline-none",
              error ? "border-(--error)" : "focus:border-(--secondary)"
            )}
          >
            <Clock className="text-(--primary) size-[18px]" />
            <span
              className={cn(
                value ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {value
                ? `${displayHours.toString().padStart(2, "0")}:${minutes
                    .toString()
                    .padStart(2, "0")} ${isPM ? t("pm") : t("am")}`
                : t("placeholder")}
            </span>
          </button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[320px] p-0 overflow-hidden border-none bg-transparent shadow-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-3xl overflow-hidden shadow-2xl border"
          >
            <div className="p-6 bg-(--primary) text-white text-center">
              <DialogTitle className="text-sm font-medium opacity-80 mb-1 leading-none">
                {label}
              </DialogTitle>
              <div className="text-4xl font-bold tracking-tighter flex items-center justify-center gap-2">
                <span>
                  {displayHours.toString().padStart(2, "0")}:
                  {minutes.toString().padStart(2, "0")}
                </span>
                <span className="text-xl opacity-80 font-medium">
                  {isPM ? t("pm") : t("am")}
                </span>
              </div>
            </div>

            <div className="p-4 flex flex-col items-center gap-6 bg-white">
              <div className="flex justify-center items-center gap-6">
                {/* Hours */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={incrementHours}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-(--primary)"
                  >
                    <ChevronUp className="size-6" />
                  </button>
                  <div className="text-3xl font-semibold w-12 text-center text-gray-700">
                    {displayHours.toString().padStart(2, "0")}
                  </div>
                  <button
                    onClick={decrementHours}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-(--primary)"
                  >
                    <ChevronDown className="size-6" />
                  </button>
                </div>

                <div className="text-3xl font-bold text-gray-300 self-center mb-6">
                  :
                </div>

                {/* Minutes */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={incrementMinutes}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-(--primary)"
                  >
                    <ChevronUp className="size-6" />
                  </button>
                  <div className="text-3xl font-semibold w-12 text-center text-gray-700">
                    {minutes.toString().padStart(2, "0")}
                  </div>
                  <button
                    onClick={decrementMinutes}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-(--primary)"
                  >
                    <ChevronDown className="size-6" />
                  </button>
                </div>
              </div>

              {/* AM/PM Toggle */}
              <div className="flex bg-gray-100 p-1 rounded-xl w-full max-w-[160px]">
                <button
                  type="button"
                  onClick={() => toggleAMPM(false)}
                  className={cn(
                    "flex-1 py-2 text-sm font-semibold rounded-lg transition-all",
                    !isPM
                      ? "bg-white text-(--primary) shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  {t("am")}
                </button>
                <button
                  type="button"
                  onClick={() => toggleAMPM(true)}
                  className={cn(
                    "flex-1 py-2 text-sm font-semibold rounded-lg transition-all",
                    isPM
                      ? "bg-white text-(--primary) shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  {t("pm")}
                </button>
              </div>
            </div>

            <div className="p-4 bg-gray-50 flex gap-3">
              <Button
                variant="ghost"
                className="flex-1 rounded-xl"
                onClick={() => setOpen(false)}
              >
                {t("cancel")}
              </Button>
              <Button
                className="flex-1 bg-(--primary) hover:bg-(--primary)/90 text-white rounded-xl gap-2"
                onClick={handleConfirm}
              >
                <Check className="size-4" />
                {t("set")}
              </Button>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>

      {error && (
        <span className="text-xs text-(--error) font-semibold ml-1">
          {error}
        </span>
      )}
    </div>
  );
};
