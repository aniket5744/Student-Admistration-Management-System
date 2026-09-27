require("dotenv").config({ path: "../.env" });

const fs = require("fs");
const path = require("path");
const pool = require("./config/database");

async function runMigrations() {
    const migrationsPath = path.join(
        __dirname,
        "../../database/migrations"
    );

    try {
        const files = fs
            .readdirSync(migrationsPath)
            .filter((file) => file.endsWith(".sql"))
            .sort();

        for (const file of files) {
            console.log(`Running migration: ${file}`);

            const filePath = path.join(migrationsPath, file);
            const sql = fs.readFileSync(filePath, "utf8");

            await pool.query(sql);

            console.log(`Completed: ${file}`);
        }

        console.log("All migrations completed successfully.");
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        await pool.end();
    }
}

runMigrations();