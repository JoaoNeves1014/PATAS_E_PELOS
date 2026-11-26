// ELEMENTOS PRINCIPAIS DA TELA
const cards = document.querySelectorAll('.card');
const modal = document.getElementById('modalProduto');
const overlayCarrinho = document.getElementById('overlayCarrinho');
const listaCarrinho = document.getElementById('listaCarrinho');
const toast = document.getElementById('toast');

const btnCarrinho = document.getElementById('btn-carrinho');
const fecharCarrinho = document.getElementById('fecharCarrinho');
const totalCarrinhoEl = document.getElementById('totalCarrinho');
const btnIrPagamento = document.getElementById('btnIrPagamento');

let produtoAtual = null;
let quantidade = 1;
let carrinho = [];

// Carrega carrinho salvo no navegador
try {
  carrinho = JSON.parse(localStorage.getItem('carrinhoFelinos')) || [];
} catch (e) {
  carrinho = [];
}

// Formata número para moeda (R$)
function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Mostra mensagem rápida no canto da tela
function mostrarAviso(texto) {
  toast.textContent = texto;
  toast.classList.add('mostrar');
  setTimeout(() => toast.classList.remove('mostrar'), 2000);
}

// Salva carrinho no navegador
function salvarCarrinho() {
  localStorage.setItem('carrinhoFelinos', JSON.stringify(carrinho));
}

// MODAL DO PRODUTO: abre com os dados do card clicado
function abrirModal(card) {
  const d = card.dataset;
  const nome = card.querySelector('h2').textContent;
  const img = card.querySelector('img').getAttribute('src');

  produtoAtual = {
    id: d.id,
    nome: nome,
    preco: parseFloat(d.preco),
    img: img
  };
  quantidade = 1;

  document.getElementById('modalImg').src = img;
  document.getElementById('modalImg').alt = nome;
  document.getElementById('modalNome').textContent = nome;
  document.getElementById('modalPreco').textContent = formatarPreco(produtoAtual.preco);
  document.getElementById('modalDesc').textContent = d.desc || 'Produto de qualidade para o seu pet.';
  document.getElementById('modalSpecs').textContent = d.specs || ('Categoria: ' + d.categoria);
  document.getElementById('qtdModal').textContent = quantidade;

  modal.hidden = false;
  document.body.style.overflow = 'hidden';
}

// MODAL DO PRODUTO: fecha modal
function fecharModal() {
  modal.hidden = true;
  document.body.style.overflow = '';
}

cards.forEach(card => {
  card.querySelector('.btn').addEventListener('click', () => abrirModal(card));
});

document.getElementById('fecharModal').addEventListener('click', fecharModal);
modal.addEventListener('click', e => {
  if (e.target === modal) fecharModal();
});

// MODAL DO PRODUTO: aumenta e diminui quantidade
document.getElementById('mais').addEventListener('click', () => {
  quantidade++;
  document.getElementById('qtdModal').textContent = quantidade;
});

document.getElementById('menos').addEventListener('click', () => {
  if (quantidade > 1) quantidade--;
  document.getElementById('qtdModal').textContent = quantidade;
});

// MODAL DO PRODUTO: adiciona item no carrinho
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

// CARRINHO: atualiza contador, itens e subtotal
function atualizarCarrinho() {
  const totalItens = carrinho.reduce((soma, item) => soma + item.qtd, 0);
  btnCarrinho.textContent = `🛒 (${totalItens})`;

  listaCarrinho.innerHTML = '';
  let valorTotal = 0;

  if (carrinho.length === 0) {
    listaCarrinho.innerHTML = '<p style="text-align:center; color:#666; padding:28px 0;">Sua sacola está vazia.</p>';
    btnIrPagamento.disabled = true;
    btnIrPagamento.style.opacity = '0.5';
  } else {
    btnIrPagamento.disabled = false;
    btnIrPagamento.style.opacity = '1';

    carrinho.forEach((item, index) => {
      valorTotal += item.preco * item.qtd;

      const div = document.createElement('div');
      div.className = 'item-sacola';
      div.innerHTML = `
        <div class="item-sacola-esq">
          <img src="${item.img}" alt="${item.nome}">
          <div style="min-width:0;">
            <div class="item-sacola-nome">${item.nome}</div>
            <div class="item-sacola-preco">${formatarPreco(item.preco * item.qtd)}</div>
          </div>
        </div>
        <div class="item-sacola-dir">
          <button type="button" onclick="alterarQtd(${index}, -1)">−</button>
          <span>${item.qtd}</span>
          <button type="button" onclick="alterarQtd(${index}, 1)">+</button>
          <button type="button" class="btn-lixeira" onclick="removerItem(${index})">✕</button>
        </div>
      `;
      listaCarrinho.appendChild(div);
    });
  }

  totalCarrinhoEl.textContent = formatarPreco(valorTotal);
}

// CARRINHO: altera quantidade de um item
window.alterarQtd = function(index, delta) {
  carrinho[index].qtd += delta;
  if (carrinho[index].qtd <= 0) {
    carrinho.splice(index, 1);
  }
  salvarCarrinho();
  atualizarCarrinho();
};

// CARRINHO: remove um item
window.removerItem = function(index) {
  carrinho.splice(index, 1);
  salvarCarrinho();
  atualizarCarrinho();
};

// CARRINHO: abre e fecha janela do carrinho
btnCarrinho.addEventListener('click', () => {
  overlayCarrinho.hidden = false;
  document.body.style.overflow = 'hidden';
});

fecharCarrinho.addEventListener('click', () => {
  overlayCarrinho.hidden = true;
  document.body.style.overflow = '';
});

overlayCarrinho.addEventListener('click', (e) => {
  if (e.target === overlayCarrinho) {
    overlayCarrinho.hidden = true;
    document.body.style.overflow = '';
  }
});

// LOGIN / CADASTRO: troca botões pelo nome da pessoa quando logada
const areaGuest = document.getElementById('areaGuest');
const areaUsuario = document.getElementById('areaUsuario');
const nomeUsuarioEl = document.getElementById('nomeUsuario');
const btnSair = document.getElementById('btnSair');

function pegarNomeUsuario() {
  const chavesObjeto = ['usuarioLogado', 'usuario', 'user', 'clienteLogado'];
  for (const chave of chavesObjeto) {
    const raw = localStorage.getItem(chave);
    if (!raw) continue;
    try {
      const obj = JSON.parse(raw);
      if (obj && (obj.nome || obj.name || obj.usuario)) {
        return obj.nome || obj.name || obj.usuario;
      }
    } catch (_) {
      if (raw.trim()) return raw.trim();
    }
  }

  for (const chaveSimples of ['nomeUsuario', 'usuarioNome', 'nome']) {
    const val = localStorage.getItem(chaveSimples);
    if (val && val.trim()) return val.trim();
  }

  return '';
}

function atualizarEstadoUsuario() {
  const nome = pegarNomeUsuario();
  if (nome) {
    nomeUsuarioEl.textContent = `Olá, ${nome}`;
    areaGuest.hidden = true;
    areaUsuario.hidden = false;
  } else {
    nomeUsuarioEl.textContent = '';
    areaGuest.hidden = false;
    areaUsuario.hidden = true;
  }
}

if (btnSair) {
  btnSair.addEventListener('click', () => {
    ['usuarioLogado', 'usuario', 'user', 'clienteLogado', 'nomeUsuario', 'usuarioNome', 'nome']
      .forEach(k => localStorage.removeItem(k));
    atualizarEstadoUsuario();
  });
}

// Inicia carrinho e estado do usuário ao abrir a página
atualizarCarrinho();
atualizarEstadoUsuario();