
// INITIAL_DATA is loaded from data.json by index.html before this file runs

function loadData() {
  return JSON.parse(JSON.stringify(INITIAL_DATA));
}

// Saves to the server via save.php.
async function saveData(data) {
  try {
    const res = await fetch('save.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    return result;
  } catch (e) {
    // no PHP available (e.g. GitHub Pages) — the caller falls back to downloading data.json
    return { ok: false, noServer: true, error: 'No PHP server found.' };
  }
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
  document.getElementById('heroResume').href = data.resumeUrl || '#';
  document.getElementById('aboutText').textContent = data.about;
  document.getElementById('contactText').textContent = data.contactText;
  document.getElementById('footerText').textContent = data.footer;
  document.title = data.name + " — Portfolio";

  const avImg = document.getElementById('heroAvatarImg');
  const avFallback = document.getElementById('heroAvatarFallback');
  if (data.avatarImage) { avImg.src = data.avatarImage; avImg.style.display = 'block'; avFallback.style.display = 'none'; }
  else { avImg.style.display = 'none'; avFallback.style.display = 'flex'; }

  const skillsEl = document.getElementById('skillGroups');
  skillsEl.innerHTML = '';
  parseSkills(data.skillsRaw).forEach(g => {
    const div = document.createElement('div');
    div.className = 'skill-group';
    div.innerHTML = `<h3>${g.category}</h3><ul>${g.items.map(i => `<li>${i}</li>`).join('')}</ul>`;
    skillsEl.appendChild(div);
  });

  const projEl = document.getElementById('projectList');
  projEl.innerHTML = '';
  (data.projects || []).forEach(p => {
    const div = document.createElement('div');
    div.className = 'project';
    div.innerHTML = `
      ${p.image ? `<img class="project-img" src="${p.image}" alt="${p.title} screenshot">` : ''}
      <div class="project-head"><span class="project-title">${p.title}</span><span class="project-tags">${p.tags}</span></div>
      <p>${p.description}</p>
      ${p.link ? `<a class="project-link" href="${p.link}" target="_blank" rel="noopener">${p.linkLabel || 'View'}</a>` : ''}
    `;
    projEl.appendChild(div);
  });

  const certEl = document.getElementById('certList');
  certEl.innerHTML = '';
  parseCerts(data.certsRaw).forEach(c => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${c.name}</span><span class="cert-meta">${c.meta}</span>`;
    certEl.appendChild(li);
  });

  const linksEl = document.getElementById('contactLinks');
  linksEl.innerHTML = '';
  parseLinks(data.contactLinksRaw).forEach(c => {
    const a = document.createElement('a');
    a.href = c.href;
    a.target = c.href.startsWith('http') ? '_blank' : '_self';
    a.rel = 'noopener';
    a.innerHTML = `<span>${c.label} — ${c.value}</span>`;
    linksEl.appendChild(a);
  });
}

// ---- edit form ----
let editingProjects = [];

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
      <div class="field"><label>Title</label><input type="text" data-field="title" data-idx="${idx}" value="${(p.title||'').replace(/"/g,'&quot;')}"></div>
      <div class="field"><label>Tags</label><input type="text" data-field="tags" data-idx="${idx}" value="${(p.tags||'').replace(/"/g,'&quot;')}"></div>
      <div class="field"><label>Description</label><textarea data-field="description" data-idx="${idx}">${p.description||''}</textarea></div>
      <div class="field"><label>Link</label><input type="url" data-field="link" data-idx="${idx}" value="${(p.link||'').replace(/"/g,'&quot;')}"></div>
      <div class="field"><label>Link label</label><input type="text" data-field="linkLabel" data-idx="${idx}" value="${(p.linkLabel||'').replace(/"/g,'&quot;')}"></div>
      <div class="field">
        <label>Project photo</label>
        <div class="img-row">
          <img class="thumb wide" data-preview="${idx}" style="display:${p.image ? 'block':'none'}" src="${p.image||''}">
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
  editingAvatar = data.avatarImage || '';
  editingProjects = JSON.parse(JSON.stringify(data.projects || []));
  const thumb = document.getElementById('avatarThumb');
  if (editingAvatar) { thumb.src = editingAvatar; thumb.style.display = 'block'; }
  else { thumb.style.display = 'none'; }
  buildProjectFields();
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
document.getElementById('editBtn').addEventListener('click', () => {
  fillForm(current);
  overlay.classList.add('open');
});
document.getElementById('closeBtn').addEventListener('click', () => overlay.classList.remove('open'));
function downloadJson(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'data.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}


document.getElementById('saveBtn').addEventListener('click', async () => {
  const msg = document.getElementById('saveMsg');
  const saveBtn = document.getElementById('saveBtn');
  const candidate = readForm();

  saveBtn.disabled = true;
  msg.textContent = 'Saving…';

  const result = await saveData(candidate);

  saveBtn.disabled = false;
  if (result.ok) {
    current = candidate;
    render(current);
    typeIntro(current.typedLine);
    msg.textContent = 'Saved ✓ — live for everyone now';
  } else if (result.noServer) {
    // static hosting (GitHub Pages): update the page now, and hand over a new data.json to upload
    current = candidate;
    render(current);
    typeIntro(current.typedLine);
    downloadJson(candidate);
    msg.textContent = 'Downloaded data.json — upload it to your GitHub repo to keep it';
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

