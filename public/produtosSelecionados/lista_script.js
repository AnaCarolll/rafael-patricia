const token = localStorage.getItem('token')

async function confirmar() {

  const dataToken = await getJsonW('http://localhost:3000/getinfotoken/' + token)
  const obj = {
    id: dataToken.id,
    cliente_id: dataToken.id,
    produto_id: Array.from(document.querySelectorAll('input:checked')).map(e => e.id).join(','),
  }

  console.log(obj)

  const produto_id_old = await getJsonW('http://localhost:3000/produtos_id/' + obj.cliente_id)
  if (Object.keys(produto_id_old).includes('erro')) {
    console.log('não apagou')
  } else {
    produto_id_old?.produto_id.split(',').forEach(less)
  }


  const deletado = await getJsonW('http://localhost:3000/delete2/produtos_escolhidos/cliente_id=' + obj.id)

  const postagem = await postJsonW('http://localhost:3000/add/produtos_escolhidos', obj)

  const produto_id = await getJsonW('http://localhost:3000/produtos_id/' + obj.cliente_id)
  produto_id?.produto_id.split(',').forEach(plus)

  itemsMarked(obj.id)

  Swal.fire({
    title: "Perfeito",
    text: "Parabéns pela escolha",
    icon: "success"
  });

  getJson('http://localhost:3000/lista/produto', e => vue.produtos = e)

}

const data = { token: localStorage.getItem('token') }

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

// atualiza produtos
getJson('http://localhost:3000/lista/produto', e => vue.produtos = e)

getJson('http://localhost:3000/getinfotoken/' + token, e => {
  if (e.msg == 'error') window.location.href = '/login/loginpage.html'
  itemsMarked(e.id)
})

function itemsMarked(id) {
  getJson('http://localhost:3000/produtos_id/' + id, e => {
    console.log(e)
    const lista = e.produto_id?.split(',')
    Array.from(document.querySelectorAll('input')).filter(e => lista?.includes(e.id)).map(e => e.checked = true)
  })
}

function plus(id) { getJson('http://localhost:3000/plus/' + id) }
function less(id) { getJson('http://localhost:3000/less/' + id) }


function itemsMarked(id) {
  getJson('http://localhost:3000/produtos_id/' + id, e => {
      const lista = e.produto_id?.split(',')
      Array.from(document.querySelectorAll('input')).filter(e => lista?.includes(e.id)).map(e => e.checked = true)
  })
}

document.addEventListener("DOMContentLoaded", function() {
  const btnVerPresentes = document.createElement("button")
  btnVerPresentes.innerText = "Ver presentes"
  btnVerPresentes.style.cssText = "position: fixed; top: 20px; right: 20px; padding: 10px 15px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;"
  document.body.appendChild(btnVerPresentes)

  btnVerPresentes.addEventListener("click", async function() {
      const dataToken = await getJsonW('http://localhost:3000/getinfotoken/' + token)
      const produtosEscolhidos = await getJsonW('http://localhost:3000/produtos_id/' + dataToken.id)

      if (!produtosEscolhidos.produto_id) {
          Swal.fire("Nenhum presente escolhido", "Você ainda não selecionou nenhum presente.", "info")
          return
      }

      const produtosDetalhes = await getJsonW('http://localhost:3000/lista/produto')
      const listaPresentes = produtosEscolhidos.produto_id.split(',').map(id => {
          const produto = produtosDetalhes.find(p => p.id == id)
          return produto ? `<p><img src="${produto.imagemUrl}" width="50"> ${produto.nome} - <a href="${produto.link}" target="_blank">Ver produto</a></p>` : ''
      }).join('')

      Swal.fire({
          title: "Seus presentes escolhidos",
          html: `<div style="text-align:left;">${listaPresentes}</div>`,
          icon: "info",
          confirmButtonText: "Fechar"
      })
  })
})
