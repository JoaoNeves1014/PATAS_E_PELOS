const listaResumo = document.getElementById('listaResumo');
const subtotalTxt = document.getElementById('subtotalTxt');
const freteTxt = document.getElementById('freteTxt');
const totalTxt = document.getElementById('totalTxt');
const btnFinalizar = document.getElementById('btnFinalizar');
const metodoSelect = document.getElementById('metodo');
const extraCartao = document.getElementById('extraCartao');
const formPagamento = document.getElementById('formPagamento');
const areaCheckout = document.getElementById('areaCheckout');
const areaConfirmacao = document.getElementById('areaConfirmacao');

let carrinho = [];
try {
    carrinho = JSON.parse(localStorage.getItem('carrinhoFelinos')) || [];
} catch (e) {
    carrinho = [];
}

function brl(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

let subtotal = 0;

if (carrinho.length === 0) {
    listaResumo.innerHTML = '<p>O teu carrinho está vazio.</p>';
    btnFinalizar.disabled = true;
    btnFinalizar.style.opacity = '0.5';
} else {
    carrinho.forEach(item => {
        const linhaTotal = item.preco * item.qtd;
        subtotal += linhaTotal;

        const div = document.createElement('div');
        div.className = 'pgto-linha';
        div.innerHTML = `<span>${item.qtd}x ${item.nome}</span><strong>${brl(linhaTotal)}</strong>`;
        listaResumo.appendChild(div);
    });
}

const frete = (subtotal === 0 || subtotal >= 200) ? 0 : 19.90;
const total = subtotal + frete;

subtotalTxt.textContent = brl(subtotal);
freteTxt.textContent = frete === 0 ? 'GRÁTIS' : brl(frete);
totalTxt.textContent = brl(total);

metodoSelect.addEventListener('change', () => {
    extraCartao.style.display = metodoSelect.value === 'Cartão de Crédito' ? 'block' : 'none';
});

formPagamento.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('nome').value.trim();
    const endereco = document.getElementById('endereco').value.trim();
    const metodo = metodoSelect.value;
    const numPedido = Math.floor(10000 + Math.random() * 90000);

    document.getElementById('msgPedido').innerHTML = `Obrigado, <strong>${nome}</strong>! O teu pedido <strong>#${numPedido}</strong> foi registado.`;
    document.getElementById('msgDetalhes').innerHTML = `<strong>Entrega:</strong> ${endereco}<br><strong>Pagamento:</strong> ${metodo}<br><strong>Total:</strong> ${brl(total)}`;

    localStorage.removeItem('carrinhoFelinos');
    areaCheckout.style.display = 'none';
    areaConfirmacao.style.display = 'block';
});