export const ENV = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL as string,
  COOKIE_NAME: process.env.NEXT_PUBLIC_COOKIE_NAME as string,
  COOKIE_DURATION: Number(process.env.NEXT_PUBLIC_COOKIE_DURATION),
} as const;

// Simple validation
const missingVars: string[] = [];

if (!ENV.API_BASE_URL) missingVars.push("NEXT_PUBLIC_API_BASE_URL");
if (!ENV.COOKIE_NAME) missingVars.push("NEXT_PUBLIC_COOKIE_NAME");
if (isNaN(ENV.COOKIE_DURATION))
  missingVars.push("NEXT_PUBLIC_COOKIE_DURATION (must be a number)");

if (missingVars.length > 0) {
  throw new Error(
    `Missing or invalid environment variables: ${missingVars.join(", ")}`
  );
}
