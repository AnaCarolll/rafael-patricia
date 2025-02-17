const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('dados.db');

db.serialize(() => {
    db.run(`
          CREATE TABLE IF NOT EXISTS produto (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              nome TEXT,
              imagemUrl TEXT,
              link TEXT
          );
          `);
    db.run(`
  
          CREATE TABLE IF NOT EXISTS cliente (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              email TEXT UNIQUE,
              hierarquia INTEGER,
              senha TEXT
          );
  `);

    db.run(`
          CREATE TABLE IF NOT EXISTS produtos_escolhidos (
              cliente_id INTEGER,
              produto_id INTEGER,
              FOREIGN KEY (cliente_id) REFERENCES cliente(id),
              FOREIGN KEY (produto_id) REFERENCES produto(id)
          );
      `);
})

db.close((err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Dados inseridos com sucesso!');
    }
});