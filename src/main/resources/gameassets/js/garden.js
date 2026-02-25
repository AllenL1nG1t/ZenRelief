(() => {
  const Z = window.Zen;
  Z.setupPage('garden', 'reset');
  const canvas = document.getElementById('stage');
  const ctx = canvas.getContext('2d');
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  let down = false;

  function resize() {
    const r = canvas.getBoundingClientRect();
    canvas.width = r.width * dpr; canvas.height = r.height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function reset() {
    const r = canvas.getBoundingClientRect();
    const g = ctx.createLinearGradient(0, 0, r.width, r.height);
    g.addColorStop(0, '#dcc38a'); g.addColorStop(1, '#bea067');
    ctx.fillStyle = g; ctx.fillRect(0, 0, r.width, r.height);
    for (let y = 8; y < r.height; y += 9) {
      ctx.strokeStyle = 'rgba(126,96,56,.18)'; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(r.width, y); ctx.stroke();
    }
  }
  function rake(x, y) {
    const cols = [-10, -5, 0, 5, 10];
    for (const dx of cols) {
      ctx.strokeStyle = 'rgba(95,70,38,.45)';
      ctx.lineWidth = 1.7;
      ctx.beginPath();
      ctx.moveTo(x + dx - 20, y);
      ctx.lineTo(x + dx + 20, y);
      ctx.stroke();
    }
  }

  canvas.addEventListener('pointerdown', (e) => { down = true; const r = canvas.getBoundingClientRect(); rake(e.clientX - r.left, e.clientY - r.top); Z.tone('sine', 320, 220, 0.11, 0.07); });
  canvas.addEventListener('pointermove', (e) => { if (!down) return; const r = canvas.getBoundingClientRect(); rake(e.clientX - r.left, e.clientY - r.top); });
  canvas.addEventListener('pointerup', () => { down = false; });
  canvas.addEventListener('pointerleave', () => { down = false; });

  document.getElementById('reset').onclick = reset;
  window.addEventListener('resize', () => { resize(); reset(); });
  resize(); reset();
})();
