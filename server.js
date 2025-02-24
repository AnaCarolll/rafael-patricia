

import express from "express";
const app = express();
const port = 3000;
import sql from './sql.js';

app.use(express.static("public"));
app.use(express.json());



const tokens = {}

const generateToken = str => str.split('').map(e => e.charCodeAt()).join('') + Date.now().toString()

function verificarToken(req, res) {
    const token = req.headers.authorization;
    if (!token) { return false; }
    return true
}

function verificarNivelHierarquico(req, res, nivelHierarquico) {
    const token = req.headers.authorization;
    if (!token) { return false; }
    return tokens[token].hierarquia <= nivelHierarquico
}





app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Rota GET
app.get('/', (req, res) => {
    res.redirect(__dirname + '/login/loginpage.html')
});

app.post('/login', (req, res) => {
    const { email, senha } = req.body

    sql.login(email, senha)
        .then(e => {
            if (e == 'não existe este usuário') {
                res.json({ token: 'não existe usuário' })
                return
            }

            const token = generateToken(email + senha)
            tokens[token] = e
            res.json({ token: token, hierarquia: e.hierarquia })

        })
        .catch(e => {
            res.json({ token: e })
        })
})

app.get('/getinfotoken/:tokenId', (req, res) => {
    const tokenId = req.params.tokenId
    if (!tokens.hasOwnProperty(tokenId)) {
        res.json({ 'msg': 'error' })
        return
    }

    const { id, email, hierarquia } = tokens[tokenId]

    const obj = {
        id: id,
        email: email,
        hierarquia: hierarquia
    }

    res.json(obj)

})

app.get('/lista', (req, res) => {
    res.json({ msg: 'falta o nome da tabela' })
})

app.get('/produtos_id/:cliente_id', (req, res) => {
    const cliente_id = req.params.cliente_id; 

    sql.query("SELECT * FROM produtos_escolhidos WHERE cliente_id = ?", [cliente_id])
        .then(result => {
            res.json({ produto_id: result[0].produto_id });
        })
        .catch(err => {
            res.status(500).json({ erro: err.message });
        });
});

app.get('/produtos_id_id/:id', (req, res) => {
    const id = req.params.id;

    sql.query("SELECT * FROM produtos_escolhidos WHERE id = ?", [id])
        .then(result => {
            res.json({ produto_id: result[0].produto_id });
        })
        .catch(err => {
            res.status(500).json({ erro: err.message });
        });
});

app.get('/lista/:tablename', (req, res) => {
    
    const tablename = req.params.tablename
    sql.show(tablename).then(e => res.json(e)).catch(e => res.json({ err: 'não existe tabela' }))
});

app.get('/lista/:token/:tablename', (req, res) => {
    const tablename = req.params.tablename
    const token = req.params.token

    if (!tokens[token]) {
        res.json({ msg: 'token inválido' })
        return
    }
    if (!tokens[token].hierarquia == 1) {
        res.json({ msg: 'falta hierarquia' })
        return
    }

    sql.show(tablename).then(e => res.json(e)).catch(e => res.json({ err: 'não existe tabela' }))
});



app.get('/lista/:tablename/:id', (req, res) => {
    const tablename = req.params.tablename
    const id = req.params.id

    if (!tokens[token]) {
        res.json({ msg: 'token inválido' })
        return
    }
    if (!tokens[token].hierarquia == 1) {
        res.json({ msg: 'falta hierarquia' })
        return
    }

    sql.showId(tablename, id)
        .then(e => res.json(e))
        .catch(e => res.json({ err: 'não existe tabela' }))
});

app.get('/lista/:token/:tablename/:id', (req, res) => {
    const tablename = req.params.tablename
    const id = req.params.id

    sql.showId(tablename, id)
        .then(e => res.json(e))
        .catch(e => res.json({ err: 'não existe tabela' }))
});

app.post('/produto', (req, res) => {
    const { imagemUrl, nome, link } = req.body;
    const obj = {
        imagemUrl: imagemUrl,
        nome: nome,
        link: link
    }
    sql.insert('produto', obj)
    res.json({ mensagem: `Dados recebidos` });
});

app.post('/cliente', (req, res) => {
    const { email, senha, hierarquia } = req.body;
    const obj = {
        email: email,
        senha: senha,
        hierarquia: hierarquia
    }

    sql.insert('cliente', obj)
        .then(e => res.json({ mensagem: e }))

});

app.post('/produtos_escolhidos', (req, res) => {
    const { cliente_id, produto_id } = req.body;
    const obj = {
        cliente_id: cliente_id,
        produto_id: produto_id
    }
    sql.insert('produtos_escolhidos', obj)
    res.json({ mensagem: `Dados recebidos` });
});

app.post('/add/:tablename', (req, res) => {

    const cliente_id = ''

    const tableName = req.params.tablename
   

    sql.insert(tableName, req.body)
        .then(e => {
            res.json({ mensagem: e });
        }).catch(err => {
            res.json({ err: 'erro, não salvou' })
        })

});

app.post('/update/:tablename/:id', (req, res) => {

    const validToken = verificarToken(req, res)
    

    const id = req.params.id
    const tableName = req.params.tablename

    console.log('req.body')
    console.log(req.body)

    sql.update(tableName, req.body).then(e => {
        res.json({ mensagem: 'vai' + e });
    }).catch(err => {
        res.json({ mensagem: 'nvai+' + err });
    })


});

app.get('/delete/:tablename/:id', (req, res) => {
    const id = req.params.id
    const tableName = req.params.tablename

    sql.delete(tableName, id).then(msg => {
        res.json({ mensagem: msg });
    })
})

app.get('/delete2/:tablename/:condition', (req, res) => {
    const condition = req.params.condition
    const tableName = req.params.tablename

    sql.deleteCondition(tableName, condition).then(msg => {
        res.json({ mensagem: msg });
    })
})

app.get('/plus/:id', (req, res) => {
    const id = req.params.id;
    sql.query("UPDATE produto SET quantidade_escolhida = quantidade_escolhida + 1 WHERE id = ?", [id])
        .then(msg => {
            res.json({ mensagem: msg });
        })
        .catch(err => {
            res.status(500).json({ erro: err });
        });
});

app.get('/less/:id', (req, res) => {
    const id = req.params.id;
    sql.query("UPDATE produto SET quantidade_escolhida = quantidade_escolhida - 1 WHERE id = ?", [id])
        .then(msg => {
            res.json({ mensagem: msg });
        })
        .catch(err => {
            res.status(500).json({ erro: err });
        });
});

// Inicia o servidor
app.listen(3000, () => {
    console.log(`Servidor rodando em localhost`);
});