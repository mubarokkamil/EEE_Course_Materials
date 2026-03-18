// ===== COURSE PAGE: Show topics for a course =====

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const courseId = params.get('id');

  const course = COURSES.find(c => c.id === courseId);

  if (!course) {
    document.getElementById('course-title').textContent = 'Course not found';
    return;
  }

  // Update page title
  document.title = `${course.name} — EEE Materials`;
  document.getElementById('course-badge').textContent = course.code;
  document.getElementById('course-title').textContent = `${course.icon} ${course.name}`;
  document.getElementById('course-desc').textContent = course.desc;

  // Render topics
  const list = document.getElementById('topics-list');

  if (!course.topics || course.topics.length === 0) {
    list.innerHTML = '<div class="empty-state">No topics added yet for this course.</div>';
    return;
  }

  course.topics.forEach((topic, index) => {
    // Collect unique material types for tags
    const types = [...new Set((topic.materials || []).map(m => m.type))];
    const tagsHTML = types.map(t => `<span class="tag ${t}">${t}</span>`).join('');

    const item = document.createElement('div');
    item.className = 'topic-item';
    item.innerHTML = `
      <div class="topic-left">
        <span class="topic-num">${String(index + 1).padStart(2, '0')}</span>
        <span class="topic-name">${topic.name}</span>
      </div>
      <div class="topic-tags">${tagsHTML}</div>
      <span class="topic-arrow">→</span>
    `;
    item.addEventListener('click', () => {
      window.location.href = `topic.html?course=${courseId}&topic=${topic.id}`;
    });
    list.appendChild(item);
  });
});
