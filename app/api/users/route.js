import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const excludeId = searchParams.get("exclude");

    const db = await open({
      filename: "DataBase/dogWalkApp.db",
      driver: sqlite3.Database,
    });

    const users = await db.all(
      `SELECT user_id, username, fullname, age, sex, dog_name, dog_breed, dog_sex, photo_url
       FROM Users
       WHERE user_id != ?`,
      [excludeId]
    );

    return NextResponse.json({ users }, { status: 200 });

  } catch (err) {
    console.error("Error in /api/users:", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
