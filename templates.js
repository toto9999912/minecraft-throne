// Template management — save/load block layouts to localStorage

const STORAGE_KEY = 'minecraft-throne-templates';

export function loadAllTemplates() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

export function saveTemplate(name, blocks) {
  const all = loadAllTemplates();
  all[name] = {
    blocks: blocks.map(b => [...b]),
    savedAt: Date.now(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function deleteTemplate(name) {
  const all = loadAllTemplates();
  delete all[name];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function getTemplate(name) {
  const all = loadAllTemplates();
  return all[name] || null;
}

export function renameTemplate(oldName, newName) {
  if (oldName === newName) return;
  const all = loadAllTemplates();
  if (!all[oldName]) return;
  all[newName] = all[oldName];
  delete all[oldName];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}
