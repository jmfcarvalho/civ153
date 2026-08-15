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
const totalSlidesHorizontal = 7;

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
 * EXTENSÃO MAIN.JS - AULA 02 (ESTRUTURA DE GRID E SIMULADOR INTERATIVO)
 * ============================================================================
 */

// 1. Atualização do Mapeamento do Grid para a Aula 02
const slideGridAula02 = {
    '0,0': 'slide-capa',
    '1,0': 'slide-ementa',
    '2,0': 'slide-elem-classificacao',
    '2,1': 'slide-elem-1d',
    '2,2': 'slide-elem-2d',
    '2,3': 'slide-elem-3d',
    '3,0': 'slide-esforcos-fundamentais',
    '3,1': 'slide-esforcos-simulador',
    '4,0': 'slide-estabilidade-conceito',
    '4,1': 'slide-estabilidade-vinc',
    '5,0': 'slide-quiz-sincrono',
    '6,0': 'slide-encerramento'
};

// Sobrescreve as chaves do slideGrid se estivermos na Aula 02
if (document.getElementById('slide-elem-classificacao')) {
    Object.keys(slideGrid).forEach(key => delete slideGrid[key]);
    Object.assign(slideGrid, slideGridAula02);
}

// 2. Renderização KaTeX Específica para a Aula 02
document.addEventListener('DOMContentLoaded', () => {
    const estatElem = document.getElementById('katex-eq-estat');
    if (estatElem && window.katex) {
        katex.render("\\sum F_x = 0 \\quad | \\quad \\sum F_y = 0 \\quad | \\quad \\sum M_z = 0", estatElem, {
            throwOnError: false
        });
    }
});

/**
 * ============================================================================
 * BASE DE DADOS E NAVEGAÇÃO DA GALERIA DE ELEMENTOS ESTRUTURAIS (1D, 2D, 3D)
 * ============================================================================
 */

// 1D DATA
const data1D = {
    vigas: [
        {
            title: "Vigas • Vão Livre Monumental",
            tag: "MASP • São Paulo, Brasil",
            desc: "Projeto de Lina Bo Bardi. Duas vigas protendidas de 74m sustentam o edifício suspenso, transmitindo flexão pura e cortante a quatro pilares.",
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Vista_a%C3%A9rea_de_la_Avenida_Paulista_de_S%C3%A3o_Paulo_05.jpg/1920px-Vista_a%C3%A9rea_de_la_Avenida_Paulista_de_S%C3%A3o_Paulo_05.jpg"
        },
        {
            title: "Vigas Caixão • Grande Porte Fluvial",
            tag: "Ponte Rio-Niterói • Rio de Janeiro, Brasil",
            desc: "Vão central em viga caixão de aço com 300m de comprimento. A seção tubular otimiza a rigidez à torção e minimiza o peso próprio.",
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Bridge_to_Niteroi.jpg/1920px-Bridge_to_Niteroi.jpg"
        },
        {
            title: "Vigas Bipoiadas em Balanço • The Link",
            tag: "One Za'abeel • Dubai, EAU",
            desc: "O maior edifício em balanço do mundo. Uma viga treliçada espacial de aço com 230m de extensão suspensa a 100m de altura sobre duas torres.",
            img: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/One_Za%27abeel_20241102.jpg/960px-One_Za%27abeel_20241102.jpg"
        },
        {
            title: "Vigas em Balanço • Cantilever Orgânico",
            tag: "Fallingwater (Casa da Cascata) • Pensilvânia, EUA",
            desc: "Projeto de Frank Lloyd Wright. Vigas e lajes de concreto armado em grande balanço ancoradas na rocha, projetando-se diretamente sobre a cachoeira.",
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Fallingwater3.jpg/1920px-Fallingwater3.jpg"
        }
    ],
    pilares: [
        {
            title: "Pilares • Colunas Clássicas Comprimidas",
            tag: "Partenon • Atenas, Grécia",
            desc: "432 a.C. Colunas de mármore trabalhando sob compressão pura para transmitir as cargas do entablamento diretamente à fundação.",
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/The_Parthenon_in_Athens.jpg/1280px-The_Parthenon_in_Athens.jpg"
        },
        {
            title: "Pilares • Seção Escultural Comprimida",
            tag: "Palácio da Alvorada • Brasília, Brasil",
            desc: "Projeto de Oscar Niemeyer. Pilares de concreto armado com formato curvo esbelto trabalhando sob compressão com baixa excentricidade.",
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Bras%C3%ADlia_-_Pal%C3%A1cio_do_Planalto_em_2018_02.jpg/1280px-Bras%C3%ADlia_-_Pal%C3%A1cio_do_Planalto_em_2018_02.jpg"
        }
    ],
    tirantes: [
        {
            title: "Tirantes • Ponte Estaiada Simétrica",
            tag: "Viaduto de Millau • França",
            desc: "Projeto de Michel Virlogeux e Norman Foster. Cabos/tirantes de aço de alta resistência sob tração pura transferem as cargas do tabuleiro para os mastros.",
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Creissels_et_Viaduct_de_Millau.jpg/1920px-Creissels_et_Viaduct_de_Millau.jpg"
        },
        {
            title: "Tirantes • Cobertura Tensa de Cabos",
            tag: "Estádio Olímpico de Munique • Alemanha",
            desc: "Projeto de Frei Otto. Rede de cabos de aço trabalhando como tirantes tracionados para suspender uma membrana contínua de acrílico em grandes vãos.",
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/2022-08-21_Olympiapark_M%C3%BCnchen_by_Sandro_Halank%E2%80%93025.jpg/1920px-2022-08-21_Olympiapark_M%C3%BCnchen_by_Sandro_Halank%E2%80%93025.jpg"
        },
        {
            title: "Tirantes • Pilone Inclinado Assimétrico",
            tag: "Ponte Erasmo (Erasmusbrug) • Roterdã, Holanda",
            desc: "Projeto de Ben van Berkel. Um pilone assimétrico dobrado sustenta 40 tirantes de aço em leque, trabalhando estritamente sob tração axial.",
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Rotterdam_erasmusbrug.jpg/1280px-Rotterdam_erasmusbrug.jpg"
        }
    ],
    cabos: [
        {
            title: "Cabos • Suspensão Funicular Principal",
            tag: "Ponte Golden Gate • São Francisco, EUA",
            desc: "Projeto de Joseph Strauss. Cabos de aço flexionáveis compostos trabalhando sob tração pura invariável, adaptando a forma à curva funicular das cargas.",
            img: "https://upload.wikimedia.org/wikipedia/commons/0/0c/GoldenGateBridge-001.jpg"
        },
        {
            title: "Cabos • Passarela Pênsil Estaiada",
            tag: "Passarela Frankenberg • Alemanha",
            desc: "Estrutura leve suspensa por cabos de aço tracionados que transmitem as cargas dos pedestres diretamente aos mastros das extremidades.",
            img: "https://www.sbp.de/app/uploads/2021/12/LGS-F-80-2019_MAX.jpg"
        },
        {
            title: "Cabos • Paraboloide Hiperbólico Tenso",
            tag: "Pavilhão Philips (Expo 58) • Bruxelas, Bélgica",
            desc: "Projeto de Le Corbusier e Iannis Xenakis. Rede de cabos de aço tracionados cruzados sustentando painéis delgados em formato de superfícies de curvatura dupla.",
            img: "https://www.summum.engineering/wp-content/uploads/2024/07/Philips-Pavilion_Aerial_View_2024-05-31_crop-scaled.jpg"
        }
    ],
};

const data2D = {
    placas: [
        {
            title: "Placas • Laje Ondulada de Cobertura",
            tag: "Museu de Arte do Rio (MAR) • Rio de Janeiro, Brasil",
            desc: "Projeto do Bernardes + Jacobsen Arquitetura. Cobertura fluida de concreto armado em forma de onda sustentada por pilares, trabalhando como placa submetida a flexão e cortante.",
            img: "https://upload.wikimedia.org/wikipedia/commons/c/c2/Museu_de_Arte_do_Rio_1.jpg"
        },
        {
            title: "Placas • Lajes Planas Delgadas sobre Pilares",
            tag: "Pavilhão Alemão • Barcelona, Espanha",
            desc: "Projeto de Mies van der Rohe (1929). Cobertura plana em placa de concreto armado delgada sustentada por oito colunas metálicas em cruz, recebendo cargas perpendiculares ao plano.",
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/The_Barcelona_Pavilion%2C_Barcelona%2C_2010.jpg/1920px-The_Barcelona_Pavilion%2C_Barcelona%2C_2010.jpg"
        },
        {
            title: "Placas • Laje Suspensa em Catenária",
            tag: "Pavilhão de Portugal (Expo 98) • Lisboa, Portugal",
            desc: "Projeto de Álvaro Siza Vieira. Uma lâmina/placa delgada de concreto armado de apenas 20cm de espessura suspensa em catenária venço um vão livre de 70 metros.",
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Pavilh%C3%A3o_de_Portugal_4.JPG/1280px-Pavilh%C3%A3o_de_Portugal_4.JPG"
        }
    ],
   chapas: [
        {
            title: "Chapas • Passarelas e Paredes de Transição",
            tag: "SESC Pompeia • São Paulo, Brasil",
            desc: "Projeto de Lina Bo Bardi. Blocos e passarelas de concreto que funcionam como grandes vigas-parede (chapas), submetidas a esforços contidos no próprio plano médio.",
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/SESCPompeia3.jpg/1280px-SESCPompeia3.jpg"
        },
        {
            title: "Chapas • Balanço Estrutural em Chapa de Concreto",
            tag: "Galeria Adriana Varejão (Inhotim) • Brumadinho, Brasil",
            desc: "Projeto de Rodrigo Cerviño Lopez. Bloco de concreto aparente suspenso sobre espelho d'água, onde as paredes atuam como chapas estruturais para suportar o grande balanço.",
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Instituto_Cultural_Inhotim_Pavillion.jpg/1920px-Instituto_Cultural_Inhotim_Pavillion.jpg"
        },
    ],
    cascas: [
        {
            title: "Cascas • Cúpula Delgada Funicular",
            tag: "Oca do Ibirapuera • São Paulo, Brasil",
            desc: "Projeto de Oscar Niemeyer e engenharia de Joaquim Cardozo. Cúpula hemisférica delgada de concreto armado que transfere cargas por esforços de compressão distribuídos no plano da membrana.",
            img: "https://upload.wikimedia.org/wikipedia/commons/6/66/OCA_-_IBIRAPUERA_02.jpg"
        },
        {
            title: "Cascas • Conoides Triangulares de Concreto",
            tag: "Ópera de Sydney • Sydney, Austrália",
            desc: "Projeto de Jørn Utzon e engenharia da Ove Arup. As icônicas conchas são seções triangulares de esferas (cascas de concreto pré-moldado) que transferem os esforços por geometria espacial.",
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Sydney_Australia._%2821339175489%29.jpg/1920px-Sydney_Australia._%2821339175489%29.jpg"
        },
        {
            title: "Cascas • Paraboloides Hiperbólicos Abóbadas",
            tag: "Igreja de São Francisco de Assis (Pampulha) • Belo Horizonte, Brasil",
            desc: "Projeto de Oscar Niemeyer com cálculo de Joaquim Cardozo. Abóbadas parabólicas delgadas em concreto armado que associam função estritamente estrutural e vedação.",
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Igrejinha_de_S%C3%A3o_Francisco_de_Assis_6.jpeg/960px-Igrejinha_de_S%C3%A3o_Francisco_de_Assis_6.jpeg"
        },
        {
            title: "Cascas • Paraboloides Hiperbólicos delgados",
            tag: "Restaurante Los Manantiales • Cidade do México, México",
            desc: "Projeto do mestre Félix Candela (1958). Estrutura formada pela intersecção de quatro paraboloides hiperbólicos (hypar) em concreto com espessura mínima de apenas 4cm.",
            img: "https://upload.wikimedia.org/wikipedia/commons/5/59/Restaurante_Los_Manantiales_07.jpg"
        }
    ],
};

const data3D = {
    fundacao: [
        {
            title: "Blocos de Fundação • Transferência",
            tag: "Blocos de Concreto Massivo",
            desc: "Elementos volumétricos onde as tensões de compressão se distribuem internamente em biela e tirante 3D.",
            img: "https://5.imimg.com/data5/SELLER/Default/2020/9/QW/YH/PU/81100593/precast-concrete-foundations-500x500.jpg"
        }
    ],
    sapatas: [
        {
            title: "Sapatas Massivas • Apoio Rígido",
            tag: "Sapatas de Grande Porte",
            desc: "Volume tridimensional flexo-comprimido projetado para distribuir cargas concentradas de pilares.",
            img: "https://www.cwpconcrete.com/wp-content/uploads/2025/07/CWP-socials-square-1000x1000.png"
        }
    ],
    barragens: [
        {
            title: "Barragens • Estruturas Gravidade",
            tag: "Usina Hidrelétrica de Itaipu • Brasil/Paraguai",
            desc: "Estruturas com 3 dimensões equivalentes. O volume e o peso próprio do concreto contêm o empuxo da água.",
            img: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Usina_Hidroel%C3%A9trica_Itaipu_Binacional_-_Itaipu_Dam_%2817359159332%29.jpg"
        }
    ]
};

function updateViewer(dim, data) {
    const box = document.getElementById(`viewer-${dim}-img`);
    const title = document.getElementById(`title-${dim}`);
    const tag = document.getElementById(`tag-${dim}`);
    const index = document.getElementById(`index-${dim}`);
    const desc = document.getElementById(`desc-${dim}`);

    if (box && data) {
        box.style.backgroundImage = `url('${data.img}')`;
        if (title) title.innerText = data.title;
        if (tag) tag.innerText = data.tag;
        if (desc) desc.innerText = data.desc;
    }
}

// 1D CONTROLS
function show1DExample(type) {
    curType1D = type;
    curIndex1D = 0;
    
    // Atualiza o estado ativo dos botões laterais
    ['vigas', 'pilares', 'tirantes', 'cabos'].forEach(t => {
        const btn = document.getElementById(`btn-1d-${t}`);
        if (btn) {
            btn.className = (t === type) 
                ? "py-2.5 px-4 bg-[#80C29D] text-[#0D4334] rounded-xl text-fluid-tag font-bold transition-all text-left uppercase shadow-md" 
                : "py-2.5 px-4 bg-white/10 hover:bg-[#80C29D] hover:text-[#0D4334] text-white rounded-xl text-fluid-tag font-bold transition-all text-left uppercase";
        }
    });

    const list = data1D[type];
    const indexEl = document.getElementById('index-1d');
    if (indexEl) indexEl.innerText = `Exemplo 1 / ${list.length}`;
    
    updateViewer('1d', list[0]);
}

function nav1DSlide(dir) {
    const list = data1D[curType1D];
    curIndex1D = (curIndex1D + dir + list.length) % list.length;
    const el = document.getElementById('index-1d');
    if (el) el.innerText = `Exemplo ${curIndex1D + 1} / ${list.length}`;
    updateViewer('1d', list[curIndex1D]);
}

// 2D CONTROLS
function show2DExample(type) {
    curType2D = type;
    curIndex2D = 0;
    
    ['placas', 'chapas', 'cascas'].forEach(t => {
        const btn = document.getElementById(`btn-2d-${t}`);
        if (btn) {
            btn.className = (t === type) 
                ? "py-2.5 px-4 bg-[#80C29D] text-[#0D4334] rounded-xl text-fluid-tag font-bold transition-all text-left shadow-md" 
                : "py-2.5 px-4 bg-white/10 hover:bg-[#80C29D] hover:text-[#0D4334] text-white rounded-xl text-fluid-tag font-bold transition-all text-left";
        }
    });

    const list = data2D[type];
    const indexEl = document.getElementById('index-2d');
    if (indexEl) indexEl.innerText = `Exemplo 1 / ${list.length}`;
    
    updateViewer('2d', list[0]);
}

function nav2DSlide(dir) {
    const list = data2D[curType2D];
    curIndex2D = (curIndex2D + dir + list.length) % list.length;
    const el = document.getElementById('index-2d');
    if (el) el.innerText = `Exemplo ${curIndex2D + 1} / ${list.length}`;
    updateViewer('2d', list[curIndex2D]);
}

// 3D CONTROLS
function show3DExample(type) {
    curType3D = type;
    curIndex3D = 0;
    ['fundacao', 'sapatas', 'barragens'].forEach(t => {
        const btn = document.getElementById(`btn-3d-${t}`);
        if (btn) btn.className = t === type ? "py-2.5 px-4 bg-[#80C29D] text-[#0D4334] rounded-xl text-fluid-tag font-bold transition-all text-left uppercase shadow-md" : "py-2.5 px-4 bg-white/10 hover:bg-[#80C29D] hover:text-[#0D4334] text-white rounded-xl text-fluid-tag font-bold transition-all text-left uppercase";
    });
    const list = data3D[type];
    const el = document.getElementById('index-3d');
    if (el) el.innerText = `Exemplo 1 / ${list.length}`;
    updateViewer('3d', list[0]);
}

function nav3DSlide(dir) {
    const list = data3D[curType3D];
    curIndex3D = (curIndex3D + dir + list.length) % list.length;
    const el = document.getElementById('index-3d');
    if (el) el.innerText = `Exemplo ${curIndex3D + 1} / ${list.length}`;
    updateViewer('3d', list[curIndex3D]);
}

/**
 * ============================================================================
 * MOTOR REATIVO DO SIMULADOR DE ESFORÇOS (SICON - CIV 153)
 * ============================================================================
 */

let currentEffortMode = 'tracao';

function setEffortType(mode) {
    currentEffortMode = mode;
    
    // Atualização dos estados de foco dos botões
    ['tracao', 'compressao', 'flexao', 'cisalhamento'].forEach(m => {
        const btn = document.getElementById(`btn-${m}`);
        if (btn) {
            if (m === mode) {
                btn.className = "py-2.5 px-4 bg-[#80C29D] text-[#0D4334] rounded-xl text-fluid-tag font-bold transition-all text-left uppercase shadow-md";
            } else {
                btn.className = "py-2.5 px-4 bg-white/10 hover:bg-[#80C29D] hover:text-[#0D4334] text-white rounded-xl text-fluid-tag font-bold transition-all text-left uppercase";
            }
        }
    });

    updateDeformation();
}

function updateDeformation() {
    const slider = document.getElementById('intensity-slider');
    const valueDisp = document.getElementById('intensity-value');
    const titleEl = document.getElementById('effort-title');
    const descEl = document.getElementById('effort-desc');
    const beam = document.getElementById('beam-body');
    const vectorGroup = document.getElementById('vector-arrows');

    if (!slider || !beam || !vectorGroup) return;

    // Fator escalar do slider [0.0 = repouso / esforço zero | 1.0 = deformação máxima]
    const k = parseFloat(slider.value) / 100;
    if (valueDisp) valueDisp.innerText = `${slider.value}%`;

    // Quadrado Neutro em Repouso: Largura = 180px, Altura = 180px (Centro: X=250, Y=150)
    const centerX = 250;
    const centerY = 150;
    const halfSize = 90;

    if (currentEffortMode === 'tracao') {
        if (titleEl) titleEl.innerText = "Tração Pura (Alongamento Axial)";
        if (descEl) descEl.innerText = "Vetores em vermelho afastam as faces laterais. O quadrado se alonga horizontalmente e sofre estricção no sentido vertical proporcionalmente à carga aplicada.";

        const deltaX = k * 65; // Expansão horizontal
        const deltaY = k * 35; // Contração vertical

        const x1 = centerX - halfSize - deltaX;
        const x2 = centerX + halfSize + deltaX;
        const y1 = centerY - halfSize + deltaY;
        const y2 = centerY + halfSize - deltaY;

        beam.setAttribute('points', `${x1},${y1} ${x2},${y1} ${x2},${y2} ${x1},${y2}`);

        const arrowLen = 35 + k * 25;
        vectorGroup.innerHTML = `
            <line x1="${x1}" y1="${centerY}" x2="${x1 - arrowLen}" y2="${centerY}" stroke="#E53E3E" stroke-width="5" marker-end="url(#arrow-red)" />
            <line x1="${x2}" y1="${centerY}" x2="${x2 + arrowLen}" y2="${centerY}" stroke="#E53E3E" stroke-width="5" marker-end="url(#arrow-red)" />
        `;
    } 
    else if (currentEffortMode === 'compressao') {
        if (titleEl) titleEl.innerText = "Compressão Axial (Encurtamento Longitudinal)";
        if (descEl) descEl.innerText = "Vetores em vermelho pressionam as faces laterais. O sólido encurta no sentido da carga e expande transversalmente no sentido vertical.";

        const deltaX = k * 50; // Contração horizontal
        const deltaY = k * 45; // Expansão vertical

        const x1 = centerX - halfSize + deltaX;
        const x2 = centerX + halfSize - deltaX;
        const y1 = centerY - halfSize - deltaY;
        const y2 = centerY + halfSize + deltaY;

        beam.setAttribute('points', `${x1},${y1} ${x2},${y1} ${x2},${y2} ${x1},${y2}`);

        const arrowLen = 35 + k * 25;
        vectorGroup.innerHTML = `
            <line x1="${x1 - arrowLen}" y1="${centerY}" x2="${x1}" y2="${centerY}" stroke="#E53E3E" stroke-width="5" marker-end="url(#arrow-red)" />
            <line x1="${x2 + arrowLen}" y1="${centerY}" x2="${x2}" y2="${centerY}" stroke="#E53E3E" stroke-width="5" marker-end="url(#arrow-red)" />
        `;
    } 
    else if (currentEffortMode === 'flexao') {
        if (titleEl) titleEl.innerText = "Flexão Pura (Curvatura por Momento Fletor)";
        if (descEl) descEl.innerText = "Binários de momento fletor (arcos vermelhos) giram as seções extremas, comprimindo as fibras superiores e tracionando as inferiores.";

        // Inclinação das bordas laterais por momento
        const rotX = k * 40;
        const x1_top = centerX - halfSize + rotX;
        const x2_top = centerX + halfSize - rotX;
        const x1_bot = centerX - halfSize - rotX;
        const x2_bot = centerX + halfSize + rotX;

        beam.setAttribute('points', `${x1_top},60 ${x2_top},60 ${x2_bot},240 ${x1_bot},240`);

        const r = 22; // Raio compacto do arco de momento
        vectorGroup.innerHTML = `
            <!-- Arco Anti-horário Esquerdo -->
            <g transform="translate(${x1_top - 25}, ${centerY})">
                <path d="M 0 ${r} A ${r} ${r} 0 1 1 ${r} -${r/2}" fill="none" stroke="#E53E3E" stroke-width="4" marker-end="url(#arrow-red)" />
            </g>
            <!-- Arco Horário Direito -->
            <g transform="translate(${x2_top + 25}, ${centerY})">
                <path d="M 0 ${r} A ${r} ${r} 0 1 0 -${r} -${r/2}" fill="none" stroke="#E53E3E" stroke-width="4" marker-end="url(#arrow-red)" />
            </g>
        `;
    } 
    else if (currentEffortMode === 'cisalhamento') {
        if (titleEl) titleEl.innerText = "Cisalhamento (Distorção Angular)";
        if (descEl) descEl.innerText = "Forças verticais paralelas em sentidos opostos (esquerda para cima, direita para baixo) deslizam as seções verticais gerando distorção no elemento.";

        const shiftY = k * 45; // Deslocamento tangencial relativo

        const x1 = centerX - halfSize;
        const x2 = centerX + halfSize;
        const y1_left = 60 - shiftY;
        const y2_left = 240 - shiftY;
        const y1_right = 60 + shiftY;
        const y2_right = 240 + shiftY;

        beam.setAttribute('points', `${x1},${y1_left} ${x2},${y1_right} ${x2},${y2_right} ${x1},${y2_left}`);

        const arrowLen = 50 + k * 15;
        vectorGroup.innerHTML = `
            <line x1="${x1 - 25}" y1="${centerY - shiftY + arrowLen/2}" x2="${x1 - 25}" y2="${centerY - shiftY - arrowLen/2}" stroke="#E53E3E" stroke-width="5" marker-end="url(#arrow-red)" />
            <line x1="${x2 + 25}" y1="${centerY + shiftY - arrowLen/2}" x2="${x2 + 25}" y2="${centerY + shiftY + arrowLen/2}" stroke="#E53E3E" stroke-width="5" marker-end="url(#arrow-red)" />
        `;
    }
}

// Inicialização segura no carregamento do DOM
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('intensity-slider')) {
        updateDeformation();
    }
});

/**
 * ============================================================================
 * MOTOR DE SIMULAÇÃO REATIVA DE VINCULAÇÕES (CIV 153 - AULA 02)
 * ============================================================================
 */

let currentSupportGenre = 1;

function setSupportType(genre) {
    currentSupportGenre = genre;

    [1, 2, 3].forEach(g => {
        const btn = document.getElementById(`btn-support-${g}`);
        if (btn) {
            if (g === genre) {
                btn.className = "py-2.5 px-4 bg-[#80C29D] text-[#0D4334] rounded-xl text-fluid-tag font-bold transition-all text-left uppercase shadow-md";
            } else {
                btn.className = "py-2.5 px-4 bg-white/10 hover:bg-[#80C29D] hover:text-[#0D4334] text-white rounded-xl text-fluid-tag font-bold transition-all text-left uppercase";
            }
        }
    });

    updateSupportSimulation();
}

function updateSupportSimulation() {
    const slider = document.getElementById('support-intensity-slider');
    const valueDisp = document.getElementById('support-intensity-value');
    const titleEl = document.getElementById('support-title');
    const descEl = document.getElementById('support-desc');
    const group = document.getElementById('support-elements-group');

    if (!slider || !group) return;

    const k = parseFloat(slider.value) / 100; // Fator de escala [0.0 a 1.0]
    if (valueDisp) valueDisp.innerText = `${slider.value}%`;

    // Geometria de Referência
    const basePinX = 180;
    const basePinY = 200;
    const barLength = 220;
    const barThick = 12;

    if (currentSupportGenre === 1) {
        if (titleEl) titleEl.innerText = "1º Gênero (Apoio Móvel - Liberação Horizontal)";
        if (descEl) descEl.innerText = "A força inclinada gera translação do apoio/barra para a esquerda e rotação no pino. Desenvolve-se apenas a reação vertical Vy (vermelho).";

        const shiftX = k * 70;
        const pinX = basePinX - shiftX;
        const pinY = basePinY;

        const angleRad = (k * 18 * Math.PI) / 180;
        const barEndX = pinX + barLength * Math.cos(angleRad);
        const barEndY = pinY + barLength * Math.sin(angleRad);

        // Geometria da Carga P (Inclinada com Altura > Largura e Topo à Direita)
        const deltaX = 20 + k * 20; // Componente horizontal menor
        const deltaY = 45 + k * 45; // Componente vertical maior (altura > largura)
        const loadStartX = barEndX + deltaX; // Extremidade superior à DIREITA da inferior
        const loadStartY = barEndY - deltaY;

        const reactLen = 25 + k * 50;

        group.innerHTML = `
            <!-- Linha de Referência do Plano -->
            <line x1="50" y1="262" x2="520" y2="262" stroke="#A1A1A1" stroke-width="2" stroke-dasharray="4 4" />
            
            <!-- Linha Paralela do Apoio Móvel -->
            <line x1="${pinX - 45}" y1="250" x2="${pinX + 45}" y2="250" stroke="#000000" stroke-width="4" />
            <line x1="${pinX - 55}" y1="258" x2="${pinX + 55}" y2="258" stroke="#000000" stroke-width="2" />

            <!-- Triângulo do Apoio -->
            <polygon points="${pinX},${pinY} ${pinX - 30},250 ${pinX + 30},250" fill="#FFFFFF" stroke="#000000" stroke-width="4" stroke-linejoin="round" />
            <circle cx="${pinX}" cy="${pinY}" r="5" fill="#000000" />

            <!-- Barra Azul em Rotação -->
            <line x1="${pinX}" y1="${pinY}" x2="${barEndX}" y2="${barEndY}" stroke="#2563EB" stroke-width="${barThick}" stroke-linecap="round" />

            <!-- Carga Inclinada P (Preto, Topo à Direita, Altura > Largura) -->
            <line x1="${loadStartX}" y1="${loadStartY}" x2="${barEndX}" y2="${barEndY}" stroke="#000000" stroke-width="5" marker-end="url(#arrow-black-sup)" />
            <text x="${loadStartX + 5}" y="${loadStartY - 5}" fill="#000000" font-family="Roboto" font-weight="bold" font-size="14">P</text>

            <!-- Reação Vertical Vy (Vermelho) -->
            ${k > 0 ? `
                <line x1="${pinX}" y1="${258 + reactLen}" x2="${pinX}" y2="260" stroke="#E53E3E" stroke-width="5" marker-end="url(#arrow-red-sup)" />
                <text x="${pinX + 12}" y="${260 + reactLen / 2}" fill="#E53E3E" font-family="Roboto" font-weight="bold" font-size="14">V_y</text>
            ` : ''}
        `;
    } 
    else if (currentSupportGenre === 2) {
        if (titleEl) titleEl.innerText = "2º Gênero (Apoio Fixo - Restrição de Translações)";
        if (descEl) descEl.innerText = "O apoio permanece fixo. A carga inclinada gera rotação na barra e desperta as reações Vy e Vx para a direita (vermelho).";

        const pinX = basePinX;
        const pinY = basePinY;

        const angleRad = (k * 18 * Math.PI) / 180;
        const barEndX = pinX + barLength * Math.cos(angleRad);
        const barEndY = pinY + barLength * Math.sin(angleRad);

        // Geometria da Carga P (Inclinada com Altura > Largura e Topo à Direita)
        const deltaX = 20 + k * 20;
        const deltaY = 45 + k * 45;
        const loadStartX = barEndX + deltaX;
        const loadStartY = barEndY - deltaY;

        const reactLenY = 25 + k * 50;
        const reactLenX = 20 + k * 40;

        group.innerHTML = `
            <!-- Triângulo do Apoio com Hachuras -->
            <polygon points="${pinX},${pinY} ${pinX - 30},250 ${pinX + 30},250" fill="#FFFFFF" stroke="#000000" stroke-width="4" stroke-linejoin="round" />
            <line x1="${pinX - 40}" y1="250" x2="${pinX + 40}" y2="250" stroke="#000000" stroke-width="4" />
            
            <path d="M ${pinX-35} 260 L ${pinX-25} 250 M ${pinX-20} 260 L ${pinX-10} 250 M ${pinX-5} 260 L ${pinX+5} 250 M ${pinX+10} 260 L ${pinX+20} 250 M ${pinX+25} 260 L ${pinX+35} 250" stroke="#000000" stroke-width="2" stroke-linecap="round" />
            <circle cx="${pinX}" cy="${pinY}" r="5" fill="#000000" />

            <!-- Barra Azul em Rotação -->
            <line x1="${pinX}" y1="${pinY}" x2="${barEndX}" y2="${barEndY}" stroke="#2563EB" stroke-width="${barThick}" stroke-linecap="round" />

            <!-- Carga Inclinada P (Preto) -->
            <line x1="${loadStartX}" y1="${loadStartY}" x2="${barEndX}" y2="${barEndY}" stroke="#000000" stroke-width="5" marker-end="url(#arrow-black-sup)" />
            <text x="${loadStartX + 5}" y="${loadStartY - 5}" fill="#000000" font-family="Roboto" font-weight="bold" font-size="14">P</text>

            <!-- Reações (Vy e Vx Apontada para a Direita) -->
            ${k > 0 ? `
                <!-- Reação Vertical Vy -->
                <line x1="${pinX}" y1="${250 + reactLenY}" x2="${pinX}" y2="252" stroke="#E53E3E" stroke-width="5" marker-end="url(#arrow-red-sup)" />
                <text x="${pinX + 12}" y="${250 + reactLenY / 2}" fill="#E53E3E" font-family="Roboto" font-weight="bold" font-size="14">V_y</text>
                
                <!-- Reação Horizontal Vx (Apontando para a Direita) -->
                <line x1="${pinX - reactLenX}" y1="${pinY}" x2="${pinX}" y2="${pinY}" stroke="#E53E3E" stroke-width="5" marker-end="url(#arrow-red-sup)" />
                <text x="${pinX - reactLenX - 35}" y="${pinY - 10}" fill="#E53E3E" font-family="Roboto" font-weight="bold" font-size="14">V_x</text>
            ` : ''}
        `;
    } 
    else if (currentSupportGenre === 3) {
        if (titleEl) titleEl.innerText = "3º Gênero (Apoio Engastado - Restrição Total)";
        if (descEl) descEl.innerText = "Sem deslocamentos ou rotações. Surgem reações Vy, Vx (para a direita) e Momento Reator Anti-Horário M (vermelho) para equilibrar a carga P.";

        const wallX = basePinX;
        const barStartY = basePinY;
        const barEndX = wallX + barLength;
        const barEndY = barStartY;

        // Geometria da Carga P (Inclinada com Altura > Largura e Topo à Direita)
        const deltaX = 20 + k * 20;
        const deltaY = 45 + k * 45;
        const loadStartX = barEndX + deltaX;
        const loadStartY = barEndY - deltaY;

        const reactLenY = 25 + k * 50;
        const reactLenX = 20 + k * 40;
        const arcR = 22 + k * 12;

        group.innerHTML = `
            <!-- Parede Engastada (Preto) -->
            <line x1="${wallX}" y1="120" x2="${wallX}" y2="280" stroke="#000000" stroke-width="5" />
            <path d="M ${wallX-15} 135 L ${wallX} 120 M ${wallX-15} 165 L ${wallX} 150 M ${wallX-15} 195 L ${wallX} 180 M ${wallX-15} 225 L ${wallX} 210 M ${wallX-15} 255 L ${wallX} 240 M ${wallX-15} 285 L ${wallX} 270" stroke="#000000" stroke-width="2.5" stroke-linecap="round" />

            <!-- Barra Azul Rígida -->
            <line x1="${wallX}" y1="${barStartY}" x2="${barEndX}" y2="${barEndY}" stroke="#2563EB" stroke-width="${barThick}" stroke-linecap="square" />

            <!-- Carga Inclinada P (Preto) -->
            <line x1="${loadStartX}" y1="${loadStartY}" x2="${barEndX}" y2="${barEndY}" stroke="#000000" stroke-width="5" marker-end="url(#arrow-black-sup)" />
            <text x="${loadStartX + 5}" y="${loadStartY - 5}" fill="#000000" font-family="Roboto" font-weight="bold" font-size="14">P</text>

            <!-- Reações Reatoras Em Vermelho (Vy, Vx e Momento Anti-Horário M) -->
            ${k > 0 ? `
                <!-- Reação Vertical Vy -->
                <line x1="${wallX + 25}" y1="${barStartY + reactLenY}" x2="${wallX + 25}" y2="${barStartY + 10}" stroke="#E53E3E" stroke-width="5" marker-end="url(#arrow-red-sup)" />
                <text x="${wallX + 35}" y="${barStartY + reactLenY / 2}" fill="#E53E3E" font-family="Roboto" font-weight="bold" font-size="14">V_y</text>
                
                <!-- Reação Horizontal Vx (Apontando para a Direita) -->
                <line x1="${wallX - reactLenX}" y1="${barStartY + 25}" x2="${wallX}" y2="${barStartY + 25}" stroke="#E53E3E" stroke-width="5" marker-end="url(#arrow-red-sup)" />
                <text x="${wallX - reactLenX - 35}" y="${barStartY + 30}" fill="#E53E3E" font-family="Roboto" font-weight="bold" font-size="14">V_x</text>

                <!-- Momento Reator Anti-Horário M (Corrigido para Equilíbrio Estático) -->
                <g transform="translate(${wallX + 35}, ${barStartY - 25})">
                    <path d="M ${arcR} 0 A ${arcR} ${arcR} 0 1 0 -${arcR} 0" fill="none" stroke="#E53E3E" stroke-width="4" marker-end="url(#arrow-red-sup)" />
                    <text x="${arcR + 6}" y="5" fill="#E53E3E" font-family="Roboto" font-weight="bold" font-size="14">M</text>
                </g>
            ` : ''}
        `;
    }
}

// Inicialização segura no carregamento do DOM
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('support-intensity-slider')) {
        updateSupportSimulation();
    }
});

