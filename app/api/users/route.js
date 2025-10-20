import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function GET(req){
  try {

    const db = await open({
      filename: "DataBase/dogWalkApp.db",
      driver: sqlite3.Database,
    });


    const getUsers = await db.all(
      `SELECT * 
      FROM Users
      WHERE `
    )
  } catch (error) {
    console.error("Error in api/users:", err);
    NextResponse.json(
      { message: "Server error:"},
      { status: 500 }
    );
  }
}