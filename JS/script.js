const campoBusca = document.getElementById('campo-busca');
const formBusca = document.getElementById('form-busca');
const btnCarrinho = document.getElementById('btn-carrinho');
const cards = document.querySelectorAll('.card');

// Lista de produtos do carrinho
let carrinho = [];


/* ---------- BUSCA ---------- */

function buscar() {
    const termo = campoBusca.value.toLowerCase();

    cards.forEach(function (card) {
        const nome = card.querySelector('h2').textContent.toLowerCase();
        const categoria = card.dataset.categoria;

        // mostra o card se o nome ou a categoria tiver o texto digitado
        card.hidden = !(nome.includes(termo) || categoria.includes(termo));
    });
}

campoBusca.addEventListener('input', buscar);

formBusca.addEventListener('submit', function (evento) {
    evento.preventDefault(); // não deixa a página recarregar
    buscar();
});


/* ---------- CARRINHO ---------- */

// Cada botão "Comprar" adiciona o produto no carrinho
cards.forEach(function (card) {
    const botao = card.querySelector('.btn');

    botao.addEventListener('click', function () {
        const produto = {
            nome: card.querySelector('h2').textContent,
            preco: Number(card.dataset.preco)
        };

        carrinho.push(produto);
        btnCarrinho.textContent = 'Carrinho (' + carrinho.length + ')';
    });
});

// Clicar no botão do carrinho mostra os itens e o total
btnCarrinho.addEventListener('click', function () {
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio.');
        return;
    }

    let texto = '';
    let total = 0;

    carrinho.forEach(function (item) {
        texto += item.nome + ' - R$ ' + item.preco.toFixed(2).replace('.', ',') + '\n';
        total += item.preco;
    });

    alert(texto + '\nTotal: R$ ' + total.toFixed(2).replace('.', ','));
});