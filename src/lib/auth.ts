import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.BETTER_AUTH_DB_CONNECTION_URL as string);
const db = client.db("bazar-dor");

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
        clientId: process.env.BETTER_AUTH_URL_GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.BETTER_AUTH_URL_GOOGLE_CLIENT_SECRET as string
    },
    github: {
        clientId: process.env.BETTER_AUTH_URL_GITHUB_CLIENT_ID as string,
        clientSecret: process.env.BETTER_AUTH_URL_GITHUB_CLIENT_SECRET as string
    }

  },
  database: mongodbAdapter(db, {
    client,
  }),
});
