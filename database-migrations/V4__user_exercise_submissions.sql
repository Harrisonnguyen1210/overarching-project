ALTER TABLE exercise_submissions ADD COLUMN user_id VARCHAR(255) NOT NULL REFERENCES app_user(id);
