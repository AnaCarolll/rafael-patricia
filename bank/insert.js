const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('dados.db');

// Criação das tabelas (se não existirem)
db.serialize(() => {

  db.run(`INSERT INTO produto (nome, imagemUrl, link) VALUES ('Smartphone A', 'https://exemplo.com/imagem1.jpg', 'https://www.loja.com/produtoA');`);

  db.run(`
        INSERT INTO cliente (email, hierarquia, senha)
        VALUES
        ('joao@email.com', 1, 'senha123'),
        ('maria@email.com', 2, 'senha456'),
        ('pedro@email.com', 3, 'senha789');
    `);

  db.run(`
        INSERT INTO produtos_escolhidos (cliente_id, produto_id)
        VALUES
        (1, 1),
        (1, 2),
        (2, 3),
        (3, 1);
    `);


});

// db.all(`SELECT * FROM produto`, [], (err, rows) => {
//   if (err) {
//     console.error(err.message);
//   } else {
//     rows.forEach((row) => {
//       console.log(row);
//     });
//   }
// });

// db.all("SELECT name FROM sqlite_master WHERE type='table';", (err, rows) => {
//   if (err) {
//     console.error(err.message);
//   } else {
//     rows.forEach((row) => {
//       console.log(row.name);
//     });
//   }
// });


db.close((err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Dados inseridos com sucesso!');
  }
});