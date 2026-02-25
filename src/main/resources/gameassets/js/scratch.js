(() => {
  const Z = window.Zen;
  Z.setupPage('scratch', 'reset');

  const canvas = document.getElementById('stage');
  const ctx = canvas.getContext('2d');
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const words = Z.text.scratch_words || [];
  let down = false;
  let phrase = '';

  function resize() {
    const r = canvas.getBoundingClientRect();
    canvas.width = r.width * dpr; canvas.height = r.height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function renderBase() {
    const r = canvas.getBoundingClientRect();
    const g = ctx.createLinearGradient(0, 0, r.width, r.height);
    const hue = Math.floor(Math.random() * 360);
    g.addColorStop(0, `hsl(${hue},85%,62%)`);
    g.addColorStop(.5, `hsl(${(hue + 45) % 360},80%,58%)`);
    g.addColorStop(1, `hsl(${(hue + 120) % 360},72%,52%)`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, r.width, r.height);
    ctx.fillStyle = 'rgba(255,255,255,.2)';
    for (let i = 0; i < 80; i++) ctx.fillRect(Math.random() * r.width, Math.random() * r.height, 2, 2);
    ctx.fillStyle = 'rgba(255,255,255,.92)';
    ctx.font = '700 28px Outfit'; ctx.textAlign = 'center';
    wrapText(ctx, phrase, r.width / 2, r.height / 2 - 20, r.width - 70, 38);

    ctx.globalCompositeOperation = 'source-over';
    const cover = ctx.createLinearGradient(0, 0, r.width, r.height);
    cover.addColorStop(0, 'rgba(225,230,240,.97)'); cover.addColorStop(1, 'rgba(150,160,175,.96)');
    ctx.fillStyle = cover; ctx.fillRect(0, 0, r.width, r.height);
    ctx.fillStyle = 'rgba(255,255,255,.17)';
    for (let i = 0; i < 180; i++) ctx.fillRect(Math.random() * r.width, Math.random() * r.height, 2 + Math.random() * 2, 1 + Math.random() * 2);
  }

  function wrapText(c, text, x, y, max, lh) {
    const words = String(text).split(' ');
    if (Z.lang !== 'en') { c.fillText(text, x, y); return; }
    let line = '', yy = y;
    words.forEach((w) => {
      const test = line ? `${line} ${w}` : w;
      if (c.measureText(test).width > max && line) { c.fillText(line, x, yy); line = w; yy += lh; }
      else line = test;
    });
    c.fillText(line, x, yy);
  }

  function updateProgress() {
    const w = canvas.width, h = canvas.height, data = ctx.getImageData(0, 0, w, h).data;
    let sample = 0, clear = 0;
    for (let y = 0; y < h; y += 8) for (let x = 0; x < w; x += 8) { sample++; if (data[(y * w + x) * 4 + 3] < 20) clear++; }
    const pct = Math.floor(clear / Math.max(1, sample) * 100);
    document.getElementById('meta-a').textContent = `${Z.t('progress')}: ${pct}%`;
    if (Z.bestSetMax('scratchBest', pct)) document.getElementById('meta-b').textContent = `${Z.t('best')}: ${Z.bestGet('scratchBest', 0)}%`;
  }

  function scratchAt(e) {
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath(); ctx.arc(x, y, 20, 0, Math.PI * 2); ctx.fill();
    Z.tone('triangle', 420, 180, 0.08, 0.08);
    updateProgress();
  }

  function reset() {
    phrase = words[Math.floor(Math.random() * words.length)] || 'Relax';
    document.getElementById('meta-a').textContent = `${Z.t('progress')}: 0%`;
    document.getElementById('meta-b').textContent = `${Z.t('best')}: ${Z.bestGet('scratchBest', 0)}%`;
    renderBase();
  }

  canvas.addEventListener('pointerdown', (e) => { down = true; scratchAt(e); });
  canvas.addEventListener('pointermove', (e) => { if (down) scratchAt(e); });
  canvas.addEventListener('pointerup', () => { down = false; });
  canvas.addEventListener('pointerleave', () => { down = false; });
  window.addEventListener('resize', () => { resize(); reset(); });
  document.getElementById('reset').onclick = reset;

  resize(); reset();
})();
