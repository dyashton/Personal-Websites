/**
 * Wireframe molecule graphs for the home constellation.
 * Coordinates + chem tags generated offline with RDKit from SMILES
 * (not computed in the browser). Re-run:
 *   uv run --python 3.12 --with rdkit python scripts/rdkit_layout_molecules.py
 */

/** CPK-ish element colors (muted for dark UI) */
export const ELEMENT_COLORS = {
  C: '#a3a3a3',
  N: '#6b8cff',
  O: '#f07178',
  H: '#e5e5e5',
  S: '#e8d44d',
  F: '#7ddea0',
  Cl: '#5fd98a',
  P: '#e09850',
  Br: '#a74f31',
  default: '#a3a3a3',
}

export function elementColor(el) {
  return ELEMENT_COLORS[el] ?? ELEMENT_COLORS.default
}

/**
 * Soft pairwise affinity from offline tags.
 * preferred=true → stronger force + preferred visual line.
 */
export function pairInteraction(tagsA, tagsB) {
  const a = tagsA ?? {}
  const b = tagsB ?? {}
  if ((a.hbondDonor && b.hbondAcceptor) || (a.hbondAcceptor && b.hbondDonor)) {
    return { mult: 2.2, kind: 'hbond', preferred: true, color: '#A78BFA' }
  }
  if (a.aromatic && b.aromatic) {
    return { mult: 1.55, kind: 'stack', preferred: true, color: '#4C8C8A' }
  }
  if (a.polar && b.polar) {
    return { mult: 1.3, kind: 'polar', preferred: true, color: '#A78BFA' }
  }
  if (a.nonpolar && b.nonpolar) {
    return { mult: 1.15, kind: 'attract', preferred: false, color: '#4C8C8A' }
  }
  // polar–nonpolar: weaker association
  return { mult: 0.65, kind: 'attract', preferred: false, color: '#737373' }
}

export const benzene = {
  id: 'benzene',
  name: 'Benzene',
  smiles: 'c1ccccc1',
  // Atom positions + bonds from RDKit Compute2DCoords (offline), scale=30
  viewBox: [-63, -57, 126, 114],
  tags: {
    aromatic: true,
    hbondDonor: false,
    hbondAcceptor: false,
    polar: false,
    nonpolar: true,
    small: false,
  },
  atoms: [
    { x: 45.0, y: -0.0, element: 'C' },
    { x: 22.5, y: 38.97, element: 'C' },
    { x: -22.5, y: 38.97, element: 'C' },
    { x: -45.0, y: -0.0, element: 'C' },
    { x: -22.5, y: -38.97, element: 'C' },
    { x: 22.5, y: -38.97, element: 'C' },
  ],
  bonds: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]],
}

export const pyridine = {
  id: 'pyridine',
  name: 'Pyridine',
  smiles: 'c1ccncc1',
  // Atom positions + bonds from RDKit Compute2DCoords (offline), scale=30
  viewBox: [-63, -57, 126, 114],
  tags: {
    aromatic: true,
    hbondDonor: false,
    hbondAcceptor: true,
    polar: true,
    nonpolar: false,
    small: false,
  },
  atoms: [
    { x: 45.0, y: -0.0, element: 'C' },
    { x: 22.5, y: 38.97, element: 'C' },
    { x: -22.5, y: 38.97, element: 'C' },
    { x: -45.0, y: -0.0, element: 'N' },
    { x: -22.5, y: -38.97, element: 'C' },
    { x: 22.5, y: -38.97, element: 'C' },
  ],
  bonds: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]],
}

export const ethanol = {
  id: 'ethanol',
  name: 'Ethanol',
  smiles: 'CCO',
  // Atom positions + bonds from RDKit Compute2DCoords (offline), scale=30
  viewBox: [-57, -33, 114, 59],
  tags: {
    aromatic: false,
    hbondDonor: true,
    hbondAcceptor: true,
    polar: true,
    nonpolar: false,
    small: true,
  },
  atoms: [
    { x: -38.97, y: 7.5, element: 'C' },
    { x: 0.0, y: -15.0, element: 'C' },
    { x: 38.97, y: 7.5, element: 'O' },
  ],
  bonds: [[0, 1], [1, 2]],
}

export const acetone = {
  id: 'acetone',
  name: 'Acetone',
  smiles: 'CC(=O)C',
  // Atom positions + bonds from RDKit Compute2DCoords (offline), scale=30
  viewBox: [-57, -63, 114, 104],
  tags: {
    aromatic: false,
    hbondDonor: false,
    hbondAcceptor: true,
    polar: true,
    nonpolar: false,
    small: true,
  },
  atoms: [
    { x: -38.97, y: 22.5, element: 'C' },
    { x: 0.0, y: -0.0, element: 'C' },
    { x: 0.0, y: -45.0, element: 'O' },
    { x: 38.97, y: 22.5, element: 'C' },
  ],
  bonds: [[0, 1], [1, 2], [1, 3]],
}

export const aceticAcid = {
  id: 'acetic-acid',
  name: 'Acetic acid',
  smiles: 'CC(=O)O',
  // Atom positions + bonds from RDKit Compute2DCoords (offline), scale=30
  viewBox: [-57, -63, 114, 104],
  tags: {
    aromatic: false,
    hbondDonor: true,
    hbondAcceptor: true,
    polar: true,
    nonpolar: false,
    small: true,
  },
  atoms: [
    { x: -38.97, y: 22.5, element: 'C' },
    { x: 0.0, y: -0.0, element: 'C' },
    { x: 0.0, y: -45.0, element: 'O' },
    { x: 38.97, y: 22.5, element: 'O' },
  ],
  bonds: [[0, 1], [1, 2], [1, 3]],
}

export const water = {
  id: 'water',
  name: 'Water',
  smiles: 'O',
  // Atom positions + bonds from RDKit Compute2DCoords (offline), scale=30
  viewBox: [-57, -26, 114, 59],
  tags: {
    aromatic: false,
    hbondDonor: true,
    hbondAcceptor: true,
    polar: true,
    nonpolar: false,
    small: true,
  },
  atoms: [
    { x: -0.0, y: 15.0, element: 'O' },
    { x: 38.97, y: -7.5, element: 'H' },
    { x: -38.97, y: -7.5, element: 'H' },
  ],
  bonds: [[0, 1], [0, 2]],
}

export const carbonDioxide = {
  id: 'co2',
  name: 'Carbon dioxide',
  smiles: 'O=C=O',
  // Atom positions + bonds from RDKit Compute2DCoords (offline), scale=30
  viewBox: [-63, -18, 126, 36],
  tags: {
    aromatic: false,
    hbondDonor: false,
    hbondAcceptor: true,
    polar: true,
    nonpolar: false,
    small: true,
  },
  atoms: [
    { x: 45.0, y: -0.0, element: 'O' },
    { x: 0.0, y: 0.0, element: 'C' },
    { x: -45.0, y: -0.0, element: 'O' },
  ],
  bonds: [[0, 1], [1, 2]],
}

export const hydrogenSulfide = {
  id: 'h2s',
  name: 'Hydrogen sulfide',
  smiles: 'S',
  // Atom positions + bonds from RDKit Compute2DCoords (offline), scale=30
  viewBox: [-57, -26, 114, 59],
  tags: {
    aromatic: false,
    hbondDonor: true,
    hbondAcceptor: false,
    polar: true,
    nonpolar: false,
    small: true,
  },
  atoms: [
    { x: -0.0, y: 15.0, element: 'S' },
    { x: 38.97, y: -7.5, element: 'H' },
    { x: -38.97, y: -7.5, element: 'H' },
  ],
  bonds: [[0, 1], [0, 2]],
}

export const methane = {
  id: 'methane',
  name: 'Methane',
  smiles: 'C',
  // Atom positions + bonds from RDKit Compute2DCoords (offline), scale=30
  viewBox: [-63, -63, 126, 126],
  tags: {
    aromatic: false,
    hbondDonor: false,
    hbondAcceptor: false,
    polar: false,
    nonpolar: true,
    small: true,
  },
  atoms: [
    { x: 0.0, y: 0.0, element: 'C' },
    { x: 45.0, y: 0.0, element: 'H' },
    { x: -45.0, y: -0.0, element: 'H' },
    { x: 0.0, y: -45.0, element: 'H' },
    { x: -0.0, y: 45.0, element: 'H' },
  ],
  bonds: [[0, 1], [0, 2], [0, 3], [0, 4]],
}

export const ammonia = {
  id: 'ammonia',
  name: 'Ammonia',
  smiles: 'N',
  // Atom positions + bonds from RDKit Compute2DCoords (offline), scale=30
  viewBox: [-57, -41, 114, 104],
  tags: {
    aromatic: false,
    hbondDonor: true,
    hbondAcceptor: true,
    polar: true,
    nonpolar: false,
    small: true,
  },
  atoms: [
    { x: -0.0, y: -0.0, element: 'N' },
    { x: 38.97, y: -22.5, element: 'H' },
    { x: -38.97, y: -22.5, element: 'H' },
    { x: -0.0, y: 45.0, element: 'H' },
  ],
  bonds: [[0, 1], [0, 2], [0, 3]],
}

export const phosphine = {
  id: 'phosphine',
  name: 'Phosphine',
  smiles: 'P',
  // Atom positions + bonds from RDKit Compute2DCoords (offline), scale=30
  viewBox: [-57, -41, 114, 104],
  tags: {
    aromatic: false,
    hbondDonor: true,
    hbondAcceptor: false,
    polar: true,
    nonpolar: false,
    small: true,
  },
  atoms: [
    { x: -0.0, y: -0.0, element: 'P' },
    { x: 38.97, y: -22.5, element: 'H' },
    { x: -38.97, y: -22.5, element: 'H' },
    { x: -0.0, y: 45.0, element: 'H' },
  ],
  bonds: [[0, 1], [0, 2], [0, 3]],
}

export const fluoromethane = {
  id: 'fluoromethane',
  name: 'Fluoromethane',
  smiles: 'CF',
  // Atom positions + bonds from RDKit Compute2DCoords (offline), scale=30
  viewBox: [-63, -63, 126, 126],
  tags: {
    aromatic: false,
    hbondDonor: false,
    hbondAcceptor: false,
    polar: true,
    nonpolar: false,
    small: true,
  },
  atoms: [
    { x: 0.0, y: 0.0, element: 'C' },
    { x: 45.0, y: 0.0, element: 'F' },
    { x: -45.0, y: -0.0, element: 'H' },
    { x: 0.0, y: -45.0, element: 'H' },
    { x: -0.0, y: 45.0, element: 'H' },
  ],
  bonds: [[0, 1], [0, 2], [0, 3], [0, 4]],
}

export const chloromethane = {
  id: 'chloromethane',
  name: 'Chloromethane',
  smiles: 'CCl',
  // Atom positions + bonds from RDKit Compute2DCoords (offline), scale=30
  viewBox: [-63, -63, 126, 126],
  tags: {
    aromatic: false,
    hbondDonor: false,
    hbondAcceptor: false,
    polar: true,
    nonpolar: false,
    small: true,
  },
  atoms: [
    { x: 0.0, y: 0.0, element: 'C' },
    { x: 45.0, y: 0.0, element: 'Cl' },
    { x: -45.0, y: -0.0, element: 'H' },
    { x: 0.0, y: -45.0, element: 'H' },
    { x: -0.0, y: 45.0, element: 'H' },
  ],
  bonds: [[0, 1], [0, 2], [0, 3], [0, 4]],
}

export const thiophene = {
  id: 'thiophene',
  name: 'Thiophene',
  smiles: 'c1ccsc1',
  // Atom positions + bonds from RDKit Compute2DCoords (offline), scale=30
  viewBox: [-49, -55, 106, 109],
  tags: {
    aromatic: true,
    hbondDonor: false,
    hbondAcceptor: true,
    polar: true,
    nonpolar: false,
    small: true,
  },
  atoms: [
    { x: 38.28, y: 0.0, element: 'C' },
    { x: 11.83, y: -36.41, element: 'C' },
    { x: -30.97, y: -22.5, element: 'C' },
    { x: -30.97, y: 22.5, element: 'S' },
    { x: 11.83, y: 36.41, element: 'C' },
  ],
  bonds: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]],
}

export const furan = {
  id: 'furan',
  name: 'Furan',
  smiles: 'c1ccoc1',
  // Atom positions + bonds from RDKit Compute2DCoords (offline), scale=30
  viewBox: [-49, -55, 106, 109],
  tags: {
    aromatic: true,
    hbondDonor: false,
    hbondAcceptor: true,
    polar: true,
    nonpolar: false,
    small: true,
  },
  atoms: [
    { x: 38.28, y: 0.0, element: 'C' },
    { x: 11.83, y: -36.41, element: 'C' },
    { x: -30.97, y: -22.5, element: 'C' },
    { x: -30.97, y: 22.5, element: 'O' },
    { x: 11.83, y: 36.41, element: 'C' },
  ],
  bonds: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]],
}

export const imidazole = {
  id: 'imidazole',
  name: 'Imidazole',
  smiles: 'c1c[nH]cn1',
  // Atom positions + bonds from RDKit Compute2DCoords (offline), scale=30
  viewBox: [-49, -55, 106, 109],
  tags: {
    aromatic: true,
    hbondDonor: true,
    hbondAcceptor: true,
    polar: true,
    nonpolar: false,
    small: true,
  },
  atoms: [
    { x: 38.28, y: 0.0, element: 'C' },
    { x: 11.83, y: -36.41, element: 'C' },
    { x: -30.97, y: -22.5, element: 'N' },
    { x: -30.97, y: 22.5, element: 'C' },
    { x: 11.83, y: 36.41, element: 'N' },
  ],
  bonds: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]],
}

export const phenol = {
  id: 'phenol',
  name: 'Phenol',
  smiles: 'Oc1ccccc1',
  // Atom positions + bonds from RDKit Compute2DCoords (offline), scale=30
  viewBox: [-76, -57, 171, 114],
  tags: {
    aromatic: true,
    hbondDonor: true,
    hbondAcceptor: true,
    polar: true,
    nonpolar: false,
    small: false,
  },
  atoms: [
    { x: 77.14, y: -0.0, element: 'O' },
    { x: 32.14, y: 0.0, element: 'C' },
    { x: 9.64, y: 38.97, element: 'C' },
    { x: -35.36, y: 38.97, element: 'C' },
    { x: -57.86, y: -0.0, element: 'C' },
    { x: -35.36, y: -38.97, element: 'C' },
    { x: 9.64, y: -38.97, element: 'C' },
  ],
  bonds: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 1]],
}

export const toluene = {
  id: 'toluene',
  name: 'Toluene',
  smiles: 'Cc1ccccc1',
  // Atom positions + bonds from RDKit Compute2DCoords (offline), scale=30
  viewBox: [-76, -57, 171, 114],
  tags: {
    aromatic: true,
    hbondDonor: false,
    hbondAcceptor: false,
    polar: false,
    nonpolar: true,
    small: false,
  },
  atoms: [
    { x: 77.14, y: -0.0, element: 'C' },
    { x: 32.14, y: 0.0, element: 'C' },
    { x: 9.64, y: 38.97, element: 'C' },
    { x: -35.36, y: 38.97, element: 'C' },
    { x: -57.86, y: -0.0, element: 'C' },
    { x: -35.36, y: -38.97, element: 'C' },
    { x: 9.64, y: -38.97, element: 'C' },
  ],
  bonds: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 1]],
}

export const nitrobenzene = {
  id: 'nitrobenzene',
  name: 'Nitrobenzene',
  smiles: 'O=[N+]([O-])c1ccccc1',
  // Atom positions + bonds from RDKit Compute2DCoords (offline), scale=30
  viewBox: [-98, -57, 194, 114],
  tags: {
    aromatic: true,
    hbondDonor: false,
    hbondAcceptor: true,
    polar: true,
    nonpolar: false,
    small: false,
  },
  atoms: [
    { x: 77.5, y: -38.97, element: 'O' },
    { x: 55.0, y: -0.0, element: 'N' },
    { x: 77.5, y: 38.97, element: 'O' },
    { x: 10.0, y: 0.0, element: 'C' },
    { x: -12.5, y: 38.97, element: 'C' },
    { x: -57.5, y: 38.97, element: 'C' },
    { x: -80.0, y: -0.0, element: 'C' },
    { x: -57.5, y: -38.97, element: 'C' },
    { x: -12.5, y: -38.97, element: 'C' },
  ],
  bonds: [[0, 1], [1, 2], [1, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 3]],
}

export const naphthalene = {
  id: 'naphthalene',
  name: 'Naphthalene',
  smiles: 'c1ccc2ccccc2c1',
  // Atom positions + bonds from RDKit Compute2DCoords (offline), scale=30
  viewBox: [-96, -63, 192, 126],
  tags: {
    aromatic: true,
    hbondDonor: false,
    hbondAcceptor: false,
    polar: false,
    nonpolar: true,
    small: false,
  },
  atoms: [
    { x: -77.94, y: 22.5, element: 'C' },
    { x: -77.94, y: -22.5, element: 'C' },
    { x: -38.97, y: -45.0, element: 'C' },
    { x: 0.0, y: -22.5, element: 'C' },
    { x: 38.97, y: -45.0, element: 'C' },
    { x: 77.94, y: -22.5, element: 'C' },
    { x: 77.94, y: 22.5, element: 'C' },
    { x: 38.97, y: 45.0, element: 'C' },
    { x: -0.0, y: 22.5, element: 'C' },
    { x: -38.97, y: 45.0, element: 'C' },
  ],
  bonds: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 0], [8, 3]],
}

export const indole = {
  id: 'indole',
  name: 'Indole',
  smiles: 'c1ccc2[nH]ccc2c1',
  // Atom positions + bonds from RDKit Compute2DCoords (offline), scale=30
  viewBox: [-88, -63, 184, 126],
  tags: {
    aromatic: true,
    hbondDonor: true,
    hbondAcceptor: false,
    polar: true,
    nonpolar: false,
    small: false,
  },
  atoms: [
    { x: -69.17, y: 22.5, element: 'C' },
    { x: -69.17, y: -22.5, element: 'C' },
    { x: -30.2, y: -45.0, element: 'C' },
    { x: 8.78, y: -22.5, element: 'C' },
    { x: 51.57, y: -36.41, element: 'N' },
    { x: 78.02, y: -0.0, element: 'C' },
    { x: 51.57, y: 36.41, element: 'C' },
    { x: 8.78, y: 22.5, element: 'C' },
    { x: -30.2, y: 45.0, element: 'C' },
  ],
  bonds: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 0], [7, 3]],
}

export const quinoline = {
  id: 'quinoline',
  name: 'Quinoline',
  smiles: 'c1ccc2ncccc2c1',
  // Atom positions + bonds from RDKit Compute2DCoords (offline), scale=30
  viewBox: [-96, -63, 192, 126],
  tags: {
    aromatic: true,
    hbondDonor: false,
    hbondAcceptor: true,
    polar: true,
    nonpolar: false,
    small: false,
  },
  atoms: [
    { x: -77.94, y: 22.5, element: 'C' },
    { x: -77.94, y: -22.5, element: 'C' },
    { x: -38.97, y: -45.0, element: 'C' },
    { x: 0.0, y: -22.5, element: 'C' },
    { x: 38.97, y: -45.0, element: 'N' },
    { x: 77.94, y: -22.5, element: 'C' },
    { x: 77.94, y: 22.5, element: 'C' },
    { x: 38.97, y: 45.0, element: 'C' },
    { x: -0.0, y: 22.5, element: 'C' },
    { x: -38.97, y: 45.0, element: 'C' },
  ],
  bonds: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 0], [8, 3]],
}

export const caffeine = {
  id: 'caffeine',
  name: 'Caffeine',
  smiles: 'CN1C=NC2=C1C(=O)N(C(=O)N2C)C',
  // Atom positions + bonds from RDKit Compute2DCoords (offline), scale=30
  viewBox: [-123, -103, 243, 205],
  tags: {
    aromatic: true,
    hbondDonor: false,
    hbondAcceptor: true,
    polar: true,
    nonpolar: false,
    small: false,
  },
  atoms: [
    { x: 101.37, y: 40.3, element: 'C' },
    { x: 73.22, y: 5.19, element: 'N' },
    { x: 85.09, y: -38.22, element: 'C' },
    { x: 47.48, y: -62.92, element: 'N' },
    { x: 12.36, y: -34.78, element: 'C' },
    { x: 28.28, y: 7.32, element: 'C' },
    { x: -0.22, y: 42.14, element: 'C' },
    { x: 15.69, y: 84.24, element: 'O' },
    { x: -44.63, y: 34.88, element: 'N' },
    { x: -60.54, y: -7.21, element: 'C' },
    { x: -104.95, y: -14.48, element: 'O' },
    { x: -32.05, y: -42.04, element: 'N' },
    { x: -47.96, y: -84.13, element: 'C' },
    { x: -73.13, y: 69.71, element: 'C' },
  ],
  bonds: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [6, 8], [8, 9], [9, 10], [9, 11], [11, 12], [8, 13], [5, 1], [11, 4]],
}

export const aspirin = {
  id: 'aspirin',
  name: 'Aspirin',
  smiles: 'CC(=O)Oc1ccccc1C(=O)O',
  // Atom positions + bonds from RDKit Compute2DCoords (offline), scale=30
  viewBox: [-133, -100, 241, 199],
  tags: {
    aromatic: true,
    hbondDonor: true,
    hbondAcceptor: true,
    polar: true,
    nonpolar: false,
    small: false,
  },
  atoms: [
    { x: -114.37, y: 38.6, element: 'C' },
    { x: -80.96, y: 8.46, element: 'C' },
    { x: -90.37, y: -35.55, element: 'O' },
    { x: -38.15, y: 22.31, element: 'O' },
    { x: -4.74, y: -7.84, element: 'C' },
    { x: -14.15, y: -51.84, element: 'C' },
    { x: 19.26, y: -81.99, element: 'C' },
    { x: 62.07, y: -68.13, element: 'C' },
    { x: 71.48, y: -24.13, element: 'C' },
    { x: 38.07, y: 6.02, element: 'C' },
    { x: 47.48, y: 50.03, element: 'C' },
    { x: 90.29, y: 63.88, element: 'O' },
    { x: 14.07, y: 80.18, element: 'O' },
  ],
  bonds: [[0, 1], [1, 2], [1, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11], [10, 12], [9, 4]],
}

export const nicotine = {
  id: 'nicotine',
  name: 'Nicotine',
  smiles: 'CN1CCC[C@H]1c2cccnc2',
  // Atom positions + bonds from RDKit Compute2DCoords (offline), scale=30
  viewBox: [-117, -88, 242, 153],
  tags: {
    aromatic: true,
    hbondDonor: false,
    hbondAcceptor: true,
    polar: true,
    nonpolar: false,
    small: false,
  },
  atoms: [
    { x: -46.07, y: -69.23, element: 'C' },
    { x: -56.61, y: -25.48, element: 'N' },
    { x: -98.19, y: -8.29, element: 'C' },
    { x: -94.7, y: 36.58, element: 'C' },
    { x: -50.95, y: 47.11, element: 'C' },
    { x: -27.41, y: 8.76, element: 'C' },
    { x: 17.46, y: 5.26, element: 'C' },
    { x: 42.92, y: 42.36, element: 'C' },
    { x: 87.78, y: 38.86, element: 'C' },
    { x: 107.18, y: -1.74, element: 'C' },
    { x: 81.72, y: -38.84, element: 'N' },
    { x: 36.86, y: -35.34, element: 'C' },
  ],
  bonds: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11], [5, 1], [11, 6]],
}

export const adenine = {
  id: 'adenine',
  name: 'Adenine',
  smiles: 'Nc1ncnc2[nH]cnc12',
  // Atom positions + bonds from RDKit Compute2DCoords (offline), scale=30
  viewBox: [-99, -89, 184, 166],
  tags: {
    aromatic: true,
    hbondDonor: true,
    hbondAcceptor: true,
    polar: true,
    nonpolar: false,
    small: false,
  },
  atoms: [
    { x: 48.59, y: -70.27, element: 'N' },
    { x: 36.1, y: -27.04, element: 'C' },
    { x: 67.29, y: 5.39, element: 'N' },
    { x: 54.8, y: 48.62, element: 'C' },
    { x: 11.12, y: 59.42, element: 'N' },
    { x: -20.08, y: 26.99, element: 'C' },
    { x: -65.05, y: 28.47, element: 'N' },
    { x: -80.36, y: -13.85, element: 'C' },
    { x: -44.84, y: -41.48, element: 'N' },
    { x: -7.58, y: -16.24, element: 'C' },
  ],
  bonds: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 1], [9, 5]],
}

/** Catalog — RDKit-laid-out wireframes (simple + complex) */
export const molecules = [
  benzene,
  pyridine,
  ethanol,
  acetone,
  aceticAcid,
  water,
  carbonDioxide,
  hydrogenSulfide,
  methane,
  ammonia,
  phosphine,
  fluoromethane,
  chloromethane,
  thiophene,
  furan,
  imidazole,
  phenol,
  toluene,
  nitrobenzene,
  naphthalene,
  indole,
  quinoline,
  caffeine,
  aspirin,
  nicotine,
  adenine,
]

/**
 * Mixed simple + complex molecules.
 * ponytail: O(n²) collision stays cheap on mobile (~16 bodies).
 */
export const constellationSpawns = [
  { moleculeId: 'benzene', x: 0.06, y: 0.18, scale: 0.85, vx: 18 },
  { moleculeId: 'caffeine', x: 0.22, y: 0.55, scale: 0.55, vx: 12 },
  { moleculeId: 'naphthalene', x: 0.40, y: 0.20, scale: 0.62, vx: 16 },
  { moleculeId: 'imidazole', x: 0.55, y: 0.70, scale: 0.8, vx: 20 },
  { moleculeId: 'aspirin', x: 0.70, y: 0.28, scale: 0.52, vx: 14 },
  { moleculeId: 'thiophene', x: 0.85, y: 0.58, scale: 0.8, vx: 17 },
  { moleculeId: 'acetone', x: 0.14, y: 0.78, scale: 0.7, vx: 24 },
  { moleculeId: 'indole', x: 0.48, y: 0.42, scale: 0.58, vx: 15 },
  { moleculeId: 'quinoline', x: 0.78, y: 0.82, scale: 0.55, vx: 13 },
  { moleculeId: 'water', x: 0.90, y: 0.18, scale: 0.65, vx: 26 },
  { moleculeId: 'nicotine', x: 0.32, y: 0.12, scale: 0.5, vx: 11 },
  { moleculeId: 'phenol', x: 0.58, y: 0.10, scale: 0.7, vx: 19 },
  { moleculeId: 'adenine', x: 0.92, y: 0.42, scale: 0.5, vx: 12 },
  { moleculeId: 'toluene', x: 0.10, y: 0.42, scale: 0.7, vx: 15 },
  { moleculeId: 'nitrobenzene', x: 0.28, y: 0.85, scale: 0.58, vx: 16 },
  { moleculeId: 'furan', x: 0.65, y: 0.55, scale: 0.75, vx: 18 },
]
