// ─── Background Particles ───────────────
(function createParticles() {
    const container = document.getElementById('bgParticles');
    const colors = ['#667eea', '#764ba2', '#ffc843', '#34d399', '#ff6b6b', '#5ba8ff'];
    for (let i = 0; i < 30; i++) {
        const span = document.createElement('span');
        const size = Math.random() * 6 + 3;
        span.style.width = size + 'px';
        span.style.height = size + 'px';
        span.style.left = Math.random() * 100 + '%';
        span.style.background = colors[Math.floor(Math.random() * colors.length)];
        span.style.animationDuration = (Math.random() * 10 + 8) + 's';
        span.style.animationDelay = (Math.random() * 10) + 's';
        container.appendChild(span);
    }
})();

// ─── State ──────────────────────────────
const SET_LABELS = ['A', 'B', 'C', 'D', 'E'];
let drawCount = 0;
const historyData = [];

// ─── Get ball color class by number ─────
function getBallClass(num) {
    if (num <= 10) return 'range-1';
    if (num <= 20) return 'range-2';
    if (num <= 30) return 'range-3';
    if (num <= 40) return 'range-4';
    return 'range-5';
}

// ─── Generate unique random numbers for one set ─────
function generateOneSet() {
    const numbers = new Set();
    while (numbers.size < 7) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }
    const arr = [...numbers];
    const main = arr.slice(0, 6).sort((a, b) => a - b);
    const bonus = arr[6];
    return { main, bonus };
}

// ─── Build set rows in DOM ──────────────
function buildSetRows() {
    const container = document.getElementById('setsContainer');
    container.innerHTML = '';

    for (let s = 0; s < 5; s++) {
        const row = document.createElement('div');
        row.className = 'set-row';
        row.id = 'setRow' + s;

        // Label
        const label = document.createElement('span');
        label.className = 'set-label';
        label.textContent = SET_LABELS[s];
        row.appendChild(label);

        // 6 main balls
        for (let b = 0; b < 6; b++) {
            const ball = document.createElement('div');
            ball.className = 'ball';
            ball.id = `ball_${s}_${b}`;
            ball.textContent = '?';
            row.appendChild(ball);
        }

        // Plus sign
        const plus = document.createElement('span');
        plus.className = 'plus-sign';
        plus.textContent = '+';
        row.appendChild(plus);

        // Bonus ball
        const bonusBall = document.createElement('div');
        bonusBall.className = 'ball bonus';
        bonusBall.id = `bonus_${s}`;
        bonusBall.textContent = '?';
        row.appendChild(bonusBall);

        container.appendChild(row);
    }
}

// ─── Launch confetti ────────────────────
function launchConfetti() {
    const container = document.getElementById('confettiContainer');
    container.innerHTML = '';
    const colors = ['#ffc843', '#ff6b6b', '#5ba8ff', '#34d399', '#a78bfa', '#f472b6', '#facc15'];
    const shapes = ['circle', 'square'];
    for (let i = 0; i < 100; i++) {
        const el = document.createElement('div');
        el.className = 'confetti';
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        el.style.left = Math.random() * 100 + '%';
        el.style.background = colors[Math.floor(Math.random() * colors.length)];
        el.style.animationDelay = (Math.random() * 1) + 's';
        el.style.animationDuration = (Math.random() * 1.5 + 1.5) + 's';
        if (shape === 'circle') el.style.borderRadius = '50%';
        else el.style.borderRadius = '2px';
        el.style.width = (Math.random() * 8 + 6) + 'px';
        el.style.height = (Math.random() * 8 + 6) + 'px';
        container.appendChild(el);
    }
    setTimeout(() => container.innerHTML = '', 3500);
}

// ─── Draw numbers ───────────────────────
function drawNumbers() {
    const btn = document.getElementById('drawBtn');
    btn.classList.add('spinning');
    btn.disabled = true;

    drawCount++;
    buildSetRows();

    const allSets = [];
    for (let s = 0; s < 5; s++) {
        allSets.push(generateOneSet());
    }

    // Animate each set row with stagger
    allSets.forEach((set, s) => {
        const rowDelay = s * 400; // stagger each set by 400ms

        // Show the row
        setTimeout(() => {
            const row = document.getElementById('setRow' + s);
            row.classList.add('show');
        }, rowDelay);

        // Animate individual balls within the row
        set.main.forEach((num, b) => {
            setTimeout(() => {
                const ball = document.getElementById(`ball_${s}_${b}`);
                ball.textContent = num;
                ball.className = 'ball ' + getBallClass(num);
                ball.classList.add('show');
            }, rowDelay + 100 + b * 80);
        });

        // Bonus ball
        setTimeout(() => {
            const bonusBall = document.getElementById(`bonus_${s}`);
            bonusBall.textContent = set.bonus;
            bonusBall.className = 'ball bonus ' + getBallClass(set.bonus);
            bonusBall.classList.add('show');
        }, rowDelay + 100 + 6 * 80 + 50);
    });

    // All done - confetti & re-enable button
    const totalTime = 4 * 400 + 100 + 6 * 80 + 150;
    setTimeout(() => {
        launchConfetti();
        btn.classList.remove('spinning');
        btn.disabled = false;
    }, totalTime);

    // Save to history
    historyData.unshift({ sets: allSets, round: drawCount });
    if (historyData.length > 5) historyData.pop();
    setTimeout(() => updateHistory(), totalTime + 100);
}

// ─── Update history ─────────────────────
function updateHistory() {
    const section = document.getElementById('historySection');
    const list = document.getElementById('historyList');
    section.style.display = 'block';
    list.innerHTML = '';

    historyData.forEach(entry => {
        const group = document.createElement('div');
        group.className = 'history-group';

        const title = document.createElement('div');
        title.className = 'history-group-title';
        title.textContent = `#${entry.round}회 추첨`;
        group.appendChild(title);

        entry.sets.forEach((set, idx) => {
            const row = document.createElement('div');
            row.className = 'history-row';

            let html = `<span class="set-tag">${SET_LABELS[idx]}</span>`;
            set.main.forEach(n => {
                html += `<div class="mini-ball ${getBallClass(n)}">${n}</div>`;
            });
            html += `<span class="mini-plus">+</span>`;
            html += `<div class="mini-ball bonus ${getBallClass(set.bonus)}">${set.bonus}</div>`;

            row.innerHTML = html;
            group.appendChild(row);
        });

        list.appendChild(group);
    });
}

// ─── Dark/Light Mode Toggle ─────────────
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('lotto-theme', isLight ? 'light' : 'dark');
}

// Restore saved theme
(function restoreTheme() {
    const saved = localStorage.getItem('lotto-theme');
    if (saved === 'light') {
        document.body.classList.add('light-mode');
    }
})();

// ─── Initial setup ──────────────────────
buildSetRows();
