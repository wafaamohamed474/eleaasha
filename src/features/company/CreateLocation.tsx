"use client";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";

import { AuthInput } from "@/components/ui/AuthInput";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  useAddLocationMutation,
  useGetCitiesQuery,
} from "@/store/services/authApi";
import {
  LocationInput,
  createLocationSchema,
} from "@/lib/schemas/locationSchema";
import { useLocale } from "next-intl";

export default function CreateLocation() {
  const t = useTranslations("Company");
  const locale = useLocale();
  const [addLocation, { isLoading }] = useAddLocationMutation();
  const { data: citiesData, isLoading: isCitiesLoading } =
    useGetCitiesQuery("ar");

  const schema = createLocationSchema(t);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<LocationInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      workers_count: 0,
      address: "",
      city_id: undefined,
      latitude: undefined,
      longitude: undefined,
      note: "",
    },
  });

  const onSubmit = async (data: LocationInput) => {
    try {
      await addLocation({
        ...data,
        lang: "ar",
      }).unwrap();
      toast.success(t("Location added successfully"));
      reset();
    } catch (error: any) {
      toast.error(error?.data?.message || t("Something went wrong"));
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-xl font-bold mb-6 text-center">
        {t("Add New Location")}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create Location Name */}
          <AuthInput
            label={t("Location Name")}
            placeholder={t("Enter location name")}
            error={errors.name?.message}
            {...register("name")}
          />

          {/* Workers Count */}
          <AuthInput
            label={t("Workers Count")}
            type="number"
            placeholder={t("Enter workers count")}
            error={errors.workers_count?.message}
            {...register("workers_count")}
          />

          {/* Address */}
          <AuthInput
            label={t("Address")}
            placeholder={t("Enter specific address")}
            error={errors.address?.message}
            {...register("address")}
          />

          {/* City - Styled Native Select */}
          <div className="flex flex-col gap-2 w-full">
            <Label className="text-xs font-semibold text-(--label-text)">
              {t("City")}
            </Label>
            <select
              className={`
                  h-12 w-full rounded-md border bg-(--input-bg) px-3 py-2 text-xs md:text-sm lg:text-base ring-offset-background 
                  file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground 
                  focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50
                  border-transparent transition-all duration-200 hover:bg-white hover:border-(--secondary)/20
                  focus-visible:bg-white focus-visible:border-(--secondary)
                  ${
                    errors.city_id
                      ? "border-(--error) focus-visible:border-(--error)"
                      : ""
                  }
                `}
              disabled={isCitiesLoading}
              {...register("city_id")}
            >
              <option value="" disabled selected>
                {t("Select City")}
              </option>
              {citiesData?.data?.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name_ar}
                </option>
              ))}
            </select>
            {errors.city_id && (
              <span className="text-xs text-(--error) font-semibold ml-1">
                {errors.city_id.message}
              </span>
            )}
          </div>
        </div>

        {/* Map Placeholder - Latitude & Longitude */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-(--label-text)">
            {t("Select Location on Map")}
          </Label>
          <div className="h-48 bg-muted/20 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground relative">
            <span className="mb-2 text-sm text-center px-4">
              {t("mapPendingMsg")}
            </span>

            <div className="grid grid-cols-2 gap-4 w-full max-w-md px-4 absolute bottom-4">
              <AuthInput
                label={t("Latitude")}
                type="number"
                placeholder={t("Latitude")}
                className="bg-white/80"
                error={errors.latitude?.message}
                {...register("latitude")}
              />
              <AuthInput
                label={t("Longitude")}
                type="number"
                placeholder={t("Longitude")}
                className="bg-white/80"
                error={errors.longitude?.message}
                {...register("longitude")}
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <AuthInput
          label={t("Additional Notes (Optional)")}
          placeholder={t("Enter any additional notes")}
          error={errors.note?.message}
          {...register("note")}
        />

        <Button
          type="submit"
          className="w-full md:w-auto md:min-w-[200px] flex mx-auto"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t("Save")}
        </Button>
      </form>
    </div>
  );
}
