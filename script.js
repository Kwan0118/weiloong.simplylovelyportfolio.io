
// INITIAL_DATA is loaded from data.json by index.html before this file runs

function loadData() {
  return JSON.parse(JSON.stringify(INITIAL_DATA));
}

async function saveData(data, token) {
  const repoPath = document.getElementById('fGithubRepo').value.trim();
  if (token && repoPath) {
    const parts = repoPath.split('/').filter(Boolean);
    if (parts.length !== 2) return { ok: false, error: 'Enter the repository as owner/repository.' };
    const [owner, repo] = parts;
    const base = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
    const headers = {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json'
    };
    try {
      const repoRes = await fetch(base, { headers });
      if (!repoRes.ok) return { ok: false, error: `GitHub repository access failed (${repoRes.status}). Check the repository name and token permissions.` };
      const branch = (await repoRes.json()).default_branch;
      const fileRes = await fetch(`${base}/contents/data.json?ref=${encodeURIComponent(branch)}`, { headers });
      if (!fileRes.ok) return { ok: false, error: `Could not read data.json from GitHub (${fileRes.status}).` };
      const file = await fileRes.json();
      const putRes = await fetch(`${base}/contents/data.json`, {
        method: 'PUT', headers,
        body: JSON.stringify({
          message: 'Update portfolio content',
          content: btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2)))),
          sha: file.sha,
          branch
        })
      });
      if (!putRes.ok) {
        const error = await putRes.json().catch(() => ({}));
        return { ok: false, error: error.message || `GitHub could not save data.json (${putRes.status}).` };
      }
      return { ok: true, repo: `${owner}/${repo}` };
    } catch (error) {
      return { ok: false, error: 'Could not connect to GitHub. Check your connection and try again.' };
    }
  }
  if (location.hostname.endsWith('.github.io')) {
    return { ok: false, error: 'Enter your GitHub repository and a fine-grained token with Contents read/write access.' };
  }
  try {
    const res = await fetch('save.php', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    });
    return await res.json();
  } catch (error) {
    return { ok: false, error: 'No save server is available here. Open the GitHub Pages site and save with your repository token.' };
  }
}

const UI_TRANSLATIONS = {
  en: {
    '[data-i18n="chooseLanguage"]': 'Choose language', 'nav a[href="#about"]': 'About', 'nav a[href="#skills"]': 'Skills', 'nav a[href="#projects"]': 'Projects', 'nav a[href="#competitions"]': 'Competitions', 'nav a[href="#certs"]': 'Certs', 'nav a[href="#contact"]': 'Contact', '#editBtn': 'Edit content', '.hello': "Hello, I'm", '.i-am': "I'm", '.hero-links a[href="#projects"]': 'My Projects', '#heroResume': 'My Resume', '#about .path': 'about', '#skills .path': 'skills', '#projects .path': 'projects', '#competitions .path': 'competitions', '#certs .path': 'certifications', '#contact .path': 'contact', '#editOverlay h2': 'Edit your content', '#editOverlay .hint': 'Edit your details and save them directly to your GitHub repository. GitHub will publish the changes after its Pages build completes.', '#closeBtn': 'Close', '#saveBtn': 'Save', '#addProjectBtn': '+ Add project', '#addCompetitionBtn': '+ Add competition', '.github-save-fields label[for="fGithubRepo"]': 'GitHub repository (owner/repository)', '.github-save-fields label[for="fGithubToken"]': 'Fine-grained GitHub token (Contents: read and write)', '.github-save-fields .sub': 'Create a fine-grained token for this repository with Contents read and write access. The token is used only for this save and is not stored.'
  },
  ms: {
    '[data-i18n="chooseLanguage"]': 'Pilih bahasa', 'nav a[href="#about"]': 'Tentang', 'nav a[href="#skills"]': 'Kemahiran', 'nav a[href="#projects"]': 'Projek', 'nav a[href="#competitions"]': 'Pertandingan', 'nav a[href="#certs"]': 'Sijil', 'nav a[href="#contact"]': 'Hubungi', '#editBtn': 'Edit kandungan', '.hello': 'Hai, saya', '.i-am': 'Saya', '.hero-links a[href="#projects"]': 'Projek Saya', '#heroResume': 'Resume Saya', '#about .path': 'tentang', '#skills .path': 'kemahiran', '#projects .path': 'projek', '#competitions .path': 'pertandingan', '#certs .path': 'pensijilan', '#contact .path': 'hubungi', '#editOverlay h2': 'Edit kandungan anda', '#editOverlay .hint': 'Edit maklumat anda dan simpan terus ke repositori GitHub. GitHub akan menerbitkan perubahan selepas binaan Pages selesai.', '#closeBtn': 'Tutup', '#saveBtn': 'Simpan', '#addProjectBtn': '+ Tambah projek', '#addCompetitionBtn': '+ Tambah pertandingan', '.github-save-fields label[for="fGithubRepo"]': 'Repositori GitHub (pemilik/repositori)', '.github-save-fields label[for="fGithubToken"]': 'Token GitHub (kebenaran baca dan tulis kandungan)', '.github-save-fields .sub': 'Cipta token terhad untuk repositori ini dengan akses baca dan tulis Contents. Token hanya digunakan untuk simpanan ini dan tidak disimpan.'
  },
  'zh-CN': {
    '[data-i18n="chooseLanguage"]': '选择语言', 'nav a[href="#about"]': '关于', 'nav a[href="#skills"]': '技能', 'nav a[href="#projects"]': '项目', 'nav a[href="#competitions"]': '竞赛', 'nav a[href="#certs"]': '证书', 'nav a[href="#contact"]': '联系', '#editBtn': '编辑内容', '.hello': '你好，我是', '.i-am': '我是', '.hero-links a[href="#projects"]': '我的项目', '#heroResume': '我的简历', '#about .path': '关于', '#skills .path': '技能', '#projects .path': '项目', '#competitions .path': '竞赛', '#certs .path': '证书', '#contact .path': '联系', '#editOverlay h2': '编辑您的内容', '#editOverlay .hint': '编辑资料并直接保存到 GitHub 仓库。GitHub Pages 构建完成后会发布更改。', '#closeBtn': '关闭', '#saveBtn': '保存', '#addProjectBtn': '+ 添加项目', '#addCompetitionBtn': '+ 添加竞赛', '.github-save-fields label[for="fGithubRepo"]': 'GitHub 仓库（所有者/仓库名）', '.github-save-fields label[for="fGithubToken"]': 'GitHub 细粒度令牌（内容读写权限）', '.github-save-fields .sub': '请为此仓库创建具有 Contents 读写权限的细粒度令牌。令牌仅用于本次保存，不会被储存。'
  },
  'zh-TW': {
    '[data-i18n="chooseLanguage"]': '選擇語言', 'nav a[href="#about"]': '關於', 'nav a[href="#skills"]': '技能', 'nav a[href="#projects"]': '專案', 'nav a[href="#competitions"]': '競賽', 'nav a[href="#certs"]': '證書', 'nav a[href="#contact"]': '聯絡', '#editBtn': '編輯內容', '.hello': '你好，我是', '.i-am': '我是', '.hero-links a[href="#projects"]': '我的專案', '#heroResume': '我的履歷', '#about .path': '關於', '#skills .path': '技能', '#projects .path': '專案', '#competitions .path': '競賽', '#certs .path': '證書', '#contact .path': '聯絡', '#editOverlay h2': '編輯您的內容', '#editOverlay .hint': '編輯資料並直接儲存到 GitHub 儲存庫。GitHub Pages 建置完成後會發布變更。', '#closeBtn': '關閉', '#saveBtn': '儲存', '#addProjectBtn': '+ 新增專案', '#addCompetitionBtn': '+ 新增競賽', '.github-save-fields label[for="fGithubRepo"]': 'GitHub 儲存庫（擁有者/儲存庫）', '.github-save-fields label[for="fGithubToken"]': 'GitHub 細緻權杖（內容讀寫權限）', '.github-save-fields .sub': '請為此儲存庫建立具有 Contents 讀寫權限的細緻權杖。權杖僅用於本次儲存，不會保存。'
  }
};

Object.assign(UI_TRANSLATIONS, {
  ja: {
    '[data-i18n="chooseLanguage"]':'言語を選択','nav a[href="#about"]':'プロフィール','nav a[href="#skills"]':'スキル','nav a[href="#projects"]':'プロジェクト','nav a[href="#competitions"]':'大会','nav a[href="#certs"]':'資格','nav a[href="#contact"]':'連絡先','#editBtn':'内容を編集','.hello':'こんにちは、私は','.i-am':'私は','.hero-links a[href="#projects"]':'プロジェクトを見る','#heroResume':'履歴書','#about .path':'プロフィール','#skills .path':'スキル','#projects .path':'プロジェクト','#competitions .path':'大会','#certs .path':'資格','#contact .path':'連絡先','#editOverlay h2':'内容を編集','#closeBtn':'閉じる','#saveBtn':'保存','#addProjectBtn':'+ プロジェクトを追加','#addCompetitionBtn':'+ 大会を追加'
  },
  ko: {
    '[data-i18n="chooseLanguage"]':'언어 선택','nav a[href="#about"]':'소개','nav a[href="#skills"]':'기술','nav a[href="#projects"]':'프로젝트','nav a[href="#competitions"]':'대회','nav a[href="#certs"]':'자격증','nav a[href="#contact"]':'연락처','#editBtn':'내용 편집','.hello':'안녕하세요, 저는','.i-am':'저는','.hero-links a[href="#projects"]':'프로젝트 보기','#heroResume':'이력서','#about .path':'소개','#skills .path':'기술','#projects .path':'프로젝트','#competitions .path':'대회','#certs .path':'자격증','#contact .path':'연락처','#editOverlay h2':'내용 편집','#closeBtn':'닫기','#saveBtn':'저장','#addProjectBtn':'+ 프로젝트 추가','#addCompetitionBtn':'+ 대회 추가'
  },
  de: {
    '[data-i18n="chooseLanguage"]':'Sprache wählen','nav a[href="#about"]':'Über mich','nav a[href="#skills"]':'Fähigkeiten','nav a[href="#projects"]':'Projekte','nav a[href="#competitions"]':'Wettbewerbe','nav a[href="#certs"]':'Zertifikate','nav a[href="#contact"]':'Kontakt','#editBtn':'Inhalte bearbeiten','.hello':'Hallo, ich bin','.i-am':'Ich bin','.hero-links a[href="#projects"]':'Meine Projekte','#heroResume':'Mein Lebenslauf','#about .path':'über mich','#skills .path':'fähigkeiten','#projects .path':'projekte','#competitions .path':'wettbewerbe','#certs .path':'zertifikate','#contact .path':'kontakt','#editOverlay h2':'Inhalte bearbeiten','#closeBtn':'Schließen','#saveBtn':'Speichern','#addProjectBtn':'+ Projekt hinzufügen','#addCompetitionBtn':'+ Wettbewerb hinzufügen'
  },
  'pt-PT': {
    '[data-i18n="chooseLanguage"]':'Escolher idioma','nav a[href="#about"]':'Sobre mim','nav a[href="#skills"]':'Competências','nav a[href="#projects"]':'Projetos','nav a[href="#competitions"]':'Competições','nav a[href="#certs"]':'Certificações','nav a[href="#contact"]':'Contacto','#editBtn':'Editar conteúdo','.hello':'Olá, sou','.i-am':'Sou','.hero-links a[href="#projects"]':'Os meus projetos','#heroResume':'O meu currículo','#about .path':'sobre mim','#skills .path':'competências','#projects .path':'projetos','#competitions .path':'competições','#certs .path':'certificações','#contact .path':'contacto','#editOverlay h2':'Editar conteúdo','#closeBtn':'Fechar','#saveBtn':'Guardar','#addProjectBtn':'+ Adicionar projeto','#addCompetitionBtn':'+ Adicionar competição'
  }
});

// Translate the current portfolio text in place. The source data stays in English
// so edits and GitHub saves never overwrite it with machine-translated text.
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

['ja', 'ko', 'de', 'pt-PT'].forEach(language => { UI_TRANSLATIONS[language] = {}; });
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
  const labels = {
    ms: { 'Profile photo':'Foto profil', Name:'Nama', 'Typed role (types out under your name)':'Peranan yang ditaip di bawah nama', Tagline:'Slogan', 'Resume link':'Pautan resume', About:'Tentang', Skills:'Kemahiran', Projects:'Projek', Competitions:'Pertandingan', Certifications:'Pensijilan', 'Contact intro line':'Pengenalan hubungan', 'Contact links':'Pautan hubungan', 'Footer line':'Teks pengaki', Title:'Tajuk', Tags:'Tag', Description:'Penerangan', Link:'Pautan', 'Link label':'Label pautan', 'Project photo':'Foto projek', Organizer:'Penganjur', Date:'Tarikh', 'Result or award':'Keputusan atau anugerah', 'Link (optional)':'Pautan (pilihan)' },
    'zh-CN': { 'Profile photo':'个人照片', Name:'姓名', 'Typed role (types out under your name)':'姓名下方显示的职位', Tagline:'简介', 'Resume link':'简历链接', About:'关于', Skills:'技能', Projects:'项目', Competitions:'竞赛', Certifications:'证书', 'Contact intro line':'联系说明', 'Contact links':'联系链接', 'Footer line':'页脚文字', Title:'标题', Tags:'标签', Description:'描述', Link:'链接', 'Link label':'链接文字', 'Project photo':'项目图片', Organizer:'主办方', Date:'日期', 'Result or award':'成绩或奖项', 'Link (optional)':'链接（可选）' },
    'zh-TW': { 'Profile photo':'個人照片', Name:'姓名', 'Typed role (types out under your name)':'姓名下方顯示的職稱', Tagline:'簡介', 'Resume link':'履歷連結', About:'關於', Skills:'技能', Projects:'專案', Competitions:'競賽', Certifications:'證書', 'Contact intro line':'聯絡說明', 'Contact links':'聯絡連結', 'Footer line':'頁尾文字', Title:'標題', Tags:'標籤', Description:'描述', Link:'連結', 'Link label':'連結文字', 'Project photo':'專案圖片', Organizer:'主辦單位', Date:'日期', 'Result or award':'成績或獎項', 'Link (optional)':'連結（選填）' }
  }[language] || {};
  document.querySelectorAll('#editOverlay label:not(.file-label):not([for="fGithubRepo"]):not([for="fGithubToken"])').forEach(label => {
    const original = label.dataset.english || label.textContent.trim();
    label.dataset.english = original;
    label.textContent = labels[original] || original;
  });
  document.querySelectorAll('#editOverlay .section-h').forEach(heading => {
    const original = heading.dataset.english || heading.textContent.trim();
    heading.dataset.english = original;
    heading.textContent = labels[original] || original;
  });
  const selector = document.getElementById('languageSelect');
  if (selector) selector.value = language;
  try { localStorage.setItem('portfolio-language', language); } catch (error) {}
}

// resize + compress an uploaded image so it stays small in localStorage
function fileToDataUrl(file, maxDim, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) { height = Math.round(height * maxDim / width); width = maxDim; }
          else { width = Math.round(width * maxDim / height); height = maxDim; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
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
function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char]);
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

// ---- edit form ----
let editingProjects = [];
let editingCompetitions = [];

function buildCompetitionFields() {
  const container = document.getElementById('competitionFields');
  container.innerHTML = '';
  editingCompetitions.forEach((c, idx) => {
    const block = document.createElement('div'); block.className = 'project-block competition-block';
    block.innerHTML = `<div class="project-block-top"><span>Competition ${idx + 1}</span><button class="btn small danger" data-comp-remove="${idx}" type="button">Remove</button></div>
      <div class="field"><label>Name</label><input type="text" data-comp-field="title" data-idx="${idx}"></div>
      <div class="field"><label>Organizer</label><input type="text" data-comp-field="organizer" data-idx="${idx}"></div>
      <div class="field"><label>Date</label><input type="text" data-comp-field="date" data-idx="${idx}" placeholder="2026"></div>
      <div class="field"><label>Result or award</label><input type="text" data-comp-field="result" data-idx="${idx}" placeholder="Finalist, 2nd place, participant..."></div>
      <div class="field"><label>Description</label><textarea data-comp-field="description" data-idx="${idx}"></textarea></div>
      <div class="field"><label>Link (optional)</label><input type="url" data-comp-field="link" data-idx="${idx}"></div>`;
    container.appendChild(block);
    block.querySelectorAll('[data-comp-field]').forEach(el => { el.value = c[el.dataset.compField] || ''; });
  });
  container.querySelectorAll('[data-comp-field]').forEach(el => el.addEventListener('input', () => { editingCompetitions[el.dataset.idx][el.dataset.compField] = el.value; }));
  container.querySelectorAll('[data-comp-remove]').forEach(el => el.addEventListener('click', () => { editingCompetitions.splice(el.dataset.compRemove, 1); buildCompetitionFields(); }));
  applyLanguage(activeLanguage);
}

document.getElementById('addCompetitionBtn').addEventListener('click', () => {
  editingCompetitions.push({ title: '', organizer: '', date: '', result: '', description: '', link: '' });
  buildCompetitionFields();
});

function buildProjectFields() {
  const container = document.getElementById('projectFields');
  container.innerHTML = '';
  editingProjects.forEach((p, idx) => {
    const block = document.createElement('div');
    block.className = 'project-block';
    block.innerHTML = `
      <div class="project-block-top">
        <span>Project ${idx + 1}</span>
        <button class="btn small danger" data-remove="${idx}" type="button">Remove</button>
      </div>
      <div class="field"><label>Title</label><input type="text" data-field="title" data-idx="${idx}" value="${escapeHtml(p.title)}"></div>
      <div class="field"><label>Tags</label><input type="text" data-field="tags" data-idx="${idx}" value="${escapeHtml(p.tags)}"></div>
      <div class="field"><label>Description</label><textarea data-field="description" data-idx="${idx}">${escapeHtml(p.description)}</textarea></div>
      <div class="field"><label>Link</label><input type="url" data-field="link" data-idx="${idx}" value="${escapeHtml(p.link)}"></div>
      <div class="field"><label>Link label</label><input type="text" data-field="linkLabel" data-idx="${idx}" value="${escapeHtml(p.linkLabel)}"></div>
      <div class="field">
        <label>Project photo</label>
        <div class="img-row">
          <img class="thumb wide" data-preview="${idx}" style="display:${p.image ? 'block':'none'}" src="${escapeHtml(safeImage(p.image))}">
          <label class="file-label">Choose photo<input type="file" accept="image/*" data-imgfile="${idx}"></label>
          <button class="btn small" data-imgremove="${idx}" type="button">Remove photo</button>
        </div>
      </div>
    `;
    container.appendChild(block);
  });

  container.querySelectorAll('[data-field]').forEach(el => {
    el.addEventListener('input', () => {
      editingProjects[el.dataset.idx][el.dataset.field] = el.value;
    });
  });
  container.querySelectorAll('[data-remove]').forEach(el => {
    el.addEventListener('click', () => {
      editingProjects.splice(el.dataset.remove, 1);
      buildProjectFields();
    });
  });
  container.querySelectorAll('[data-imgfile]').forEach(el => {
    el.addEventListener('change', async () => {
      const idx = el.dataset.imgfile;
      const file = el.files[0];
      if (!file) return;
      try {
        const url = await fileToDataUrl(file, 900, 0.82);
        editingProjects[idx].image = url;
        buildProjectFields();
      } catch (e) { alert('Could not read that image.'); }
    });
  });
  container.querySelectorAll('[data-imgremove]').forEach(el => {
    el.addEventListener('click', () => {
      editingProjects[el.dataset.imgremove].image = '';
      buildProjectFields();
    });
  });
  applyLanguage(activeLanguage);
}

document.getElementById('addProjectBtn').addEventListener('click', () => {
  editingProjects.push({ title: 'New project', tags: '', description: '', link: '', linkLabel: 'View', image: '' });
  buildProjectFields();
});

let editingAvatar = '';
function fillForm(data) {
  fName.value = data.name;
  fTyped.value = data.typedLine;
  fTagline.value = data.tagline;
  fResume.value = data.resumeUrl;
  fAbout.value = data.about;
  fSkills.value = data.skillsRaw;
  fCerts.value = data.certsRaw;
  fContactText.value = data.contactText;
  fContactLinks.value = data.contactLinksRaw;
  fFooter.value = data.footer;
  const repoInput = document.getElementById('fGithubRepo');
  if (!repoInput.value && location.hostname.endsWith('.github.io')) {
    const owner = location.hostname.split('.')[0];
    const firstPathPart = location.pathname.split('/').filter(Boolean)[0];
    repoInput.value = `${owner}/${firstPathPart || `${owner}.github.io`}`;
  }
  editingAvatar = data.avatarImage || '';
  editingProjects = JSON.parse(JSON.stringify(data.projects || []));
  editingCompetitions = JSON.parse(JSON.stringify(data.competitions || []));
  const thumb = document.getElementById('avatarThumb');
  if (editingAvatar) { thumb.src = editingAvatar; thumb.style.display = 'block'; }
  else { thumb.style.display = 'none'; }
  buildProjectFields();
  buildCompetitionFields();
}

document.getElementById('avatarFile').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    editingAvatar = await fileToDataUrl(file, 400, 0.85);
    const thumb = document.getElementById('avatarThumb');
    thumb.src = editingAvatar; thumb.style.display = 'block';
  } catch (err) { alert('Could not read that image.'); }
});
document.getElementById('avatarRemove').addEventListener('click', () => {
  editingAvatar = '';
  document.getElementById('avatarThumb').style.display = 'none';
});

function readForm() {
  return {
    name: fName.value.trim() || INITIAL_DATA.name,
    typedLine: fTyped.value.trim() || INITIAL_DATA.typedLine,
    tagline: fTagline.value.trim(),
    resumeUrl: fResume.value.trim() || '#',
    about: fAbout.value.trim(),
    avatarImage: editingAvatar,
    skillsRaw: fSkills.value,
    projects: editingProjects,
    competitions: editingCompetitions,
    certsRaw: fCerts.value,
    contactText: fContactText.value.trim(),
    contactLinksRaw: fContactLinks.value,
    footer: fFooter.value.trim()
  };
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
fillForm(current);

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

const overlay = document.getElementById('editOverlay');

document.getElementById('closeBtn').addEventListener('click', () => overlay.classList.remove('open'));
document.getElementById('languageSelect').addEventListener('change', (event) => {
  changeLanguage(event.target.value);
});
let preferredLanguage = 'en';
try { preferredLanguage = localStorage.getItem('portfolio-language') || 'en'; } catch (error) {}
changeLanguage(preferredLanguage);

document.getElementById('saveBtn').addEventListener('click', async () => {
  const msg = document.getElementById('saveMsg');
  const saveBtn = document.getElementById('saveBtn');
  const candidate = readForm();
  const tokenInput = document.getElementById('fGithubToken');
  const token = tokenInput.value.trim();

  if (location.hostname.endsWith('.github.io') && (!document.getElementById('fGithubRepo').value.trim() || !token)) {
    msg.textContent = 'Enter your GitHub repository and a fine-grained token to save directly.';
    return;
  }

  saveBtn.disabled = true;
  msg.textContent = 'Saving to GitHub…';

  const result = await saveData(candidate, token);
  tokenInput.value = '';

  saveBtn.disabled = false;
  if (result.ok) {
    current = candidate;
    await changeLanguage(activeLanguage);
    msg.textContent = `Saved to ${result.repo}. GitHub Pages will publish it after the build finishes.`;
  } else {
    msg.textContent = result.error || 'Could not save.';
  }
  setTimeout(() => { msg.textContent = ''; }, 6000);
});

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
