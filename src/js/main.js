async function salvarNovoProcesso() {
    const dadosProcesso = lerDadosProcessoDoFormulario();
    if (!dadosProcesso) return;

    if (processoEmEdicaoId) {
        if (!dadosProcesso.status_processo) {
            dadosProcesso.status_processo = 'inconcluído';
        }

        const processoAtualizado = await atualizarProcesso(processoEmEdicaoId, dadosProcesso);
        if (processoAtualizado) {
            await deletarContainersDoProcesso(processoEmEdicaoId);
            const listaParaSalvar = await lerContainersDoFormulario(processoEmEdicaoId);
            await inserirContainers(listaParaSalvar);

            limparFormulario();
            await carregarTabelaProcessos();
        }
        return;
    }

    const processoCriado = await inserirProcessos(dadosProcesso);

    if (processoCriado) {
        const listaParaSalvar = await lerContainersDoFormulario(processoCriado.id);
        await inserirContainers(listaParaSalvar);

        limparFormulario();
        await carregarTabelaProcessos();
    }
}

function configurarEventos() {
    const btnAddContainer = document.getElementById('btn-add-container');
    if (btnAddContainer) {
        btnAddContainer.onclick = adicionarContainer;
    }

    const btnSalvarProcesso = document.getElementById('btn-salvar-processo');
    if (btnSalvarProcesso) {
        btnSalvarProcesso.onclick = salvarNovoProcesso;
    }
}

async function iniciarSistema() {
    configurarEventos();
    await carregarClientesNoFormulario();
    await carregarTiposContainerNoFormulario();
    await carregarTabelaProcessos();

    const parametros = new URLSearchParams(window.location.search);
    const idEdicao = parametros.get('editar');
    if (idEdicao) {
        await abrirProcessoParaEdicao(idEdicao);
    }
}

let processoEmEdicaoId = null;

async function abrirProcessoParaEdicao(id) {
    const processo = await buscarProcessoPorId(id);
    if (!processo) return;

    processoEmEdicaoId = processo.id;
    preencherFormularioComProcesso(processo);
}

iniciarSistema();