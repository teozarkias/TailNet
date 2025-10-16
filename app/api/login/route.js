import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function POST(req) {
  const { username, password } = await req.json();

  const db = await open({
    filename: "DataBase/dogWalkApp.db",
    driver: sqlite3.Database,
  });


  const user = await db.get(
    "SELECT * FROM Users WHERE username = ? AND password = ?",
    [username, password]
  );

  if(user) return NextResponse.json({ message: "Login successful"}, { status: 200 });
  else return NextResponse.json({ message: "Invalid credentials"}, { status: 401});
}