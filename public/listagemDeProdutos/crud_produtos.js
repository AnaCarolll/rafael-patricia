const bt_salvar = document.getElementById('bt_salvar')
const bt_editar = document.getElementById('bt_editar')
const bt_adicionar = document.getElementById('bt_adicionar')
const bt_edit_cancel = document.getElementById('bt_edit_cancel')

const input_checkbox_edit = document.getElementById('input_checkbox_edit')
const input_checkbox_delete = document.getElementById('input_checkbox_delete')

// inputs
const input_id = document.getElementById('input_id')
const input_nome = document.getElementById('input_nome')
const input_imagemUrl = document.getElementById('input_imagemUrl')
const input_link = document.getElementById('input_link')
const input_quantidade = document.getElementById('input_quantidade')


const inputs = Array.from(document.querySelectorAll('.sel'))

// const inputs = [
//     input_nome,
//     input_id,
//     input_link,
//     input_imagemUrl,
//     input_quantidade
// ]

const names = inputs.map(e => e.id.split('_')[1])

const baseUrl = {
    tablename: 'produto',
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
    const names = inputs.map(e => e.id.split('_')[1])
    const obj = {}
    names.map((e, i) => obj[e] = inputs[i].value)
    return obj
}

const setEditWindow = id => {
    GET(baseUrl.list + baseUrl.tablename + '/' + id)
        .then(e => {
            inputs.map((g, i) => g.value = e[names[i]]) 
        })
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
                refreshData()
                resolve(data) 
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
            })
            .catch(error => {
                reject(error)
            });
    })
}

function record(nome_table, obj) {
    POST(baseUrl.add + nome_table, obj).then(e => messages.save())
}

function update(id, obj) {
    POST(baseUrl.update + baseUrl.tablename + '/' + id, obj)
    input_checkbox_edit.checked = false
}

function openEdit(id) {
    bt_salvar.style.display = 'none'
    bt_editar.removeAttribute('style')
    setEditWindow(id)
}


function del(id) {
    GET(baseUrl.delete + baseUrl.tablename + '/' + id)
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
    inputs.forEach(e => e.value = '')
    input_checkbox_edit.checked = false
    setTimeout(() => { inputs[0].focus() }, 500)
    bt_editar.style.display = 'none'
    bt_salvar.removeAttribute('style')
})

function refreshData() {
    fetch(baseUrl.list + baseUrl.tablename)
        .then(e => e.json())
        .then(e => {
            vue.produtos = e
        })
}

refreshData()