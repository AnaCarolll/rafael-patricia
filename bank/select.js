const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('dados.db');

// Consultando dados
db.all(`SELECT * FROM produto`, [], (err, rows) => {
    if (err) {
        console.error(err.message);
    } else {
        rows.forEach((row) => {
            console.log(row);
        });
    }
});

// Consultando dados
db.all(`SELECT * FROM cliente`, [], (err, rows) => {
    if (err) {
        console.error(err.message);
    } else {
        rows.forEach((row) => {
            console.log(row);
        });
    }
});
// Consultando dados
db.all(`SELECT * FROM produtos_escolhidos`, [], (err, rows) => {
    if (err) {
        console.error(err.message);
    } else {
        rows.forEach((row) => {
            console.log(row);
        });
    }
});
