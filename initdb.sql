DROP DATABASE IF EXISTS mynode_db;
CREATE DATABASE mynode_db;
USE mynode_db;
CREATE TABLE classes (id INT, classname VARCHAR(255), semester ENUM('Spring', 'Fall'), schoolyear YEAR, startTime TIME, credithours INT, PRIMARY KEY (id));
INSERT INTO classes VALUES (5452, 'Cloud Computing', 'Fall', 2022, '17:00', 3);
INSERT INTO classes VALUES (6454, 'Parallel & Scientific Computing', 'Fall', 2022, '15:30', 3);
INSERT INTO classes VALUES (6645, 'Planning Algorithms in AI', 'Fall', 2022, '9:30', 3);