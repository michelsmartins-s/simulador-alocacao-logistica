async function carregarClientesNoFormulario() {
    const clientes = await buscarClientes();
    const selectCliente = document.getElementById('cliente');
    const selectComprador = document.getElementById('comprador');

    for (let i = 0; i < clientes.length; i++) {
        const item = clientes[i];
        const optionHTML = '<option value="' + item.id + '">' + item.nome + '</option>';

        selectCliente.innerHTML += optionHTML;
        selectComprador.innerHTML += optionHTML;
    }
}

async function carregarTiposContainerNoFormulario() {
    const tiposContainer = await buscarTiposContainer();
    opcoesTipoContainer = '<option value="">Selecione...</option>';

    for (let i = 0; i < tiposContainer.length; i++) {
        const item = tiposContainer[i];
        opcoesTipoContainer += '<option value="' + item.id + '">' + item.nome + '</option>';
    }

    // Atualiza todos os selects de tipo_container que já estejam na tela
    const selects = document.querySelectorAll('select[name="tipo_container"]');
    for (let i = 0; i < selects.length; i++) {
        selects[i].innerHTML = opcoesTipoContainer;
    }
}

function lerDadosProcessoDoFormulario() {
    const numeroInspecao = document.getElementById('numero_inspecao').value;

    if (numeroInspecao === '') {
        alert('Por favor, preencha o Nº Relatório');
        return null;
    }

    const concluido = document.getElementById('check-concluido').checked;

    return {
        numero_inspecao: numeroInspecao,
        cliente: document.getElementById('cliente').value || null,
        comprador: document.getElementById('comprador').value || null,
        vessel: document.getElementById('vessel').value,
        eta: document.getElementById('eta').value || null,
        booking: document.getElementById('booking').value,
        porto_origem: document.getElementById('porto_origem').value,
        porto_destino: document.getElementById('porto_destino').value,
        fatura_cliente: document.getElementById('fatura_cliente').value,
        local_inspecao: document.getElementById('local_inspecao').value,
        status_processo: concluido ? 'concluido' : undefined
    };
}

function limparFormulario() {
    const form = document.getElementById('form-processo');
    if (form) {
        form.reset();
    }

    const checkConcluido = document.getElementById('check-concluido');
    if (checkConcluido) {
        checkConcluido.checked = false;
    }

    resetarContainersFormulario();
    processoEmEdicaoId = null;
}

function preencherFormularioComProcesso(processo) {
    document.getElementById('numero_inspecao').value = processo.numero_inspecao || '';
    document.getElementById('cliente').value = processo.cliente || '';
    document.getElementById('comprador').value = processo.comprador || '';
    document.getElementById('vessel').value = processo.vessel || '';
    document.getElementById('eta').value = processo.eta || '';
    document.getElementById('booking').value = processo.booking || '';
    document.getElementById('porto_origem').value = processo.porto_origem || '';
    document.getElementById('porto_destino').value = processo.porto_destino || '';
    document.getElementById('fatura_cliente').value = processo.fatura_cliente || '';
    document.getElementById('local_inspecao').value = processo.local_inspecao || '';

    const status = (processo.status_processo || '').toLowerCase();
    const checkConcluido = document.getElementById('check-concluido');
    if (checkConcluido) {
        checkConcluido.checked = (status === "concluido" || status === "concluído");
    }

    preencherContainersNoFormulario(processo.containers_processo);
}