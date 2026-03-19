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

// ── Open file directly in new tab ───────────────────────────────
function openFile(file) {
  window.open(file.url, '_blank', 'noopener');
}