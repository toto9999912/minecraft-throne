// Throne voxel data: defines the 3D structure of the throne
// Each entry: [x, y, z, blockType]
// blockType: 'base' | 'pillar' | 'seat' | 'armrest' | 'backrest' | 'accent' | 'cushion' | 'dark'
//
// Dimensions: 4 wide (x: -1..2) x 5 deep (z: -2..2) x 5 tall (y: 0..4)

export function getThroneBlocks() {
  const blocks = [];

  // ─── y=0: Base platform (4 x 5) ───
  for (let x = -1; x <= 2; x++) {
    for (let z = -2; z <= 2; z++) {
      blocks.push([x, 0, z, 'base']);
    }
  }

  // ─── y=1: Seat platform + armrest/backrest start ───
  // Seat surface (inner 2 x 3)
  for (let x = 0; x <= 1; x++) {
    for (let z = -1; z <= 1; z++) {
      blocks.push([x, 1, z, 'seat']);
    }
  }
  // Left armrest column
  blocks.push([-1, 1, -1, 'armrest']);
  blocks.push([-1, 1, 0, 'armrest']);
  blocks.push([-1, 1, 1, 'armrest']);
  // Right armrest column
  blocks.push([2, 1, -1, 'armrest']);
  blocks.push([2, 1, 0, 'armrest']);
  blocks.push([2, 1, 1, 'armrest']);
  // Backrest row (full width at z=-2)
  for (let x = -1; x <= 2; x++) {
    blocks.push([x, 1, -2, 'pillar']);
  }

  // ─── y=2: Cushion + armrest + backrest ───
  // Cushion on seat
  blocks.push([0, 2, 0, 'cushion']);
  blocks.push([1, 2, 0, 'cushion']);
  blocks.push([0, 2, 1, 'cushion']);
  blocks.push([1, 2, 1, 'cushion']);
  // Left armrest top
  blocks.push([-1, 2, -1, 'accent']);
  blocks.push([-1, 2, 0, 'accent']);
  blocks.push([-1, 2, 1, 'accent']);
  // Right armrest top
  blocks.push([2, 2, -1, 'accent']);
  blocks.push([2, 2, 0, 'accent']);
  blocks.push([2, 2, 1, 'accent']);
  // Backrest row
  for (let x = -1; x <= 2; x++) {
    blocks.push([x, 2, -2, 'backrest']);
  }

  // ─── y=3: Backrest continues ───
  for (let x = -1; x <= 2; x++) {
    blocks.push([x, 3, -2, 'backrest']);
  }

  // ─── y=4: Backrest crown ───
  // Side accent peaks
  blocks.push([-1, 4, -2, 'accent']);
  blocks.push([2, 4, -2, 'accent']);
  // Center dark fill
  blocks.push([0, 4, -2, 'dark']);
  blocks.push([1, 4, -2, 'dark']);

  return blocks;
}
