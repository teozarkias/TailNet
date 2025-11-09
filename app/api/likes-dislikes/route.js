import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { opne } from "sqlite";

export async function GET(){
  try {
    const db = await open({
      filename: "/Database/dogWalkApp.db",
      driver: sqlite3.Database,
    })

    
  } catch (error) {
    console.log("Error in 'api/likes-dislikes", error);
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