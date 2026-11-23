// Matérias carregadas do banco de dados (via API)
let materias = [];

// Selecionar elementos
const formulario = document.getElementById("formMateria");
const listaMaterias = document.getElementById("listaMaterias");
const quantidade = document.getElementById("quantidade");

// Buscar matérias no banco de dados
async function carregarMaterias() {

    try {
        materias = await api("GET", "/api/disciplinas");
    } catch (erro) {
        alert("Não foi possível carregar as matérias: " + erro.message);
    }

    mostrarMaterias();
}

// Mostrar matérias na tela
function mostrarMaterias() {

    listaMaterias.innerHTML = "";

    quantidade.textContent = materias.length +
        (materias.length === 1 ? " matéria" : " matérias");

    if (materias.length === 0) {
        listaMaterias.innerHTML =
            '<p class="vazio">Nenhuma matéria adicionada ainda.</p>';
        return;
    }

    materias.forEach(materia => {

        const item = document.createElement("div");
        item.className = "materia-item";

        const informacoes = document.createElement("div");

        const nome = document.createElement("h4");
        nome.textContent = materia.nome;

        const dificuldade = document.createElement("p");
        dificuldade.textContent =
            "Dificuldade: " + materia.dificuldade + "/5";

        informacoes.appendChild(nome);
        informacoes.appendChild(dificuldade);

        const excluir = document.createElement("button");
        excluir.textContent = "Excluir";
        excluir.className = "excluir";

        excluir.addEventListener("click", function() {
            removerMateria(materia.id);
        });

        item.appendChild(informacoes);
        item.appendChild(excluir);

        listaMaterias.appendChild(item);

    });
}

// Adicionar matéria
formulario.addEventListener("submit", async function(event) {

    event.preventDefault();

    const nome = document.getElementById("nomeMateria").value.trim();

    const dificuldade = document.getElementById("dificuldade").value;

    if (!nome || !dificuldade) {
        alert("Preencha todos os campos!");
        return;
    }

    const materiaExistente = materias.some(materia =>
        materia.nome.toLowerCase() === nome.toLowerCase()
    );

    if (materiaExistente) {
        alert("Essa matéria já foi adicionada!");
        return;
    }

    try {
        await api("POST", "/api/disciplinas", {
            nome: nome,
            dificuldade: Number(dificuldade)
        });
    } catch (erro) {
        alert("Não foi possível salvar: " + erro.message);
        return;
    }

    await carregarMaterias();

    formulario.reset();

    alert("Matéria adicionada com sucesso!");

});

// Excluir matéria
async function removerMateria(id) {

    try {
        await api("DELETE", "/api/disciplinas/" + id);
    } catch (erro) {
        alert("Não foi possível excluir: " + erro.message);
        return;
    }

    await carregarMaterias();

}

// Carregar ao abrir a página
carregarMaterias();
