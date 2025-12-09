import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
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
  /*
      searchParams creates a url object from the req's full url
      and returns an object like this:

      {
        href: "http://localhost:3000/api/messages?chatId=12",
        pathname: "/api/messages",
        search: "?chatId=12",
        searchParams: URLSearchParams { "chatId" → "12" }
      }
    */ 
  const db = await getDB();
  const { searchParams } = new URL(req.url);
  const chatId = Number(searchParams.get("chatId"));
  // Then it extracts the value of chatId and converts it to a Number

  
  const cookieStore = await cookies();
  const currentId = Number(cookieStore.get("user_id")?.value);
 
  if(!currentId){
    return NextResponse.json(
      { message: "Missing Id"},
      { status:401 }
    );
  }

  const messages = await db.all(
    `
    SELECT m.message_id, m.chat_id, m.sender_id, m.message, m.time_created
    FROM Messages m 
    JOIN Users u ON u.user_id = m.sender_id
    WHERE m.chat_id = ?
    ORDER BY m.time_created ASC;
    `,[chatId]
  );

  return NextResponse.json(
    { messages }, 
    { status:200 }
  );


  } catch (error) {
    console.log("Error in /api/messages-get", error);
    return NextResponse.json(
      { message: "Server error"},
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
        { message: "Missing Id"},
        { status: 401 }
      );
    }

    // Getting chatId and message
    const data = await req.json();
    const chatId = Number(data.chatId);
    const message = String(data.message || "").trim();
    //.trim() is needed to prevent sending blank messages


    
    const result = await db.run(
      `
      INSERT INTO Messages(chat_id, sender_id, message)
      VALUES(?, ?, ?)
      `, [chatId, currentId, message]
    );

    
    const newMessage = await db.get(
      `
      SELECT m.message_id, m.chat_id, m.sender_id, m.message, m.time_created
      FROM Messages m
      JOIN Users u ON u.user_id = m.sender_id
      WHERE m.message_id = ?
      `, [result.lastID]
    );
    /* When sedning a message and using sqlite3 package, it sends a property like this:
    
    {
     lastID: 21 (example: 21st message sent to someone)
     changes: 1
    }

    So lastID isnt an SQL variable or a JavaScript function.
    Its actually the variable stored inside the sqlite package itself.
    */

    return NextResponse.json(
      { newMessage },
      { status: 201 }
    );

  } catch (error) {
    console.log("Error in /api/messages-post", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  } 
}