"use client";
import { LocationItem } from "@/types/locations";
import { MapPin, Users, Building2, Trash2 } from "lucide-react";
import { useLocale } from "next-intl";
import { FaCity } from "react-icons/fa";
import { Button } from "../ui/button";
import { useState } from "react";
import ConfirmationDialog from "./ConfirmationDialog";
import { useDeleteSingleLocationMutation } from "@/store/services/authApi";
import { toast } from "sonner";

interface LocationCardProps {
  item: LocationItem;
  isNotHome?: boolean;
}

export default function LocationCard({ item, isNotHome }: LocationCardProps) {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const [deleteLocation, { isLoading }] = useDeleteSingleLocationMutation({});
  const handleConfirmDelete = async () => {
    try {
      const res = await deleteLocation({
        id: item.id.toString(),
        lang: locale,
      }).unwrap();

      toast.success("", {
        description: res?.message || "Location deleted successfully",
      });

      setShowDeleteDialog(false);
    } catch (err) {
      console.error("Failed to delete location:", err);
      toast.error("", { description: "Failed to delete location" });
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 flex flex-col gap-5 group hover:shadow-[var(--shadow-primary-sm)] transition-colors">
        <div className="flex items-center justify-between">
          {/* Location ID Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-(--primary) text-white text-[10px] font-bold shadow-sm">
            <Building2 size={12} />
            {item.name ?? ""}
          </div>

          {/* Status Badge */}
          {item.status && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-bold border border-green-100">
              {item.status ?? ""}
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {/* Site Name */}
          <div className="flex items-center gap-2 text-(--item-text) group-hover:text-gray-600 transition-colors">
            <Building2 size={14} className="grow-0 text-(--item-text)" />

            <span className="text-[10px] font-medium grow-0 whitespace-nowrap ">
              {isRTL ? "أسم الموقع" : "Site Name"} :
            </span>
            <span className="text-[10px] md:text-xs font-bold text-gray-900 grow">
              {item.name ?? ""}
            </span>
          </div>

          {/* Worker Count */}
          <div className="flex items-start gap-2 text-(--item-text) group-hover:text-gray-600 transition-colors">
            <Users size={14} className="grow-0 text-(--item-text)" />

            <span className="text-[10px] font-medium grow-0 whitespace-nowrap">
              {isRTL ? "عدد العمال" : "Workers"} :
            </span>
            <span className="text-[10px] md:text-xs font-bold text-gray-900 grow ">
              {item.workers_count ?? ""} {isRTL ? "عامل" : "Staff"}
            </span>
          </div>
          {/* Address */}

          <div className="flex items-start gap-2 text-(--item-text) group-hover:text-gray-600 transition-colors">
            <MapPin size={14} className="grow-0 text-(--item-text)" />

            <span className="text-[10px] font-medium grow-0 whitespace-nowrap">
              {isRTL ? "العنوان" : "Address"} :
            </span>
            <span className="text-[10px] md:text-xs font-bold text-gray-900 grow">
              {item.address ?? ""}
            </span>
          </div>

          <div className="flex flex-row justify-between">
            {/* City */}
            <div className="flex items-start gap-2 text-(--item-text) group-hover:text-gray-600 transition-colors">
              <FaCity size={14} className="grow-0 text-(--item-text)" />

              <span className="text-[10px] font-medium grow-0 whitespace-nowrap">
                {isRTL ? "المدينة" : "City"} :
              </span>
              <span className="text-[10px] md:text-xs font-bold text-gray-900 grow">
                {item.city ?? ""}
              </span>
            </div>
            {isNotHome && (
              <>
                <Button
                  variant="primary"
                  className="w-fit bg-(--warning-text)/20 text-(--warning-text) hover:bg-(--warning-text)/30 border border-(--warning-text) text-xs h-7"
                  onClick={handleDeleteClick}
                >
                  <Trash2 size={14} className="grow-0 text-(--warning-text)" />
                  {isRTL ? "حذف" : "Delete"}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <ConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title={isRTL ? "حذف الموقع" : "Delete Location"}
        description={
          isRTL
            ? `هل تريد حذف موقع "${item.name ?? ""}" ؟`
            : `Do you want to delete location "${item.name ?? ""}"?`
        }
        warningText={
          isRTL
            ? "تنبيه! هذا الإجراء لا يمكن التراجع عنه."
            : "Warning! This action cannot be undone."
        }
        confirmText={isRTL ? "نعم، حذف الموقع" : "Yes, Delete Location"}
        cancelText={isRTL ? "إلغاء" : "Cancel"}
        onConfirm={handleConfirmDelete}
        variant="destructive"
        isLoading={isLoading}
      />
    </>
  );
}
