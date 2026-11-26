<?php

$servidor = "sql213.infinityfree.com";
$usuario = "if0_43466199";
$senha_bd = "C14LbFg7RKF";
$banco = "if0_43466199_patasepelos_cadastro";

$conexao = mysqli_connect($servidor, $usuario, $senha_bd, $banco);

if(!$conexao) {
    die("Erro de conexão: " . mysqli_connect_error());
}

$nome = $_POST['nome'];
$email = $_POST['email'];
$senha = $_POST['senha'];
$senharep = $_POST['senha-rep'];



$sql = "INSERT INTO cadastro (nome, email, senha, senharep)
VALUES ('$nome', '$email', '$senha', '$senharep' )";

if(mysqli_query($conexao, $sql)) {
    echo "<h3>Aluno cadastrado com sucesso!</h3>";
    echo "<a href='index.html'>Voltar</a>";
} else {

    echo "Erro ao cadastrar: " . mysqli_error($conexao);
}

mysqli_close($conexao);

?>