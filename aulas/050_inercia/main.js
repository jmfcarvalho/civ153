/* ============================================================================
           1. 2D NAVIGATION MATRIX ENGINE (SLIDE GRID AULA 05)
           ============================================================================ */
        const slideGridAula05 = {
            '0,0': 'slide-capa',
            '1,0': 'slide-ementa',
            '2,0': 'slide-introducao',
            '2,1': 'slide-conservacao-momento',
            '2,2': 'slide-orbitas-planetas',
            '3,0': 'slide-conceito-inercia',
            '3,1': 'slide-calculo-retangulo',
            '4,0': 'slide-galeria-formas',
            '5,0': 'slide-retangulo-interativo',
            '5,1': 'slide-caixao-comparativo',
            '5,2': 'slide-perfil-i-comparativo',
            '6,0': 'slide-soma-inercias',
            '6,1': 'slide-teorema-steiner',
            '6,2': 'slide-lab-steiner',
            '7,0': 'slide-produto-inercia',
            '7,1': 'slide-builder-compostas',
            '8,0': 'slide-quiz',
            '9,0': 'slide-encerramento'
        };
        

        let currentX = 0;
        let currentY = 0;
        const totalSlidesHorizontal = 10;

        function hasSlide(x, y) {
            return !!slideGridAula05[`${x},${y}`];
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
                const currentElement = document.getElementById(slideGridAula05[`${currentX},${currentY}`]);
                const nextElement = document.getElementById(slideGridAula05[`${nextX},${nextY}`]);

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

        /* Keyboard Navigation */
        document.addEventListener('keydown', function(e) {
            if (document.activeElement && (document.activeElement.tagName === 'INPUT')) return;

            if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); moveInGrid(1, 0); }
            else if (e.key === 'ArrowLeft') { e.preventDefault(); moveInGrid(-1, 0); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); moveInGrid(0, -1); }
            else if (e.key === 'ArrowDown') { e.preventDefault(); moveInGrid(0, 1); }
        });

        /* ============================================================================
           2. INTERACTIVE SIMULATION - CONSERVATION OF ANGULAR MOMENTUM (SKATER)
           ============================================================================ */
        let skaterRotAngle = 0;
        let skaterAnimId = null;

        function updateSkaterSim() {
            const m = parseFloat(document.getElementById('slider-skater-m').value);
            const r = parseFloat(document.getElementById('slider-skater-r').value);

            document.getElementById('skater-m-val').innerText = `${m.toFixed(1)} kg`;
            document.getElementById('skater-r-val').innerText = `${r.toFixed(1)} m`;

            const L = 100.0;
            const I = m * Math.pow(r, 2);
            const w = L / I;

            document.getElementById('skater-i-res').innerText = `${I.toFixed(2)} kg·m²`;
            document.getElementById('skater-w-res').innerText = `${w.toFixed(2)} rad/s`;

            // SVG updates
            const armLen = 30 + r * 25;
            document.getElementById('skater-arm-1').setAttribute('x2', (200 + armLen).toString());
            document.getElementById('skater-arm-2').setAttribute('x2', (200 - armLen).toString());
            document.getElementById('skater-mass-1').setAttribute('cx', (200 + armLen).toString());
            document.getElementById('skater-mass-2').setAttribute('cx', (200 - armLen).toString());
            
            const rMass = 6 + m * 1.2;
            document.getElementById('skater-mass-1').setAttribute('r', rMass.toString());
            document.getElementById('skater-mass-2').setAttribute('r', rMass.toString());

            const pathEl = document.getElementById('skater-orbit-path');
            if (pathEl) {
                pathEl.setAttribute('d', `M ${200-armLen} 120 A ${armLen} ${armLen} 0 1 0 ${200+armLen} 120 A ${armLen} ${armLen} 0 1 0 ${200-armLen} 120`);
            }
        }

        function animateSkaterLoop() {
            const wText = document.getElementById('skater-w-res');
            if (wText) {
                const w = parseFloat(wText.innerText);
                skaterRotAngle += (w * 0.8);
                const rotGroup = document.getElementById('skater-rot-group');
                if (rotGroup) {
                    rotGroup.setAttribute('transform', `rotate(${skaterRotAngle} 200 120)`);
                }
            }
            requestAnimationFrame(animateSkaterLoop);
        }

        /* ============================================================================
           3. INTERACTIVE SIMULATION - PLANETARY ORBIT (KEPLER'S SECOND LAW)
           ============================================================================ */
        let planetAngle = 0;

        function animatePlanetOrbit() {
            planetAngle += 0.015;
            const a = 170;
            const b = 90;
            const cx = 225;
            const cy = 130;
            const sunX = 150;
            const sunY = 130;

            const px = cx + a * Math.cos(planetAngle);
            const py = cy + b * Math.sin(planetAngle);

            const dx = px - sunX;
            const dy = py - sunY;
            const r = Math.sqrt(dx * dx + dy * dy);

            // Speed factor inversely proportional to distance
            const v = (180 / r) * 12;

            const planetBody = document.getElementById('planet-body');
            const radiusLine = document.getElementById('planet-radius-line');
            const rDisp = document.getElementById('planet-r-disp');
            const vDisp = document.getElementById('planet-v-disp');

            if (planetBody && radiusLine) {
                planetBody.setAttribute('cx', px.toString());
                planetBody.setAttribute('cy', py.toString());
                radiusLine.setAttribute('x2', px.toString());
                radiusLine.setAttribute('y2', py.toString());
            }

            if (rDisp && vDisp) {
                rDisp.innerText = `${(r / 20).toFixed(2)} UA`;
                vDisp.innerText = `${v.toFixed(1)} km/s`;
            }

            requestAnimationFrame(animatePlanetOrbit);
        }

        /* ============================================================================
           4. STEP-BY-STEP RECTANGLE INTEGRAL DERIVATION
           ============================================================================ */
        const rectDerivSteps = {
            basal: {
                title: "1. Cálculo em relação ao Eixo Basal ($x$)",
                content: `
                    <p><strong>Configuração:</strong> Origem do sistema $xy$ posicionada no canto inferior esquerdo da seção.</p>
                    <p><strong>Elemento Diferencial:</strong> Faixa horizontal $dA = b \cdot dy$ posicionada na cota $y$.</p>
                    <div class="p-3 bg-white rounded-xl border border-[#DEDEDE] font-mono my-1">
                        $$I_x = \int_0^h y^2 \, dA = \int_0^h y^2 (b \, dy) = b \left[ \frac{y^3}{3} \right]_0^h = \frac{b h^3}{3}$$
                    </div>
                `,
                draw: () => `
                    <line x1="20" y1="130" x2="340" y2="130" stroke="#0D4334" stroke-width="3" />
                    <text x="310" y="122" fill="#0D4334" font-bold font-size="12">Eixo Basal x</text>
                    <rect x="120" y="30" width="120" height="100" fill="#0D4334" fill-opacity="0.15" stroke="#0D4334" stroke-width="2" />
                    <rect x="120" y="70" width="120" height="12" fill="#E53E3E" fill-opacity="0.6" stroke="#E53E3E" stroke-width="1.5" />
                    <text x="248" y="79" fill="#E53E3E" font-bold font-size="11">dA = b · dy</text>
                `
            },
            centroidal: {
                title: "2. Cálculo em relação ao Eixo Centroidal ($\bar{x}$)",
                content: `
                    <p><strong>Configuração:</strong> Origem posicionada no Centroide $C(0,0)$ no meio da seção retangular.</p>
                    <p><strong>Limites de Integração:</strong> A cota $y$ varia do limite inferior $-h/2$ ao superior $+h/2$.</p>
                    <div class="p-3 bg-white rounded-xl border border-[#DEDEDE] font-mono my-1">
                        $$I_{\bar{x}} = \int_{-h/2}^{+h/2} y^2 (b \, dy) = b \left[ \frac{y^3}{3} \right]_{-h/2}^{+h/2} = b \left( \frac{h^3}{24} - \left(-\frac{h^3}{24}\right) \right) = \frac{b h^3}{12}$$
                    </div>
                `,
                draw: () => `
                    <rect x="120" y="30" width="120" height="100" fill="#0D4334" fill-opacity="0.15" stroke="#0D4334" stroke-width="2" />
                    <line x1="20" y1="80" x2="340" y2="80" stroke="#80C29D" stroke-width="3" stroke-dasharray="4,4" />
                    <text x="290" y="72" fill="#0D4334" font-bold font-size="12">Eixo Centroidal x̄</text>
                    <circle cx="180" cy="80" r="5" fill="#E53E3E" />
                    <rect x="120" y="50" width="120" height="10" fill="#E53E3E" fill-opacity="0.6" stroke="#E53E3E" stroke-width="1.5" />
                    <text x="248" y="58" fill="#E53E3E" font-bold font-size="11">dA = b · dy</text>
                `
            }
        };

        function setRectDerivationStep(key) {
            ['basal', 'centroidal'].forEach(k => {
                const btn = document.getElementById(`btn-rect-${k}`);
                if (btn) {
                    btn.className = (k === key)
                        ? "py-2.5 px-3 bg-[#80C29D] text-[#0D4334] rounded-xl text-fluid-tag font-bold text-left shadow-md"
                        : "py-2.5 px-3 bg-white/10 hover:bg-[#80C29D] hover:text-[#0D4334] text-white rounded-xl text-fluid-tag font-bold text-left";
                }
            });

            const current = rectDerivSteps[key];
            document.getElementById('rect-deriv-title').innerText = current.title;
            const contentEl = document.getElementById('rect-deriv-content');
            contentEl.innerHTML = current.content;
            document.getElementById('rect-deriv-svg').innerHTML = current.draw();

            if (window.katex) {
                renderMathInElement(contentEl, {
                    delimiters: [
                        {left: '$$', right: '$$', display: true},
                        {left: '$', right: '$', display: false}
                    ],
                    throwOnError: false
                });
            }
        }

        /* ============================================================================
           5. GEOMETRIC SHAPES GALLERY
           ============================================================================ */
        const shapesGalleryData = [
            {
                name: "Retângulo",
                tag: "Base b × Altura h",
                desc: "Seção fundamental. Inércia máxima no eixo perpendicular à maior dimensão.",
                a: "$$A = b \\cdot h$$",
                ix: "$$I_{\\bar{x}} = \\frac{b h^3}{12}$$",
                iy: "$$I_{\\bar{y}} = \\frac{h b^3}{12}$$",
                draw: () => `
                    <rect x="110" y="30" width="140" height="120" fill="#0D4334" fill-opacity="0.2" stroke="#0D4334" stroke-width="3" />
                    <line x1="40" y1="90" x2="320" y2="90" stroke="#80C29D" stroke-width="2" stroke-dasharray="4,4" />
                    <line x1="180" y1="10" x2="180" y2="170" stroke="#80C29D" stroke-width="2" stroke-dasharray="4,4" />
                    <circle cx="180" cy="90" r="5" fill="#E53E3E" />
                    <text x="190" y="85" fill="#E53E3E" font-bold>C</text>
                `
            },
            {
                name: "Triângulo Retângulo",
                tag: "Base b × Altura h",
                desc: "Inércia centroidal reduzida pela menor quantidade de massa nas extremidades do topo.",
                a: "$$A = \\frac{b h}{2}$$",
                ix: "$$I_{\\bar{x}} = \\frac{b h^3}{36}$$",
                iy: "$$I_{\\bar{y}} = \\frac{h b^3}{36}$$",
                draw: () => `
                    <polygon points="100,150 260,150 100,30" fill="#0D4334" fill-opacity="0.2" stroke="#0D4334" stroke-width="3" />
                    <line x1="40" y1="110" x2="320" y2="110" stroke="#80C29D" stroke-width="2" stroke-dasharray="4,4" />
                    <line x1="153.3" y1="10" x2="153.3" y2="170" stroke="#80C29D" stroke-width="2" stroke-dasharray="4,4" />
                    <circle cx="153.3" cy="110" r="5" fill="#E53E3E" />
                    <text x="163" y="105" fill="#E53E3E" font-bold>C (b/3, h/3)</text>
                `
            },
            {
                name: "Círculo Cheio",
                tag: "Raio r / Diâmetro d",
                desc: "Inércia idêntica em qualquer eixo centroidal devido à simetria polar contínua.",
                a: "$$A = \\pi r^2$$",
                ix: "$$I_{\\bar{x}} = \\frac{\\pi r^4}{4}$$",
                iy: "$$I_{\\bar{y}} = \\frac{\\pi r^4}{4}$$",
                draw: () => `
                    <circle cx="180" cy="90" r="65" fill="#0D4334" fill-opacity="0.2" stroke="#0D4334" stroke-width="3" />
                    <line x1="40" y1="90" x2="320" y2="90" stroke="#80C29D" stroke-width="2" stroke-dasharray="4,4" />
                    <line x1="180" y1="10" x2="180" y2="170" stroke="#80C29D" stroke-width="2" stroke-dasharray="4,4" />
                    <circle cx="180" cy="90" r="5" fill="#E53E3E" />
                    <text x="190" y="85" fill="#E53E3E" font-bold>C</text>
                `
            },
            {
                name: "Semicírculo",
                tag: "Raio r",
                desc: "Eixo vertical é eixo de simetria. Inércia no eixo x centroidal com desvio de Steiner.",
                a: "$$A = \\frac{\\pi r^2}{2}$$",
                ix: "$$I_{\\bar{x}} \\approx 0,1098 r^4$$",
                iy: "$$I_{\\bar{y}} = \\frac{\\pi r^4}{8}$$",
                draw: () => `
                    <path d="M 110 140 A 70 70 0 0 1 250 140 Z" fill="#0D4334" fill-opacity="0.2" stroke="#0D4334" stroke-width="3" />
                    <line x1="40" y1="110.3" x2="320" y2="110.3" stroke="#80C29D" stroke-width="2" stroke-dasharray="4,4" />
                    <line x1="180" y1="10" x2="180" y2="170" stroke="#80C29D" stroke-width="2" stroke-dasharray="4,4" />
                    <circle cx="180" cy="110.3" r="5" fill="#E53E3E" />
                    <text x="190" y="105" fill="#E53E3E" font-bold>C</text>
                `
            }
        ];

        let activeShapeIndex = 0;

        function renderShapesGallery() {
            const controls = document.getElementById('controls-shapes-gallery');
            if (!controls) return;

            controls.innerHTML = '';
            shapesGalleryData.forEach((item, index) => {
                const btn = document.createElement('button');
                btn.innerText = `${index + 1}. ${item.name}`;
                btn.className = (index === activeShapeIndex)
                    ? "py-2 px-3 bg-[#80C29D] text-[#0D4334] rounded-xl text-fluid-tag font-bold text-left shadow-md"
                    : "py-2 px-3 bg-white/10 hover:bg-[#80C29D] hover:text-[#0D4334] text-white rounded-xl text-fluid-tag font-bold text-left";
                btn.onclick = () => {
                    activeShapeIndex = index;
                    renderShapesGallery();
                };
                controls.appendChild(btn);
            });

            const current = shapesGalleryData[activeShapeIndex];
            document.getElementById('shape-title').innerText = current.name;
            document.getElementById('shape-tag').innerText = current.tag;
            document.getElementById('shape-desc').innerText = current.desc;

            const elA = document.getElementById('shape-formula-a');
            const elIx = document.getElementById('shape-formula-ix');
            const elIy = document.getElementById('shape-formula-iy');

            elA.innerText = current.a;
            elIx.innerText = current.ix;
            elIy.innerText = current.iy;

            if (window.katex) {
                katex.render(current.a.replace(/\$\$/g, ''), elA, { displayMode: true, throwOnError: false });
                katex.render(current.ix.replace(/\$\$/g, ''), elIx, { displayMode: true, throwOnError: false });
                katex.render(current.iy.replace(/\$\$/g, ''), elIy, { displayMode: true, throwOnError: false });
            }

            document.getElementById('shape-svg-display').innerHTML = current.draw();
        }

        /* ============================================================================
           6. INTERACTIVE ACTIVITY 1 - RECTANGLE
           ============================================================================ */
        function updateAct1Rect() {
            const b = parseFloat(document.getElementById('slider-act1-b').value);
            const h = parseFloat(document.getElementById('slider-act1-h').value);

            document.getElementById('act1-b-val').innerText = `${b} cm`;
            document.getElementById('act1-h-val').innerText = `${h} cm`;

            const A = b * h;
            const Ix = (b * Math.pow(h, 3)) / 12;
            const Iy = (h * Math.pow(b, 3)) / 12;

            document.getElementById('act1-res-a').innerText = `${A.toFixed(2)} cm²`;
            document.getElementById('act1-res-ix').innerText = `${Ix.toFixed(2)} cm⁴`;
            document.getElementById('act1-res-iy').innerText = `${Iy.toFixed(2)} cm⁴`;

            // SVG Redraw maintaining exact physical aspect ratio
            const svg = document.getElementById('act1-svg');
            if (svg) {
                const maxDim = Math.max(b, h);
                const scale = 140 / maxDim;
                const w = b * scale;
                const ht = h * scale;

                const cx = 190;
                const cy = 110;
                const x0 = cx - w / 2;
                const y0 = cy - ht / 2;

                svg.innerHTML = `
                    <rect x="${x0}" y="${y0}" width="${w}" height="${ht}" fill="#0D4334" fill-opacity="0.15" stroke="#0D4334" stroke-width="3" />
                    <!-- Eixo Centroidal Xbar -->
                    <line x1="30" y1="${cy}" x2="350" y2="${cy}" stroke="#80C29D" stroke-width="2" stroke-dasharray="4,4" />
                    <text x="325" y="${cy - 6}" fill="#0D4334" font-bold font-size="11">x̄</text>
                    <!-- Eixo Centroidal Ybar -->
                    <line x1="${cx}" y1="15" x2="${cx}" y2="205" stroke="#80C29D" stroke-width="2" stroke-dasharray="4,4" />
                    <text x="${cx + 6}" y="28" fill="#0D4334" font-bold font-size="11">ȳ</text>
                    <!-- Centroide -->
                    <circle cx="${cx}" cy="${cy}" r="5" fill="#E53E3E" />
                    <text x="${cx + 8}" y="${cy + 16}" fill="#E53E3E" font-bold font-size="11">C (${(b/2).toFixed(1)}, ${(h/2).toFixed(1)})</text>
                `;
            }
        }

        /* ============================================================================
           7. INTERACTIVE ACTIVITY 2 - SOLID RECTANGLE VS HOLLOW BOX
           ============================================================================ */
        function updateBoxSim() {
            const b = parseFloat(document.getElementById('slider-box-b').value);
            const h = parseFloat(document.getElementById('slider-box-h').value);
            const tf = parseFloat(document.getElementById('slider-box-tf').value);
            const tw = parseFloat(document.getElementById('slider-box-tw').value);

            // Validation guard
            if (2 * tw >= b) {
                document.getElementById('slider-box-tw').value = (b / 2 - 0.5).toString();
                return updateBoxSim();
            }
            if (2 * tf >= h) {
                document.getElementById('slider-box-tf').value = (h / 2 - 0.5).toString();
                return updateBoxSim();
            }

            document.getElementById('box-b-val').innerText = `${b} cm`;
            document.getElementById('box-h-val').innerText = `${h} cm`;
            document.getElementById('box-tf-val').innerText = `${tf} cm`;
            document.getElementById('box-tw-val').innerText = `${tw} cm`;

            // Solid calculations
            const Asolid = b * h;
            const IxSolid = (b * Math.pow(h, 3)) / 12;
            const IySolid = (h * Math.pow(b, 3)) / 12;

            // Hollow Box calculations
            const bi = b - 2 * tw;
            const hi = h - 2 * tf;
            const Abox = Asolid - (bi * hi);
            const IxBox = IxSolid - ((bi * Math.pow(hi, 3)) / 12);
            const IyBox = IySolid - ((hi * Math.pow(bi, 3)) / 12);

            // Reductions
            const diffA = ((Abox - Asolid) / Asolid) * 100;
            const diffIx = ((IxBox - IxSolid) / IxSolid) * 100;
            const diffIy = ((IyBox - IySolid) / IySolid) * 100;

            document.getElementById('box-a-solid').innerText = `${Asolid.toFixed(1)} cm²`;
            document.getElementById('box-a-box').innerText = `${Abox.toFixed(1)} cm²`;
            document.getElementById('box-a-diff').innerText = `${diffA.toFixed(1)}% (Massa)`;

            document.getElementById('box-ix-solid').innerText = `${IxSolid.toFixed(1)} cm⁴`;
            document.getElementById('box-ix-box').innerText = `${IxBox.toFixed(1)} cm⁴`;
            document.getElementById('box-ix-diff').innerText = `${diffIx.toFixed(1)}% (Inércia)`;

            document.getElementById('box-iy-solid').innerText = `${IySolid.toFixed(1)} cm⁴`;
            document.getElementById('box-iy-box').innerText = `${IyBox.toFixed(1)} cm⁴`;
            document.getElementById('box-iy-diff').innerText = `${diffIy.toFixed(1)}% (Inércia)`;

            // SVG Solid
            const svgS = document.getElementById('box-svg-solid');
            const svgB = document.getElementById('box-svg-box');
            if (svgS && svgB) {
                const maxD = Math.max(b, h);
                const scale = 110 / maxD;
                const w = b * scale;
                const ht = h * scale;
                const x0 = 100 - w / 2;
                const y0 = 75 - ht / 2;

                svgS.innerHTML = `
                    <rect x="${x0}" y="${y0}" width="${w}" height="${ht}" fill="#0D4334" fill-opacity="0.2" stroke="#0D4334" stroke-width="2" />
                    <line x1="10" y1="75" x2="190" y2="75" stroke="#80C29D" stroke-width="1.5" stroke-dasharray="3,3" />
                    <line x1="100" y1="10" x2="100" y2="140" stroke="#80C29D" stroke-width="1.5" stroke-dasharray="3,3" />
                    <circle cx="100" cy="75" r="4" fill="#E53E3E" />
                `;

                const wInner = bi * scale;
                const hInner = hi * scale;
                const xi0 = 100 - wInner / 2;
                const yi0 = 75 - hInner / 2;

                svgB.innerHTML = `
                    <path d="M ${x0} ${y0} L ${x0+w} ${y0} L ${x0+w} ${y0+ht} L ${x0} ${y0+ht} Z M ${xi0} ${yi0} L ${xi0} ${yi0+hInner} L ${xi0+wInner} ${yi0+hInner} L ${xi0+wInner} ${yi0} Z" fill="#0D4334" fill-opacity="0.25" stroke="#0D4334" stroke-width="2" />
                    <line x1="10" y1="75" x2="190" y2="75" stroke="#80C29D" stroke-width="1.5" stroke-dasharray="3,3" />
                    <line x1="100" y1="10" x2="100" y2="140" stroke="#80C29D" stroke-width="1.5" stroke-dasharray="3,3" />
                    <circle cx="100" cy="75" r="4" fill="#E53E3E" />
                `;
            }
        }

        /* ============================================================================
           8. INTERACTIVE ACTIVITY 3 - SOLID RECTANGLE VS I-BEAM
           ============================================================================ */
        function updateIBeamSim() {
            const b = parseFloat(document.getElementById('slider-ibeam-b').value);
            const h = parseFloat(document.getElementById('slider-ibeam-h').value);
            const tf = parseFloat(document.getElementById('slider-ibeam-tf').value);
            const tw = parseFloat(document.getElementById('slider-ibeam-tw').value);

            if (tw >= b) {
                document.getElementById('slider-ibeam-tw').value = (b - 1).toString();
                return updateIBeamSim();
            }
            if (2 * tf >= h) {
                document.getElementById('slider-ibeam-tf').value = (h / 2 - 0.5).toString();
                return updateIBeamSim();
            }

            document.getElementById('ibeam-b-val').innerText = `${b} cm`;
            document.getElementById('ibeam-h-val').innerText = `${h} cm`;
            document.getElementById('ibeam-tf-val').innerText = `${tf} cm`;
            document.getElementById('ibeam-tw-val').innerText = `${tw} cm`;

            const Asolid = b * h;
            const IxSolid = (b * Math.pow(h, 3)) / 12;
            const IySolid = (h * Math.pow(b, 3)) / 12;

            // I-Beam calculation (Solid rect minus 2 side cutouts)
            const hw = h - 2 * tf;
            const bCut = (b - tw) / 2;
            const Aibeam = Asolid - (2 * bCut * hw);
            const IxIBeam = IxSolid - (2 * (bCut * Math.pow(hw, 3) / 12));
            const IyIBeam = (2 * (tf * Math.pow(b, 3) / 12)) + (hw * Math.pow(tw, 3) / 12);

            const diffA = ((Aibeam - Asolid) / Asolid) * 100;
            const diffIx = ((IxIBeam - IxSolid) / IxSolid) * 100;
            const diffIy = ((IyIBeam - IySolid) / IySolid) * 100;

            document.getElementById('ibeam-a-solid').innerText = `${Asolid.toFixed(1)} cm²`;
            document.getElementById('ibeam-a-ibeam').innerText = `${Aibeam.toFixed(1)} cm²`;
            document.getElementById('ibeam-a-diff').innerText = `${diffA.toFixed(1)}% (Massa)`;

            document.getElementById('ibeam-ix-solid').innerText = `${IxSolid.toFixed(1)} cm⁴`;
            document.getElementById('ibeam-ix-ibeam').innerText = `${IxIBeam.toFixed(1)} cm⁴`;
            document.getElementById('ibeam-ix-diff').innerText = `${diffIx.toFixed(1)}% (Inércia)`;

            document.getElementById('ibeam-iy-solid').innerText = `${IySolid.toFixed(1)} cm⁴`;
            document.getElementById('ibeam-iy-ibeam').innerText = `${IyIBeam.toFixed(1)} cm⁴`;
            document.getElementById('ibeam-iy-diff').innerText = `${diffIy.toFixed(1)}% (Inércia)`;

            const svgS = document.getElementById('ibeam-svg-solid');
            const svgI = document.getElementById('ibeam-svg-ibeam');
            if (svgS && svgI) {
                const maxD = Math.max(b, h);
                const scale = 110 / maxD;
                const w = b * scale;
                const ht = h * scale;
                const x0 = 100 - w / 2;
                const y0 = 75 - ht / 2;

                svgS.innerHTML = `
                    <rect x="${x0}" y="${y0}" width="${w}" height="${ht}" fill="#0D4334" fill-opacity="0.2" stroke="#0D4334" stroke-width="2" />
                    <line x1="10" y1="75" x2="190" y2="75" stroke="#80C29D" stroke-width="1.5" stroke-dasharray="3,3" />
                    <line x1="100" y1="10" x2="100" y2="140" stroke="#80C29D" stroke-width="1.5" stroke-dasharray="3,3" />
                    <circle cx="100" cy="75" r="4" fill="#E53E3E" />
                `;

                const wTf = tf * scale;
                const wTw = tw * scale;

                svgI.innerHTML = `
                    <!-- Top Flange -->
                    <rect x="${x0}" y="${y0}" width="${w}" height="${wTf}" fill="#0D4334" fill-opacity="0.25" stroke="#0D4334" stroke-width="1.5" />
                    <!-- Bottom Flange -->
                    <rect x="${x0}" y="${y0+ht-wTf}" width="${w}" height="${wTf}" fill="#0D4334" fill-opacity="0.25" stroke="#0D4334" stroke-width="1.5" />
                    <!-- Web -->
                    <rect x="${100-wTw/2}" y="${y0+wTf}" width="${wTw}" height="${ht-2*wTf}" fill="#0D4334" fill-opacity="0.25" stroke="#0D4334" stroke-width="1.5" />
                    
                    <line x1="10" y1="75" x2="190" y2="75" stroke="#80C29D" stroke-width="1.5" stroke-dasharray="3,3" />
                    <line x1="100" y1="10" x2="100" y2="140" stroke="#80C29D" stroke-width="1.5" stroke-dasharray="3,3" />
                    <circle cx="100" cy="75" r="4" fill="#E53E3E" />
                `;
            }
        }

        /* ============================================================================
           9. STEINER INTERACTIVE LAB (L-ANGLE SECTION)
           ============================================================================ */
        function updateSteinerLab() {
            const dy = parseFloat(document.getElementById('slider-steiner-dy').value);
            const dx = parseFloat(document.getElementById('slider-steiner-dx').value);

            document.getElementById('steiner-dy-val').innerText = `${dy} cm`;
            document.getElementById('steiner-dx-val').innerText = `${dx} cm`;

            // L-Angle section fixed properties
            const A = 50.0;
            const IxCent = 1250.0;

            const IxShift = IxCent + A * Math.pow(dy, 2);
            const pct = ((IxShift - IxCent) / IxCent) * 100;

            document.getElementById('steiner-ix-cent').innerText = `${IxCent.toFixed(1)} cm⁴`;
            document.getElementById('steiner-ix-shift').innerText = `${IxShift.toFixed(1)} cm⁴`;
            document.getElementById('steiner-ix-pct').innerText = `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}% de variação`;

            const svg = document.getElementById('steiner-svg');
            if (svg) {
                const cx = 190;
                const cy = 120;

                const shiftX = cx + dx * 6;
                const shiftY = cy - dy * 6;

                svg.innerHTML = `
                    <!-- L-Angle Path -->
                    <path d="M 140 50 L 170 50 L 170 160 L 250 160 L 250 190 L 140 190 Z" fill="#0D4334" fill-opacity="0.2" stroke="#0D4334" stroke-width="2.5" />
                    
                    <!-- Original Centroidal Axes (Thin Lines) -->
                    <line x1="30" y1="${cy}" x2="350" y2="${cy}" stroke="#A1A1A1" stroke-width="1.5" stroke-dasharray="3,3" />
                    <line x1="${cx}" y1="15" x2="${cx}" y2="225" stroke="#A1A1A1" stroke-width="1.5" stroke-dasharray="3,3" />
                    <circle cx="${cx}" cy="${cy}" r="4" fill="#A1A1A1" />

                    <!-- Shifted Parallel Axes (Active) -->
                    <line x1="30" y1="${shiftY}" x2="350" y2="${shiftY}" stroke="#E53E3E" stroke-width="2.5" />
                    <line x1="${shiftX}" y1="15" x2="${shiftX}" y2="225" stroke="#E53E3E" stroke-width="2.5" />
                    <circle cx="${shiftX}" cy="${shiftY}" r="5" fill="#E53E3E" />
                `;
            }
        }

        /* ============================================================================
           10. ADVANCED COMPOSITE BUILDER ENGINE (UP TO 5 RECTANGLES WITH QUADRANTS)
           ============================================================================ */
        let builderRects = [
            { active: true, x: 0, y: 0, b: 20, h: 4 },   // Top Flange
            { active: true, x: 8, y: 4, b: 4, h: 20 },   // Web
            { active: false, x: 0, y: 24, b: 20, h: 4 }, // Bottom Flange
            { active: false, x: 0, y: 0, b: 4, h: 10 },  // Optional 4
            { active: false, x: 16, y: 0, b: 4, h: 10 }  // Optional 5
        ];

        let builderInteractiveAxis = { x: 0, y: 0 };
        let isDraggingBuilderAxis = false;

        function loadBuilderPreset(preset) {
            builderRects.forEach(r => r.active = false);

            if (preset === 'rect') {
                builderRects[0] = { active: true, x: 0, y: 0, b: 20, h: 30 };
            } else if (preset === 'angle') {
                builderRects[0] = { active: true, x: 0, y: 0, b: 4, h: 26 };
                builderRects[1] = { active: true, x: 4, y: 22, b: 16, h: 4 };
            } else if (preset === 'tee') {
                builderRects[0] = { active: true, x: 0, y: 0, b: 24, h: 4 };
                builderRects[1] = { active: true, x: 10, y: 4, b: 4, h: 22 };
            } else if (preset === 'ibeam') {
                builderRects[0] = { active: true, x: 0, y: 0, b: 20, h: 4 };
                builderRects[1] = { active: true, x: 8, y: 4, b: 4, h: 20 };
                builderRects[2] = { active: true, x: 0, y: 24, b: 20, h: 4 };
            } else if (preset === 'box') {
                builderRects[0] = { active: true, x: 0, y: 0, b: 20, h: 4 };   // Top
                builderRects[1] = { active: true, x: 0, y: 4, b: 4, h: 20 };   // Left
                builderRects[2] = { active: true, x: 16, y: 4, b: 4, h: 20 };  // Right
                builderRects[3] = { active: true, x: 0, y: 24, b: 20, h: 4 };  // Bottom
            } else if (preset === 'box-septo') {
                builderRects[0] = { active: true, x: 0, y: 0, b: 20, h: 4 };   // Top
                builderRects[1] = { active: true, x: 0, y: 4, b: 4, h: 20 };   // Left
                builderRects[2] = { active: true, x: 16, y: 4, b: 4, h: 20 };  // Right
                builderRects[3] = { active: true, x: 0, y: 24, b: 20, h: 4 };  // Bottom
                builderRects[4] = { active: true, x: 4, y: 12, b: 12, h: 4 };  // Septo Intermediário
            }

            renderBuilderControls();
            recalcBuilder();
        }

        function renderBuilderControls() {
            const container = document.getElementById('builder-rect-controls');
            if (!container) return;

            container.innerHTML = '';
            builderRects.forEach((r, idx) => {
                const box = document.createElement('div');
                box.className = "p-2 bg-white/10 rounded-lg space-y-1 text-fluid-tag";
                box.innerHTML = `
                    <div class="flex justify-between items-center">
                        <label class="font-bold text-[#80C29D]">
                            <input type="checkbox" ${r.active ? 'checked' : ''} onchange="toggleBuilderRect(${idx}, this.checked)"> Retângulo ${idx + 1}
                        </label>
                        ${r.active ? `<span class="text-[10px] text-slate-300">b=${r.b}, h=${r.h}</span>` : ''}
                    </div>
                    ${r.active ? `
                        <div class="grid grid-cols-2 gap-1 text-[11px] pt-1">
                            <div>X: <input type="number" value="${r.x}" onchange="updateBuilderParam(${idx},'x',this.value)" class="w-12 bg-black/40 text-white px-1 rounded"></div>
                            <div>Y: <input type="number" value="${r.y}" onchange="updateBuilderParam(${idx},'y',this.value)" class="w-12 bg-black/40 text-white px-1 rounded"></div>
                            <div>Base: <input type="number" value="${r.b}" min="1" onchange="updateBuilderParam(${idx},'b',this.value)" class="w-12 bg-black/40 text-white px-1 rounded"></div>
                            <div>Alt: <input type="number" value="${r.h}" min="1" onchange="updateBuilderParam(${idx},'h',this.value)" class="w-12 bg-black/40 text-white px-1 rounded"></div>
                        </div>
                    ` : ''}
                `;
                container.appendChild(box);
            });
        }

        function toggleBuilderRect(idx, val) {
            builderRects[idx].active = val;
            renderBuilderControls();
            recalcBuilder();
        }

        function updateBuilderParam(idx, key, val) {
            builderRects[idx][key] = parseFloat(val) || 0;
            recalcBuilder();
        }

        function recalcBuilder() {
            let Atot = 0;
            let Qy = 0;
            let Qx = 0;

            const activeList = builderRects.filter(r => r.active);
            activeList.forEach(r => {
                const A = r.b * r.h;
                const xc = r.x + r.b / 2;
                const yc = r.y + r.h / 2;

                Atot += A;
                Qy += A * xc;
                Qx += A * yc;
            });

            if (Atot === 0) return;

            const Xbar = Qy / Atot;
            const Ybar = Qx / Atot;

            let IxCent = 0;
            let IyCent = 0;
            let IxyCent = 0;

            activeList.forEach(r => {
                const A = r.b * r.h;
                const xc = r.x + r.b / 2;
                const yc = r.y + r.h / 2;

                const ixLocal = (r.b * Math.pow(r.h, 3)) / 12;
                const iyLocal = (r.h * Math.pow(r.b, 3)) / 12;

                const dx = xc - Xbar;
                const dy = yc - Ybar;

                IxCent += (ixLocal + A * dy * dy);
                IyCent += (iyLocal + A * dx * dx);
                IxyCent += (0 + A * dx * dy);
            });

            // Interactive Axes Shifted
            const dxInter = Xbar - builderInteractiveAxis.x;
            const dyInter = Ybar - builderInteractiveAxis.y;

            const IxInter = IxCent + Atot * Math.pow(dyInter, 2);
            const IyInter = IyCent + Atot * Math.pow(dxInter, 2);
            const IxyInter = IxyCent + Atot * dxInter * dyInter;

            // DOM Updates
            document.getElementById('bld-a-tot').innerText = `${Atot.toFixed(1)}`;
            document.getElementById('bld-a-tot2').innerText = `${Atot.toFixed(1)}`;

            document.getElementById('bld-c-pos').innerText = `(${Xbar.toFixed(1)}, ${Ybar.toFixed(1)})`;
            document.getElementById('bld-interactive-pos').innerText = `(${builderInteractiveAxis.x.toFixed(1)}, ${builderInteractiveAxis.y.toFixed(1)})`;

            document.getElementById('bld-ix-cent').innerText = `${IxCent.toFixed(1)}`;
            document.getElementById('bld-iy-cent').innerText = `${IyCent.toFixed(1)}`;
            document.getElementById('bld-ixy-cent').innerText = `${IxyCent.toFixed(1)}`;

            document.getElementById('bld-ix-inter').innerText = `${IxInter.toFixed(1)}`;
            document.getElementById('bld-iy-inter').innerText = `${IyInter.toFixed(1)}`;
            document.getElementById('bld-ixy-inter').innerText = `${IxyInter.toFixed(1)}`;

            drawBuilderSVG(Xbar, Ybar);
        }

        function drawBuilderSVG(Xbar, Ybar) {
            const svg = document.getElementById('builder-svg');
            if (!svg) return;

            let minX = 0, maxX = 30, minY = 0, maxY = 30;
            const activeList = builderRects.filter(r => r.active);

            activeList.forEach(r => {
                minX = Math.min(minX, r.x);
                maxX = Math.max(maxX, r.x + r.b);
                minY = Math.min(minY, r.y);
                maxY = Math.max(maxY, r.y + r.h);
            });

            const spanX = Math.max(40, maxX - minX + 10);
            const spanY = Math.max(30, maxY - minY + 10);

            const scaleX = 400 / spanX;
            const scaleY = 240 / spanY;
            const scale = Math.min(scaleX, scaleY);

            const offX = 50;
            const offY = 30;

            const interSvgX = offX + (builderInteractiveAxis.x - minX + 5) * scale;
            const interSvgY = offY + (builderInteractiveAxis.y - minY + 5) * scale;

            const centSvgX = offX + (Xbar - minX + 5) * scale;
            const centSvgY = offY + (Ybar - minY + 5) * scale;

            let rectsSVG = '';
            activeList.forEach(r => {
                const rx = offX + (r.x - minX + 5) * scale;
                const ry = offY + (r.y - minY + 5) * scale;
                const rw = r.b * scale;
                const rh = r.h * scale;

                rectsSVG += `<rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" fill="#0D4334" fill-opacity="0.35" stroke="#FFFFFF" stroke-width="1.5" />`;
            });

            svg.innerHTML = `
                <!-- Quadrantes Translucidos Coloridos em relação ao Eixo Interativo -->
                <!-- Q1 (Positivo x>0, y>0 -> top right em coordenadas cartesianas) -->
                <rect x="${interSvgX}" y="0" width="${500-interSvgX}" height="${interSvgY}" fill="#3182CE" fill-opacity="0.2" />
                <!-- Q3 (Positivo x<0, y<0 -> bottom left em cartesianas) -->
                <rect x="0" y="${interSvgY}" width="${interSvgX}" height="${300-interSvgY}" fill="#3182CE" fill-opacity="0.2" />
                
                <!-- Q2 (Negativo x<0, y>0 -> top left em cartesianas) -->
                <rect x="0" y="0" width="${interSvgX}" height="${interSvgY}" fill="#E53E3E" fill-opacity="0.2" />
                <!-- Q4 (Negativo x>0, y<0 -> bottom right em cartesianas) -->
                <rect x="${interSvgX}" y="${interSvgY}" width="${500-interSvgX}" height="${300-interSvgY}" fill="#E53E3E" fill-opacity="0.2" />

                <!-- Desenho dos Retângulos -->
                ${rectsSVG}

                <!-- Eixos Centroidais Originais (Linha Fina Verde) -->
                <line x1="0" y1="${centSvgY}" x2="500" y2="${centSvgY}" stroke="#80C29D" stroke-width="1.5" stroke-dasharray="3,3" />
                <line x1="${centSvgX}" y1="0" x2="${centSvgX}" y2="300" stroke="#80C29D" stroke-width="1.5" stroke-dasharray="3,3" />
                <circle cx="${centSvgX}" cy="${centSvgY}" r="5" fill="#80C29D" />

                <!-- Eixos Interativos Móveis (Amarelo / Interativo) -->
                <line x1="0" y1="${interSvgY}" x2="500" y2="${interSvgY}" stroke="#ECC94B" stroke-width="2.5" />
                <line x1="${interSvgX}" y1="0" x2="${interSvgX}" y2="300" stroke="#ECC94B" stroke-width="2.5" />
                <circle cx="${interSvgX}" cy="${interSvgY}" r="8" fill="#ECC94B" stroke="#000000" stroke-width="1.5" />
            `;
        }

        /* Mouse/Touch interaction for builder interactive axis */
        function initBuilderInteraction() {
            const container = document.getElementById('builder-svg-container');
            if (!container) return;

            const handleMove = (e) => {
                if (!isDraggingBuilderAxis) return;
                const rect = container.getBoundingClientRect();
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;

                const clickX = clientX - rect.left;
                const clickY = clientY - rect.top;

                // Map back to geometry space roughly
                builderInteractiveAxis.x = Math.round((clickX / rect.width) * 35);
                builderInteractiveAxis.y = Math.round((clickY / rect.height) * 35);

                recalcBuilder();
            };

            container.addEventListener('mousedown', () => { isDraggingBuilderAxis = true; });
            window.addEventListener('mouseup', () => { isDraggingBuilderAxis = false; });
            container.addEventListener('mousemove', handleMove);

            container.addEventListener('touchstart', () => { isDraggingBuilderAxis = true; });
            window.addEventListener('touchend', () => { isDraggingBuilderAxis = false; });
            container.addEventListener('touchmove', handleMove);
        }

        /* ============================================================================
           INIT DOCUMENT ENGINE & INITIAL CALCULATIONS
           ============================================================================ */
        document.addEventListener('DOMContentLoaded', () => {
            document.body.innerHTML = document.body.innerHTML.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

            updateGlobalIndicators();
            updateArrowStates();

            // Init Simulations & Renderers
            updateSkaterSim();
            animateSkaterLoop();
            animatePlanetOrbit();

            setRectDerivationStep('basal');
            renderShapesGallery();

            updateAct1Rect();
            updateBoxSim();
            updateIBeamSim();

            updateSteinerLab();

            loadBuilderPreset('ibeam');
            initBuilderInteraction();
        });