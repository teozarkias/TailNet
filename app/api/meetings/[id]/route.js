import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { cookies } from "next/headers";

async function getDb() {
  const db = await open({
    filename: "DataBase/dogWalkApp.db",
    driver: sqlite3.Database,
  });

  // Ensure Meetings exists (safe no-op if already there)
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

// Invited user can accept/reject a pending meeting.
export async function PATCH(req, { params }) {
  let db;
  try {
    const cookieStore = await cookies();
    const me = Number(cookieStore.get("user_id")?.value);
    if (!me) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

    const meetingId = Number(params.id);
    if (!meetingId) return NextResponse.json({ message: "Invalid meeting id" }, { status: 400 });

    const { status } = await req.json();
    if (![["accepted"], ["rejected"], ["pending"]].flat().includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    db = await getDb();

    const meeting = await db.get(
      `SELECT * FROM Meetings WHERE meeting_id = ?`,
      [meetingId]
    );

    if (!meeting) {
      return NextResponse.json({ message: "Meeting not found" }, { status: 404 });
    }

    // Only the invited user can accept/reject.
    if (meeting.invited_id !== me) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await db.run(
      `UPDATE Meetings SET status = ? WHERE meeting_id = ?`,
      [status, meetingId]
    );

    const updated = await db.get(
      `SELECT * FROM Meetings WHERE meeting_id = ?`,
      [meetingId]
    );

    return NextResponse.json({ meeting: updated }, { status: 200 });
  } catch (error) {
    console.log("Error in /api/meetings/[id] PATCH", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  } finally {
    if (db) await db.close();
  }
}
