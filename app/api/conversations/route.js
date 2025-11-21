import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function GET(req) {

  let db;
  try {
    // Checks weather match exists
    const { searchParams } = new URL(req.url);
    const match = Number(searchParams.get("match_id"));

    if(!match_id){
      return NextResponse.json(
        { message: "Match id's missing" },
        { status: 400},
      );
    }

    
    const db = await open({
      filename: "DataBase/dogWalkApp.db",
      driver: sqlite3.Database,
    });


    const message = await db.get(
      `
      SELECT  HEREEEEEEEEEEEEEEEEEEE
      `
    )



  } catch (error) {    
    console.log("Error in api/conversations: ", error);

    return NextResponse.json(
      { message: "Server error"},
      { status: 500}
    );

  }finally{
    if(db){
      await db.close();
    }
  }

}
