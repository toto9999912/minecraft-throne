// SVG export: converts 16x16 canvas textures to pixel-perfect SVGs
// Generates a printable page with cube nets (展開圖) for physical blocks

import { TEXTURE_PACKS } from './textures.js';

const TEX_SIZE = 16;
const BLOCK_TYPES = ['base', 'pillar', 'seat', 'armrest', 'backrest', 'accent', 'cushion', 'dark'];
const BLOCK_LABELS = {
  base: '底座 Base',
  pillar: '支柱 Pillar',
  seat: '座椅 Seat',
  armrest: '扶手 Armrest',
  backrest: '靠背 Backrest',
  accent: '裝飾 Accent',
  cushion: '坐墊 Cushion',
  dark: '暗色 Dark',
};

/**
 * Convert a 16x16 canvas to an SVG string (pixel-perfect rects)
 */
function canvasToSVG(canvas, svgSize) {
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, TEX_SIZE, TEX_SIZE);
  const d = imageData.data;
  const pxSize = svgSize / TEX_SIZE;

  let rects = '';
  for (let y = 0; y < TEX_SIZE; y++) {
    for (let x = 0; x < TEX_SIZE; x++) {
      const i = (y * TEX_SIZE + x) * 4;
      const r = d[i], g = d[i + 1], b = d[i + 2];
      rects += `<rect x="${x * pxSize}" y="${y * pxSize}" width="${pxSize}" height="${pxSize}" fill="rgb(${r},${g},${b})" />`;
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${svgSize}" height="${svgSize}" viewBox="0 0 ${svgSize} ${svgSize}" shape-rendering="crispEdges">${rects}</svg>`;
}

/**
 * Generate a cube net (十字展開圖) SVG for a single texture
 * Layout (each face = faceSize x faceSize):
 *        [top]
 *  [left][front][right][back]
 *        [bottom]
 */
function cubeNetSVG(canvas, faceSize) {
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, TEX_SIZE, TEX_SIZE);
  const d = imageData.data;
  const px = faceSize / TEX_SIZE;

  const totalW = faceSize * 4;
  const totalH = faceSize * 3;

  // Offsets for 6 faces in cross layout
  const faces = [
    { label: 'top',    ox: faceSize,     oy: 0 },
    { label: 'left',   ox: 0,            oy: faceSize },
    { label: 'front',  ox: faceSize,     oy: faceSize },
    { label: 'right',  ox: faceSize * 2, oy: faceSize },
    { label: 'back',   ox: faceSize * 3, oy: faceSize },
    { label: 'bottom', ox: faceSize,     oy: faceSize * 2 },
  ];

  let rects = '';

  for (const face of faces) {
    for (let y = 0; y < TEX_SIZE; y++) {
      for (let x = 0; x < TEX_SIZE; x++) {
        const i = (y * TEX_SIZE + x) * 4;
        const r = d[i], g = d[i + 1], b = d[i + 2];
        rects += `<rect x="${face.ox + x * px}" y="${face.oy + y * px}" width="${px}" height="${px}" fill="rgb(${r},${g},${b})" />`;
      }
    }
  }

  // Fold lines (dashed)
  const foldLines = `
    <line x1="${faceSize}" y1="0" x2="${faceSize}" y2="${faceSize}" stroke="#999" stroke-width="0.5" stroke-dasharray="3,3"/>
    <line x1="${faceSize*2}" y1="0" x2="${faceSize*2}" y2="${faceSize}" stroke="#999" stroke-width="0.5" stroke-dasharray="3,3"/>
    <line x1="0" y1="${faceSize}" x2="${totalW}" y2="${faceSize}" stroke="#999" stroke-width="0.5" stroke-dasharray="3,3"/>
    <line x1="0" y1="${faceSize*2}" x2="${totalW}" y2="${faceSize*2}" stroke="#999" stroke-width="0.5" stroke-dasharray="3,3"/>
    <line x1="${faceSize}" y1="${faceSize*2}" x2="${faceSize}" y2="${totalH}" stroke="#999" stroke-width="0.5" stroke-dasharray="3,3"/>
    <line x1="${faceSize*2}" y1="${faceSize*2}" x2="${faceSize*2}" y2="${totalH}" stroke="#999" stroke-width="0.5" stroke-dasharray="3,3"/>
    <line x1="0" y1="${faceSize}" x2="0" y2="${faceSize*2}" stroke="#999" stroke-width="0.5" stroke-dasharray="3,3"/>
    <line x1="${totalW}" y1="${faceSize}" x2="${totalW}" y2="${faceSize*2}" stroke="#999" stroke-width="0.5" stroke-dasharray="3,3"/>
  `;

  // Cut outline
  const cutPath = `
    M ${faceSize},0
    L ${faceSize*2},0
    L ${faceSize*2},${faceSize}
    L ${faceSize*4},${faceSize}
    L ${faceSize*4},${faceSize*2}
    L ${faceSize*2},${faceSize*2}
    L ${faceSize*2},${faceSize*3}
    L ${faceSize},${faceSize*3}
    L ${faceSize},${faceSize*2}
    L 0,${faceSize*2}
    L 0,${faceSize}
    L ${faceSize},${faceSize}
    Z
  `;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="${totalH}" viewBox="0 0 ${totalW} ${totalH}" shape-rendering="crispEdges">
    ${rects}
    ${foldLines}
    <path d="${cutPath}" fill="none" stroke="#333" stroke-width="1"/>
  </svg>`;
}

/**
 * Open a new printable window with all textures of a pack
 */
export function exportPackSVG(packId) {
  const pack = TEXTURE_PACKS[packId];
  if (!pack) return;

  const faceSize = 160; // px per face in the cube net (10x scale of 16px)
  const singleSize = 160;

  let cardsHTML = '';

  for (const type of BLOCK_TYPES) {
    const genFn = pack.textures[type];
    if (!genFn) continue;

    const canvas = genFn();
    const singleSVG = canvasToSVG(canvas, singleSize);
    const netSVG = cubeNetSVG(canvas, faceSize);

    cardsHTML += `
      <div class="card">
        <div class="card-header">
          <div class="single">${singleSVG}</div>
          <div class="info">
            <h3>${BLOCK_LABELS[type]}</h3>
            <p class="type-id">${type}</p>
          </div>
        </div>
        <div class="net-wrap">
          <p class="net-label">展開圖 (沿虛線摺，沿實線剪)</p>
          ${netSVG}
        </div>
      </div>
    `;
  }

  const html = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <title>${pack.name} — SVG 材質匯出</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', sans-serif;
      background: #f5f5f5;
      padding: 30px;
      color: #333;
    }
    h1 {
      text-align: center;
      margin-bottom: 8px;
      font-size: 28px;
    }
    .subtitle {
      text-align: center;
      color: #888;
      margin-bottom: 30px;
      font-size: 14px;
    }
    .toolbar {
      text-align: center;
      margin-bottom: 30px;
    }
    .toolbar button {
      padding: 10px 24px;
      font-size: 14px;
      background: #333;
      color: #fff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      margin: 0 6px;
    }
    .toolbar button:hover { background: #555; }
    .cards {
      display: grid;
      grid-template-columns: 1fr;
      gap: 30px;
      max-width: 800px;
      margin: 0 auto;
    }
    .card {
      background: #fff;
      border-radius: 10px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      page-break-inside: avoid;
    }
    .card-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;
    }
    .single svg {
      image-rendering: pixelated;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .info h3 { font-size: 18px; }
    .type-id { color: #aaa; font-size: 12px; font-family: monospace; }
    .net-wrap { text-align: center; }
    .net-label {
      font-size: 12px;
      color: #999;
      margin-bottom: 8px;
    }
    .net-wrap svg {
      image-rendering: pixelated;
      max-width: 100%;
      height: auto;
    }

    @media print {
      body { background: #fff; padding: 10px; }
      .toolbar { display: none; }
      .card { box-shadow: none; border: 1px solid #ddd; }
    }
  </style>
</head>
<body>
  <h1>${pack.name}</h1>
  <p class="subtitle">材質包匯出 — 每張展開圖可剪下摺成正方體方塊</p>
  <div class="toolbar">
    <button onclick="window.print()">列印 / 另存 PDF</button>
    <button onclick="downloadAll()">下載所有 SVG</button>
  </div>
  <div class="cards">${cardsHTML}</div>
  <script>
    function downloadAll() {
      document.querySelectorAll('.net-wrap > svg').forEach((svg, i) => {
        const types = ${JSON.stringify(BLOCK_TYPES)};
        const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = '${packId}_' + types[i] + '_net.svg';
        a.click();
        URL.revokeObjectURL(a.href);
      });
    }
  </script>
</body>
</html>`;

  const w = window.open('', '_blank');
  w.document.write(html);
  w.document.close();
}
