# CompensationPro - Compensation Planning & Pay Equity Reporting System

CompensationPro is an HR SaaS-inspired web application built to manage employee compensation data, configure performance-based salary hike rules, calculate merit increases, analyze pay equity, and generate SQL-based reports.

This project demonstrates full-stack development, SQL reporting, database testing concepts, manual testing preparation, API testing, and automation testing readiness.

---

## Project Objective

The objective of this project is to build a business-focused HR platform where an admin can:

* Manage employee salary and performance data
* Configure compensation rules based on performance ratings
* Calculate salary hike and new salary
* Analyze pay equity using reports
* Identify employees below salary bands
* Generate SQL-based business reports

---

## Key Features

### 1. Home Page

* Professional HR SaaS landing page
* Overview of compensation planning system
* Feature sections
* Workflow explanation
* Login redirection

### 2. Admin Authentication

* Admin login
* Logout functionality
* Local storage-based session handling

### 3. Employee Management

* Add employee details
* View employee list
* Delete employee records
* Store employee data in MySQL database

Employee details include:

* Employee name
* Email
* Department
* Designation
* Location
* Gender
* Experience
* Current salary
* Performance rating
* Manager name

### 4. Compensation Rules

* View configured hike rules
* Add new compensation rule
* Edit existing rule
* Delete compensation rule
* Rules are stored in MySQL database

Example rules:

| Performance Rating | Rating Label      | Hike Percentage |
| ------------------ | ----------------- | --------------- |
| 5                  | Excellent         | 20%             |
| 4                  | Very Good         | 15%             |
| 3                  | Good              | 10%             |
| 2                  | Average           | 5%              |
| 1                  | Needs Improvement | 0%              |

### 5. Salary Calculator

* Select employee
* Fetch employee salary and performance rating
* Apply compensation rule
* Calculate hike amount
* Calculate new salary
* Save compensation result in database

Formula:

```text
Hike Amount = Current Salary × Hike Percentage / 100

New Salary = Current Salary + Hike Amount
```

### 6. SQL Reporting Dashboard

Reports included:

* Department-wise average salary report
* Gender-wise pay equity report
* Employees below salary band report

### 7. Database Testing Support

The project supports database validation using SQL queries for:

* Employee data verification
* Compensation result verification
* Salary band validation
* Pay equity report verification
* Department-wise salary report verification

---

## Tech Stack

### Frontend

* HTML
* CSS
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* MySQL
* MySQL Workbench

### Testing Tools Planned

* Manual Testing
* Postman API Testing
* Selenium WebDriver
* Java
* TestNG
* Maven

---

## Project Folder Structure

```text
Compensation-Pay-Equity-System
│
├── backend
│   ├── server.js
│   ├── db.js
│   ├── package.json
│   ├── .env.example
│
├── frontend
│   ├── index.html
│   ├── login.html
│   ├── dashboard.html
│   ├── employees.html
│   ├── compensation-rules.html
│   ├── calculator.html
│   ├── reports.html
│   ├── style.css
│   └── script.js
│
├── database
│   ├── schema.sql
│   ├── sample-data.sql
│   └── report-queries.sql
│
├── manual-testing
│   ├── test-plan.md
│   ├── test-scenarios.xlsx
│   ├── test-cases.xlsx
│   ├── bug-report.xlsx
│   └── test-summary-report.md
│
├── automation-testing
│   └── selenium-java-testng
│
├── api-testing
│   └── postman-collection.json
│
├── screenshots
│
├── .gitignore
└── README.md
```

---

## Database Design

### Database Name

```sql
compensation_system
```

### Tables Used

```text
users
departments
employees
salary_bands
compensation_rules
compensation_results
```

---

## Important SQL Reports

### Department-wise Average Salary

```sql
SELECT 
    d.department_name,
    AVG(e.current_salary) AS average_salary,
    COUNT(e.employee_id) AS total_employees
FROM employees e
JOIN departments d
ON e.department_id = d.department_id
GROUP BY d.department_name;
```

### Gender-wise Pay Equity Report

```sql
SELECT 
    gender,
    AVG(current_salary) AS average_salary,
    COUNT(employee_id) AS total_employees
FROM employees
GROUP BY gender;
```

### Employees Below Salary Band Report

```sql
SELECT 
    e.employee_name,
    e.designation,
    e.current_salary,
    s.min_salary,
    s.max_salary
FROM employees e
JOIN salary_bands s
ON e.designation = s.designation
WHERE e.current_salary < s.min_salary;
```

### Compensation Calculation Validation

```sql
SELECT 
    e.employee_name,
    c.old_salary,
    c.hike_percentage,
    c.hike_amount,
    c.new_salary,
    c.calculated_date
FROM compensation_results c
JOIN employees e
ON c.employee_id = e.employee_id;
```

---

## Backend API Endpoints

### Authentication

| Method | Endpoint     | Description |
| ------ | ------------ | ----------- |
| POST   | `/api/login` | Admin login |

### Employee APIs

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| GET    | `/api/employees`     | Get all employees |
| POST   | `/api/employees`     | Add new employee  |
| DELETE | `/api/employees/:id` | Delete employee   |

### Compensation Rule APIs

| Method | Endpoint         | Description                     |
| ------ | ---------------- | ------------------------------- |
| GET    | `/api/rules`     | Get all compensation rules      |
| POST   | `/api/rules`     | Add or update compensation rule |
| PUT    | `/api/rules/:id` | Update compensation rule        |
| DELETE | `/api/rules/:id` | Delete compensation rule        |

### Salary Calculation API

| Method | Endpoint                      | Description                    |
| ------ | ----------------------------- | ------------------------------ |
| POST   | `/api/calculate-compensation` | Calculate employee salary hike |

### Report APIs

| Method | Endpoint                         | Description                        |
| ------ | -------------------------------- | ---------------------------------- |
| GET    | `/api/reports/department-salary` | Department-wise salary report      |
| GET    | `/api/reports/pay-equity`        | Gender-wise pay equity report      |
| GET    | `/api/reports/below-band`        | Employees below salary band report |

---

## How to Run the Project

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/Compensation-Pay-Equity-System.git
```

### Step 2: Open Project Folder

```bash
cd Compensation-Pay-Equity-System
```

### Step 3: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 4: Configure Environment Variables

Create a `.env` file inside the `backend` folder.

Use `.env.example` as reference:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=compensation_system
PORT=5000
```

### Step 5: Create MySQL Database

Open MySQL Workbench and run the SQL files from the `database` folder:

```text
schema.sql
sample-data.sql
```

### Step 6: Start Backend Server

```bash
npm run dev
```

Expected output:

```text
Server running on port 5000
MySQL connected successfully
```

Backend URL:

```text
http://localhost:5000
```

### Step 7: Open Frontend

Open the frontend home page in browser:

```text
frontend/index.html
```

Recommended method:

Use VS Code Live Server and open:

```text
http://127.0.0.1:5500/frontend/index.html
```

---

## Demo Login

```text
Username: admin
Password: admin123
```

---

## Application Flow

```text
Home Page
↓
Login Page
↓
Dashboard
↓
Employee Management
↓
Compensation Rules
↓
Salary Calculator
↓
Reports Dashboard
```

---

## Screenshots

Add screenshots inside the `screenshots` folder.

Recommended screenshots:

```text
1. Home Page
2. Login Page
3. Dashboard
4. Employee Management
5. Compensation Rules
6. Salary Calculator
7. Department Salary Report
8. Pay Equity Report
9. MySQL Tables
10. Postman API Testing
```

Example:

```markdown
![Dashboard](screenshots/dashboard.png)
```

---

## Testing Scope

### Manual Testing

Manual testing documents planned:

* Test Plan
* Test Scenarios
* Test Cases
* Bug Reports
* Test Summary Report

Main modules tested:

* Login
* Employee Management
* Compensation Rules
* Salary Calculator
* Reports
* Database Validation

### API Testing

API testing can be done using Postman.

Important APIs to test:

```text
POST /api/login
GET /api/employees
POST /api/employees
DELETE /api/employees/:id
GET /api/rules
POST /api/rules
PUT /api/rules/:id
DELETE /api/rules/:id
POST /api/calculate-compensation
GET /api/reports/department-salary
GET /api/reports/pay-equity
GET /api/reports/below-band
```

### Automation Testing

Automation testing can be done using:

* Selenium WebDriver
* Java
* TestNG
* Maven

Automation scenarios:

* Valid login
* Invalid login
* Add employee
* Delete employee
* Add compensation rule
* Edit compensation rule
* Calculate salary hike
* Generate report
* Logout

---

## Sample Test Scenario

| Scenario ID | Module     | Test Scenario                             |
| ----------- | ---------- | ----------------------------------------- |
| TS_001      | Login      | Verify admin login with valid credentials |
| TS_002      | Login      | Verify login with invalid credentials     |
| TS_003      | Employee   | Verify admin can add employee             |
| TS_004      | Employee   | Verify admin can delete employee          |
| TS_005      | Rules      | Verify admin can add compensation rule    |
| TS_006      | Rules      | Verify admin can edit compensation rule   |
| TS_007      | Calculator | Verify salary hike calculation            |
| TS_008      | Reports    | Verify department-wise salary report      |
| TS_009      | Reports    | Verify pay equity report                  |
| TS_010      | Reports    | Verify below salary band report           |

---

## Sample Bug Report

| Field              | Details                                                                   |
| ------------------ | ------------------------------------------------------------------------- |
| Bug ID             | BUG_001                                                                   |
| Module             | Compensation Calculator                                                   |
| Title              | Incorrect salary hike calculation for rating 4                            |
| Severity           | High                                                                      |
| Priority           | High                                                                      |
| Steps to Reproduce | Login → Open Calculator → Select employee with rating 4 → Click Calculate |
| Expected Result    | Salary should be calculated using configured hike percentage              |
| Actual Result      | Incorrect salary displayed                                                |
| Status             | Open                                                                      |

---

## Skills Demonstrated

This project demonstrates:

* Full-stack web development
* HR SaaS domain understanding
* SQL database design
* SQL reporting
* CRUD operations
* Client-specific configuration
* REST API development
* Manual testing knowledge
* Bug reporting knowledge
* API testing readiness
* Automation testing readiness
* Business workflow understanding

---





## Author

**Dharshan R**

GitHub: [dharshanworks](https://github.com/dharshanworks)

---

## Project Status

```text
Development: Completed
Frontend: Completed
Backend: Completed
Database: Completed
SQL Reports: Completed
Manual Testing Documentation: Planned
API Testing Collection: Planned
Automation Testing: Planned
```
