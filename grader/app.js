import { Hono } from "@hono/hono";
import { cors } from "@hono/hono/cors";
import { logger } from "@hono/hono/logger";
import postgres from "postgres";
import { Redis } from "ioredis";

const app = new Hono();
const sql = postgres();
const QUEUE_NAME = "submissions";
let consume_enabled = false;
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
  "/api/status",
  async (c) => {
    const queueSize = await redis.llen(QUEUE_NAME);
    return c.json({
      queue_size: queueSize,
      consume_enabled: consume_enabled,
    });
  },
);

app.post("/api/consume/enable", (c) => {
  if (!consume_enabled) {
    consume_enabled = true;
    startGradingLoop();
  }
  return c.json({ consume_enabled: true });
});

app.post("/api/consume/disable", (c) => {
  consume_enabled = false;
  return c.json({ consume_enabled: false });
});

const startGradingLoop = async () => {
  while (consume_enabled) {

    const queueLength = await redis.llen(QUEUE_NAME);
    console.log(queueLength);

    if (queueLength === 0) {
      await sleep(250);
      continue;
    }

    const submissionId = await redis.rpop(QUEUE_NAME);
    if (!submissionId) continue;

    await gradeSubmission(Number(submissionId));
  }
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const gradeSubmission = async (submissionId) => {
  console.log("gradeSubmission");
  await sql`
      UPDATE exercise_submissions
      SET grading_status = 'processing'
      WHERE id = ${submissionId}
    `;

  const delay = Math.floor(Math.random() * 2000) + 1000;
  await sleep(delay);

  const grade = Math.floor(Math.random() * 101);

  await sql`
      UPDATE exercise_submissions
      SET grading_status = 'graded', grade = ${grade}
      WHERE id = ${submissionId}
    `;
};

export default app;
