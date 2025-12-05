import { NextResponse } from "next/server";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import { cookies } from "next/headers";

export async function GET(req) {
  let db;

  try {
    // 🔹 Read user_id from the query string: /api/profile?user_id=1
    const cookieStore = await cookies();
    const userId = Number(cookieStore.get("user_id")?.value);

    if (!userId) {
      return NextResponse.json(
        { message: "user_id missing" },
        { status: 400 }
      );
    }

    db = await open({
      filename: "DataBase/dogWalkApp.db",
      driver: sqlite3.Database,
    });

    // 🔹 Get exactly one row
    const profile = await db.get(
      `
      SELECT 
        username,
        fullname,
        age,
        sex,
        dog_name,
        dog_breed,
        dog_sex,
        photo_url
      FROM Users
      WHERE user_id = ?
      `,
      [userId]
    );

    if (!profile) {
      return NextResponse.json(
        { message: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ profile }, { status: 200 });
  } catch (error) {
    console.log("Error in /api/profile:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  } finally {
    if (db) await db.close();
  }
}
