import { sqlClient } from "@/db";
import { wipeDevDatabase } from "./dev/wipe";

async function main() {
  const confirmed =
    process.argv.includes("--yes") ||
    process.env.CONFIRM_DB_WIPE === "1";

  if (!confirmed) {
    console.log(
      "Refusing to wipe. Re-run with --yes, or use `pnpm db:wipe:dev`.",
    );
    return;
  }

  const count = await wipeDevDatabase();
  console.log(`Wiped ${count} tables. The database is empty.`);
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
