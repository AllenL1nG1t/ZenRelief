(() => {
  const Z = window.Zen;
  Z.setupPage('doodle', 'reset');
  const canvas = document.getElementById('stage');
  const ctx = canvas.getContext('2d');
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  let down = false, hue = 180;

  function resize() {
    const r = canvas.getBoundingClientRect();
    canvas.width = r.width * dpr; canvas.height = r.height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function reset() {
    const r = canvas.getBoundingClientRect();
    ctx.fillStyle = 'rgba(7,10,20,1)'; ctx.fillRect(0, 0, r.width, r.height);
  }

  function fade() {
    const r = canvas.getBoundingClientRect();
    ctx.fillStyle = 'rgba(7,10,20,.035)';
    ctx.fillRect(0, 0, r.width, r.height);
    requestAnimationFrame(fade);
  }

  canvas.addEventListener('pointerdown', (e) => { down = true; const r = canvas.getBoundingClientRect(); drawAt(e.clientX - r.left, e.clientY - r.top); Z.tone('triangle', 450, 260, .08, .08); });
  canvas.addEventListener('pointermove', (e) => { if (!down) return; const r = canvas.getBoundingClientRect(); drawAt(e.clientX - r.left, e.clientY - r.top); });
  canvas.addEventListener('pointerup', () => { down = false; });
  canvas.addEventListener('pointerleave', () => { down = false; });

  function drawAt(x, y) {
    hue = (hue + 2.5) % 360;
    ctx.beginPath(); ctx.arc(x, y, 6 + Math.random() * 4, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${hue},95%,65%,.8)`; ctx.fill();
    ctx.beginPath(); ctx.arc(x, y, 12 + Math.random() * 8, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${hue},95%,60%,.15)`; ctx.fill();
  }

  document.getElementById('reset').onclick = reset;
  window.addEventListener('resize', () => { resize(); reset(); });
  resize(); reset(); fade();
})();
