import { GoogleAnalytics as NextGoogleAnalytics } from "@next/third-parties/google";

export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-6V7KTR46RM";

  // Only load Google Analytics 4 in production environment
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  return <NextGoogleAnalytics gaId={gaId} />;
}
