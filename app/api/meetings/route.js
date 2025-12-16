import { NextResponse } from "next/server";
import sqlite3 from "sqlite3"
import { open } from "sqlite";
import { cookies } from "next/headers";

let db;

async function getDB() {
  if(!db){
    db = await open({
      filename: "DataBase/dogWalkApp.db",
      driver: sqlite3.Database,
    });
  }
  
  return db;
}


export async function GET(req) {
  try {
    const db = await getDB();
    const cookieStore = await cookies();
    const currentId =  Number(cookieStore.get("user_id")?.value);

    if(!currentId){
      return NextResponse.json(
        { message: "Missing id"},
        { status: 401}
      );
    }

    const { searchParams } = new URL(req.url);
    const matchId = Number(searchParams.get("matchId"));

    if (!matchId) {
      return NextResponse.json(
        { message: "Missing matchId" }, 
        { status: 400 }
      );
    }

    const match = await db.get(
      `
      SELECT user_id1, user_id2 
      FROM Matches 
      WHERE match_id = ?
      `,[matchId]
    );

    if (!match){ 
      return NextResponse.json(
        { message: "Match not found" },
        { status: 404 }
      );
    }

    const meetings = await db.all(
      `
      SELECT meeting_id, match_id, proposer_id, lat, lng, meeting_time, status, time_created
      FROM Meetings
      WHERE match_id = ?
      ORDER BY time_created DESC
      `,
      [matchId]
    );

    return NextResponse.json(
      { meetings },
      { status:200 }
    );

  } catch (error) {
    console.log("Error in /api/meetings: ", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}




export async function POST(req) {
  try {
    const db = await getDB();
    const cookieStore = await cookies();
    const currentId = Number(cookieStore.get("user_id")?.value);

    if(!currentId){
      return NextResponse.json(
        { message: "Missing id"},
        { status: 401}
      );
    }

    const data = await req.json();
    const proposer_id = currentId;
    const matchId = data.matchId;
    const lat = data.lat;
    const lng = data.lng;
    const meeting_time = data.meeting_time;
    
    if(!matchId || Number.isNaN(lat) || Number.isNaN(lng) || !meeting_time){
      return NextResponse.json(
        { message: "Bad request" },
        { status: 400 }
      );
    }

    const match = await db.get(
      `
      SELECT user_id1, user_id2
      FROM Matches
      WHERE match_id = ?
      `, [matchId]
    );

    if(!match){
      return NextResponse.json(
        { message: "No match found..."},
        { status: 404 }        
      );
    }
    
    const result = await db.run(
      `
      INSERT INTO Meetings(match_id, proposer_id, lat, lng, meeting_time)
      VALUES(?, ?, ?, ?, ?)
      `, [matchId, proposer_id, lat, lng, meeting_time] 
    );

    return NextResponse.json(
      {  meeting_id: result.lastID },
      { status:200 }
    );
  } catch (error) {
    console.log("Error in /api/meetings:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status:500 }
    );
  }
}