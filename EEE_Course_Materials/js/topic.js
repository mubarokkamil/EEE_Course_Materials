// ===== TOPIC PAGE: Show materials for a topic =====

const MATERIAL_ICONS = {
  pdf:   '📄',
  code:  '💻',
  notes: '📝',
  video: '🎬',
  link:  '🔗'
};

const MATERIAL_LABELS = {
  pdf:   'Open PDF',
  code:  'View Code',
  notes: 'Read Notes',
  video: 'Watch',
  link:  'Open Link'
};

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const courseId = params.get('course');
  const topicId  = params.get('topic');

  const course = COURSES.find(c => c.id === courseId);
  if (!course) {
    document.getElementById('topic-title').textContent = 'Course not found';
    return;
  }

  const topic = course.topics.find(t => t.id === topicId);
  if (!topic) {
    document.getElementById('topic-title').textContent = 'Topic not found';
    return;
  }

  // Back link
  document.getElementById('back-to-course').href = `course.html?id=${courseId}`;

  // Metadata
  document.title = `${topic.name} — EEE Materials`;
  document.getElementById('course-badge').textContent = `${course.code} · ${course.name}`;
  document.getElementById('topic-title').textContent = topic.name;
  document.getElementById('topic-desc').textContent = topic.desc || '';

  // Render materials
  const list = document.getElementById('materials-list');

  if (!topic.materials || topic.materials.length === 0) {
    list.innerHTML = '<div class="empty-state">No materials uploaded yet for this topic.</div>';
    return;
  }

  topic.materials.forEach(mat => {
    const icon  = MATERIAL_ICONS[mat.type]  || '📎';
    const label = MATERIAL_LABELS[mat.type] || 'Open';

    const item = document.createElement('div');
    item.className = 'material-item';

    // Resolve URL: if it starts with http it's external; otherwise relative from repo root
    const isExternal = mat.url && mat.url.startsWith('http');
    // From courses/topic.html we need to go up one level to reach repo root
    const href = isExternal ? mat.url : `../${mat.url}`;
    const target = isExternal ? '_blank' : '_blank';

    item.innerHTML = `
      <a href="${href}" target="${target}" rel="noopener">
        <span class="material-icon">${icon}</span>
        <div class="material-info">
          <div class="material-name">${mat.name}</div>
          ${mat.desc ? `<div class="material-sub">${mat.desc}</div>` : ''}
        </div>
        <span class="material-action tag ${mat.type}">${label}</span>
      </a>
    `;
    list.appendChild(item);
  });
});
