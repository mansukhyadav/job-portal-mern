// Sentry MUST be imported and initialized before any other module.
// server.js does `import "./instrument.js"` as its very first line.
import * as Sentry from "@sentry/node";
import dotenv from "dotenv";

dotenv.config();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || "development",
  tracesSampleRate: 1.0, // capture 100% of transactions in dev; lower this in prod
  // Automatically instruments Express, Mongo, HTTP, etc.
  integrations: [
    Sentry.mongooseIntegration(),
    Sentry.expressIntegration(),
  ],
});

export default Sentry;
