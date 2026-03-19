// Session state — PAT never written to disk/localStorage
let S = { pat: null, user: null, repo: null };

// Working data copy
let D = JSON.parse(JSON.stringify(DRIVE_DATA));

// ── Login ──────────────────────────────────────────────────────
function doLogin() {
  const pat  = document.getElementById('input-pat').value.trim();
  const user = document.getElementById('input-user').value.trim();
  const repo = document.getElementById('input-repo').value.trim();
  const err  = document.getElementById('login-error');

  if (!pat || !user || !repo) {
    err.textContent = 'Please fill in all fields.';
    err.classList.remove('hidden'); return;
  }

  S = { pat, user, repo };
  err.classList.add('hidden');
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('admin-screen').classList.remove('hidden');
  document.getElementById('session-info').textContent = `${user}/${repo}`;
  renderAdmin();
}

function doLogout() {
  S = { pat: null, user: null, repo: null };
  document.getElementById('admin-screen').classList.add('hidden');
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('input-pat').value = '';
}

document.getElementById('input-pat').addEventListener('keydown', e => {
  if (e.key === 'Enter') doLogin();
});

// ── Render admin ───────────────────────────────────────────────
function renderAdmin() {
  const panel = document.getElementById('courses-panel');
  panel.innerHTML = '';

  if (!D.courses.length) {
    panel.innerHTML = '<div class="empty">No courses yet. Click "+ New Course" to add one.</div>';
    return;
  }

  D.courses.forEach(course => {
    if (!course.files) course.files = [];
    const block = document.createElement('div');
    block.className = 'course-block';
    block.id = `course-${course.id}`;

    const topicCount = (course.topics||[]).length;
    const fileCount  = (course.files||[]).length;
    const metaParts  = [];
    if (topicCount) metaParts.push(`${topicCount} topic${topicCount!==1?'s':''}`);
    if (fileCount)  metaParts.push(`${fileCount} direct file${fileCount!==1?'s':''}`);

    block.innerHTML = `
      <div class="course-block-header" onclick="toggleCourse('${course.id}')">
        <div>
          <span class="course-block-title">${course.name}</span>
          <span class="course-block-meta" style="margin-left:10px;">${course.code || ''}</span>
        </div>
        <div class="course-block-actions" onclick="event.stopPropagation()">
          <span class="course-block-meta">${metaParts.join(' · ') || 'empty'}</span>
          <button class="btn-secondary btn-sm" onclick="showModal('course','${course.id}')">Rename</button>
          <button class="btn-danger-sm" onclick="deleteCourse('${course.id}')">Delete</button>
        </div>
      </div>
      <div class="course-block-body" id="course-body-${course.id}" style="display:none;">
        <div id="topics-${course.id}"></div>

        <div class="add-row" style="margin-top:6px;gap:8px;">
          <button class="btn-secondary btn-sm" onclick="showModal('topic','${course.id}')">+ Add Topic</button>
          <button class="btn-secondary btn-sm" onclick="showModal('file','${course.id}','__direct__')">+ Add File directly</button>
        </div>

        <div id="direct-files-${course.id}">
          ${renderDirectFiles(course)}
        </div>
      </div>`;

    panel.appendChild(block);
    renderTopics(course.id);
  });
}

function renderDirectFiles(course) {
  if (!course.files || !course.files.length) return '';
  return `
    <div style="margin-top:12px;">
      <div class="section-subheading" style="font-size:11px;margin-bottom:6px;">Files added directly to course</div>
      <table class="files-table">
        ${course.files.map(f => `
          <tr>
            <td class="f-name">${f.name}</td>
            <td><span class="badge badge-${f.type}">${f.type.toUpperCase()}</span></td>
            <td class="f-url" title="${f.url}">${f.url}</td>
            <td><button class="btn-danger-sm" onclick="deleteDirectFile('${course.id}','${f.id}')">Remove</button></td>
          </tr>`).join('')}
      </table>
    </div>`;
}

function toggleCourse(courseId) {
  const body = document.getElementById(`course-body-${courseId}`);
  body.style.display = body.style.display === 'none' ? 'block' : 'none';
}

function renderTopics(courseId) {
  const course = D.courses.find(c => c.id === courseId);
  const el     = document.getElementById(`topics-${courseId}`);
  el.innerHTML = '';

  (course.topics || []).forEach(topic => {
    const tb = document.createElement('div');
    tb.className = 'topic-block';
    tb.id = `topic-${courseId}-${topic.id}`;

    tb.innerHTML = `
      <div class="topic-block-header" onclick="toggleTopic('${courseId}','${topic.id}')">
        <span class="topic-block-title">${topic.name}</span>
        <div style="display:flex;gap:6px;" onclick="event.stopPropagation()">
          <span style="font-size:12px;color:#57606a;">${(topic.files||[]).length} file${(topic.files||[]).length!==1?'s':''}</span>
          <button class="btn-secondary btn-sm" onclick="showModal('topic','${courseId}','${topic.id}')">Rename</button>
          <button class="btn-danger-sm" onclick="deleteTopic('${courseId}','${topic.id}')">Delete</button>
        </div>
      </div>
      <div class="topic-block-body" id="topic-body-${courseId}-${topic.id}" style="display:none;">
        <table class="files-table" id="files-${courseId}-${topic.id}">
          ${renderFileRows(topic)}
        </table>
        <div class="add-row">
          <button class="btn-secondary btn-sm" onclick="showModal('file','${courseId}','${topic.id}')">+ Add File</button>
        </div>
      </div>`;

    el.appendChild(tb);
  });
}

function toggleTopic(courseId, topicId) {
  const body = document.getElementById(`topic-body-${courseId}-${topicId}`);
  body.style.display = body.style.display === 'none' ? 'block' : 'none';
}

function renderFileRows(topic) {
  if (!topic.files || !topic.files.length) {
    return `<tr><td colspan="3" style="color:#57606a;font-size:13px;padding:6px 0;">No files yet.</td></tr>`;
  }
  return topic.files.map(f => `
    <tr>
      <td class="f-name">${f.name}</td>
      <td><span class="badge badge-${f.type}">${f.type.toUpperCase()}</span></td>
      <td class="f-url" title="${f.url}">${f.url}</td>
      <td><button class="btn-danger-sm" onclick="deleteFile('${topic.id}','${f.id}')">Remove</button></td>
    </tr>`).join('');
}

// ── Modal ──────────────────────────────────────────────────────
let modalCtx = {};

function showModal(type, ...args) {
  modalCtx = { type, args };
  const modal = document.getElementById('modal');
  const title = document.getElementById('modal-title');
  const body  = document.getElementById('modal-body');
  modal.classList.remove('hidden');

  if (type === 'course') {
    const courseId = args[0];
    const course   = courseId ? D.courses.find(c => c.id === courseId) : null;
    title.textContent = course ? 'Rename Course' : 'New Course';
    body.innerHTML = `
      <div class="field-group"><label>Course Name</label>
        <input id="m-name" class="form-input" value="${course?.name||''}" placeholder="e.g. Circuit Analysis"/>
      </div>
      <div class="field-group"><label>Course Code</label>
        <input id="m-code" class="form-input" value="${course?.code||''}" placeholder="e.g. EEE 101"/>
      </div>
      <div class="field-group"><label>Short Description (optional)</label>
        <input id="m-desc" class="form-input" value="${course?.desc||''}" placeholder="What this course covers"/>
      </div>
      <div class="modal-actions">
        <button class="btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn-primary" onclick="saveCourse()">Save</button>
      </div>`;
    document.getElementById('m-name').focus();

  } else if (type === 'topic') {
    const [courseId, topicId] = args;
    const course = D.courses.find(c => c.id === courseId);
    const topic  = topicId ? (course?.topics||[]).find(t => t.id === topicId) : null;
    title.textContent = topic ? 'Rename Topic' : 'New Topic';
    body.innerHTML = `
      <div class="field-group"><label>Topic Name</label>
        <input id="m-name" class="form-input" value="${topic?.name||''}" placeholder="e.g. KVL & KCL"/>
      </div>
      <div class="modal-actions">
        <button class="btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn-primary" onclick="saveTopic()">Save</button>
      </div>`;
    document.getElementById('m-name').focus();

  } else if (type === 'file') {
    const [courseId, topicId] = args;
    title.textContent = 'Add File';
    body.innerHTML = `
      <div class="field-group"><label>File Type</label>
        <select id="m-type" onchange="onTypeChange()">
          <option value="pdf">PDF</option>
          <option value="code">Code</option>
          <option value="link">External Link</option>
          <option value="image">Image</option>
          <option value="doc">Document</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div class="field-group"><label>Display Name</label>
        <input id="m-name" class="form-input" placeholder="e.g. Lecture Notes Week 1"/>
      </div>
      <div id="upload-wrap" class="field-group"><label>Upload File <span style="font-weight:400;color:#57606a;">(pushed to GitHub)</span></label>
        <input type="file" id="m-file" onchange="onFileSelect()"/>
        <span class="upload-hint">Supported: PDF, images, code files, docs</span>
      </div>
      <div class="divider-or">or enter path / URL manually</div>
      <div class="field-group"><label>URL or Repo Path</label>
        <input id="m-url" class="form-input" placeholder="materials/course/file.pdf"/>
        <span class="upload-hint" id="url-hint">Path relative to repo root, or full https:// URL for links</span>
      </div>
      <div class="modal-actions">
        <button class="btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn-primary" onclick="saveFile()">Add</button>
      </div>`;
    document.getElementById('m-name').focus();
    onTypeChange();
  }
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
}

function onTypeChange() {
  const type = document.getElementById('m-type')?.value;
  const wrap = document.getElementById('upload-wrap');
  const hint = document.getElementById('url-hint');
  if (!type) return;
  if (type === 'link') {
    wrap.style.display = 'none';
    if (hint) hint.textContent = 'Full URL — e.g. https://youtube.com/...';
    document.getElementById('m-url').placeholder = 'https://...';
  } else {
    wrap.style.display = '';
    if (hint) hint.textContent = 'Path relative to repo root, or upload above';
    document.getElementById('m-url').placeholder = 'materials/course-name/file.pdf';
  }
}

function onFileSelect() {
  const file = document.getElementById('m-file')?.files[0];
  if (!file) return;
  const nameEl = document.getElementById('m-name');
  if (!nameEl.value) nameEl.value = file.name;
  const courseId = modalCtx.args[0];
  document.getElementById('m-url').value = `materials/${courseId}/${file.name}`;
}

// ── CRUD ───────────────────────────────────────────────────────
function saveCourse() {
  const name     = document.getElementById('m-name').value.trim();
  const code     = document.getElementById('m-code')?.value.trim() || '';
  const desc     = document.getElementById('m-desc')?.value.trim() || '';
  const courseId = modalCtx.args[0];

  if (!name) { alert('Name required.'); return; }

  if (courseId) {
    const c = D.courses.find(c => c.id === courseId);
    c.name = name; c.code = code; c.desc = desc;
  } else {
    D.courses.push({ id: slug(name), name, code, desc, topics: [] });
  }

  closeModal(); renderAdmin(); pushData();
}

function deleteCourse(courseId) {
  if (!confirm('Delete this course and ALL its topics and files?')) return;
  D.courses = D.courses.filter(c => c.id !== courseId);
  renderAdmin(); pushData();
}

function saveTopic() {
  const name     = document.getElementById('m-name').value.trim();
  const courseId = modalCtx.args[0];
  const topicId  = modalCtx.args[1];

  if (!name) { alert('Name required.'); return; }

  const course = D.courses.find(c => c.id === courseId);
  if (topicId) {
    const t = course.topics.find(t => t.id === topicId);
    t.name = name;
  } else {
    course.topics.push({ id: slug(name), name, files: [] });
  }

  closeModal(); renderAdmin();
  // Re-open the course
  setTimeout(() => {
    const body = document.getElementById(`course-body-${courseId}`);
    if (body) body.style.display = 'block';
  }, 10);
  pushData();
}

function deleteTopic(courseId, topicId) {
  if (!confirm('Delete this topic and all its files?')) return;
  const course   = D.courses.find(c => c.id === courseId);
  course.topics  = course.topics.filter(t => t.id !== topicId);
  renderAdmin(); pushData();
}

async function saveFile() {
  const name     = document.getElementById('m-name').value.trim();
  const type     = document.getElementById('m-type').value;
  const manualUrl= document.getElementById('m-url').value.trim();
  const courseId = modalCtx.args[0];
  const topicId  = modalCtx.args[1];  // '__direct__' means add to course directly
  const fileEl   = document.getElementById('m-file');

  if (!name) { alert('Display name required.'); return; }

  let fileUrl = manualUrl;

  if (fileEl?.files?.length) {
    const f = fileEl.files[0];
    const repoPath = `materials/${courseId}/${f.name}`;
    setStatus('info', '<span class="spin">⟳</span> Uploading file to GitHub…');
    const ok = await uploadFile(f, repoPath);
    if (!ok) return;
    fileUrl = repoPath;
  }

  if (!fileUrl) { alert('Please provide a URL/path or upload a file.'); return; }

  const newFile = { id: 'f' + Date.now(), name, type, url: fileUrl };
  const course  = D.courses.find(c => c.id === courseId);

  if (topicId === '__direct__') {
    if (!course.files) course.files = [];
    course.files.push(newFile);
  } else {
    const topic = course.topics.find(t => t.id === topicId);
    topic.files.push(newFile);
  }

  closeModal(); renderAdmin();
  setTimeout(() => {
    const cb = document.getElementById(`course-body-${courseId}`);
    if (cb) cb.style.display = 'block';
    if (topicId && topicId !== '__direct__') {
      const tb = document.getElementById(`topic-body-${courseId}-${topicId}`);
      if (tb) tb.style.display = 'block';
    }
  }, 10);
  pushData();
}

function deleteDirectFile(courseId, fileId) {
  if (!confirm('Remove this file?')) return;
  const course = D.courses.find(c => c.id === courseId);
  course.files = (course.files || []).filter(f => f.id !== fileId);
  renderAdmin();
  setTimeout(() => {
    const cb = document.getElementById(`course-body-${courseId}`);
    if (cb) cb.style.display = 'block';
  }, 10);
  pushData();
}

// ── GitHub API ─────────────────────────────────────────────────
async function pushData() {
  if (!S.pat) { showToast('Changes saved locally. Set a GitHub token to push.'); return; }

  setStatus('info', '<span class="spin">⟳</span> Pushing to GitHub…');

  const content = `// Auto-managed by Admin panel.\nconst DRIVE_DATA = ${JSON.stringify(D, null, 2)};\n`;
  const ok = await putFile('data.js', content, 'Admin: update course data');

  if (ok) setStatus('success', '✓ Saved & pushed to GitHub successfully.');
  else    setStatus('error', '✗ Push failed. Check your token and try again.');
}

async function uploadFile(file, repoPath) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = async e => {
      const b64 = e.target.result.split(',')[1];
      const ok  = await putFile(repoPath, null, `Admin: upload ${file.name}`, b64);
      if (ok) showToast(`✓ Uploaded ${file.name}`);
      else    setStatus('error', `✗ Upload failed for ${file.name}`);
      resolve(ok);
    };
    reader.readAsDataURL(file);
  });
}

async function putFile(path, textContent, message, base64Content) {
  try {
    const sha = await getSha(path);
    const body = {
      message,
      content: base64Content || btoa(unescape(encodeURIComponent(textContent))),
    };
    if (sha) body.sha = sha;
    const res = await ghFetch(`contents/${path}`, 'PUT', body);
    return res.ok;
  } catch { return false; }
}

async function getSha(path) {
  try {
    const res = await ghFetch(`contents/${path}`, 'GET');
    if (res.ok) { const j = await res.json(); return j.sha || null; }
  } catch {}
  return null;
}

function ghFetch(endpoint, method, body) {
  return fetch(`https://api.github.com/repos/${S.user}/${S.repo}/${endpoint}`, {
    method,
    headers: {
      'Authorization': `token ${S.pat}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

// ── UI helpers ─────────────────────────────────────────────────
function setStatus(type, msg) {
  const bar = document.getElementById('status-bar');
  bar.className = `status-bar ${type}`;
  bar.innerHTML = msg;
  bar.classList.remove('hidden');
  if (type === 'success') setTimeout(() => bar.classList.add('hidden'), 4000);
}

let toastT;
function showToast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.add('hidden'), 3500);
}

function slug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});
