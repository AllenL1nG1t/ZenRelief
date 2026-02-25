(() => {
  const Z = window.Zen;
  Z.setupPage('chain', 'reset');

  const canvas = document.getElementById('stage');
  const ctx = canvas.getContext('2d');
  const dpr = Math.max(1, window.devicePixelRatio || 1);

  const ROWS = 9, COLS = 7;
  const colors = ['#ff8aa2', '#ffd57e', '#8ce8c2', '#7ec4ff', '#be9cff'];
  let grid = [];
  let score = 0;

  function resize() {
    const r = canvas.getBoundingClientRect();
    canvas.width = r.width * dpr; canvas.height = r.height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function reset() {
    score = 0;
    grid = Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => Math.floor(Math.random() * colors.length)));
    document.getElementById('meta-a').textContent = `${Z.t('score')}: 0`;
    document.getElementById('meta-b').textContent = `${Z.t('best')}: ${Z.bestGet('chainBest', 0)}`;
    draw();
  }
  function neighbors(r, c) { return [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]]; }
  function collect(r, c) {
    const color = grid[r][c];
    const q = [[r, c]], seen = new Set([`${r},${c}`]), out = [];
    while (q.length) {
      const [cr, cc] = q.shift(); out.push([cr, cc]);
      for (const [nr, nc] of neighbors(cr, cc)) {
        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
        if (grid[nr][nc] !== color) continue;
        const k = `${nr},${nc}`; if (seen.has(k)) continue;
        seen.add(k); q.push([nr, nc]);
      }
    }
    return out;
  }
  function refill() {
    for (let c = 0; c < COLS; c++) {
      const stack = [];
      for (let r = ROWS - 1; r >= 0; r--) if (grid[r][c] >= 0) stack.push(grid[r][c]);
      for (let r = ROWS - 1; r >= 0; r--) grid[r][c] = stack[ROWS - 1 - r] ?? Math.floor(Math.random() * colors.length);
    }
  }
  function draw() {
    const r = canvas.getBoundingClientRect();
    const cw = r.width / COLS, ch = r.height / ROWS, rad = Math.min(cw, ch) * 0.35;
    ctx.clearRect(0, 0, r.width, r.height);
    ctx.fillStyle = 'rgba(5,9,22,0.4)'; ctx.fillRect(0, 0, r.width, r.height);
    for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
      const id = grid[y][x];
      const cx = x * cw + cw / 2, cy = y * ch + ch / 2;
      ctx.beginPath(); ctx.arc(cx, cy, rad + 1.4, 0, Math.PI * 2); ctx.fillStyle = 'rgba(0,0,0,.22)'; ctx.fill();
      const g = ctx.createRadialGradient(cx - rad * .35, cy - rad * .35, 1, cx, cy, rad * 1.1);
      g.addColorStop(0, 'rgba(255,255,255,.75)'); g.addColorStop(.35, colors[id]); g.addColorStop(1, 'rgba(20,24,36,.95)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2); ctx.fill();
    }
  }

  canvas.addEventListener('pointerdown', (e) => {
    const r = canvas.getBoundingClientRect();
    const cw = r.width / COLS, ch = r.height / ROWS;
    const c = Math.floor((e.clientX - r.left) / cw), rr = Math.floor((e.clientY - r.top) / ch);
    if (rr < 0 || rr >= ROWS || c < 0 || c >= COLS) return;
    const g = collect(rr, c);
    if (g.length < 2) { Z.tone('square', 170, 120, 0.1, 0.06); return; }
    g.forEach(([gr, gc]) => { grid[gr][gc] = -1; });
    score += g.length * g.length;
    document.getElementById('meta-a').textContent = `${Z.t('score')}: ${score}`;
    if (Z.bestSetMax('chainBest', score)) document.getElementById('meta-b').textContent = `${Z.t('best')}: ${Z.bestGet('chainBest', 0)}`;
    Z.tone('triangle', 260 + g.length * 30, 500, 0.16, 0.1);
    refill(); draw();
  });

  window.addEventListener('resize', () => { resize(); draw(); });
  document.getElementById('reset').onclick = reset;
  resize(); reset();
})();
