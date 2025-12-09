import { NextResponse } from "next/server";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import { cookies } from "next/headers";

export async function GET(req) {
  let db;

  try {
    // Read user_id from query
    const { searchParams } = new URL(req.url);
    const userIdFromQuery = searchParams.get("user_id");
    
    // Also read user_id from cookie (current logged-in user)
    const cookieStore = await cookies();
    const userIdFromCookie = cookieStore.get("user_id")?.value;

    // Pick which one to use, if query param exists → use that, otherwise back to cookie
    const userId = userIdFromQuery
      ? Number(userIdFromQuery)
      : Number(userIdFromCookie);
      
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

    const profile = await db.get(
      `
      SELECT 
        user_id,
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
