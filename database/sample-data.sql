USE compensation_system;

INSERT INTO users (username, password, role)
VALUES ('admin', 'admin123', 'Admin');

INSERT INTO departments (department_name)
VALUES 
('Engineering'),
('HR'),
('Sales'),
('Finance');

INSERT INTO employees 
(employee_name, email, department_id, designation, location, gender, experience, current_salary, performance_rating, manager_name)
VALUES
('Dharshan R', 'dharshan@example.com', 1, 'Software Engineer', 'Hyderabad', 'Male', 1, 400000, 4, 'Ravi Kumar'),
('Priya S', 'priya@example.com', 1, 'Software Engineer', 'Hyderabad', 'Female', 2, 380000, 5, 'Ravi Kumar'),
('Arjun M', 'arjun@example.com', 2, 'HR Executive', 'Chennai', 'Male', 3, 350000, 3, 'Meena'),
('Sneha P', 'sneha@example.com', 3, 'Sales Associate', 'Bangalore', 'Female', 2, 300000, 4, 'Karthik');

INSERT INTO salary_bands 
(designation, department_id, min_salary, max_salary)
VALUES
('Software Engineer', 1, 400000, 800000),
('HR Executive', 2, 300000, 600000),
('Sales Associate', 3, 250000, 500000);

INSERT INTO compensation_rules 
(performance_rating, hike_percentage)
VALUES
(5, 20),
(4, 15),
(3, 10),
(2, 5),
(1, 0);