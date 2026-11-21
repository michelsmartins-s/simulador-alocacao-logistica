function formatarStatus(status) {
    const s = (status || '').toLowerCase();
    if (s === 'concluido' || s === 'concluído') {
        return '<span style="color: #1e7e34; font-weight: bold;">Concluído</span>';
    }
    return '<span style="color: #b35900; font-weight: bold;">Inconcluído</span>';
}

