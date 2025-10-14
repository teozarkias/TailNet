import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function  POST(req) {
  try {
    const {fullname, username, password} = await req.json();

    // Store values in an array
    const fields =[
      { name: "fullname", value: fullname},
      { name: "username", value: username},
      { name: "password", value: password}
    ]
    
    // Check if valid 
    for(const field of fields){
      if(!field.value){
        return NextResponse.json({ message: `${field.name} is required`}, {status: 400});
      }
    }



    const db = await open({
      filename: "/DataBase/users.sql",
      driver: sqlite3.Database,
    });

    // Check if user exists
    const existingUser = await db.get(  "SELECT * FROM users WHERE username = ?", [username]  );
    if (existingUser){
      return NextResponse.json({ message: "Username already exists"}, {status: 409});
    }


    // Proccess of inserting a user
    await db.run(
      "INSERT INTO users (fullname, username, password) VALUES (?, ?, ?)", [fullname, username, password]
    );


    return NextResponse.json({ message: "User added successfully"}, {status: 201});

  } catch (error) {
    console.log("Error registering user: ", error);
    return NextResponse.json({ message: "Server error"}, {status: 500});
  }
}