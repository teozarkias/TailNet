import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { cookies } from "next/headers";

async function getDb() {
  const db = await open({
    filename: "DataBase/dogWalkApp.db",
    driver: sqlite3.Database,
  });

  // "Migration" guard: ensure Meetings exists cause this troubled me a lot.
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Meetings (
      meeting_id INTEGER PRIMARY KEY AUTOINCREMENT,
      creator_id INTEGER NOT NULL,
      invited_id INTEGER NOT NULL,
      meeting_time TEXT NOT NULL,
      place TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','accepted','rejected')),
      time_created DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (creator_id) REFERENCES Users(user_id) ON DELETE CASCADE,
      FOREIGN KEY (invited_id) REFERENCES Users(user_id) ON DELETE CASCADE
    );
  `);

  return db;
}

// List meetings for the logged-in user.
export async function GET() {
  let db;
  try {
    const cookieStore = await cookies();
    const currentUserId = Number(cookieStore.get("user_id")?.value);

    if (!currentUserId) {
      return NextResponse.json(
        { message: "Not authenticated" }, 
        { status: 401 }
      );
    }

    db = await getDb();

    // Return meetings + the "other" user's basic info.
    const meetings = await db.all(
      `
      SELECT
        m.meeting_id,
        m.creator_id,
        m.invited_id,
        m.meeting_time,
        m.place,
        m.status,
        m.time_created,
        u.user_id AS other_user_id,
        u.username AS other_username,
        u.photo_url AS other_photo_url
      FROM Meetings m
      JOIN Users u
        ON u.user_id = CASE
          WHEN m.creator_id = ? THEN m.invited_id
          ELSE m.creator_id
        END
      WHERE m.creator_id = ? OR m.invited_id = ?
      ORDER BY datetime(m.time_created) DESC;
      `,
      [currentUserId, currentUserId, currentUserId]
    );

    return NextResponse.json(
      { meetings }, 
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in /api/meetings", error);
    return NextResponse.json(
      { message: "Server error" }, 
      { status: 500 }
    );
  } finally {
    if (db){
      await db.close();
    }
  }
}




// Create a meeting (time + place) for a match.
export async function POST(req) {
  let db;
  try {
    const cookieStore = await cookies();
    const creatorId = Number(cookieStore.get("user_id")?.value);

    if (!creatorId) {
      return NextResponse.json(
        { message: "Not authenticated" }, 
        { status: 401 }
      );
    }

    const { invitedId, meetingTime, place } = await req.json();

    if (!invitedId || !meetingTime || !place) {
      return NextResponse.json(
        { message: "Missing fields" }, 
        { status: 400 }
      );
    }

    if (Number(invitedId) === creatorId) {
      return NextResponse.json(
        { message: "Invalid invited user" }, 
        { status: 400 }
      );
    }

    db = await getDb();

    const result = await db.run(
      `
      INSERT INTO Meetings (creator_id, invited_id, meeting_time, place, status)
      VALUES (?, ?, ?, ?, 'pending');
      `,
      [creatorId, invitedId, meetingTime, place]
    );

    const meeting = await db.get(
      `SELECT * FROM Meetings WHERE meeting_id = ?`,
      [result.lastID]
    );

    return NextResponse.json(
      { meeting }, 
      { status: 201 }
    );
  } catch (error) {
    console.log("Error in /api/meetings POST", error);
    return NextResponse.json(
      { message: "Server error" }, 
      { status: 500 }
    );
  } finally {
    if (db){
      await db.close();
    }
  }
}
