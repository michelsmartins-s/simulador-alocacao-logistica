CREATE TABLE clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    cnpj_cpf TEXT NOT NULL
);

CREATE TABLE tipos_container (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL UNIQUE,
    comprimento_unidade INT,
    largura_unidade INT,
    peso_max DECIMAL(10,2)
);

CREATE TABLE inspetores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    cpf TEXT NOT NULL
);

CREATE TABLE processo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_inspecao TEXT NOT NULL UNIQUE,
    cliente UUID REFERENCES clientes(id),
    comprador UUID REFERENCES clientes(id),
    vessel TEXT NOT NULL,
    eta DATE,
    booking TEXT,
    porto_origem TEXT,
    porto_destino TEXT,
    peso_bruto DECIMAL(10,2),
    fatura_cliente TEXT,
    local_inspecao TEXT,
    inspetor UUID REFERENCES inspetores(id),
    status_processo TEXT DEFAULT 'Inconcluído',
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE containers_processo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    processo_id UUID REFERENCES processo(id) ON DELETE CASCADE,
    numero_container TEXT NOT NULL,
    tipo_container UUID REFERENCES tipos_container(id),
    data_descarregamento DATE,
    condicao_container TEXT DEFAULT 'OK',
    lacre_numero TEXT,
    produto_descricao TEXT,
    quantidade_itens INT,
    unidade_medida TEXT DEFAULT 'Cases',
    peso_container DECIMAL(10,2),
    observacoes TEXT,
    fotos_urls TEXT[]
);