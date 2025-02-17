Array.from(document.querySelectorAll('.oMSmr0')).map(e=>{
    const img = e.querySelector('img').src
    const a = e.querySelector('a').href
    const txt = e.querySelector('img').alt
    console.log(img)
    console.log(a)
    console.log(txt)
    obj = {
        imagemUrl: img,
        nome: txt,
        link: a,
        quantidade_disponivel: 3,
        quantidade_escolhida: 0,
    }
  
    add(obj)
  })
  
  function add(obj){
    fetch("http://localhost:3000/add/produto", {
      "headers": {
        "accept": "*/*",
        "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7,es;q=0.6,it;q=0.5",
        "content-type": "application/json",
        "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\", \"Google Chrome\";v=\"132\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site"
      },
      "referrer": "http://127.0.0.1:3000/",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": JSON.stringify(obj),
      "method": "POST",
      "mode": "cors",
      "credentials": "omit"
    });
  }