import { NextResponse } from "next/server";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

export async function GET(){
  try {
    const currentId = 1;

    const db = await open({
      filename: "DataBase/dogWalkApp.db",
      driver: sqlite3.Database,
    });

    const profile = await db.all(
      `
      SELECT u.username, u.fullname, u.age, u.sex, u.dog_name, u.dog_breed, u.dog_sex
      FROM Users u
      WHERE u.user_id = ?
      `, [currentId]
    );

    return NextResponse.json({ profile }, { status: 200});

  } catch (error) {
    console.log("Error in /api/profile");
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