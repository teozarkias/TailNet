USE dogWalkApp;

CREATE TABLE IF NOT EXISTS Matches(
  match_id AUTO_INCREMENT,
  user_id1 INT NOT NULL,
  user_id2 INT NOT NULL,
  time_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(user_id1, user_id2),
  FOREIGN KEY (user_id1) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id2) REFERENCES users(user_id) ON DELETE CASCADE
);