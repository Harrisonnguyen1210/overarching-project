CREATE TABLE languages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE exercises (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  language_id INT NOT NULL REFERENCES languages(id)
);

INSERT INTO languages (name) VALUES ('Dart'), ('Rust');

INSERT INTO exercises (title, description, language_id)
VALUES (
  'Hello, World!',
  'Print "Hello, World!" to the console.',
  (SELECT id FROM languages WHERE name = 'Dart')
), (
  'Hello, World!',
  'Print "Hello, World!" to the console.',
  (SELECT id FROM languages WHERE name = 'Rust')
);