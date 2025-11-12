import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function GET(){
  try {
    const currentUserId = 1;

    const db = await open({
      filename: "DataBase/dogWalkApp.db",
      driver: sqlite3.Database,
    });

    const likes = await db.all(
      `
      SELECT u.username, u.fullname, u.age, u.sex, u.dog_name, u.dog_breed, u.dog_sex, u.photo_url
      FROM UserInteraction ui
      JOIN Users u ON u.user_id = ui.target_user_id
      WHERE ui.user_id = ? AND ui.interaction = 'like'
      ORDER BY ui.time_created DESC;
      `, [currentUserId]
    );

    const dislikes = await db.all(
      `
      SELECT u.username, u.fullname, u.age, u.sex, u.dog_name, u.dog_breed, u.dog_sex, u.photo_url
      FROM UserInteraction
      JOIN Users u ON u.user_id = ui target_user_id
      WHERE ui.user_id = ? AND ui.interaction = 'dislike'
      ORDER BY ui.time_created DESC;
      `, [currentUserId]
    );

    return NextResponse.json(
      { likes, dislikes},
      { status: 200}
    );
    
  } catch (error) {
    console.log("Error in 'api/interactions", error);
    NextResponse.json(
      { message: "Server error"},
      { status: 500 },
    );
  }finally{
    if(db){
      await db.close();
    }
  }
}