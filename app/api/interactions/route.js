import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { cookies } from "next/headers";

async function getDb() {
  return open({
    filename: "DataBase/dogWalkApp.db",
    driver: sqlite3.Database,
  });
}

// GET /api/interactions  -> used by Interactions page
let db;
export async function GET() {
  try {
    const cookieStore = await cookies();
    const currentId = Number(cookieStore.get("user_id")?.value);

    if (!currentId) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    db = await getDb();

    const likes = await db.all(
      `
      SELECT 
        ui.target_user_id AS id,
        u.username,
        u.fullname,
        u.age,
        u.sex,
        u.dog_name,
        u.dog_breed,
        u.dog_sex,
        u.photo_url
      FROM UserInteraction ui
      JOIN Users u ON u.user_id = ui.target_user_id
      WHERE ui.user_id = ? AND ui.interaction = 'like'
      ORDER BY ui.time_created DESC
      `,
      [currentId]
    );

    const dislikes = await db.all(
      `
      SELECT 
        ui.target_user_id AS id,
        u.username,
        u.fullname,
        u.age,
        u.sex,
        u.dog_name,
        u.dog_breed,
        u.dog_sex,
        u.photo_url
      FROM UserInteraction ui
      JOIN Users u ON u.user_id = ui.target_user_id
      WHERE ui.user_id = ? AND ui.interaction = 'dislike'
      ORDER BY ui.time_created DESC
      `,
      [currentId]
    );

    return NextResponse.json({ likes, dislikes }, { status: 200 });
  } catch (error) {
    console.error("Error in /api/interactions GET:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  } finally {
    if (db) {
      await db.close();
    }
  }
}

// POST /api/interactions  -> called from main swipe page
export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const currentId = Number(cookieStore.get("user_id")?.value);

    if (!currentId) {
      return NextResponse.json(
        { message: "Id not found" },
        { status: 401 }
      );
    }

    const { targetUserId, interaction } = await req.json();

    if (!targetUserId || !["like", "dislike"].includes(interaction)) {
      return NextResponse.json(
        { message: "Invalid payload" },
        { status: 400 }
      );
    }

    db = await getDb();

    // Insert or update interaction (Angle 2 – opinions can change)
    await db.run(
      `
      INSERT INTO UserInteraction (user_id, target_user_id, interaction)
      VALUES (?, ?, ?)
      ON CONFLICT(user_id, target_user_id)
      DO UPDATE SET 
        interaction = excluded.interaction,
        time_created = CURRENT_TIMESTAMP
      `,
      [currentId, targetUserId, interaction]
    );

    // If like, check for mutual like and create Match
    if (interaction === "like") {
      const mutual = await db.get(
        `
        SELECT 1
        FROM UserInteraction
        WHERE user_id = ? AND target_user_id = ? AND interaction = 'like'
        `,
        [targetUserId, currentId] // check if they liked you back
      );

      if (mutual) {
        const user1 = Math.min(currentId, targetUserId);
        const user2 = Math.max(currentId, targetUserId);

        await db.run(
          `
          INSERT OR IGNORE INTO Matches (user_id1, user_id2)
          VALUES (?, ?)
          `,
          [user1, user2]
        );
      }
    }

    return NextResponse.json(
      { message: "Interaction added" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/interactions POST:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  } finally {
    if (db) {
      await db.close();
    }
  }
}
