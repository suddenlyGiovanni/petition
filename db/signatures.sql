DROP TABLE IF EXIST signatures;
CREATE TABLE signatures(
    id SERIAL PRIMARY KEY,
    first VARCHAR(200) NOT NULL,
    last VARCHAR(200) NOT NULL,
    signature TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT
)
