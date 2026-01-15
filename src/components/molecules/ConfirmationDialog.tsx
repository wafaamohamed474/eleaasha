"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useLocale } from "next-intl";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  warningText?: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel?: () => void;
  variant?: "destructive" | "default";
  isLoading?: boolean;
}

export default function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  warningText,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  variant = "destructive",
  isLoading = false,
}: ConfirmationDialogProps) {
  const locale = useLocale();
  const isRTL = locale === "ar";

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[500px] rounded-3xl p-10 gap-8"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Close Button */}
        <button
          onClick={handleCancel}
          className={`absolute top-4 ${
            isRTL ? "left-4" : "right-4"
          } w-7 h-7 rounded-full bg-orange-100 hover:bg-orange-200 transition-colors flex items-center justify-center`}
          disabled={isLoading}
        >
          <X size={15} className="text-orange-500" />
        </button>

        <DialogHeader className="w-full text-center!">
          <DialogTitle className="text-sm md:text-base font-semibold text-black">
            {title}
          </DialogTitle>
          <DialogDescription className="text-xs md:text-base text-(--item-text) font-medium ">
            {description}
          </DialogDescription>
          {warningText && (
            <p className="text-xs md:text-sm text-(--warning-text) font-normal">
              {warningText}
            </p>
          )}
        </DialogHeader>

        <DialogFooter className="flex flex-row items-center w-full justify-center!">
          {/* Cancel Button */}
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className="w-fit h-10 rounded-xl text-xs md:text-sm font-semibold border-2 hover:bg-(--secondary-foreground)/70 bg-(--secondary-foreground) text-black"
          >
            {cancelText}
          </Button>

          {/* Confirm Button */}
          <Button
            variant={variant}
            onClick={handleConfirm}
            disabled={isLoading}
            className={`w-fit h-10 rounded-xl text-xs md:text-sm font-semibold ${
              variant === "destructive"
                ? "bg-(--warning-text) hover:bg-(--warning-text)/70 text-white"
                : ""
            }`}
          >
            {isLoading ? (isRTL ? "جاري..." : "Loading...") : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
