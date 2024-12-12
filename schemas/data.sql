INSERT INTO items (name) VALUES ('Item 1'), ('Item 2'), ('Item 3');

INSERT INTO users (id, username, password_hash) VALUES (1,'user', '$2a$12$6RMV8MOOhxeATIdX73Y9/uA/WuBFu8f/r2Ft9B2vKmyoen1K6zbju');

INSERT INTO users (id, username, password_hash) VALUES (2,'admin', '$2a$12$6RMV8MOOhxeATIdX73Y9/uA/WuBFu8f/r2Ft9B2vKmyoen1K6zbju');


INSERT INTO roles VALUES (1,'USER'),(2,'ADMIN');

INSERT INTO user_roles VALUES (1, 1);
INSERT INTO user_roles VALUES (2, 2);