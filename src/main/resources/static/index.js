(async function bootstrap() {
  const I18N = {
    zh: {
      subtitle: '\u9009\u62e9\u4f60\u7684\u89e3\u538b\u6e38\u620f',
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
      s_bubble: '\u6233\u7834\u6bcf\u4e00\u4e2a\u6ce1\u6ce1',
      s_squishy: '\u6309\u538b\u548c\u62c9\u626f\u8f6f\u7403',
      s_slice: '\u65e0\u9650\u6b21\u89e3\u538b\u5207\u5272',
      s_rain: '\u66f4\u50cf\u96e8\u6ef4\u548c\u6c34\u82b1',
      s_breath: '\u8ddf\u7740\u8282\u594f\u8f7b\u70b9',
      s_sand: '\u62d6\u52a8\u91cd\u529b\u770b\u6c99\u6d41',
      s_chain: '\u70b9\u51fb2\u4e2a\u4ee5\u4e0a\u76f8\u90bb\u540c\u8272',
      s_scratch: '\u6bcf\u6b21\u90fd\u6709\u60ca\u559c\u8bed\u53e5',
      s_spinner: '\u8f7b\u5f39\u65cb\u8f6c\u653e\u7a7a',
      s_garden: '\u5212\u51fa\u5e73\u9759\u7eb9\u8def',
      s_doodle: '\u753b\u51fa\u4f1a\u6d88\u6563\u7684\u9713\u8679\u8f68\u8ff9',
      s_ripple: '\u8f7b\u89e6\u6269\u6563\u67d4\u548c\u6c34\u6ce2',
      s_petals: '\u6ed1\u52a8\u91ca\u653e\u7f13\u6162\u82b1\u74e3',
      s_chime: '\u8f7b\u70b9\u98ce\u94c3\u8046\u542c\u5171\u632f'
    },
    en: {
      subtitle: 'Choose your stress relief game'
    }
  };
  I18N.ja = { ...I18N.en };

  function detectLang() {
    const langs = [...(navigator.languages || []), navigator.language || '']
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

  function localTitle(game) {
    return text[game.id] || game.title;
  }
  function localSubtitle(game) {
    return text[`s_${game.id}`] || game.subtitle;
  }

  try {
    const subtitle = document.getElementById('subtitle');
    if (subtitle) subtitle.textContent = text.subtitle || I18N.en.subtitle;

    const response = await fetch('/api/games', { cache: 'no-store' });
    if (!response.ok) throw new Error('Failed to load games');
    const games = await response.json();

    const list = document.getElementById('game-list');
    list.innerHTML = '';

    for (const game of games) {
      const link = document.createElement('a');
      link.className = 'card';
      link.href = `/play/${encodeURIComponent(game.id)}`;
      link.innerHTML = `
        <span class="icon">${game.icon}</span>
        <span class="txt"><b>${localTitle(game)}</b><small>${localSubtitle(game)}</small></span>
        <span class="arrow">\u2192</span>
      `;
      list.appendChild(link);
    }
  } catch (error) {
    const subtitle = document.getElementById('subtitle');
    if (subtitle) subtitle.textContent = `Error: ${error.message}`;
  }
})();
