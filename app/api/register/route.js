import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const {
      username,
      password,
      fullname,
      age,
      sex,
      dog_name,
      dog_breed,
      dog_sex,
      photo_url
    } = await req.json();


    // Require all fields except photo
    if (!username || !password || !fullname || !age || !sex || !dog_name || !dog_breed || !dog_sex) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }


    // Open database
    const db = await open({
      filename: "DataBase/dogWalkApp.db",
      driver: sqlite3.Database,
    });


    // Check if username exists
    const existing = await db.get("SELECT * FROM Users WHERE username = ?", [username]);
    if (existing) {
      return NextResponse.json(
        { message: "Username already exists" },
        { status: 409 }
      );
    }

    const hash = await bcrypt.hash(password, 10);

    // Put data in DataBase
    await db.run(
      `
      INSERT INTO Users
      (username, password_hash, fullname, age, sex, dog_name, dog_breed, dog_sex, photo_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        username,
        hash,
        fullname,
        age,
        sex,
        dog_name,
        dog_breed,
        dog_sex,
        photo_url ?? null
      ]
    );

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  } finally {
    if(db){
      await db.close();
    }
  }
}
