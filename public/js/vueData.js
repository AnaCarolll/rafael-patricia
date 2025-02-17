const vue = new Vue({
    el: '#app',
    data: {

        allProducts:[],

        produtos: [
            { id: 1, nome: "Produto A", preco: 100 },
            { id: 2, nome: "Produto B", preco: 150 },
            { id: 3, nome: "Produto C", preco: 200 }
        ],

        nome:'testando',

        users: [],
        
        temp: {
            id: 'gato',
            nome: 'cachorro',
            imagemUrl: 'gato'
        }
    }
});

