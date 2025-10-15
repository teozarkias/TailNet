import sqlite3 from "sqlite3";
import { open } from "sqlite";

const db = await open({
  filename: "DataBase/dogWalkApp.db",
  driver: sqlite3.Database,
});

const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
console.log("📋 Tables in your database:");
console.log(tables);

await db.close();
