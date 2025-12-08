import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

/*
Code	   When to use it
------  ------------------
200    	Returning data normally.
201     Created	After inserting something into the database.
400     Bad Request	Missing query/body parameters or invalid data.
401     Unauthorized	No cookie / no token — user is not logged in.
403     Forbidden	User logged in but not part of the chat.
404     Not Found	Chat or message does not exist.
500     Server Error	Unexpected error — database crash, exception, etc.
*/ 


export async function GET(req) {

  let db;
  try {
    const { searchParams } = new URL(req.url);
    const excludeId = searchParams.get("exclude");

    db = await open({
      filename: "DataBase/dogWalkApp.db",
      driver: sqlite3.Database,
    });

    const users = await db.all(
      `
      SELECT user_id, username, fullname, age, sex, dog_name, dog_breed, dog_sex, photo_url
      FROM Users
      WHERE user_id != ?
       `,
      [excludeId]
    );


    /* 
       DO THIS AFTER ALL TESTING (get cards i stil havent swiped to)
    SELECT *
    FROM Users u
    WHERE u.user_id != :currentUserId
      AND u.user_id NOT IN (
        SELECT target_user_id
        FROM Interactions
        WHERE user_id = :currentUserId
      );
  */
    return NextResponse.json({ users }, { status: 200 });

  } catch (err) {
    console.error("Error in /api/users:", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  } finally {
    if(db){
      await db.close();
    }
  }
}
