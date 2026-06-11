const { test, expect } = require("@playwright/test");

async function login(page) {
    await page.goto("/login.html");

    await page.fill("#username", "admin");
    await page.fill("#password", "admin123");

    await page.getByRole("button", { name: "Launch Dashboard" }).click();

    await expect(page).toHaveURL(/dashboard.html/);
}

test.describe("CompensationPro Automation Test Suite", () => {

    test("TC_001 - Verify valid admin login", async ({ page }) => {
        await page.goto("/login.html");

        await page.fill("#username", "admin");
        await page.fill("#password", "admin123");

        await page.getByRole("button", { name: "Launch Dashboard" }).click();

        await expect(page).toHaveURL(/dashboard.html/);
        await expect(page.locator("h1")).toContainText("Compensation Planning");
    });

    test("TC_002 - Verify invalid admin login", async ({ page }) => {
        await page.goto("/login.html");

        await page.fill("#username", "wronguser");
        await page.fill("#password", "wrongpass");

        await page.getByRole("button", { name: "Launch Dashboard" }).click();

        await expect(page.locator("#loginMessage")).toContainText("Invalid username or password");
    });

    test("TC_003 - Verify employee can be added", async ({ page }) => {
        await login(page);

        await page.goto("/employees.html");

        const uniqueName = "Automation User " + Date.now();

        await page.fill("#employee_name", uniqueName);
        await page.fill("#email", `automation${Date.now()}@example.com`);
        await page.selectOption("#department_id", "1");
        await page.fill("#designation", "Software Engineer");
        await page.fill("#location", "Hyderabad");
        await page.selectOption("#gender", "Male");
        await page.fill("#experience", "2");
        await page.fill("#current_salary", "450000");
        await page.selectOption("#performance_rating", "4");
        await page.fill("#manager_name", "Ravi Kumar");

        await page.getByRole("button", { name: "Add Employee" }).click();

        await expect(page.locator("#employeeMessage")).toContainText("Employee added successfully");
        await expect(page.locator("#employeeTable")).toContainText(uniqueName);
    });

    test("TC_004 - Verify compensation rules are displayed", async ({ page }) => {
    await login(page);

    await page.goto("/compensation-rules.html");

    await page.waitForResponse(response =>
        response.url().includes("/api/rules") && response.status() === 200
    );

    await expect(page.locator("#rulesTable")).not.toContainText("Loading rules");

    const rowCount = await page.locator("#rulesTable tr").count();

    expect(rowCount).toBeGreaterThan(0);

    const rulesText = await page.locator("#rulesTable").innerText();

    expect(rulesText.length).toBeGreaterThan(0);
});

    test("TC_005 - Verify compensation rule can be updated", async ({ page }) => {
        await login(page);

        await page.goto("/compensation-rules.html");

        await page.selectOption("#rule_rating", "4");
        await page.fill("#hike_percentage", "15");

        await page.getByRole("button", { name: "Add Rule" }).click();

        await expect(page.locator("#ruleMessage")).toContainText(/successfully/i);
        await expect(page.locator("#rulesTable")).toContainText("15");
    });

    test("TC_006 - Verify salary hike calculation", async ({ page }) => {
    await login(page);

    await page.goto("/calculator.html");

    // Wait until employees are loaded into dropdown
    await page.waitForResponse(response =>
        response.url().includes("/api/employees") && response.status() === 200
    );

    await expect(page.locator("#calculatorEmployee")).toBeVisible();

    // Wait until dropdown has more than one option
    await expect.poll(async () => {
        return await page.locator("#calculatorEmployee option").count();
    }).toBeGreaterThan(1);

    // Select first employee from dropdown
    await page.selectOption("#calculatorEmployee", { index: 1 });

    // Click calculate and wait for calculation API response
    const [response] = await Promise.all([
        page.waitForResponse(response =>
            response.url().includes("/api/calculate-compensation")
        ),
        page.getByRole("button", { name: /Calculate/i }).click()
    ]);

    expect(response.status()).toBe(200);

    // Wait until result area is not empty
    await expect.poll(async () => {
        return await page.locator("#calculationResult").innerText();
    }).not.toBe("");

    const resultText = await page.locator("#calculationResult").innerText();

    expect(resultText).toMatch(/New Salary|Calculation Result|Hike Amount|successfully/i);
});

    test("TC_007 - Verify department salary report", async ({ page }) => {
        await login(page);

        await page.goto("/reports.html");

        await page.getByRole("button", { name: "Department Salary Report" }).click();

        await expect(page.locator("#reportArea")).toContainText("Department-wise Average Salary Report");
        await expect(page.locator("#reportArea")).toContainText("Average Salary");
    });

    test("TC_008 - Verify pay equity report", async ({ page }) => {
        await login(page);

        await page.goto("/reports.html");

        await page.getByRole("button", { name: "Pay Equity Report" }).click();

        await expect(page.locator("#reportArea")).toContainText("Gender-wise Pay Equity Report");
        await expect(page.locator("#reportArea")).toContainText("Average Salary");
    });

    test("TC_009 - Verify below salary band report", async ({ page }) => {
        await login(page);

        await page.goto("/reports.html");

        await page.getByRole("button", { name: "Below Salary Band Report" }).click();

        await expect(page.locator("#reportArea")).toContainText("Employees Below Salary Band Report");
    });

});