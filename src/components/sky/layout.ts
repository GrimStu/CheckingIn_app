import { taxonomy, TaxonomyWord } from '../../data/taxonomy';

export interface SkyPoint {
  word: TaxonomyWord;
  x: number;
  y: number;
}

// Minimum center-to-center spacing between tap targets, and the diameter
// each target is rendered at. Circular targets at this spacing can never
// overlap (unlike axis-aligned boxes, where meeting the same Euclidean
// distance diagonally can still overlap).
export const MIN_TAP = 44;

// Logical span the -1..1 valence/arousal domain is seeded into, before
// collision relaxation spreads tightly-clustered words apart. The final
// canvas grows from this to whatever the relaxed layout needs.
const SEED_SPAN = 900;
const RELAX_ITERATIONS = 400;

function seedPosition(word: TaxonomyWord): { x: number; y: number } {
  return {
    x: ((word.valence + 1) / 2) * SEED_SPAN,
    y: ((1 - word.arousal) / 2) * SEED_SPAN,
  };
}

// Pairwise separation: repeatedly push any pair closer than MIN_TAP apart
// along the vector between them, split evenly. Points are never pulled
// together, only pushed apart, so each word's position relative to its
// neighbours is preserved as far as the minimum spacing allows.
function resolveCollisions(points: SkyPoint[]): void {
  for (let iter = 0; iter < RELAX_ITERATIONS; iter++) {
    let moved = false;
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        let dx = points[j].x - points[i].x;
        let dy = points[j].y - points[i].y;
        let dist = Math.hypot(dx, dy);
        if (dist < 1e-6) {
          // Identical seed coordinates: nudge apart deterministically
          // rather than dividing by zero or dropping either word.
          const angle = ((i * 928371 + j * 176519) % 360) * (Math.PI / 180);
          dx = Math.cos(angle);
          dy = Math.sin(angle);
          dist = 1;
        }
        if (dist < MIN_TAP) {
          moved = true;
          const overlap = (MIN_TAP - dist) / 2;
          const nx = dx / dist;
          const ny = dy / dist;
          points[i].x -= nx * overlap;
          points[i].y -= ny * overlap;
          points[j].x += nx * overlap;
          points[j].y += ny * overlap;
        }
      }
    }
    if (!moved) break;
  }
}

function buildSky(): { points: SkyPoint[]; width: number; height: number } {
  const points: SkyPoint[] = taxonomy.map((word) => ({ word, ...seedPosition(word) }));
  resolveCollisions(points);

  const pad = MIN_TAP;
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs) - pad;
  const minY = Math.min(...ys) - pad;
  const maxX = Math.max(...xs) + pad;
  const maxY = Math.max(...ys) + pad;

  for (const p of points) {
    p.x -= minX;
    p.y -= minY;
  }

  return { points, width: maxX - minX, height: maxY - minY };
}

// Computed once: taxonomy is static, so its resolved layout is too.
export const sky = buildSky();
