// Procedural texture generator for Minecraft-style blocks
// Each texture pack defines how to draw each block type onto a canvas

const TEX_SIZE = 16;

function createCanvas(size = TEX_SIZE) {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  return c;
}

function noise(ctx, baseColor, noiseAmount, size = TEX_SIZE) {
  const id = ctx.getImageData(0, 0, size, size);
  const d = id.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * noiseAmount;
    d[i] = Math.max(0, Math.min(255, baseColor[0] + n));
    d[i + 1] = Math.max(0, Math.min(255, baseColor[1] + n));
    d[i + 2] = Math.max(0, Math.min(255, baseColor[2] + n));
    d[i + 3] = 255;
  }
  ctx.putImageData(id, 0, 0);
}

function drawBorder(ctx, color, size = TEX_SIZE) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.strokeRect(0.5, 0.5, size - 1, size - 1);
}

// ─── Classic (Oak & Stone) ────────────────────────
function classic_stone() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [128, 128, 128], 30);
  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(3, 5); ctx.lineTo(8, 6); ctx.lineTo(12, 4);
  ctx.moveTo(6, 11); ctx.lineTo(10, 12); ctx.lineTo(14, 10);
  ctx.stroke();
  drawBorder(ctx, 'rgba(0,0,0,0.15)');
  return c;
}

function classic_oak() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [160, 120, 60], 20);
  ctx.strokeStyle = 'rgba(100,70,30,0.4)';
  ctx.lineWidth = 1;
  for (let y = 2; y < 16; y += 3) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(16, y + (Math.random() - 0.5) * 2);
    ctx.stroke();
  }
  drawBorder(ctx, 'rgba(80,50,20,0.2)');
  return c;
}

function classic_gold() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [220, 190, 50], 25);
  ctx.fillStyle = 'rgba(255,220,80,0.3)';
  ctx.fillRect(2, 2, 12, 12);
  ctx.strokeStyle = 'rgba(180,150,30,0.4)';
  ctx.lineWidth = 1;
  ctx.strokeRect(3, 3, 10, 10);
  drawBorder(ctx, 'rgba(150,120,20,0.3)');
  return c;
}

function classic_red() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [160, 50, 50], 20);
  for (let y = 0; y < 16; y += 2) {
    ctx.fillStyle = `rgba(180,40,40,${0.2 + Math.random() * 0.15})`;
    ctx.fillRect(0, y, 16, 1);
  }
  drawBorder(ctx, 'rgba(100,20,20,0.3)');
  return c;
}

function classic_dark() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [40, 40, 50], 15);
  drawBorder(ctx, 'rgba(0,0,0,0.3)');
  return c;
}

// ─── Nether (Crimson & Blackstone) ────────────────
function nether_blackstone() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [45, 40, 50], 20);
  ctx.fillStyle = 'rgba(60,50,70,0.3)';
  ctx.fillRect(0, 4, 16, 4);
  ctx.fillRect(4, 10, 8, 3);
  drawBorder(ctx, 'rgba(30,25,35,0.3)');
  return c;
}

function nether_crimson() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [120, 30, 40], 25);
  ctx.strokeStyle = 'rgba(160,20,30,0.35)';
  ctx.lineWidth = 1;
  for (let y = 1; y < 16; y += 3) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(16, y + 1);
    ctx.stroke();
  }
  drawBorder(ctx, 'rgba(80,15,20,0.3)');
  return c;
}

function nether_gold() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [180, 140, 30], 30);
  ctx.fillStyle = 'rgba(220,180,40,0.25)';
  ctx.fillRect(3, 3, 10, 10);
  drawBorder(ctx, 'rgba(120,90,20,0.3)');
  return c;
}

function nether_lava() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [200, 80, 20], 40);
  ctx.fillStyle = 'rgba(255,120,0,0.3)';
  ctx.fillRect(2, 5, 12, 6);
  ctx.fillStyle = 'rgba(255,200,50,0.2)';
  ctx.fillRect(4, 7, 8, 2);
  drawBorder(ctx, 'rgba(150,50,10,0.3)');
  return c;
}

function nether_dark() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [30, 20, 25], 12);
  drawBorder(ctx, 'rgba(15,10,15,0.4)');
  return c;
}

// ─── Ice (Packed Ice & Snow) ──────────────────────
function ice_block() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [140, 200, 230], 20);
  ctx.strokeStyle = 'rgba(180,230,255,0.5)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(2, 3); ctx.lineTo(7, 8); ctx.lineTo(5, 14);
  ctx.moveTo(10, 1); ctx.lineTo(13, 7); ctx.lineTo(11, 12);
  ctx.stroke();
  drawBorder(ctx, 'rgba(100,170,210,0.2)');
  return c;
}

function ice_snow() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [230, 235, 240], 10);
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.fillRect(4, 3, 1, 1);
  ctx.fillRect(11, 7, 1, 1);
  ctx.fillRect(7, 12, 1, 1);
  drawBorder(ctx, 'rgba(180,200,210,0.15)');
  return c;
}

function ice_blue() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [50, 100, 180], 25);
  ctx.fillStyle = 'rgba(80,150,220,0.25)';
  ctx.fillRect(2, 2, 12, 12);
  drawBorder(ctx, 'rgba(30,70,140,0.3)');
  return c;
}

function ice_crystal() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [200, 220, 240], 15);
  ctx.strokeStyle = 'rgba(150,200,255,0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(8, 2); ctx.lineTo(8, 14);
  ctx.moveTo(3, 8); ctx.lineTo(13, 8);
  ctx.moveTo(4, 4); ctx.lineTo(12, 12);
  ctx.moveTo(12, 4); ctx.lineTo(4, 12);
  ctx.stroke();
  drawBorder(ctx, 'rgba(130,180,220,0.2)');
  return c;
}

function ice_dark() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [60, 80, 110], 15);
  drawBorder(ctx, 'rgba(40,60,90,0.3)');
  return c;
}

// ─── Emerald (Emerald & Prismarine) ───────────────
function emerald_block() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [30, 160, 70], 25);
  ctx.fillStyle = 'rgba(50,200,90,0.25)';
  ctx.fillRect(3, 3, 10, 10);
  ctx.strokeStyle = 'rgba(20,120,50,0.35)';
  ctx.lineWidth = 1;
  ctx.strokeRect(4, 4, 8, 8);
  drawBorder(ctx, 'rgba(20,100,40,0.3)');
  return c;
}

function emerald_prismarine() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [70, 140, 130], 25);
  ctx.fillStyle = 'rgba(90,170,150,0.2)';
  ctx.fillRect(0, 0, 8, 8);
  ctx.fillRect(8, 8, 8, 8);
  drawBorder(ctx, 'rgba(50,110,100,0.25)');
  return c;
}

function emerald_gold() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [200, 180, 50], 25);
  ctx.fillStyle = 'rgba(230,200,60,0.3)';
  ctx.fillRect(2, 2, 12, 12);
  drawBorder(ctx, 'rgba(140,120,30,0.3)');
  return c;
}

function emerald_dark() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [20, 50, 30], 15);
  drawBorder(ctx, 'rgba(10,30,15,0.4)');
  return c;
}

function emerald_accent() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [40, 100, 80], 20);
  drawBorder(ctx, 'rgba(25,70,55,0.3)');
  return c;
}

// ─── Diamond (Diamond & Lapis) ────────────────────
function diamond_block() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [100, 220, 230], 20);
  ctx.fillStyle = 'rgba(130,240,255,0.3)';
  ctx.fillRect(3, 3, 10, 10);
  ctx.strokeStyle = 'rgba(60,180,200,0.4)';
  ctx.lineWidth = 1;
  ctx.strokeRect(4, 4, 8, 8);
  // sparkle
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.fillRect(5, 5, 1, 1);
  ctx.fillRect(10, 9, 1, 1);
  drawBorder(ctx, 'rgba(50,160,180,0.3)');
  return c;
}

function diamond_lapis() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [30, 50, 140], 25);
  ctx.fillStyle = 'rgba(40,70,180,0.2)';
  ctx.fillRect(2, 2, 5, 5);
  ctx.fillRect(9, 9, 5, 5);
  ctx.fillStyle = 'rgba(60,90,200,0.15)';
  ctx.fillRect(8, 2, 5, 4);
  drawBorder(ctx, 'rgba(20,35,100,0.3)');
  return c;
}

function diamond_iron() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [190, 190, 195], 15);
  ctx.fillStyle = 'rgba(210,210,215,0.2)';
  ctx.fillRect(2, 2, 12, 12);
  ctx.strokeStyle = 'rgba(150,150,155,0.3)';
  ctx.lineWidth = 1;
  ctx.strokeRect(3, 3, 10, 10);
  drawBorder(ctx, 'rgba(140,140,145,0.2)');
  return c;
}

function diamond_cyan() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [60, 160, 170], 20);
  drawBorder(ctx, 'rgba(40,120,130,0.3)');
  return c;
}

function diamond_dark() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [20, 40, 60], 15);
  drawBorder(ctx, 'rgba(10,25,40,0.4)');
  return c;
}

// ─── Redstone (Redstone & Dark Iron) ──────────────
function redstone_block() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [170, 30, 20], 30);
  // circuit lines
  ctx.strokeStyle = 'rgba(255,60,30,0.45)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(4, 8); ctx.lineTo(12, 8);
  ctx.moveTo(8, 3); ctx.lineTo(8, 13);
  ctx.moveTo(4, 4); ctx.lineTo(8, 8);
  ctx.moveTo(8, 8); ctx.lineTo(12, 12);
  ctx.stroke();
  // glow dots
  ctx.fillStyle = 'rgba(255,100,60,0.5)';
  ctx.fillRect(4, 8, 1, 1);
  ctx.fillRect(12, 8, 1, 1);
  ctx.fillRect(8, 3, 1, 1);
  ctx.fillRect(8, 13, 1, 1);
  drawBorder(ctx, 'rgba(120,20,10,0.3)');
  return c;
}

function redstone_iron() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [80, 75, 75], 20);
  ctx.fillStyle = 'rgba(100,90,90,0.2)';
  ctx.fillRect(0, 4, 16, 4);
  ctx.fillRect(0, 12, 16, 4);
  ctx.strokeStyle = 'rgba(60,55,55,0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 4); ctx.lineTo(16, 4);
  ctx.moveTo(0, 8); ctx.lineTo(16, 8);
  ctx.moveTo(0, 12); ctx.lineTo(16, 12);
  ctx.stroke();
  drawBorder(ctx, 'rgba(50,45,45,0.3)');
  return c;
}

function redstone_glow() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [200, 60, 30], 30);
  ctx.fillStyle = 'rgba(255,120,50,0.3)';
  ctx.fillRect(4, 4, 8, 8);
  ctx.fillStyle = 'rgba(255,200,80,0.2)';
  ctx.fillRect(6, 6, 4, 4);
  drawBorder(ctx, 'rgba(150,40,20,0.3)');
  return c;
}

function redstone_dark() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [35, 25, 25], 12);
  ctx.strokeStyle = 'rgba(80,20,15,0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(3, 8); ctx.lineTo(13, 8);
  ctx.stroke();
  drawBorder(ctx, 'rgba(20,12,12,0.4)');
  return c;
}

function redstone_accent() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [220, 180, 40], 25);
  ctx.fillStyle = 'rgba(240,200,50,0.25)';
  ctx.fillRect(2, 2, 12, 12);
  drawBorder(ctx, 'rgba(160,130,30,0.3)');
  return c;
}

// ─── Cherry Blossom (Pink & White) ────────────────
function cherry_plank() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [200, 150, 155], 18);
  ctx.strokeStyle = 'rgba(170,110,120,0.35)';
  ctx.lineWidth = 1;
  for (let y = 2; y < 16; y += 3) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(16, y + (Math.random() - 0.5) * 1.5);
    ctx.stroke();
  }
  drawBorder(ctx, 'rgba(160,100,110,0.2)');
  return c;
}

function cherry_log() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [140, 90, 100], 20);
  ctx.strokeStyle = 'rgba(120,70,80,0.3)';
  ctx.lineWidth = 1;
  for (let y = 1; y < 16; y += 2) {
    ctx.beginPath();
    ctx.moveTo(0, y); ctx.lineTo(16, y);
    ctx.stroke();
  }
  drawBorder(ctx, 'rgba(100,60,70,0.25)');
  return c;
}

function cherry_petal() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [240, 180, 200], 15);
  // petal spots
  ctx.fillStyle = 'rgba(255,200,220,0.4)';
  ctx.fillRect(3, 3, 2, 2);
  ctx.fillRect(10, 5, 2, 2);
  ctx.fillRect(6, 10, 2, 2);
  ctx.fillRect(12, 12, 2, 2);
  ctx.fillStyle = 'rgba(255,150,180,0.3)';
  ctx.fillRect(7, 2, 1, 1);
  ctx.fillRect(2, 8, 1, 1);
  ctx.fillRect(13, 9, 1, 1);
  drawBorder(ctx, 'rgba(200,140,160,0.15)');
  return c;
}

function cherry_white() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [240, 235, 235], 8);
  ctx.fillStyle = 'rgba(255,220,230,0.15)';
  ctx.fillRect(0, 0, 16, 16);
  drawBorder(ctx, 'rgba(200,190,195,0.15)');
  return c;
}

function cherry_dark() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [90, 55, 65], 15);
  drawBorder(ctx, 'rgba(60,35,45,0.3)');
  return c;
}

// ─── Amethyst (Purple Crystal) ────────────────────
function amethyst_block() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [130, 80, 180], 25);
  ctx.fillStyle = 'rgba(160,100,220,0.25)';
  ctx.fillRect(3, 3, 10, 10);
  // crystal facets
  ctx.strokeStyle = 'rgba(180,130,240,0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(5, 3); ctx.lineTo(8, 8); ctx.lineTo(11, 3);
  ctx.moveTo(5, 13); ctx.lineTo(8, 8); ctx.lineTo(11, 13);
  ctx.stroke();
  ctx.fillStyle = 'rgba(220,180,255,0.3)';
  ctx.fillRect(7, 7, 2, 2);
  drawBorder(ctx, 'rgba(90,50,140,0.3)');
  return c;
}

function amethyst_calcite() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [210, 205, 215], 12);
  ctx.fillStyle = 'rgba(220,215,230,0.15)';
  ctx.fillRect(0, 0, 16, 8);
  drawBorder(ctx, 'rgba(170,165,180,0.2)');
  return c;
}

function amethyst_deepslate() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [55, 55, 60], 18);
  ctx.strokeStyle = 'rgba(70,70,80,0.3)';
  ctx.lineWidth = 1;
  for (let y = 2; y < 16; y += 3) {
    ctx.beginPath();
    ctx.moveTo(0, y); ctx.lineTo(16, y + 1);
    ctx.stroke();
  }
  drawBorder(ctx, 'rgba(35,35,40,0.3)');
  return c;
}

function amethyst_glow() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [170, 120, 220], 20);
  ctx.fillStyle = 'rgba(200,150,255,0.3)';
  ctx.fillRect(4, 4, 8, 8);
  ctx.fillStyle = 'rgba(230,200,255,0.25)';
  ctx.fillRect(6, 6, 4, 4);
  drawBorder(ctx, 'rgba(110,70,160,0.3)');
  return c;
}

function amethyst_dark() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [30, 20, 45], 12);
  drawBorder(ctx, 'rgba(15,10,30,0.4)');
  return c;
}

// ─── Desert (Sandstone & Terracotta) ──────────────
function desert_sandstone() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [215, 195, 150], 20);
  // layered stripes
  ctx.fillStyle = 'rgba(200,180,130,0.2)';
  ctx.fillRect(0, 4, 16, 2);
  ctx.fillRect(0, 10, 16, 2);
  ctx.strokeStyle = 'rgba(180,160,110,0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 8); ctx.lineTo(16, 8);
  ctx.stroke();
  drawBorder(ctx, 'rgba(170,150,100,0.2)');
  return c;
}

function desert_terracotta() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [160, 90, 55], 22);
  ctx.fillStyle = 'rgba(140,75,40,0.15)';
  ctx.fillRect(0, 0, 8, 8);
  ctx.fillRect(8, 8, 8, 8);
  drawBorder(ctx, 'rgba(120,65,35,0.25)');
  return c;
}

function desert_gold() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [210, 180, 60], 25);
  ctx.fillStyle = 'rgba(230,200,80,0.25)';
  ctx.fillRect(3, 3, 10, 10);
  ctx.strokeStyle = 'rgba(190,160,40,0.3)';
  ctx.lineWidth = 1;
  ctx.strokeRect(4, 4, 8, 8);
  drawBorder(ctx, 'rgba(160,130,30,0.25)');
  return c;
}

function desert_red() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [180, 70, 40], 20);
  ctx.fillStyle = 'rgba(160,55,30,0.15)';
  ctx.fillRect(0, 0, 16, 16);
  drawBorder(ctx, 'rgba(130,50,25,0.3)');
  return c;
}

function desert_dark() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [60, 45, 30], 15);
  drawBorder(ctx, 'rgba(40,28,18,0.35)');
  return c;
}

// ─── Dark Oak (Deep Forest) ──────────────────────
function darkoak_plank() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [65, 42, 20], 18);
  ctx.strokeStyle = 'rgba(45,28,10,0.4)';
  ctx.lineWidth = 1;
  for (let y = 2; y < 16; y += 3) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(16, y + (Math.random() - 0.5) * 1.5);
    ctx.stroke();
  }
  drawBorder(ctx, 'rgba(35,22,8,0.25)');
  return c;
}

function darkoak_log() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [45, 30, 15], 15);
  ctx.strokeStyle = 'rgba(30,18,8,0.35)';
  ctx.lineWidth = 1;
  for (let y = 1; y < 16; y += 2) {
    ctx.beginPath();
    ctx.moveTo(0, y); ctx.lineTo(16, y);
    ctx.stroke();
  }
  drawBorder(ctx, 'rgba(25,15,5,0.3)');
  return c;
}

function darkoak_moss() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [55, 80, 35], 22);
  ctx.fillStyle = 'rgba(65,95,40,0.2)';
  ctx.fillRect(2, 8, 5, 4);
  ctx.fillRect(10, 3, 4, 3);
  ctx.fillStyle = 'rgba(80,110,50,0.15)';
  ctx.fillRect(6, 12, 3, 2);
  drawBorder(ctx, 'rgba(35,55,20,0.25)');
  return c;
}

function darkoak_green() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [30, 60, 25], 18);
  drawBorder(ctx, 'rgba(18,40,15,0.3)');
  return c;
}

function darkoak_dark() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [22, 15, 8], 10);
  drawBorder(ctx, 'rgba(10,6,3,0.4)');
  return c;
}

// ─── Copper (Oxidized Copper) ─────────────────────
function copper_block() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [180, 110, 60], 28);
  // oxidation spots
  ctx.fillStyle = 'rgba(90,170,130,0.2)';
  ctx.fillRect(2, 3, 3, 3);
  ctx.fillRect(10, 9, 4, 3);
  ctx.fillRect(5, 11, 3, 2);
  ctx.strokeStyle = 'rgba(140,80,40,0.3)';
  ctx.lineWidth = 1;
  ctx.strokeRect(3, 3, 10, 10);
  drawBorder(ctx, 'rgba(130,75,35,0.25)');
  return c;
}

function copper_oxidized() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [100, 170, 140], 22);
  ctx.fillStyle = 'rgba(80,150,120,0.2)';
  ctx.fillRect(0, 0, 8, 8);
  ctx.fillRect(8, 8, 8, 8);
  ctx.fillStyle = 'rgba(120,190,160,0.15)';
  ctx.fillRect(3, 10, 4, 3);
  drawBorder(ctx, 'rgba(70,130,105,0.25)');
  return c;
}

function copper_cut() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [160, 95, 50], 22);
  // cut copper grid
  ctx.strokeStyle = 'rgba(130,70,30,0.35)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(8, 0); ctx.lineTo(8, 16);
  ctx.moveTo(0, 8); ctx.lineTo(16, 8);
  ctx.stroke();
  drawBorder(ctx, 'rgba(120,65,28,0.3)');
  return c;
}

function copper_teal() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [60, 130, 120], 20);
  drawBorder(ctx, 'rgba(40,95,85,0.3)');
  return c;
}

function copper_dark() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [40, 35, 28], 12);
  drawBorder(ctx, 'rgba(25,20,15,0.4)');
  return c;
}

// ─── Sculk (Deep Dark) ───────────────────────────
function sculk_block() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [10, 25, 35], 18);
  // bioluminescent veins
  ctx.strokeStyle = 'rgba(0,180,200,0.35)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(2, 4); ctx.lineTo(6, 7); ctx.lineTo(4, 12);
  ctx.moveTo(10, 2); ctx.lineTo(13, 6); ctx.lineTo(14, 11);
  ctx.moveTo(7, 10); ctx.lineTo(11, 14);
  ctx.stroke();
  // glow nodes
  ctx.fillStyle = 'rgba(0,220,240,0.4)';
  ctx.fillRect(6, 7, 1, 1);
  ctx.fillRect(13, 6, 1, 1);
  ctx.fillRect(4, 12, 1, 1);
  drawBorder(ctx, 'rgba(5,15,25,0.4)');
  return c;
}

function sculk_catalyst() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [15, 30, 40], 15);
  ctx.fillStyle = 'rgba(0,150,170,0.25)';
  ctx.fillRect(5, 5, 6, 6);
  ctx.fillStyle = 'rgba(0,200,220,0.2)';
  ctx.fillRect(6, 6, 4, 4);
  ctx.fillStyle = 'rgba(100,240,255,0.3)';
  ctx.fillRect(7, 7, 2, 2);
  drawBorder(ctx, 'rgba(5,18,28,0.4)');
  return c;
}

function sculk_vein() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [8, 18, 28], 12);
  ctx.strokeStyle = 'rgba(0,160,180,0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 8); ctx.lineTo(5, 6); ctx.lineTo(11, 9); ctx.lineTo(16, 7);
  ctx.moveTo(3, 0); ctx.lineTo(5, 6);
  ctx.moveTo(11, 9); ctx.lineTo(13, 16);
  ctx.stroke();
  drawBorder(ctx, 'rgba(3,12,20,0.4)');
  return c;
}

function sculk_glow() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [0, 100, 120], 25);
  ctx.fillStyle = 'rgba(0,200,230,0.3)';
  ctx.fillRect(4, 4, 8, 8);
  ctx.fillStyle = 'rgba(50,240,255,0.2)';
  ctx.fillRect(6, 6, 4, 4);
  drawBorder(ctx, 'rgba(0,70,85,0.35)');
  return c;
}

function sculk_dark() {
  const c = createCanvas();
  const ctx = c.getContext('2d');
  noise(ctx, [5, 8, 12], 8);
  drawBorder(ctx, 'rgba(2,4,8,0.5)');
  return c;
}

// ─── Texture pack definitions ─────────────────────
export const TEXTURE_PACKS = {
  classic: {
    name: '經典橡木石磚',
    preview: classic_stone,
    textures: {
      base: classic_stone,
      pillar: classic_stone,
      seat: classic_oak,
      armrest: classic_oak,
      backrest: classic_oak,
      accent: classic_gold,
      cushion: classic_red,
      dark: classic_dark,
    }
  },
  nether: {
    name: '地獄緋紅',
    preview: nether_blackstone,
    textures: {
      base: nether_blackstone,
      pillar: nether_blackstone,
      seat: nether_crimson,
      armrest: nether_crimson,
      backrest: nether_crimson,
      accent: nether_gold,
      cushion: nether_lava,
      dark: nether_dark,
    }
  },
  ice: {
    name: '冰霜王座',
    preview: ice_block,
    textures: {
      base: ice_block,
      pillar: ice_block,
      seat: ice_snow,
      armrest: ice_snow,
      backrest: ice_crystal,
      accent: ice_blue,
      cushion: ice_crystal,
      dark: ice_dark,
    }
  },
  emerald: {
    name: '翡翠海晶',
    preview: emerald_block,
    textures: {
      base: emerald_prismarine,
      pillar: emerald_prismarine,
      seat: emerald_block,
      armrest: emerald_block,
      backrest: emerald_block,
      accent: emerald_gold,
      cushion: emerald_accent,
      dark: emerald_dark,
    }
  },
  diamond: {
    name: '鑽石藍晶',
    preview: diamond_block,
    textures: {
      base: diamond_iron,
      pillar: diamond_iron,
      seat: diamond_block,
      armrest: diamond_block,
      backrest: diamond_block,
      accent: diamond_lapis,
      cushion: diamond_cyan,
      dark: diamond_dark,
    }
  },
  redstone: {
    name: '紅石機械',
    preview: redstone_block,
    textures: {
      base: redstone_iron,
      pillar: redstone_iron,
      seat: redstone_block,
      armrest: redstone_iron,
      backrest: redstone_block,
      accent: redstone_accent,
      cushion: redstone_glow,
      dark: redstone_dark,
    }
  },
  cherry: {
    name: '櫻花粉木',
    preview: cherry_plank,
    textures: {
      base: cherry_log,
      pillar: cherry_log,
      seat: cherry_plank,
      armrest: cherry_plank,
      backrest: cherry_plank,
      accent: cherry_white,
      cushion: cherry_petal,
      dark: cherry_dark,
    }
  },
  amethyst: {
    name: '紫水晶洞',
    preview: amethyst_block,
    textures: {
      base: amethyst_deepslate,
      pillar: amethyst_deepslate,
      seat: amethyst_block,
      armrest: amethyst_calcite,
      backrest: amethyst_block,
      accent: amethyst_glow,
      cushion: amethyst_glow,
      dark: amethyst_dark,
    }
  },
  desert: {
    name: '沙漠砂岩',
    preview: desert_sandstone,
    textures: {
      base: desert_sandstone,
      pillar: desert_sandstone,
      seat: desert_terracotta,
      armrest: desert_terracotta,
      backrest: desert_terracotta,
      accent: desert_gold,
      cushion: desert_red,
      dark: desert_dark,
    }
  },
  darkoak: {
    name: '暗黑深林',
    preview: darkoak_plank,
    textures: {
      base: darkoak_log,
      pillar: darkoak_log,
      seat: darkoak_plank,
      armrest: darkoak_plank,
      backrest: darkoak_plank,
      accent: darkoak_moss,
      cushion: darkoak_green,
      dark: darkoak_dark,
    }
  },
  copper: {
    name: '氧化銅綠',
    preview: copper_block,
    textures: {
      base: copper_cut,
      pillar: copper_cut,
      seat: copper_block,
      armrest: copper_block,
      backrest: copper_block,
      accent: copper_oxidized,
      cushion: copper_teal,
      dark: copper_dark,
    }
  },
  sculk: {
    name: '幽暗深淵',
    preview: sculk_block,
    textures: {
      base: sculk_block,
      pillar: sculk_vein,
      seat: sculk_catalyst,
      armrest: sculk_vein,
      backrest: sculk_catalyst,
      accent: sculk_glow,
      cushion: sculk_glow,
      dark: sculk_dark,
    }
  },
};
