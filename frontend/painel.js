// Recuperar o nome do usuário cadastrado
const nome = localStorage.getItem("nomeUsuario");

// Mostrar o nome no painel
if (nome) {
    document.getElementById("nomeUsuario").textContent = nome;
} else {
    document.getElementById("nomeUsuario").textContent = "Estudante";
}

// Sair da conta
function sair() {
    window.location.href = "login.html";
}
