USE sample_db
INSERT INTO departments (name)
VALUES ("engineering");

INSERT INTO roles (title, salary, department_id)
VALUES  ("programmer", 40.00, 1),
        ("engineer", 40.00, 1);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Nhat", "Nguyen", 1, 1);