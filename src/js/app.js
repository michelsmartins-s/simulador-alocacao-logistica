let btnAddContainer = document.getElementById('btn-add-container');
let listaContainers = document.getElementById('lista-containers-form');
let opcoesTipoContainer = '<option value="">Selecione...</option>';

function atualizarNumeracao() {
    let itens = listaContainers.querySelectorAll('.container-item');
    for (let i = 0; i < itens.length; i++) {
        let titulo = itens[i].querySelector('.container-item-header span');
        titulo.textContent = 'Container #' + (i+1);
    }
}

function adicionarContainer() {
    let novo = document.createElement('div');
    novo.className = 'container-item';

    novo.innerHTML =
        '<div class="container-item-header">' +
            '<span>Container</span>' +
            '<button type="button" class="btn btn-remover-container">Remover</button>' +
        '</div>' +
        '<div class="form-grid">' +
            '<div class="form-grupo">' +
                '<label>Nº Container</label>' +
                '<input type="text" name="numero_container">' +
            '</div>' +
            '<div class="form-grupo">' +
                '<label>Tipo</label>' +
                '<select name="tipo_container">' +
                    opcoesTipoContainer +
                '</select>' +
            '</div>' +
            '<div class="form-grupo">' +
                '<label>Data Descarregamento</label>' +
                '<input type="date" name="data_descarregamento">' +
            '</div>' +
            '<div class="form-grupo">' +
                '<label>Lacre (Seal)</label>' +
                '<input type="text" name="lacre_numero">' +
            '</div>' +
            '<div class="form-grupo">' +
                '<label>Produto</label>' +
                '<input type="text" name="produto_descricao">' +
            '</div>' +
            '<div class="form-grupo">' +
                '<label>Qnt. Itens (Cases)</label>' +
                '<input type="number" name="quantidade_itens">' +
            '</div>' +
            '<div class="form-grupo">' +
                '<label>Peso (KG)</label>' +
                '<input type="number" name="peso_container">' +
            '</div>' +
            '<div class="form-grupo">' +
                '<label>Observações (Note)</label>' +
                '<input type="text" name="observacoes">' +
            '</div>' +
            '<div class="form-grupo">' +
                '<label>Fotos da Vistoria</label>' +
                '<input type="file" name="fotos" accept="image/*" multiple>' +
            '</div>' +
        '</div>';

    let btnRemover = novo.querySelector('.btn-remover-container');
    btnRemover.onclick = function () {
        novo.remove();
        atualizarNumeracao();
    };

    listaContainers.appendChild(novo);
    atualizarNumeracao();
}

if (btnAddContainer) {
    btnAddContainer.onclick = adicionarContainer;
}

async function carregarClientes() {
    const clientes = await buscarClientes();
    const selectCliente = document.getElementById('cliente');
    const selectComprador = document.getElementById('comprador');

    for (let i = 0; i < clientes.length; i++) {
        let item = clientes[i];
        let optionHTML = '<option value="' + item.id + '">' + item.nome + '</option>';

        selectCliente.innerHTML += optionHTML;
        selectComprador.innerHTML += optionHTML;
    }
}

async function carregarTiposContainers() {
    const tipos_container = await buscarTiposContainer();
    const selectTipoContainer = document.querySelector('select[name="tipo_container"]');

    opcoesTipoContainer = '<option value="">Selecione...</option>';

    for (let i = 0; i < tipos_container.length; i++) {
        let item = tipos_container[i];
        opcoesTipoContainer += '<option value="' + item.id + '">' + item.nome + '</option>';

        selectTipoContainer.innerHTML = opcoesTipoContainer;
    }
}

const btnsalvarProcesso = document.getElementById('btn-salvar-processo');

async function salvarProcesso() {
    const numeroInspecao = document.getElementById('numero_inspecao').value;
    const cliente = document.getElementById('cliente').value || null;
    const comprador = document.getElementById('comprador').value || null;
    const vessel = document.getElementById('vessel').value;
    const eta = document.getElementById('eta').value || null;
    const booking = document.getElementById('booking').value;
    const portoOrigem = document.getElementById('porto_origem').value;
    const portoDestino = document.getElementById('porto_destino').value;
    const faturaCliente = document.getElementById('fatura_cliente').value;
    const localInspecao = document.getElementById('local_inspecao').value;
    const concluido = document.getElementById('check-concluido').checked;

    if (numeroInspecao === '' ) {
        alert('Por favor, preencha o Nº Relatório');
        return;
    }

    const dadosProcesso = {
        numero_inspecao: numeroInspecao,
        cliente: cliente,
        comprador: comprador,
        vessel: vessel,
        eta: eta,
        booking: booking,
        porto_origem: portoOrigem,
        porto_destino: portoDestino,
        fatura_cliente: faturaCliente,
        local_inspecao: localInspecao,
        status_processo: concluido ? 'concluido' : undefined
    };

    const processoCriado = await inserirProcessos(dadosProcesso);

    if(processoCriado) {
        const listaParaSalvar =  await informacaoesContainersFormulario(processoCriado.id);
        await inserirContainers(listaParaSalvar);
    }
}

if (btnsalvarProcesso) {
    btnsalvarProcesso.onclick = salvarProcesso;
}

async function informacaoesContainersFormulario(processoId) {
    const itens = listaContainers.querySelectorAll('.container-item');
    const containers = [];

    for (let i = 0; i < itens.length; i++) {
        let urlFotos = [];
        const item = itens[i];
        const numeroContainer = item.querySelector('input[name="numero_container"]').value;

        const tipoContainer = item.querySelector('select[name="tipo_container"]').value || null;
        const dataDescarregamento = item.querySelector('input[name="data_descarregamento"]').value || null;
        const lacreNumero = item.querySelector('input[name="lacre_numero"]').value || null;
        const produtoDescricao = item.querySelector('input[name="produto_descricao"]').value || null
        const quantidadeItens = item.querySelector('input[name="quantidade_itens"]').value;
        const pesoItens = item.querySelector('input[name="peso_container"]').value;
        const observacoes = item.querySelector('input[name="observacoes"]').value || null
        const inputFotos = item.querySelector('input[name="fotos"]');

        for(let j = 0; j < inputFotos.files.length; j++) {
            urlFotos.push(await uploadFotoContainer(inputFotos.files[j], processoId));
        }

        containers.push({
        processo_id: processoId,
        numero_container: numeroContainer,
        tipo_container: tipoContainer,
        data_descarregamento: dataDescarregamento,
        lacre_numero: lacreNumero,
        produto_descricao: produtoDescricao,
        quantidade_itens: parseInt(quantidadeItens, 10),
        peso_container: parseFloat(pesoItens),
        observacoes: observacoes,
        fotos_urls: urlFotos
        });
    }

    return containers;
}

async function carregarProcessos () {
    const processos = await buscarProcessos();
    const tbody = document.getElementById('tabela-processos-abertos');

    if (!tbody) return;

    const processosAbertos = [];
    for (let i = 0; i < processos.length; i++) {
        const status = (processos[i].status_processo || '').toLowerCase();
        if (status !== 'concluído' && status !== 'concluido') {
            processosAbertos.push(processos[i]);
        }
    }

    if (processosAbertos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="tabela-vazia">Nenhum processo em aberto encontrado.</td></tr>';
        return;
    }

    tbody.innerHTML = '';

    for (let i = 0; i < processosAbertos.length; i++) {
        const p = processosAbertos[i];

        const nomeCliente = p.cliente_dados ? p.cliente_dados.nome : 'Não informado';
        const navioInfo = p.booking ? `${p.vessel} / ${p.booking}` : p.vessel;
        const qtdContainers = p.containers_processo ? p.containers_processo.length : 0;
        const statusTexto = p.status_processo || 'Inconcluído';

        const tr = document.createElement('tr');
        tr.innerHTML =
            '<td>' + p.numero_inspecao + '</td>' +
            '<td>' + nomeCliente + '</td>' +
            '<td>' + navioInfo + '</td>' +
            '<td>' + qtdContainers + ' container(s)</td>' +
            '<td>' + statusTexto + '</td>' +
            '<td>' +
                '<button type="button" class="btn btn-detalhes" data-id="' + p.id + '">Abrir</button>' +
            '</td>';

        tbody.appendChild(tr);
    }
}

carregarClientes();
carregarTiposContainers();
carregarProcessos();



