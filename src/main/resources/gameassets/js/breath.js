(() => {
  const Z = window.Zen;
  Z.setupPage('breath', 'reset');
  const canvas = document.getElementById('stage');
  const ctx = canvas.getContext('2d');
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  let start = 0, hits = 0;

  function resize() { const r = canvas.getBoundingClientRect(); canvas.width = r.width * dpr; canvas.height = r.height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  function reset() { start = performance.now(); hits = 0; document.getElementById('meta-a').textContent = `${Z.t('hits')}: 0`; document.getElementById('meta-b').textContent = `${Z.t('best')}: ${Z.bestGet('breathBest', 0)}`; }
  function loop() {
    const r = canvas.getBoundingClientRect(), cx = r.width / 2, cy = r.height / 2;
    const phase = ((performance.now() - start) % 5200) / 5200 * Math.PI * 2;
    const ease = (Math.sin(phase - Math.PI / 2) + 1) / 2;
    const base = r.width * 0.18, out = base + ease * r.width * 0.18;
    ctx.clearRect(0, 0, r.width, r.height);
    const bg = ctx.createRadialGradient(cx, cy, 10, cx, cy, r.width * 0.7);
    bg.addColorStop(0, 'rgba(30,64,90,.45)'); bg.addColorStop(1, 'rgba(8,12,24,.92)');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, r.width, r.height);
    ctx.beginPath(); ctx.arc(cx, cy, base, 0, Math.PI * 2); ctx.fillStyle = `hsla(${190 + ease * 80},80%,${50 + ease * 20}%,0.92)`; ctx.fill();
    ctx.beginPath(); ctx.arc(cx, cy, out, 0, Math.PI * 2); ctx.strokeStyle = `hsla(${200 + ease * 80},100%,70%,${0.25 + ease * 0.45})`; ctx.lineWidth = 8; ctx.stroke();
    requestAnimationFrame(loop);
  }

  canvas.addEventListener('pointerdown', () => {
    const phase = ((performance.now() - start) % 5200) / 5200 * Math.PI * 2;
    const peak = (Math.sin(phase - Math.PI / 2) + 1) / 2;
    const ok = peak > 0.88;
    if (ok) {
      hits++; document.getElementById('meta-a').textContent = `${Z.t('hits')}: ${hits}`;
      if (Z.bestSetMax('breathBest', hits)) document.getElementById('meta-b').textContent = `${Z.t('best')}: ${Z.bestGet('breathBest', 0)}`;
    }
    Z.tone(ok ? 'sine' : 'square', ok ? 430 : 180, ok ? 670 : 120, 0.13, ok ? 0.12 : 0.06);
  });

  document.getElementById('reset').onclick = reset;
  window.addEventListener('resize', resize);
  resize(); reset(); loop();
})();
