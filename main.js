import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TEXTURE_PACKS } from './textures.js';
import { getThroneBlocks } from './throne.js';
import { exportPackSVG } from './export-svg.js';
import { loadAllTemplates, saveTemplate, deleteTemplate, renameTemplate } from './templates.js';

// ─── Constants ────────────────────────────────────
const BLOCK_TYPES = ['base', 'pillar', 'seat', 'armrest', 'backrest', 'accent', 'cushion', 'dark'];
const BLOCK_LABELS = {
  base: '底座', pillar: '支柱', seat: '座椅', armrest: '扶手',
  backrest: '靠背', accent: '裝飾', cushion: '坐墊', dark: '暗色',
};

// ─── Scene setup ──────────────────────────────────
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);
scene.fog = new THREE.FogExp2(0x1a1a2e, 0.025);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(8, 6, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 2, -0.5);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 5;
controls.maxDistance = 30;
controls.update();

// ─── Lighting ─────────────────────────────────────
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

const dirLight = new THREE.DirectionalLight(0xffeedd, 1.2);
dirLight.position.set(8, 15, 10);
dirLight.castShadow = true;
dirLight.shadow.mapSize.set(1024, 1024);
dirLight.shadow.camera.left = -15;
dirLight.shadow.camera.right = 15;
dirLight.shadow.camera.top = 15;
dirLight.shadow.camera.bottom = -15;
scene.add(dirLight);

scene.add(new THREE.DirectionalLight(0x8888ff, 0.3)).position.set(-5, 5, -5);

const pointLight = new THREE.PointLight(0xff9944, 0.6, 20);
pointLight.position.set(0, 8, 3);
scene.add(pointLight);

// ─── Ground plane ─────────────────────────────────
const groundGeo = new THREE.PlaneGeometry(40, 40);
const groundMat = new THREE.MeshStandardMaterial({ color: 0x2a2a3e, roughness: 0.9 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.01;
ground.receiveShadow = true;
ground.userData.isGround = true;
scene.add(ground);

const gridCanvas = document.createElement('canvas');
gridCanvas.width = 512; gridCanvas.height = 512;
const gctx = gridCanvas.getContext('2d');
gctx.fillStyle = '#2a2a3e'; gctx.fillRect(0, 0, 512, 512);
gctx.strokeStyle = 'rgba(255,255,255,0.06)'; gctx.lineWidth = 1;
const step = 512 / 40;
for (let i = 0; i <= 40; i++) {
  gctx.beginPath(); gctx.moveTo(i * step, 0); gctx.lineTo(i * step, 512); gctx.stroke();
  gctx.beginPath(); gctx.moveTo(0, i * step); gctx.lineTo(512, i * step); gctx.stroke();
}
groundMat.map = new THREE.CanvasTexture(gridCanvas);
groundMat.needsUpdate = true;

// ═══════════════════════════════════════════════════
// Block data (mutable)
// ═══════════════════════════════════════════════════
let blocks = []; // [[x, y, z, type], ...]
const blockMap = new Map(); // "x,y,z" -> index in blocks
const blockMeshes = new THREE.Group();
scene.add(blockMeshes);

const blockGeo = new THREE.BoxGeometry(1, 1, 1);
let currentPack = 'classic';
const textureCache = {};

function posKey(x, y, z) { return `${x},${y},${z}`; }

function getPackTextures(packId) {
  if (textureCache[packId]) return textureCache[packId];
  const pack = TEXTURE_PACKS[packId];
  const textures = {};
  for (const [type, genFn] of Object.entries(pack.textures)) {
    const canvas = genFn();
    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    tex.colorSpace = THREE.SRGBColorSpace;
    textures[type] = tex;
  }
  textureCache[packId] = textures;
  return textures;
}

function rebuildMeshes() {
  while (blockMeshes.children.length > 0) {
    const c = blockMeshes.children[0];
    if (c.material) c.material.dispose();
    blockMeshes.remove(c);
  }
  blockMap.clear();
  const textures = getPackTextures(currentPack);

  blocks.forEach(([x, y, z, type], idx) => {
    const mat = new THREE.MeshStandardMaterial({
      map: textures[type],
      roughness: 0.85,
      metalness: type === 'accent' ? 0.4 : 0.05,
    });
    const mesh = new THREE.Mesh(blockGeo, mat);
    mesh.position.set(x, y + 0.5, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = { bx: x, by: y, bz: z, btype: type, idx };
    blockMeshes.add(mesh);
    blockMap.set(posKey(x, y, z), idx);
  });

  updateCounter();
}

function setBlocks(newBlocks) {
  blocks = newBlocks.map(b => [...b]);
  rebuildMeshes();
}

function addBlock(x, y, z, type) {
  const key = posKey(x, y, z);
  if (blockMap.has(key)) return;
  blocks.push([x, y, z, type]);
  rebuildMeshes();
}

function removeBlock(x, y, z) {
  const key = posKey(x, y, z);
  if (!blockMap.has(key)) return;
  const idx = blockMap.get(key);
  blocks.splice(idx, 1);
  rebuildMeshes();
}

// ─── Initialize with default throne ───────────────
setBlocks(getThroneBlocks());

// ═══════════════════════════════════════════════════
// Block counter
// ═══════════════════════════════════════════════════
function updateCounter() {
  document.getElementById('total-count').textContent = blocks.length;

  const counts = {};
  for (const [,,,type] of blocks) {
    counts[type] = (counts[type] || 0) + 1;
  }

  const detailEl = document.getElementById('counter-detail');
  const textures = getPackTextures(currentPack);
  detailEl.innerHTML = '';

  for (const type of BLOCK_TYPES) {
    const count = counts[type] || 0;
    if (count === 0) continue;

    const row = document.createElement('div');
    row.className = 'counter-row';

    // Swatch from texture
    const pack = TEXTURE_PACKS[currentPack];
    const swatchCanvas = pack.textures[type]();
    swatchCanvas.className = 'counter-swatch';
    row.appendChild(swatchCanvas);

    const label = document.createElement('span');
    label.textContent = BLOCK_LABELS[type];
    row.appendChild(label);

    const num = document.createElement('span');
    num.className = 'counter-count';
    num.textContent = count;
    row.appendChild(num);

    detailEl.appendChild(row);
  }
}

// ═══════════════════════════════════════════════════
// Edit mode & raycaster
// ═══════════════════════════════════════════════════
let editMode = false;
let selectedType = 'base';
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let mouseDownPos = { x: 0, y: 0 };

// Ghost block preview
const ghostMat = new THREE.MeshStandardMaterial({
  color: 0xffffff, transparent: true, opacity: 0.35,
  depthWrite: false,
});
const ghostMesh = new THREE.Mesh(blockGeo, ghostMat);
ghostMesh.visible = false;
scene.add(ghostMesh);

function setEditMode(on) {
  editMode = on;
  const btn = document.getElementById('edit-toggle');
  const tools = document.getElementById('editor-tools');
  const info = document.getElementById('info');

  if (on) {
    btn.textContent = '編輯模式：開啟';
    btn.classList.add('active');
    tools.style.display = 'block';
    info.textContent = '左鍵點擊面 = 放置方塊 | 右鍵點擊 = 移除方塊 | 拖曳仍可旋轉';
  } else {
    btn.textContent = '編輯模式：關閉';
    btn.classList.remove('active');
    tools.style.display = 'none';
    ghostMesh.visible = false;
    info.textContent = '滑鼠左鍵拖曳旋轉 | 滾輪縮放 | 右鍵平移';
  }
}

function updateMouse(e) {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
}

function raycast(e) {
  updateMouse(e);
  raycaster.setFromCamera(mouse, camera);

  // Check block meshes first, then ground
  const targets = [...blockMeshes.children, ground];
  const hits = raycaster.intersectObjects(targets, false);
  return hits.length > 0 ? hits[0] : null;
}

function getPlacePosition(hit) {
  if (hit.object.userData.isGround) {
    // Place on ground at y=0
    const p = hit.point;
    return {
      x: Math.round(p.x),
      y: 0,
      z: Math.round(p.z),
    };
  }
  // Place adjacent to hit block face
  const normal = hit.face.normal.clone();
  const { bx, by, bz } = hit.object.userData;
  return {
    x: bx + Math.round(normal.x),
    y: by + Math.round(normal.y),
    z: bz + Math.round(normal.z),
  };
}

// Mouse events for editing
renderer.domElement.addEventListener('mousemove', (e) => {
  if (!editMode) return;
  const hit = raycast(e);
  if (hit) {
    const pos = getPlacePosition(hit);
    if (pos.y >= 0) {
      ghostMesh.position.set(pos.x, pos.y + 0.5, pos.z);
      ghostMesh.visible = true;
      return;
    }
  }
  ghostMesh.visible = false;
});

renderer.domElement.addEventListener('mousedown', (e) => {
  mouseDownPos.x = e.clientX;
  mouseDownPos.y = e.clientY;
});

renderer.domElement.addEventListener('mouseup', (e) => {
  if (!editMode) return;
  // Ignore drags (orbit)
  const dx = e.clientX - mouseDownPos.x;
  const dy = e.clientY - mouseDownPos.y;
  if (Math.sqrt(dx * dx + dy * dy) > 5) return;

  const hit = raycast(e);
  if (!hit) return;

  if (e.button === 0) {
    // Left click: place block
    const pos = getPlacePosition(hit);
    if (pos.y >= 0) {
      addBlock(pos.x, pos.y, pos.z, selectedType);
    }
  }
});

// Right-click: remove block
renderer.domElement.addEventListener('contextmenu', (e) => {
  if (!editMode) return;
  e.preventDefault();
  const dx = e.clientX - mouseDownPos.x;
  const dy = e.clientY - mouseDownPos.y;
  if (Math.sqrt(dx * dx + dy * dy) > 5) return;

  const hit = raycast(e);
  if (hit && hit.object.userData.bx !== undefined) {
    removeBlock(hit.object.userData.bx, hit.object.userData.by, hit.object.userData.bz);
  }
});

// ═══════════════════════════════════════════════════
// UI: Texture pack buttons
// ═══════════════════════════════════════════════════
const listEl = document.getElementById('texture-list');

for (const [id, pack] of Object.entries(TEXTURE_PACKS)) {
  const btn = document.createElement('button');
  btn.className = 'texture-btn' + (id === currentPack ? ' active' : '');
  btn.dataset.pack = id;

  const preview = pack.preview();
  preview.className = 'texture-preview';
  btn.appendChild(preview);

  const label = document.createElement('span');
  label.textContent = pack.name;
  btn.appendChild(label);

  btn.addEventListener('click', () => {
    if (currentPack === id) return;
    currentPack = id;
    document.querySelectorAll('.texture-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    rebuildMeshes();
    buildBlockTypeSelector();
  });

  listEl.appendChild(btn);
}

// ═══════════════════════════════════════════════════
// UI: Block type selector (for edit mode)
// ═══════════════════════════════════════════════════
function buildBlockTypeSelector() {
  const container = document.getElementById('block-types');
  container.innerHTML = '';
  const pack = TEXTURE_PACKS[currentPack];

  for (const type of BLOCK_TYPES) {
    const btn = document.createElement('button');
    btn.className = 'block-type-btn' + (type === selectedType ? ' active' : '');

    const swatch = pack.textures[type]();
    swatch.className = 'block-type-swatch';
    btn.appendChild(swatch);

    const lbl = document.createElement('span');
    lbl.textContent = BLOCK_LABELS[type];
    btn.appendChild(lbl);

    btn.addEventListener('click', () => {
      selectedType = type;
      container.querySelectorAll('.block-type-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });

    container.appendChild(btn);
  }
}
buildBlockTypeSelector();

// ═══════════════════════════════════════════════════
// UI: Edit mode toggle
// ═══════════════════════════════════════════════════
document.getElementById('edit-toggle').addEventListener('click', () => {
  setEditMode(!editMode);
});

// Clear all
document.getElementById('clear-all-btn').addEventListener('click', () => {
  if (blocks.length === 0) return;
  if (!confirm('確定要清空所有方塊嗎？')) return;
  setBlocks([]);
});

// ═══════════════════════════════════════════════════
// UI: Template management
// ═══════════════════════════════════════════════════
function renderTemplateList() {
  const container = document.getElementById('template-list');
  const all = loadAllTemplates();
  const names = Object.keys(all).sort((a, b) => (all[b].savedAt || 0) - (all[a].savedAt || 0));

  if (names.length === 0) {
    container.innerHTML = '<div class="empty-hint">尚無儲存的範本</div>';
    return;
  }

  container.innerHTML = '';
  for (const name of names) {
    const item = document.createElement('div');
    item.className = 'tpl-item';

    const nameEl = document.createElement('span');
    nameEl.className = 'tpl-name';
    nameEl.textContent = name;
    nameEl.title = `載入「${name}」(${all[name].blocks.length} 方塊)`;
    nameEl.addEventListener('click', () => {
      setBlocks(all[name].blocks);
    });

    // Rename button
    const renBtn = document.createElement('button');
    renBtn.className = 'tpl-btn';
    renBtn.textContent = '✎';
    renBtn.title = '重新命名';
    renBtn.addEventListener('click', () => {
      const newName = prompt('輸入新名稱：', name);
      if (newName && newName.trim() && newName.trim() !== name) {
        renameTemplate(name, newName.trim());
        renderTemplateList();
      }
    });

    // Delete button
    const delBtn = document.createElement('button');
    delBtn.className = 'tpl-btn del';
    delBtn.textContent = '✕';
    delBtn.title = '刪除範本';
    delBtn.addEventListener('click', () => {
      if (confirm(`確定要刪除範本「${name}」嗎？`)) {
        deleteTemplate(name);
        renderTemplateList();
      }
    });

    item.appendChild(nameEl);
    item.appendChild(renBtn);
    item.appendChild(delBtn);
    container.appendChild(item);
  }
}
renderTemplateList();

// Save template
document.getElementById('save-btn').addEventListener('click', () => {
  const input = document.getElementById('save-name');
  const name = input.value.trim();
  if (!name) {
    input.focus();
    input.style.borderColor = '#ef5350';
    setTimeout(() => input.style.borderColor = '', 1000);
    return;
  }
  if (blocks.length === 0) {
    alert('目前沒有任何方塊可儲存！');
    return;
  }
  saveTemplate(name, blocks);
  input.value = '';
  renderTemplateList();
});

// Enter key to save
document.getElementById('save-name').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('save-btn').click();
});

// Load default throne
document.getElementById('load-default-btn').addEventListener('click', () => {
  setBlocks(getThroneBlocks());
});

// Export SVG
document.getElementById('export-btn').addEventListener('click', () => {
  exportPackSVG(currentPack);
});

// ═══════════════════════════════════════════════════
// Animation loop
// ═══════════════════════════════════════════════════
function animate() {
  requestAnimationFrame(animate);
  controls.update();

  const t = performance.now() * 0.001;
  pointLight.position.x = Math.sin(t * 0.5) * 2;
  pointLight.position.z = 3 + Math.cos(t * 0.3) * 1.5;

  renderer.render(scene, camera);
}
animate();

// ─── Resize handling ──────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
