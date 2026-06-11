const API_URL = "/api";

/* =========================
   Login
========================= */

function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("loginMessage");

    if (username === "" || password === "") {
        message.innerText = "Please enter username and password";
        message.className = "error";
        return;
    }

    fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Invalid credentials");
        }
        return response.json();
    })
    .then(data => {
        localStorage.setItem("user", JSON.stringify(data.user));
        message.innerText = "Login successful";
        message.className = "success";

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 700);
    })
    .catch(error => {
        message.innerText = "Invalid username or password";
        message.className = "error";
    });
}

/* =========================
   Logout
========================= */

function logout() {
    localStorage.removeItem("user");
    window.location.href = "index.html";
}

/* =========================
   Dashboard
========================= */

function loadDashboard() {
    fetch(`${API_URL}/employees`)
    .then(response => response.json())
    .then(data => {
        document.getElementById("totalEmployees").innerText = data.length;

        const departments = new Set(data.map(emp => emp.department_name));
        document.getElementById("totalDepartments").innerText = departments.size;

        let totalSalary = 0;

        data.forEach(emp => {
            totalSalary += Number(emp.current_salary);
        });

        const averageSalary = data.length > 0 ? totalSalary / data.length : 0;

        document.getElementById("averageSalary").innerText = "₹" + averageSalary.toFixed(2);
    })
    .catch(error => {
        console.log("Dashboard loading failed", error);
    });
}

/* =========================
   Employees
========================= */

function loadEmployees() {
    fetch(`${API_URL}/employees`)
    .then(response => response.json())
    .then(data => {
        const employeeTable = document.getElementById("employeeTable");
        employeeTable.innerHTML = "";

        if (data.length === 0) {
            employeeTable.innerHTML = `
                <tr>
                    <td colspan="10">No employees found</td>
                </tr>
            `;
            return;
        }

        data.forEach(emp => {
            employeeTable.innerHTML += `
                <tr>
                    <td>${emp.employee_id}</td>
                    <td>${emp.employee_name}</td>
                    <td>${emp.department_name || "-"}</td>
                    <td>${emp.designation}</td>
                    <td>${emp.location}</td>
                    <td>${emp.gender}</td>
                    <td>₹${emp.current_salary}</td>
                    <td>${emp.performance_rating}</td>
                    <td>${emp.manager_name}</td>
                    <td>
                        <button class="delete-btn" onclick="deleteEmployee(${emp.employee_id})">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        });
    })
    .catch(error => {
        console.log("Employee loading failed", error);
    });
}

function addEmployee() {
    const employeeMessage = document.getElementById("employeeMessage");

    const employee = {
        employee_name: document.getElementById("employee_name").value.trim(),
        email: document.getElementById("email").value.trim(),
        department_id: document.getElementById("department_id").value,
        designation: document.getElementById("designation").value.trim(),
        location: document.getElementById("location").value.trim(),
        gender: document.getElementById("gender").value,
        experience: document.getElementById("experience").value,
        current_salary: document.getElementById("current_salary").value,
        performance_rating: document.getElementById("performance_rating").value,
        manager_name: document.getElementById("manager_name").value.trim()
    };

    if (
        employee.employee_name === "" ||
        employee.department_id === "" ||
        employee.designation === "" ||
        employee.current_salary === "" ||
        employee.performance_rating === ""
    ) {
        employeeMessage.innerText = "Please fill all required fields";
        employeeMessage.className = "error";
        return;
    }

    fetch(`${API_URL}/employees`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(employee)
    })
    .then(async response => {
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Employee add failed");
        }

        return data;
    })
    .then(data => {
        employeeMessage.innerText = data.message;
        employeeMessage.className = "success";

        clearEmployeeForm();
        loadEmployees();
    })
    .catch(error => {
        employeeMessage.innerText = error.message;
        employeeMessage.className = "error";
    });
}

function clearEmployeeForm() {
    document.getElementById("employee_name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("department_id").value = "";
    document.getElementById("designation").value = "";
    document.getElementById("location").value = "";
    document.getElementById("gender").value = "";
    document.getElementById("experience").value = "";
    document.getElementById("current_salary").value = "";
    document.getElementById("performance_rating").value = "";
    document.getElementById("manager_name").value = "";
}

function deleteEmployee(employeeId) {
    const confirmDelete = confirm("Are you sure you want to delete this employee?");

    if (!confirmDelete) {
        return;
    }

    fetch(`${API_URL}/employees/${employeeId}`, {
        method: "DELETE"
    })
    .then(async response => {
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Employee delete failed");
        }

        return data;
    })
    .then(data => {
        alert(data.message);
        loadEmployees();
    })
    .catch(error => {
        alert(error.message);
        console.error("Delete error:", error);
    });
}

/* =========================
   Calculator
========================= */

function loadEmployeesForCalculator() {
    fetch(`${API_URL}/employees`)
    .then(response => response.json())
    .then(data => {
        const dropdown = document.getElementById("calculatorEmployee");
        dropdown.innerHTML = `<option value="">Select Employee</option>`;

        data.forEach(emp => {
            dropdown.innerHTML += `
                <option value="${emp.employee_id}">
                    ${emp.employee_name} - ${emp.designation} - Rating ${emp.performance_rating}
                </option>
            `;
        });
    })
    .catch(error => {
        console.log("Employee dropdown loading failed", error);
    });
}

function calculateCompensation() {
    const employeeId = document.getElementById("calculatorEmployee").value;
    const resultDiv = document.getElementById("calculationResult");

    if (employeeId === "") {
        resultDiv.innerHTML = `<p class="error">Please select an employee</p>`;
        return;
    }

    fetch(`${API_URL}/calculate-compensation`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ employee_id: employeeId })
    })
    .then(async response => {
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Compensation calculation failed");
        }

        return data;
    })
    .then(data => {
        if (!data.newSalary) {
            resultDiv.innerHTML = `<p class="error">${data.message}</p>`;
            return;
        }

        resultDiv.innerHTML = `
            <h3>Calculation Result</h3>
            <p><strong>Old Salary:</strong> ₹${data.oldSalary}</p>
            <p><strong>Hike Percentage:</strong> ${data.hikePercentage}%</p>
            <p><strong>Hike Amount:</strong> ₹${data.hikeAmount}</p>
            <p><strong>New Salary:</strong> ₹${data.newSalary}</p>
            <p class="success"><strong>${data.message}</strong></p>
        `;
    })
    .catch(error => {
        resultDiv.innerHTML = `<p class="error">${error.message}</p>`;
    });
}

/* =========================
   Reports
========================= */

function loadDepartmentSalaryReport() {
    fetch(`${API_URL}/reports/department-salary`)
    .then(response => response.json())
    .then(data => {
        let html = `
            <h2>Department-wise Average Salary Report</h2>
            <table>
                <thead>
                    <tr>
                        <th>Department</th>
                        <th>Average Salary</th>
                        <th>Total Employees</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.forEach(row => {
            html += `
                <tr>
                    <td>${row.department_name}</td>
                    <td>₹${Number(row.average_salary).toFixed(2)}</td>
                    <td>${row.total_employees}</td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
        `;

        document.getElementById("reportArea").innerHTML = html;
    })
    .catch(error => {
        document.getElementById("reportArea").innerHTML =
            `<p class="error">Report loading failed</p>`;
    });
}

function loadPayEquityReport() {
    fetch(`${API_URL}/reports/pay-equity`)
    .then(response => response.json())
    .then(data => {
        let html = `
            <h2>Gender-wise Pay Equity Report</h2>
            <table>
                <thead>
                    <tr>
                        <th>Gender</th>
                        <th>Average Salary</th>
                        <th>Total Employees</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.forEach(row => {
            html += `
                <tr>
                    <td>${row.gender}</td>
                    <td>₹${Number(row.average_salary).toFixed(2)}</td>
                    <td>${row.total_employees}</td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
        `;

        document.getElementById("reportArea").innerHTML = html;
    })
    .catch(error => {
        document.getElementById("reportArea").innerHTML =
            `<p class="error">Report loading failed</p>`;
    });
}

function loadBelowBandReport() {
    fetch(`${API_URL}/reports/below-band`)
    .then(response => response.json())
    .then(data => {
        let html = `
            <h2>Employees Below Salary Band Report</h2>
            <table>
                <thead>
                    <tr>
                        <th>Employee Name</th>
                        <th>Designation</th>
                        <th>Current Salary</th>
                        <th>Minimum Salary</th>
                        <th>Maximum Salary</th>
                    </tr>
                </thead>
                <tbody>
        `;

        if (data.length === 0) {
            html += `
                <tr>
                    <td colspan="5">No employees below salary band</td>
                </tr>
            `;
        }

        data.forEach(row => {
            html += `
                <tr>
                    <td>${row.employee_name}</td>
                    <td>${row.designation}</td>
                    <td>₹${row.current_salary}</td>
                    <td>₹${row.min_salary}</td>
                    <td>₹${row.max_salary}</td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
        `;

        document.getElementById("reportArea").innerHTML = html;
    })
    .catch(error => {
        document.getElementById("reportArea").innerHTML =
            `<p class="error">Report loading failed</p>`;
    });
}

/* =========================
   Compensation Rules
========================= */

function getRatingLabel(rating) {
    const labels = {
        5: "Excellent",
        4: "Very Good",
        3: "Good",
        2: "Average",
        1: "Needs Improvement"
    };

    return labels[Number(rating)] || "Unknown";
}

function loadCompensationRules() {
    fetch(`${API_URL}/rules`)
    .then(response => response.json())
    .then(data => {
        const rulesTable = document.getElementById("rulesTable");
        rulesTable.innerHTML = "";

        if (data.length === 0) {
            rulesTable.innerHTML = `
                <tr>
                    <td colspan="5">No compensation rules found</td>
                </tr>
            `;
            return;
        }

        data.forEach(rule => {
            rulesTable.innerHTML += `
                <tr>
                    <td>${rule.rule_id}</td>
                    <td>${rule.performance_rating}</td>
                    <td>${getRatingLabel(rule.performance_rating)}</td>
                    <td>${rule.hike_percentage}%</td>
                    <td>
                        <button onclick="editCompensationRule(${rule.rule_id}, ${rule.performance_rating}, ${rule.hike_percentage})">
                            Edit
                        </button>

                        <button class="delete-btn" onclick="deleteCompensationRule(${rule.rule_id})">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        });
    })
    .catch(error => {
        console.log("Rules loading failed", error);
    });
}

function addCompensationRule() {
    const message = document.getElementById("ruleMessage");

    const rule = {
        performance_rating: document.getElementById("rule_rating").value,
        hike_percentage: document.getElementById("hike_percentage").value
    };

    if (rule.performance_rating === "" || rule.hike_percentage === "") {
        message.innerText = "Please select rating and enter hike percentage";
        message.className = "error";
        return;
    }

    fetch(`${API_URL}/rules`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(rule)
    })
    .then(async response => {
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to add rule");
        }

        return data;
    })
    .then(data => {
        message.innerText = data.message;
        message.className = "success";

        document.getElementById("rule_rating").value = "";
        document.getElementById("hike_percentage").value = "";

        loadCompensationRules();
    })
    .catch(error => {
        message.innerText = error.message;
        message.className = "error";
    });
}

function editCompensationRule(ruleId, oldRating, oldPercentage) {
    const newRating = prompt("Enter new performance rating:", oldRating);
    const newPercentage = prompt("Enter new hike percentage:", oldPercentage);

    if (newRating === null || newPercentage === null) {
        return;
    }

    if (newRating.trim() === "" || newPercentage.trim() === "") {
        alert("Rating and hike percentage cannot be empty");
        return;
    }

    fetch(`${API_URL}/rules/${ruleId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            performance_rating: newRating,
            hike_percentage: newPercentage
        })
    })
    .then(async response => {
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to update rule");
        }

        return data;
    })
    .then(data => {
        alert(data.message);
        loadCompensationRules();
    })
    .catch(error => {
        alert(error.message);
    });
}

function deleteCompensationRule(ruleId) {
    const confirmDelete = confirm("Are you sure you want to delete this compensation rule?");

    if (!confirmDelete) {
        return;
    }

    fetch(`${API_URL}/rules/${ruleId}`, {
        method: "DELETE"
    })
    .then(async response => {
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to delete rule");
        }

        return data;
    })
    .then(data => {
        alert(data.message);
        loadCompensationRules();
    })
    .catch(error => {
        alert(error.message);
    });
}

/* =========================
   Animation
========================= */

document.addEventListener("DOMContentLoaded", () => {
    const revealItems = document.querySelectorAll(".reveal");

    revealItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.15}s`;
    });
});