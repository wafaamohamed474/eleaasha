"use client";
import SectionHeader from "@/components/atoms/SectionHeader";
import BackButton from "@/components/molecules/BackButton";
import { AuthButton } from "@/components/ui/AuthButton";
import { AuthInput } from "@/components/ui/AuthInput";
import { createProfileSchema, ProfileInput } from "@/lib/schemas/authSchema";
import {
  useGetUserInfoQuery,
  useUpdateProfileMutation,
} from "@/store/services/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useLocale, useTranslations } from "use-intl";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Phone, User, Building2, Camera } from "lucide-react";
import ProfileSkeleton from "@/components/molecules/ProfileSkeleton";

export function Profile() {
  const t = useTranslations("Auth.profile");
  const locale = useLocale();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const { data: profileData, isLoading: isProfileLoading } =
    useGetUserInfoQuery(locale);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<ProfileInput>({
    resolver: zodResolver(createProfileSchema(t)),
    defaultValues: {
      name: "",
      company_name: "",
      phone: "",
    },
  });

  const { handleSubmit, register, reset, formState, setValue } = form;

  const onSubmit = async (values: ProfileInput) => {
    try {
      const formData = new FormData();
      formData.append("lang", locale);
      if (values.name) formData.append("name", values.name);
      if (values.company_name)
        formData.append("company_name", values.company_name);
      if (values.phone) formData.append("phone", `966${values.phone}`);

      const imageFile =
        values.image instanceof FileList ? values.image[0] : values.image;
      if (imageFile instanceof File) {
        formData.append("image", imageFile);
      }

      const response = await updateProfile({
        lang: locale,
        formData,
      }).unwrap();
      toast.success(
        response.message ||
          (locale === "ar"
            ? "تم تحديث الملف الشخصي بنجاح"
            : "Profile Updated successfully")
      );
      reset(values);
    } catch (error: any) {
      console.log(error);
      toast.error(
        error?.data?.message ||
          (locale === "ar"
            ? "فشل تحديث الملف الشخصي"
            : "Failed to update profile")
      );
    }
  };

  useEffect(() => {
    if (profileData?.data && !formState.isDirty) {
      reset({
        name: profileData.data.user.name ?? "",
        company_name: profileData.data.user.Company_name ?? "",
        phone: (profileData.data.user.phone ?? "").replace(/^(\+966|966)/, ""),
      });
      setPreviewUrl(profileData.data.user.image);
    }
  }, [profileData, reset, formState.isDirty]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      setValue("image", e.target.files, { shouldDirty: true });
    }
  };

  if (isProfileLoading) return <ProfileSkeleton />;
  return (
    <div className="flex flex-col gap-6">
      <BackButton title={t("title")} />
      <div className="sec-class flex flex-col items-center">
        <div className="w-full max-w-md">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 py-5">
            {/* Avatar Section */}
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-(--primary)/10 bg-(--input-bg) flex items-center justify-center relative shadow-sm">
                  {previewUrl ? (
                    <Image
                      src={previewUrl}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <User size={64} className="text-(--primary)/20" />
                  )}

                  {/* Overlay for hover */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Camera className="text-white" size={32} />
                  </div>
                </div>

                {/* Camera Button Badge */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 bg-(--primary) p-2 rounded-full text-white shadow-lg hover:bg-(--secondary) transition-colors"
                >
                  <Camera size={20} />
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {formState.errors.image && (
                  <p className="text-xs text-(--error) text-center mt-2">
                    {formState.errors.image.message as string}
                  </p>
                )}
              </div>
            </div>

            <AuthInput
              label={t("companyName")}
              icon={Building2}
              placeholder={t("companyNamePlaceholder")}
              error={formState.errors.company_name?.message}
              {...register("company_name")}
            />

            <AuthInput
              label={t("managerName")}
              icon={User}
              placeholder={t("managerNamePlaceholder")}
              error={formState.errors.name?.message}
              {...register("name")}
            />

            <AuthInput
              label={t("phone")}
              icon={Phone}
              placeholder={t("phonePlaceholder")}
              phonePrefix="+966"
              error={formState.errors.phone?.message}
              maxLength={9}
              {...register("phone")}
            />

            <div className="">
              <AuthButton
                type="submit"
                loading={isLoading}
                disabled={isLoading || isProfileLoading || !formState.isDirty}
                className="w-full bg-(--primary)"
              >
                {t("submit")}
              </AuthButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
