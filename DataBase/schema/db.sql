CREATE TABLE IF NOT EXISTS Users (
  user_id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  fullname TEXT NOT NULL,
  age INTEGER NOT NULL,
  sex TEXT NOT NULL,
  dog_name TEXT NOT NULL,
  dog_breed TEXT NOT NULL,
  dog_sex TEXT NOT NULL,
  time_created DATETIME DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS Matches (
  match_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id1 INTEGER NOT NULL,
  user_id2 INTEGER NOT NULL,
  time_created DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id1, user_id2),
  FOREIGN KEY (user_id1) REFERENCES Users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id2) REFERENCES Users(user_id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS AuthUsers (
  auth_user_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  time_created DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

ALTER TABLE Users ADD COLUMN photo_url TEXT;

SELECT username, password_hash FROM Users;


CREATE TABLE IF NOT EXISTS UserInteraction (
  interaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  target_user_id INTEGER NOT NULL,
  interaction TEXT NOT NULL CHECK(interaction in('like', 'dislike')),
  time_created DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (target_user_id) REFERENCES Users(target_user_id) ON DELETE CASCADE,
  UNIQUE(user_id, target_user_id)
);
