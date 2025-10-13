import { z } from "zod";

// Acceptable id values for hazard sections (4-9)
export const HazardId = z.union([
  z.literal(4),
  z.literal(5),
  z.literal(6),
  z.literal(7),
  z.literal(8),
  z.literal(9),
]);

// Normalize common risk labels to lower-case and accept a small enum
export const RiskSchema = z
  .string()
  .min(1)
  .transform((s: string) => s.trim().toLowerCase())
  .refine((s: string) => ["low", "medium", "high"].includes(s), {
    message: 'risk must be one of "low", "medium", "high"',
  });

// Simple YYYY-MM-DD date validator
const DateYMD = z
  .string()
  .refine((s: string) => /^\\d{4}-\\d{2}-\\d{2}$/.test(s), { message: "date must be YYYY-MM-DD" });

export const HazardSchema = z.object({
  id: HazardId,
  subtask: z.string().min(1),
  hazard: z.string().min(1),
  initialRisk: RiskSchema,
  control: z.string().min(1),
  implementation: z.string().min(1),
  residualRisk: RiskSchema,
  who: z.string().min(1).optional(),
  when: DateYMD.optional(),
});

export const HazardsSchema = z.object({
  sections: z.array(HazardSchema),
});

export type HazardSection = z.infer<typeof HazardSchema>;

export type Hazards = z.infer<typeof HazardsSchema>;
