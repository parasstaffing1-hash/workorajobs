/**
 * Cloudflare Turnstile CAPTCHA Verification Service for WorkoraJobs
 */

export interface TurnstileVerifyResult {
  success: boolean;
  errorCodes?: string[];
  error?: string;
  challengeTs?: string;
  hostname?: string;
}

/**
 * Verifies a Cloudflare Turnstile response token with Cloudflare Siteverify API.
 */
export async function verifyTurnstileToken(
  token: string,
  remoteIp?: string
): Promise<TurnstileVerifyResult> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  const isDev = process.env.NODE_ENV !== "production";

  // Development fallback mode if no secret key configured
  if (!secretKey) {
    if (isDev) {
      console.warn(
        "[Turnstile Warning] TURNSTILE_SECRET_KEY is missing. Skipping CAPTCHA verification in development."
      );
      return { success: true };
    }
    return {
      success: false,
      error: "CAPTCHA verification failed. Missing server secret configuration.",
    };
  }

  if (!token) {
    if (isDev) {
      console.warn("[Turnstile Warning] Missing turnstile token in dev mode. Passing.");
      return { success: true };
    }
    return {
      success: false,
      error: "CAPTCHA token required. Please complete the security check.",
    };
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);
    if (remoteIp) {
      formData.append("remoteip", remoteIp);
    }

    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const data = (await res.json()) as {
      success: boolean;
      "error-codes"?: string[];
      challenge_ts?: string;
      hostname?: string;
    };

    if (data.success) {
      return {
        success: true,
        challengeTs: data.challenge_ts,
        hostname: data.hostname,
      };
    }

    console.warn("[Turnstile Verification Failed]:", data["error-codes"]);
    return {
      success: false,
      errorCodes: data["error-codes"],
      error: "CAPTCHA verification failed. Please try again.",
    };
  } catch (err: unknown) {
    const error = err as Error;
    console.error("[Turnstile System Error]:", error.message);
    return {
      success: false,
      error: "System error verifying security challenge.",
    };
  }
}
