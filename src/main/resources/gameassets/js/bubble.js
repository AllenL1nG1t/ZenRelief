(() => {
  const Z = window.Zen;
  Z.setupPage('bubble', 'refresh');

  const canvas = document.getElementById('stage');
  const ctx = canvas.getContext('2d');
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  let bubbles = [];
  let popped = 0;
  let startAt = 0;

  function resize() {
    const r = canvas.getBoundingClientRect();
    canvas.width = r.width * dpr; canvas.height = r.height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function reset() {
    const r = canvas.getBoundingClientRect();
    const cols = 7, rows = 10;
    const cw = r.width / cols, ch = r.height / rows;
    bubbles = [];
    popped = 0;
    startAt = performance.now();
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      bubbles.push({ x: x * cw + cw / 2, y: y * ch + ch / 2, rad: Math.min(cw, ch) * 0.36, hit: false, hue: 180 + Math.random() * 180 });
    }
    document.getElementById('meta-a').textContent = `0`;
    const best = Z.bestGet('bubbleBest', 0);
    document.getElementById('meta-b').textContent = `${best ? best.toFixed(1) + 's' : '-'}`;
  }
  function draw() {
    const r = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, r.width, r.height);
    ctx.fillStyle = 'rgba(7,12,24,.35)'; ctx.fillRect(0, 0, r.width, r.height);
    for (const b of bubbles) {
      if (b.hit) {
        ctx.beginPath(); ctx.arc(b.x, b.y, b.rad * 0.45, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fill();
        continue;
      }
      const g = ctx.createRadialGradient(b.x - b.rad * .3, b.y - b.rad * .35, 1, b.x, b.y, b.rad * 1.3);
      g.addColorStop(0, 'rgba(255,255,255,.9)'); g.addColorStop(.35, `hsla(${b.hue},88%,65%,.9)`); g.addColorStop(1, `hsla(${(b.hue + 30) % 360},82%,42%,.26)`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(b.x, b.y, b.rad, 0, Math.PI * 2); ctx.fill();
    }
  }

  canvas.addEventListener('pointerdown', (e) => {
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    for (const b of bubbles) {
      if (b.hit) continue;
      if (Math.hypot(x - b.x, y - b.y) <= b.rad) {
        b.hit = true; popped++; Z.tone('sine', 700, 200, 0.09, 0.12);
        document.getElementById('meta-a').textContent = `${popped} / ${bubbles.length}`;
        if (popped === bubbles.length) {
          const t = (performance.now() - startAt) / 1000;
          if (Z.bestSetMin('bubbleBest', t)) document.getElementById('meta-b').textContent = `${Z.bestGet('bubbleBest', 0).toFixed(1)}s`;
        }
        draw();
        break;
      }
    }
  });

  window.addEventListener('resize', () => { resize(); reset(); draw(); });
  document.getElementById('reset').onclick = () => { reset(); draw(); };
  resize(); reset(); draw();
})();
