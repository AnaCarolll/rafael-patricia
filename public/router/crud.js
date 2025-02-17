const bt_salvar = document.getElementById('bt_salvar')
const bt_editar = document.getElementById('bt_editar')
const bt_adicionar = document.getElementById('bt_adicionar')
const bt_edit_cancel = document.getElementById('bt_edit_cancel')
const bt_delete = document.getElementById('bt_delete')

const input_checkbox_edit = document.getElementById('input_checkbox_edit')
const input_checkbox_delete = document.getElementById('input_checkbox_delete')

// inputs
// const input_id = document.getElementById('input_id')
// const input_nome = document.getElementById('input_nome')
// const input_imagemUrl = document.getElementById('input_imagemUrl')
// const input_link = document.getElementById('input_link')
// const input_quantidade = document.getElementById('input_quantidade')


const inputs = Array.from(document.querySelectorAll('.sel'))

// const inputs = [
//     input_nome,
//     input_id,
//     input_link,
//     input_imagemUrl,
//     input_quantidade
// ]
// 'input_produto_id'.match(/_(.+)/)[1]

// localStorage.token


const names = inputs.map(e => e.id.match(/_(.+)/)[1])

const baseUrl = {
    // tablename: 'produto',
    tablename: document.body.id,
    delete: 'http://localhost:3000/delete/',
    update: 'http://localhost:3000/update/'+localStorage.getItem('token')+'/',
    list: 'http://localhost:3000/lista/'+localStorage.getItem('token')+'/',
    add: 'http://localhost:3000/add/',
    produtos_id: 'http://localhost:3000/produtos_id_id/',
}

const data = {
    token: localStorage.getItem('token'),
}

const messages = {
    save() {
        Swal.fire({
            title: "Salvo",
            text: "Editado com sucesso",
            icon: "success"
        });
    }
}

function windowAlert(e) {
    data.id = e
}

function getObj() {
    const names = inputs.map(e => e.id.split('_').slice(1).join("_"))
    const obj = {}
    names.map((e, i) => obj[e] = inputs[i].value)
    return obj
}

const setEditWindow = id => {
    getJson(baseUrl.list + baseUrl.tablename + '/' + id, e => {
        inputs.map((g, i) => g.value = e[names[i]])
        refreshData()
    })
}

function record(nome_table, obj) {
    postJson(baseUrl.add + nome_table, obj, e => messages.save())
}

function update(id, obj) {
    postJson(baseUrl.update + baseUrl.tablename + '/' + id, obj, e => {
        input_checkbox_edit.checked = false
        atualizar_produtos_escolhidos()
        refreshData()
    })
}

function openEdit(id) {
    bt_salvar.style.display = 'none'
    bt_editar.removeAttribute('style')
    setEditWindow(id)
}


async function del(id) {
    const lista = await getJsonW(baseUrl.produtos_id + id)

    console.log(lista)
    // linha importante
    lista.produto_id?.split(',').map(e => less(e))
    // lista.produto_id.split(',').map(e => console.log(e))

    getJson(baseUrl.delete + baseUrl.tablename + '/' + id, e => {
        refreshData()
        input_checkbox_delete.checked = false
    })

}

bt_salvar.addEventListener('click', () => {
    const obj = getObj()
    record(baseUrl.tablename, obj)
    input_checkbox_edit.checked = false
})

bt_editar.addEventListener('click', () => {
    const obj = getObj()
    update(obj.id, obj)
})

bt_adicionar.addEventListener('click', () => {
    getObj()
    inputs.forEach(e => e.value = '')
    input_checkbox_edit.checked = false
    setTimeout(() => { inputs[0].focus() }, 500)
    bt_editar.style.display = 'none'
    bt_salvar.removeAttribute('style')
})

function refreshData() {
    // const id_list = []
    getJson(baseUrl.list + baseUrl.tablename, e => vue.produtos = e)
    // fetch(baseUrl.list + baseUrl.tablename)
    //     .then(e => e.json())
    //     .then(e => {
    //         vue.produtos = e
    //     })
}

//funcs
function getJson(url, callback) {
    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': data.token,
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => callback(data))
        .catch(err => callback({ msg: 'Erro: ' + err.message }))
}

function postJson(url, obj, callback) {
    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': data.token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj),
    })
        .then(response => response.json())
        .then(data => callback(data))
        .catch(err => callback({ msg: 'Erro: ' + err.message }))
}

async function getJsonW(url, callback) {
    return fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': data.token,
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .catch(err => callback({ msg: 'Erro: ' + err.message }))
}

async function postJsonW(url, obj, callback) {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': data.token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj),
    })
        .then(response => response.json())
        .catch(err => callback({ msg: 'Erro: ' + err.message }))
}

// parte 1
atualizar_produtos_escolhidos()

function atualizar_produtos_escolhidos() {

    if (window.location.href.includes('produtos_escolhidos')) {

        const listas = {
            clientes: [],
            produtos: [],
            produtos_escolhidos: []
        }

        getJson(baseUrl.list+'cliente', clientes => listas.clientes = clientes)
        getJson(baseUrl.list+'produto', produtos => listas.produtos = produtos)
        getJson(baseUrl.list+'produtos_escolhidos', produtos_escolhidos => {


            const numbersToImages = arr => arr.split(',').map(e => `<div class='ttip square' msg='${listas.produtos.find(g => g.id == e).nome}'><img src='${listas.produtos.find(g => g.id == e).imagemUrl}'></div>`)
            const numbersToNames = arr => arr.split(',').map(e => listas.produtos.find(g => g.id == e).nome)

            listas.produtos_escolhidos = produtos_escolhidos

            produtos_escolhidos.map(item => {
                item.cliente_email = listas.clientes.find(e => e.id == item.cliente_id).email
                item.images = numbersToImages(item.produto_id).join('')
                item.nomes = numbersToNames(item.produto_id).map(e => `<i>${e}</i>`).join("")
            })

            vue.users = listas.produtos_escolhidos
        })
    }
}

function plus(id) { getJson('http://localhost:3000/plus/' + id) }
function less(id) { getJson('http://localhost:3000/less/' + id) }

refreshData()
