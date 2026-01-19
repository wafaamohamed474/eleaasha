"use client";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Building2,
  Info,
  Loader2,
  MapPin,
  Plus,
  Text,
  User,
} from "lucide-react";

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
import LocationMap from "@/components/molecules/LocationMap";
import { IoIosListBox } from "react-icons/io";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateLocation() {
  const t = useTranslations("Company");
  const locale = useLocale();
  const router = useRouter();
  const isRTL = locale === "ar";
  const [addLocation, { isLoading }] = useAddLocationMutation();
  const { data: citiesData, isLoading: isCitiesLoading } =
    useGetCitiesQuery(locale);

  const schema = createLocationSchema(t);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<LocationInput>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      name: "",
      workers_count: undefined,
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
        lang: locale,
      }).unwrap();
      toast.success(t("Location added successfully"));

      reset();
      router.push(`/${locale}/dashboard/company`);
    } catch (error: any) {
      toast.error(error?.data?.message || t("Something went wrong"));
    }
  };

  const handleMapSelect = (loc: {
    lat: number;
    lng: number;
    address: string;
    city: string;
  }) => {
    setValue("latitude", loc.lat, { shouldValidate: true });
    setValue("longitude", loc.lng, { shouldValidate: true });
    console.log("location", loc);
    // Map city name to ID
    if (citiesData?.data) {
      const city = citiesData.data.find(
        (c) =>
          c.name_ar.includes(loc.city) ||
          c.name_en.toLowerCase().includes(loc.city.toLowerCase()) ||
          loc.city.includes(c.name_ar) ||
          loc.city.toLowerCase().includes(c.name_en.toLowerCase()),
      );
      if (city) {
        setValue("city_id", city.id, { shouldValidate: true });
      }
    }
  };

  return (
    <div className="sec-class">
      <h1 className="text-base font-semibold lg:text-xl lg:font-bold mb-6 text-center">
        {t("Add New Location")}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create Location Name */}
          <AuthInput
            label={t("Location Name")}
            placeholder={t("Enter location name")}
            error={errors.name?.message}
            className=" lg:placeholder:text-sm"
            icon={Building2}
            {...register("name")}
          />

          {/* Workers Count */}
          <AuthInput
            label={t("Workers Count")}
            type="number"
            placeholder={t("Enter workers count")}
            error={errors.workers_count?.message}
            className=" lg:placeholder:text-sm"
            icon={User}
            {...register("workers_count")}
          />

          {/* Address */}
          <AuthInput
            label={t("Address")}
            placeholder={t("Enter specific address")}
            error={errors.address?.message}
            className=" lg:placeholder:text-sm"
            icon={MapPin}
            {...register("address")}
          />
          {/* City dropdown */}
          <div className="space-y-2 w-full">
            <Label className="text-xs font-semibold text-(--label-text)">
              {t("City")}
            </Label>

            <Controller
              name="city_id"
              control={control}
              render={({ field, fieldState }) => {
                const selectedCity = citiesData?.data?.find(
                  (city) => city.id === field.value,
                );

                return (
                  <div className="space-y-2">
                    <div className="relative flex items-center">
                      <div className="absolute start-3 text-(--primary) z-10 pointer-events-none">
                        <Building2 size={18} />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild disabled={isCitiesLoading}>
                          <button
                            type="button"
                            className={cn(
                              "h-12 w-full bg-(--input-bg) border transition-all duration-200",
                              "text-xs md:text-sm  text-start flex items-center justify-between",
                              "hover:bg-white hover:border-(--secondary)/20",
                              "ps-10 pe-5 rounded-lg",
                              "focus-visible:bg-white focus-visible:border-(--secondary)",
                              "focus-visible:outline-none focus-visible:ring-0",
                              fieldState.error
                                ? "border-(--error)"
                                : "border-transparent",
                            )}
                          >
                            {selectedCity
                              ? locale === "ar"
                                ? selectedCity.name_ar
                                : selectedCity.name_en
                              : t("Select City")}
                            <ChevronDown className="h-4 w-4 opacity-60 shrink-0" />
                          </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                          className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white p-1"
                          align={isRTL ? "end" : "start"}
                        >
                          {citiesData?.data?.map((city) => (
                            <DropdownMenuItem
                              key={city.id}
                              onClick={() => field.onChange(city.id)}
                              className={cn(
                                "text-xs py-1.5 cursor-pointer",
                                isRTL ? "justify-end" : "justify-start",
                                field.value === city.id &&
                                  "bg-(--secondary)/10 font-medium",
                              )}
                            >
                              {locale === "ar" ? city.name_ar : city.name_en}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {fieldState.error && (
                      <p className="text-xs text-(--error)">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                );
              }}
            />
          </div>
          {/* Map Placeholder - Latitude & Longitude */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-(--label-text)">
              {t("Select Location on Map")}
            </Label>
            <LocationMap onLocationSelect={handleMapSelect} />
            <div className="grid grid-cols-2 gap-4">
              <div className="hidden">
                <input type="hidden" {...register("latitude")} />
                <input type="hidden" {...register("longitude")} />
              </div>
              {errors.latitude && (
                <p className="text-xs text-(--error)">
                  {errors.latitude.message}
                </p>
              )}
              {errors.longitude && (
                <p className="text-xs text-(--error)">
                  {errors.longitude.message}
                </p>
              )}
            </div>
          </div>
          {/* Notes */}
          <AuthInput
            label={t("Additional Notes (Optional)")}
            placeholder={t("Enter any additional notes")}
            error={errors.note?.message}
            className=" lg:placeholder:text-sm"
            icon={IoIosListBox}
            {...register("note")}
          />
        </div>

        <Button
          type="submit"
          className="w-full md:w-auto md:min-w-[200px] flex mx-auto bg-(--primary) font-bold text-sm lg:text-base hover:bg-(--primary)/80 text-white py-6"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t("Save")}
        </Button>
      </form>
    </div>
  );
}
