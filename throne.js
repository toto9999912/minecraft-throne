// Throne voxel data: defines the 3D structure of the throne
// Each entry: [x, y, z, blockType]
// blockType: 'base' | 'pillar' | 'seat' | 'armrest' | 'backrest' | 'accent' | 'cushion' | 'dark'
//
// Base footprint: 4 wide (x: -1..2) x 5 deep (z: -2..2), height ~5

export function getThroneBlocks() {
  const blocks = [];

  // ═══════════════════════════════════════════════════
  // y=0: Base platform (4 x 5) with accent corner pillars
  // ═══════════════════════════════════════════════════
  for (let x = -1; x <= 2; x++) {
    for (let z = -2; z <= 2; z++) {
      // Corner accents for visual framing
      const isCorner = (x === -1 || x === 2) && (z === -2 || z === 2);
      blocks.push([x, 0, z, isCorner ? 'accent' : 'base']);
    }
  }

  // ═══════════════════════════════════════════════════
  // y=1: Seat + armrests + backrest foundation
  // ═══════════════════════════════════════════════════
  // Seat surface (center 2 x 3)
  for (let x = 0; x <= 1; x++) {
    blocks.push([x, 1, -1, 'seat']);
    blocks.push([x, 1, 0, 'seat']);
    blocks.push([x, 1, 1, 'seat']);
  }
  // Left armrest (3 deep)
  blocks.push([-1, 1, -1, 'armrest']);
  blocks.push([-1, 1, 0, 'armrest']);
  blocks.push([-1, 1, 1, 'armrest']);
  // Right armrest (3 deep)
  blocks.push([2, 1, -1, 'armrest']);
  blocks.push([2, 1, 0, 'armrest']);
  blocks.push([2, 1, 1, 'armrest']);
  // Back wall — full width, 2 layers deep for thickness
  for (let x = -1; x <= 2; x++) {
    blocks.push([x, 1, -2, 'pillar']);
  }

  // ═══════════════════════════════════════════════════
  // y=2: Cushion + armrest caps + backrest rise
  // ═══════════════════════════════════════════════════
  // Cushion (2 x 2, centered on seat)
  blocks.push([0, 2, 0, 'cushion']);
  blocks.push([1, 2, 0, 'cushion']);
  blocks.push([0, 2, 1, 'cushion']);
  blocks.push([1, 2, 1, 'cushion']);
  // Left armrest cap — accent on ends, armrest in middle
  blocks.push([-1, 2, -1, 'pillar']);
  blocks.push([-1, 2, 0, 'accent']);
  blocks.push([-1, 2, 1, 'accent']);
  // Right armrest cap
  blocks.push([2, 2, -1, 'pillar']);
  blocks.push([2, 2, 0, 'accent']);
  blocks.push([2, 2, 1, 'accent']);
  // Backrest (full width)
  for (let x = -1; x <= 2; x++) {
    blocks.push([x, 2, -2, 'backrest']);
  }

  // ═══════════════════════════════════════════════════
  // y=3: Backrest main body + side pillar columns
  // ═══════════════════════════════════════════════════
  // Side pillars extend up (gives depth)
  blocks.push([-1, 3, -2, 'pillar']);
  blocks.push([-1, 3, -1, 'pillar']);
  blocks.push([2, 3, -2, 'pillar']);
  blocks.push([2, 3, -1, 'pillar']);
  // Center backrest with decorative pattern
  blocks.push([0, 3, -2, 'backrest']);
  blocks.push([1, 3, -2, 'backrest']);

  // ═══════════════════════════════════════════════════
  // y=4: Crown — side peaks + center ornament
  // ═══════════════════════════════════════════════════
  // Side peak pillars (taller than center = crown silhouette)
  blocks.push([-1, 4, -2, 'accent']);
  blocks.push([-1, 4, -1, 'accent']);
  blocks.push([2, 4, -2, 'accent']);
  blocks.push([2, 4, -1, 'accent']);
  // Center crown fill
  blocks.push([0, 4, -2, 'dark']);
  blocks.push([1, 4, -2, 'dark']);

  // ═══════════════════════════════════════════════════
  // y=5: Crown tips — only the two side spires
  // ═══════════════════════════════════════════════════
  blocks.push([-1, 5, -2, 'accent']);
  blocks.push([2, 5, -2, 'accent']);

  return blocks;
}
