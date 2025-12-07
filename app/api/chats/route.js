import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { cookies } from "next/headers";

let db = null;

async function getDb() {

  if (!db) {
    db = await open({
      filename: "DataBase/dogWalkApp.db",
      driver: sqlite3.Database,
    });
  }
  return db;
}




export async function GET() {
  try {
    const db = await getDb();
    const cookieStore = await cookies();
    const currentId = Number(cookieStore.get("user_id")?.value);

    if (!currentId) {
      return NextResponse.json({ message: "Id not found" }, { status: 401 });
    }

    const chats = await db.all(
      `
     SELECT
      ch.chat_id AS id,
      u.user_id,
      u.username,
      u.photo_url
    FROM Chats ch
    JOIN Users u
      ON u.user_id = CASE
        WHEN ch.user1_id = ? THEN ch.user2_id
        ELSE ch.user1_id
      END
    WHERE ch.user1_id = ? OR ch.user2_id = ?
    ORDER BY ch.chat_id DESC;
      `,
      [currentId, currentId, currentId]
    ); // CASE cause either user can be user1 or user2

    return NextResponse.json({ chats }, { status: 200 });

  } catch (error) {
    console.log("GET /api/chats error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });

  } finally {
    if (db) {
      await db.close();
      db = null;
    }
  }
}
