import { sqlClient } from "@/db";
import { seedDevData } from "./dev/seed";
import { wipeDevDatabase } from "./dev/wipe";

async function main() {
  console.log("Wiping the development database...");
  const count = await wipeDevDatabase();
  console.log(`Wiped ${count} tables.`);

  console.log("");
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
