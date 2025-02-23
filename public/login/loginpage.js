// elementos
const signin_email = document.querySelector("#signin_email")
const signin_senha = document.querySelector("#signin_senha")

const signup_email = document.querySelector("#signup_email")
const signup_senha = document.querySelector("#signup_senha")

const btn_signin = document.querySelector("#btn_signin")
const btn_signup = document.querySelector("#btn_signup")

function POST(url, obj) {

    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj),
        })
            .then(response => response.json())
            .then(data => {

                resolve(data)
                refreshData()
                return data
            
            })
            .catch(error => {
                reject(error)
            });
    })

}

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

            signin_email.value = signup_email.value
            signin_senha.value = signup_senha.value

            btn_signin.click()

        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

btn_signin.addEventListener('click', e => {

    const obj = {
        email: signin_email.value,
        senha: signin_senha.value
    }

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj),
    })
        .then(response => response.json())
        .then(data => {
           
            console.log(data)
            if(data.token == 'não existe usuário') return
            localStorage.setItem('token', data.token)
            info()
        })
})

btn_signup.addEventListener('click', e => {
    const obj = {
        email: signup_email.value,
        senha: signup_senha.value,
        hierarquia: 0
    }
    record('cliente', obj)
})




function info() {
    const token = localStorage.getItem('token')
    const url = `http://localhost:3000/getinfotoken/${token}`
    fetch(url)
        .then(e => e.json())
        .then(e => {
            if (e.hierarquia == 1) {
                localStorage.setItem('cliente_id', e.id)
                window.location.href = '../listagemDeProdutos/crud_produtos.html'
            } else {
                localStorage.setItem('cliente_id', e.id)
                window.location.href = '../listagemDeProdutos/lista.html'
            }
        })
}
 