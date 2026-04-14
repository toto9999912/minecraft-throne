// Throne voxel data: defines the 3D structure of the throne
// Each entry: [x, y, z, blockType]
// blockType: 'base' | 'pillar' | 'seat' | 'armrest' | 'backrest' | 'accent' | 'cushion' | 'dark'
//
// Base footprint: 5 wide (x: -2..2) x 4 deep (z: -2..1), height ~5
// Back at z=-2, front at z=1

export function getThroneBlocks() {
  const blocks = [];

  // ═══════════════════════════════════════════════════
  // y=0: Base platform (5 x 4) with accent corner pillars
  // ═══════════════════════════════════════════════════
  for (let x = -2; x <= 2; x++) {
    for (let z = -2; z <= 1; z++) {
      const isCorner = (Math.abs(x) === 2) && (z === -2 || z === 1);
      blocks.push([x, 0, z, isCorner ? 'accent' : 'base']);
    }
  }

  // ═══════════════════════════════════════════════════
  // y=1: Seat + armrests + backrest foundation
  // ═══════════════════════════════════════════════════
  // Seat surface (center 3 wide x 2 deep)
  for (let x = -1; x <= 1; x++) {
    blocks.push([x, 1, -1, 'seat']);
    blocks.push([x, 1, 0, 'seat']);
  }
  // Front seat lip (decorative edge)
  for (let x = -1; x <= 1; x++) {
    blocks.push([x, 1, 1, 'dark']);
  }
  // Left armrest (full depth)
  blocks.push([-2, 1, -1, 'armrest']);
  blocks.push([-2, 1, 0, 'armrest']);
  blocks.push([-2, 1, 1, 'armrest']);
  // Right armrest (full depth)
  blocks.push([2, 1, -1, 'armrest']);
  blocks.push([2, 1, 0, 'armrest']);
  blocks.push([2, 1, 1, 'armrest']);
  // Back wall — full 5-wide foundation
  for (let x = -2; x <= 2; x++) {
    blocks.push([x, 1, -2, 'pillar']);
  }

  // ═══════════════════════════════════════════════════
  // y=2: Cushion + armrest caps + backrest rise
  // ═══════════════════════════════════════════════════
  // Cushion (3 wide x 1 deep, on seat center)
  for (let x = -1; x <= 1; x++) {
    blocks.push([x, 2, 0, 'cushion']);
  }
  // Left armrest cap
  blocks.push([-2, 2, -1, 'pillar']);
  blocks.push([-2, 2, 0, 'accent']);
  blocks.push([-2, 2, 1, 'accent']);
  // Right armrest cap
  blocks.push([2, 2, -1, 'pillar']);
  blocks.push([2, 2, 0, 'accent']);
  blocks.push([2, 2, 1, 'accent']);
  // Backrest (full 5-wide)
  for (let x = -2; x <= 2; x++) {
    blocks.push([x, 2, -2, 'backrest']);
  }
  // Backrest inner layer (center 3)
  for (let x = -1; x <= 1; x++) {
    blocks.push([x, 2, -1, 'backrest']);
  }

  // ═══════════════════════════════════════════════════
  // y=3: Backrest upper + side pillar columns
  // ═══════════════════════════════════════════════════
  // Side pillars (double depth for volume)
  blocks.push([-2, 3, -2, 'pillar']);
  blocks.push([-2, 3, -1, 'pillar']);
  blocks.push([2, 3, -2, 'pillar']);
  blocks.push([2, 3, -1, 'pillar']);
  // Center backrest (3 wide)
  for (let x = -1; x <= 1; x++) {
    blocks.push([x, 3, -2, 'backrest']);
  }

  // ═══════════════════════════════════════════════════
  // y=4: Crown — peaks & center ornament
  // ═══════════════════════════════════════════════════
  // Side pillar peaks (double depth)
  blocks.push([-2, 4, -2, 'accent']);
  blocks.push([-2, 4, -1, 'accent']);
  blocks.push([2, 4, -2, 'accent']);
  blocks.push([2, 4, -1, 'accent']);
  // Center crown — accent middle, dark flanks
  blocks.push([-1, 4, -2, 'dark']);
  blocks.push([0, 4, -2, 'accent']);
  blocks.push([1, 4, -2, 'dark']);

  // ═══════════════════════════════════════════════════
  // y=5: Crown spire tips (side peaks only)
  // ═══════════════════════════════════════════════════
  blocks.push([-2, 5, -2, 'accent']);
  blocks.push([2, 5, -2, 'accent']);

  return blocks;
}
