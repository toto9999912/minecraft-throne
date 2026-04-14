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
  // cracks
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
  // wood grain
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
  // gold block pattern
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
  // velvet pattern
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
  // crimson grain
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
  // ice cracks
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
  // sparkle
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
};
