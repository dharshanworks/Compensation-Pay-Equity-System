CREATE DATABASE compensation_system;

USE compensation_system;

CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(30) DEFAULT 'Admin'
);

CREATE TABLE departments (
    department_id INT PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(100) NOT NULL
);

CREATE TABLE employees (
    employee_id INT PRIMARY KEY AUTO_INCREMENT,
    employee_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    department_id INT,
    designation VARCHAR(100),
    location VARCHAR(100),
    gender VARCHAR(20),
    experience INT,
    current_salary DECIMAL(10,2),
    performance_rating INT,
    manager_name VARCHAR(100),
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

CREATE TABLE salary_bands (
    band_id INT PRIMARY KEY AUTO_INCREMENT,
    designation VARCHAR(100),
    department_id INT,
    min_salary DECIMAL(10,2),
    max_salary DECIMAL(10,2),
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

CREATE TABLE compensation_rules (
    rule_id INT PRIMARY KEY AUTO_INCREMENT,
    performance_rating INT,
    hike_percentage DECIMAL(5,2)
);

CREATE TABLE compensation_results (
    result_id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT,
    old_salary DECIMAL(10,2),
    hike_percentage DECIMAL(5,2),
    hike_amount DECIMAL(10,2),
    new_salary DECIMAL(10,2),
    calculated_date DATE,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);