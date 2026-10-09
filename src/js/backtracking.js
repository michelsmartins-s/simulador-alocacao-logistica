// -----------------------------
// Módulo de Alocação de Cargas
// -----------------------------


    class Carga {
        constructor(height, width, value, id) {
            this.height = height;
            this.width = width;
            this.value = value;
            this.id = id;
            this.valuePerSize = value / (height * width);
        }
        
        clone() {
            return new Carga(this.height, this.width, this.value, this.id); 
        }

        rotateClone() {
            let clone = this.clone();
            let t = clone.height;
            clone.height = clone.width;
            clone.width = t;
            return clone;
        }
    }

    class Container {
        constructor(height = 7, width = 3, format = null) {

            if (format) {
                this.format = format;
            }
            else
            {
                format = [];
                
                for (let x = 0; x < height; x++) {
                format.push([]);
                    for (let y = 0; y < width; y++) {
                        format[x].push(0);
                    }   
                }
            }

            this.format = format;
            this.height = height;
            this.width = width;
        }

        clone() {
            return new Container (this.height, this.width, JSON.parse(JSON.stringify(this.format)));
        }
    }

    // ----------------------------------------------------------
    // Função: cabe()
    // Verifica se uma carga cabe na posição (i,j) do container
    // ----------------------------------------------------------
    function cabe(container, carga, i, j) {
        if (j + carga.width > container.width || i + carga.height > container.height) return false;
        for (let x = 0; x < carga.height; x++) {
            for (let y = 0; y < carga.width; y++) {
                if (container.format[i + x][j + y] != 0) return false;
            }
        }
        return true;
    }

    // ----------------------------------------------------------
    // Função: place()
    // Coloca uma carga no container (altera a matriz)
    // ----------------------------------------------------------
    function place(container, carga, i, j) {
        for (let x = 0; x < carga.height; x++) {
            for (let y = 0; y < carga.width; y++) {
                container.format[i + x][j + y] = carga.id;
            }
        }
    }

    // ----------------------------------------------------------
    // Função: temApoio()
    // Verifica se a carga colocada possui apoio abaixo
    // ----------------------------------------------------------
    function temApoio(container, carga, i, j) {
        if (i === 0) return true;

        for (let y = 0; y < carga.width; y++) {
            if (container.format[i - 1][j + y] === 0) return false;
        }

        return true;
    }

    // ----------------------------------------------------------
    // Função: canFit()
    // Checa se uma carga pode caber em algum lugar do container
    // Usado para podar ramos inúteis do backtracking
    // ----------------------------------------------------------
    function canFit(container, carga) {
        for (let i = 0; i < container.height; i++) {
            for (let j = 0; j < container.width; j++) {
                let empty = container.format[i][j] === 0;
                if ((empty && i == 0) || (empty && (container.format[i - 1][j]) !== 0)) {
                    if(cabe(container, carga, i, j)) return true;
                    if (carga.height !== carga.width) {
                        if (cabe(container, carga.rotateClone(), i, j)) return true;
                    }
                }
            }
        }
        return false;
    }
   
    // ----------------------------------------------------------
    // Função principal: backtracking(listaCargas)
    // Gera permutações manualmente e testa alocação para cada uma
    // ----------------------------------------------------------
    function backtracking(listaCargas) {

        let n = listaCargas.length;
        let pilhaExterna = [];

        // Pilha de permutações
        for (let i = 0; i < n; i++) {
            pilhaExterna.push([i]);
        }

        let globalValueMax = 0;
        let globalBestContainer = new Container();

        // Loop principal de permutações
        while (pilhaExterna.length > 0) {
            let caminho = pilhaExterna.pop();

            if (caminho.length === n) {

                // Constrói a permutação real com cargas
                let permutacao = [];
                for (let k = 0; k < n; k++) {
                    permutacao.push(listaCargas[caminho[k]]);
                }
        
                // Pilha interna do backtracking
                let pilhaInterna= [{
                container: new Container(),
                cargas: permutacao,
                value: 0
                }]

                let maxValue = 0;
                let bestContainer = new Container();

                // Loop interno: tenta encaixar as cargas
                while (pilhaInterna.length > 0) {
                    let status = pilhaInterna.pop();
                    let containerAtual = status.container;
                    let cargasRestantes = status.cargas;
                    let valorContainerAtual = status.value;

                    // Atualiza melhor parcial
                    if (valorContainerAtual > maxValue) {
                        maxValue = valorContainerAtual;
                        bestContainer = containerAtual.clone();
                    }

                    // Se não há mais cargas
                    if (cargasRestantes.length === 0) {
                        continue;
                    }
                    else
                    {
                        let carga = cargasRestantes[0];
                        let outrasCargas = cargasRestantes.slice(1);
                        let placed = 0;

                        // Tenta colocar a carga em todas as posições
                        for (let i = 0; i < containerAtual.height; i++) {
                            for (let j = 0; j < containerAtual.width; j++) {

                                let empty = containerAtual.format[i][j] === 0;
                                if (empty) {

                                    // Posição normal
                                    if (cabe(containerAtual, carga, i, j) && temApoio(containerAtual, carga, i, j)) {
                                        let newContainer = containerAtual.clone();
                                        place(newContainer, carga, i, j);           
                                        pilhaInterna.push({container: newContainer, cargas: outrasCargas, value: valorContainerAtual + carga.value});
                                        placed++;
                                    }

                                    // Posição rotacionada
                                    if (carga.height !== carga.width) {
                                        if (cabe(containerAtual, carga.rotateClone(), i, j) && temApoio(containerAtual, carga.rotateClone(), i, j)) {
                                            let newContainer = containerAtual.clone();
                                            place(newContainer, carga.rotateClone(), i, j);           
                                            pilhaInterna.push({container: newContainer, cargas: outrasCargas, value: valorContainerAtual + carga.value});
                                            placed++
                                        }
                                    }
                                }
                            }
                        }

                        // Caso nenhuma carga tenha sido colocada
                        if (placed === 0) { 

                            // Verifica se ainda existe alguma carga que poderia caber
                            let someFit = false;
                            for (let c = 0; c < outrasCargas.length; c++) { // verifica se o container encheu
                                if(canFit(containerAtual, outrasCargas[c])) {someFit = true; break};
                            }

                            // Container "morreu"
                            if (!someFit) {
                                if (valorContainerAtual > maxValue) {
                                    maxValue = valorContainerAtual;
                                    bestContainer = containerAtual.clone();
                                }
                            }
                            else
                            {
                                // Continua sem colocar essa carga
                                pilhaInterna.push({container: containerAtual.clone(), cargas: outrasCargas, value: valorContainerAtual})
                            }
                        }
                    }
                }

                // Atualiza melhor global
                if (maxValue > globalValueMax) {
                    globalValueMax = maxValue;
                    globalBestContainer = bestContainer.clone();
                }
            }
            else
            {
                // Permutação ainda incompleta
                for (let i = 0; i < n; i++) {
                    if (!caminho.includes(i)) {
                        let novoCaminho = [];
                        for (let k = 0; k < caminho.length; novoCaminho.push(caminho[k]), k++);
                        novoCaminho.push(i);
                        pilhaExterna.push(novoCaminho);
                    }
                }
            }
        }
        return { maxValue: globalValueMax, bestContainer: globalBestContainer};
    }

    // ----------------------------------------------------------
    // Entrada de dados (via prompt)
    // ----------------------------------------------------------

    let quantTypeCarga = parseInt(prompt("quantos tipos (valores) de carga você quer adicionar no container?"));
    while (isNaN(quantTypeCarga) || quantTypeCarga <= 0) {
        alert("entrada inválida");
        quantTypeCarga = parseInt(prompt("quantos tipos (valores) de carga você quer adicionar no container?"));
    }

    let listCargas = [];

    for (let i = 1; i <= quantTypeCarga; i++) {
        let height = parseInt(prompt("Qual a altura da sua carga " + i + "? (ex: 2)"));
        let width = parseInt(prompt("Qual a largura da sua carga " + i + "? (ex: 1)"));
        let quant = parseInt(prompt("Quantas cargas dessa você quer armazenar? (ex: 3)"));
        let value = parseInt(prompt("Qual o valor dessas cargas? (ex: 30)"));
        let id = i;

        while (isNaN(height) || isNaN(width) || isNaN(quant) || isNaN(value) || height <= 0 || width <= 0 || quant <= 0) {
            console.error("Entrada inválida nos parâmetros da carga. Abortando.");

            for (let i = 1; i <= quantTypeCarga; i++) {
                height = parseInt(prompt("Qual a altura da sua carga " + i + "? (ex: 2)"));
                width = parseInt(prompt("Qual a largura da sua carga " + i + "? (ex: 1)"));
                quant = parseInt(prompt("Quantas cargas dessa você quer armazenar? (ex: 3)"));
                value = parseInt(prompt("Qual o valor dessas cargas? (ex: 30)"));
                id = i;
            }
        }

        for (let j = 0; j < quant; j++) {
                listCargas.push(new Carga(height, width, value, id));
        }
    }   

    // Aviso de complexidade
    if (listCargas.length > 8) {
        alert("Cuidado garotão essa execução vai demorar, pega a pipoca");
    }

    // Execução
    console.time("timer");
    let result = backtracking(listCargas);
    console.log("melhor solução encontrada!");
    result.bestContainer.showContainer();
    console.log("valor: " + result.maxValue);
    console.timeEnd("timer");
}
