(() => {
  const Z = window.Zen;
  Z.setupPage('slice', 'reset');

  const canvas = document.getElementById('stage');
  const ctx = canvas.getContext('2d');
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const blocks = [];
  let cuts = 0;

  const GAP = 2;
  const MIN_SIDE = 12;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function randomColor() {
    const hue = Math.random() * 360;
    return { hue, alpha: 0.95 };
  }

  function seed() {
    blocks.length = 0;
    cuts = 0;
    document.getElementById('meta-a').textContent = `${Z.t('score')}: 0`;
    document.getElementById('meta-b').textContent = `${Z.t('best')}: ${Z.bestGet('sliceBest', 0)}`;
    const rect = canvas.getBoundingClientRect();
    const pad = 14;
    blocks.push({ x: pad, y: pad, w: rect.width - pad * 2, h: rect.height - pad * 2, c: randomColor() });
  }

  function drawRoundedRect(x, y, w, h) {
    const radius = 10;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }

  function draw() {
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.fillStyle = 'rgba(8,15,30,0.55)';
    ctx.fillRect(0, 0, rect.width, rect.height);

    for (const block of blocks) {
      const gradient = ctx.createLinearGradient(block.x, block.y, block.x + block.w, block.y + block.h);
      gradient.addColorStop(0, `hsla(${block.c.hue},85%,68%,${block.c.alpha})`);
      gradient.addColorStop(1, `hsla(${(block.c.hue + 40) % 360},72%,45%,${block.c.alpha})`);
      ctx.fillStyle = gradient;
      drawRoundedRect(block.x, block.y, block.w, block.h);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.18)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  function canSplit(block) {
    return block.w > MIN_SIDE * 2 + GAP * 2 || block.h > MIN_SIDE * 2 + GAP * 2;
  }

  function chooseTargetIndex(clickedIndex) {
    if (canSplit(blocks[clickedIndex])) return clickedIndex;
    let bestIndex = -1;
    let bestArea = 0;
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      if (!canSplit(block)) continue;
      const area = block.w * block.h;
      if (area > bestArea) {
        bestArea = area;
        bestIndex = i;
      }
    }
    return bestIndex;
  }

  function splitTarget(index, px, py) {
    const block = blocks[index];
    const canVertical = block.w > MIN_SIDE * 2 + GAP * 2;
    const canHorizontal = block.h > MIN_SIDE * 2 + GAP * 2;
    if (!canVertical && !canHorizontal) return false;

    let vertical;
    if (canVertical && canHorizontal) vertical = block.w >= block.h;
    else vertical = canVertical;

    blocks.splice(index, 1);

    if (vertical) {
      const leftMin = block.x + MIN_SIDE;
      const leftMax = block.x + block.w - MIN_SIDE - GAP;
      const target = Math.max(leftMin, Math.min(leftMax, px));
      const cut = target - block.x;
      blocks.push({ x: block.x, y: block.y, w: cut - GAP / 2, h: block.h, c: randomColor() });
      blocks.push({ x: block.x + cut + GAP / 2, y: block.y, w: block.w - cut - GAP / 2, h: block.h, c: randomColor() });
    } else {
      const topMin = block.y + MIN_SIDE;
      const topMax = block.y + block.h - MIN_SIDE - GAP;
      const target = Math.max(topMin, Math.min(topMax, py));
      const cut = target - block.y;
      blocks.push({ x: block.x, y: block.y, w: block.w, h: cut - GAP / 2, c: randomColor() });
      blocks.push({ x: block.x, y: block.y + cut + GAP / 2, w: block.w, h: block.h - cut - GAP / 2, c: randomColor() });
    }

    cuts++;
    document.getElementById('meta-a').textContent = `${Z.t('score')}: ${cuts}`;
    if (Z.bestSetMax('sliceBest', cuts)) {
      document.getElementById('meta-b').textContent = `${Z.t('best')}: ${Z.bestGet('sliceBest', 0)}`;
    }
    Z.tone('sawtooth', 900, 140, 0.13, 0.08);
    return true;
  }

  canvas.addEventListener('pointerdown', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    let clickedIndex = -1;
    for (let i = blocks.length - 1; i >= 0; i--) {
      const block = blocks[i];
      if (x >= block.x && x <= block.x + block.w && y >= block.y && y <= block.y + block.h) {
        clickedIndex = i;
        break;
      }
    }
    if (clickedIndex < 0) return;

    const targetIndex = chooseTargetIndex(clickedIndex);
    if (targetIndex >= 0) {
      const target = blocks[targetIndex];
      const tx = Math.min(target.x + target.w - 1, Math.max(target.x + 1, x));
      const ty = Math.min(target.y + target.h - 1, Math.max(target.y + 1, y));
      splitTarget(targetIndex, tx, ty);
    } else {
      seed();
    }
    draw();
  });

  window.addEventListener('resize', () => {
    resize();
    seed();
    draw();
  });
  document.getElementById('reset').onclick = () => {
    seed();
    draw();
  };

  resize();
  seed();
  draw();
})();
