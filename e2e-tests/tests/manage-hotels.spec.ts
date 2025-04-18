import { test, expect } from "@playwright/test";
import path from "path";

const UI_URL = "http://localhost:5173/";

test.beforeEach(async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByRole("link", { name: "Sign In" }).click();

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  await page.locator("[name=email]").fill("netgoluyadav337@gmail.com");
  await page.locator("[name=password]").fill("golu123456");

  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByText("Sign In Successful!")).toBeVisible();
});

test("should allow user to add a hotel", async ({ page }) => {
  await page.goto(`${UI_URL}add-hotel`);

  await page.locator('[name="name"]').fill("Titan Farm House");
  await page.locator('[name="city"]').fill("Noida");
  await page.locator('[name="country"]').fill("India");
  await page.locator('[name="description"]').fill("very nice farm house");
  await page.locator('[name="pricePerNight"]').fill("1000");
  await page.selectOption('select[name="starRating"]', "4");

  await page.getByText("Motel").click();

  await page.getByLabel("Free WiFi").check();
  await page.getByLabel("Parking").check();

  await page.locator('[name="adultCount"]').fill("4");
  await page.locator('[name="childCount"]').fill("2");

  await page.setInputFiles('[name="imageFiles"]', [
    path.join(__dirname, "files", "pic 1.jpeg"),
    //path.join(__dirname, "files", "pic 2.jpeg"),
  ]);

  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Hotel Saved!")).toBeVisible();
});

test("should display hotels", async ({ page }) => {
  await page.goto(`${UI_URL}my-hotels`);

  await expect(page.getByText("Titan Farm House")).toBeVisible();
  await expect(page.getByText("very nice farm house")).toBeVisible();
  await expect(page.getByText("Noida, India")).toBeVisible();
  await expect(page.getByText("Motel")).toBeVisible();
  await expect(page.getByText("₹1000 per night")).toBeVisible();
  await expect(page.getByText("4 adults, 2 children")).toBeVisible();
  await expect(page.getByText("4 Star Rating")).toBeVisible();

  await expect(
    page.getByRole("link", { name: "View Details" }).first()
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Add Hotel" })).toBeVisible();
});

test("should edit hotel", async ({ page }) => {
  await page.goto(`${UI_URL}my-hotels`);

  await page.getByRole("link", { name: "View Details" }).first().click();

  await page.waitForSelector('[name="name"]', { state: "attached" });
  await expect(page.locator('[name="name"]')).toHaveValue("Titan Farm House");
  await page.locator('[name="name"]').fill("Titan Farm House Updated");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Hotel Saved!")).toBeVisible();

  await page.reload();

  await expect(page.locator('[name="name"]')).toHaveValue(
    "Titan Farm House Updated"
  );
  await page.locator('[name="name"]').fill("Titan Farm House");
  await page.getByRole("button", { name: "Save" }).click();
});
