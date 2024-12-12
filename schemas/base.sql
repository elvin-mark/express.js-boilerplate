CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE user_roles (
  user_id INTEGER NOT NULL,
  role_id INTEGER NOT NULL,
  CONSTRAINT user_roles_user_id FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT user_roles_role_id FOREIGN KEY (role_id) REFERENCES roles(id)
);
CREATE UNIQUE INDEX unique_user_role ON user_roles(user_id, role_id);