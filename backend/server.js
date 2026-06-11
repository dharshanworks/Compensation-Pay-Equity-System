require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Compensation Planning API is running");
});

// Login API
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;

    const sql = "SELECT * FROM users WHERE username = ? AND password = ?";

    db.query(sql, [username, password], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }

        if (result.length > 0) {
            res.json({ message: "Login successful", user: result[0] });
        } else {
            res.status(401).json({ message: "Invalid username or password" });
        }
    });
});

// Get employees
app.get("/api/employees", (req, res) => {
    const sql = `
        SELECT e.*, d.department_name
        FROM employees e
        LEFT JOIN departments d
        ON e.department_id = d.department_id
    `;

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }

        res.json(result);
    });
});

// Add employee
app.post("/api/employees", (req, res) => {
    const {
        employee_name,
        email,
        department_id,
        designation,
        location,
        gender,
        experience,
        current_salary,
        performance_rating,
        manager_name
    } = req.body;

    const sql = `
        INSERT INTO employees 
        (employee_name, email, department_id, designation, location, gender, experience, current_salary, performance_rating, manager_name)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            employee_name,
            email,
            department_id,
            designation,
            location,
            gender,
            experience,
            current_salary,
            performance_rating,
            manager_name
        ],
        (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Employee insert failed" });
            }

            res.json({ message: "Employee added successfully" });
        }
    );
});

// Delete employee
// Delete employee
app.delete("/api/employees/:id", (req, res) => {
    const employeeId = req.params.id;

    db.beginTransaction((err) => {
        if (err) {
            return res.status(500).json({ message: "Transaction start failed" });
        }

        // First delete compensation calculation records
        const deleteResultsSql = "DELETE FROM compensation_results WHERE employee_id = ?";

        db.query(deleteResultsSql, [employeeId], (err) => {
            if (err) {
                return db.rollback(() => {
                    res.status(500).json({ message: "Failed to delete compensation records" });
                });
            }

            // Then delete employee
            const deleteEmployeeSql = "DELETE FROM employees WHERE employee_id = ?";

            db.query(deleteEmployeeSql, [employeeId], (err, result) => {
                if (err) {
                    return db.rollback(() => {
                        res.status(500).json({ message: "Employee delete failed" });
                    });
                }

                if (result.affectedRows === 0) {
                    return db.rollback(() => {
                        res.status(404).json({ message: "Employee not found" });
                    });
                }

                db.commit((err) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({ message: "Delete commit failed" });
                        });
                    }

                    res.json({ message: "Employee deleted successfully" });
                });
            });
        });
    });
});

// Get compensation rules
// Get all compensation rules
app.get("/api/rules", (req, res) => {
    const sql = "SELECT * FROM compensation_rules ORDER BY performance_rating DESC";

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Failed to fetch compensation rules" });
        }

        res.json(result);
    });
});

// Add or update compensation rule
app.post("/api/rules", (req, res) => {
    const { performance_rating, hike_percentage } = req.body;

    if (!performance_rating || hike_percentage === "") {
        return res.status(400).json({
            message: "Performance rating and hike percentage are required"
        });
    }

    const checkSql = "SELECT * FROM compensation_rules WHERE performance_rating = ?";

    db.query(checkSql, [performance_rating], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Rule validation failed" });
        }

        // If rule already exists, update it
        if (result.length > 0) {
            const updateSql = `
                UPDATE compensation_rules
                SET hike_percentage = ?
                WHERE performance_rating = ?
            `;

            db.query(updateSql, [hike_percentage, performance_rating], (err) => {
                if (err) {
                    return res.status(500).json({ message: "Failed to update existing rule" });
                }

                return res.json({
                    message: "Existing compensation rule updated successfully"
                });
            });

            return;
        }

        // If rule does not exist, insert it
        const insertSql = `
            INSERT INTO compensation_rules 
            (performance_rating, hike_percentage)
            VALUES (?, ?)
        `;

        db.query(insertSql, [performance_rating, hike_percentage], (err) => {
            if (err) {
                return res.status(500).json({ message: "Failed to add compensation rule" });
            }

            res.json({ message: "Compensation rule added successfully" });
        });
    });
});

// Update compensation rule by rule ID
app.put("/api/rules/:id", (req, res) => {
    const ruleId = req.params.id;
    const { performance_rating, hike_percentage } = req.body;

    if (!performance_rating || hike_percentage === "") {
        return res.status(400).json({
            message: "Performance rating and hike percentage are required"
        });
    }

    const sql = `
        UPDATE compensation_rules
        SET performance_rating = ?, hike_percentage = ?
        WHERE rule_id = ?
    `;

    db.query(sql, [performance_rating, hike_percentage, ruleId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Failed to update compensation rule" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Rule not found" });
        }

        res.json({ message: "Compensation rule updated successfully" });
    });
});

// Delete compensation rule
app.delete("/api/rules/:id", (req, res) => {
    const ruleId = req.params.id;

    const sql = "DELETE FROM compensation_rules WHERE rule_id = ?";

    db.query(sql, [ruleId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Failed to delete compensation rule" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Rule not found" });
        }

        res.json({ message: "Compensation rule deleted successfully" });
    });
});

// Calculate compensation
app.post("/api/calculate-compensation", (req, res) => {
    const { employee_id } = req.body;

    const sql = `
        SELECT e.employee_id, e.current_salary, e.performance_rating, r.hike_percentage
        FROM employees e
        JOIN compensation_rules r
        ON e.performance_rating = r.performance_rating
        WHERE e.employee_id = ?
    `;

    db.query(sql, [employee_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Calculation failed" });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "Employee or rule not found" });
        }

        const employee = result[0];
        const oldSalary = Number(employee.current_salary);
        const hikePercentage = Number(employee.hike_percentage);
        const hikeAmount = oldSalary * hikePercentage / 100;
        const newSalary = oldSalary + hikeAmount;

        const insertSql = `
            INSERT INTO compensation_results
            (employee_id, old_salary, hike_percentage, hike_amount, new_salary, calculated_date)
            VALUES (?, ?, ?, ?, ?, CURDATE())
        `;

        db.query(
            insertSql,
            [
                employee.employee_id,
                oldSalary,
                hikePercentage,
                hikeAmount,
                newSalary
            ],
            (insertErr) => {
                if (insertErr) {
                    return res.status(500).json({ message: "Result save failed" });
                }

                res.json({
                    message: "Compensation calculated successfully",
                    oldSalary,
                    hikePercentage,
                    hikeAmount,
                    newSalary
                });
            }
        );
    });
});

// Department salary report
app.get("/api/reports/department-salary", (req, res) => {
    const sql = `
        SELECT 
            d.department_name,
            AVG(e.current_salary) AS average_salary,
            COUNT(e.employee_id) AS total_employees
        FROM employees e
        JOIN departments d
        ON e.department_id = d.department_id
        GROUP BY d.department_name
    `;

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Report failed" });
        }

        res.json(result);
    });
});

// Pay equity report
app.get("/api/reports/pay-equity", (req, res) => {
    const sql = `
        SELECT 
            gender,
            AVG(current_salary) AS average_salary,
            COUNT(employee_id) AS total_employees
        FROM employees
        GROUP BY gender
    `;

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Pay equity report failed" });
        }

        res.json(result);
    });
});

// Below salary band report
app.get("/api/reports/below-band", (req, res) => {
    const sql = `
        SELECT 
            e.employee_name,
            e.designation,
            e.current_salary,
            s.min_salary,
            s.max_salary
        FROM employees e
        JOIN salary_bands s
        ON e.designation = s.designation
        WHERE e.current_salary < s.min_salary
    `;

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Below band report failed" });
        }

        res.json(result);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});