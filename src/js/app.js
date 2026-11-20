let btnAddContainer = document.getElementById('btn-add-container');
let listaContainers = document.getElementById('lista-containers-form');

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
                    '<option value="">Selecione...</option>' +
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
                '<input type="file" name="fotos" accept="image/*" capture="environment" multiple>' +
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

