/**
 * MOTOR NAVEGACIONAL E REATIVO DA AULA 03 (MODELOS ESTRUTURAIS + LABORATÓRIO VIRTUAL DE TRELIÇAS)
 * SICon identity standard alignment
 */

/**
 * MAPEAMENTO ATUALIZADO COM SIMULADOR DE PÓRTICOS (7,2)
 */
const slideGridAula03 = {
    '0,0': 'slide-capa',
    '1,0': 'slide-ementa',
    '2,0': 'slide-cabos',
    '2,1': 'slide-cabos-galeria',
    '3,0': 'slide-membranas',
    '3,1': 'slide-membranas-galeria',
    '4,0': 'slide-arcos',
    '4,1': 'slide-arcos-galeria',
    '5,0': 'slide-superficies',
    '5,1': 'slide-superficies-galeria',
    '6,0': 'slide-trelicas',
    '6,1': 'slide-trelicas-galeria',
    '6,2': 'slide-trelicas-montador',
    '7,0': 'slide-porticos',
    '7,1': 'slide-porticos-galeria',
    '7,2': 'slide-porticos-simulador',
    '8,0': 'slide-quiz',
    '9,0': 'slide-encerramento'
};

const slideGrid = {};
Object.assign(slideGrid, slideGridAula03);

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

            if (slideGrid[`${nextX},${nextY}`] === 'slide-trelicas-montador') {
                setTimeout(initTrussCanvas, 100);
            }
        }
    }
    updateArrowStates();
}

// Keydown Listener
document.addEventListener('keydown', function(e) {
    if (document.activeElement && (document.activeElement.tagName === 'INPUT')) return;

    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); moveInGrid(1, 0); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); moveInGrid(-1, 0); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); moveInGrid(0, -1); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); moveInGrid(0, 1); }
});

// Gesture Listener
let touchStartX = 0;
let touchStartY = 0;
document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', e => {
    if (document.activeElement && (document.activeElement.tagName === 'INPUT')) return;
    if (e.target.id === 'trussCanvas') return;

    const deltaX = e.changedTouches[0].screenX - touchStartX;
    const deltaY = e.changedTouches[0].screenY - touchStartY;
    
    if (Math.abs(deltaX) > 60 || Math.abs(deltaY) > 60) {
        e.preventDefault();
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 0) moveInGrid(-1, 0); else moveInGrid(1, 0);
        } else {
            if (deltaY > 0) moveInGrid(0, -1); else moveInGrid(0, 1);
        }
    }
}, { passive: false });


/**
 * BASE DE DADOS DAS OBRAS ICÔNICAS (AULA 03)
 */
const galleryData = {
    cabos: [
        {
            title: "Ponte Golden Gate",
            tag: "São Francisco, EUA",
            desc: "Cabo funicular de suspensão sob tração contínua transferindo cargas estáticas e dinâmicas aos pilones.",
            img: "https://upload.wikimedia.org/wikipedia/commons/0/0c/GoldenGateBridge-001.jpg"
        },
        {
            title: "Viaduto de Millau",
            tag: "Millau, França",
            desc: "Ponte estaiada composta por tirantes/cabos múltiplos de aço de alta resistência em leque.",
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Creissels_et_Viaduct_de_Millau.jpg/1920px-Creissels_et_Viaduct_de_Millau.jpg"
        }
    ],
    membranas: [
        {
            title: "Estádio Olímpico de Munique",
            tag: "Munique, Alemanha",
            desc: "Projeto de Frei Otto. Rede de cabos e membranas contínuas pré-tensionadas de curvatura dupla.",
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/2022-08-21_Olympiapark_M%C3%BCnchen_by_Sandro_Halank%E2%80%93025.jpg/1920px-2022-08-21_Olympiapark_M%C3%BCnchen_by_Sandro_Halank%E2%80%93025.jpg"
        },
        {
            title: "Domo do Milênio",
            tag: "Londres, Reino Unido",
            desc: "Grande cobertura de membrana suportada por mastros externos e rede de cabos tracionados.",
            img: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Millennium_Dome_1.jpg"
        }
    ],
    arcos: [
        {
            title: "Ponte Gateway",
            tag: "St. Louis, EUA",
            desc: "Arco catenário monumental de aço inoxidável trabalhando sob compressão pura.",
            img: "https://upload.wikimedia.org/wikipedia/commons/d/de/St_Louis_night_expblend.jpg"
        },
        {
            title: "Aqueduto das Águas Livres",
            tag: "Lisboa, Portugal",
            desc: "Arcos ogivais em alvenaria estrutural de pedra resistindo aos esforços de gravidade por compressão.",
            img: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Aqueduto_das_Aguas_Livres_Lisboa.jpg"
        }
    ],
    superficies: [
        {
            title: "Igreja da Pampulha",
            tag: "Belo Horizonte, Brasil",
            desc: "Projeto de Oscar Niemeyer. Cascas parabólicas delgadas de concreto armado com função estrutural e de vedação.",
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Igrejinha_de_S%C3%A3o_Francisco_de_Assis_6.jpeg/960px-Igrejinha_de_S%C3%A3o_Francisco_de_Assis_6.jpeg"
        },
        {
            title: "Ópera de Sydney",
            tag: "Sydney, Austrália",
            desc: "Cascas pré-moldadas de concreto em seções esféricas tridimensionais integradas.",
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Sydney_Australia._%2821339175489%29.jpg/1920px-Sydney_Australia._%2821339175489%29.jpg"
        }
    ],
    trelicas: [
        {
            title: "Torre Eiffel",
            tag: "Paris, França",
            desc: "Estrutura reticulada em ferro poçado composta por triângulos articulados submetidos a tração e compressão.",
            img: "https://upload.wikimedia.org/wikipedia/commons/4/49/Torre_Eiffel.jpg?utm_source=pt.wikibooks.org&utm_campaign=index&utm_content=original"
        },
        {
            title: "Ponte Firth of Forth",
            tag: "Edimburgo, Escócia",
            desc: "Ponte em treliça cantilever de grande porte projetada em aço tubular para absorver esforços axiais maciços.",
            img: "https://upload.wikimedia.org/wikipedia/commons/9/9b/Forth_Bridge.jpg"
        },
        {
            title: "Estádio AT&T",
            tag: "Arlington, EUA",
            desc: "Grandes arcos reticulados em treliça espacial de aço suportando a cobertura retrátil de longo vão.",
            img: "https://upload.wikimedia.org/wikipedia/commons/5/52/Cowboys_Stadium_full_view.jpg"
        },
        {
            title: "Centro Heydar Aliyev",
            tag: "Baku, Azerbaijão",
            desc: "Projeto de Zaha Hadid. Malha tridimensional de treliça espacial (space frame) sustentando superfícies orgânicas livres.",
            img: "https://metalica.com.br/wp-content/uploads/2024/01/Heydar-Aliyev-Center-14-600x404.jpg"
        }
    ],
    porticos: [
        {
            title: "MASP",
            tag: "São Paulo, Brasil",
            desc: "Projeto de Lina Bo Bardi. Grande pórtico de concreto armado com vigas protendidas de 74m de vão.",
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Vista_a%C3%A9rea_de_la_Avenida_Paulista_de_S%C3%A3o_Paulo_05.jpg/1920px-Vista_a%C3%A9rea_de_la_Avenida_Paulista_de_S%C3%A3o_Paulo_05.jpg"
        },
        {
            title: "Edifício Crown Hall",
            tag: "Chicago, EUA",
            desc: "Projeto de Mies van der Rohe. Pórticos externos de aço suspendendo a cobertura para criar espaço livre interno.",
            img: "https://en.wikiarquitectura.com/wp-content/uploads/2017/01/Crown-Hall-Mies-1920x1200.jpg"
        }
    ]
};

const currentIndices = {
    cabos: 0,
    membranas: 0,
    arcos: 0,
    superficies: 0,
    trelicas: 0,
    porticos: 0
};

function renderGalleryControls(category) {
    const container = document.getElementById(`controls-${category}`);
    if (!container) return;

    container.innerHTML = '';
    galleryData[category].forEach((item, index) => {
        const btn = document.createElement('button');
        btn.innerText = `${index + 1}. ${item.title}`;
        btn.className = (index === currentIndices[category])
            ? "py-2 px-3 bg-[#80C29D] text-[#0D4334] rounded-xl text-fluid-tag font-bold transition-all text-left shadow-md"
            : "py-2 px-3 bg-white/10 hover:bg-[#80C29D] hover:text-[#0D4334] text-white rounded-xl text-fluid-tag font-bold transition-all text-left";
        btn.onclick = () => selectGalleryItem(category, index);
        container.appendChild(btn);
    });
}

function updateGalleryView(category) {
    const item = galleryData[category][currentIndices[category]];
    const imgEl = document.getElementById(`viewer-${category}-img`);
    const titleEl = document.getElementById(`title-${category}`);
    const tagEl = document.getElementById(`tag-${category}`);
    const indexEl = document.getElementById(`index-${category}`);
    const descEl = document.getElementById(`desc-${category}`);

    if (imgEl) imgEl.style.backgroundImage = `url('${item.img}')`;
    if (titleEl) titleEl.innerText = item.title;
    if (tagEl) tagEl.innerText = item.tag;
    if (indexEl) indexEl.innerText = `Exemplo ${currentIndices[category] + 1} / ${galleryData[category].length}`;
    if (descEl) descEl.innerText = item.desc;

    renderGalleryControls(category);
}

function selectGalleryItem(category, index) {
    currentIndices[category] = index;
    updateGalleryView(category);
}

function navGallery(category, dir) {
    const list = galleryData[category];
    currentIndices[category] = (currentIndices[category] + dir + list.length) % list.length;
    updateGalleryView(category);
}

/**
 * SIMULADOR E MONTADOR INTERATIVO DE TRELIÇAS 2D (SISTEMA DE TRIANGULAÇÃO RÍGIDA)
 */
let trussNodes = [];
let trussBars = [];
let trussCanvas, trussCtx;
let zoomLevel = 1.0;
let panOffset = { x: 0, y: 0 };
let isDraggingPan = false;
let startPan = { x: 0, y: 0 };
let initialTouchDist = 0;
let zoomAnchor = { x: 0, y: 0 };

function resetTrussCanvas() {
    const w = trussCanvas ? trussCanvas.width : 800;
    const h = trussCanvas ? trussCanvas.height : 500;
    
    const baseWidth = Math.min(w * 0.45, 320);
    const centerX = w / 2;
    const baseY = h * 0.85;

    const n1 = { id: 0, x: centerX - baseWidth / 2, y: baseY, isSupport: true };
    const n2 = { id: 1, x: centerX + baseWidth / 2, y: baseY, isSupport: true };
    const n3 = { id: 2, x: centerX, y: baseY - (Math.sqrt(3) / 2) * baseWidth, isSupport: false };

    trussNodes = [n1, n2, n3];
    trussBars = [
        { from: 0, to: 1 },
        { from: 1, to: 2 },
        { from: 2, to: 0 }
    ];

    zoomAnchor = { x: centerX, y: baseY };
    zoomLevel = 1.0;
    panOffset = { x: 0, y: 0 };
    drawTruss();
}

function initTrussCanvas() {
    trussCanvas = document.getElementById('trussCanvas');
    if (!trussCanvas) return;

    const rect = trussCanvas.parentElement.getBoundingClientRect();
    trussCanvas.width = rect.width;
    trussCanvas.height = rect.height;
    trussCtx = trussCanvas.getContext('2d');

    resetTrussCanvas();

    trussCanvas.onmousedown = (e) => {
        if (e.button === 0) {
            const rect = trussCanvas.getBoundingClientRect();
            const clickX = zoomAnchor.x + (e.clientX - rect.left - zoomAnchor.x - panOffset.x) / zoomLevel;
            const clickY = zoomAnchor.y + (e.clientY - rect.top - zoomAnchor.y - panOffset.y) / zoomLevel;

            addNodeToTruss(clickX, clickY);
        } else if (e.button === 2) {
            isDraggingPan = true;
            startPan = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
        }
    };

    trussCanvas.onmousemove = (e) => {
        if (isDraggingPan) {
            panOffset.x = e.clientX - startPan.x;
            panOffset.y = e.clientY - startPan.y;
            drawTruss();
        }
    };

    trussCanvas.onmouseup = () => { isDraggingPan = false; };
    trussCanvas.oncontextmenu = (e) => e.preventDefault();

    trussCanvas.onwheel = (e) => {
        e.preventDefault();
        const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
        zoomLevel = Math.max(0.4, Math.min(3.0, zoomLevel * zoomFactor));
        drawTruss();
    };

    trussCanvas.ontouchstart = (e) => {
        if (e.touches.length === 1) {
            const rect = trussCanvas.getBoundingClientRect();
            const clickX = zoomAnchor.x + (e.touches[0].clientX - rect.left - zoomAnchor.x - panOffset.x) / zoomLevel;
            const clickY = zoomAnchor.y + (e.touches[0].clientY - rect.top - zoomAnchor.y - panOffset.y) / zoomLevel;

            addNodeToTruss(clickX, clickY);
        } else if (e.touches.length === 2) {
            initialTouchDist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
        }
    };

    trussCanvas.ontouchmove = (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            const currentDist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            const factor = currentDist / initialTouchDist;
            zoomLevel = Math.max(0.4, Math.min(3.0, zoomLevel * (factor > 1 ? 1.03 : 0.97)));
            initialTouchDist = currentDist;
            drawTruss();
        }
    };
}

function hasBar(idA, idB) {
    return trussBars.some(b => (b.from === idA && b.to === idB) || (b.from === idB && b.to === idA));
}

function addBar(idA, idB) {
    if (idA !== idB && !hasBar(idA, idB)) {
        trussBars.push({ from: idA, to: idB });
    }
}

function addNodeToTruss(x, y) {
    const newNodeId = trussNodes.length;
    const newNode = { id: newNodeId, x, y, isSupport: false };

    // Ordenar nós por distância ao novo nó
    const sorted = [...trussNodes].sort((a, b) => {
        const dA = Math.hypot(a.x - x, a.y - y);
        const dB = Math.hypot(b.x - x, b.y - y);
        return dA - dB;
    });

    const n1 = sorted[0];
    const n2 = sorted[1];

    trussNodes.push(newNode);

    // 1. Conectar aos dois nós mais próximos
    addBar(n1.id, newNodeId);
    addBar(n2.id, newNodeId);

    // 2. Garantir fechamento de triângulo entre n1 e n2
    if (!hasBar(n1.id, n2.id)) {
        addBar(n1.id, n2.id);
    }

    // 3. Checagem e resolução de polígonos: Se n1 e n2 não possuem barra direta conectando entre si, conecta com o 3º nó mais próximo
    if (sorted.length >= 3) {
        const n3 = sorted[2];
        if (hasBar(n1.id, n3.id) && !hasBar(n2.id, n3.id)) {
            addBar(newNodeId, n3.id);
        }
    }

    drawTruss();
}

function drawTruss() {
    if (!trussCtx || !trussCanvas) return;

    trussCtx.clearRect(0, 0, trussCanvas.width, trussCanvas.height);
    trussCtx.save();

    trussCtx.translate(zoomAnchor.x + panOffset.x, zoomAnchor.y + panOffset.y);
    trussCtx.scale(zoomLevel, zoomLevel);
    trussCtx.translate(-zoomAnchor.x, -zoomAnchor.y);

    // 1. Desenhar Barras (Linhas espessas em preto)
    trussCtx.strokeStyle = '#000000';
    trussCtx.lineWidth = 5;
    trussCtx.lineCap = 'round';

    trussBars.forEach(bar => {
        const nA = trussNodes.find(n => n.id === bar.from);
        const nB = trussNodes.find(n => n.id === bar.to);
        if (nA && nB) {
            trussCtx.beginPath();
            trussCtx.moveTo(nA.x, nA.y);
            trussCtx.lineTo(nB.x, nB.y);
            trussCtx.stroke();
        }
    });

    // 2. Desenhar Apoios de 2º Gênero (Triângulos azuis com hachura)
    trussNodes.filter(n => n.isSupport).forEach(node => {
        const triSize = 20;
        trussCtx.fillStyle = '#2563EB';
        trussCtx.strokeStyle = '#000000';
        trussCtx.lineWidth = 2;

        trussCtx.beginPath();
        trussCtx.moveTo(node.x, node.y);
        trussCtx.lineTo(node.x - triSize, node.y + triSize);
        trussCtx.lineTo(node.x + triSize, node.y + triSize);
        trussCtx.closePath();
        trussCtx.fill();
        trussCtx.stroke();

        trussCtx.strokeStyle = '#000000';
        trussCtx.lineWidth = 3;
        trussCtx.beginPath();
        trussCtx.moveTo(node.x - triSize - 5, node.y + triSize);
        trussCtx.lineTo(node.x + triSize + 5, node.y + triSize);
        trussCtx.stroke();
    });

    // 3. Desenhar Nós (Círculos vermelhos)
    trussNodes.forEach(node => {
        trussCtx.fillStyle = '#E53E3E';
        trussCtx.strokeStyle = '#FFFFFF';
        trussCtx.lineWidth = 2;

        trussCtx.beginPath();
        trussCtx.arc(node.x, node.y, 7, 0, Math.PI * 2);
        trussCtx.fill();
        trussCtx.stroke();
    });

    trussCtx.restore();
}

document.addEventListener('DOMContentLoaded', () => {
    updateGlobalIndicators();
    updateArrowStates();
    Object.keys(galleryData).forEach(cat => updateGalleryView(cat));
});

/**
 * MOTOR DE SIMULAÇÃO REATIVA DE PÓRTICOS MULTI-ANDARES
 */
let currentFrameMode = 'rotulado';

function setFrameType(mode) {
    currentFrameMode = mode;

    ['rotulado', 'rigido', 'contraventado'].forEach(m => {
        const btn = document.getElementById(`btn-frame-${m}`);
        if (btn) {
            btn.className = (m === mode)
                ? "py-2.5 px-4 bg-[#80C29D] text-[#0D4334] rounded-xl text-fluid-tag font-bold transition-all text-left shadow-md"
                : "py-2.5 px-4 bg-white/10 hover:bg-[#80C29D] hover:text-[#0D4334] text-white rounded-xl text-fluid-tag font-bold transition-all text-left";
        }
    });

    updateFrameDeformation();
}

/**
 * MOTOR DE SIMULAÇÃO REATIVA DE PÓRTICOS MULTI-ANDARES
 * Parâmetro Mecânico: Curvatura Parabólica Pura (Vértice na base engastada/fixa)
 */
function updateFrameDeformation() {
    const slider = document.getElementById('frame-force-slider');
    const valDisp = document.getElementById('frame-force-value');
    const titleEl = document.getElementById('frame-sim-title');
    const descEl = document.getElementById('frame-sim-desc');
    const group = document.getElementById('frame-elements-group');

    if (!slider || !group) return;

    const k = parseFloat(slider.value) / 100; // Fator de carga [0.0 a 1.0]
    if (valDisp) valDisp.innerText = `${slider.value}%`;

    // Geometria Base: 3 andares, 2 módulos (Pilares em X = 100, 250, 400)
    // Níveis Y = 300 (Base Engastada), 220 (1º andar), 140 (2º andar), 60 (Topo)
    const x0 = [100, 250, 400];
    const yLevels = [300, 220, 140, 60];
    const pilarColor = "#0D4334";

    let html = '';

    // 1. Engastes na Base (Y = 300)
    x0.forEach(x => {
        html += `
            <line x1="${x - 18}" y1="300" x2="${x + 18}" y2="300" stroke="${pilarColor}" stroke-width="4" />
            <path d="M ${x - 15} 310 L ${x - 5} 300 M ${x - 5} 310 L ${x + 5} 300 M ${x + 5} 310 L ${x + 15} 300" stroke="${pilarColor}" stroke-width="2" />
        `;
    });

    // Função de deformada parabólica pura com vértice no apoio da base (y=300)
    function calcParabolicSway(y, maxSway) {
        const dy = (300 - y) / 240; // Razão de altura normalizada [0 no topo/base até 1 no topo]
        return maxSway * Math.pow(dy, 2);
    }

    if (currentFrameMode === 'rotulado') {
        if (titleEl) titleEl.innerText = "Pórtico com Vigas Rotuladas";
        if (descEl) descEl.innerText = "Maior deslocamento da série. Pilares fletem em parábola pura com vértice no apoio engastado da base. Vigas permanecem retas articuladas nas extremidades.";

        const maxSway = k * 65;
        const dx = yLevels.map(y => calcParabolicSway(y, maxSway));

        // Pilares: Parábola pura gerada via curva Bézier quadrática Q (Vértice e tangente vertical na base)
        x0.forEach(xBase => {
            const pBaseX = xBase, pBaseY = 300;
            const pTopX = xBase + dx[3], pTopY = 60;
            const ctrlX = xBase, ctrlY = 180; // Ponto de controle alinhado verticalmente à base para garantir tangente nula

            html += `<path d="M ${pBaseX} ${pBaseY} Q ${ctrlX} ${ctrlY}, ${pTopX} ${pTopY}" fill="none" stroke="${pilarColor}" stroke-width="6" stroke-linecap="round" />`;
        });

        // Vigas Retas e Rótulas nas Extremidades
        [1, 2, 3].forEach(lvl => {
            const y = yLevels[lvl];
            const rOffset = 8; // Afastamento das rótulas do eixo dos pilares

            const x_v1_start = x0[0] + dx[lvl] + rOffset;
            const x_v1_end = x0[1] + dx[lvl] - rOffset;
            html += `<line x1="${x_v1_start}" y1="${y}" x2="${x_v1_end}" y2="${y}" stroke="${pilarColor}" stroke-width="5" />`;

            const x_v2_start = x0[1] + dx[lvl] + rOffset;
            const x_v2_end = x0[2] + dx[lvl] - rOffset;
            html += `<line x1="${x_v2_start}" y1="${y}" x2="${x_v2_end}" y2="${y}" stroke="${pilarColor}" stroke-width="5" />`;

            const rotulasX = [x_v1_start, x_v1_end, x_v2_start, x_v2_end];
            rotulasX.forEach(rx => {
                html += `<circle cx="${rx}" cy="${y}" r="4.5" fill="#FFFFFF" stroke="${pilarColor}" stroke-width="2" />`;
            });
        });

        // Vetor Carga Topo
        const loadLen = 25 + k * 40;
        const topX = x0[0] + dx[3];
        html += `<line x1="${topX - loadLen}" y1="60" x2="${topX - 4}" y2="60" stroke="#E53E3E" stroke-width="5" marker-end="url(#arrow-red-frame)" />`;
    }
    else if (currentFrameMode === 'rigido') {
        if (titleEl) titleEl.innerText = "Pórtico com Ligações Rígidas";
        if (descEl) descEl.innerText = "Deslocamento intermediário. Conexões rígidas transmitem momentos fletores, forçando curvatura dupla tipo 'S' em vigas e pilares.";

        const maxSway = k * 42;
        const dx = yLevels.map(y => Math.pow((300 - y) / 240, 1.2) * maxSway);

        // Pilares em "S"
        x0.forEach(xBase => {
            for (let i = 0; i < 3; i++) {
                const yA = yLevels[i], yB = yLevels[i + 1];
                const xA = xBase + dx[i], xB = xBase + dx[i + 1];
                html += `<path d="M ${xA} ${yA} C ${xA} ${yA - 30}, ${xB} ${yB + 30}, ${xB} ${yB}" fill="none" stroke="${pilarColor}" stroke-width="6" />`;
            }
        });

        // Vigas em "S"
        [1, 2, 3].forEach(lvl => {
            const y = yLevels[lvl];
            for (let m = 0; m < 2; m++) {
                const xA = x0[m] + dx[lvl], xB = x0[m + 1] + dx[lvl];
                const flex = k * 10;
                html += `<path d="M ${xA} ${y} C ${xA + 30} ${y + flex}, ${xB - 30} ${y - flex}, ${xB} ${y}" fill="none" stroke="${pilarColor}" stroke-width="5" />`;
            }
        });

        // Vetor Carga Topo
        const loadLen = 25 + k * 40;
        const topX = x0[0] + dx[3];
        html += `<line x1="${topX - loadLen}" y1="60" x2="${topX - 4}" y2="60" stroke="#E53E3E" stroke-width="5" marker-end="url(#arrow-red-frame)" />`;
    }
    else if (currentFrameMode === 'contraventado') {
        if (titleEl) titleEl.innerText = "Pórtico Contraventado (Delta Invertido)";
        if (descEl) descEl.innerText = "Menor deslocamento da série. As barras da região contraventada mantêm-se perfeitamente retas. O pilar direito flete em parábola pura com vértice na base.";

        const maxSway = k * 18;
        const dx = yLevels.map(y => calcParabolicSway(y, maxSway));
        const rOffset = 8;

        // 1. Módulo Esquerdo Contraventado: Barras Retas
        for (let i = 0; i < 3; i++) {
            const yA = yLevels[i], yB = yLevels[i + 1];
            const xA1 = x0[0] + dx[i], xB1 = x0[0] + dx[i + 1];
            const xA2 = x0[1] + dx[i], xB2 = x0[1] + dx[i + 1];

            // Pilares esquerdos retos
            html += `<line x1="${xA1}" y1="${yA}" x2="${xB1}" y2="${yB}" stroke="${pilarColor}" stroke-width="6" />`;
            html += `<line x1="${xA2}" y1="${yA}" x2="${xB2}" y2="${yB}" stroke="${pilarColor}" stroke-width="6" />`;

            // Vigas do módulo esquerdo
            const x_v1_start = xB1 + rOffset;
            const x_v1_end = xB2 - rOffset;
            html += `<line x1="${x_v1_start}" y1="${yB}" x2="${x_v1_end}" y2="${yB}" stroke="${pilarColor}" stroke-width="5" />`;
            
            html += `<circle cx="${x_v1_start}" cy="${yB}" r="4.5" fill="#FFFFFF" stroke="${pilarColor}" stroke-width="2" />`;
            html += `<circle cx="${x_v1_end}" cy="${yB}" r="4.5" fill="#FFFFFF" stroke="${pilarColor}" stroke-width="2" />`;

            // Diagonais em Delta Invertido Birrotuladas (Retas)
            const xMidB = (xB1 + xB2) / 2;
            
            const angL = Math.atan2(yA - yB, xA1 - xMidB);
            const dL_startX = xA1 - Math.cos(angL) * rOffset;
            const dL_startY = yA - Math.sin(angL) * rOffset;
            const dL_endX = xMidB + Math.cos(angL) * rOffset;
            const dL_endY = yB + Math.sin(angL) * rOffset;

            const angR = Math.atan2(yA - yB, xA2 - xMidB);
            const dR_startX = xA2 - Math.cos(angR) * rOffset;
            const dR_startY = yA - Math.sin(angR) * rOffset;
            const dR_endX = xMidB + Math.cos(angR) * rOffset;
            const dR_endY = yB + Math.sin(angR) * rOffset;

            html += `<line x1="${dL_startX}" y1="${dL_startY}" x2="${dL_endX}" y2="${dL_endY}" stroke="${pilarColor}" stroke-width="4" />`;
            html += `<line x1="${dR_startX}" y1="${dR_startY}" x2="${dR_endX}" y2="${dR_endY}" stroke="${pilarColor}" stroke-width="4" />`;

            html += `<circle cx="${dL_startX}" cy="${dL_startY}" r="3.5" fill="#FFFFFF" stroke="${pilarColor}" stroke-width="1.5" />`;
            html += `<circle cx="${dR_startX}" cy="${dR_startY}" r="3.5" fill="#FFFFFF" stroke="${pilarColor}" stroke-width="1.5" />`;
            html += `<circle cx="${dL_endX}" cy="${dL_endY}" r="3.5" fill="#FFFFFF" stroke="${pilarColor}" stroke-width="1.5" />`;
            html += `<circle cx="${dR_endX}" cy="${dR_endY}" r="3.5" fill="#FFFFFF" stroke="${pilarColor}" stroke-width="1.5" />`;
        }

        // 2. Pilar Direito Isolado em Parábola Pura (Vértice na base engastada)
        const pRBaseX = x0[2], pRBaseY = 300;
        const pRTopX = x0[2] + dx[3], pRTopY = 60;
        const ctrlX = x0[2], ctrlY = 180;

        html += `<path d="M ${pRBaseX} ${pRBaseY} Q ${ctrlX} ${ctrlY}, ${pRTopX} ${pRTopY}" fill="none" stroke="${pilarColor}" stroke-width="6" stroke-linecap="round" />`;

        // 3. Vigas do Módulo Direito (Retas e Rotuladas)
        [1, 2, 3].forEach(lvl => {
            const y = yLevels[lvl];
            const x_v2_start = x0[1] + dx[lvl] + rOffset;
            const x_v2_end = x0[2] + dx[lvl] - rOffset;
            
            html += `<line x1="${x_v2_start}" y1="${y}" x2="${x_v2_end}" y2="${y}" stroke="${pilarColor}" stroke-width="5" />`;
            html += `<circle cx="${x_v2_start}" cy="${y}" r="4.5" fill="#FFFFFF" stroke="${pilarColor}" stroke-width="2" />`;
            html += `<circle cx="${x_v2_end}" cy="${y}" r="4.5" fill="#FFFFFF" stroke="${pilarColor}" stroke-width="2" />`;
        });

        // Vetor Carga Topo
        const loadLen = 25 + k * 40;
        const topX = x0[0] + dx[3];
        html += `<line x1="${topX - loadLen}" y1="60" x2="${topX - 4}" y2="60" stroke="#E53E3E" stroke-width="5" marker-end="url(#arrow-red-frame)" />`;
    }

    group.innerHTML = html;
}