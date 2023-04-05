CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author TEXT,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    likes INT DEFAULT 0
);

INSERT INTO blogs (author, url, title) values ('Aman Mittal', 'https://blog.logrocket.com/how-to-set-up-node-typescript-express/', 'How to set up TypeScript with Node.js and Express');
INSERT INTO blogs (author, url, title) values ('Jimmy Soh', 'https://medium.com/the-internal-startup/how-to-set-up-your-own-paas-within-hours-83356523413d', 'How to Set Up Your Own PaaS Within Hours');
