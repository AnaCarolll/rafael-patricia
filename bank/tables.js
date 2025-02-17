const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('dados.db');

db.all("SELECT name FROM sqlite_master WHERE type='table';", (err, rows) => {
  if (err) {
    console.error(err.message);
  } else {
    rows.forEach((row) => {
      console.log(row.name);
    });
  }
});

db.close();