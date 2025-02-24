
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('dados.db');

db.serialize(() => {
    db.run(`
          CREATE TABLE IF NOT EXISTS produto (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              nome TEXT,
              quantidade_escolhida TEXT,
              quantidade_disponivel TEXT,
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
              id INTEGER PRIMARY KEY AUTOINCREMENT,
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

const sql = {

    insert(nome_table, obj) {
        return new Promise((resolve, reject) => {
            if (obj.hasOwnProperty('id')) {
                delete obj.id;
            }

            const keys = Object.keys(obj).join(', ');
            const values = Object.values(obj);
            const placeholders = values.map(() => '?').join(', ');

            const query = `INSERT INTO ${nome_table} (${keys}) VALUES (${placeholders})`;

            db.run(query, values, function (err) {
                if (err) {
                    reject(`Erro ao inserir dados: ${err.message}`);
                } else {
                    resolve(`Dados inseridos com sucesso. ID: ${this.lastID}`);
                }
            });
        });
    },

    update(tableName, obj) {

        return new Promise((resolve, reject) => {
            const keys = Object.keys(obj);
            const values = Object.values(obj);

            if (keys.length === 0) {
                console.error('Nenhuma coluna para atualizar.');
                resolve('Nenhuma coluna para atualizar.')
                return;
            }

            const id = obj.id
            console.log('id')
            console.log(id)

            const setClause = keys.map(key => `${key} = ?`).join(', ');
            const sql = `UPDATE ${tableName} SET ${setClause} WHERE id = ${id}`;

            db.run(sql, values, function (err) {
                if (err) {
                    reject('Erro ao atualizar:', err.message)
                } else {
                    resolve(`Linhas atualizadas: ${this.changes}`)
                }
            });
        })

    },

    query(sql, params = []) {
        return new Promise((resolve, reject) => {
            db.all(sql, params, (err, rows) => { 
                if (err) {
                    reject({ erro: err.message });
                } else {
                    console.log(rows)
                    resolve(rows); 
                }
            });
        });
    },

    async show(tableName) {
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
    },

    async showId(tableName, id) {
        const lista = []
        return new Promise((resolve, reject) => {

            db.all(`SELECT * FROM ${tableName} WHERE id = ${id}`, [], (err, rows) => {
                if (err) reject(err);

                resolve(rows[0]);

            });
        })
    },

    async delete(tableName, id) {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM ${tableName} WHERE id = ?;`, [id], function (err) {
                if (err) {
                    reject('Erro ao excluir dados')
                    return 'Erro ao excluir dados'
                } else {
                    resolve("Dados excluídos com sucesso!");
                    return 'Dados excluídos com sucesso'
                }
            });
        })
    },

    async deleteCondition(tableName, condition) {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM ${tableName} WHERE ${condition};`, function (err) {
                if (err) {
                    reject('Erro ao excluir dados')
                    return 'Erro ao excluir dados'
                } else {
                    resolve("Dados excluídos com sucesso!");
                    return 'Dados excluídos com sucesso'
                }
            });
        })
    },

    login(email, senha) {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM cliente WHERE email='${email}' and senha='${senha}'`, [], (err, rows) => {
                if (err) reject(err)
                if (rows.length == 0) resolve('não existe este usuário')
                rows.forEach((row) => {
                    resolve(row)
                });
            });
        })
    }
}

export default sql