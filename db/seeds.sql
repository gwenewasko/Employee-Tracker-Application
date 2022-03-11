use company_db;

INSERT INTO employee_role (id, title, salary, department_id)
VALUES (2, "Sales"),
(3, "Account Management"),
(4, "Event Planning"),
(5, "Administration")

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (2, "Mike", "Smith", 2, 2),
(3, "Sarah", "King", 3, 3),
(4, "Dave", "Brown", 4, 4),
(5, "Kelsey", "Burke", 5, 5)
