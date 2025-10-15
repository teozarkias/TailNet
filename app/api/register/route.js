import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcrypt";
import path from "path";

export async function POST(req) {
  try {
    const { fullname, username, password } = await req.json();

    // Store values in an array
    const fields =[
      { name: "fullname", value: fullname},
      { name: "username", value: username},
      { name: "password", value: password}
    ]
    
    // Check if fields are valid 
    for(const field of fields){
      if(!field.value){
        return NextResponse.json({ message: `${field.name} is required`}, {status: 400});
      }
    }

    const db = await open({
      filename: "DataBase/dogWalkApp.db",
      driver: sqlite3.Database,
    });


    // Check if user is valid
    const user = await db.get("SELECT * FROM Users WHERE userename = ?", [username]);

    if(!user){
      return NextResponse.json({ message: "Invalid Credentials"}, { status:401 });
    }


    // Check if password is valid
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if(!isValidPassword){
      return NextResponse.json({ message: "Invalid password"}, { status:401 });
    }



    return NextResponse.json({ message: "Login successful", user: { id:user.user_id, username}}, { status: 200 });


  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
