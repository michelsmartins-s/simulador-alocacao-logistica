async function carregarTabelaProcessos() {
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

    const botoesAbrir = tbody.querySelectorAll('.btn-detalhes');
    for (let i = 0; i < botoesAbrir.length; i++) {
        botoesAbrir[i].onclick = function () {
            const id = this.getAttribute('data-id');
            abrirProcessoParaEdicao(id)
        }
    }
}

