// produto
const imagemUrl = document.querySelector("#imagemUrl")
const nome = document.querySelector("#nome")
const link = document.querySelector("#link")

// cliente
const email = document.querySelector("#email")
const senha = document.querySelector("#senha")
const hierarquia = document.querySelector("#hierarquia")

// produtos_escolhidos
const cliente_id = document.querySelector("#cliente_id")
const produto_id = document.querySelector("#produto_id")

// botões
const produto = document.querySelector("#produto")
const cliente = document.querySelector("#cliente")
const produtos_escolhidos = document.querySelector("#produtos_escolhidos")

// função enviar
function record(nome_table, obj) {

    fetch('http://localhost:3000/add/' + nome_table, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Sucesso:', data);
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}


// EVENTOS

// produto
produto.addEventListener('click', () => {
    const obj = {
        imagemUrl: imagemUrl.value,
        nome: nome.value,
        link: link.value,
    }

    record('produto', obj)
})
cliente.addEventListener('click', () => {
    const obj = {
        email: email.value,
        senha: senha.value,
        hierarquia: hierarquia.value
    }
    record('cliente', obj)
})

produtos_escolhidos.addEventListener('click', () => {
    const obj = {
        cliente_id: cliente_id.value,
        produto_id: produto_id.value
    }
    record('produtos_escolhidos', obj)
})