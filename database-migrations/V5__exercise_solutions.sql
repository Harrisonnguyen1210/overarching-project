ALTER TABLE exercises ADD COLUMN solution_code TEXT;
UPDATE exercises SET solution_code = '';
ALTER TABLE exercises ALTER COLUMN solution_code SET NOT NULL;