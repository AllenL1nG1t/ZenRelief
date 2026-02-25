(() => {
  const Z = window.Zen;
  Z.setupPage('petals', 'reset');

  const canvas = document.getElementById('stage');
  const ctx = canvas.getContext('2d');
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const petals = [];
  let taps = 0;
  let windX = 0;
  let windY = 0.08;
  let pointerDown = false;
  let lastX = 0;
  let lastY = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function makePetal(x, y, power = 1) {
    return {
      x, y,
      vx: (Math.random() - 0.5) * (1.2 + power),
      vy: -0.5 - Math.random() * 0.8,
      size: 8 + Math.random() * 10,
      rot: Math.random() * Math.PI * 2,
      rv: (Math.random() - 0.5) * 0.05,
      a: 0.9 + Math.random() * 0.1,
      hue: 320 + Math.random() * 32
    };
  }

  function burst(x, y, amount = 8, power = 1) {
    for (let i = 0; i < amount; i++) petals.push(makePetal(x, y, power));
  }

  function reset() {
    petals.length = 0;
    taps = 0;
    document.getElementById('meta-a').textContent = `${Z.t('taps')}: 0`;
    document.getElementById('meta-b').textContent = `${Z.t('best')}: ${Z.bestGet('petalsBest', 0)}`;
    const rect = canvas.getBoundingClientRect();
    for (let i = 0; i < 24; i++) {
      petals.push(makePetal(Math.random() * rect.width, Math.random() * rect.height, 0.2));
    }
  }

  function drawPetal(petal) {
    ctx.save();
    ctx.translate(petal.x, petal.y);
    ctx.rotate(petal.rot);
    const w = petal.size;
    const h = petal.size * 0.7;
    const grad = ctx.createLinearGradient(-w * 0.5, -h, w * 0.5, h);
    grad.addColorStop(0, `hsla(${petal.hue},80%,88%,${petal.a})`);
    grad.addColorStop(1, `hsla(${petal.hue + 20},78%,64%,${petal.a})`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0, -h);
    ctx.bezierCurveTo(w, -h * 0.6, w, h * 0.6, 0, h);
    ctx.bezierCurveTo(-w, h * 0.6, -w, -h * 0.6, 0, -h);
    ctx.fill();
    ctx.restore();
  }

  function loop() {
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const bg = ctx.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, 'rgba(38,18,42,0.92)');
    bg.addColorStop(1, 'rgba(18,10,24,0.98)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    windX *= 0.985;

    for (let i = petals.length - 1; i >= 0; i--) {
      const petal = petals[i];
      petal.vx += windX * 0.02;
      petal.vy += windY * 0.02;
      petal.x += petal.vx;
      petal.y += petal.vy;
      petal.rot += petal.rv;
      petal.a *= 0.9995;

      if (petal.x < -30) petal.x = width + 20;
      if (petal.x > width + 30) petal.x = -20;
      if (petal.y > height + 30) {
        petals.splice(i, 1);
        petals.push(makePetal(Math.random() * width, -20, 0.2));
        continue;
      }
      drawPetal(petal);
    }

    requestAnimationFrame(loop);
  }

  canvas.addEventListener('pointerdown', (event) => {
    pointerDown = true;
    const rect = canvas.getBoundingClientRect();
    lastX = event.clientX - rect.left;
    lastY = event.clientY - rect.top;
    burst(lastX, lastY, 9, 1);
    taps++;
    document.getElementById('meta-a').textContent = `${Z.t('taps')}: ${taps}`;
    if (Z.bestSetMax('petalsBest', taps)) {
      document.getElementById('meta-b').textContent = `${Z.t('best')}: ${Z.bestGet('petalsBest', 0)}`;
    }
    Z.tone('sine', 520, 320, 0.16, 0.08);
  });

  canvas.addEventListener('pointermove', (event) => {
    if (!pointerDown) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    windX += (x - lastX) * 0.03;
    windY = 0.06 + Math.abs(y - lastY) * 0.002;
    if (Math.random() > 0.7) burst(x, y, 2, 0.4);
    lastX = x;
    lastY = y;
  });

  function release() {
    pointerDown = false;
    windY = 0.08;
  }
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointerleave', release);
  canvas.addEventListener('pointercancel', release);

  window.addEventListener('resize', () => {
    resize();
    reset();
  });
  document.getElementById('reset').onclick = reset;

  resize();
  reset();
  requestAnimationFrame(loop);
})();
