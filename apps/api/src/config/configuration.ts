function list(value: string | undefined, fallback: string[]) {
  if (!value) return fallback;
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function configuration() {
  return {
    app: {
      nodeEnv: process.env.NODE_ENV ?? "development",
      port: Number(process.env.PORT ?? process.env.API_PORT ?? 4000),
      apiPrefix: process.env.API_PREFIX ?? "api/v1",
      appUrl: process.env.APP_URL ?? "http://localhost:3000",
      apiUrl: process.env.API_URL ?? "http://localhost:4000",
    },
    database: {
      url: process.env.DATABASE_URL,
    },
    redis: {
      url: process.env.REDIS_URL ?? "redis://localhost:6379",
    },
    auth: {
      accessSecret: process.env.JWT_ACCESS_SECRET,
      refreshSecret: process.env.JWT_REFRESH_SECRET,
      accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "30d",
      passwordMinLength: Number(process.env.PASSWORD_MIN_LENGTH ?? 12),
    },
    security: {
      cookieSecret: process.env.COOKIE_SECRET,
      csrfEnabled: (process.env.CSRF_ENABLED ?? "true") === "true",
      corsOrigins: list(process.env.CORS_ORIGINS, [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
      ]),
    },
    oauth: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackUrl:
          process.env.GOOGLE_CALLBACK_URL ??
          "http://localhost:4000/api/v1/auth/google/callback",
      },
      linkedin: {
        clientId: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        callbackUrl:
          process.env.LINKEDIN_CALLBACK_URL ??
          "http://localhost:4000/api/v1/auth/linkedin/callback",
      },
    },
    storage: {
      awsRegion: process.env.AWS_REGION,
      awsBucket: process.env.AWS_S3_BUCKET,
      awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
      awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      publicBaseUrl: process.env.AWS_S3_PUBLIC_BASE_URL,
    },
    email: {
      provider: process.env.EMAIL_PROVIDER ?? "log",
      from: process.env.EMAIL_FROM ?? "Workora Jobs <no-reply@workorajobs.com>",
    },
    ai: {
      openaiApiKey: process.env.OPENAI_API_KEY,
      openaiModel: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      openaiBaseUrl: process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1",
    },
    automation: {
      n8nBaseUrl: process.env.N8N_BASE_URL,
      n8nWebhookSecret: process.env.N8N_WEBHOOK_SECRET,
    },
    billing: {
      stripeSecretKey: process.env.STRIPE_SECRET_KEY,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
      successUrl:
        process.env.STRIPE_SUCCESS_URL ??
        `${process.env.APP_URL ?? "http://localhost:3000"}/billing?checkout=success`,
      cancelUrl:
        process.env.STRIPE_CANCEL_URL ??
        `${process.env.APP_URL ?? "http://localhost:3000"}/billing?checkout=cancel`,
    },
    communication: {
      smsProvider: process.env.SMS_PROVIDER ?? "disabled",
      smsApiKey: process.env.SMS_API_KEY,
      whatsappProvider: process.env.WHATSAPP_PROVIDER ?? "disabled",
      whatsappApiKey: process.env.WHATSAPP_API_KEY,
      pushProvider: process.env.PUSH_PROVIDER ?? "disabled",
      pushApiKey: process.env.PUSH_API_KEY,
    },
    performance: {
      cacheTtlSeconds: Number(process.env.CACHE_TTL_SECONDS ?? 60),
    },
    monitoring: {
      sentryDsn: process.env.SENTRY_DSN,
      logLevel: process.env.LOG_LEVEL ?? "info",
    },
  };
}
