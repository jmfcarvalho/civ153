/* ============================================================================
           1. 2D NAVIGATION MATRIX ENGINE (SLIDE GRID AULA 04)
           ============================================================================ */
        const slideGridAula04 = {
            '0,0': 'slide-capa',
            '1,0': 'slide-ementa',
            '2,0': 'slide-conceitos',
            '2,1': 'slide-conceitos-glossario',
            '3,0': 'slide-momento-estatico',
            '3,1': 'slide-momento-estatico-exemplo',
            '4,0': 'slide-centroide',
            '4,1': 'slide-centroide-figuras',
            '5,0': 'slide-simetria',
            '5,1': 'slide-simetria-casos',
            '6,0': 'slide-compostas',
            '6,1': 'slide-compostas-lab',
            '7,0': 'slide-exercicios',
            '7,1': 'slide-ex1',
            '7,2': 'slide-ex2',
            '8,0': 'slide-quiz',
            '9,0': 'slide-encerramento'
        };

        let currentX = 0;
        let currentY = 0;
        const totalSlidesHorizontal = 10;

        function hasSlide(x, y) {
            return !!slideGridAula04[`${x},${y}`];
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
                const currentElement = document.getElementById(slideGridAula04[`${currentX},${currentY}`]);
                const nextElement = document.getElementById(slideGridAula04[`${nextX},${nextY}`]);

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

                    // Re-render KaTeX if new slide is shown
                    if (window.renderMathInElement) {
                        renderMathInElement(nextElement, {
                            delimiters: [
                                {left: '$$', right: '$$', display: true},
                                {left: '$', right: '$', display: false}
                            ],
                            throwOnError: false
                        });
                    }
                }
            }
            updateArrowStates();
        }

        /* Keyboard Listener */
        document.addEventListener('keydown', function(e) {
            if (document.activeElement && (document.activeElement.tagName === 'INPUT')) return;

            if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); moveInGrid(1, 0); }
            else if (e.key === 'ArrowLeft') { e.preventDefault(); moveInGrid(-1, 0); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); moveInGrid(0, -1); }
            else if (e.key === 'ArrowDown') { e.preventDefault(); moveInGrid(0, 1); }
        });

        /* ============================================================================
           2. GLOSSÁRIO INTERATIVO DOS 13 CONCEITOS
           ============================================================================ */
        const glossaryData = [
            { id: 'espaco', name: 'Espaço', icon: 'fa-cube', def: 'Domínio tridimensional contínuo e ilimitado ocupado pelos corpos materiais, onde as posições são definidas em um sistema cartesiano ortogonal.', form: '$$\\vec{r} = (x, y, z)$$' },
            { id: 'comprimento', name: 'Comprimento', icon: 'fa-ruler', def: 'Dimensão física de uma linha ou distância espacial entre dois pontos. É uma grandeza escalar primária.', form: '$$L = \\Delta x$$ [m]' },
            { id: 'posicao', name: 'Posição', icon: 'fa-location-dot', def: 'Localização exata de um ponto no espaço em relação a um referencial fixo pré-determinado.', form: '$$\\mathbf{P} = (x_P, y_P, z_P)$$' },
            { id: 'materia', name: 'Matéria', icon: 'fa-atom', def: 'Substância física que ocupa lugar no espaço e possui massa atômica inerente.', form: '$$\\rho = \\frac{dm}{dV}$$' },
            { id: 'corpo', name: 'Corpo: Partícula & Rígido', icon: 'fa-shapes', def: 'Partícula é um corpo com dimensões desprezíveis frente à escala do problema. Corpo Rígido é aquele cujas distâncias entre seus pontos não se alteram sob aplicação de forças.', form: '$$d(P_1, P_2) = \\text{Constante}$$' },
            { id: 'inercia', name: 'Inércia', icon: 'fa-[#0D4334]', def: 'Propriedade da matéria que resiste à alteração do seu estado de repouso ou movimento retilíneo uniforme.', form: '$$\\sum \\vec{F} = 0 \\implies \\vec{v} = \\text{const.}$$' },
            { id: 'massa', name: 'Massa', icon: 'fa-weight-hanging', def: 'Medida quantitativa da inércia de um corpo e da quantidade de matéria contida nele.', form: '$$m$$ [kg]' },
            { id: 'forca', name: 'Força', icon: 'fa-[#80C29D]', def: 'Ação vetorial exercida sobre um corpo que tende a alterar seu estado de movimento ou causar deformação.', form: '$$\\vec{F} = m \\cdot \\vec{a}$$' },
            { id: 'peso', name: 'Peso', icon: 'fa-arrow-down-long', def: 'Força de atração gravitacional exercida pela Terra sobre a massa de um corpo.', form: '$$\\vec{P} = m \\cdot \\vec{g}$$' },
            { id: 'vetor', name: 'Vetor', icon: 'fa-arrow-trend-up', def: 'Entidade matemática definida por módulo, direção, sentido e ponto de aplicação.', form: '$$\\vec{V} = V_x \\hat{i} + V_y \\hat{j} + V_z \\hat{k}$$' },
            { id: 'forca-vetor', name: 'Força como Grandeza Vetorial', icon: 'fa-arrows-to-dot', def: 'Forças obedecem à regra do paralelogramo e exigem cálculo vetorial para resultante.', form: '$$\\vec{R} = \\sum \\vec{F}_i$$' },
            { id: 'momento', name: 'Momento de Força', icon: 'fa-[#0D4334]', def: 'Medida da tendência de uma força fazer um corpo girar em torno de um ponto ou eixo.', form: '$$\\vec{M}_O = \\vec{r} \\times \\vec{F}$$' },
            { id: 'cg-centroide', name: 'Centro de Gravidade vs Centroide', icon: 'fa-crosshairs', def: 'Centro de Gravidade é o ponto de aplicação do peso resultante de um corpo físico. Centroide é o centro geométrico puramente matemático de uma área ou volume.', form: '$$\\bar{x} = \\frac{\\int x \, dA}{A}$$' }
        ];

        let activeGlossaryIndex = 0;

        function renderGlossary() {
            const tabsContainer = document.getElementById('glossary-tabs');
            if (!tabsContainer) return;

            tabsContainer.innerHTML = '';
            glossaryData.forEach((item, index) => {
                const btn = document.createElement('button');
                btn.innerText = item.name;
                btn.className = (index === activeGlossaryIndex)
                    ? "py-1.5 px-3 bg-[#0D4334] text-white rounded-lg text-fluid-tag font-bold shadow-sm transition-all"
                    : "py-1.5 px-3 bg-[#F4F6F5] hover:bg-[#80C29D] hover:text-[#0D4334] text-slate-700 rounded-lg text-fluid-tag font-medium transition-all";
                btn.onclick = () => {
                    activeGlossaryIndex = index;
                    renderGlossary();
                };
                tabsContainer.appendChild(btn);
            });

            const current = glossaryData[activeGlossaryIndex];
            document.getElementById('glossary-icon').className = `fa-solid ${current.icon} text-2xl text-[#0D4334]`;
            document.getElementById('glossary-title').innerText = current.name;
            document.getElementById('glossary-def').innerText = current.def;
            
            const formEl = document.getElementById('glossary-formula');
            formEl.innerText = current.form;
            if (window.katex) {
                katex.render(current.form.replace(/\$\$/g, ''), formEl, { displayMode: true, throwOnError: false });
            }
        }

        /* ============================================================================
           3. MOMENTO ESTÁTICO DO RETÂNGULO
           ============================================================================ */
        function updateRectMoments() {
            const b = parseFloat(document.getElementById('slider-rect-b').value);
            const h = parseFloat(document.getElementById('slider-rect-h').value);

            document.getElementById('rect-b-val').innerText = `${b} cm`;
            document.getElementById('rect-h-val').innerText = `${h} cm`;

            const QxBasal = (b * Math.pow(h, 2)) / 2;
            document.getElementById('res-qx-basal').innerText = `${QxBasal.toFixed(1)} cm³`;

            // SVG Redraw
            const svg = document.getElementById('rect-svg');
            if (svg) {
                const scaleX = 200 / 30;
                const scaleY = 100 / 40;
                const w = b * scaleX;
                const ht = h * scaleY;
                const x0 = 100 - w / 2;
                const y0 = 140 - ht;

                svg.innerHTML = `
                    <!-- Eixo Basal X -->
                    <line x1="20" y1="140" x2="380" y2="140" stroke="#0D4334" stroke-width="2" stroke-dasharray="4,4" />
                    <text x="365" y="132" fill="#0D4334" font-weight="bold" font-size="12">Eixo Basal x</text>

                    <!-- Eixo Centroidal Xbar -->
                    <line x1="20" y1="${140 - ht/2}" x2="380" y2="${140 - ht/2}" stroke="#80C29D" stroke-width="2" stroke-dasharray="2,2" />
                    <text x="365" y="${132 - ht/2}" fill="#0D4334" font-weight="bold" font-size="12">Eixo Centroidal x̄</text>

                    <!-- Retângulo -->
                    <rect x="${x0}" y="${y0}" width="${w}" height="${ht}" fill="#0D4334" fill-opacity="0.15" stroke="#0D4334" stroke-width="3" />

                    <!-- Ponto Centroide -->
                    <circle cx="100" cy="${140 - ht/2}" r="5" fill="#E53E3E" />
                    <text x="110" y="${135 - ht/2}" fill="#E53E3E" font-weight="bold" font-size="12">C (Centroide)</text>
                `;
            }
        }

        /* ============================================================================
           4. GALERIA DE FIGURAS ELEMENTARES
           ============================================================================ */
        const figurasData = [
            {
                name: "Retângulo",
                tag: "Base b × Altura h",
                desc: "Figura de quatros lados com ângulos retos e eixos de simetria paralelos aos lados.",
                area: "$$A = b \\cdot h$$",
                coord: "$$\\bar{x} = \\frac{b}{2}, \\quad \\bar{y} = \\frac{h}{2}$$",
                draw: () => `
                    <rect x="100" y="30" width="150" height="110" fill="#0D4334" fill-opacity="0.2" stroke="#0D4334" stroke-width="3" />
                    <circle cx="175" cy="85" r="5" fill="#E53E3E" />
                    <text x="185" y="90" fill="#E53E3E" font-weight="bold">C (b/2, h/2)</text>
                `
            },
            {
                name: "Triângulo Retângulo",
                tag: "Base b × Altura h",
                desc: "Centroide posicionado a um terço da base e da altura a partir do ângulo reto.",
                area: "$$A = \\frac{b \\cdot h}{2}$$",
                coord: "$$\\bar{x} = \\frac{b}{3}, \\quad \\bar{y} = \\frac{h}{3}$$",
                draw: () => `
                    <polygon points="100,140 250,140 100,30" fill="#0D4334" fill-opacity="0.2" stroke="#0D4334" stroke-width="3" />
                    <circle cx="150" cy="103.3" r="5" fill="#E53E3E" />
                    <text x="160" y="108" fill="#E53E3E" font-weight="bold">C (b/3, h/3)</text>
                `
            },
            {
                name: "Semicírculo",
                tag: "Raio r",
                desc: "Possui um eixo vertical de simetria. A distância centroidal basal equivale a 4r / 3π.",
                area: "$$A = \\frac{\\pi r^2}{2}$$",
                coord: "$$\\bar{x} = 0, \\quad \\bar{y} = \\frac{4r}{3\\pi} \\approx 0,424 r$$",
                draw: () => `
                    <path d="M 100 140 A 70 70 0 0 1 240 140 Z" fill="#0D4334" fill-opacity="0.2" stroke="#0D4334" stroke-width="3" />
                    <circle cx="170" cy="110.3" r="5" fill="#E53E3E" />
                    <text x="180" y="115" fill="#E53E3E" font-weight="bold">C (0, 4r/3π)</text>
                `
            },
            {
                name: "Setor Circular",
                tag: "Raio r, Ângulo 2α",
                desc: "Formulação angular geral. Para α em radianos, a cota centroidal do eixo de simetria é dada por 2r sin(α) / 3α.",
                area: "$$A = \\alpha r^2$$",
                coord: "$$\\bar{x} = \\frac{2 r \\sin\\alpha}{3 \\alpha}, \\quad \\bar{y} = 0$$",
                draw: () => `
                    <path d="M 100 90 L 220 30 A 130 130 0 0 1 220 150 Z" fill="#0D4334" fill-opacity="0.2" stroke="#0D4334" stroke-width="3" />
                    <circle cx="175" cy="90" r="5" fill="#E53E3E" />
                    <text x="185" y="95" fill="#E53E3E" font-weight="bold">C</text>
                `
            }
        ];

        let activeFiguraIndex = 0;

        function renderFigurasGallery() {
            const controls = document.getElementById('controls-figuras');
            if (!controls) return;

            controls.innerHTML = '';
            figurasData.forEach((item, index) => {
                const btn = document.createElement('button');
                btn.innerText = `${index + 1}. ${item.name}`;
                btn.className = (index === activeFiguraIndex)
                    ? "py-2 px-3 bg-[#80C29D] text-[#0D4334] rounded-xl text-fluid-tag font-bold text-left shadow-md"
                    : "py-2 px-3 bg-white/10 hover:bg-[#80C29D] hover:text-[#0D4334] text-white rounded-xl text-fluid-tag font-bold text-left";
                btn.onclick = () => {
                    activeFiguraIndex = index;
                    renderFigurasGallery();
                };
                controls.appendChild(btn);
            });

            const current = figurasData[activeFiguraIndex];
            document.getElementById('figura-title').innerText = current.name;
            document.getElementById('figura-tag').innerText = current.tag;
            document.getElementById('figura-desc').innerText = current.desc;

            const areaEl = document.getElementById('figura-area');
            const coordEl = document.getElementById('figura-coord');
            areaEl.innerText = current.area;
            coordEl.innerText = current.coord;

            if (window.katex) {
                katex.render(current.area.replace(/\$\$/g, ''), areaEl, { displayMode: true, throwOnError: false });
                katex.render(current.coord.replace(/\$\$/g, ''), coordEl, { displayMode: true, throwOnError: false });
            }

            document.getElementById('figura-svg').innerHTML = current.draw();
        }

        /* ============================================================================
           5. CASOS DE SIMETRIA E INSPEÇÃO
           ============================================================================ */
        const symCases = {
            dupla: {
                title: "1. Dupla Simetria (Perfil I Simétrico)",
                desc: "Existem dois eixos ortogonais de simetria (x e y). O centroide localiza-se rigorosamente no ponto de interseção dos eixos.",
                draw: () => `
                    <!-- Perfil I -->
                    <path d="M 120 30 L 280 30 L 280 60 L 210 60 L 210 160 L 280 160 L 280 190 L 120 190 L 120 160 L 190 160 L 190 60 L 120 60 Z" fill="#0D4334" fill-opacity="0.15" stroke="#0D4334" stroke-width="3" />
                    <!-- Eixo X simetria -->
                    <line x1="50" y1="110" x2="350" y2="110" stroke="#80C29D" stroke-width="2.5" stroke-dasharray="4,4" />
                    <!-- Eixo Y simetria -->
                    <line x1="200" y1="10" x2="200" y2="210" stroke="#80C29D" stroke-width="2.5" stroke-dasharray="4,4" />
                    <!-- Centroide -->
                    <circle cx="200" cy="110" r="6" fill="#E53E3E" />
                    <text x="212" y="115" fill="#E53E3E" font-weight="bold">C (Interseção)</text>
                `
            },
            eixo: {
                title: "2. Um Eixo de Simetria (Perfil T)",
                desc: "A seção possui apenas um eixo de simetria vertical (y). O centroide pertence obrigatoriamente a esta reta. Basta calcular a cota ybar.",
                draw: () => `
                    <!-- Perfil T -->
                    <path d="M 120 30 L 280 30 L 280 60 L 215 60 L 215 190 L 185 190 L 185 60 L 120 60 Z" fill="#0D4334" fill-opacity="0.15" stroke="#0D4334" stroke-width="3" />
                    <!-- Eixo Y simetria -->
                    <line x1="200" y1="10" x2="200" y2="210" stroke="#80C29D" stroke-width="2.5" stroke-dasharray="4,4" />
                    <!-- Centroide -->
                    <circle cx="200" cy="80" r="6" fill="#E53E3E" />
                    <text x="212" y="85" fill="#E53E3E" font-weight="bold">C (Sobre o Eixo Y)</text>
                `
            },
            ponto: {
                title: "3. Ponto / Centro de Simetria (Perfil Z)",
                desc: "A seção possui um ponto central em relação ao qual a geometria é antissimétrica. O centroide coincide com o ponto de simetria.",
                draw: () => `
                    <!-- Perfil Z -->
                    <path d="M 120 30 L 230 30 L 230 60 L 200 60 L 200 160 L 280 160 L 280 190 L 170 190 L 170 160 L 200 160 L 200 60 L 120 60 Z" fill="#0D4334" fill-opacity="0.15" stroke="#0D4334" stroke-width="3" />
                    <!-- Centroide Ponto -->
                    <circle cx="200" cy="110" r="6" fill="#E53E3E" />
                    <text x="212" y="115" fill="#E53E3E" font-weight="bold">C (Centro de Simetria)</text>
                `
            }
        };

        function selectSymmetryCase(key) {
            ['dupla', 'eixo', 'ponto'].forEach(k => {
                const btn = document.getElementById(`btn-sym-${k}`);
                if (btn) {
                    btn.className = (k === key)
                        ? "py-2.5 px-3 bg-[#80C29D] text-[#0D4334] rounded-xl text-fluid-tag font-bold text-left shadow-md"
                        : "py-2.5 px-3 bg-white/10 hover:bg-[#80C29D] hover:text-[#0D4334] text-white rounded-xl text-fluid-tag font-bold text-left";
                }
            });

            const current = symCases[key];
            document.getElementById('sym-title').innerText = current.title;
            document.getElementById('sym-desc').innerText = current.desc;
            document.getElementById('sym-svg').innerHTML = current.draw();
        }

        /* ============================================================================
           6. CALCULADORA DE PERFIL T ASSIMÉTRICO
           ============================================================================ */
        function calcTProfile() {
            const bf = parseFloat(document.getElementById('slider-tf-bf').value);
            const tf = parseFloat(document.getElementById('slider-tf-tf').value);
            const hw = parseFloat(document.getElementById('slider-tf-hw').value);
            const tw = parseFloat(document.getElementById('slider-tf-tw').value);

            document.getElementById('tf-bf-val').innerText = `${bf} cm`;
            document.getElementById('tf-tf-val').innerText = `${tf} cm`;
            document.getElementById('tf-hw-val').innerText = `${hw} cm`;
            document.getElementById('tf-tw-val').innerText = `${tw} cm`;

            // Geometria
            const A1 = bf * tf; // Mesa
            const y1 = hw + tf / 2;
            const Ay1 = A1 * y1;

            const A2 = hw * tw; // Alma
            const y2 = hw / 2;
            const Ay2 = A2 * y2;

            const Atotal = A1 + A2;
            const Aytotal = Ay1 + Ay2;
            const ybar = Aytotal / Atotal;

            // Preenchimento da Tabela
            document.getElementById('t-a1').innerText = A1.toFixed(1);
            document.getElementById('t-y1').innerText = y1.toFixed(1);
            document.getElementById('t-ay1').innerText = Ay1.toFixed(1);

            document.getElementById('t-a2').innerText = A2.toFixed(1);
            document.getElementById('t-y2').innerText = y2.toFixed(1);
            document.getElementById('t-ay2').innerText = Ay2.toFixed(1);

            document.getElementById('t-atotal').innerText = Atotal.toFixed(1);
            document.getElementById('t-aytotal').innerText = Aytotal.toFixed(1);
            document.getElementById('t-res-ybar').innerText = `${ybar.toFixed(2)} cm`;

            // SVG do Perfil T
            const svg = document.getElementById('tprofile-svg');
            if (svg) {
                const totalH = hw + tf;
                const scale = 160 / Math.max(bf, totalH);

                const wMesa = bf * scale;
                const hMesa = tf * scale;
                const hAlma = hw * scale;
                const wAlma = tw * scale;

                const xCenter = 175;
                const yBase = 180;

                const xMesaLeft = xCenter - wMesa / 2;
                const yMesaTop = yBase - hAlma - hMesa;
                const xAlmaLeft = xCenter - wAlma / 2;
                const yAlmaTop = yBase - hAlma;

                const yC = yBase - ybar * scale;

                svg.innerHTML = `
                    <!-- Eixo de Referencia Basal -->
                    <line x1="20" y1="${yBase}" x2="330" y2="${yBase}" stroke="#A1A1A1" stroke-width="2" stroke-dasharray="4,4" />
                    <text x="310" y="${yBase - 5}" fill="#A1A1A1" font-size="10">Eixo x=0</text>

                    <!-- Mesa -->
                    <rect x="${xMesaLeft}" y="${yMesaTop}" width="${wMesa}" height="${hMesa}" fill="#0D4334" fill-opacity="0.25" stroke="#0D4334" stroke-width="2" />
                    
                    <!-- Alma -->
                    <rect x="${xAlmaLeft}" y="${yAlmaTop}" width="${wAlma}" height="${hAlma}" fill="#0D4334" fill-opacity="0.15" stroke="#0D4334" stroke-width="2" />

                    <!-- Linha do Centroide Ybar -->
                    <line x1="30" y1="${yC}" x2="320" y2="${yC}" stroke="#E53E3E" stroke-width="2" stroke-dasharray="3,3" />
                    <circle cx="${xCenter}" cy="${yC}" r="6" fill="#E53E3E" />
                    <text x="${xCenter + 12}" y="${yC + 4}" fill="#E53E3E" font-weight="bold" font-size="12">C (ȳ = ${ybar.toFixed(1)} cm)</text>
                `;
            }
        }

        /* ============================================================================
           INIT DOCUMENT
           ============================================================================ */
        document.addEventListener('DOMContentLoaded', () => {
            updateGlobalIndicators();
            updateArrowStates();
            renderGlossary();
            updateRectMoments();
            renderFigurasGallery();
            selectSymmetryCase('dupla');
            calcTProfile();
        });