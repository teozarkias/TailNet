import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    const db = await open({
      filename: "DataBase/dogWalkApp.db",
      driver: sqlite3.Database,
    });

    // Get user and check
    const user = await db.get(
      "SELECT * FROM Users WHERE username = ? AND password = ?",
      [username, password]
    );

    if(!user){
      return NextResponse.json(
        { message: "Invalid credentials" }, 
        { status: 401}
      );
    }

    // Compare passwords
    const valid = await bcrypt.compare(password, user.password_hash);

    if(!valid){
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }

    
    return NextResponse.json(
      { message: "Login successful", user: { id: user.user_id, username } },
      { status: 200 }
    );

  } catch (error) {
      console.log("Error: ", error);
      
      return NextResponse.json(
        { message: "Server error" },
        { status: 200 }
      );
  }

}