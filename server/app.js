import { Hono } from "@hono/hono";
import { cors } from "@hono/hono/cors";
import { logger } from "@hono/hono/logger";
import postgres from "postgres";
import { cache } from "@hono/hono/cache";
import { Redis } from "ioredis";
import { auth } from "./auth.js";

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

const requireAuth = (c, next) => {
  const user = c.get("user");
  if (!user) {
    c.status(401);
    return c.json({ message: "Unauthorized" });
  }
  return next();
};

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));
app.use("/*", cors());
app.use("/*", logger());
app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (session) c.set("user", session.user);
  return next();
});
app.use("/api/exercises/:id/submissions", requireAuth);
app.use("/api/submissions/:id/status", requireAuth);

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

  const user = c.get("user");
  // Insert into database
  const [submission] = await sql`
  INSERT INTO exercise_submissions (exercise_id, source_code, user_id)
  VALUES (${exerciseId}, ${body.source_code}, ${user.id})
  RETURNING id, exercise_id, user_id, grading_status, grade, created_at
`;

  await redis.lpush(QUEUE_NAME, submission.id);

  return c.json(submission);
});

app.get("/api/exercises/:id", async (c) => {
  const exerciseId = c.req.param("id");

  // Query the exercise by ID
  const [exercise] = await sql`
    SELECT id, title, description
    FROM exercises
    WHERE id = ${exerciseId}
  `;

  if (!exercise) {
    return c.body(null, 404); // 404 if not found
  }

  return c.json(exercise);
});

app.get("/api/submissions/:id/status", async (c) => {
  const submissionId = c.req.param("id");
  const user = c.get("user");

  // Query the submission status
  const [submission] = await sql`
  SELECT grading_status, grade
  FROM exercise_submissions
  WHERE id = ${submissionId} AND user_id = ${user.id}
`;

  if (!submission) {
    return c.body(null, 404); // 404 if not found
  }

  return c.json(submission);
});

export default app;
