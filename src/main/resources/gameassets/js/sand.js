(() => {
  const Z = window.Zen;
  Z.setupPage('sand', 'reset');
  const canvas = document.getElementById('stage');
  const ctx = canvas.getContext('2d');
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  let particles = [], g = { x: 0, y: 0.22 }, drag = null;

  function resize() {
    const r = canvas.getBoundingClientRect(); canvas.width = r.width * dpr; canvas.height = r.height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function reset() {
    const r = canvas.getBoundingClientRect();
    particles = Array.from({ length: Math.min(300, Math.floor((r.width * r.height) / 430)) }, () => ({ x: Math.random() * r.width, y: Math.random() * r.height, vx: 0, vy: 0, rad: 1.5 + Math.random() * 1.6, hue: 20 + Math.random() * 50 }));
    g = { x: 0, y: 0.22 };
  }
  function loop() {
    const r = canvas.getBoundingClientRect(), w = r.width, h = r.height;
    ctx.fillStyle = 'rgba(9,12,18,.24)'; ctx.fillRect(0, 0, w, h);
    for (const p of particles) {
      p.vx = (p.vx + g.x) * 0.985; p.vy = (p.vy + g.y) * 0.985; p.x += p.vx; p.y += p.vy;
      if (p.x < p.rad) { p.x = p.rad; p.vx *= -0.4; } if (p.x > w - p.rad) { p.x = w - p.rad; p.vx *= -0.4; }
      if (p.y < p.rad) { p.y = p.rad; p.vy *= -0.4; } if (p.y > h - p.rad) { p.y = h - p.rad; p.vy *= -0.28; p.vx *= 0.96; }
      ctx.beginPath(); ctx.arc(p.x, p.y, p.rad, 0, Math.PI * 2); ctx.fillStyle = `hsla(${p.hue + (p.vx + p.vy) * 10},90%,64%,.9)`; ctx.fill();
    }
    requestAnimationFrame(loop);
  }

  canvas.onpointerdown = (e) => { const r = canvas.getBoundingClientRect(); drag = { x: e.clientX - r.left, y: e.clientY - r.top }; };
  canvas.onpointermove = (e) => {
    if (!drag) return;
    const r = canvas.getBoundingClientRect(); const x = e.clientX - r.left, y = e.clientY - r.top;
    g.x = Math.max(-0.42, Math.min(0.42, (x - drag.x) / 120)); g.y = Math.max(-0.42, Math.min(0.42, (y - drag.y) / 120));
  };
  canvas.onpointerup = canvas.onpointerleave = () => { drag = null; };

  document.getElementById('reset').onclick = reset;
  window.addEventListener('resize', () => { resize(); reset(); });
  resize(); reset(); loop();
})();
