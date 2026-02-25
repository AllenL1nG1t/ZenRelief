(() => {
  const Z = window.Zen;
  Z.setupPage('rain', 'refresh');

  const canvas = document.getElementById('stage');
  const ctx = canvas.getContext('2d');
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  let drops = [];
  let ripples = [];
  let hits = 0;

  function resize() {
    const r = canvas.getBoundingClientRect();
    canvas.width = r.width * dpr; canvas.height = r.height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function reset() {
    hits = 0; drops = []; ripples = [];
    document.getElementById('meta-a').textContent = `${Z.t('hits')}: 0`;
    document.getElementById('meta-b').textContent = `${Z.t('best')}: ${Z.bestGet('rainBest', 0)}`;
  }

  function spawn() {
    const r = canvas.getBoundingClientRect();
    const x = 20 + Math.random() * (r.width - 40);
    const len = 18 + Math.random() * 22;
    drops.push({ x, y: -30, vy: 3 + Math.random() * 2.8, len, w: 2 + Math.random() * 1.5 });
  }

  let tSpawn = 0;
  function loop(now) {
    const r = canvas.getBoundingClientRect();
    ctx.fillStyle = 'rgba(10,18,34,0.35)';
    ctx.fillRect(0, 0, r.width, r.height);

    tSpawn += 16;
    if (tSpawn > 95) { tSpawn = 0; spawn(); if (Math.random() > 0.55) spawn(); }

    for (let i = drops.length - 1; i >= 0; i--) {
      const d = drops[i];
      d.y += d.vy;
      d.vy += 0.03;

      const g = ctx.createLinearGradient(d.x, d.y - d.len, d.x, d.y);
      g.addColorStop(0, 'rgba(180,230,255,0.12)');
      g.addColorStop(0.7, 'rgba(160,220,255,0.78)');
      g.addColorStop(1, 'rgba(255,255,255,0.92)');
      ctx.strokeStyle = g;
      ctx.lineWidth = d.w;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y - d.len);
      ctx.lineTo(d.x, d.y);
      ctx.stroke();

      if (d.y > r.height + 10) {
        ripples.push({ x: d.x, y: r.height - 10, rr: 4, a: 0.55 });
        drops.splice(i, 1);
      }
    }

    for (let i = ripples.length - 1; i >= 0; i--) {
      const p = ripples[i];
      p.rr += 1.4; p.a *= 0.94;
      ctx.strokeStyle = `rgba(170,220,255,${p.a})`;
      ctx.lineWidth = 1.7;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.rr * 1.4, p.rr * 0.42, 0, 0, Math.PI * 2);
      ctx.stroke();
      if (p.a < 0.02) ripples.splice(i, 1);
    }

    requestAnimationFrame(loop);
  }

  canvas.addEventListener('pointerdown', (e) => {
    const rr = canvas.getBoundingClientRect();
    const x = e.clientX - rr.left, y = e.clientY - rr.top;
    for (let i = drops.length - 1; i >= 0; i--) {
      const d = drops[i];
      if (Math.abs(x - d.x) < 16 && y > d.y - d.len - 10 && y < d.y + 10) {
        drops.splice(i, 1);
        ripples.push({ x: d.x, y: y, rr: 3, a: 0.8 });
        hits++;
        document.getElementById('meta-a').textContent = `${Z.t('hits')}: ${hits}`;
        if (Z.bestSetMax('rainBest', hits)) document.getElementById('meta-b').textContent = `${Z.t('best')}: ${Z.bestGet('rainBest', 0)}`;
        Z.tone('triangle', 520, 180, 0.1, 0.1);
        break;
      }
    }
  });

  window.addEventListener('resize', resize);
  document.getElementById('reset').onclick = reset;
  resize(); reset(); requestAnimationFrame(loop);
})();
