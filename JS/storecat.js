// ===== ELEMENTOS =====
const cards = document.querySelectorAll('.card');
const modal = document.getElementById('modalProduto');
const carrinhoEl = document.getElementById('carrinho');
const overlayCarrinho = document.getElementById('overlayCarrinho');
const listaCarrinho = document.getElementById('listaCarrinho');
const toast = document.getElementById('toast');

let produtoAtual = null;
let quantidade = 1;
let carrinho = [];

// Carrega o carrinho salvo (se existir)
try {
  carrinho = JSON.parse(localStorage.getItem('carrinhoFelinos')) || [];
} catch (e) {
  carrinho = [];
}

// ===== FUNÇÕES AUXILIARES =====
function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function mostrarAviso(texto) {
  toast.textContent = texto;
  toast.classList.add('mostrar');
  setTimeout(() => toast.classList.remove('mostrar'), 2000);
}

function salvarCarrinho() {
  localStorage.setItem('carrinhoFelinos', JSON.stringify(carrinho));
}

// ===== MODAL DO PRODUTO =====
function abrirModal(card) {
  const d = card.dataset;
  produtoAtual = {
    id: d.id,
    nome: d.nome,
    preco: parseFloat(d.preco),
    img: d.img
  };
  quantidade = 1;

  document.getElementById('modalImg').src = d.img;
  document.getElementById('modalImg').alt = d.nome;
  document.getElementById('modalNome').textContent = d.nome;
  document.getElementById('modalPreco').textContent = formatarPreco(produtoAtual.preco);
  document.getElementById('modalDesc').textContent = d.desc;
  document.getElementById('modalSpecs').textContent = d.specs;
  document.getElementById('qtdModal').textContent = quantidade;

  modal.hidden = false;
  document.body.style.overflow = 'hidden';
}

function fecharModal() {
  modal.hidden = true;
  document.body.style.overflow = '';
}

cards.forEach(card => {
  card.querySelector('.btn-comprar').addEventListener('click', () => abrirModal(card));
});

document.getElementById('fecharModal').addEventListener('click', fecharModal);
modal.addEventListener('click', e => {
  if (e.target === modal) fecharModal(); // clicou fora da caixa
});

document.getElementById('mais').addEventListener('click', () => {
  quantidade++;
  document.getElementById('qtdModal').textContent = quantidade;
});
document.getElementById('menos').addEventListener('click', () => {
  if (quantidade > 1) quantidade--;
  document.getElementById('qtdModal').textContent = quantidade;
});

document.getElementById('btnAdicionar').addEventListener('click', () => {
  const existente = carrinho.find(item => item.id === produtoAtual.id);
  if (existente) {
    existente.qtd += quantidade;
  } else {
    carrinho.push({ ...produtoAtual, qtd: quantidade });
  }
  salvarCarrinho();
  atualizarCarrinho();
  fecharModal();
  mostrarAviso('Produto adicionado ao carrinho!');
});

// ===== CARRINHO =====
function atualizarCarrinho() {
  listaCarrinho.innerHTML = '';
  let total = 0;
  let totalItens = 0;

  if (carrinho.length === 0) {
    listaCarrinho.innerHTML = '<li class="carrinho-vazio">Seu carrinho está vazio.</li>';
  }

  carrinho.forEach((item, i) => {
    total += item.preco * item.qtd;
    totalItens += item.qtd;

    const li = document.createElement('li');
    li.innerHTML = `
      <img src="${item.img}" alt="">
      <div class="item-info">
        <strong>${item.nome}</strong><br>
        ${item.qtd} x ${formatarPreco(item.preco)}
      </div>
      <button class="remover" aria-label="Remover item">🗑</button>
    `;
    li.querySelector('.remover').addEventListener('click', () => {
      carrinho.splice(i, 1);
      salvarCarrinho();
      atualizarCarrinho();
    });
    listaCarrinho.appendChild(li);
  });

  document.getElementById('totalCarrinho').textContent = formatarPreco(total);
  document.getElementById('contadorCarrinho').textContent = totalItens;
}

function abrirCarrinho() {
  carrinhoEl.classList.add('aberto');
  carrinhoEl.setAttribute('aria-hidden', 'false');
  overlayCarrinho.hidden = false;
}

function fecharCarrinho() {
  carrinhoEl.classList.remove('aberto');
  carrinhoEl.setAttribute('aria-hidden', 'true');
  overlayCarrinho.hidden = true;
}

document.getElementById('btnCarrinho').addEventListener('click', abrirCarrinho);
document.getElementById('fecharCarrinho').addEventListener('click', fecharCarrinho);
overlayCarrinho.addEventListener('click', fecharCarrinho);

document.getElementById('btnFinalizar').addEventListener('click', () => {
  if (carrinho.length === 0) {
    mostrarAviso('Adicione um produto primeiro.');
    return;
  }
  mostrarAviso('Pedido enviado! (aqui você liga com o pagamento depois)');
  carrinho = [];
  salvarCarrinho();
  atualizarCarrinho();
  fecharCarrinho();
});

// ===== BUSCA =====
function buscar() {
  const termo = document.getElementById('busca').value.toLowerCase().trim();
  let achou = false;

  cards.forEach(card => {
    const combina = card.dataset.nome.toLowerCase().includes(termo);
    card.style.display = combina ? '' : 'none';
    if (combina) achou = true;
  });

  document.getElementById('semResultado').hidden = achou;
}

document.getElementById('btnBuscar').addEventListener('click', buscar);
document.getElementById('busca').addEventListener('input', buscar);

// ===== TECLA ESC FECHA TUDO =====
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    fecharModal();
    fecharCarrinho();
  }
});

// Atualiza o carrinho ao abrir a página
atualizarCarrinho();