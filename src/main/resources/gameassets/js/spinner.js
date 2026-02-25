(() => {
  const Z = window.Zen;
  Z.setupPage('spinner', 'reset');
  const canvas = document.getElementById('stage');
  const ctx = canvas.getContext('2d');
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  let angle = 0, speed = 0;

  function resize() { const r = canvas.getBoundingClientRect(); canvas.width = r.width * dpr; canvas.height = r.height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  function reset() { speed = 0; document.getElementById('meta-a').textContent = `${Z.t('score')}: 0`; }

  function drawBlade(cx, cy, len, w) {
    ctx.beginPath();
    ctx.moveTo(cx + 28, cy - w / 2);
    ctx.quadraticCurveTo(cx + len * 0.75, cy - w, cx + len, cy);
    ctx.quadraticCurveTo(cx + len * 0.75, cy + w, cx + 28, cy + w / 2);
    ctx.closePath();
  }

  function loop() {
    const r = canvas.getBoundingClientRect(), cx = r.width / 2, cy = r.height / 2;
    ctx.clearRect(0, 0, r.width, r.height);
    ctx.fillStyle = 'rgba(10,16,30,.45)'; ctx.fillRect(0, 0, r.width, r.height);
    angle += speed; speed *= 0.993;
    document.getElementById('meta-a').textContent = `${Z.t('score')}: ${Math.floor(Math.abs(speed) * 1000)}`;

    ctx.save();
    ctx.translate(cx, cy); ctx.rotate(angle); ctx.translate(-cx, -cy);
    for (let i = 0; i < 3; i++) {
      ctx.save(); ctx.translate(cx, cy); ctx.rotate((Math.PI * 2 / 3) * i); ctx.translate(-cx, -cy);
      const grad = ctx.createLinearGradient(cx, cy, cx + 130, cy);
      grad.addColorStop(0, '#8dd6ff'); grad.addColorStop(1, '#5f7cff');
      ctx.fillStyle = grad; drawBlade(cx, cy, 130, 34); ctx.fill();
      ctx.restore();
    }
    ctx.restore();

    ctx.beginPath(); ctx.arc(cx, cy, 24, 0, Math.PI * 2); ctx.fillStyle = '#f2f7ff'; ctx.fill();
    ctx.beginPath(); ctx.arc(cx, cy, 10, 0, Math.PI * 2); ctx.fillStyle = '#90a4c9'; ctx.fill();
    requestAnimationFrame(loop);
  }

  canvas.addEventListener('pointerdown', (e) => {
    const r = canvas.getBoundingClientRect(), cx = r.width / 2, cy = r.height / 2;
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const a = Math.atan2(y - cy, x - cx);
    speed += (Math.sin(a + Math.PI * 0.5) > 0 ? 1 : -1) * 0.08;
    speed = Math.max(-0.32, Math.min(0.32, speed));
    Z.tone('triangle', 380, 240, 0.08, 0.08);
  });

  document.getElementById('reset').onclick = reset;
  window.addEventListener('resize', resize);
  resize(); reset(); loop();
})();
