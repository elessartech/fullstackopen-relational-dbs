DROP TABLE IF EXISTS blogs;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    username TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author TEXT,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    likes INT DEFAULT 0,
    user_id INT REFERENCES users
);

INSERT INTO blogs (author, url, title) VALUES 
    ('Aman Mittal', 'https://blog.logrocket.com/how-to-set-up-node-typescript-express/', 'How to set up TypeScript with Node.js and Express'),
    ('Jimmy Soh', 'https://medium.com/the-internal-startup/how-to-set-up-your-own-paas-within-hours-83356523413d', 'How to Set Up Your Own PaaS Within Hours');
