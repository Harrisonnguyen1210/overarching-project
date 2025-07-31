import { Hono } from "@hono/hono";
import { cors } from "@hono/hono/cors";
import { logger } from "@hono/hono/logger";
import postgres from "postgres";
import { cache } from "@hono/hono/cache";
import { Redis } from "ioredis";

const app = new Hono();
const sql = postgres();
const QUEUE_NAME = "submissions";

let redis;
if (Deno.env.get("REDIS_HOST")) {
  redis = new Redis(
    Number.parseInt(Deno.env.get("REDIS_PORT")),
    Deno.env.get("REDIS_HOST"),
  );
} else {
  redis = new Redis(6379, "redis");
}

app.use("/*", cors());
app.use("/*", logger());

app.get(
  "/api/languages",
  cache({
    cacheName: "languages",
    wait: true,
  }),
  async (c) => {
    const languages = await sql`SELECT * FROM languages`;
    return c.json(languages);
  },
);

app.get(
  "/api/languages/:id/exercises",
  cache({
    cacheName: "exercises",
    wait: true,
  }),
  async (c) => {
    const languages_id = c.req.param("id");

    const exercises = await sql`SELECT  id, title, description
      FROM exercises WHERE language_id = ${languages_id}`;
    return c.json(exercises);
  },
);

app.post(
  "/api/languages/:id/exercises",
  async (c) => {
    await caches.delete("exercises");
    return c.json({ message: "Cache cleared!" });
  },
);

app.post("/api/exercises/:id/submissions", async (c) => {
  const exerciseId = c.req.param("id");
  const body = await c.req.json();

  // Validate input
  if (!body.source_code) {
    return c.json({ error: "source_code is required" }, 400);
  }

  // Insert into database
  const [submission] = await sql`
      INSERT INTO exercise_submissions (exercise_id, source_code)
      VALUES (${exerciseId}, ${body.source_code})
      RETURNING id, exercise_id, grading_status, grade, created_at
    `;
  await redis.lpush(QUEUE_NAME, submission.id);

  return c.json(submission);
});

export default app;
