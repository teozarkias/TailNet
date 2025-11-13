import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function GET() {
  try {
    const currentId = 1;

    const db = await open({
      filename : "DataBase/dogWalkApp.db",
      driver: sqlite3.Database,
    });
    
    const matches = await db.all(
      `
      SELECT u.user_id, u.username, u.photo_url, u.dog_name, u.dog_breed
      FROM Matches m
      JOIN Users u ON u.user_id = m.user_id2
      WHERE m.user_id2 = ?

      UNION 

      SELECT u.user_id AS id, u.username, u.photo_url, u.dog_name, u.dog_breed
      FROM Matches m
      JOIN Users u ON u.user_id = m.user_id1
      WHERE m.user_id2 = ?
  
      ORDER BY id;
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