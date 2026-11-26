<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ../html/pagamento.html');
    exit;
}

$nome = htmlspecialchars(trim($_POST['nome'] ?? 'Cliente'));
$endereco = htmlspecialchars(trim($_POST['endereco'] ?? ''));
$metodo = htmlspecialchars($_POST['metodo_pagamento'] ?? 'PIX');
$total = floatval($_POST['total_valor'] ?? 0);
$itens = json_decode($_POST['carrinho_json'] ?? '[]', true) ?: [];
$numeroPedido = rand(10000, 99999);
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Pedido Confirmado | Patas &amp; Pelos</title>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body style="padding: 30px; max-width: 720px; margin: auto;">

    <div class="card" style="gap: 12px;">
        <h1>Pedido #<?= $numeroPedido ?> confirmado!</h1>
        <p>Obrigado, <strong><?= $nome ?></strong>!</p>
        <p><strong>Endereço:</strong> <?= $endereco ?></p>
        <p><strong>Pagamento:</strong> <?= $metodo ?></p>

        <?php if (!empty($itens)): ?>
            <hr>
            <h3>Itens:</h3>
            <?php foreach ($itens as $item): ?>
                <p><?= intval($item['qtd']) ?>x <?= htmlspecialchars($item['nome']) ?></p>
            <?php endforeach; ?>
        <?php endif; ?>

        <p class="preco" style="margin-top: 10px;">
            Total pago: R$ <?= number_format($total, 2, ',', '.') ?>
        </p>

        <a href="../html/index.html" class="btn" style="text-align: center; text-decoration: none; margin-top: 12px;">
            Voltar para a loja
        </a>
    </div>

    <script>
        localStorage.removeItem('carrinhoFelinos');
    </script>

</body>
</html>