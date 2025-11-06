import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function GET() {
  try {
    



  } catch (error) {
    console.log("Error in /api/matches", error);
    NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}