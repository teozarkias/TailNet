import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs";

async function setupDatabase() {
  try {
    // Delete DB if exists
    if (fs.existsSync("DataBase/dogWalkApp.db")) {
      fs.unlinkSync("DataBase/dogWalkApp.db");
    }

    const db = await open({
      filename: "DataBase/dogWalkApp.db",
      driver: sqlite3.Database,
    });

    const schema = fs.readFileSync("DataBase/schema/db.sql", "utf8");
    await db.exec(schema);

    console.log("Database initialized successfully!");

    
    
    await db.close();
  } catch (err) {
    console.error("Error initializing DB:", err);
  }
}

setupDatabase();
