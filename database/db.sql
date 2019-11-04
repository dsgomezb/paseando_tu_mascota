CREATE DATABASE establecimiento_online;

USE establecimiento_online;

-- USER TABLE
CREATE TABLE users(
    id INT(30) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(80) NOT NULL,
    names VARCHAR(250) NOT NULL,
    document VARCHAR(30) NOT NULL,
    email VARCHAR(250) NOT NULL,
    phone VARCHAR(250) NOT NULL,
    created_at timestamp,
    updated_at timestamp
);


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