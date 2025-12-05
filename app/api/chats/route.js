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
    const cookieStore = cookies();
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
      JOIN Users u ON u.user_id = ch.user2_id
      WHERE ch.user1_id = ?
      ORDER BY ch.chat_id DESC;
      `,
      [currentId]
    );

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





export async function POST(req) {
  try {
    const cookieStore = cookies();
    const currentId = Number(cookieStore.get("user_id")?.value);

    if (!currentId) {
      return NextResponse.json({ message: "Id not found" }, { status: 401 });
    }

    const { user2_id } = await req.json();

    if (!user2_id) {
      return NextResponse.json({ message: "Missing user2_id" }, { status: 400 });
    }

    const db = await getDb();

    // Check if chat already exists
    let chat = await db.get(
      `
      SELECT chat_id
      FROM Chats
      WHERE user1_id = ? AND user2_id = ?
      `,
      [currentId, user2_id]
    );

    if (!chat) {
      const result = await db.run(
        `
        INSERT INTO Chats (match_id, user1_id, user2_id)
        VALUES (NULL, ?, ?)
        `,
        [currentId, user2_id]
      );

      chat = { chat_id: result.lastID };
    }

    return NextResponse.json({ chatId: chat.chat_id }, { status: 200 });

  } catch (error) {
    console.log("POST /api/chats error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });

  } finally {
    if (db) {
      await db.close();
      db = null;
    }
  }
}
