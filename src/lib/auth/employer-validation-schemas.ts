import { z } from "zod";

export const EmployerSignupSchema = z.object({
  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name cannot exceed 100 characters"),
  businessEmail: z
    .string()
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .min(8, "Phone number must be at least 8 digits")
    .max(20, "Phone number cannot exceed 20 characters")
    .optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
  acceptTerms: z.boolean().optional(),
});

export const EmployerLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional().default(false),
});

export const PhoneOtpVerifySchema = z.object({
  otpCode: z
    .string()
    .length(6, "OTP code must be exactly 6 digits")
    .regex(/^[0-9]+$/, "OTP code must contain only numbers"),
});

export type EmployerSignupInput = z.infer<typeof EmployerSignupSchema>;
export type EmployerLoginInput = z.infer<typeof EmployerLoginSchema>;
export type PhoneOtpVerifyInput = z.infer<typeof PhoneOtpVerifySchema>;
