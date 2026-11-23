let todosOsClientes = [];

function renderizarTabelaClientes (lista) {
    const tbody = document.getElementById('tabela-clientes');
    if (!tbody) return;

    if (!lista || lista.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="tabela-vazia">Nenhum clientes encontrado.</td></tr>';
        return;
    }

    tbody.innerHTML = '';

    for (let i = 0; i < lista.length; i++) {
        const c = lista[i];
        const tr = document.createElement('tr');
        tr.innerHTML =
            '<td><strong>' + c.nome + '</strong></td>' +
            '<td>' + (c.cnpj_cpf || '-') + '</td>' +
            '<td>' +
                '<button type="button" class="btn btn-remover-container btn-excluir-cliente" data-id="' + c.id + '">Excluir</button>' +
            '</td>';

        tbody.appendChild(tr);
    }

    const botoesExcluir = tbody.querySelectorAll('.btn-excluir-cliente');
    for (let i = 0; i < botoesExcluir.length; i++) {
        botoesExcluir[i].onclick = async function () {
            const id = this.getAttribute('data-id');
            if (!confirm('Deseja excluir este cliente?')) return;
            
            const apagou = await excluirCliente(id);
            if (!apagou) {
                alert('Não foi possível excluir: este cliente pode estar vinculado a um processo.');
                return;
            }

            todosOsClientes = await buscarClientes();
            renderizarTabelaClientes(todosOsClientes);
        }
    }
}

async function salvarNovoCliente() {
    const inputNome = document.getElementById('nome_cliente');
    const inputDoc = document.getElementById('cnpj_cpf');

    const nome = inputNome.value;
    const cnpjCpf = inputDoc.value;

    if (!nome) {
        alert('Por favor, insira todas as informações');
        return;
    }

    const criado = await inserirCliente({
        nome: nome,
        cnpj_cpf: cnpjCpf
    });

    if (criado) {
        document.getElementById('form-cliente').reset();
        todosOsClientes = await buscarClientes();
        renderizarTabelaClientes(todosOsClientes);
    }
}