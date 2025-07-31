CREATE TABLE exercise_submissions (
  id SERIAL PRIMARY KEY,
  exercise_id INT NOT NULL REFERENCES exercises(id),
  source_code TEXT NOT NULL,
  grading_status VARCHAR(50) NOT NULL DEFAULT 'pending'
    CHECK (grading_status IN ('pending', 'processing', 'graded')),
  grade SMALLINT CHECK (grade BETWEEN 0 AND 100),
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);