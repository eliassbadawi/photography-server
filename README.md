markdown
# 📸 Photography Booking Backend (Express + PostgreSQL)

This is the **backend** for the photography booking app. It provides APIs for authentication, session management, and bookings.

## 🏗️ Tech Stack

- Node.js + Express
- PostgreSQL (via `pg`)
- `dotenv`, `cors`, `morgan` for server utilities

## 🚀 Getting Started

```bash
# 1. Navigate to backend folder
cd photography-server

# 2. Install dependencies
npm install

# 3. Create a PostgreSQL database (e.g., photographydb)
# You can run psql and create manually:
# CREATE DATABASE photographydb;

# 4. Run schema.sql
psql -d photographydb -f schema.sql

# 5. Start the server
node server.js
````

## 🗂️ Project Structure

```
photography-server/
├── routes/
│   ├── auth.js         # Signup & login
│   ├── sessions.js     # Admin CRUD for sessions
│   ├── bookings.js     # Booking endpoints
│   └── users.js        # User-related endpoints
├── middleware/
│   └── adminAuth.js    # Admin authorization middleware
├── db.js               # PostgreSQL connection
└── server.js           # App entry point
```

## 📡 API Endpoints

### 🔐 Auth Routes

| Method | Endpoint  | Description          |
| ------ | --------- | -------------------- |
| POST   | `/signup` | Register new user    |
| POST   | `/login`  | Log in existing user |

**Example Signup Request:**

```json
{
  "email": "admin@example.com",
  "password": "123456",
  "role": "admin"
}
```

---

### 📦 Session Routes

| Method | Endpoint | Description                       |
| ------ | -------- | --------------------------------- |
| GET    | `/`      | Get all sessions                  |
| POST   | `/`      | Add new session (Admin only)      |
| PUT    | `/:id`   | Update session by ID (Admin only) |
| DELETE | `/:id`   | Delete session by ID (Admin only) |

Admin requests must include header:

```json
{"x-role": "admin"}
```

---

### 🛒 Booking Routes

| Method | Endpoint       | Description                        |
| ------ | -------------- | ---------------------------------- |
| POST   | `/`            | Create new booking                 |
| GET    | `/user/:email` | Get bookings for a specific user   |
| GET    | `/all`         | Get all bookings (Admin only)      |
| PUT    | `/:id/status`  | Update booking status (Admin only) |

---

## 🗄️ PostgreSQL Schema (`schema.sql`)

```sql
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
    price NUMERIC(10,2) NOT NULL,
    description TEXT,
    duration VARCHAR(50),
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
```

**Run schema:**

```bash
psql -d photographydb -f schema.sql
```

