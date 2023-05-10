import { z } from "zod";

const baseUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

const roleEnum = z.enum(["student", "driver", "admin"]);

const studentSchema = z.object({
  role: z.literal(roleEnum.Values.student),
  studentId: z.string(),
});

const driverSchema = z.object({
  role: z.literal(roleEnum.Values.driver),
  destination: z.enum([
    "Al-Hikmah - Post Office",
    "Al-Hikmah - Airport Road",
    "Al-Hikmah - Tipper Garage",
    "Al-Hikmah - Olunlade",
    "Al-Hikmah - Sango",
    "Al-Hikmah - GRA",
  ]),
});

const adminSchema = z.object({
  role: z.literal(roleEnum.Values.admin),
});

export const userSchema = z
  .discriminatedUnion("role", [studentSchema, driverSchema, adminSchema])
  .and(baseUserSchema);
