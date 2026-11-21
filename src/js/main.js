async function salvarNovoProcesso() {
    const dadosProcesso = lerDadosProcessoDoFormulario();
    if (!dadosProcesso) return;

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
}

let processoEmEdicaoId = null;

async function abrirProcessoParaEdicao(id) {
    const processo = await buscarProcessoPorId(id);
    if (!processo) return;

    processoEmEdicaoId = processo.id;
    preencherFormularioComProcesso(processo);
}

iniciarSistema();