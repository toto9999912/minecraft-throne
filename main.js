import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TEXTURE_PACKS } from './textures.js';
import { getThroneBlocks } from './throne.js';

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
controls.target.set(0.5, 2, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 5;
controls.maxDistance = 30;
controls.update();

// ─── Lighting ─────────────────────────────────────
const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);

const dirLight = new THREE.DirectionalLight(0xffeedd, 1.2);
dirLight.position.set(8, 15, 10);
dirLight.castShadow = true;
dirLight.shadow.mapSize.set(1024, 1024);
dirLight.shadow.camera.left = -15;
dirLight.shadow.camera.right = 15;
dirLight.shadow.camera.top = 15;
dirLight.shadow.camera.bottom = -15;
scene.add(dirLight);

const fillLight = new THREE.DirectionalLight(0x8888ff, 0.3);
fillLight.position.set(-5, 5, -5);
scene.add(fillLight);

const pointLight = new THREE.PointLight(0xff9944, 0.6, 20);
pointLight.position.set(0, 8, 3);
scene.add(pointLight);

// ─── Ground plane ─────────────────────────────────
const groundGeo = new THREE.PlaneGeometry(40, 40);
const groundMat = new THREE.MeshStandardMaterial({
  color: 0x2a2a3e,
  roughness: 0.9,
});
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.01;
ground.receiveShadow = true;
scene.add(ground);

// Ground grid
const gridSize = 40;
const gridCanvas = document.createElement('canvas');
gridCanvas.width = 512;
gridCanvas.height = 512;
const gctx = gridCanvas.getContext('2d');
gctx.fillStyle = '#2a2a3e';
gctx.fillRect(0, 0, 512, 512);
gctx.strokeStyle = 'rgba(255,255,255,0.06)';
gctx.lineWidth = 1;
const step = 512 / gridSize;
for (let i = 0; i <= gridSize; i++) {
  gctx.beginPath();
  gctx.moveTo(i * step, 0);
  gctx.lineTo(i * step, 512);
  gctx.stroke();
  gctx.beginPath();
  gctx.moveTo(0, i * step);
  gctx.lineTo(512, i * step);
  gctx.stroke();
}
const gridTex = new THREE.CanvasTexture(gridCanvas);
groundMat.map = gridTex;
groundMat.needsUpdate = true;

// ─── Throne group ─────────────────────────────────
let throneGroup = new THREE.Group();
scene.add(throneGroup);

const blockGeometry = new THREE.BoxGeometry(1, 1, 1);
const throneBlocks = getThroneBlocks();

// Cache textures per pack
const textureCache = {};

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

function buildThrone(packId) {
  // Clear old
  while (throneGroup.children.length > 0) {
    const child = throneGroup.children[0];
    if (child.material) child.material.dispose();
    throneGroup.remove(child);
  }

  const textures = getPackTextures(packId);

  // Group blocks by type for instanced rendering
  const blocksByType = {};
  for (const [x, y, z, type] of throneBlocks) {
    if (!blocksByType[type]) blocksByType[type] = [];
    blocksByType[type].push([x, y, z]);
  }

  for (const [type, positions] of Object.entries(blocksByType)) {
    const material = new THREE.MeshStandardMaterial({
      map: textures[type],
      roughness: 0.85,
      metalness: type === 'accent' ? 0.4 : 0.05,
    });

    const mesh = new THREE.InstancedMesh(blockGeometry, material, positions.length);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const matrix = new THREE.Matrix4();
    positions.forEach(([x, y, z], i) => {
      matrix.setPosition(x, y + 0.5, z);
      mesh.setMatrixAt(i, matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;

    throneGroup.add(mesh);
  }
}

// ─── UI: Texture pack buttons ─────────────────────
const listEl = document.getElementById('texture-list');
let currentPack = 'classic';

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
    buildThrone(id);
  });

  listEl.appendChild(btn);
}

// Build initial throne
buildThrone(currentPack);

// ─── Animation loop ───────────────────────────────
function animate() {
  requestAnimationFrame(animate);
  controls.update();

  // Gentle float for point light
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
