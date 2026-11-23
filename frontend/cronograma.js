// Dados carregados do banco de dados (via API)
let materias = [];
let disponibilidades = [];
let cronogramaSalvo = [];

// Buscar matérias e horários no banco de dados
async function carregarDados() {
    materias = await api("GET", "/api/disciplinas");
    disponibilidades = await api("GET", "/api/disponibilidades");
}

// Selecionar elementos da página
const btnGerar = document.getElementById("btnGerar");
const listaCronograma = document.getElementById("listaCronograma");
const mensagem = document.getElementById("mensagem");

// Ordem dos dias da semana
const ordemDias = [
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
    "Domingo"
];

// Atualizar informações
function atualizarInformacoes() {

    document.getElementById("totalMaterias").textContent =
        materias.length;

    document.getElementById("totalHorarios").textContent =
        disponibilidades.length;

    document.getElementById("totalEstudos").textContent =
        cronogramaSalvo.length;
}

// Converter horário em minutos
function converterMinutos(horario) {

    const partes = horario.split(":");

    return Number(partes[0]) * 60 + Number(partes[1]);

}

// Converter minutos em horário
function converterHorario(minutos) {

    const horas = Math.floor(minutos / 60);
    const minutosRestantes = minutos % 60;

    return (
        String(horas).padStart(2, "0") +
        ":" +
        String(minutosRestantes).padStart(2, "0")
    );

}

// Escolher matéria considerando dificuldade e quantidade de estudos
let quantidadeEstudos = {};
let ultimaMateria = null;

function escolherMateria() {

    let disponiveis = materias.filter(materia =>
        materia.nome !== ultimaMateria
    );

    if (disponiveis.length === 0) {
        disponiveis = materias;
    }

    disponiveis.sort((a, b) => {

        const prioridadeA =
            Number(a.dificuldade) /
            (1 + quantidadeEstudos[a.nome]);

        const prioridadeB =
            Number(b.dificuldade) /
            (1 + quantidadeEstudos[b.nome]);

        return prioridadeB - prioridadeA;

    });

    const escolhida = disponiveis[0];

    quantidadeEstudos[escolhida.nome] =
        (quantidadeEstudos[escolhida.nome] || 0) + 1;

    ultimaMateria = escolhida.nome;

    return escolhida;

}

// Gerar cronograma
async function gerarCronograma() {

    mensagem.className = "mensagem";
    mensagem.textContent = "";

    // Atualizar dados com o que está no banco
    try {
        await carregarDados();
    } catch (erro) {
        mensagem.textContent =
            "Não foi possível carregar seus dados: " + erro.message;
        mensagem.className = "mensagem erro";
        return;
    }

    // Verificar se existem matérias
    if (materias.length === 0) {

        mensagem.textContent =
            "Você precisa cadastrar pelo menos uma matéria antes de gerar o cronograma.";

        mensagem.className = "mensagem erro";

        return;
    }

    // Verificar se existem horários
    if (disponibilidades.length === 0) {

        mensagem.textContent =
            "Você precisa cadastrar seus horários disponíveis antes de continuar.";

        mensagem.className = "mensagem erro";

        return;
    }

    // Organizar matérias por dificuldade
    quantidadeEstudos = {};
    ultimaMateria = null;

    materias.forEach(materia => {
        quantidadeEstudos[materia.nome] = 0;
    });

    // Organizar os horários por dia da semana
    const horariosOrganizados = [...disponibilidades].sort((a, b) => {

        return ordemDias.indexOf(a.dia) -
            ordemDias.indexOf(b.dia);

    });

    let cronograma = [];

    // Percorrer cada horário disponível
    horariosOrganizados.forEach(horario => {

        const inicio = converterMinutos(horario.inicio);
        const fim = converterMinutos(horario.fim);

        let horarioAtual = inicio;

        // Cada sessão terá 1 hora
        // Entre sessões haverá 15 minutos de intervalo
        while (horarioAtual + 60 <= fim) {

            const materia = escolherMateria();

            const bloco = {
                dia: horario.dia,
                materia: materia.nome,
                dificuldade: materia.dificuldade,
                inicio: converterHorario(horarioAtual),
                fim: converterHorario(horarioAtual + 60)
            };

            cronograma.push(bloco);

            // Próxima sessão começa após 15 minutos de descanso
            horarioAtual += 75;

        }

    });

    if (cronograma.length === 0) {

        mensagem.textContent =
            "Seus horários são muito curtos. Cadastre pelo menos 1 hora disponível para estudar.";

        mensagem.className = "mensagem erro";

        return;
    }

    // Salvar cronograma no banco de dados
    try {
        cronogramaSalvo = await api("PUT", "/api/sessoes", cronograma);
    } catch (erro) {
        mensagem.textContent =
            "Não foi possível salvar o cronograma: " + erro.message;
        mensagem.className = "mensagem erro";
        return;
    }

    // Mostrar resultado
    mostrarCronograma(cronogramaSalvo);

    mensagem.textContent =
        "Seu cronograma foi gerado com sucesso! Bons estudos!";

    mensagem.className = "mensagem sucesso";

    atualizarInformacoes();

}

// Mostrar cronograma na tela
function mostrarCronograma(cronograma) {

    listaCronograma.innerHTML = "";

    ordemDias.forEach(dia => {

        const horariosDoDia = cronograma.filter(
            horario => horario.dia === dia
        );

        if (horariosDoDia.length === 0) {
            return;
        }

        const caixaDia = document.createElement("div");
        caixaDia.className = "dia";

        const titulo = document.createElement("h4");
        titulo.textContent = dia;

        caixaDia.appendChild(titulo);

        horariosDoDia.forEach((horario, index) => {

            // Mostrar intervalo entre sessões
            if (index > 0) {

                const anterior = horariosDoDia[index - 1];

                const intervalo = document.createElement("div");
                intervalo.className = "intervalo";

                intervalo.textContent =
                    "☕ Intervalo de 15 minutos";

                caixaDia.appendChild(intervalo);

            }

            const bloco = document.createElement("div");
            bloco.className = "bloco";

            const informacoes = document.createElement("div");

            const nome = document.createElement("h5");
            nome.textContent = "📚 " + horario.materia;

            const dificuldade = document.createElement("p");
            dificuldade.textContent =
                "Dificuldade: " + horario.dificuldade + "/5";

            informacoes.appendChild(nome);
            informacoes.appendChild(dificuldade);

            const tempo = document.createElement("span");
            tempo.className = "horario";

            tempo.textContent =
                horario.inicio + " - " + horario.fim;

            bloco.appendChild(informacoes);
            bloco.appendChild(tempo);

            caixaDia.appendChild(bloco);

        });

        listaCronograma.appendChild(caixaDia);

    });

}

// Botão para gerar cronograma
btnGerar.addEventListener("click", gerarCronograma);

// Recuperar cronograma salvo ao abrir a página
async function carregarCronograma() {

    try {
        await carregarDados();
        cronogramaSalvo = await api("GET", "/api/sessoes");
    } catch (erro) {
        mensagem.textContent =
            "Não foi possível carregar seus dados: " + erro.message;
        mensagem.className = "mensagem erro";
        return;
    }

    if (cronogramaSalvo.length > 0) {

        mostrarCronograma(cronogramaSalvo);

    }

    atualizarInformacoes();

}

// Executar ao abrir a página
carregarCronograma();
