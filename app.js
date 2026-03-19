let path = []; // [] = root | [courseId] = course | [courseId, topicId] = topic

// render() is called by index.html after data.js loads dynamically

function render() {
  document.getElementById('view-root').classList.add('hidden');
  document.getElementById('view-course').classList.add('hidden');
  document.getElementById('view-topic').classList.add('hidden');

  if (path.length === 0) renderRoot();
  else if (path.length === 1) renderCourse();
  else renderTopic();
}

// ── ROOT: list all courses ──────────────────────────────────────
function renderRoot() {
  const el = document.getElementById('view-root');
  el.classList.remove('hidden');

  const courses = DRIVE_DATA.courses || [];

  if (!courses.length) {
    el.innerHTML = '<div class="empty">No courses yet.</div>';
    return;
  }

  el.innerHTML = `
    <table class="item-table">
      <thead>
        <tr>
          <th>Course</th>
          <th>Code</th>
          <th>Topics</th>
        </tr>
      </thead>
      <tbody>
        ${courses.map(c => `
          <tr onclick="nav('${c.id}')">
            <td><span class="item-link">${c.name}</span></td>
            <td class="item-meta">${c.code || '—'}</td>
            <td class="item-meta">${(c.topics||[]).length}</td>
          </tr>`).join('')}
      </tbody>
    </table>`;
}

// ── COURSE: list topics + direct files ─────────────────────────
function renderCourse() {
  const el     = document.getElementById('view-course');
  const course = DRIVE_DATA.courses.find(c => c.id === path[0]);
  el.classList.remove('hidden');

  if (!course) { nav(); return; }

  const topics      = course.topics || [];
  const directFiles = course.files  || [];

  // Topics section
  const topicsHtml = topics.length ? `
    <table class="item-table">
      <thead><tr><th>Topic</th><th>Files</th></tr></thead>
      <tbody>
        ${topics.map(t => `
          <tr onclick="nav('${course.id}','${t.id}')">
            <td><span class="item-link">${t.name}</span></td>
            <td class="item-meta">${(t.files||[]).length}</td>
          </tr>`).join('')}
      </tbody>
    </table>` : '';

  // Direct files section
  const directHtml = directFiles.length ? `
    <div class="section-subheading" style="margin-top:20px;">Files</div>
    <table class="item-table">
      <thead><tr><th>File</th><th>Type</th></tr></thead>
      <tbody>
        ${directFiles.map(f => `
          <tr onclick="openFile(${JSON.stringify(f).replace(/"/g,'&quot;')})">
            <td><span class="item-link">${f.name}</span></td>
            <td><span class="badge badge-${f.type}">${f.type.toUpperCase()}</span></td>
          </tr>`).join('')}
      </tbody>
    </table>` : '';

  const nothingHtml = (!topics.length && !directFiles.length)
    ? '<div class="empty">Nothing here yet.</div>' : '';

  el.innerHTML = `
    <button class="back-btn" onclick="nav()">← Back</button>
    <div class="section-heading">${course.name}</div>
    ${course.desc ? `<p class="section-desc">${course.desc}</p>` : ''}
    ${topics.length ? '<div class="section-subheading">Topics</div>' : ''}
    ${topicsHtml}
    ${directHtml}
    ${nothingHtml}`;
}

// ── TOPIC: list files ───────────────────────────────────────────
function renderTopic() {
  const el     = document.getElementById('view-topic');
  const course = DRIVE_DATA.courses.find(c => c.id === path[0]);
  const topic  = (course?.topics || []).find(t => t.id === path[1]);
  el.classList.remove('hidden');

  if (!topic) { nav(path[0]); return; }

  const files = topic.files || [];

  el.innerHTML = `
    <button class="back-btn" onclick="nav('${course.id}')">← Back</button>
    <div class="section-heading">${topic.name}</div>
    <div class="section-desc" style="margin-bottom:12px;">in ${course.name}</div>
    ${files.length ? `
      <table class="item-table">
        <thead><tr><th>File</th><th>Type</th></tr></thead>
        <tbody>
          ${files.map(f => `
            <tr onclick="openFile(${JSON.stringify(f).replace(/"/g,'&quot;')})">
              <td><span class="item-link">${f.name}</span></td>
              <td><span class="badge badge-${f.type}">${f.type.toUpperCase()}</span></td>
            </tr>`).join('')}
        </tbody>
      </table>` : '<div class="empty">No files in this topic yet.</div>'}`;
}

// ── Navigation ──────────────────────────────────────────────────
function nav(...ids) {
  path = ids;
  render();
  window.scrollTo(0, 0);
}

function breadcrumb(items) {
  const parts = items.map((item, i) => {
    const isLast = i === items.length - 1;
    if (isLast) return `<span class="current">${item.label}</span>`;
    return `<a onclick="${item.action ? item.action.toString().replace(/"/g,"'") : ''}">${item.label}</a>`;
  });
  const withSeps = parts.flatMap((p, i) => i < parts.length - 1 ? [p, '<span class="sep">/</span>'] : [p]);
  return `<div class="breadcrumb">${withSeps.join('')}</div>`;
}

// ── File preview ─────────────────────────────────────────────────
function openFile(file) {
  const overlay = document.getElementById('overlay');
  const title   = document.getElementById('overlay-title');
  const body    = document.getElementById('overlay-body');
  const openBtn = document.getElementById('overlay-open');

  title.textContent = file.name;
  openBtn.href = file.url;
  body.innerHTML = '';

  const isExternal = file.url.startsWith('http');
  const resolvedUrl = isExternal ? file.url : file.url;

  if (file.type === 'pdf') {
    body.innerHTML = `<iframe src="${resolvedUrl}" title="${file.name}"></iframe>`;
  } else if (file.type === 'image') {
    body.innerHTML = `<img src="${resolvedUrl}" alt="${file.name}" style="max-width:100%;object-fit:contain;background:#fff;"/>`;
  } else if (file.type === 'link') {
    body.innerHTML = `
      <div class="overlay-link-box">
        <p>${file.url}</p>
        <a href="${file.url}" target="_blank" rel="noopener">Open Link</a>
      </div>`;
  } else if (file.type === 'code') {
    body.innerHTML = `<pre>Loading…</pre>`;
    fetch(resolvedUrl)
      .then(r => r.text())
      .then(t => body.querySelector('pre').textContent = t)
      .catch(() => body.querySelector('pre').textContent = '// Could not load. Click "Open ↗" to view on GitHub.');
  } else {
    body.innerHTML = `
      <div class="overlay-link-box">
        <p>${file.name}</p>
        <a href="${resolvedUrl}" target="_blank" rel="noopener">Open File</a>
      </div>`;
  }

  overlay.classList.remove('hidden');
}

function closeOverlay() {
  document.getElementById('overlay').classList.add('hidden');
  document.getElementById('overlay-body').innerHTML = '';
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeOverlay(); });
