const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('dados.db');

// Criando uma tabela
db.run(`
        CREATE TABLE produto (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        imagemUrl TEXT,
        link TEXT
    );

    CREATE TABLE cliente (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        hierarquia NUMBER,
        senha TEXT
    );

    CREATE TABLE produtos_escolhidos (
        cliente_id INTEGER,
        produto_id INTEGER,
        FOREIGN KEY (cliente_id) REFERENCES cliente(id),
        FOREIGN KEY (produto_id) REFERENCES produto(id)
    );
)`);

// 0 - CLIENTE COMUM
// 1 -

// Inserindo um registro
db.run(`INSERT INTO produto (nome, imagemUrl, link) VALUES ('Smartphone A', 'https://exemplo.com/imagem1.jpg', 'https://www.loja.com/produtoA');`)
db.run(`INSERT INTO produto (nome, imagemUrl, link) VALUES ('Smartphone B', 'https://exemplo.com/imagem1.jpg', 'https://www.loja.com/produtoB');`)
db.run(`INSERT INTO produto (nome, imagemUrl, link) VALUES ('Smartphone C', 'https://exemplo.com/imagem1.jpg', 'https://www.loja.com/produtoC');`)
db.run(`INSERT INTO produto (nome, imagemUrl, link) VALUES ('Smartphone D', 'https://exemplo.com/imagem1.jpg', 'https://www.loja.com/produtoD');`)
db.run(`INSERT INTO produto (nome, imagemUrl, link) VALUES ('Smartphone E', 'https://exemplo.com/imagem1.jpg', 'https://www.loja.com/produtoE');`)

db.run(`
    INSERT INTO cliente (email, hierarquia, senha)
    VALUES
    ('joao@email.com', 1, 'senha123'),
    ('maria@email.com', 2, 'senha456'),
    ('pedro@email.com', 3, 'senha789');
`)

db.run(`
INSERT INTO produtos_escolhidos (cliente_id, produto_id)
VALUES
  (1, 1),  -- Cliente 1 escolheu o produto 1
  (1, 2),  -- Cliente 1 escolheu o produto 2
  (2, 3),  -- Cliente 2 escolheu o produto 3
  (3, 1);
`)



// produto
// cliente
// produtos_escolhidos

// Consultando dados
db.all(`SELECT * FROM produto`, [], (err, rows) => {
    if (err) {
        console.error(err.message);
    } else {
        rows.forEach((row) => {
            console.log(row.id + ": " + row.name + ", " + row.email);
        });
    }
});