// ===== HOMEPAGE: Render course cards =====

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('courses-grid');
  if (!grid) return;

  if (!COURSES || COURSES.length === 0) {
    grid.innerHTML = '<div class="empty-state">No courses found. Add courses in js/courses.js</div>';
    return;
  }

  COURSES.forEach(course => {
    const card = document.createElement('div');
    card.className = 'course-card';
    card.innerHTML = `
      <div class="card-icon">${course.icon}</div>
      <div class="card-code">${course.code}</div>
      <div class="card-name">${course.name}</div>
      <div class="card-desc">${course.desc}</div>
      <div class="card-meta">${course.topics.length} topic${course.topics.length !== 1 ? 's' : ''}</div>
    `;
    card.addEventListener('click', () => {
      window.location.href = `courses/course.html?id=${course.id}`;
    });
    grid.appendChild(card);
  });
});
