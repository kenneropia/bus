import { z } from "zod";

const baseUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});

export const roleEnum = z.enum(["student", "driver", "admin"]);

const studentSchema = z.object({
  role: z.literal(roleEnum.Values.student),
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
  studentId: z.string(),
});

const driverSchema = z.object({
  role: z.literal(roleEnum.Values.driver),
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
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
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});

export const userSchema = z.discriminatedUnion("role", [
  studentSchema,
  driverSchema,
  adminSchema,
]);

const loginSchema = z.object({
  email: z.string().email(),

  password: z.string().min(8),
});

const signinSchema = userSchema;

export { loginSchema };
