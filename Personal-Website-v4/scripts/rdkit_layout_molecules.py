#!/usr/bin/env python3
"""
Offline RDKit layout + interaction tags for home constellation molecules.
Regenerates src/data/molecules.js atom/bond coordinates and chem tags from SMILES.

  uv run --python 3.12 --with rdkit python scripts/rdkit_layout_molecules.py
"""

from __future__ import annotations

import math
import re
from pathlib import Path

from rdkit import Chem
from rdkit.Chem import AllChem, Lipinski

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "src" / "data" / "molecules.js"

SCALE = 30
PAD = 18

# (exportName, displayName, id, smiles, addExplicitHs)
ENTRIES = [
    # simple
    ("benzene", "Benzene", "benzene", "c1ccccc1", False),
    ("pyridine", "Pyridine", "pyridine", "c1ccncc1", False),
    ("ethanol", "Ethanol", "ethanol", "CCO", False),
    ("acetone", "Acetone", "acetone", "CC(=O)C", False),
    ("aceticAcid", "Acetic acid", "acetic-acid", "CC(=O)O", False),
    ("water", "Water", "water", "O", True),
    ("carbonDioxide", "Carbon dioxide", "co2", "O=C=O", False),
    ("hydrogenSulfide", "Hydrogen sulfide", "h2s", "S", True),
    ("methane", "Methane", "methane", "C", True),
    ("ammonia", "Ammonia", "ammonia", "N", True),
    ("phosphine", "Phosphine", "phosphine", "P", True),
    ("fluoromethane", "Fluoromethane", "fluoromethane", "CF", True),
    ("chloromethane", "Chloromethane", "chloromethane", "CCl", True),
    ("thiophene", "Thiophene", "thiophene", "c1ccsc1", False),
    ("furan", "Furan", "furan", "c1ccoc1", False),
    ("imidazole", "Imidazole", "imidazole", "c1c[nH]cn1", False),
    # more complex (RDKit-laid-out)
    ("phenol", "Phenol", "phenol", "Oc1ccccc1", False),
    ("toluene", "Toluene", "toluene", "Cc1ccccc1", False),
    ("nitrobenzene", "Nitrobenzene", "nitrobenzene", "O=[N+]([O-])c1ccccc1", False),
    ("naphthalene", "Naphthalene", "naphthalene", "c1ccc2ccccc2c1", False),
    ("indole", "Indole", "indole", "c1ccc2[nH]ccc2c1", False),
    ("quinoline", "Quinoline", "quinoline", "c1ccc2ncccc2c1", False),
    ("caffeine", "Caffeine", "caffeine", "CN1C=NC2=C1C(=O)N(C(=O)N2C)C", False),
    ("aspirin", "Aspirin", "aspirin", "CC(=O)Oc1ccccc1C(=O)O", False),
    ("nicotine", "Nicotine", "nicotine", "CN1CCC[C@H]1c2cccnc2", False),
    ("adenine", "Adenine", "adenine", "Nc1ncnc2[nH]cnc12", False),
]

SPAWNS = """export const constellationSpawns = [
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
"""


def chem_tags(smi: str) -> dict:
    """Coarse interaction tags for soft physics + preferred-pair visuals."""
    mol = Chem.MolFromSmiles(smi)
    if mol is None:
        raise ValueError(f"Invalid SMILES: {smi}")
    Chem.SanitizeMol(mol)
    heavy = mol.GetNumHeavyAtoms()
    aromatic = any(a.GetIsAromatic() for a in mol.GetAtoms())

    # SMARTS + Lipinski; explicit overrides for tiny hydrides
    donor_q = Chem.MolFromSmarts("[#7!H0,#8!H0,#16!H0]")
    acceptor_q = Chem.MolFromSmarts(
        "[$([O,S;H1;v2]-[!$(*=[O,N,P,S])]),$([O,S;H0;v2]),$([O,S;-]),$([N;v3;!$(N-*=!@[O,N,P,S])]),"
        "n&H0&+0,$([o,s;+0])]"
    )
    donor = Lipinski.NumHDonors(mol) > 0
    acceptor = Lipinski.NumHAcceptors(mol) > 0
    if donor_q is not None:
        donor = donor or mol.HasSubstructMatch(donor_q)
    if acceptor_q is not None:
        acceptor = acceptor or mol.HasSubstructMatch(acceptor_q)

    # Explicit tiny cases
    if smi in {"O", "N", "S"}:
        donor = True
        acceptor = smi in {"O", "N"}
    if smi == "P":
        donor = True
        acceptor = False

    polar = donor or acceptor or any(
        a.GetSymbol() in {"F", "Cl", "Br", "S", "P", "O", "N"} for a in mol.GetAtoms()
    )
    # Pure hydrocarbons / unsubstituted aromatics
    nonpolar = (not donor and not acceptor) and not any(
        a.GetSymbol() in {"O", "N", "F", "Cl", "Br", "S", "P"} for a in mol.GetAtoms()
    )
    if smi in {"C", "c1ccccc1", "Cc1ccccc1", "c1ccc2ccccc2c1"}:
        nonpolar = True
        polar = False
        donor = False
        acceptor = False

    return {
        "aromatic": aromatic,
        "hbondDonor": bool(donor),
        "hbondAcceptor": bool(acceptor),
        "polar": bool(polar) and not nonpolar,
        "nonpolar": bool(nonpolar),
        "small": heavy <= 5,
    }


def layout(smi: str, add_hs: bool):
    mol = Chem.MolFromSmiles(smi)
    if mol is None:
        raise ValueError(f"Invalid SMILES: {smi}")
    if add_hs:
        mol = Chem.AddHs(mol)
    AllChem.Compute2DCoords(mol)
    conf = mol.GetConformer()
    atoms = []
    for i, a in enumerate(mol.GetAtoms()):
        p = conf.GetAtomPosition(i)
        atoms.append(
            {
                "x": round(p.x * SCALE, 2),
                "y": round(-p.y * SCALE, 2),
                "element": a.GetSymbol(),
            }
        )
    cx = sum(a["x"] for a in atoms) / len(atoms)
    cy = sum(a["y"] for a in atoms) / len(atoms)
    for a in atoms:
        a["x"] = round(a["x"] - cx, 2)
        a["y"] = round(a["y"] - cy, 2)
    bonds = [[b.GetBeginAtomIdx(), b.GetEndAtomIdx()] for b in mol.GetBonds()]
    xs = [a["x"] for a in atoms]
    ys = [a["y"] for a in atoms]
    minx, maxx = min(xs), max(xs)
    miny, maxy = min(ys), max(ys)
    view_box = [
        math.floor(minx - PAD),
        math.floor(miny - PAD),
        math.ceil((maxx + PAD) - (minx - PAD)),
        math.ceil((maxy + PAD) - (miny - PAD)),
    ]
    return atoms, bonds, view_box


def fmt_tags(tags: dict) -> str:
    parts = [f"    {k}: {'true' if v else 'false'}," for k, v in tags.items()]
    return "\n".join(parts)


def main() -> None:
    blocks = []
    for export_name, name, mid, smi, add_hs in ENTRIES:
        atoms, bonds, vb = layout(smi, add_hs)
        tags = chem_tags(smi)
        atom_lines = "\n".join(
            f"    {{ x: {a['x']}, y: {a['y']}, element: '{a['element']}' }},"
            for a in atoms
        )
        bond_str = ", ".join(f"[{a}, {b}]" for a, b in bonds)
        blocks.append(
            f"""export const {export_name} = {{
  id: '{mid}',
  name: '{name}',
  smiles: '{smi}',
  // Atom positions + bonds from RDKit Compute2DCoords (offline), scale={SCALE}
  viewBox: [{vb[0]}, {vb[1]}, {vb[2]}, {vb[3]}],
  tags: {{
{fmt_tags(tags)}
  }},
  atoms: [
{atom_lines}
  ],
  bonds: [{bond_str}],
}}"""
        )
        print(
            f"  {mid:14} tags="
            f"{''.join(k[0].upper() for k, v in tags.items() if v) or '-'}"
        )

    exports = ",\n  ".join(e[0] for e in ENTRIES)
    header = f"""/**
 * Wireframe molecule graphs for the home constellation.
 * Coordinates + chem tags generated offline with RDKit from SMILES
 * (not computed in the browser). Re-run:
 *   uv run --python 3.12 --with rdkit python scripts/rdkit_layout_molecules.py
 */

/** CPK-ish element colors (muted for dark UI) */
export const ELEMENT_COLORS = {{
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
}}

export function elementColor(el) {{
  return ELEMENT_COLORS[el] ?? ELEMENT_COLORS.default
}}

/**
 * Soft pairwise affinity from offline tags.
 * preferred=true → stronger force + preferred visual line.
 */
export function pairInteraction(tagsA, tagsB) {{
  const a = tagsA ?? {{}}
  const b = tagsB ?? {{}}
  if ((a.hbondDonor && b.hbondAcceptor) || (a.hbondAcceptor && b.hbondDonor)) {{
    return {{ mult: 2.2, kind: 'hbond', preferred: true, color: '#A78BFA' }}
  }}
  if (a.aromatic && b.aromatic) {{
    return {{ mult: 1.55, kind: 'stack', preferred: true, color: '#4C8C8A' }}
  }}
  if (a.polar && b.polar) {{
    return {{ mult: 1.3, kind: 'polar', preferred: true, color: '#A78BFA' }}
  }}
  if (a.nonpolar && b.nonpolar) {{
    return {{ mult: 1.15, kind: 'attract', preferred: false, color: '#4C8C8A' }}
  }}
  // polar–nonpolar: weaker association
  return {{ mult: 0.65, kind: 'attract', preferred: false, color: '#737373' }}
}}

"""
    footer = f"""
/** Catalog — RDKit-laid-out wireframes (simple + complex) */
export const molecules = [
  {exports},
]

/**
 * Mixed simple + complex molecules.
 * ponytail: O(n²) collision stays cheap on mobile (~16 bodies).
 */
{SPAWNS}"""
    OUT.write_text(header + "\n\n".join(blocks) + "\n" + footer)
    print(f"Wrote {OUT} ({len(ENTRIES)} molecules)")

    ids = {e[2] for e in ENTRIES}
    for mid in re.findall(r"moleculeId: '([^']+)'", SPAWNS):
        if mid not in ids:
            raise SystemExit(f"Spawn references unknown id: {mid}")
    print("Spawn IDs OK")


if __name__ == "__main__":
    main()
