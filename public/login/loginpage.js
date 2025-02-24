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

 // Pegando os elementos do DOM corretamente
 const signupEmail = document.getElementById('signup_email');
 const signupSenha = document.getElementById('signup_senha');
 const emailError = document.getElementById('email_error');

 //Verificando se os dados  existem antes de cadastra-los

 if (!signupEmail || !signupSenha || signupEmail.value.trim() === "" || signupSenha.value.trim() === "") {
     console.error("Campos de e-mail ou senha não encontrados ou estão vazios!");
     alert("Erro: Os campos de e-mail e senha são obrigatórios e não podem estar vazios!");
     return;
 }

 const email = signupEmail.value.trim();
 const senha = signupSenha.value.trim();




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
            if(data.token == 'não existe usuário'){
                alert('usuario não existe')
                return
            }
            localStorage.setItem('token', data.token)
            info()
        })
})

btn_signup.addEventListener('click', e => {
    // Pegando os elementos do DOM corretamente
    const signupEmail = document.getElementById('signup_email');
    const signupSenha = document.getElementById('signup_senha');
    const emailError = document.getElementById('email_error');

    //Verificando se os dados  existem antes de cadastra-los

    if (!signupEmail || !signupSenha || signupEmail.value.trim() === "" || signupSenha.value.trim() === "") {
        console.error("Campos de e-mail ou senha não encontrados ou estão vazios!");
        alert("Erro: Os campos de e-mail e senha são obrigatórios e não podem estar vazios!");
        return;
    }

    const email = signupEmail.value.trim();
    const senha = signupSenha.value.trim();


   //Expressão regular para validar o e-mail
    // const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // if (!emailValido.test(email)) {
    //     emailError.style.display = 'block';
    //     alert("Por favor, insira um e-mail válido.");
    //     return;
    // } else {
    //     emailError.style.display = 'none'; // Esconde a mensagem se o e-mail for válido

    // }

    const obj = {
        email: email,
        senha: senha,
        hierarquia: 0
    }

    record('cliente', obj);
});

document.getElementById('signup_email').addEventListener('input', () => {
    const emailError = document.getElementById('email_error');
    emailError.style.display = 'none';
});




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
 