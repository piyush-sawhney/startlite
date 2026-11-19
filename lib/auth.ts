import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { account, session, user, verification } from "@/db/schema";
import { serverEnv, trustedOrigins } from "@/lib/env";

const baseURL = serverEnv.betterAuthUrl;

export const auth = betterAuth({
  secret: serverEnv.betterAuthSecret,
  baseURL,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification },
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "owner",
        input: false,
      },
      locale: {
        type: "string",
        required: false,
        defaultValue: "en",
      },
    },
  },
  trustedOrigins: trustedOrigins(baseURL),
});
