import { z } from "zod";

const DAYS_ORDER = ["sat", "sun", "mon", "tue", "wed", "thu", "fri"];

export const createOrderSchema = (t: any) => {
  const baseSchema = z.object({
    company_location_id: z.coerce
      .number({ message: t("required") })
      .min(1, { message: t("required") }),

    quantity: z.coerce
      .number({ message: t("required") })
      .min(1, { message: t("required") }),

    delivery_time_start: z.string().min(1, { message: t("required") }),

    meal_id: z.coerce
      .number({ message: t("required") })
      .min(1, { message: t("required") }),
    notes: z.string().optional(),
  });

  return z
    .discriminatedUnion("recurrence", [
      baseSchema.extend({
        recurrence: z.literal("daily"),
        day_from: z.string().optional(),
        day_to: z.string().optional(),
      }),
      baseSchema.extend({
        recurrence: z.literal("weekly"),
        day_from: z.string().min(1, { message: t("required") }),
        day_to: z.string().min(1, { message: t("required") }),
      }),
      baseSchema.extend({
        recurrence: z.literal("monthly"),
        day_from: z.string().min(1, { message: t("required") }),
        day_to: z.string().min(1, { message: t("required") }),
      }),
    ])
    .transform((data) => {
      let delivery_days: string[] | undefined = undefined;

      if (data.recurrence === "daily") {
        delivery_days = [...DAYS_ORDER]; // Daily means all days
      } else if (data.day_from && data.day_to) {
        const fromIndex = DAYS_ORDER.indexOf(data.day_from);
        const toIndex = DAYS_ORDER.indexOf(data.day_to);

        if (fromIndex !== -1 && toIndex !== -1) {
          if (fromIndex <= toIndex) {
            delivery_days = DAYS_ORDER.slice(fromIndex, toIndex + 1);
          } else {
            // Wrap around (e.g. Fri to Mon)
            delivery_days = [
              ...DAYS_ORDER.slice(fromIndex),
              ...DAYS_ORDER.slice(0, toIndex + 1),
            ];
          }
        }
      }

      return {
        company_location_id: data.company_location_id,
        meal_id: data.meal_id,
        quantity: data.quantity,
        recurrence: data.recurrence,
        delivery_time_start: data.delivery_time_start,
        delivery_time_end: "",
        delivery_days,
        notes: data.notes,
      };
    });
};

export type OrderInput = z.input<ReturnType<typeof createOrderSchema>>;
export type OrderOutput = z.output<ReturnType<typeof createOrderSchema>>;
