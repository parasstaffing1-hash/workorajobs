import { z } from "zod";

/**
 * Enterprise Password Complexity Rule:
 * - At least 8 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 number
 * - At least 1 special character
 */
export const PasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long.")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
  .regex(/[0-9]/, "Password must contain at least one number.")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character.");

export const SignupSchema = z
  .object({
    name: z.string().min(2, "Full name must be at least 2 characters long.").max(100),
    email: z.string().email("Please enter a valid work or personal email address.").toLowerCase().trim(),
    password: PasswordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password."),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the Terms of Service and Privacy Policy.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type SignupInput = z.infer<typeof SignupSchema>;

export const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address.").toLowerCase().trim(),
  password: z.string().min(1, "Password is required."),
  rememberMe: z.boolean().optional().default(false),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address.").toLowerCase().trim(),
});

export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;

export const ResetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required."),
    newPassword: PasswordSchema,
    confirmPassword: z.string().min(1, "Please confirm your new password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;

export const VerifyEmailSchema = z.object({
  token: z.string().min(1, "Verification token is required."),
});

export type VerifyEmailInput = z.infer<typeof VerifyEmailSchema>;

export const ResendVerificationSchema = z.object({
  email: z.string().email("Please enter a valid email address.").toLowerCase().trim(),
});

export const TwoFactorVerifySchema = z.object({
  code: z.string().length(6, "2FA code must be exactly 6 digits.").regex(/^\d+$/, "2FA code must contain only numbers."),
});
