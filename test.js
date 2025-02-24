
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('dados.db');

function clientExists(email) {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM cliente WHERE email = ?`, [email], (err, rows) => {
            if (err) {
                reject(err.message)
                return;
            }
            const test = rows.length > 0
            resolve(test)
        });
    })
}





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
              cliente_id TEXT,
              produto_id TEXT,
              FOREIGN KEY (cliente_id) REFERENCES cliente(id),
              FOREIGN KEY (produto_id) REFERENCES produto(id)
          );
      `);


    db.run(`
        INSERT INTO cliente (email, hierarquia, senha) 
        SELECT 'a', 0, 'a'
        WHERE NOT EXISTS (
            SELECT 1 FROM cliente WHERE email = 'a'
        );
    `);

    db.run(`
        INSERT INTO cliente (email, hierarquia, senha) 
        SELECT 'b', 1, 'b'
        WHERE NOT EXISTS (
            SELECT 1 FROM cliente WHERE email = 'b'
        );
    `);


})







function show(tableName) {
    const lista = []
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM ` + tableName, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                rows.forEach((row) => {
                    lista.push(row);
                });
                resolve(lista);
            }
        });
    })
}



function query(query) {
    const lista = []
    return new Promise((resolve, reject) => {
        db.all(query, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                rows.forEach((row) => {
                    lista.push(row);
                });
                resolve(lista);
            }
        });
    })
}

query('SELECT * FROM cliente').then(e => console.log(e))
query('SELECT * FROM produtos_escolhidos').then(e => console.log(e))
query(`
    SELECT produtos_escolhidos.id AS id, cliente.email AS email, produtos_escolhidos.produto_id as produto_id
    FROM produtos_escolhidos
    INNER JOIN cliente ON produtos_escolhidos.cliente_id == cliente.id
    `).then(e => console.log(e))



function userExists(name) {
    const lista = []
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM cliente WHERE email = '${name}'`, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const test = rows.length > 0
                resolve(test);
            }
        });
    })
}

