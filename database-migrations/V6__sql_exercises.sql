INSERT INTO languages (name) VALUES ('SQL');
INSERT INTO exercises (title, description, solution_code, language_id)
VALUES (
    'SELECT * FROM',
    'Write an SQL statement that lists all the rows and columns from a table called "students".',
    'SELECT * FROM students;',
    (SELECT id FROM languages WHERE name = 'SQL')
), (
    'SELECT name FROM',
    'Write an SQL statement that lists all the rows for the column "name" from a table called "students".',
    'SELECT name FROM students;',
    (SELECT id FROM languages WHERE name = 'SQL')
), (
    'Average year of birth',
    'Write an SQL statement that returns the average year of birth of all the students in the database. The year of birth of students is stored in the column "year_of_birth".',
    'SELECT AVG(year_of_birth) FROM students;',
    (SELECT id FROM languages WHERE name = 'SQL')
);