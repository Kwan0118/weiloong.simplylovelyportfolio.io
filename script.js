
// INITIAL_DATA is loaded from data.json by index.html before this file runs

function loadData() {
  return JSON.parse(JSON.stringify(INITIAL_DATA));
}

const UI_TRANSLATIONS = {
  en: {
    '[data-i18n="chooseLanguage"]': 'Choose language', 'nav a[href="#about"]': 'About', 'nav a[href="#skills"]': 'Skills', 'nav a[href="#projects"]': 'Projects', 'nav a[href="#competitions"]': 'Competitions', 'nav a[href="#certs"]': 'Certs', 'nav a[href="#contact"]': 'Contact', '.hello': "Hello, I'm", '.i-am': "I'm", '.hero-links a[href="#projects"]': 'My Projects', '#heroResume': 'My Resume', '#about .path': 'About', '#skills .path': 'Skills', '#projects .path': 'Projects', '#competitions .path': 'Competitions', '#inspirations .path': 'My Inspirations', '#certs .path': 'Certifications', '#contact .path': 'Contact'
  },
  ms: {
    '[data-i18n="chooseLanguage"]': 'Pilih bahasa', 'nav a[href="#about"]': 'Tentang', 'nav a[href="#skills"]': 'Kemahiran', 'nav a[href="#projects"]': 'Projek', 'nav a[href="#competitions"]': 'Pertandingan', 'nav a[href="#certs"]': 'Sijil', 'nav a[href="#contact"]': 'Hubungi', '.hello': 'Hai, saya', '.i-am': 'Saya', '.hero-links a[href="#projects"]': 'Projek Saya', '#heroResume': 'Resume Saya', '#about .path': 'tentang', '#skills .path': 'kemahiran', '#projects .path': 'projek', '#competitions .path': 'pertandingan', '#certs .path': 'pensijilan', '#contact .path': 'hubungi'
  },
  'zh-CN': {
    '[data-i18n="chooseLanguage"]': '选择语言', 'nav a[href="#about"]': '关于', 'nav a[href="#skills"]': '技能', 'nav a[href="#projects"]': '项目', 'nav a[href="#competitions"]': '竞赛', 'nav a[href="#certs"]': '证书', 'nav a[href="#contact"]': '联系', '.hello': '你好，我是', '.i-am': '我是', '.hero-links a[href="#projects"]': '我的项目', '#heroResume': '我的简历', '#about .path': '关于', '#skills .path': '技能', '#projects .path': '项目', '#competitions .path': '竞赛', '#certs .path': '证书', '#contact .path': '联系'
  },
  'zh-TW': {
    '[data-i18n="chooseLanguage"]': '選擇語言', 'nav a[href="#about"]': '關於', 'nav a[href="#skills"]': '技能', 'nav a[href="#projects"]': '專案', 'nav a[href="#competitions"]': '競賽', 'nav a[href="#certs"]': '證書', 'nav a[href="#contact"]': '聯絡', '.hello': '你好，我是', '.i-am': '我是', '.hero-links a[href="#projects"]': '我的專案', '#heroResume': '我的履歷', '#about .path': '關於', '#skills .path': '技能', '#projects .path': '專案', '#competitions .path': '競賽', '#certs .path': '證書', '#contact .path': '聯絡'
  }
};

Object.assign(UI_TRANSLATIONS, {
  ja: {
    '[data-i18n="chooseLanguage"]':'言語を選択','nav a[href="#about"]':'プロフィール','nav a[href="#skills"]':'スキル','nav a[href="#projects"]':'プロジェクト','nav a[href="#competitions"]':'大会','nav a[href="#certs"]':'資格','nav a[href="#contact"]':'連絡先','.hello':'こんにちは、私は','.i-am':'私は','.hero-links a[href="#projects"]':'プロジェクトを見る','#heroResume':'履歴書','#about .path':'プロフィール','#skills .path':'スキル','#projects .path':'プロジェクト','#competitions .path':'大会','#certs .path':'資格','#contact .path':'連絡先'
  },
  ko: {
    '[data-i18n="chooseLanguage"]':'언어 선택','nav a[href="#about"]':'소개','nav a[href="#skills"]':'기술','nav a[href="#projects"]':'프로젝트','nav a[href="#competitions"]':'대회','nav a[href="#certs"]':'자격증','nav a[href="#contact"]':'연락처','.hello':'안녕하세요, 저는','.i-am':'저는','.hero-links a[href="#projects"]':'프로젝트 보기','#heroResume':'이력서','#about .path':'소개','#skills .path':'기술','#projects .path':'프로젝트','#competitions .path':'대회','#certs .path':'자격증','#contact .path':'연락처'
  },
  de: {
    '[data-i18n="chooseLanguage"]':'Sprache wählen','nav a[href="#about"]':'Über mich','nav a[href="#skills"]':'Fähigkeiten','nav a[href="#projects"]':'Projekte','nav a[href="#competitions"]':'Wettbewerbe','nav a[href="#certs"]':'Zertifikate','nav a[href="#contact"]':'Kontakt','.hello':'Hallo, ich bin','.i-am':'Ich bin','.hero-links a[href="#projects"]':'Meine Projekte','#heroResume':'Mein Lebenslauf','#about .path':'über mich','#skills .path':'fähigkeiten','#projects .path':'projekte','#competitions .path':'wettbewerbe','#certs .path':'zertifikate','#contact .path':'kontakt'
  },
  'pt-PT': {
    '[data-i18n="chooseLanguage"]':'Escolher idioma','nav a[href="#about"]':'Sobre mim','nav a[href="#skills"]':'Competências','nav a[href="#projects"]':'Projetos','nav a[href="#competitions"]':'Competições','nav a[href="#certs"]':'Certificações','nav a[href="#contact"]':'Contacto','.hello':'Olá, sou','.i-am':'Sou','.hero-links a[href="#projects"]':'Os meus projetos','#heroResume':'O meu currículo','#about .path':'sobre mim','#skills .path':'competências','#projects .path':'projetos','#competitions .path':'competições','#certs .path':'certificações','#contact .path':'contacto'
  }
});

// Translate a copy of the portfolio data for display; the source JSON stays unchanged.
const LANGUAGE_NAMES = { ms: 'Malay', 'zh-CN': 'Chinese (Simplified)', 'zh-TW': 'Chinese (Traditional)', ja: 'Japanese', ko: 'Korean', de: 'German', 'pt-PT': 'Portuguese (Portugal)' };
let languageRequestId = 0;
function translationCacheKey(language, value) {
  let hash = 2166136261;
  for (const char of value) { hash ^= char.codePointAt(0); hash = Math.imul(hash, 16777619); }
  return `portfolio-translation-${language}-${(hash >>> 0).toString(16)}`;
}
async function translateText(value, language) {
  if (!value || !value.trim()) return value;
  const key = translationCacheKey(language, value);
  try {
    const cached = localStorage.getItem(key);
    if (cached) return cached;
  } catch (error) {}
  const endpoint = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(value)}&langpair=en|${encodeURIComponent(language)}`;
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error(`Translation request failed (${response.status})`);
  const result = await response.json();
  const translated = result.responseData && result.responseData.translatedText;
  if (result.responseStatus !== 200 || !translated) throw new Error('Translation was unavailable');
  try { localStorage.setItem(key, translated); } catch (error) {}
  return translated;
}
async function translatePortfolio(data, language, requestId) {
  const copy = JSON.parse(JSON.stringify(data));
  const jobs = [];
  const skipKeys = new Set(['name', 'resumeUrl', 'avatarImage', 'link', 'image', 'date']);
  function visit(object) {
    if (Array.isArray(object)) { object.forEach(visit); return; }
    if (!object || typeof object !== 'object') return;
    Object.entries(object).forEach(([key, value]) => {
      if (skipKeys.has(key) || typeof value !== 'string' || !value.trim()) return;
      // Keep email addresses and destinations unchanged; translate only contact labels.
      if (key === 'contactLinksRaw') {
        const lines = value.split('\n');
        object[key] = '';
        jobs.push(Promise.all(lines.map(async line => {
          const parts = line.split('|');
          if (parts.length < 3) return line;
          parts[0] = await translateText(parts[0].trim(), language);
          return parts.map(part => part.trim()).join(' | ');
        })).then(linesOut => { object[key] = linesOut.join('\n'); }));
        return;
      }
      jobs.push(translateText(value, language).then(translated => { object[key] = translated; }));
    });
  }
  visit(copy);
  const settled = await Promise.allSettled(jobs);
  if (requestId !== languageRequestId) return null;
  return { data: copy, failed: settled.some(item => item.status === 'rejected') };
}
async function changeLanguage(language) {
  applyLanguage(language);
  const requestId = ++languageRequestId;
  const status = document.getElementById('languageStatus');
  if (language === 'en') {
    render(current); typeIntro(current.typedLine);
    status.textContent = '';
    return;
  }
  status.textContent = `Translating portfolio to ${LANGUAGE_NAMES[language] || language}…`;
  try {
    const result = await translatePortfolio(current, language, requestId);
    if (!result || requestId !== languageRequestId) return;
    render(result.data); typeIntro(result.data.typedLine);
    status.textContent = result.failed
      ? 'Some text could not be translated. Check your connection and try again.'
      : `Translated to ${LANGUAGE_NAMES[language]}.`;
  } catch (error) {
    if (requestId !== languageRequestId) return;
    render(current); typeIntro(current.typedLine);
    status.textContent = 'Translation service is unavailable. Showing the original language.';
  }
}

const inspirationSectionLabels = {
  en: ['Inspirations', 'My Inspirations'],
  ms: ['Inspirasi', 'inspirasi saya'],
  'zh-CN': ['激励人物', '我的榜样'],
  'zh-TW': ['激勵人物', '我的榜樣'],
  ja: ['憧れの人', '私の憧れの人'],
  ko: ['영감을 주는 사람', '내게 영감을 주는 사람'],
  de: ['Vorbilder', 'meine Vorbilder'],
  'pt-PT': ['Inspirações', 'as minhas inspirações']
};
Object.entries(inspirationSectionLabels).forEach(([language, labels]) => {
  UI_TRANSLATIONS[language]['nav a[href="#inspirations"]'] = labels[0];
  UI_TRANSLATIONS[language]['#inspirations .path'] = labels[1];
});
let activeLanguage = 'en';
function applyLanguage(language) {
  if (!UI_TRANSLATIONS[language]) language = 'en';
  activeLanguage = language;
  const dictionary = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;
  document.documentElement.lang = language;
  Object.entries(UI_TRANSLATIONS.en).forEach(([selector, english]) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = dictionary[selector] || english;
  });
  const selector = document.getElementById('languageSelect');
  if (selector) selector.value = language;
  try {
    if (language === 'en') localStorage.removeItem('portfolio-language');
    else localStorage.setItem('portfolio-language', language);
  } catch (error) {}
}

function parseSkills(raw) {
  return raw.split("\n").filter(Boolean).map(line => {
    const [cat, items] = line.split(":");
    return { category: (cat || "").trim(), items: (items || "").split(",").map(s => s.trim()).filter(Boolean) };
  });
}
function parseCerts(raw) {
  return raw.split("\n").filter(Boolean).map(line => {
    const [name, meta] = line.split("|").map(s => (s || "").trim());
    return { name, meta };
  });
}
function parseLinks(raw) {
  return raw.split("\n").filter(Boolean).map(line => {
    const [label, value, href] = line.split("|").map(s => (s || "").trim());
    return { label, value, href };
  });
}

function safeLink(value) {
  if (!value) return '';
  try {
    const url = new URL(value, location.href);
    return ['http:', 'https:', 'mailto:'].includes(url.protocol) ? url.href : '';
  } catch (error) { return ''; }
}
function safeImage(value) {
  if (/^data:image\/(?:jpeg|png|webp|gif);base64,/i.test(value || '')) return value;
  try {
    const url = new URL(value, location.href);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch (error) { return ''; }
}
// splits the name into letters so each one can pop in, one by one
const NAME_GRADIENT = [[91, 108, 255], [178, 79, 227], [255, 79, 163]];
function nameColor(t) {
  const seg = t * (NAME_GRADIENT.length - 1);
  const idx = Math.min(Math.floor(seg), NAME_GRADIENT.length - 2);
  const f = seg - idx, c1 = NAME_GRADIENT[idx], c2 = NAME_GRADIENT[idx + 1];
  return `rgb(${c1.map((v, k) => Math.round(v + (c2[k] - v) * f)).join(',')})`;
}

function renderName(name) {
  const el = document.getElementById('heroName');
  el.setAttribute('aria-label', name);
  el.innerHTML = '';
  let i = 0, k = 0;
  const total = Math.max(1, name.replace(/\s/g, '').length - 1);
  name.split(' ').forEach((word, wi, words) => {
    const w = document.createElement('span');
    w.className = 'word';
    w.setAttribute('aria-hidden', 'true');
    Array.from(word).forEach(ch => {
      const span = document.createElement('span');
      span.className = 'letter';
      span.style.setProperty('--i', i++);
      span.style.color = nameColor(k++ / total);
      span.textContent = ch;
      w.appendChild(span);
    });
    el.appendChild(w);
    if (wi < words.length - 1) { el.appendChild(document.createTextNode(' ')); i++; }
  });
}

function render(data) {
  renderName(data.name);
  document.getElementById('heroTagline').textContent = data.tagline;
  document.getElementById('heroResume').href = safeLink(data.resumeUrl) || '#';
  document.getElementById('aboutText').textContent = data.about;
  document.getElementById('contactText').textContent = data.contactText;
  document.getElementById('footerText').textContent = data.footer;
  document.title = data.name + " — Portfolio";

  const avImg = document.getElementById('heroAvatarImg');
  const avFallback = document.getElementById('heroAvatarFallback');
  const avatar = safeImage(data.avatarImage);
  if (avatar) { avImg.src = avatar; avImg.style.display = 'block'; avFallback.style.display = 'none'; }
  else { avImg.style.display = 'none'; avFallback.style.display = 'flex'; }

  const skillsEl = document.getElementById('skillGroups');
  skillsEl.innerHTML = '';
  parseSkills(data.skillsRaw).forEach(g => {
    const div = document.createElement('div');
    div.className = 'skill-group';
    const heading = document.createElement('h3'); heading.textContent = g.category;
    const list = document.createElement('ul');
    g.items.forEach(item => { const li = document.createElement('li'); li.textContent = item; list.appendChild(li); });
    div.append(heading, list);
    skillsEl.appendChild(div);
  });

  const projEl = document.getElementById('projectList');
  projEl.innerHTML = '';
  (data.projects || []).forEach(p => {
    const div = document.createElement('article'); div.className = 'project';
    const image = safeImage(p.image);
    if (image) { const img = document.createElement('img'); img.className = 'project-img'; img.src = image; img.alt = `${p.title || 'Project'} screenshot`; div.appendChild(img); }
    const head = document.createElement('div'); head.className = 'project-head';
    const title = document.createElement('span'); title.className = 'project-title'; title.textContent = p.title || '';
    const tags = document.createElement('span'); tags.className = 'project-tags'; tags.textContent = p.tags || '';
    head.append(title, tags);
    const description = document.createElement('p'); description.textContent = p.description || '';
    div.append(head, description);
    const projectHref = safeLink(p.link);
    if (projectHref) { const a = document.createElement('a'); a.className = 'project-link'; a.href = projectHref; a.target = '_blank'; a.rel = 'noopener'; a.textContent = p.linkLabel || 'View'; div.appendChild(a); }
    projEl.appendChild(div);
  });

  const competitionEl = document.getElementById('competitionList');
  competitionEl.innerHTML = '';
  (data.competitions || []).forEach(c => {
    const card = document.createElement('article'); card.className = 'competition';
    const title = document.createElement('h3'); title.textContent = c.title || 'Competition';
    const meta = document.createElement('p'); meta.className = 'competition-meta'; meta.textContent = [c.organizer, c.date, c.result].filter(Boolean).join(' · ');
    const description = document.createElement('p'); description.textContent = c.description || '';
    card.append(title, meta, description);
    const competitionHref = safeLink(c.link);
    if (competitionHref) { const a = document.createElement('a'); a.className = 'project-link'; a.href = competitionHref; a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'View details'; card.appendChild(a); }
    competitionEl.appendChild(card);
  });
  if (!(data.competitions || []).length) {
    const empty = document.createElement('p'); empty.className = 'competition-empty';
    empty.textContent = ({ ms: 'Pencapaian pertandingan akan dipaparkan di sini.', 'zh-CN': '竞赛成果将显示在这里。', 'zh-TW': '競賽成果將顯示於此。' })[activeLanguage] || 'Competition achievements will appear here.';
    competitionEl.appendChild(empty);
  }

  const inspirationEl = document.getElementById('inspirationList');
  inspirationEl.innerHTML = '';
  (data.inspirations || []).forEach(person => {
    const card = document.createElement('article');
    card.className = 'inspiration-card';

    const photoWrap = document.createElement('div');
    photoWrap.className = 'inspiration-photo-wrap';
    const initials = document.createElement('span');
    initials.className = 'inspiration-initials';
    initials.textContent = (person.name || '?').split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase();
    photoWrap.appendChild(initials);

    const image = safeImage(person.image);
    if (image) {
      const img = document.createElement('img');
      img.className = 'inspiration-photo';
      img.src = image;
      img.alt = `${person.name || 'Inspiration'} photo`;
      img.onload = () => { initials.hidden = true; };
      img.onerror = () => { img.style.display = 'none'; initials.hidden = false; };
      photoWrap.appendChild(img);
    }

    const name = document.createElement('h3');
    name.className = 'inspiration-name';
    name.textContent = person.name || '';
    const quote = document.createElement('blockquote');
    quote.className = 'inspiration-quote';
    quote.textContent = person.quote || '';
    card.append(photoWrap, name, quote);
    inspirationEl.appendChild(card);
  });

  const certEl = document.getElementById('certList');
  certEl.innerHTML = '';
  parseCerts(data.certsRaw).forEach(c => {
    const li = document.createElement('li');
    const name = document.createElement('span'); name.textContent = c.name || '';
    const meta = document.createElement('span'); meta.className = 'cert-meta'; meta.textContent = c.meta || '';
    li.append(name, meta);
    certEl.appendChild(li);
  });

  const linksEl = document.getElementById('contactLinks');
  linksEl.innerHTML = '';
  parseLinks(data.contactLinksRaw).forEach(c => {
    const a = document.createElement('a');
    const href = safeLink(c.href);
    if (href) { a.href = href; a.target = href.startsWith('http') ? '_blank' : '_self'; a.rel = 'noopener'; }
    const text = document.createElement('span'); text.textContent = `${c.label} — ${c.value}`;
    a.appendChild(text); linksEl.appendChild(a);
  });
}

// hero illustration reacts to the mouse — desktop only, motion-respecting
const canHover = window.matchMedia('(pointer: fine)').matches;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (canHover && !reduceMotion) {
  const pxEls = Array.from(document.querySelectorAll('.px'));
  let normX = 0, normY = 0, curNormX = 0, curNormY = 0;

  window.addEventListener('mousemove', (e) => {
    normX = (e.clientX / window.innerWidth) - 0.5;
    normY = (e.clientY / window.innerHeight) - 0.5;
  });

  function tick() {
    curNormX += (normX - curNormX) * 0.06;
    curNormY += (normY - curNormY) * 0.06;
    pxEls.forEach(el => {
      const depth = parseFloat(el.dataset.depth) || 20;
      el.style.transform = `translate(${curNormX * depth * -1.2}px, ${curNormY * depth * -1.2}px)`;
    });
    requestAnimationFrame(tick);
  }
  tick();
}

const themeToggle = document.getElementById('themeToggle');
function setTheme(theme) {
  const isDark = theme === 'dark';
  document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
  if (themeToggle) {
    const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    themeToggle.setAttribute('aria-label', label);
    themeToggle.title = label;
  }
  try { localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light'); } catch (error) {}
}
let preferredTheme = 'light';
try { preferredTheme = localStorage.getItem('portfolio-theme') || 'light'; } catch (error) {}
setTheme(preferredTheme);
if (themeToggle) themeToggle.addEventListener('click', () => {
  setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
});

let current = loadData();
render(current);

const whatsappToggle = document.getElementById('whatsappToggle');
const whatsappChat = document.getElementById('whatsappChat');
const whatsappWidget = document.querySelector('.whatsapp-widget');
const whatsappChatLink = document.getElementById('whatsappChatLink');
const whatsappSetupHint = document.getElementById('whatsappSetupHint');
const whatsappNumber = String(current.whatsappNumber || '').replace(/\D/g, '');
if (whatsappNumber) {
  whatsappChatLink.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hi Wei Loong, I would like to contact you.')}`;
  whatsappChatLink.removeAttribute('aria-disabled');
} else {
  whatsappChatLink.addEventListener('click', event => event.preventDefault());
  whatsappSetupHint.hidden = false;
}
whatsappToggle.addEventListener('click', () => {
  const isOpen = whatsappToggle.getAttribute('aria-expanded') === 'true';
  whatsappToggle.setAttribute('aria-expanded', String(!isOpen));
  whatsappChat.hidden = isOpen;
  whatsappWidget.classList.toggle('chat-open', !isOpen);
});

const typedEl = document.getElementById('typed');
function typeIntro(line) {
  typedEl.classList.remove('done');
  if (reduceMotion) { typedEl.textContent = line; typedEl.classList.add('done'); return; }
  let i = 0;
  typedEl.textContent = '';
  const timer = setInterval(() => {
    typedEl.textContent = line.slice(0, i + 1);
    i++;
    if (i >= line.length) { clearInterval(timer); typedEl.classList.add('done'); }
  }, 70);
}
typeIntro(current.typedLine);




document.getElementById('languageSelect').addEventListener('change', (event) => {
  changeLanguage(event.target.value);
});
let preferredLanguage = '';
try { preferredLanguage = localStorage.getItem('portfolio-language') || ''; } catch (error) {}
if (preferredLanguage && preferredLanguage !== 'en') {
  changeLanguage(preferredLanguage);
} else {
  applyLanguage('en');
}

// sections pop in whenever they enter the screen — scrolling down or back up
const revealSections = document.querySelectorAll('section:not(#hero)');
revealSections.forEach(s => s.classList.add('reveal'));
if ('IntersectionObserver' in window && !reduceMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      entry.target.classList.toggle('in-view', entry.isIntersecting);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });
  revealSections.forEach(s => observer.observe(s));
} else {
  revealSections.forEach(s => s.classList.add('in-view'));
}
