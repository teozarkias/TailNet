import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { cookies } from "next/headers";

let db;
async function getDB() {
  if (!db) {
    db = await open({
      filename: "DataBase/dogWalkApp.db",
      driver: sqlite3.Database,
    });
  }
  return db;
}

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const userId = Number(cookieStore.get("user_id")?.value);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { lat, lng } = await req.json();

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return NextResponse.json({ message: "Bad request" }, { status: 400 });
    }

    const db = await getDB();
    await db.run(
      `UPDATE Users SET lat = ?, lng = ? WHERE user_id = ?`,
      [lat, lng, userId]
    );

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.log("Error /api/location:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
