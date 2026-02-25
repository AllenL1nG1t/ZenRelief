(() => {
  const Z = window.Zen;
  Z.setupPage('chime', 'reset');

  const canvas = document.getElementById('stage');
  const ctx = canvas.getContext('2d');
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const chimes = [];
  const notes = [220, 247, 277, 330, 370, 415, 494];
  let taps = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function reset() {
    taps = 0;
    chimes.length = 0;
    document.getElementById('meta-a').textContent = `${Z.t('taps')}: 0`;
    document.getElementById('meta-b').textContent = `${Z.t('best')}: ${Z.bestGet('chimeBest', 0)}`;

    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const top = 26;
    for (let i = 0; i < notes.length; i++) {
      const x = ((i + 1) / (notes.length + 1)) * width;
      chimes.push({
        x,
        top,
        len: 118 + i * 7,
        angle: 0,
        vel: 0,
        glow: 0,
        note: notes[i]
      });
    }
  }

  function drawRoundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function strike(chime, force = 1) {
    chime.vel += (Math.random() > 0.5 ? 1 : -1) * (0.02 + force * 0.03);
    chime.glow = 1;
    Z.tone('triangle', chime.note, chime.note * 0.93, 0.22, 0.1);
    taps++;
    document.getElementById('meta-a').textContent = `${Z.t('taps')}: ${taps}`;
    if (Z.bestSetMax('chimeBest', taps)) {
      document.getElementById('meta-b').textContent = `${Z.t('best')}: ${Z.bestGet('chimeBest', 0)}`;
    }
  }

  canvas.addEventListener('pointerdown', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    let target = null;
    let distance = Infinity;
    for (const chime of chimes) {
      const bx = chime.x + Math.sin(chime.angle) * chime.len;
      const by = chime.top + Math.cos(chime.angle) * chime.len;
      const d = Math.hypot(x - bx, y - by);
      if (d < distance) {
        distance = d;
        target = chime;
      }
    }
    if (target && distance < 70) strike(target, Math.max(0.4, 1 - distance / 90));
  });

  function loop() {
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const bg = ctx.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, 'rgba(22,28,52,0.96)');
    bg.addColorStop(1, 'rgba(8,10,24,0.98)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(220,235,255,0.32)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(24, 26);
    ctx.lineTo(width - 24, 26);
    ctx.stroke();

    for (const chime of chimes) {
      chime.vel += -chime.angle * 0.012;
      chime.vel *= 0.986;
      chime.angle += chime.vel;
      chime.glow *= 0.95;

      const bx = chime.x + Math.sin(chime.angle) * chime.len;
      const by = chime.top + Math.cos(chime.angle) * chime.len;

      ctx.strokeStyle = 'rgba(190,210,255,0.72)';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(chime.x, chime.top);
      ctx.lineTo(bx, by);
      ctx.stroke();

      const bodyGrad = ctx.createRadialGradient(bx - 4, by - 8, 1, bx, by, 18);
      bodyGrad.addColorStop(0, `rgba(255,255,255,${0.72 + chime.glow * 0.22})`);
      bodyGrad.addColorStop(1, `rgba(120,190,255,${0.45 + chime.glow * 0.45})`);
      ctx.fillStyle = bodyGrad;
      drawRoundRect(bx - 10, by - 15, 20, 30, 8);
      ctx.fill();
    }

    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => {
    resize();
    reset();
  });
  document.getElementById('reset').onclick = reset;

  resize();
  reset();
  requestAnimationFrame(loop);
})();
