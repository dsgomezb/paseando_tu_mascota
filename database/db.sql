CREATE DATABASE establecimiento_online;

USE establecimiento_online;

-- USER TABLE
CREATE TABLE users(
    id INT(30) NOT NULL,
    username VARCHAR(30) NOT NULL,
    password VARCHAR(60) NOT NULL,
    fullname VARCHAR(100) NOT NULL
);

ALTER TABLE users 
ADD PRIMARY KEY (id);

ALTER TABLE users
MODIFY id INT(30) NOT NULL AUTO_INCREMENT;

DESCRIBE users;

-- LINK TABLES
CREATE TABLE links(
    id INT(11) NOT NULL,
    title VARCHAR(300) NOT NULL,
    url VARCHAR(255) NOT NULL,
    description TEXT,
    user_id INT(30),
    created_at timestamp NOT NULL DEFAULT current_timestamp,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

ALTER TABLE links 
    ADD PRIMARY KEY (id);

ALTER TABLE links 
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT;

DESCRIBE links;