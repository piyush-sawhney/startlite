import { sqlClient } from "@/db";
import { seedDevData } from "./dev/seed";

async function main() {
  console.log("Seeding development accounts and shops...");
  const result = await seedDevData();

  console.log("");
  console.log(`Seeded ${result.businesses} businesses.`);
  console.log(`Every account uses the password: ${result.password}`);
  console.log("See docs/dev-accounts.md for the full login table.");
}

main()
  .then(async () => {
    await sqlClient.end();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error(error);
    await sqlClient.end();
    process.exit(1);
  });
