const localKey = window.projectCardsLocalKey || 'projectCardsLocal';

function getProjects() {
  const raw = localStorage.getItem(localKey);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function readForm() {
  const id        = document.getElementById('proj-id').value.trim();
  const title     = document.getElementById('proj-title').value.trim();
  const imgSmall  = document.getElementById('proj-img-small').value.trim();
  const imgMedium = document.getElementById('proj-img-medium').value.trim();
  const imgLarge  = document.getElementById('proj-img-large').value.trim();
  const imgAlt    = document.getElementById('proj-img-alt').value.trim();
  const stackRaw  = document.getElementById('proj-stack').value.trim();
  const source    = document.getElementById('proj-source').value.trim();
  const details   = document.getElementById('proj-details').value.trim();

  const stack = stackRaw
    ? stackRaw.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  return { id, title, imgSmall, imgMedium, imgLarge, imgAlt, stack, source, details };
}

function refreshList() {
  const projects = getProjects();
  window.renderProjectCards(projects);
  const list = document.getElementById('project-list');
  list.innerHTML = '';

  projects.forEach(p => {
    const li = document.createElement('li');
    li.textContent = `${p.id} — ${p.title || '(no title)'}`;
    list.appendChild(li);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  refreshList(); // initial render
  const btnCreate = document.getElementById('btn-create');
  const btnUpdate = document.getElementById('btn-update');
  const btnDelete = document.getElementById('btn-delete');

  btnCreate.addEventListener('click', () => {
    const data = readForm();
    if (!data.id) {
      alert('ID is required to create a project.');
      return;
    }

    const projects = getProjects();
    if (projects.some(p => p.id === data.id)) {
      alert(`Project with ID "${data.id}" already exists. Use Update instead.`);
      return;
    }

    projects.push(data);
    localStorage.setItem(localKey, JSON.stringify(projects));
    refreshList();
    alert('Project created in localStorage.');
  });

  btnUpdate.addEventListener('click', () => {
    const data = readForm();
    if (!data.id) {
      alert('ID is required to update a project.');
      return;
    }

    const projects = getProjects();
    const idx = projects.findIndex(p => p.id === data.id);
    if (idx === -1) {
      alert(`No project found with ID "${data.id}".`);
      return;
    }

    projects[idx] = data;
    localStorage.setItem(localKey, JSON.stringify(projects));
    refreshList();
    alert('Project updated.');
  });

  btnDelete.addEventListener('click', () => {
    const id = document.getElementById('proj-id').value.trim();
    if (!id) {
      alert('ID is required to delete a project.');
      return;
    }

    const projects = getProjects();
    const next = projects.filter(p => p.id !== id);

    if (next.length === projects.length) {
      alert(`No project found with ID "${id}".`);
      return;
    }

    localStorage.setItem(localKey, JSON.stringify(next));
    refreshList();
    alert('Project deleted.');
  });
});
