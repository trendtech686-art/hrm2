// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Filter errors
  beforeSend(event, hint) {
    // Don't send errors in development
    if (process.env.NODE_ENV === "development") {
      console.log("[Sentry Server] Error captured (dev mode, not sent):", hint.originalException);
      return null;
    }
    return event;
  },

  // Ignore specific errors
  ignoreErrors: [
    // Prisma common errors (handle gracefully)
    "PrismaClientKnownRequestError",
    // Auth errors
    "CredentialsSignin",
    // Network timeout
    "ETIMEDOUT",
    "ECONNREFUSED",
  ],
});
