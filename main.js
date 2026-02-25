/* ========================================
   ZEN RELIEF - Game Logic
   ======================================== */

// ===== Screen Navigation =====
function switchScreen(targetId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(targetId);
  if (target) {
    target.classList.add('active');
  }
  // Initialize games when entering
  if (targetId === 'bubble-screen') initBubbles();
  if (targetId === 'squishy-screen') initSquishy();
  if (targetId === 'slime-screen') initSlice();
}

// ===== Audio Context (lazy init) =====
let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playPopSound() {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600 + Math.random() * 400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  } catch(e) {}
}

function playSquishSound() {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120 + Math.random() * 60, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  } catch(e) {}
}

function playSliceSound() {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800 + Math.random() * 300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  } catch(e) {}
}

// ========================================
// GAME 1: BUBBLE WRAP
// ========================================
let popCount = 0;
let totalBubbles = 0;

function initBubbles() {
  const grid = document.getElementById('bubble-grid');
  grid.innerHTML = '';
  popCount = 0;

  // Calculate grid size based on screen
  const cols = window.innerWidth < 400 ? 6 : 8;
  const rows = Math.floor((window.innerHeight - 140) / (52 + 6));
  totalBubbles = cols * rows;

  grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  document.getElementById('pop-count').textContent = '0';
  document.getElementById('pop-total').textContent = totalBubbles;

  const hueStart = Math.random() * 360;

  for (let i = 0; i < totalBubbles; i++) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    const hue = (hueStart + (i / totalBubbles) * 60) % 360;
    bubble.style.background = `radial-gradient(circle at 35% 35%, 
      rgba(255,255,255,0.25), 
      hsla(${hue}, 80%, 60%, 0.3) 40%, 
      hsla(${hue + 40}, 70%, 40%, 0.15) 100%)`;

    bubble.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      popBubble(bubble, e);
    });
    grid.appendChild(bubble);
  }
}

function popBubble(bubble, event) {
  if (bubble.classList.contains('popped')) return;
  bubble.classList.add('popped');
  popCount++;
  document.getElementById('pop-count').textContent = popCount;
  playPopSound();
  spawnParticles(event.clientX, event.clientY);

  // Celebrate when all popped
  if (popCount === totalBubbles) {
    setTimeout(() => {
      document.getElementById('pop-count').parentElement.textContent = '🎉 全部戳破！';
    }, 300);
  }
}

function spawnParticles(x, y) {
  const colors = ['#00e5ff', '#b44dff', '#ff4da6', '#ff8a00', '#00ff88'];
  for (let i = 0; i < 6; i++) {
    const p = document.createElement('div');
    p.className = 'pop-particle';
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    const angle = (Math.PI * 2 / 6) * i + Math.random() * 0.5;
    const dist = 30 + Math.random() * 40;
    p.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
    p.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 600);
  }
}

function resetBubbles() {
  initBubbles();
}

// ========================================
// GAME 2: SQUISHY BALL
// ========================================
let squishyCanvas, squishyCtx;
let squishyRAF = null;
let ball = null;
let pointer = { x: 0, y: 0, down: false };

const BALL_POINTS = 36;
const BALL_RADIUS = 100;
const STIFFNESS = 0.08;
const DAMPING = 0.92;
const PUSH_FORCE = 0.5;

function initSquishy() {
  squishyCanvas = document.getElementById('squishy-canvas');
  squishyCtx = squishyCanvas.getContext('2d');

  const dpr = window.devicePixelRatio || 1;
  const rect = squishyCanvas.getBoundingClientRect();
  squishyCanvas.width = rect.width * dpr;
  squishyCanvas.height = rect.height * dpr;
  squishyCtx.scale(dpr, dpr);

  const cx = rect.width / 2;
  const cy = rect.height / 2;

  // Create ball with spring points
  const hue = Math.random() * 360;
  ball = {
    cx, cy, hue,
    points: [],
    origPoints: []
  };

  for (let i = 0; i < BALL_POINTS; i++) {
    const angle = (Math.PI * 2 / BALL_POINTS) * i;
    const x = cx + Math.cos(angle) * BALL_RADIUS;
    const y = cy + Math.sin(angle) * BALL_RADIUS;
    ball.points.push({ x, y, vx: 0, vy: 0 });
    ball.origPoints.push({ x, y });
  }

  // Pointer events
  squishyCanvas.onpointerdown = (e) => {
    e.preventDefault();
    pointer.down = true;
    const r = squishyCanvas.getBoundingClientRect();
    pointer.x = e.clientX - r.left;
    pointer.y = e.clientY - r.top;
    playSquishSound();
  };
  squishyCanvas.onpointermove = (e) => {
    const r = squishyCanvas.getBoundingClientRect();
    pointer.x = e.clientX - r.left;
    pointer.y = e.clientY - r.top;
  };
  squishyCanvas.onpointerup = () => { pointer.down = false; };
  squishyCanvas.onpointerleave = () => { pointer.down = false; };

  if (squishyRAF) cancelAnimationFrame(squishyRAF);
  squishyLoop();
}

function squishyLoop() {
  if (!squishyCanvas) return;
  const rect = squishyCanvas.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;

  // Physics update
  for (let i = 0; i < BALL_POINTS; i++) {
    const p = ball.points[i];
    const o = ball.origPoints[i];

    // Spring force toward original position
    const dx = o.x - p.x;
    const dy = o.y - p.y;
    p.vx += dx * STIFFNESS;
    p.vy += dy * STIFFNESS;

    // Push away from pointer when pressed
    if (pointer.down) {
      const pdx = p.x - pointer.x;
      const pdy = p.y - pointer.y;
      const dist = Math.sqrt(pdx * pdx + pdy * pdy);
      if (dist < BALL_RADIUS * 1.5 && dist > 0) {
        const force = (1 - dist / (BALL_RADIUS * 1.5)) * PUSH_FORCE;
        p.vx += (pdx / dist) * force * BALL_RADIUS;
        p.vy += (pdy / dist) * force * BALL_RADIUS;
      }
    }

    p.vx *= DAMPING;
    p.vy *= DAMPING;
    p.x += p.vx;
    p.y += p.vy;
  }

  // Draw
  squishyCtx.clearRect(0, 0, w, h);

  // Soft shadow
  squishyCtx.save();
  squishyCtx.filter = 'blur(20px)';
  squishyCtx.fillStyle = `hsla(${ball.hue}, 60%, 30%, 0.3)`;
  drawBallShape(squishyCtx, 0, 8);
  squishyCtx.fill();
  squishyCtx.restore();

  // Main ball gradient
  const grad = squishyCtx.createRadialGradient(
    ball.cx - BALL_RADIUS * 0.3, ball.cy - BALL_RADIUS * 0.3, 10,
    ball.cx, ball.cy, BALL_RADIUS * 1.3
  );
  grad.addColorStop(0, `hsla(${ball.hue}, 80%, 75%, 1)`);
  grad.addColorStop(0.5, `hsla(${ball.hue + 20}, 70%, 55%, 1)`);
  grad.addColorStop(1, `hsla(${ball.hue + 40}, 60%, 35%, 1)`);

  squishyCtx.fillStyle = grad;
  drawBallShape(squishyCtx, 0, 0);
  squishyCtx.fill();

  // Highlight
  const hlGrad = squishyCtx.createRadialGradient(
    ball.cx - BALL_RADIUS * 0.35, ball.cy - BALL_RADIUS * 0.35, 5,
    ball.cx - BALL_RADIUS * 0.2, ball.cy - BALL_RADIUS * 0.2, BALL_RADIUS * 0.7
  );
  hlGrad.addColorStop(0, 'rgba(255,255,255,0.55)');
  hlGrad.addColorStop(1, 'rgba(255,255,255,0)');
  squishyCtx.fillStyle = hlGrad;
  drawBallShape(squishyCtx, 0, 0);
  squishyCtx.fill();

  // Press indicator
  if (pointer.down) {
    squishyCtx.beginPath();
    squishyCtx.arc(pointer.x, pointer.y, 12, 0, Math.PI * 2);
    squishyCtx.fillStyle = 'rgba(255,255,255,0.3)';
    squishyCtx.fill();
  }

  squishyRAF = requestAnimationFrame(squishyLoop);
}

function drawBallShape(ctx, ox, oy) {
  const pts = ball.points;
  ctx.beginPath();
  // Use smooth curve through points
  const first = pts[0];
  const last = pts[pts.length - 1];
  ctx.moveTo(
    (last.x + first.x) / 2 + ox,
    (last.y + first.y) / 2 + oy
  );
  for (let i = 0; i < pts.length; i++) {
    const curr = pts[i];
    const next = pts[(i + 1) % pts.length];
    ctx.quadraticCurveTo(
      curr.x + ox, curr.y + oy,
      (curr.x + next.x) / 2 + ox,
      (curr.y + next.y) / 2 + oy
    );
  }
  ctx.closePath();
}

function resetSquishy() {
  initSquishy();
}

// ========================================
// GAME 3: SATISFYING SLICE
// ========================================
let sliceCanvas, sliceCtx;
let sliceRAF = null;
let blocks = [];

const BLOCK_COLORS = [
  { h: 0, s: 75, l: 60 },    // Red
  { h: 30, s: 90, l: 55 },   // Orange
  { h: 55, s: 85, l: 55 },   // Yellow
  { h: 150, s: 70, l: 50 },  // Green
  { h: 200, s: 80, l: 55 },  // Blue
  { h: 270, s: 75, l: 60 },  // Purple
  { h: 330, s: 80, l: 60 },  // Pink
];

class Block {
  constructor(x, y, w, h, color, depth = 0) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
    this.depth = depth;
    this.targetX = x;
    this.targetY = y;
    this.vx = 0;
    this.vy = 0;
    this.scale = 1;
    this.opacity = 1;
    this.sliceable = depth < 4;
    this.spawnAnim = 1.2;  // start slightly big for entry animation
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    const s = this.scale * this.spawnAnim;
    const cx = this.x + this.w / 2;
    const cy = this.y + this.h / 2;
    ctx.translate(cx, cy);
    ctx.scale(s, s);
    ctx.translate(-cx, -cy);

    // Shadow
    ctx.fillStyle = `hsla(${this.color.h}, ${this.color.s}%, ${this.color.l - 20}%, 0.3)`;
    roundRect(ctx, this.x + 2, this.y + 3, this.w, this.h, 8);
    ctx.fill();

    // Main block
    const grad = ctx.createLinearGradient(this.x, this.y, this.x + this.w, this.y + this.h);
    grad.addColorStop(0, `hsl(${this.color.h}, ${this.color.s}%, ${this.color.l + 10}%)`);
    grad.addColorStop(1, `hsl(${this.color.h}, ${this.color.s}%, ${this.color.l - 5}%)`);
    ctx.fillStyle = grad;
    roundRect(ctx, this.x, this.y, this.w, this.h, 8);
    ctx.fill();

    // Highlight
    ctx.fillStyle = `rgba(255,255,255,0.2)`;
    roundRect(ctx, this.x + 3, this.y + 3, this.w - 6, this.h * 0.4, 6);
    ctx.fill();

    ctx.restore();
  }

  update() {
    // Smooth settle
    this.x += (this.targetX - this.x) * 0.12;
    this.y += (this.targetY - this.y) * 0.12;
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.9;
    this.vy *= 0.9;
    // Animate in
    this.spawnAnim += (1 - this.spawnAnim) * 0.15;
  }

  contains(px, py) {
    return px >= this.x && px <= this.x + this.w && py >= this.y && py <= this.y + this.h;
  }
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function initSlice() {
  sliceCanvas = document.getElementById('slice-canvas');
  sliceCtx = sliceCanvas.getContext('2d');

  const dpr = window.devicePixelRatio || 1;
  const rect = sliceCanvas.getBoundingClientRect();
  sliceCanvas.width = rect.width * dpr;
  sliceCanvas.height = rect.height * dpr;
  sliceCtx.scale(dpr, dpr);

  blocks = [];

  // Create initial blocks
  const w = rect.width;
  const h = rect.height;
  const margin = 12;
  const cols = 2;
  const rows = 3;
  const bw = (w - margin * (cols + 1)) / cols;
  const bh = (h - margin * (rows + 1)) / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const color = BLOCK_COLORS[Math.floor(Math.random() * BLOCK_COLORS.length)];
      const bx = margin + c * (bw + margin);
      const by = margin + r * (bh + margin);
      blocks.push(new Block(bx, by, bw, bh, color, 0));
    }
  }

  sliceCanvas.onpointerdown = (e) => {
    e.preventDefault();
    const r = sliceCanvas.getBoundingClientRect();
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;
    handleSlice(px, py);
  };

  if (sliceRAF) cancelAnimationFrame(sliceRAF);
  sliceLoop();
}

function handleSlice(px, py) {
  // Find topmost block that was clicked
  for (let i = blocks.length - 1; i >= 0; i--) {
    const b = blocks[i];
    if (b.contains(px, py) && b.sliceable) {
      playSliceSound();

      // Remove original block
      blocks.splice(i, 1);

      // Decide split direction: horizontal or vertical
      const splitHorizontal = b.w >= b.h;
      const gap = 4;

      if (splitHorizontal) {
        const halfW = (b.w - gap) / 2;
        const c1 = BLOCK_COLORS[Math.floor(Math.random() * BLOCK_COLORS.length)];
        const c2 = BLOCK_COLORS[Math.floor(Math.random() * BLOCK_COLORS.length)];
        const b1 = new Block(b.x, b.y, halfW, b.h, c1, b.depth + 1);
        const b2 = new Block(b.x + halfW + gap, b.y, halfW, b.h, c2, b.depth + 1);
        b1.vx = -3;
        b2.vx = 3;
        blocks.push(b1, b2);
      } else {
        const halfH = (b.h - gap) / 2;
        const c1 = BLOCK_COLORS[Math.floor(Math.random() * BLOCK_COLORS.length)];
        const c2 = BLOCK_COLORS[Math.floor(Math.random() * BLOCK_COLORS.length)];
        const b1 = new Block(b.x, b.y, b.w, halfH, c1, b.depth + 1);
        const b2 = new Block(b.x, b.y + halfH + gap, b.w, halfH, c2, b.depth + 1);
        b1.vy = -3;
        b2.vy = 3;
        blocks.push(b1, b2);
      }

      // Spawn particles at click point
      spawnSliceParticles(px, py, b.color);
      break;
    }
  }
}

function spawnSliceParticles(x, y, color) {
  const rect = sliceCanvas.getBoundingClientRect();
  const absX = rect.left + x;
  const absY = rect.top + y;
  for (let i = 0; i < 8; i++) {
    const p = document.createElement('div');
    p.className = 'pop-particle';
    p.style.left = absX + 'px';
    p.style.top = absY + 'px';
    p.style.background = `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
    p.style.width = '6px';
    p.style.height = '6px';
    const angle = (Math.PI * 2 / 8) * i + Math.random() * 0.4;
    const dist = 20 + Math.random() * 35;
    p.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
    p.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 600);
  }
}

function sliceLoop() {
  if (!sliceCanvas) return;
  const rect = sliceCanvas.getBoundingClientRect();
  sliceCtx.clearRect(0, 0, rect.width, rect.height);

  for (const b of blocks) {
    b.update();
    b.draw(sliceCtx);
  }

  sliceRAF = requestAnimationFrame(sliceLoop);
}

function resetSlice() {
  initSlice();
}

// ===== Init =====
// Pre-warm: nothing to do, games init on screen switch
