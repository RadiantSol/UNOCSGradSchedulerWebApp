CREATE DATABASE IF NOT EXISTS mydb;
DROP TABLE IF EXISTS classes, users;
CREATE TABLE classes (id INT, classname VARCHAR(255), semester ENUM('Spring', 'Fall'), schoolyear YEAR, startTime TIME, credithours INT, PRIMARY KEY (id));
INSERT INTO classes VALUES (5452, 'Cloud Computing', 'Fall', 2022, '5:30', 3);