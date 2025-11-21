import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

export async function POST(req) {
  let db;

  try {
    const { username, password } = await req.json();

    db = await open({
      filename: "DataBase/dogWalkApp.db",
      driver: sqlite3.Database,
    });

    // Find user by username
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

    // Compare password with hash
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Set cookie for server-side use
    cookies().set("user_id", String(user.user_id), {
      httpOnly: true,
      secure: false,
      path: "/",
    });

    return NextResponse.json(
      {
        message: "Login successful",
        user: { id: user.user_id, username: user.username },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  } finally {
    if (db) {
      await db.close();
    }
  }
}
