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
            '<td>' + qtdContainers + ' container(s)</td>' +
            '<td>' + formatarStatus(p.status_processo) + '</td>' +
            '<td style="display: flex; gap: 6px;">' +
                '<button type="button" class="btn btn-save btn-gerar-pdf" data-id="' + p.id + '">Gerar PDF</button>' +
                '<button type="button" class="btn btn-editar-vistoria" data-id="' + p.id + '">Editar</button>' +
            '</td>';
        

        tbody.appendChild(tr);
    }
}