if (typeof tailwind !== 'undefined') {
    tailwind.config = {
        theme: {
            extend: {
                colors: {
                    sicon: {
                        greenDark: '#0D4334',
                        greenLight: '#80C29D',
                        grayDark: '#A1A1A1',
                        grayLight: '#DEDEDE',
                        bgLight: '#F4F6F5'
                    }
                },
                fontFamily: {
                    sans: ['Montserrat', 'sans-serif'],
                }
            }
        }
    }
}

let currentX = 0;
let currentY = 0;

function updateResolutionIndicator() {
    const resIndicator = document.getElementById('resolution-indicator');
    if (resIndicator) {
        resIndicator.innerText = `${window.innerWidth}px × ${window.innerHeight}px`;
    }
}

function hasSlide(x, y) {
    if (typeof slideGrid === 'undefined') return false;
    return !!slideGrid[`${x},${y}`];
}

function updateNavigationArrows() {
    const arrowUp = document.getElementById('nav-arrow-up');
    const arrowDown = document.getElementById('nav-arrow-down');
    const arrowLeft = document.getElementById('nav-arrow-left');
    const arrowRight = document.getElementById('nav-arrow-right');
    const posDisplay = document.getElementById('grid-pos-display');

    if (posDisplay) posDisplay.innerText = `${currentX},${currentY}`;

    // Configurando Seta Acima (Y + 1)
    if (hasSlide(currentX, currentY + 1)) {
        arrowUp.classList.remove('text-white/30', 'pointer-events-none');
        arrowUp.classList.add('text-[#80C29D]', 'bg-[#80C29D]/10', 'border-[#80C29D]');
        arrowUp.style.textShadow = '0 0 8px rgba(128,194,157,0.6)';
    } else {
        arrowUp.classList.add('text-white/30', 'pointer-events-none');
        arrowUp.classList.remove('text-[#80C29D]', 'bg-[#80C29D]/10', 'border-[#80C29D]');
        arrowUp.style.textShadow = 'none';
    }

    // Configurando Seta Abaixo (Y - 1)
    if (hasSlide(currentX, currentY - 1)) {
        arrowDown.classList.remove('text-white/30', 'pointer-events-none');
        arrowDown.classList.add('text-[#80C29D]', 'bg-[#80C29D]/10', 'border-[#80C29D]');
        arrowDown.style.textShadow = '0 0 8px rgba(128,194,157,0.6)';
    } else {
        arrowDown.classList.add('text-white/30', 'pointer-events-none');
        arrowDown.classList.remove('text-[#80C29D]', 'bg-[#80C29D]/10', 'border-[#80C29D]');
        arrowDown.style.textShadow = 'none';
    }

    // Configurando Seta Esquerda (X - 1)
    if (hasSlide(currentX - 1, currentY)) {
        arrowLeft.classList.remove('text-white/30', 'pointer-events-none');
        arrowLeft.classList.add('text-[#80C29D]', 'bg-[#80C29D]/10', 'border-[#80C29D]');
        arrowLeft.style.textShadow = '0 0 8px rgba(128,194,157,0.6)';
    } else {
        arrowLeft.classList.add('text-white/30', 'pointer-events-none');
        arrowLeft.classList.remove('text-[#80C29D]', 'bg-[#80C29D]/10', 'border-[#80C29D]');
        arrowLeft.style.textShadow = 'none';
    }

    // Configurando Seta Direita (X + 1)
    if (hasSlide(currentX + 1, currentY)) {
        arrowRight.classList.remove('text-white/30', 'pointer-events-none');
        arrowRight.classList.add('text-[#80C29D]', 'bg-[#80C29D]/10', 'border-[#80C29D]');
        arrowRight.style.textShadow = '0 0 8px rgba(128,194,157,0.6)';
    } else {
        arrowRight.classList.add('text-white/30', 'pointer-events-none');
        arrowRight.classList.remove('text-[#80C29D]', 'bg-[#80C29D]/10', 'border-[#80C29D]');
        arrowRight.style.textShadow = 'none';
    }
}

function moveInGrid(dx, dy) {
    if (typeof slideGrid === 'undefined') return;

    const nextX = currentX + dx;
    const nextY = currentY + dy;

    if (hasSlide(nextX, nextY)) {
        const currentElement = document.getElementById(slideGrid[`${currentX},${currentY}`]);
        const nextElement = document.getElementById(slideGrid[`${nextX},${nextY}`]);

        if (currentElement && nextElement) {
            currentElement.classList.remove('slide-active');

            // Aplica efeitos de direção dependendo da mudança física das coordenadas
            if (dx > 0) {
                currentElement.classList.add('slide-hidden-left');
            } else if (dx < 0) {
                currentElement.classList.add('slide-hidden-right');
            } else if (dy > 0) {
                currentElement.classList.add('slide-hidden-down');
            } else if (dy < 0) {
                currentElement.classList.add('slide-hidden-up');
            }

            // Remove antigos estados ocultos do elemento de destino
            nextElement.classList.remove(
                'slide-hidden-left', 
                'slide-hidden-right', 
                'slide-hidden-up', 
                'slide-hidden-down'
            );
            nextElement.classList.add('slide-active');

            // Atualiza coordenadas locais
            currentX = nextX;
            currentY = nextY;
            updateNavigationArrows();
        }
    }
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowUp') {
        moveInGrid(0, 1);
    } else if (e.key === 'ArrowDown') {
        moveInGrid(0, -1);
    } else if (e.key === 'ArrowLeft') {
        moveInGrid(-1, 0);
    } else if (e.key === 'ArrowRight') {
        moveInGrid(1, 0);
    }
});

let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', function(event) {
    touchStartX = event.changedTouches[0].screenX;
    touchStartY = event.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', function(event) {
    const touchEndX = event.changedTouches[0].screenX;
    const touchEndY = event.changedTouches[0].screenY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    const threshold = 50; // pixels mínimos de arrasto para detectar o gesto

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Movimento horizontal
        if (Math.abs(deltaX) > threshold) {
            if (deltaX > 0) {
                moveInGrid(-1, 0); // Deslizar para a direita -> volta
            } else {
                moveInGrid(1, 0);  // Deslizar para a esquerda -> avança
            }
        }
    } else {
        // Movimento vertical
        if (Math.abs(deltaY) > threshold) {
            if (deltaY > 0) {
                moveInGrid(0, -1); // Deslizar para baixo -> desce
            } else {
                moveInGrid(0, 1);  // Deslizar para cima -> sobe
            }
        }
    }
}, { passive: true });

window.addEventListener('load', function() {
    updateResolutionIndicator();
    window.addEventListener('resize', updateResolutionIndicator);
    updateNavigationArrows();
});