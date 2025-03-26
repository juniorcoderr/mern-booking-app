import { test, expect } from "@playwright/test";
import path from "path";

const UI_URL = "http://localhost:5173/";

test.beforeEach(async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByRole("link", { name: "Sign In" }).click();

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  await page.locator("[name=email]").fill("netgoluyadav337@gmail.com");
  await page.locator("[name=password]").fill("123456789");

  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByText("Sign In Successful!")).toBeVisible();
});

test("should allow user to add a hotel", async ({ page }) => {
  await page.goto(`${UI_URL}add-hotel`);

  await page.locator('[name="name"]').fill("Test Hotel");
  await page.locator('[name="city"]').fill("Test City");
  await page.locator('[name="country"]').fill("Test Country");
  await page
    .locator('[name="description"]')
    .fill("This is a description for the Test Hotel");
  await page.locator('[name="pricePerNight"]').fill("100");
  await page.selectOption('select[name="starRating"]', "3");

  await page.getByText("Budget").click();

  await page.getByLabel("Free WiFi").check();
  await page.getByLabel("Parking").check();

  await page.locator('[name="adultCount"]').fill("2");
  await page.locator('[name="childCount"]').fill("4");

  await page.setInputFiles('[name="imageFiles"]', [
    path.join(__dirname, "files", "pic 1.jpeg"),
    path.join(__dirname, "files", "pic 2.jpeg"),
  ]);

  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Hotel Saved!")).toBeVisible();
});

test("should display hotels", async ({ page }) => {
  // Generate a unique hotel name using a timestamp
  const uniqueName = `Test Hotel ${Date.now()}`;
  const description = `This is a description for the ${uniqueName}`;

  // Step 1: Add a hotel with the unique name
  await page.goto(`${UI_URL}add-hotel`);
  await page.locator('[name="name"]').fill(uniqueName);
  await page.locator('[name="city"]').fill("Test City");
  await page.locator('[name="country"]').fill("Test Country");
  await page.locator('[name="description"]').fill(description);
  await page.locator('[name="pricePerNight"]').fill("100");
  await page.selectOption('select[name="starRating"]', "3");
  await page.getByText("Budget").click();
  await page.getByLabel("Free WiFi").check();
  await page.getByLabel("Parking").check();
  await page.locator('[name="adultCount"]').fill("2");
  await page.locator('[name="childCount"]').fill("4");
  await page.setInputFiles('[name="imageFiles"]', [
    path.join(__dirname, "files", "pic 1.jpeg"),
    path.join(__dirname, "files", "pic 2.jpeg"),
  ]);
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Hotel Saved!")).toBeVisible();

  // Step 2: Navigate to the my-hotels page
  await page.goto(`${UI_URL}my-hotels`);

  // Step 3: Find the specific hotel card containing the unique name
  const hotelCard = page.getByTestId("hotel-card").filter({
    has: page.getByRole("heading", { name: uniqueName }),
  });

  // Step 4: Check elements within this specific hotel card
  await expect(
    hotelCard.getByRole("heading", { name: uniqueName })
  ).toBeVisible();
  await expect(hotelCard.getByText(description)).toBeVisible();
  await expect(hotelCard.getByText("Test City, Test Country")).toBeVisible();
  await expect(hotelCard.getByText("Budget")).toBeVisible();
  await expect(hotelCard.getByText("₹100 per night")).toBeVisible();
  await expect(hotelCard.getByText("2 adults, 4 children")).toBeVisible();
  await expect(hotelCard.getByText("3 Star Rating")).toBeVisible();
  await expect(
    hotelCard.getByRole("link", { name: "View Details" })
  ).toBeVisible();

  // Step 5: Check the "Add Hotel" link, which is outside the hotel card
  await expect(page.getByRole("link", { name: "Add Hotel" })).toBeVisible();
});
