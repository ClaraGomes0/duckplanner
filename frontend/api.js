// Funcao auxiliar para conversar com o back-end (API em /api)
async function api(metodo, url, corpo) {

    const opcoes = { method: metodo, headers: {} };

    if (corpo !== undefined) {
        opcoes.headers["Content-Type"] = "application/json";
        opcoes.body = JSON.stringify(corpo);
    }

    const resposta = await fetch(url, opcoes);

    if (!resposta.ok) {
        let mensagem = "Erro " + resposta.status;

        try {
            const erro = await resposta.json();
            if (erro.message) {
                mensagem = erro.message;
            }
        } catch (e) {
            // resposta sem JSON, mantem a mensagem padrao
        }

        throw new Error(mensagem);
    }

    if (resposta.status === 204) {
        return null;
    }

    return resposta.json();
}
