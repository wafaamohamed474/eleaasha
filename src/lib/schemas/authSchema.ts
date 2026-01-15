import { z } from "zod";

export const createLoginSchema = (t: (key: string) => string) =>
  z.object({
    phone: z
      .string()
      .nonempty(t("required"))
      .regex(/^\d{9}$/, t("phoneError")),
    password: z.string().nonempty(t("required")).min(8, t("passwordError")),
  });

export const createRegisterSchema = (t: (key: string) => string) =>
  z.object({
    company_name: z
      .string()
      .nonempty(t("required"))
      .min(2, t("companyNameError")),
    name: z.string().nonempty(t("required")).min(2, t("nameError")),
    phone: z
      .string()
      .nonempty(t("required"))
      .regex(/^\d{9}$/, t("phoneError")),
    password: z.string().nonempty(t("required")).min(8, t("passwordError")),
  });

export const createVerifySchema = (t: (key: string) => string) =>
  z.object({
    verificationCode: z
      .string()
      .nonempty(t("required"))
      .length(4, t("otpError")),
    phone: z
      .string()
      .nonempty(t("required"))
      .regex(/^966\d{9}$/, t("phoneError")),
  });

export const createPasswordSchema = (t: (key: string) => string) =>
  z
    .object({
      current_password: z
        .string()
        .nonempty(t("currentRequired"))
        .min(8, t("minCurrent")),
      new_password: z.string().nonempty(t("newRequired")).min(8, t("minNew")),
      confirm_password: z
        .string()
        .nonempty(t("newRequired"))
        .min(8, t("minNew")),
    })
    .refine((data) => data.new_password === data.confirm_password, {
      message: t("mismatch"),
      path: ["confirm_password"],
    });

export const createResetPasswordSchema = (t: (key: string) => string) =>
  z
    .object({
      phone: z
        .string()
        .nonempty(t("required"))
        .regex(/^966\d{9}$/, t("phoneError")),
      new_password: z.string().nonempty(t("newRequired")).min(8, t("minNew")),
      new_password_confirmation: z
        .string()
        .nonempty(t("newRequired"))
        .min(8, t("minNew")),
    })
    .refine((data) => data.new_password === data.new_password_confirmation, {
      message: t("mismatch"),
      path: ["new_password_confirmation"],
    });

export const createForgetPasswordSchema = (t: (key: string) => string) =>
  z.object({
    phone: z
      .string()
      .nonempty(t("required"))
      .regex(/^\d{9}$/, t("phoneError")),
  });

export const createProfileSchema = (t: (key: string) => string) =>
  z.object({
    company_name: z.string().min(2, t("companyNameError")).optional(),
    name: z.string().min(2, t("nameError")).optional(),
    phone: z
      .string()
      .regex(/^\d{9}$/, t("phoneError"))
      .optional()
      .or(z.literal("")),
    image: z
      .any()
      .optional()
      .refine((file) => {
        if (!file || (file instanceof FileList && file.length === 0))
          return true;
        const f = file instanceof FileList ? file[0] : file;
        return f.size <= 5 * 1024 * 1024;
      }, t("imageSizeError"))
      .refine((file) => {
        if (!file || (file instanceof FileList && file.length === 0))
          return true;
        const f = file instanceof FileList ? file[0] : file;
        return ["image/jpeg", "image/png", "image/webp"].includes(f.type);
      }, t("imageTypeError")),
  });

export type LoginInput = z.infer<ReturnType<typeof createLoginSchema>>;
export type RegisterInput = z.infer<ReturnType<typeof createRegisterSchema>>;
export type VerifyInput = z.infer<ReturnType<typeof createVerifySchema>>;
export type PasswordInput = z.infer<ReturnType<typeof createPasswordSchema>>;
export type ProfileInput = z.infer<ReturnType<typeof createProfileSchema>>;
export type ForgetPasswordInput = z.infer<
  ReturnType<typeof createForgetPasswordSchema>
>;
export type ResetPasswordInput = z.infer<
  ReturnType<typeof createResetPasswordSchema>
>;
