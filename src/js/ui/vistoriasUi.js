function formatarStatus(status) {
    const s = (status || '').toLowerCase();
    if (s === 'concluido' || s === 'concluído') {
        return '<span style="color: #1e7e34; font-weight: bold;">Concluído</span>';
    }
    return '<span style="color: #b35900; font-weight: bold;">Inconcluído</span>';
}

function renderizarTabelaVistorias (lista) {
    const tbody = document.getElementById('tabela-todas-vistorias');
    if (!tbody) return;

    if (!lista || lista.length === 0) {
        tbody.innerHTML = '<tr><td> colspan="7" class="tabela-vazia">Nenhuma vistoria encontrada.</td></tr>';
        return;
    }

    tbody.innerHTML = '';

    for (let i = 0; i < lista.length; i++) {
        const p = lista[i];

        const nomeCliente = p.cliente_dados ? p.cliente_dados.nome : 'Não informado';
        const nomeComprador = nomeCliente;
        const navioInfo = p.booking ? `${p.vessel || ''} / ${p.booking}` : (p.vessel || '-');
        const qntdContainers = p.containers_processo ? p.containers_processo.length : 0;
        const tr = document.createElement('tr');
        tr.innerHTML =
            '<td><strong>' + p.numero_inspecao + '</strong></td>' +
            '<td>' + nomeCliente + '</td>' +
            '<td>' + nomeComprador + '</td>' +
            '<td>' + navioInfo + '</td>' +
            '<td>' + qntdContainers + ' container(s)</td>' +
            '<td>' + formatarStatus(p.status_processo) + '</td>' +
            '<td style="display: flex; gap: 6px;">' +
                '<button type="button" class="btn btn-save btn-gerar-pdf" data-id="' + p.id + '">Gerar PDF</button>' +
                '<button type="button" class="btn btn-editar-vistoria" data-id="' + p.id + '">Editar</button>' +
            '</td>';
        

        tbody.appendChild(tr);
    }

    const botoesPdf = tbody.querySelectorAll('.btn-gerar-pdf');
    for (let i = 0; i < botoesPdf.length; i++) {
        botoesPdf[i].onclick = function () {
            const id = this.getAttribute('data-id');
            gerarRelatorioPdf(id);
        }
    }

    const botoesEditar = tbody.querySelectorAll('.btn-editar-vistoria');
    for (let i = 0; i < botoesEditar.length; i++) {
        botoesEditar[i].onclick = function () {
            const id = this.getAttribute('data-id');
            window.location.href = 'index.html?editar=' + id
        }
    }
}

async function iniciarPaginaVistorias() {
    todosOsProcessos = await buscarProcessos();
    renderizarTabelaVistorias(todosOsProcessos);
}

function aplicarFiltrosVistorias() {
    const termo = document.getElementById('busca-geral').value.toLowerCase();
    const statusFiltro = document.getElementById('filtro-status').value;
    const filtrados = [];

    for (let i = 0; i < todosOsProcessos.length; i++) {
        const p = todosOsProcessos[i];

        const ehConcluido = (p.status_processo === 'concluido' || p.status_processo === 'concluído');
        if (statusFiltro === 'concluido' && !ehConcluido) continue;
        if (statusFiltro === 'inconcluido' && ehConcluido) continue;

        if (termo === '') {
            filtrados.push(p);
            continue;
        }

        const nomeCliente = p.cliente_dados ? p.cliente_dados.nome : '';
        const nomeComprador = p.comprador_dados ? p.comprador_dados.nome : '';
        
        let textoBusca = (p.numero_inspecao + ' ' + nomeCliente + ' ' + nomeComprador + ' ' + (p.vessel || '') + ' ' + (p.booking || '')).toLowerCase();

        if (p.containers_processo) {
            for (let j = 0; j < p.containers_processo.length; j++) {
                textoBusca += ' ' + (p.containers_processo[j].numero_container || '').toLowerCase();
            }
        }

        if (textoBusca.includes(termo)) {
            filtrados.push(p);
        }
    }

    renderizarTabelaVistorias(filtrados);
}

async function iniciarPaginaVistorias() {
    todosOsProcessos = await buscarProcessos();
    renderizarTabelaVistorias(todosOsProcessos);

    const inputBusca = document.getElementById('busca-geral');
    if (inputBusca) {
        inputBusca.addEventListener('input', aplicarFiltrosVistorias);
    }

    const selectStatus = document.getElementById('filtro-status');
    if (selectStatus) {
        selectStatus.addEventListener('change', aplicarFiltrosVistorias);
    }
}

iniciarPaginaVistorias();


