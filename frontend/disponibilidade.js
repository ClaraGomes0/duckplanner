// Horários carregados do banco de dados (via API)
let disponibilidades = [];

// Selecionar elementos
const formulario = document.getElementById("formDisponibilidade");
const lista = document.getElementById("listaDisponibilidade");
const quantidade = document.getElementById("quantidade");

// Buscar horários no banco de dados
async function carregarDisponibilidades() {

    try {
        disponibilidades = await api("GET", "/api/disponibilidades");
    } catch (erro) {
        alert("Não foi possível carregar os horários: " + erro.message);
    }

    mostrarDisponibilidades();
}

// Mostrar horários
function mostrarDisponibilidades() {

    lista.innerHTML = "";

    quantidade.textContent =
        disponibilidades.length +
        (disponibilidades.length === 1 ? " horário" : " horários");

    if (disponibilidades.length === 0) {
        lista.innerHTML =
            '<p class="vazio">Nenhum horário cadastrado ainda.</p>';
        return;
    }

    disponibilidades.forEach(horario => {

        const item = document.createElement("div");
        item.className = "horario-item";

        const informacoes = document.createElement("div");

        const dia = document.createElement("h4");
        dia.textContent = horario.dia;

        const periodo = document.createElement("p");
        periodo.textContent =
            horario.inicio + " às " + horario.fim;

        informacoes.appendChild(dia);
        informacoes.appendChild(periodo);

        const excluir = document.createElement("button");
        excluir.textContent = "Excluir";
        excluir.className = "excluir";

        excluir.addEventListener("click", function() {
            removerHorario(horario.id);
        });

        item.appendChild(informacoes);
        item.appendChild(excluir);

        lista.appendChild(item);

    });
}

// Adicionar horário
formulario.addEventListener("submit", async function(event) {

    event.preventDefault();

    const dia = document.getElementById("dia").value;
    const inicio = document.getElementById("inicio").value;
    const fim = document.getElementById("fim").value;

    if (!dia || !inicio || !fim) {
        alert("Preencha todos os campos!");
        return;
    }

    if (inicio >= fim) {
        alert("O horário final precisa ser maior que o inicial!");
        return;
    }

    // Verificar se existe conflito no mesmo dia
    const conflito = disponibilidades.some(horario =>
        horario.dia === dia &&
        inicio < horario.fim &&
        fim > horario.inicio
    );

    if (conflito) {
        alert("Esse horário entra em conflito com outro já cadastrado!");
        return;
    }

    try {
        await api("POST", "/api/disponibilidades", {
            dia: dia,
            inicio: inicio,
            fim: fim
        });
    } catch (erro) {
        alert("Não foi possível salvar: " + erro.message);
        return;
    }

    await carregarDisponibilidades();

    formulario.reset();

    alert("Horário adicionado com sucesso!");

});

// Excluir horário
async function removerHorario(id) {

    try {
        await api("DELETE", "/api/disponibilidades/" + id);
    } catch (erro) {
        alert("Não foi possível excluir: " + erro.message);
        return;
    }

    await carregarDisponibilidades();

}

// Carregar ao abrir a página
carregarDisponibilidades();
