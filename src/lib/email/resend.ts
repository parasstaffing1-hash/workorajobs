/**
 * ============================================================================
 * RESEND EMAIL SERVICE (SERVER-SIDE ONLY)
 * Production-grade integration for Resend email dispatch across signup,
 * email verification, and password reset flows for WorkoraJobs.
 * ============================================================================
 */

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export class ResendEmailService {
  /**
   * Returns configured Resend API Key or validates server-side production config
   */
  private static getApiKey(): string {
    const apiKey = process.env.RESEND_API_KEY?.trim();
    const provider = (process.env.EMAIL_PROVIDER || "").toLowerCase().trim();

    if (!apiKey) {
      if (process.env.NODE_ENV === "production" || provider === "resend") {
        throw new Error(
          "[Resend Configuration Error] RESEND_API_KEY is required in production or when EMAIL_PROVIDER=resend."
        );
      }
    }
    return apiKey || "";
  }

  /**
   * Returns configured EMAIL_FROM sender address
   */
  private static getFromAddress(): string {
    const from = process.env.EMAIL_FROM?.trim();
    const provider = (process.env.EMAIL_PROVIDER || "").toLowerCase().trim();

    if (!from) {
      if (process.env.NODE_ENV === "production" || provider === "resend") {
        throw new Error(
          "[Resend Configuration Error] EMAIL_FROM is required in production or when EMAIL_PROVIDER=resend."
        );
      }
      return "Workora Jobs <no-reply@workorajobs.com>";
    }
    return from;
  }

  /**
   * Resolves application base URL for building secure verification links
   */
  private static getAppUrl(): string {
    const rawUrl =
      process.env.APP_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://workorajobs.com";
    return rawUrl.replace(/\/$/, "");
  }

  /**
   * Core email sending method via Resend API
   */
  static async sendEmail(options: SendEmailOptions): Promise<{ success: boolean; id?: string }> {
    const apiKey = this.getApiKey();
    const from = this.getFromAddress();
    const provider = (process.env.EMAIL_PROVIDER || "").toLowerCase().trim();

    // Dev/Test Fallback when RESEND_API_KEY is omitted outside production
    if (!apiKey && process.env.NODE_ENV !== "production" && provider !== "resend") {
      console.log(`[Dev Log Sender] To: ${options.to} | Subject: ${options.subject}`);
      return { success: true, id: "dev-noop-id" };
    }

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [options.to],
          subject: options.subject,
          html: options.html,
          text: options.text,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as any;

      if (!response.ok) {
        const errorMsg = data?.message || data?.error?.message || `Resend HTTP ${response.status}`;
        console.error(`[Resend Error] ${errorMsg}`);
        throw new Error(`Email delivery failed: ${errorMsg}`);
      }

      return { success: true, id: data.id };
    } catch (err: any) {
      console.error("[Resend Delivery Error]", err.message || err);
      throw new Error(err.message || "Failed to deliver email through Resend.");
    }
  }

  /**
   * Dispatches Email Verification Email via Resend
   */
  static async sendVerificationEmail(to: string, token: string): Promise<boolean> {
    const appUrl = this.getAppUrl();
    const verificationUrl = `${appUrl}/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(to)}`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Verify your Workora Jobs email</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 24px; }
    .card { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .logo { font-size: 20px; font-weight: 800; color: #2563eb; text-decoration: none; margin-bottom: 24px; display: inline-block; }
    h1 { font-size: 22px; font-weight: 800; margin-top: 0; color: #0f172a; }
    p { font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 24px; }
    .btn { display: inline-block; background-color: #2563eb; color: #ffffff !important; font-weight: 700; font-size: 14px; padding: 12px 24px; border-radius: 12px; text-decoration: none; }
    .footer { font-size: 12px; color: #94a3b8; margin-top: 32px; border-top: 1px solid #f1f5f9; padding-top: 16px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">Workora Jobs</div>
    <h1>Verify your email address</h1>
    <p>Welcome to Workora Jobs! Please verify your email address to complete your registration and activate your account.</p>
    <p><a href="${verificationUrl}" class="btn">Verify Email Address</a></p>
    <p>Or copy and paste this URL into your browser:<br><span style="color: #2563eb; word-break: break-all;">${verificationUrl}</span></p>
    <div class="footer">If you did not register for Workora Jobs, please ignore this email.</div>
  </div>
</body>
</html>
`;

    const text = `Verify your Workora Jobs email address using the following link:\n\n${verificationUrl}\n\nIf you did not register, please ignore this email.`;

    const res = await this.sendEmail({
      to,
      subject: "Verify your email address - Workora Jobs",
      html,
      text,
    });

    return res.success;
  }

  /**
   * Dispatches Password Reset Email via Resend
   */
  static async sendPasswordResetEmail(to: string, token: string): Promise<boolean> {
    const appUrl = this.getAppUrl();
    const resetUrl = `${appUrl}/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(to)}`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Reset your Workora Jobs password</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 24px; }
    .card { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .logo { font-size: 20px; font-weight: 800; color: #2563eb; text-decoration: none; margin-bottom: 24px; display: inline-block; }
    h1 { font-size: 22px; font-weight: 800; margin-top: 0; color: #0f172a; }
    p { font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 24px; }
    .btn { display: inline-block; background-color: #2563eb; color: #ffffff !important; font-weight: 700; font-size: 14px; padding: 12px 24px; border-radius: 12px; text-decoration: none; }
    .footer { font-size: 12px; color: #94a3b8; margin-top: 32px; border-top: 1px solid #f1f5f9; padding-top: 16px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">Workora Jobs</div>
    <h1>Reset your password</h1>
    <p>We received a request to reset your password for your Workora Jobs account. Click the button below to set a new password.</p>
    <p><a href="${resetUrl}" class="btn">Reset Password</a></p>
    <p>Or copy and paste this URL into your browser:<br><span style="color: #2563eb; word-break: break-all;">${resetUrl}</span></p>
    <div class="footer">This password reset link expires in 60 minutes. If you did not request a password reset, please ignore this email.</div>
  </div>
</body>
</html>
`;

    const text = `Reset your Workora Jobs password using the following link:\n\n${resetUrl}\n\nThis link expires in 60 minutes. If you did not request a password reset, please ignore this email.`;

    const res = await this.sendEmail({
      to,
      subject: "Reset your password - Workora Jobs",
      html,
      text,
    });

    return res.success;
  }
}
