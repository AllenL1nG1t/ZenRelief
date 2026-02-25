(() => {
  const Z = window.Zen;
  Z.setupPage('ripple', 'refresh');

  const canvas = document.getElementById('stage');
  const ctx = canvas.getContext('2d');
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const ripples = [];
  const sparks = [];
  let taps = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function reset() {
    taps = 0;
    ripples.length = 0;
    sparks.length = 0;
    document.getElementById('meta-a').textContent = `${Z.t('taps')}: 0`;
    document.getElementById('meta-b').textContent = `${Z.t('best')}: ${Z.bestGet('rippleBest', 0)}`;
  }

  function addRipple(x, y, strength = 1) {
    ripples.push({ x, y, r: 6, a: 0.8, speed: 0.9 + strength * 0.8 });
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      sparks.push({
        x, y,
        vx: Math.cos(angle) * (0.5 + Math.random() * 1.2),
        vy: Math.sin(angle) * (0.5 + Math.random() * 1.2),
        a: 0.6
      });
    }
  }

  canvas.addEventListener('pointerdown', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    addRipple(x, y, 1.2);
    taps++;
    document.getElementById('meta-a').textContent = `${Z.t('taps')}: ${taps}`;
    if (Z.bestSetMax('rippleBest', taps)) {
      document.getElementById('meta-b').textContent = `${Z.t('best')}: ${Z.bestGet('rippleBest', 0)}`;
    }
    Z.tone('sine', 420, 280, 0.18, 0.08);
  });

  let ticker = 0;
  function loop() {
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    ticker++;

    const bg = ctx.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, 'rgba(12,32,58,0.92)');
    bg.addColorStop(1, 'rgba(5,14,30,0.98)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    if (ticker % 70 === 0) {
      addRipple(20 + Math.random() * (width - 40), 40 + Math.random() * (height - 80), 0.6);
    }

    for (let i = ripples.length - 1; i >= 0; i--) {
      const ripple = ripples[i];
      ripple.r += ripple.speed;
      ripple.a *= 0.983;
      ctx.strokeStyle = `rgba(132,224,255,${ripple.a})`;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.ellipse(ripple.x, ripple.y, ripple.r * 1.5, ripple.r * 0.52, 0, 0, Math.PI * 2);
      ctx.stroke();
      if (ripple.a < 0.03) ripples.splice(i, 1);
    }

    for (let i = sparks.length - 1; i >= 0; i--) {
      const spark = sparks[i];
      spark.x += spark.vx;
      spark.y += spark.vy;
      spark.vx *= 0.985;
      spark.vy *= 0.985;
      spark.a *= 0.97;
      ctx.fillStyle = `rgba(192,245,255,${spark.a})`;
      ctx.fillRect(spark.x, spark.y, 2, 2);
      if (spark.a < 0.05) sparks.splice(i, 1);
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
