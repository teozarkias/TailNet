import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { cookies } from "next/headers";

export async function GET() {

  let db;
  try {

    const cookieStore = await cookies();
    const currentId = Number(cookieStore.get("user_id")?.value);

    db = await open({
      filename : "DataBase/dogWalkApp.db",
      driver: sqlite3.Database,
    });
    
    const matches = await db.all(
      `
      SELECT m.match_id, u.user_id, u.username, u.photo_url, u.dog_name, u.dog_breed
      FROM Matches m
      JOIN Users u ON u.user_id = m.user_id2
      WHERE m.user_id1 = ?

      UNION 

      SELECT m.match_id, u.user_id AS id, u.username, u.photo_url, u.dog_name, u.dog_breed
      FROM Matches m
      JOIN Users u ON u.user_id = m.user_id1
      WHERE m.user_id2 = ?
  
      ORDER BY user_id;
      `, [currentId, currentId]
    );

    return NextResponse.json({ matches }, { status: 200});

  } catch (error) {
    console.log("Error in /api/matches", error);
    NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  } finally{
    if(db){
      await db.close();
    }
  }
}