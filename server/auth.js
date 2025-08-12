import { betterAuth } from "better-auth";
import { PostgresJSDialect } from "kysely-postgres-js";
import postgres from "postgres";

const dialect = new PostgresJSDialect({
  postgres: postgres(),
});

export const auth = betterAuth({
  database: {
    dialect: dialect,
    type: "postgresql",
  },
  emailAndPassword: {
    enabled: true,
  },
  user: {
    modelName: "app_user",
  },
});
