(() => {
  const Z = window.Zen;
  Z.setupPage('squishy', 'refresh');
  const canvas = document.getElementById('stage');
  const ctx = canvas.getContext('2d');
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  let pointer = { x: 0, y: 0, down: false };
  const pts = [];

  function resize() {
    const r = canvas.getBoundingClientRect();
    canvas.width = r.width * dpr; canvas.height = r.height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cx = r.width / 2, cy = r.height / 2, rad = r.width * 0.28;
    pts.length = 0;
    for (let i = 0; i < 34; i++) {
      const a = i / 34 * Math.PI * 2;
      const x = cx + Math.cos(a) * rad, y = cy + Math.sin(a) * rad;
      pts.push({ x, y, ox: x, oy: y, vx: 0, vy: 0 });
    }
  }

  function drawBlob() {
    const first = pts[0], last = pts[pts.length - 1];
    ctx.beginPath();
    ctx.moveTo((first.x + last.x) / 2, (first.y + last.y) / 2);
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i], n = pts[(i + 1) % pts.length];
      ctx.quadraticCurveTo(p.x, p.y, (p.x + n.x) / 2, (p.y + n.y) / 2);
    }
    ctx.closePath();
  }

  function loop() {
    const r = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, r.width, r.height);
    ctx.fillStyle = 'rgba(8,14,28,.45)'; ctx.fillRect(0, 0, r.width, r.height);
    for (const p of pts) {
      p.vx += (p.ox - p.x) * 0.08; p.vy += (p.oy - p.y) * 0.08;
      if (pointer.down) {
        const dx = p.x - pointer.x, dy = p.y - pointer.y, dist = Math.hypot(dx, dy);
        if (dist < 120 && dist > 0) { const f = (1 - dist / 120) * 0.5; p.vx += (dx / dist) * f * 20; p.vy += (dy / dist) * f * 20; }
      }
      p.vx *= 0.92; p.vy *= 0.92; p.x += p.vx; p.y += p.vy;
    }

    const cx = r.width / 2, cy = r.height / 2, rr = r.width * 0.35;
    const g = ctx.createRadialGradient(cx - rr * .35, cy - rr * .35, 12, cx, cy, rr);
    g.addColorStop(0, '#d7f5ff'); g.addColorStop(0.45, '#7fd1ff'); g.addColorStop(1, '#3670d1');
    ctx.fillStyle = g; drawBlob(); ctx.fill();
    requestAnimationFrame(loop);
  }

  canvas.onpointerdown = (e) => { const r = canvas.getBoundingClientRect(); pointer.down = true; pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top; Z.tone('sine', 150, 90, 0.2, 0.1); };
  canvas.onpointermove = (e) => { const r = canvas.getBoundingClientRect(); pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top; };
  canvas.onpointerup = canvas.onpointerleave = () => { pointer.down = false; };
  document.getElementById('reset').onclick = resize;
  window.addEventListener('resize', resize);
  resize(); loop();
})();
