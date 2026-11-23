// Funções que interagem diretamente com o banco de dados

async function buscarClientes() {
    const { data, error } = await db
        .from('clientes')
        .select('id, nome, cnpj_cpf')
        .order('nome');

    if(error) {
        console.error('Erro ao buscar clientes');
        return [];
    }
    return data;
}

async function buscarTiposContainer() {
    const { data, error } = await db
        .from('tipos_container')
        .select('id, nome')
        .order('nome');

    if(error) {
        console.error('Erro ao buscar tipos de container');
        return [];
    }
    return data;
}

async function inserirProcessos(dadosProcesso) {
    const { data, error } = await db
        .from('processo')
        .insert(dadosProcesso)
        .select()
        .single();

    if (error) {
        console.error('Erro ao inserir processo:', error);
        return null;
    }

    return data;
}

async function atualizarProcesso(id, dadosProcesso) {
    const { data, error } = await db
        .from('processo')
        .update(dadosProcesso)
        .eq('id', id)
        .select()
        .single();

        if (error) {
    console.error('Erro ao atualizar processo:', error.message, error.details, error.hint);
    return null;
}

    return data;
}

async function deletarContainersDoProcesso(processoId) {
    const { error } = await db
        .from('containers_processo')
        .delete()
        .eq('processo_id', processoId);

    if (error) {
        console.error('Erro ao limpar containers antigos:', error);
        return false;
    }

    return true;
}

async function inserirContainers(listaContainers) {
    const { data, error } = await db
        .from('containers_processo')
        .insert(listaContainers)
        .select();

    if (error) {
        console.error('Erro ao inserir processo:', error);
        return null;
    }
    return data;
}

async function uploadFotoContainer(arquivo, processoId) {
    const extensao = arquivo.name.split('.').pop();
    const nomeUnico = `${processoId}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${extensao}`;
    
    const { data, error } = await db
        .storage
        .from('vistorias-fotos')
        .upload(nomeUnico, arquivo);

    if (error) {
        console.error('Erro ao fazer upload da foto:', error);
        return null;
    }

    const { data: urlData } = db
        .storage
        .from('vistorias-fotos')
        .getPublicUrl(nomeUnico);
    
    return urlData.publicUrl;
}

async function buscarProcessos() {
    const { data, error } = await db
        .from('processo')
        .select(`
            *,
            cliente_dados:clientes!processo_cliente_fkey(nome),
            comprador_dados:clientes!processo_comprador_fkey(nome),
            containers_processo(id, numero_container, fotos_urls)
        `)
        .order('criado_em', {ascending: false});

    if (error) {
        console.error('Erro ao buscar processos:', error);
        return [];
    }

    return data;
}

async function buscarProcessoPorId(id) {
    const { data, error } = await db
        .from('processo') 
        .select(`
            *,
            containers_processo(*)
        `)
        .eq('id', id)
        .single();

        if (error) {
        console.error('Erro ao buscar detalhes do processo:', error);
        return null;
    }

    return data;
}

async function excluirProcesso (idProcesso) {
    const { data, error } = await db
        .from('processo')
        .delete()
        .eq('id', idProcesso);

    if (error) {
        console.error('Erro ao excluir processo', error);
        return false;
    }
    return true;
}

async function inserirCliente(dadosCliente) {
    const { data, error } = await db
        .from('clientes')
        .insert(dadosCliente)
        .select()
        .single();

    if (error) {
        console.error('Erro ao inserar cliente: ', error);
        return null;
    }
    return data;
}

async function excluirCliente(id) {
    const { error } = await db
        .from('clientes')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Erro ao excluir cliente: ', error);
        return false;
    }
    return true;
}



