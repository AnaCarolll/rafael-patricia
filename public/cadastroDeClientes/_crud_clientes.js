const bt_salvar = document.getElementById('bt_salvar')
const bt_editar = document.getElementById('bt_editar')
const bt_adicionar = document.getElementById('bt_adicionar')
const bt_edit_cancel = document.getElementById('bt_edit_cancel')

const input_id = document.getElementById('input_id')
const input_email = document.getElementById('input_email')
const input_senha = document.getElementById('input_senha')
const input_hierarquia = document.getElementById('input_hierarquia')

const input_checkbox_edit = document.getElementById('input_checkbox_edit')
const input_checkbox_delete = document.getElementById('input_checkbox_delete')

const data = {
    id: 0
}

const baseUrl = {
    tablename: 'cliente',
    delete: 'http://localhost:3000/delete/',
    update: 'http://localhost:3000/update/',
    list: 'http://localhost:3000/lista/',
    add: 'http://localhost:3000/add/',
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
function getObj() {
    const obj = {
        id: input_id.value,
        email: input_email.value,
        senha: input_senha.value,
        hierarquia: input_hierarquia.value,
    }
    return obj
}

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
                input_checkbox_edit.checked = false
                input_checkbox_delete.checked = false
                resolve(data)
                refreshData()
            })
            .catch(error => {
                reject(error)
            });
    })

}
function GET(url) {

    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                resolve(data)
                refreshData()
            })
            .catch(error => {
                reject(error)
            });
    })

}

function record(nome_table, obj) {
    POST(baseUrl.add + nome_table, obj)
    messages.save()
}

function update(id, obj) {
    POST(baseUrl.update + baseUrl.tablename + '/' + id, obj)
        .then(e => {
            // console.log('eita')
            input_checkbox_edit.checked = false
            refreshData()
        })
}

function openEdit(id) {
    data.id = id

    bt_salvar.style.display = 'none'
    bt_editar.removeAttribute('style')


    // aqui
    GET(baseUrl.list + baseUrl.tablename)
        .then(e => {
            const el = e
            input_id.value = e.find(g => g.id == id).id
            input_email.value = e.find(g => g.id == id).email
            input_senha.value = e.find(g => g.id == id).senha
            input_hierarquia.value = e.find(g => g.id == id).hierarquia
        })
}

function del(id) {
    GET(baseUrl.delete + baseUrl.tablename + '/' + id)
    refreshData()
    input_checkbox_delete.checked = false
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

    input_checkbox_edit.checked = false

    //  aqui
    input_id.value = ''
    input_email.value = ''
    input_senha.value = ''
    input_hierarquia.value = ''

    setTimeout(() => {
        input_email.focus()
    }, 500)

    bt_editar.style.display = 'none'
    bt_salvar.removeAttribute('style')
})

function refreshData() {
    fetch(baseUrl.list + baseUrl.tablename)
        .then(e => e.json())
        .then(e => {
            try {
                vue.produtos = e
            } catch (err) { }
        })
}
refreshData()