import { z } from "zod";

export const createLocationSchema = (t: any) =>
  z.object({
    name: z.string().nonempty(t("required")), // Using nonempty as requested
    workers_count: z.coerce.number().min(1, { message: t("required") }),
    address: z.string().nonempty(t("required")),
    // city_id: z.coerce.number().min(1, { message: t("required") }),
    city_id: z.coerce
      .number({ message: t("required") })
      .min(1, { message: t("required") }),

    latitude: z.coerce
      .number()
      .min(-90)
      .max(90, { message: t("required") }),
    longitude: z.coerce
      .number()
      .min(-180)
      .max(180, { message: t("required") }),
    note: z.string().optional(),
  });

export type LocationInput = z.infer<ReturnType<typeof createLocationSchema>>;
