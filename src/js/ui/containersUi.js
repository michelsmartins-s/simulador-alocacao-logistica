const listaContainers = document.getElementById('lista-containers-form');
let opcoesTipoContainer = '<option value="">Selecione...</option>';

function atualizarNumeracaoContainers() {
    if (!listaContainers) return;
    const itens = listaContainers.querySelectorAll('.container-item');
    for (let i = 0; i < itens.length; i++) {
        const titulo = itens[i].querySelector('.container-item-header span');
        titulo.textContent = 'Container #' + (i + 1);

         const btnRemover = itens[i].querySelector('.btn-remover-container');
        if (btnRemover) {
            btnRemover.style.display = (i === 0) ? 'none' : 'inline-block';
        }
    }
}

function adicionarContainer() {
    if (!listaContainers) return;

    const novo = document.createElement('div');
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

    const btnRemover = novo.querySelector('.btn-remover-container');
    btnRemover.onclick = function () {
        novo.remove();
        atualizarNumeracaoContainers();
    };

    listaContainers.appendChild(novo);
    atualizarNumeracaoContainers();
}

async function lerContainersDoFormulario(processoId) {
    const itens = listaContainers.querySelectorAll('.container-item');
    const containers = [];

    for (let i = 0; i < itens.length; i++) {
        const item = itens[i];
        const numeroContainer = item.querySelector('input[name="numero_container"]').value;
        const tipoContainer = item.querySelector('select[name="tipo_container"]').value || null;
        const dataDescarregamento = item.querySelector('input[name="data_descarregamento"]').value || null;
        const lacreNumero = item.querySelector('input[name="lacre_numero"]').value || null;
        const produtoDescricao = item.querySelector('input[name="produto_descricao"]').value || null;
        const quantidadeItens = item.querySelector('input[name="quantidade_itens"]').value;
        const pesoItens = item.querySelector('input[name="peso_container"]').value;
        const observacoes = item.querySelector('input[name="observacoes"]').value || null;
        const inputFotos = item.querySelector('input[name="fotos"]');

        const fotosAntigas = item.dataset.fotosExistentes ? JSON.parse(item.dataset.fotosExistentes) : [];
        const urlFotos = [...fotosAntigas];

        for (let j = 0; j < inputFotos.files.length; j++) {
            const novaUrl = await uploadFotoContainer(inputFotos.files[j], processoId);
            if (novaUrl) urlFotos.push(novaUrl);
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

function resetarContainersFormulario() {
    if (!listaContainers) return;
    listaContainers.innerHTML = '';
    adicionarContainer();
}

function preencherContainersNoFormulario(containers) {
    if (!listaContainers) return;
    listaContainers.innerHTML = '';

    if (!containers || containers.length === 0) {
        adicionarContainer();
        return;
    }

    for (let i = 0; i < containers.length; i++) {
        const c = containers[i];
        adicionarContainer();

        const itens = listaContainers.querySelectorAll('.container-item');
        const cardAtual = itens[itens.length - 1];

        cardAtual.querySelector('input[name="numero_container"]').value = c.numero_container || '';
        cardAtual.querySelector('select[name="tipo_container"]').value = c.tipo_container || '';
        cardAtual.querySelector('input[name="data_descarregamento"]').value = c.data_descarregamento || '';
        cardAtual.querySelector('input[name="lacre_numero"]').value = c.lacre_numero || '';
        cardAtual.querySelector('input[name="produto_descricao"]').value = c.produto_descricao || '';
        cardAtual.querySelector('input[name="quantidade_itens"]').value = (c.quantidade_itens !== null) ? c.quantidade_itens : '';
        cardAtual.querySelector('input[name="peso_container"]').value = (c.peso_container !== null) ? c.peso_container : '';
        cardAtual.querySelector('input[name="observacoes"]').value = c.observacoes || '';

        if (c.fotos_urls && c.fotos_urls.length > 0) {
        const divFotos = document.createElement('div');
        divFotos.className = 'fotos-salvas';
        divFotos.style.marginTop = '8px';

        let linksHTML = '<small>Fotos salvas: </small>';
        for (let j = 0; j < c.fotos_urls.length; j++) {
            linksHTML += `<a href="${c.fotos_urls[j]}" target="_blank" style="margin-right: 8px;">Foto ${j + 1}</a>`;
        }
        cardAtual.dataset.fotosExistentes = JSON.stringify(c.fotos_urls || []);
        divFotos.innerHTML = linksHTML;
        cardAtual.appendChild(divFotos);
    }
    }
}

