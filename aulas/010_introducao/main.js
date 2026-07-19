/**
 * ============================================================================
 * 1. MOTOR DE MOVIMENTAÇÃO ESPACIAL E CONTROLE DE FLUXO (SLIDEGRID CORE)
 * ============================================================================
 */
const slideGrid = {
    '0,0': 'slide-capa',
    '1,0': 'slide-professor',
    '2,0': 'slide-interativo',
    '3,0': 'slide-trilha',
    '4,0': 'slide-perfil',
    '5,0': 'slide-conceitos',
    '6,0': 'slide-galeria',
    '7,0': 'slide-equacao',            
    '7,1': 'slide-gaudi-deepdive',     
    '7,2': 'slide-gaudi-simulator',    
    '8,0': 'slide-avaliacao',           
    '8,1': 'slide-avaliacao-quizzes',   
    '8,2': 'slide-avaliacao-provas',    
    '8,3': 'slide-trabalho-entrega',
    '8,4': 'slide-bibliografia',       // Deslocado: Bibliografia na sequência de avaliações (Sub-slide 4)
    '8,5': 'slide-bibliografia-complementar',
    '9,0': 'slide-avaliacao-quiz-aplicacao'  // Quiz posicionado estritamente em 9,0, sem ramificações
};

let currentX = 0; 
let currentY = 0;
const totalSlidesHorizontal = 10;

function hasSlide(x, y) { 
    return !!slideGrid[`${x},${y}`]; 
}

function updateGlobalIndicators() {
    const progressBar = document.getElementById('progressBar');
    const slideIndicator = document.getElementById('slideIndicator');
    if (!progressBar || !slideIndicator) return;
    
    const progress = (currentX / (totalSlidesHorizontal - 1)) * 100;
    progressBar.style.width = `${progress}%`;
    
    const numStr = (currentX + 1).toString().padStart(2, '0');
    const totalStr = totalSlidesHorizontal.toString().padStart(2, '0');
    const subSlideStr = currentY > 0 ? ` [Sub-Slide v${currentY}]` : '';
    slideIndicator.innerText = `${numStr} / ${totalStr}${subSlideStr}`;
}

function updateArrowStates() {
    const arrows = {
        'up': { el: document.getElementById('btn-nav-up'), dx: 0, dy: -1 },
        'down': { el: document.getElementById('btn-nav-down'), dx: 0, dy: 1 },
        'left': { el: document.getElementById('btn-nav-left'), dx: -1, dy: 0 },
        'right': { el: document.getElementById('btn-nav-right'), dx: 1, dy: 0 }
    };

    for (let dir in arrows) {
        if (arrows[dir].el) {
            if (hasSlide(currentX + arrows[dir].dx, currentY + arrows[dir].dy)) {
                arrows[dir].el.classList.add('nav-enabled');
            } else {
                arrows[dir].el.classList.remove('nav-enabled');
            }
        }
    }
}

function moveInGrid(dx, dy) {
    const nextX = currentX + dx;
    const nextY = currentY + dy;

    if (hasSlide(nextX, nextY)) {
        const currentElement = document.getElementById(slideGrid[`${currentX},${currentY}`]);
        const nextElement = document.getElementById(slideGrid[`${nextX},${nextY}`]);

        if (currentElement && nextElement) {
            currentElement.classList.remove('slide-active');

            if (dx > 0) currentElement.classList.add('slide-hidden-left');
            else if (dx < 0) currentElement.classList.add('slide-hidden-right');
            else if (dy > 0) currentElement.classList.add('slide-hidden-down');
            else if (dy < 0) currentElement.classList.add('slide-hidden-up');

            nextElement.classList.remove('slide-hidden-left', 'slide-hidden-right', 'slide-hidden-up', 'slide-hidden-down');
            nextElement.classList.add('slide-active');

            currentX = nextX;
            currentY = nextY;
            updateGlobalIndicators();
        }
    }
    updateArrowStates();
}

// Tratamento unificado contra colisões de foco em campos de texto
document.addEventListener('keydown', function(e) {
    if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.id === 'cityInput')) return;

    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); moveInGrid(1, 0); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); moveInGrid(-1, 0); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); moveInGrid(0, -1); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); moveInGrid(0, 1); }
});

// Suporte Avançado a Gestos Táteis (Mobile Presentation Engine)
let touchStartX = 0; 
let touchStartY = 0;
document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', e => {
    if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.id === 'cityInput')) return;
    
    const deltaX = e.changedTouches[0].screenX - touchStartX;
    const deltaY = e.changedTouches[0].screenY - touchStartY;
    
    // Filtro contra toques acidentais/micro-arrastos
    if (Math.abs(deltaX) > 60 || Math.abs(deltaY) > 60) {
        e.preventDefault(); // Trava a rolagem nativa da página na transição
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 0) moveInGrid(-1, 0); else moveInGrid(1, 0);
        } else {
            if (deltaY > 0) moveInGrid(0, -1); else moveInGrid(0, 1);
        }
    }
}, { passive: false }); // Alterado para false para permitir preventDefault()


/**
 * ============================================================================
 * 2. LOUSA INTERATIVA DE ORIGENS (STATISTICAL TREATMENT & SANITIZATION)
 * ============================================================================
 */
const cityData = {};

function normalizeString(str) {
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s]/g, "").trim().replace(/\s+/g, ' ');
}

function capitalizeWords(str) {
    return str.replace(/\b\w/g, l => l.toUpperCase());
}

function processCityInput() {
    const inputEl = document.getElementById('cityInput');
    if (!inputEl) return;
    
    const rawValue = inputEl.value;
    if (!rawValue.trim()) return;

    const normalized = normalizeString(rawValue);
    const formattedName = capitalizeWords(rawValue.trim().toLowerCase());

    if (cityData[normalized]) {
        cityData[normalized].count += 1;
    } else {
        cityData[normalized] = { name: formattedName, count: 1 };
    }

    inputEl.value = '';
    renderChart();
}

function renderChart() {
    const chartContainer = document.getElementById('chartContainer');
    const totalVotesEl = document.getElementById('totalVotes');
    if (!chartContainer) return;

    const sortedCities = Object.values(cityData).sort((a, b) => b.count - a.count);
    const totalVotes = sortedCities.reduce((acc, curr) => acc + curr.count, 0);

    if (totalVotes === 0) {
        if (totalVotesEl) totalVotesEl.innerText = 'Total: 0';
        chartContainer.innerHTML = `
            <div id="emptyState" class="flex-1 flex flex-col items-center justify-center text-center p-6 opacity-40">
                <i class="fa-solid fa-chart-bar text-4xl mb-2 text-[#80C29D]"></i>
                <p class="text-xs font-mono uppercase tracking-wider">Aguardando dados de envio...</p>
            </div>`;
        return;
    }

    if (totalVotesEl) totalVotesEl.innerText = `Total: ${totalVotes}`;
    chartContainer.innerHTML = '';
    const maxVotes = sortedCities[0].count;

    sortedCities.forEach(city => {
        const percentage = (city.count / maxVotes) * 100;
        const rowHTML = `
            <div class="space-y-1 font-['Montserrat',sans-serif]">
                <div class="flex justify-between text-xs font-semibold tracking-wide">
                    <span class="truncate max-w-[70%] text-white">${city.name}</span>
                    <span class="text-[#80C29D] font-mono">${city.count} (${Math.round((city.count / totalVotes) * 100)}%)</span>
                </div>
                <div class="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                    <div class="bg-[#80C29D] h-full rounded-full transition-all duration-500 ease-out" style="width: ${percentage}%"></div>
                </div>
            </div>`;
        chartContainer.insertAdjacentHTML('beforeend', rowHTML);
    });
}

function resetChart() {
    Object.keys(cityData).forEach(key => delete cityData[key]);
    renderChart();
}


/**
 * ============================================================================
 * 3. MORFOLOGIA HISTÓRICA INTERATIVA (DATA ARCHITECTURE)
 * ============================================================================
 */
const morphologyData = [
    {
        title: "O Partenon",
        year: "432 a.C.",
        system: "Sistema Trilítico Clássico",
        description: "Consolidação e perfeição do sistema trilítico elementar: pilares e colunas robustas trabalhando sob compressão pura para suportar vigas e entablamentos horizontais submetidos à flexão direta.",
        bg: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/The_Parthenon_in_Athens.jpg/1200px-The_Parthenon_in_Athens.jpg"
    },
    {
        title: "Catedrais Góticas",
        year: "Séc. XII - XIV",
        system: "Arcos e Vetores de Compressão",
        description: "Avanço estrutural medieval fundamentado no uso de arcos ogivais, abóbadas de nervuras e contrafortes externos. Permitiu direcionar e transferir com precisão as linhas de pressões de compressão, aliviando as paredes e atingindo alturas recordes.",
        bg: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Amiens_Chamber_South.jpg/1200px-Amiens_Chamber_South.jpg"
    },
    {
        title: "Catedral de Brasília",
        year: "1970",
        system: "Concreto Armado de Casca Livre",
        description: "Oscar Niemeyer e Joaquim Cardozo demonstram a genialidade plástica do concreto armado. As 16 colunas hiperbólicas curvas trabalham de forma integrada, unificando a identidade estética e formal exterior à própria função de estabilidade da estrutura.",
        bg: "https://raw.githubusercontent.com/jmfcarvalho/civ153/main/assets/images/catedral_brasilia.jpeg" // Corrigido fallback que apontava incorretamente para subdiretório de mídia interna do MediaWiki
    },
    {
        title: "Estruturas Contemporâneas",
        year: "Atualidade",
        system: "Treliças de Alta Performance e Sistemas Estaiados",
        description: "Superação de vãos monumentais utilizando ligas metálicas especiais, treliças espaciais tridimensionais metálicas, cabos de aço de alta resistência e concreto de ultra-alto desempenho (UHPC), otimizando a distribuição vetorial interna.",
        bg: "https://raw.githubusercontent.com/jmfcarvalho/civ153/main/assets/images/millau_viaduct.jpeg"
    }
];

function switchMorphology(index) {
    const item = morphologyData[index];
    if (!item) return;

    const viewer = document.getElementById('morphologyViewer');
    const title = document.getElementById('morphTitle');
    const year = document.getElementById('morphYear');
    const system = document.getElementById('morphSystem');
    const desc = document.getElementById('morphDescription');

    if (viewer) viewer.style.backgroundImage = `url('${item.bg}')`;
    if (title) title.innerText = item.title;
    if (year) year.innerText = item.year;
    if (system) system.innerText = item.system;
    
    if (desc) {
        desc.style.opacity = 0;
        setTimeout(() => { 
            desc.innerText = item.description; 
            desc.style.opacity = 1; 
        }, 150);
    }

    for (let i = 0; i < morphologyData.length; i++) {
        const btn = document.getElementById(`morphBtn-${i}`);
        if (!btn) continue;
        btn.className = (i === index) 
            ? "w-full p-3 rounded-xl text-left font-['Montserrat',sans-serif] text-xs font-bold uppercase tracking-wider transition-all border border-[#80C29D] bg-white text-[#0D4334] shadow-md"
            : "w-full p-3 rounded-xl text-left font-['Montserrat',sans-serif] text-xs font-bold uppercase tracking-wider transition-all border border-white/10 hover:border-[#80C29D]/50 text-slate-300 hover:text-white";
    }
}

const gaudiPresentationData = [
    {
        title: "Modelos Estereofônicos",
        scope: "Técnica",
        location: "Maquetes Invertidas de Cordas",
        description: "Cordas sob tensão pura sustentavam saquinhos de areia proporcionais às cargas reais das paredes. O formato de equilíbrio geométrico estável encontrado, quando fotografado e invertido de cabeça para baixo, ditava a forma perfeita do arco comprimido.",
        bg: "https://raw.githubusercontent.com/jmfcarvalho/civ153/main/assets/images/gaudi_model_stereo.jpeg"
    },
    {
        title: "Cripta da Colônia Güell",
        scope: "Aplicação",
        location: "Santa Coloma de Cervelló",
        description: "O laboratório de testes empíricos de Gaudí. Foram necessários 10 anos de experimentação com modelos funiculares para calcular a estabilidade estrutural complexa e a inclinação orgânica das colunas de tijolo.",
        bg: "https://raw.githubusercontent.com/jmfcarvalho/civ153/main/assets/images/cripta_guell.jpeg"
    },
    {
        title: "Sagrada Família",
        scope: "Obra-Prima",
        location: "Barcelona, Espanha",
        description: "A consolidação absoluta do método: as colunas ramificadas como árvores transmitem cargas por compressão direta sem o uso de contrafortes medievais góticos, maximizando o espaço interno e a entrada de luz vertical.",
        bg: "https://raw.githubusercontent.com/jmfcarvalho/civ153/main/assets/images/sagrada_familia.jpeg"
    }
];

function switchGaudiView(index) {
    const item = gaudiPresentationData[index];
    if (!item) return;

    const viewer = document.getElementById('gaudiViewer');
    const title = document.getElementById('gaudiTitle');
    const scope = document.getElementById('gaudiScope');
    const location = document.getElementById('gaudiLocation');
    const desc = document.getElementById('gaudiDescription');

    if (viewer) viewer.style.backgroundImage = `url('${item.bg}')`;
    if (title) title.innerText = item.title;
    if (scope) scope.innerText = item.scope;
    if (location) location.innerText = item.location;
    
    if (desc) {
        desc.style.opacity = 0;
        setTimeout(() => { 
            desc.innerText = item.description; 
            desc.style.opacity = 1; 
        }, 150);
    }

    for (let i = 0; i < gaudiPresentationData.length; i++) {
        const btn = document.getElementById(`gaudiBtn-${i}`);
        if (!btn) continue;
        btn.className = (i === index) 
            ? "w-full p-3 rounded-xl text-left text-xs font-bold uppercase tracking-wider transition-all border border-[#80C29D] bg-white text-[#0D4334] shadow-md"
            : "w-full p-3 rounded-xl text-left text-xs font-bold uppercase tracking-wider transition-all border border-white/10 hover:border-[#80C29D]/50 text-slate-300 hover:text-white";
    }
}

/**
 * ============================================================================
 * EXTRA LÓGICA: MATRIZ DE CONCEITOS E SISTEMAS FUNICULARES (SLIDE 7,0)
 * ============================================================================
 */
const conceptPresentationData = [
    {
        title: "Estruturas Estaiadas (Tração)",
        mechanism: "Tração Axial",
        meta: "Viaduto de Millau • França",
        description: "O Viaduto de Millau (2004), projetado por Michel Virlogeux e Norman Foster, representa o auge da engenharia de cabos. Mastros verticais de aço de alta performance transmitem as cargas diretamente para o solo por meio de tirantes inclinados de aço sob tração pura, eliminando os momentos fletores massivos e permitindo vencer vãos monumentais com seções esbeltas.",
        bg: "https://raw.githubusercontent.com/jmfcarvalho/civ153/main/assets/images/millau_viaduct.jpeg"
    },
    {
        title: "Pontes Suspensas (Cabos)",
        mechanism: "Polinômio Funicular",
        meta: "Ponte Golden Gate • EUA",
        description: "Inaugurada em 1937 em São Francisco, a estrutura demonstra a física dos cabos suspensos sob carregamento distribuído. O cabo principal assume uma geometria parabólica funicular perfeita sob ação do peso próprio da pista suspensa por pendurais verticais. O sistema trabalha exclusivamente sob forças permanentes de tração tridimensional estável.",
        bg: "https://raw.githubusercontent.com/jmfcarvalho/civ153/main/assets/images/golden_gate.jpeg"
    },
    {
        title: "Arcos de Alvenaria (Compressão)",
        mechanism: "Linha de Pressões",
        meta: "Aqueduto de Segóvia • Espanha",
        description: "Construído pelos romanos no século II d.C., o monumento é um exemplo supremo de engenharia sem argamassa. Cada bloco de pedra talhada (aduela) transfere a carga gravitacional para o bloco vizinho por meio de forças perpendiculares de compressão pura. O desenho geométrico semicircular garante que a linha de pressões interna permaneça no terço médio das seções.",
        bg: "https://raw.githubusercontent.com/jmfcarvalho/civ153/main/assets/images/segovia_aqueduct.jpeg"
    },
    {
        title: "Cascas de Concreto (Estabilidade)",
        mechanism: "Compressão de Membrana",
        meta: "Kresge Auditorium • EUA",
        description: "Desenvolvido por Eero Saarinen em 1955 no MIT, o edifício utiliza uma casca delgada de concreto armado de curvatura contínua. As cargas lineares e superficiais são transformadas puramente em tensões de membrana axiais de compressão pura. A forma tridimensional contínua elimina os momentos fletores locais e mitiga os riscos de flambagem elástica das bordas.",
        bg: "https://raw.githubusercontent.com/jmfcarvalho/civ153/main/assets/images/kresge_auditorium.jpeg"
    }
];

function switchConceptView(index) {
    const item = conceptPresentationData[index];
    if (!item) return;

    const viewer = document.getElementById('conceptViewer');
    const title = document.getElementById('conceptTitle');
    const mechanism = document.getElementById('conceptMechanism');
    const meta = document.getElementById('conceptMeta');
    const desc = document.getElementById('conceptDescription');

    if (viewer) viewer.style.backgroundImage = `url('${item.bg}')`;
    if (title) title.innerText = item.title;
    if (mechanism) mechanism.innerText = item.mechanism;
    if (meta) meta.innerText = item.meta;
    
    if (desc) {
        desc.style.opacity = 0;
        setTimeout(() => { 
            desc.innerText = item.description; 
            desc.style.opacity = 1; 
        }, 150);
    }

    for (let i = 0; i < conceptPresentationData.length; i++) {
        const btn = document.getElementById(`conceptBtn-${i}`);
        if (!btn) continue;
        btn.className = (i === index) 
            ? "w-full p-3 rounded-xl text-left text-xs font-bold uppercase tracking-wider transition-all border border-[#80C29D] bg-white text-[#0D4334] shadow-md"
            : "w-full p-3 rounded-xl text-left text-xs font-bold uppercase tracking-wider transition-all border border-white/10 hover:border-[#80C29D]/50 text-slate-300 hover:text-white";
    }
}


/**
 * ============================================================================
 * 4. SIMULADOR FUNICULAR N-GRAUS AVANÇADO (DYNAMIC ELEMENT GENERATOR)
 * ============================================================================
 */
let isArchInverted = false;
let activeWeightValues = [100, 150, 100]; // Estado base inicial com 3 cargas

function toggleArchMode() {
    isArchInverted = !isArchInverted;
    const stateTag = document.getElementById('simulator-state-tag');
    if (!stateTag) return;

    if (isArchInverted) {
        stateTag.innerText = "Compressão Pura";
        stateTag.className = "bg-[#0D4334] text-[#80C29D] text-[10px] font-mono font-black uppercase px-4 py-1.5 rounded-full shadow-sm border border-[#80C29D]/30";
    } else {
        stateTag.innerText = "Tração Pura";
        stateTag.className = "bg-[#80C29D] text-[#0D4334] text-[10px] font-mono font-black uppercase px-4 py-1.5 rounded-full shadow-sm";
    }
    updateSimulation();
}

function renderSlidersUI() {
    const container = document.getElementById('sliders-dynamic-container');
    if (!container) return;
    
    container.innerHTML = '';
    activeWeightValues.forEach((val, index) => {
        const html = `
            <div class="space-y-0.5 bg-white/5 p-2 rounded-xl border border-white/5">
                <div class="flex justify-between items-center">
                    <label class="text-[9px] font-bold text-[#A1A1A1] uppercase block">Carga P${index + 1}</label>
                    <span class="text-[10px] font-mono text-[#80C29D]">${val}N</span>
                </div>
                <input type="range" id="slider-p-${index}" min="30" max="240" value="${val}" 
                       oninput="handleSliderChange(${index}, this.value)" class="w-full accent-[#80C29D]">
            </div>`;
        container.insertAdjacentHTML('beforeend', html);
    });
}

function handleSliderChange(index, value) {
    activeWeightValues[index] = parseFloat(value);
    updateSimulation();
    
    // Atualiza o texto numérico inline sem re-renderizar todo o DOM do painel
    const inputNode = document.getElementById(`slider-p-${index}`);
    if (inputNode && inputNode.previousElementSibling) {
        inputNode.previousElementSibling.querySelector('span').innerText = `${value}N`;
    }
}

function addWeightNode() {
    if (activeWeightValues.length >= 6) return; // Limite de estabilidade gráfica e responsiva
    activeWeightValues.push(100);
    renderSlidersUI();
    updateSimulation();
}

function removeWeightNode() {
    if (activeWeightValues.length <= 1) return; // Salvaguarda do polinômio funicular mínimo
    activeWeightValues.pop();
    renderSlidersUI();
    updateSimulation();
}

function updateSimulation() {
    const svgGroup = document.getElementById('weight-nodes');
    const pathEl = document.getElementById('cable-path');
    if (!svgGroup || !pathEl) return;

    svgGroup.innerHTML = '';
    const numNodes = activeWeightValues.length;
    
    // Distribuição espacial paramétrica no eixo X
    const startX = 50;
    const endX = 550;
    const stepX = (endX - startX) / (numNodes + 1);
    
    let pathCoordinates = [];
    const baseLineY = isArchInverted ? 250 : 50;
    pathCoordinates.push({x: startX, y: baseLineY});

    // Loop de cálculo trigonométrico iterativo simplificado (Polinômio de forças)
    for (let i = 0; i < numNodes; i++) {
        const currentX = startX + (stepX * (i + 1));
        const pValue = activeWeightValues[i];
        
        // Efeito da intensidade parabólica proporcional
        let currentY = isArchInverted 
            ? 250 - (pValue * 0.75) 
            : 50 + (pValue * 0.75);
            
        pathCoordinates.push({x: currentX, y: currentY});
    }
    pathCoordinates.push({x: endX, y: baseLineY});

    // Injeção de string estruturada d-path
    let dString = `M ${pathCoordinates[0].x},${pathCoordinates[0].y}`;
    for (let i = 1; i < pathCoordinates.length; i++) {
        dString += ` L ${pathCoordinates[i].x},${pathCoordinates[i].y}`;
    }
    pathEl.setAttribute('d', dString);

    // Renderização dos vetores nodais dinâmicos no SVG
    for (let i = 1; i <= numNodes; i++) {
        const pt = pathCoordinates[i];
        const offset = isArchInverted ? -25 : 25;
        const radius = 6 + (activeWeightValues[i-1] * 0.04); // Escala visual da massa

        const lineHTML = `<line x1="${pt.x}" y1="${pt.y}" x2="${pt.x}" y2="${pt.y + offset}" stroke="#A1A1A1" stroke-width="2"></line>`;
        const circleHTML = `<circle cx="${pt.x}" cy="${pt.y + offset}" r="${radius}" fill="${isArchInverted ? '#80C29D' : '#0D4334'}"></circle>`;
        
        svgGroup.insertAdjacentHTML('beforeend', lineHTML + circleHTML);
    }
}

// Certifique-se de invocar renderSlidersUI() dentro do escopo de inicialização do DOM no final do arquivo:
window.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('sliders-dynamic-container')) {
        renderSlidersUI();
        updateSimulation();
    }
});


/**
 * ============================================================================
 * 5. DINÂMICA DE ANÁLISE DE PERFIL (PEDAGOGICAL CONTRACT INTERACTION)
 * ============================================================================
 */
const profileVotes = {
    'visionário': { name: 'Base Poética e Espacial', count: 0, feedback: '⚡ Perfil Arquiteto Construtor: Você enxerga a mecânica como linguagem de viabilização formal. Ótima aderência aos conceitos de morfologia e estruturas em casca apresentados pelo Grupo SICon.' },
    'pragmático': { name: 'Ferramenta de Autonomia', count: 0, feedback: '📐 Perfil Técnico e Colaborativo: Você busca o domínio das leis físicas para garantir segurança, economia e conversas de alto nível com engenheiros calculistas no canteiro de obras.' },
    'cético': { name: 'Barreira Técnico-Matemática', count: 0, feedback: '🎨 Perfil Plástico Puro: Atenção! O cálculo analítico rígido pode parecer limitante, mas nesta disciplina focaremos no entendimento intuitivo e qualitativo dos esforços solicitantes.' }
};

let previousVote = null;

function submitProfile(key) {
    const feedbackDiv = document.getElementById('profileFeedback');
    if (!feedbackDiv) return;
    
    if (previousVote === key) return;
    
    if (previousVote) {
        profileVotes[previousVote].count--;
    }
    
    profileVotes[key].count++;
    previousVote = key;

    ['visionário', 'pragmático', 'cético'].forEach(k => {
        const indicator = document.getElementById(`radio-${k}`);
        if (indicator) {
            indicator.innerHTML = (k === key) ? '<div class="w-2 h-2 bg-[#80C29D] rounded-full"></div>' : '';
        }
    });

    feedbackDiv.innerText = profileVotes[key].feedback;
    feedbackDiv.classList.remove('hidden');

    renderProfileChart();
}

function clearProfileSelection() {
    if (!previousVote) return;
    profileVotes[previousVote].count--;
    previousVote = null;

    ['visionário', 'pragmático', 'cético'].forEach(k => {
        const indicator = document.getElementById(`radio-${k}`);
        if (indicator) indicator.innerHTML = '';
    });

    const feedbackDiv = document.getElementById('profileFeedback');
    if (feedbackDiv) {
        feedbackDiv.innerText = '';
        feedbackDiv.classList.add('hidden');
    }

    renderProfileChart();
}

function renderProfileChart() {
    const container = document.getElementById('profileChartContainer');
    const totalEl = document.getElementById('profileTotalVotes');
    if (!container) return;

    const dataArr = Object.values(profileVotes);
    const total = dataArr.reduce((acc, c) => acc + c.count, 0);

    if (total === 0) {
        if (totalEl) totalEl.innerText = 'Total: 0';
        container.innerHTML = `
            <div id="profileEmptyState" class="flex-1 flex flex-col items-center justify-center text-center p-6 opacity-40">
                <i class="fa-solid fa-chart-pie text-4xl mb-2 text-[#80C29D]"></i>
                <p class="text-xs font-mono uppercase tracking-wider">Aguardando interações da turma...</p>
            </div>`;
        return;
    }

    if (totalEl) totalEl.innerText = `Total: ${total}`;
    container.innerHTML = '';

    const maxCount = Math.max(...dataArr.map(o => o.count));

    dataArr.forEach(item => {
        const pct = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
        const totalPct = Math.round((item.count / total) * 100);
        
        const html = `
            <div class="space-y-1 font-['Montserrat',sans-serif]">
                <div class="flex justify-between text-xs font-semibold tracking-wide">
                    <span class="truncate max-w-[70%] text-white text-left block">${item.name}</span>
                    <span class="text-[#80C29D] font-mono">${item.count} (${totalPct}%)</span>
                </div>
                <div class="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                    <div class="bg-[#80C29D] h-full rounded-full transition-all duration-500 ease-out" style="width: ${pct}%"></div>
                </div>
            </div>`;
        container.insertAdjacentHTML('beforeend', html);
    });
}

function resetProfileChart() {
    Object.keys(profileVotes).forEach(k => { profileVotes[k].count = 0; });
    clearProfileSelection();
    renderProfileChart();
}


/**
 * ============================================================================
 * 6. ASYNCHRONOUS INITIALIZATION ENGINE (DOM LIFECYCLE)
 * ============================================================================
 */
window.addEventListener('DOMContentLoaded', () => {
    updateArrowStates();
    updateGlobalIndicators();
    if (document.getElementById('slider-p1')) updateSimulation();

    document.getElementById('cityInput')?.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            processCityInput();
        }
    });

    // Inicialização assíncrona do Renderizador de Alta Precisão KaTeX
    if (typeof katex !== 'undefined') {
        const sumFEl = document.getElementById('katex-sum-f');
        const tensionEl = document.getElementById('katex-tension-formula');
        if (sumFEl) katex.render("\\sum \\vec{F} = 0", sumFEl, { throwOnError: false });
        if (tensionEl) katex.render("\\sigma = \\frac{N}{A} \\pm \\frac{M}{W}", tensionEl, { throwOnError: false, displayMode: true });
    }
});

/**
 * ============================================================================
 * EXTRA LÓGICA: MATRIZ DE REFERÊNCIAS BIBLIOGRÁFICAS BÁSICAS (SLIDE 9,0)
 * ============================================================================
 */
const bibBasicPresentationData = [
    {
        title: "HIBBELER, R. C. Estática: Mecânica para engenharia. 10ª ed. São Paulo: Pearson, 2005[cite: 1].",
        type: "Mecânica Analítica",
        availability: "Biblioteca Central UFV",
        description: "Referência canônica indispensável para o entendimento rigoroso do equilíbrio estrito de corpos rígidos submetidos a sistemas de forças vetoriais de compressão e tração[cite: 1]. Contem o formalismo matemático e os teoremas fundamentais para o isolamento de nós e cálculo de esforços axiais internos em treliças planas e espaciais.",
        bg: "https://raw.githubusercontent.com/jmfcarvalho/civ153/main/assets/images/bib_hibbeler_static.jpeg"
    },
    {
        title: "BEER, F. P.; JOHNSTON, E. R. Mecânica vetorial para engenheiros - Estática. 11ª ed. São Paulo: McGraw-Hill, 2019[cite: 1].",
        type: "Formalismo Vetorial",
        availability: "22 Exemplares Disponíveis[cite: 1]",
        description: "Abordagem rigorosa voltada para a modelagem geométrica vetorial de forças coplanares e espaciais[cite: 1]. Essencial para a resolução e verificação analítica manual de reações de apoio e determinação vetorial de solicitações axiais em sistemas de barras articuladas.",
        bg: "https://raw.githubusercontent.com/jmfcarvalho/civ153/main/assets/images/bib_beer_static.jpeg"
    },
    {
        title: "REBELLO, Y. C. P. A concepção estrutural e a arquitetura. São Paulo: Editora Zigurate, 2001[cite: 1].",
        type: "Concepção Estrutural",
        availability: "Biblioteca Central UFV",
        description: "Obra seminal para a compreensão intuitiva e qualitativa da física dos edifícios[cite: 1]. Traduz as formulações matemáticas em conceitos espaciais, demonstrando como a geometria arquitetônica atua ativamente na distribuição e otimização dos caminhos de forças internas.",
        bg: "https://raw.githubusercontent.com/jmfcarvalho/civ153/main/assets/images/bib_rebello_concepcao.jpeg"
    },
    {
        title: "ENGEL, H. Sistemas de estructuras. Barcelona: Editorial Gustavo Gili, 2001[cite: 1].",
        type: "Morfologia Espacial",
        availability: "Acervo Técnico DEC[cite: 1]",
        description: "Atlas morfológico completo que classifica os sistemas estruturais a partir de sua atuação mecânica (forma, vetor, seção ou superfície)[cite: 1]. Fundamental para o entendimento do comportamento funicular de cabos, arcos e da malha vetorial tridimensional de coberturas em treliça.",
        bg: "https://raw.githubusercontent.com/jmfcarvalho/civ153/main/assets/images/bib_engel_sistemas.jpeg"
    }
];

function switchBibBasicView(index) {
    const item = bibBasicPresentationData[index];
    if (!item) return;

    const viewer = document.getElementById('bibBasicViewer');
    const title = document.getElementById('bibBasicTitle');
    const type = document.getElementById('bibBasicType');
    const availability = document.getElementById('bibBasicAvailability');
    const desc = document.getElementById('bibBasicDescription');

    if (viewer) viewer.style.backgroundImage = `url('${item.bg}')`;
    if (title) title.innerText = item.title;
    if (type) type.innerText = item.type;
    if (availability) availability.innerText = item.availability;
    
    if (desc) {
        desc.style.opacity = 0;
        setTimeout(() => { 
            desc.innerText = item.description; 
            desc.style.opacity = 1; 
        }, 150);
    }

    for (let i = 0; i < bibBasicPresentationData.length; i++) {
        const btn = document.getElementById(`bibBasicBtn-${i}`);
        if (!btn) continue;
        btn.className = (i === index) 
            ? "w-full p-3 rounded-xl text-left text-xs font-bold uppercase tracking-wider transition-all border border-[#80C29D] bg-white text-[#0D4334] shadow-md"
            : "w-full p-3 rounded-xl text-left text-xs font-bold uppercase tracking-wider transition-all border border-white/10 hover:border-[#80C29D]/50 text-slate-300 hover:text-white";
    }
}