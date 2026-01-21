-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL CHECK (role IN ('user','admin'))
);

-- Sessions table
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    duration VARCHAR(50),
    icon VARCHAR(100),
    image_url TEXT
);

-- Bookings table
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) REFERENCES users(email),
    session_id INT REFERENCES sessions(id),
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending'
);
