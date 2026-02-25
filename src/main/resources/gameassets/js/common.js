window.Zen = (() => {
  const LS_BEST = 'zenrelief_best_v2';
  const LS_VOL = 'zenrelief_sfx_v1';
  const best = load(LS_BEST, {});
  const sfxVolume = Number(localStorage.getItem(LS_VOL) || '0.8');

  const I18N = {
    zh: {
      back: '\u8fd4\u56de',
      reset: '\u91cd\u7f6e',
      refresh: '\u5237\u65b0',
      best: '\u6700\u4f73',
      score: '\u5206\u6570',
      hits: '\u51fb\u4e2d',
      progress: '\u8fdb\u5ea6',
      taps: '\u8f7b\u89e6',
      bubble: '\u6ce1\u6ce1\u7eb8',
      squishy: '\u5f39\u529b\u7403',
      slice: '\u5207\u5272\u5de5\u574a',
      rain: '\u96e8\u6ef4\u8fde\u70b9',
      breath: '\u547c\u5438\u8282\u594f\u5708',
      sand: '\u6c99\u7c92\u5f15\u6d41',
      chain: '\u8fde\u9501\u6d88\u9664',
      scratch: '\u522e\u522e\u4e50',
      spinner: '\u6307\u5c16\u9640\u87ba',
      garden: '\u7985\u610f\u6c99\u76d8',
      doodle: '\u5149\u8f68\u6d82\u9e26',
      ripple: '\u6d9f\u6f2a\u8f7b\u89e6',
      petals: '\u82b1\u74e3\u6f02\u6d41',
      chime: '\u98ce\u94c3\u56de\u54cd',
      h_bubble: '\u6233\u7834\u6240\u6709\u6ce1\u6ce1',
      h_squishy: '\u6309\u4f4f\u62d6\u52a8\u7403\u4f53',
      h_slice: '\u65e0\u9650\u5207\u5272\uff0c\u8d8a\u5207\u8d8a\u89e3\u538b',
      h_rain: '\u70b9\u6309\u4e0b\u843d\u96e8\u6ef4\u548c\u6c34\u82b1',
      h_breath: '\u5916\u5708\u6700\u4eae\u65f6\u8f7b\u70b9',
      h_sand: '\u6309\u4f4f\u62d6\u52a8\u6539\u53d8\u91cd\u529b',
      h_chain: '\u70b9\u51fb2\u4e2a\u4ee5\u4e0a\u76f8\u90bb\u540c\u8272\u5757',
      h_scratch: '\u522e\u5f00\u6d82\u5c42\u67e5\u770b\u60ca\u559c\u8bed\u53e5',
      h_spinner: '\u8f7b\u5f39\u53f6\u7247\u8ba9\u5b83\u65cb\u8f6c',
      h_garden: '\u62d6\u52a8\u5728\u6c99\u9762\u5212\u51fa\u7eb9\u8def',
      h_doodle: '\u62d6\u52a8\u7ed8\u5236\u4f1a\u6162\u6162\u6d88\u6563\u7684\u7ebf\u6761',
      h_ripple: '\u8f7b\u89e6\u6c34\u9762\u6269\u6563\u6d9f\u6f2a',
      h_petals: '\u6ed1\u52a8\u91ca\u653e\u82b1\u74e3\u5e76\u89c2\u5bdf\u6f02\u6d41',
      h_chime: '\u70b9\u6309\u98ce\u94c3\u89e6\u53d1\u67d4\u548c\u97f3\u8272',
      scratch_words: [
        '\u6162\u4e0b\u6765\uff0c\u4e8b\u60c5\u4f1a\u53d8\u6e05\u6670\u3002',
        '\u4f60\u5df2\u7ecf\u505a\u5f97\u5f88\u597d\u4e86\u3002',
        '\u4eca\u5929\u4e5f\u503c\u5f97\u88ab\u6e29\u67d4\u5bf9\u5f85\u3002',
        '\u547c\u5438\u4e00\u53e3\uff0c\u653e\u6389\u4e00\u70b9\u7d27\u7ef7\u3002',
        '\u4e0d\u7528\u5b8c\u7f8e\uff0c\u5148\u653e\u677e\u5c31\u597d\u3002'
      ]
    },
    en: {
      back: 'Back',
      reset: 'Reset',
      refresh: 'Refresh',
      best: 'Best',
      score: 'Score',
      hits: 'Hits',
      progress: 'Progress',
      taps: 'Taps',
      bubble: 'Bubble Wrap',
      squishy: 'Squishy Ball',
      slice: 'Slice Studio',
      rain: 'Rain Tap',
      breath: 'Breath Ring',
      sand: 'Sand Flow',
      chain: 'Chain Pop',
      scratch: 'Scratch Card',
      spinner: 'Fidget Spinner',
      garden: 'Zen Garden',
      doodle: 'Glow Doodle',
      ripple: 'Ripple Calm',
      petals: 'Petal Drift',
      chime: 'Wind Chime',
      h_bubble: 'Pop all bubbles',
      h_squishy: 'Hold and drag the ball',
      h_slice: 'Infinite cuts, pure satisfying flow',
      h_rain: 'Tap falling drops and splashes',
      h_breath: 'Tap when the outer ring is brightest',
      h_sand: 'Drag to steer gravity',
      h_chain: 'Tap 2+ adjacent same-color cells',
      h_scratch: 'Scratch coating to reveal surprise words',
      h_spinner: 'Flick blades to spin',
      h_garden: 'Drag to rake calm sand lines',
      h_doodle: 'Draw fading neon trails',
      h_ripple: 'Tap the water to spread soft ripples',
      h_petals: 'Swipe and release drifting petals',
      h_chime: 'Tap chimes to hear gentle resonance',
      scratch_words: [
        'Slow down. Clarity follows.',
        'You are doing better than you think.',
        'Today deserves gentleness.',
        'Breathe in, release tension.',
        'No need to be perfect right now.'
      ]
    }
  };
  I18N.ja = { ...I18N.en };

  function load(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? { ...fallback, ...JSON.parse(raw) } : { ...fallback };
    } catch {
      return { ...fallback };
    }
  }

  function saveBest() {
    localStorage.setItem(LS_BEST, JSON.stringify(best));
  }

  function detectLang() {
    const htmlLang = (document.documentElement.lang || '').toLowerCase();
    const langs = [htmlLang, ...(navigator.languages || []), navigator.language || '']
      .map((v) => String(v).toLowerCase());
    for (const lang of langs) {
      if (lang.startsWith('zh')) return 'zh';
      if (lang.startsWith('ja')) return 'ja';
      if (lang.startsWith('en')) return 'en';
    }
    return 'en';
  }

  const lang = detectLang();
  const text = I18N[lang] || I18N.en;
  function t(key) {
    return text[key] || I18N.en[key] || key;
  }

  let audioCtx = null;
  function tone(type, f0, f1, dur = 0.12, vol = 0.12) {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const oscillator = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(f0, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(40, f1), audioCtx.currentTime + dur * 0.9);
      gain.gain.setValueAtTime(Math.max(0.0001, vol * sfxVolume), audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
      oscillator.connect(gain);
      gain.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + dur);
    } catch {}
  }

  function setupPage(gameKey, resetLabel = 'reset') {
    document.documentElement.lang = lang;
    const title = document.getElementById('title');
    const back = document.getElementById('back');
    const reset = document.getElementById('reset');
    const hint = document.getElementById('hint');
    if (title) title.textContent = t(gameKey);
    if (back) {
      back.textContent = `\u2190 ${t('back')}`;
      back.onclick = () => { location.href = window.__ZEN_BACK || '/'; };
    }
    if (reset) reset.textContent = t(resetLabel);
    if (hint) hint.textContent = t(`h_${gameKey}`);
    document.title = `${t(gameKey)} \u00b7 Zen Relief`;
  }

  function bestGet(key, fallback = 0) {
    return Number(best[key] ?? fallback);
  }
  function bestSetMax(key, value) {
    if (value > bestGet(key, 0)) {
      best[key] = value;
      saveBest();
      return true;
    }
    return false;
  }
  function bestSetMin(key, value) {
    const current = bestGet(key, 0);
    if (!current || value < current) {
      best[key] = value;
      saveBest();
      return true;
    }
    return false;
  }

  let lastTouchEnd = 0;
  document.addEventListener('touchend', (event) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) event.preventDefault();
    lastTouchEnd = now;
  }, { passive: false });

  return { lang, t, tone, setupPage, bestGet, bestSetMax, bestSetMin, text };
})();
