import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    const db = await open({
      filename: "DataBase/dogWalkApp.db",
      driver: sqlite3.Database,
    });

    // Check if username - password are valid
    const user = await db.get(
      "SELECT * FROM Users WHERE username = ?",
      [username]
    );

    if (!user) {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Compare hash with bcrypt
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "Login successful", user: { id: user.user_id, username } },
      { status: 200 }
    );

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
