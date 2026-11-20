// Funções que interagem diretamente com o banco de dados

async function buscarClientes() {
    const { data, error } = await db
        .from('clientes')
        .select('id, nome')
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