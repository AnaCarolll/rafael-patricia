const token = localStorage.getItem('token')

async function confirmar() {

  // gera objeto
  const dataToken = await getJsonW('http://localhost:3000/getinfotoken/' + token)
  const obj = {
    id: dataToken.id,
    cliente_id: dataToken.id,
    produto_id: Array.from(document.querySelectorAll('input:checked')).map(e => e.id).join(','),
  }

  console.log(obj)

  // diminui os valores escolhidos anteriormente -1
  const produto_id_old = await getJsonW('http://localhost:3000/produtos_id/' + obj.cliente_id)
  if (Object.keys(produto_id_old).includes('erro')) {
    console.log('não apagou')
  } else {
    produto_id_old?.produto_id.split(',').forEach(less)
  }


  // deleta os produtos escolhidos pelo cliente anteriormente
  const deletado = await getJsonW('http://localhost:3000/delete2/produtos_escolhidos/cliente_id=' + obj.id)

  // adiciona dado novo
  const postagem = await postJsonW('http://localhost:3000/add/produtos_escolhidos', obj)
  // console.log(postagem)

  const produto_id = await getJsonW('http://localhost:3000/produtos_id/' + obj.cliente_id)
  produto_id?.produto_id.split(',').forEach(plus)

  itemsMarked(obj.id)

  Swal.fire({
    title: "Perfeito",
    text: "Parabéns pela escolha",
    icon: "success"
  });

  // atualiza produtos
  getJson('http://localhost:3000/lista/produto', e => vue.produtos = e)

  // console.log(promise)
  // console.log(obj)

  // getJson('http://localhost:3000/getinfotoken/' + token, e => {
  //   const obj = {
  //     id: e.id,
  //     cliente_id: e.id,
  //     produto_id: Array.from(document.querySelectorAll('input:checked')).map(e => e.id).join(','),
  //   }
  //   obj.produto_id.split(",").map(num => getJson('http://localhost:3000/plus/' + num))
  //   getJson('http://localhost:3000/delete2/produtos_escolhidos/cliente_id=' + e.id, e => {
  //     postJson('http://localhost:3000/add/produtos_escolhidos', obj, el => {
  //       itemsMarked(obj.id)
  //       getJson('http://localhost:3000/lista/produto', e => { vue.produtos = e })
  //       Swal.fire({
  //         title: "Perfeito",
  //         text: "Parabéns pela escolha",
  //         icon: "success"
  //       });
  //     })
  //   })
  // })
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
  if (e.msg == 'error') window.location.href = './loginpage.html'
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