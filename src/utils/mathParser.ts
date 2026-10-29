/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ModelType =
  | 'surface_3d'
  | 'quadric_sphere'
  | 'quadric_cylinder'
  | 'quadric_cone'
  | 'quadric_torus'
  | 'quadric_ellipsoid'
  | 'quadric_hyperboloid'
  | 'frustum_cone'
  | 'capsule_cylinder_spheres'
  | 'composite_toy'
  | 'composite_tent'
  | 'cube_hemisphere_depression'
  | 'stepped_pole'
  | 'pyramid_square'
  | 'triangular_prism'
  | 'conic_circle'
  | 'conic_parabola'
  | 'conic_ellipse'
  | 'conic_hyperbola'
  | 'polygon_square'
  | 'polygon_rectangle'
  | 'polygon_rhombus'
  | 'polygon_parallelogram'
  | 'polygon_trapezoid'
  | 'polygon_triangle'
  | 'inscribed_composite'
  | 'plane_3d';

export interface Key3DPoint {
  label: string;
  x: number;
  y: number;
  z: number;
  description: string;
  color?: string;
}

export interface MathProperty {
  label: string;
  value: string;
  detail?: string;
}

export interface QuestionChallenge {
  problemText: string;
  givenData: { label: string; value: string }[];
  toFind: string;
  difficulty: 'Standard' | 'Board Exam' | 'HOTS' | 'Exhibition Challenge';
  diagramType: string;
}

export interface ParsedMathResult {
  input: string;
  type: ModelType;
  title: string;
  subtitle: string;
  standardEquation: string;
  parametricFormula?: string;
  cbseTopic: string;
  cbseChapter: string;
  properties: MathProperty[];
  stepByStep: string[];
  voiceExplanation: string;
  keyPoints: Key3DPoint[];
  questionChallenge?: QuestionChallenge;
  evaluator?: (x: number, y: number) => number;
  bounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    minZ: number;
    maxZ: number;
  };
  dimensions?: {
    radius?: number;
    radius2?: number;
    width?: number;
    height?: number;
    depth?: number;
    side?: number;
    d1?: number;
    d2?: number;
    base?: number;
    skew?: number;
    a?: number;
    b?: number;
    c?: number;
    h?: number;
    k?: number;
    slope?: number;
  };
}

export interface CuratedQuestionItem {
  id: string;
  label: string;
  query: string;
  category:
    | 'CBSE Class 10 Mensuration'
    | 'CBSE Conics & Arches'
    | 'CBSE Trigonometry 3D'
    | 'Quadrilaterals'
    | 'Calculus & Quadrics'
    | 'Architecture & Real World';
  cbseClass: 'Class 9' | 'Class 10' | 'Class 11/12';
  chapter: string;
  icon: string;
  difficulty: 'Standard' | 'Board Exam' | 'HOTS' | 'Exhibition Challenge';
  previewShape: string;
}

/**
 * 32+ Rich Curated Questions & 3D Equations spanning CBSE Class 9 & 10 Mathematics,
 * Real-World Architecture, and Higher Quadric Surfaces.
 */
export const CURATED_QUESTIONS: CuratedQuestionItem[] = [
  // --- CBSE CLASS 10 MENSURATION: SURFACE AREAS & VOLUMES (8 Questions) ---
  {
    id: 'cbse-capsule',
    label: 'Medicine Capsule (Cylinder + 2 Hemispheres)',
    query:
      'A medicine capsule is in the shape of a cylinder with two hemispheres stuck to each of its ends. The length of the entire capsule is 14 mm and the diameter is 5 mm. Find its surface area and volume.',
    category: 'CBSE Class 10 Mensuration',
    cbseClass: 'Class 10',
    chapter: 'Ch 13: Surface Areas and Volumes (Exercise 13.1 Q6)',
    icon: '💊',
    difficulty: 'Board Exam',
    previewShape: 'capsule',
  },
  {
    id: 'cbse-toy',
    label: 'Wooden Toy (Cone Mounted on Hemisphere)',
    query:
      'A toy is in the form of a cone of radius 3.5 cm mounted on a hemisphere of same radius. The total height of the toy is 15.5 cm. Find the total surface area.',
    category: 'CBSE Class 10 Mensuration',
    cbseClass: 'Class 10',
    chapter: 'Ch 13: Surface Areas and Volumes (Exercise 13.1 Q3)',
    icon: '🧸',
    difficulty: 'Board Exam',
    previewShape: 'toy',
  },
  {
    id: 'cbse-gulab-jamun',
    label: 'Gulab Jamun (Sugar Syrup Solid)',
    query:
      'A gulab jamun contains sugar syrup up to about 30% of its volume. It is shaped like a cylinder with two hemispherical ends with total length 5 cm and diameter 2.8 cm.',
    category: 'CBSE Class 10 Mensuration',
    cbseClass: 'Class 10',
    chapter: 'Ch 13: Surface Areas and Volumes (Exercise 13.2 Q3)',
    icon: '🍬',
    difficulty: 'HOTS',
    previewShape: 'capsule',
  },
  {
    id: 'cbse-iron-pole',
    label: 'Solid Iron Pole (Stepped Cylinders)',
    query:
      'A solid iron pole consists of a cylinder of height 220 cm and base radius 12 cm, which is surmounted by another cylinder of height 60 cm and radius 8 cm. Find the mass of the pole.',
    category: 'CBSE Class 10 Mensuration',
    cbseClass: 'Class 10',
    chapter: 'Ch 13: Surface Areas and Volumes (Exercise 13.2 Q6)',
    icon: '🏗️',
    difficulty: 'Board Exam',
    previewShape: 'pole',
  },
  {
    id: 'cbse-drinking-glass',
    label: 'Drinking Glass (Frustum of Cone)',
    query:
      'A drinking glass is in the shape of a frustum of a cone of height 14 cm. The diameters of its two circular ends are 4 cm and 2 cm. Find the capacity of the glass.',
    category: 'CBSE Class 10 Mensuration',
    cbseClass: 'Class 10',
    chapter: 'Ch 13: Surface Areas and Volumes (Exercise 13.4 Q1)',
    icon: '🥤',
    difficulty: 'Board Exam',
    previewShape: 'frustum',
  },
  {
    id: 'cbse-bucket-frustum',
    label: 'Metallic Bucket (Frustum of Cone)',
    query:
      'A metallic bucket open at top is in the form of a frustum of a cone with height 16 cm and radii of lower and upper ends are 8 cm and 20 cm. Find the volume and slant height.',
    category: 'CBSE Class 10 Mensuration',
    cbseClass: 'Class 10',
    chapter: 'Ch 13: Surface Areas and Volumes (Exercise 13.4 Q4)',
    icon: '🪣',
    difficulty: 'Board Exam',
    previewShape: 'frustum',
  },
  {
    id: 'cbse-circus-tent',
    label: 'Circus Tent (Cylinder + Conical Roof)',
    query:
      'A tent is in the shape of a cylinder surmounted by a conical top. If the height and diameter of the cylindrical part are 2.1 m and 4 m, and the slant height of the top is 2.8 m, find the area of the canvas.',
    category: 'CBSE Class 10 Mensuration',
    cbseClass: 'Class 10',
    chapter: 'Ch 13: Surface Areas and Volumes (Exercise 13.1 Q7)',
    icon: '🎪',
    difficulty: 'Board Exam',
    previewShape: 'tent',
  },
  {
    id: 'cbse-cube-depression',
    label: 'Cube with Hemispherical Depression',
    query:
      'A solid wooden toy block has a cube of side 7 cm with a hemispherical depression of diameter 4.2 cm carved out from one face. Find the total remaining surface area.',
    category: 'CBSE Class 10 Mensuration',
    cbseClass: 'Class 10',
    chapter: 'Ch 13: Surface Areas and Volumes (Exercise 13.1 Q5)',
    icon: '🧊',
    difficulty: 'HOTS',
    previewShape: 'cube',
  },

  // --- CBSE CONICS, ARCHES & COORDINATE GEOMETRY (6 Questions) ---
  {
    id: 'cbse-bridge-arch',
    label: 'Parabolic Arch Bridge (Span 20m, Height 5m)',
    query: 'A bridge arch in the shape of a parabola 20 meters wide and 5 meters high',
    category: 'CBSE Conics & Arches',
    cbseClass: 'Class 10',
    chapter: 'Ch 4: Quadratic Equations / Polynomials (Parabola Applications)',
    icon: '🌉',
    difficulty: 'Exhibition Challenge',
    previewShape: 'parabola',
  },
  {
    id: 'cbse-satellite-dish',
    label: 'Satellite Paraboloid Dish Reflector',
    query:
      'A parabolic satellite dish antenna has a diameter of 12 meters and a depth of 3 meters at its center. Find the position of the receiver focus.',
    category: 'CBSE Conics & Arches',
    cbseClass: 'Class 10',
    chapter: 'Class 10 Light & Optics / Class 11 Conics (Paraboloid of Revolution)',
    icon: '📡',
    difficulty: 'HOTS',
    previewShape: 'satellite',
  },
  {
    id: 'cbse-whispering-gallery',
    label: 'Elliptical Whispering Gallery Arch',
    query:
      'An elliptical arch in a whispering gallery has a span of 20 meters and height of 6 meters at the center. Find the equation of the ellipse and the positions of the foci.',
    category: 'CBSE Conics & Arches',
    cbseClass: 'Class 11/12',
    chapter: 'Class 11 Ch 11: Conic Sections (Acoustic Reflection in Ellipses)',
    icon: '🏛️',
    difficulty: 'Exhibition Challenge',
    previewShape: 'ellipse',
  },
  {
    id: 'cbse-football-trajectory',
    label: 'Football Projectile Trajectory',
    query:
      'A football kicked from ground follows the parabolic path y = -0.05*x^2 + 1.2*x. Find the maximum height reached and the total horizontal range.',
    category: 'CBSE Conics & Arches',
    cbseClass: 'Class 10',
    chapter: 'Ch 2: Polynomials & Ch 4: Quadratic Vertex Form',
    icon: '⚽',
    difficulty: 'Standard',
    previewShape: 'parabola',
  },
  {
    id: 'cbse-circle-center-radius',
    label: 'Circle (Center & Radius Equation)',
    query: 'A circle centered at (2, -1) with radius 5',
    category: 'CBSE Conics & Arches',
    cbseClass: 'Class 10',
    chapter: 'Ch 10: Circles & Ch 7: Coordinate Geometry',
    icon: '⭕',
    difficulty: 'Standard',
    previewShape: 'circle',
  },
  {
    id: 'cbse-inscribed-cylinder',
    label: 'Cylinder Inscribed Inside Sphere',
    query: 'A cylinder inscribed inside a sphere of radius 6',
    category: 'CBSE Conics & Arches',
    cbseClass: 'Class 10',
    chapter: 'Class 10 Surface Areas & Class 12 Optimization',
    icon: '🎯',
    difficulty: 'HOTS',
    previewShape: 'inscribed',
  },

  // --- CBSE TRIGONOMETRY 3D & HEIGHTS / DISTANCES (4 Questions) ---
  {
    id: 'cbse-lighthouse-beacon',
    label: 'Lighthouse Conical Beacon (30° Beam)',
    query:
      'A lighthouse of height 50 meters casts a conical beam of light subtending an angle of 30 degrees with the horizontal sea surface. Find the illuminated radius and area.',
    category: 'CBSE Trigonometry 3D',
    cbseClass: 'Class 10',
    chapter: 'Ch 9: Some Applications of Trigonometry (Heights and Distances)',
    icon: '🚨',
    difficulty: 'Standard',
    previewShape: 'cone',
  },
  {
    id: 'cbse-balloon-tether',
    label: 'Hot Air Observation Balloon Tether',
    query:
      'An observer views a hot air balloon tethered at height 100 meters at an angle of elevation of 45 degrees, forming a 3D conical cable mooring system.',
    category: 'CBSE Trigonometry 3D',
    cbseClass: 'Class 10',
    chapter: 'Ch 9: Some Applications of Trigonometry',
    icon: '🎈',
    difficulty: 'Board Exam',
    previewShape: 'cone',
  },
  {
    id: 'cbse-great-pyramid',
    label: 'Great Pyramid (Square Base Pyramid)',
    query:
      'A square pyramid has a base side of 10 meters and a perpendicular vertical height of 8 meters. Find its slant height, lateral area, and volume.',
    category: 'CBSE Trigonometry 3D',
    cbseClass: 'Class 10',
    chapter: 'Pythagorean Triads & 3D Polyhedra Mensuration',
    icon: '🔺',
    difficulty: 'Board Exam',
    previewShape: 'pyramid',
  },
  {
    id: 'cbse-triangular-prism',
    label: 'Equilateral Triangular Prism (Light Dispersion)',
    query:
      'A glass triangular prism for light dispersion has equilateral triangular faces of side 6 cm and a length of 10 cm. Find its total surface area and volume.',
    category: 'CBSE Trigonometry 3D',
    cbseClass: 'Class 10',
    chapter: 'Class 10 Science (Human Eye & Colorful World) & Class 9 Mensuration',
    icon: '🌈',
    difficulty: 'Standard',
    previewShape: 'prism',
  },

  // --- CBSE CLASS 9 QUADRILATERALS & 3D WEDGES (4 Questions) ---
  {
    id: 'cbse-rhombus-diagonals',
    label: 'Rhombus with Perpendicular Diagonals',
    query: 'A rhombus with diagonals 12 and 16 units',
    category: 'Quadrilaterals',
    cbseClass: 'Class 9',
    chapter: 'Class 9 Ch 8: Quadrilaterals (Diagonals Bisect at 90°)',
    icon: '💎',
    difficulty: 'Standard',
    previewShape: 'rhombus',
  },
  {
    id: 'cbse-parallelogram-area',
    label: 'Parallelogram Base & Altitude',
    query: 'A parallelogram with base 10 and height 6 units',
    category: 'Quadrilaterals',
    cbseClass: 'Class 9',
    chapter: 'Class 9 Ch 9: Areas of Parallelograms and Triangles',
    icon: '▱',
    difficulty: 'Standard',
    previewShape: 'parallelogram',
  },
  {
    id: 'cbse-trapezoid-dam',
    label: 'Trapezoidal Concrete Dam Wall',
    query:
      'A concrete dam wall has an isosceles trapezoidal cross-section with top width 8 meters, bottom width 16 meters, and vertical height 12 meters. Find the face area.',
    category: 'Quadrilaterals',
    cbseClass: 'Class 9',
    chapter: 'Class 9 Ch 8: Quadrilaterals & Mensuration',
    icon: '🌊',
    difficulty: 'Standard',
    previewShape: 'trapezoid',
  },
  {
    id: 'cbse-incline-ramp-wedge',
    label: 'Right Triangle Incline Ramp (3D Wedge)',
    query:
      'A right-angled triangular ramp wedge with base 8 meters, vertical height 4 meters, and width 5 meters. Calculate ramp slope and hypotenuse length.',
    category: 'Quadrilaterals',
    cbseClass: 'Class 10',
    chapter: 'Class 10 Ch 8: Introduction to Trigonometry (Slope m = tan θ)',
    icon: '📐',
    difficulty: 'Standard',
    previewShape: 'wedge',
  },

  // --- CALCULUS, WAVES & QUADRIC SURFACES (7 Questions) ---
  {
    id: 'quad-hyperbolic-saddle',
    label: 'Hyperbolic Saddle (z = x² - y²)',
    query: 'z = x^2 - y^2',
    category: 'Calculus & Quadrics',
    cbseClass: 'Class 11/12',
    chapter: 'Class 12 Calculus & 3D Quadrics (Pringles Chip Geometry)',
    icon: '⚡',
    difficulty: 'Exhibition Challenge',
    previewShape: 'saddle',
  },
  {
    id: 'quad-elliptic-paraboloid',
    label: 'Paraboloid of Revolution (z = x² + y²)',
    query: 'z = x^2 + y^2',
    category: 'Calculus & Quadrics',
    cbseClass: 'Class 11/12',
    chapter: 'Rotational Solids of Quadratic Curves',
    icon: '📡',
    difficulty: 'Standard',
    previewShape: 'paraboloid',
  },
  {
    id: 'quad-sphere-3d',
    label: '3D Quadric Sphere (x² + y² + z² = 25)',
    query: 'x^2 + y^2 + z^2 = 25',
    category: 'Calculus & Quadrics',
    cbseClass: 'Class 10',
    chapter: 'Class 10 Ch 13 & Class 11 3D Geometry',
    icon: '🌐',
    difficulty: 'Standard',
    previewShape: 'sphere',
  },
  {
    id: 'quad-right-cone',
    label: '3D Right Circular Cone (r = 4, h = 7)',
    query: 'A right circular cone of radius 4 and height 7',
    category: 'Calculus & Quadrics',
    cbseClass: 'Class 10',
    chapter: 'Class 10 Ch 13 Surface Areas & Volumes',
    icon: '📐',
    difficulty: 'Standard',
    previewShape: 'cone',
  },
  {
    id: 'quad-monkey-saddle',
    label: 'Monkey Saddle (z = x³ - 3xy²)',
    query: 'z = x^3 - 3*x*y^2',
    category: 'Calculus & Quadrics',
    cbseClass: 'Class 11/12',
    chapter: 'Multivariable Calculus: Three Valley Surface',
    icon: '🐒',
    difficulty: 'HOTS',
    previewShape: 'saddle',
  },
  {
    id: 'quad-harmonic-wave',
    label: 'Harmonic Wave Grid (z = sin x · cos y)',
    query: 'z = sin(x) * cos(y)',
    category: 'Calculus & Quadrics',
    cbseClass: 'Class 11/12',
    chapter: 'Class 11 Trigonometric Functions & Waves',
    icon: '🌊',
    difficulty: 'Standard',
    previewShape: 'wave',
  },
  {
    id: 'quad-sombrero-ripple',
    label: 'Sombrero Sinc Ripple (z = 3 sin r / r)',
    query: 'z = 3 * sin(sqrt(x^2 + y^2)) / sqrt(x^2 + y^2)',
    category: 'Calculus & Quadrics',
    cbseClass: 'Class 11/12',
    chapter: 'Bessel / Sinc Wave Propagation in 3D',
    icon: '🎆',
    difficulty: 'HOTS',
    previewShape: 'wave',
  },

  // --- ARCHITECTURE & REAL WORLD 3D STRUCTURES (3 Questions) ---
  {
    id: 'arch-hyperbolic-tower',
    label: 'Hyperbolic Cooling Tower (Ruled Surface)',
    query:
      'A nuclear cooling tower is formed by rotating a hyperbola around its vertical axis. The waist diameter is 8 meters at height 10 meters, and base diameter is 16 meters.',
    category: 'Architecture & Real World',
    cbseClass: 'Class 11/12',
    chapter: 'Engineering Geometry: Hyperboloid of One Sheet',
    icon: '🏭',
    difficulty: 'Exhibition Challenge',
    previewShape: 'hyperboloid',
  },
  {
    id: 'arch-torus-donut',
    label: '3D Torus (Donut Ring R = 5, r = 1.8)',
    query:
      'A 3D torus with major radius R = 5 and tube radius r = 1.8. Find its volume and surface area using Pappus Centroid Theorem.',
    category: 'Architecture & Real World',
    cbseClass: 'Class 11/12',
    chapter: 'Calculus: Pappus Centroid Theorem & Revolution of Circles',
    icon: '🍩',
    difficulty: 'Exhibition Challenge',
    previewShape: 'torus',
  },
  {
    id: 'arch-ellipsoid-rugby',
    label: 'Ellipsoid of Revolution (Rugby Ball)',
    query: 'An ellipsoid with semi-axes a = 6, b = 4, and c = 3 with equation x^2/36 + y^2/16 + z^2/9 = 1.',
    category: 'Architecture & Real World',
    cbseClass: 'Class 11/12',
    chapter: '3D Quadric Surfaces: Spheroids and Ellipsoids',
    icon: '🏉',
    difficulty: 'Standard',
    previewShape: 'ellipsoid',
  },
];

/**
 * Safe algebraic function compiler for arbitrary z = f(x, y) equations.
 */
export function compileFunctionZ(rawExpr: string): ((x: number, y: number) => number) | null {
  try {
    let clean = rawExpr.trim();
    clean = clean.replace(/^(?:z\s*=\s*|f\s*\(\s*x\s*,\s*y\s*\)\s*=\s*)/i, '');
    if (!clean) return null;

    clean = clean.replace(/\^/g, '**');
    clean = clean.replace(/(\d)\s*([a-zA-Z(])/g, '$1 * $2');
    clean = clean.replace(/([a-zA-Z)])\s*(\d)/g, '$1 * $2');
    clean = clean.replace(/\)\s*\(/g, ') * (');
    clean = clean.replace(/([xy])\s+([xy])/gi, '$1 * $2');

    clean = clean.replace(/\bsin\b/gi, 'Math.sin');
    clean = clean.replace(/\bcos\b/gi, 'Math.cos');
    clean = clean.replace(/\btan\b/gi, 'Math.tan');
    clean = clean.replace(/\bsqrt\b/gi, 'Math.sqrt');
    clean = clean.replace(/\bexp\b/gi, 'Math.exp');
    clean = clean.replace(/\babs\b/gi, 'Math.abs');
    clean = clean.replace(/\blog\b/gi, 'Math.log');
    clean = clean.replace(/\bpi\b/gi, 'Math.PI');
    clean = clean.replace(/\be\b(?![a-zA-Z])/gi, 'Math.E');

    const allowed = /^[0-9xyXY\s+\-*/().,MathsincotaqrepblEPI*]+$/;
    if (!allowed.test(clean)) {
      return (x: number, y: number) => x * x - y * y;
    }

    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const fn = new Function('x', 'y', `
      try {
        const val = Number(${clean});
        return isNaN(val) ? 0 : val;
      } catch (e) {
        return 0;
      }
    `) as (x: number, y: number) => number;

    fn(1, 1);
    return fn;
  } catch (err) {
    console.warn('Could not compile mathematical expression:', err);
    return null;
  }
}

/**
 * Intelligent Math Parser & Question Analyzer:
 * Detects whether the user entered an algebraic equation OR a geometry question.
 */
export function parseMathQuery(query: string): ParsedMathResult {
  const q = query.trim();
  const lower = q.toLowerCase();

  // 1. Medicine Capsule / Cylinder with two Hemispheres
  if (lower.includes('capsule') || (lower.includes('cylinder') && lower.includes('two hemisphere'))) {
    const totalL = 14;
    const d = 5;
    const r = d / 2; // 2.5 mm
    const cylH = totalL - 2 * r; // 9 mm
    const csaCyl = 2 * Math.PI * r * cylH;
    const sa2Hemi = 2 * (2 * Math.PI * r * r); // 4 * pi * r^2
    const totalSA = csaCyl + sa2Hemi;
    const volCyl = Math.PI * r * r * cylH;
    const vol2Hemi = (4 / 3) * Math.PI * Math.pow(r, 3);
    const totalVol = volCyl + vol2Hemi;

    return {
      input: q,
      type: 'capsule_cylinder_spheres',
      title: 'Medicine Capsule (Cylinder + Two Hemispherical Ends)',
      subtitle: 'CBSE Class 10 Board Exam Problem: Solid Formed by Combination of Shapes',
      standardEquation: `\\text{TSA} = 2\\pi r h + 2(2\\pi r^2) = 2\\pi r(h + 2r) = ${totalSA.toFixed(1)}\\text{ mm}^2`,
      parametricFormula: 'Cylinder: x^2 + y^2 = 2.5^2 \\; (|z| \\le 4.5), \\; Hemispheres: x^2 + y^2 + (z \\pm 4.5)^2 = 2.5^2',
      cbseTopic: 'CBSE Class 10 Chapter 13: Surface Areas and Volumes',
      cbseChapter: 'NCERT Class 10 Exercise 13.1 Question 6 (Combination of Solids)',
      properties: [
        { label: 'Total Capsule Length (L)', value: `${totalL} mm`, detail: 'From apex of left hemisphere to right' },
        { label: 'Capsule Diameter (d)', value: `${d} mm`, detail: `Radius r = d/2 = ${r} mm` },
        { label: 'Cylinder Height (h)', value: `${cylH} mm`, detail: `h = L - 2r = 14 - 2(2.5) = 9 mm` },
        { label: 'Curved Area of Cylinder', value: `${csaCyl.toFixed(2)} mm²`, detail: '2πrh' },
        { label: 'Surface Area of 2 Hemispheres', value: `${sa2Hemi.toFixed(2)} mm²`, detail: '2 × 2πr² = 4πr²' },
        { label: 'Total Surface Area', value: `${totalSA.toFixed(2)} mm² (≈ 220 mm²)` },
        { label: 'Total Internal Volume', value: `${totalVol.toFixed(2)} mm³` },
      ],
      stepByStep: [
        `1. Given: Diameter d = 5 mm ⇒ Radius of cylinder and hemispheres r = 2.5 mm.`,
        `2. Height of cylindrical part h = Total length - 2 × Radius = 14 - 2(2.5) = 9 mm.`,
        `3. Total Surface Area = CSA of cylinder + 2 × CSA of hemisphere`,
        `   = 2πrh + 2(2πr²) = 2πr(h + 2r) = 2 × (22/7) × 2.5 × (9 + 5) = 2 × (22/7) × 2.5 × 14 = 220 mm².`,
        `4. Volume = Volume of cylinder + Volume of 2 hemispheres = πr²h + (4/3)πr³ ≈ ${totalVol.toFixed(2)} mm³.`,
      ],
      voiceExplanation:
        'This medicine capsule is composed of a central cylinder with two hemispherical caps on its ends. Its total length is 14 millimeters and diameter is 5 millimeters, giving a radius of 2.5 millimeters. Subtracting the two radii leaves 9 millimeters for the cylinder height, resulting in a total surface area of precisely 220 square millimeters.',
      questionChallenge: {
        problemText:
          'A medicine capsule is in the shape of a cylinder with two hemispheres stuck to each of its ends. The length of the entire capsule is 14 mm and the diameter of the capsule is 5 mm. Find its surface area and capacity.',
        givenData: [
          { label: 'Entire Length L', value: '14 mm' },
          { label: 'Diameter d', value: '5 mm' },
          { label: 'Radius r', value: '2.5 mm' },
          { label: 'Cylinder Height h', value: '9 mm' },
        ],
        toFind: 'Total Surface Area (TSA) & Volume (V)',
        difficulty: 'Board Exam',
        diagramType: 'capsule',
      },
      bounds: { minX: -5, maxX: 5, minY: -5, maxY: 5, minZ: -10, maxZ: 10 },
      keyPoints: [
        { label: 'Left Pole', x: 0, y: 0, z: -totalL / 2, description: 'Left hemisphere apex', color: '#f59e0b' },
        { label: 'Right Pole', x: 0, y: 0, z: totalL / 2, description: 'Right hemisphere apex', color: '#f59e0b' },
        { label: 'Left Joint', x: 0, y: 0, z: -cylH / 2, description: 'Cylinder-hemisphere seam', color: '#06b6d4' },
        { label: 'Right Joint', x: 0, y: 0, z: cylH / 2, description: 'Cylinder-hemisphere seam', color: '#06b6d4' },
      ],
      dimensions: { radius: r, height: cylH },
    };
  }

  // 2. Wooden Toy / Cone Mounted on Hemisphere (CBSE NCERT Ch 13 Ex 13.1 Q3)
  if (lower.includes('toy') || (lower.includes('cone') && lower.includes('hemisphere'))) {
    const r = 3.5;
    const totalH = 15.5;
    const coneH = totalH - r; // 12 cm
    const l = Math.sqrt(r * r + coneH * coneH); // 12.5 cm
    const csaCone = Math.PI * r * l;
    const csaHemi = 2 * Math.PI * r * r;
    const tsa = csaCone + csaHemi;
    const volCone = (1 / 3) * Math.PI * r * r * coneH;
    const volHemi = (2 / 3) * Math.PI * Math.pow(r, 3);
    const totalVol = volCone + volHemi;

    return {
      input: q,
      type: 'composite_toy',
      title: 'Wooden Toy (Cone Mounted on Hemisphere)',
      subtitle: 'Classic CBSE Class 10 Board Exam Problem on Composite Solids',
      standardEquation: `\\text{TSA} = \\pi r l + 2\\pi r^2 = \\pi r(l + 2r) = ${tsa.toFixed(2)}\\text{ cm}^2`,
      cbseTopic: 'CBSE Class 10 Chapter 13: Surface Areas and Volumes',
      cbseChapter: 'NCERT Class 10 Exercise 13.1 Question 3 (Toy Lattu)',
      properties: [
        { label: 'Common Radius r', value: `${r} cm`, detail: 'Both cone and hemisphere share this radius' },
        { label: 'Total Height (H)', value: `${totalH} cm`, detail: 'From bottom tip of hemisphere to cone apex' },
        { label: 'Height of Cone (h)', value: `${coneH} cm`, detail: 'H - r = 15.5 - 3.5 = 12 cm' },
        { label: 'Slant Height (l)', value: `√(12² + 3.5²) = ${l} cm` },
        { label: 'CSA of Cone', value: `πrl = ${csaCone.toFixed(2)} cm²` },
        { label: 'CSA of Hemisphere', value: `2πr² = ${csaHemi.toFixed(2)} cm²` },
        { label: 'Total Surface Area', value: `${tsa.toFixed(2)} cm² (214.5 cm²)` },
        { label: 'Total Toy Volume', value: `${totalVol.toFixed(2)} cm³` },
      ],
      stepByStep: [
        `1. Common radius r = 3.5 cm = 7/2 cm.`,
        `2. Height of conical part h = Total height - radius = 15.5 - 3.5 = 12 cm.`,
        `3. Slant height of cone l = √(r² + h²) = √(3.5² + 12²) = √(12.25 + 144) = √156.25 = 12.5 cm.`,
        `4. Total surface area of toy = Curved surface area of cone + Curved surface area of hemisphere`,
        `   = πrl + 2πr² = πr(l + 2r) = (22/7) × (7/2) × (12.5 + 7) = 11 × 19.5 = 214.5 cm².`,
      ],
      voiceExplanation:
        'This composite wooden toy combines a conical top mounted on a hemispherical base of matching 3.5 centimeter radius. With a total height of 15.5 centimeters, the cone vertical height is 12 centimeters. Applying Pythagoras theorem gives a slant height of 12.5 centimeters, yielding a total surface area of exactly 214.5 square centimeters.',
      questionChallenge: {
        problemText:
          'A toy is in the form of a cone of radius 3.5 cm mounted on a hemisphere of same radius. The total height of the toy is 15.5 cm. Find the total surface area of the toy.',
        givenData: [
          { label: 'Radius r', value: '3.5 cm' },
          { label: 'Total Height H', value: '15.5 cm' },
          { label: 'Cone Height h', value: '12 cm' },
          { label: 'Slant Height l', value: '12.5 cm' },
        ],
        toFind: 'Total Surface Area (TSA) of Toy',
        difficulty: 'Board Exam',
        diagramType: 'toy_cone_hemi',
      },
      bounds: { minX: -6, maxX: 6, minY: -6, maxY: 6, minZ: -5, maxZ: 14 },
      keyPoints: [
        { label: 'Cone Apex', x: 0, y: coneH, z: 0, description: 'Top vertex at height 12cm', color: '#ec4899' },
        { label: 'Base Junction', x: r, y: 0, z: 0, description: 'Seam ring (r = 3.5cm)', color: '#f59e0b' },
        { label: 'Hemisphere Base', x: 0, y: -r, z: 0, description: 'Lowest point of bowl', color: '#06b6d4' },
      ],
      dimensions: { radius: r, height: coneH },
    };
  }

  // 3. Gulab Jamun (Cylinder + 2 Hemispheres with 30% Syrup, Ex 13.2 Q3)
  if (lower.includes('gulab jamun') || lower.includes('syrup')) {
    const totalL = 5.0; // cm
    const d = 2.8; // cm
    const r = d / 2; // 1.4 cm
    const cylH = totalL - 2 * r; // 2.2 cm
    const volCyl = Math.PI * r * r * cylH;
    const vol2Hemi = (4 / 3) * Math.PI * Math.pow(r, 3);
    const oneJamunVol = volCyl + vol2Hemi; // ≈ 25.07 cm³
    const syrupVolOne = oneJamunVol * 0.3;
    const syrup45Jamuns = syrupVolOne * 45; // ≈ 338 cm³

    return {
      input: q,
      type: 'capsule_cylinder_spheres',
      title: 'Gulab Jamun (Sugar Syrup Solid Geometry)',
      subtitle: 'CBSE Class 10 NCERT Chapter 13 Exercise 13.2 Question 3',
      standardEquation: `V = \\pi r^2 h + \\frac{4}{3}\\pi r^3 = ${oneJamunVol.toFixed(2)}\\text{ cm}^3 \\; (\\text{Syrup } 30\\% \\approx ${syrup45Jamuns.toFixed(0)}\\text{ cm}^3 \\text{ for 45})`,
      cbseTopic: 'CBSE Class 10 Chapter 13: Surface Areas and Volumes',
      cbseChapter: 'NCERT Class 10 Exercise 13.2 Question 3 (Volume of Combined Solids)',
      properties: [
        { label: 'Total Length (L)', value: `${totalL} cm` },
        { label: 'Diameter (d)', value: `${d} cm`, detail: `Radius r = ${r} cm` },
        { label: 'Cylinder Length (h)', value: `${cylH.toFixed(1)} cm`, detail: '5 - 2(1.4) = 2.2 cm' },
        { label: 'Single Jamun Volume', value: `${oneJamunVol.toFixed(2)} cm³` },
        { label: 'Syrup Percentage', value: '30% of total volume' },
        { label: 'Syrup in 45 Jamuns', value: `${syrup45Jamuns.toFixed(1)} cm³ (≈ 338 cm³)` },
      ],
      stepByStep: [
        `1. Radius r = 2.8 / 2 = 1.4 cm. Height of cylinder h = 5 - 2(1.4) = 2.2 cm.`,
        `2. Volume of 1 gulab jamun = Volume of cylinder + 2 × Volume of hemisphere`,
        `   = πr²h + 2 × (2/3)πr³ = πr²(h + 4r/3) = (22/7) × 1.96 × (2.2 + 1.87) ≈ 25.07 cm³.`,
        `3. Total volume of 45 gulab jamuns = 45 × 25.07 = 1128.15 cm³.`,
        `4. Volume of sugar syrup (30%) = 0.30 × 1128.15 ≈ 338.45 cm³ ≈ 338 cm³.`,
      ],
      voiceExplanation:
        'This gulab jamun is modeled as a cylinder of length 2.2 centimeters with two hemispherical ends of radius 1.4 centimeters. Each sweet has a volume of approximately 25 cubic centimeters. Thirty percent of forty-five such sweets yields about 338 cubic centimeters of sugar syrup.',
      questionChallenge: {
        problemText:
          'A gulab jamun, contains sugar syrup up to about 30% of its volume. Find approximately how much syrup would be found in 45 gulab jamuns, each shaped like a cylinder with two hemispherical ends with length 5 cm and diameter 2.8 cm.',
        givenData: [
          { label: 'Total Length', value: '5 cm' },
          { label: 'Diameter', value: '2.8 cm' },
          { label: 'Radius r', value: '1.4 cm' },
          { label: 'Cylinder Length', value: '2.2 cm' },
        ],
        toFind: 'Volume of Sugar Syrup in 45 Gulab Jamuns',
        difficulty: 'HOTS',
        diagramType: 'capsule',
      },
      bounds: { minX: -3, maxX: 3, minY: -3, maxY: 3, minZ: -4, maxZ: 4 },
      keyPoints: [
        { label: 'Apex 1', x: 0, y: 0, z: -2.5, description: 'Left cap tip', color: '#f59e0b' },
        { label: 'Apex 2', x: 0, y: 0, z: 2.5, description: 'Right cap tip', color: '#f59e0b' },
      ],
      dimensions: { radius: r, height: cylH },
    };
  }

  // 4. Solid Iron Pole / Stepped Cylinders (Ex 13.2 Q6)
  if (lower.includes('iron pole') || lower.includes('pole consists') || lower.includes('surmounted by another cylinder')) {
    const h1 = 220; // cm
    const r1 = 12; // cm (diam 24cm)
    const h2 = 60; // cm
    const r2 = 8; // cm
    const vol1 = Math.PI * r1 * r1 * h1;
    const vol2 = Math.PI * r2 * r2 * h2;
    const totalVol = vol1 + vol2; // ≈ 111532.8 cm³
    const massKg = (totalVol * 8) / 1000; // 8g/cm³ ≈ 892.26 kg

    return {
      input: q,
      type: 'stepped_pole',
      title: 'Solid Iron Pole (Stepped Cylindrical Structure)',
      subtitle: 'CBSE Class 10 NCERT Chapter 13 Exercise 13.2 Question 6',
      standardEquation: `V = \\pi r_1^2 h_1 + \\pi r_2^2 h_2 = ${totalVol.toFixed(1)}\\text{ cm}^3 \\; (\\text{Mass } \\approx ${massKg.toFixed(2)}\\text{ kg})`,
      cbseTopic: 'CBSE Class 10 Chapter 13: Surface Areas and Volumes',
      cbseChapter: 'NCERT Class 10 Exercise 13.2 Question 6 (Mass of Combined Cylinders)',
      properties: [
        { label: 'Base Cylinder Height (h₁)', value: `${h1} cm` },
        { label: 'Base Cylinder Radius (r₁)', value: `${r1} cm`, detail: 'Diameter 24 cm' },
        { label: 'Upper Cylinder Height (h₂)', value: `${h2} cm` },
        { label: 'Upper Cylinder Radius (r₂)', value: `${r2} cm` },
        { label: 'Base Cylinder Volume', value: `${vol1.toFixed(1)} cm³` },
        { label: 'Upper Cylinder Volume', value: `${vol2.toFixed(1)} cm³` },
        { label: 'Total Pole Volume', value: `${totalVol.toFixed(1)} cm³` },
        { label: 'Total Mass (at 8g/cm³)', value: `${massKg.toFixed(2)} kg` },
      ],
      stepByStep: [
        `1. Volume of base cylinder V₁ = π × r₁² × h₁ = 3.14 × 12² × 220 = 99,523.2 cm³.`,
        `2. Volume of upper cylinder V₂ = π × r₂² × h₂ = 3.14 × 8² × 60 = 12,057.6 cm³.`,
        `3. Total volume of pole V = V₁ + V₂ = 99,523.2 + 12,057.6 = 111,580.8 cm³.`,
        `4. Mass of 1 cm³ iron = 8 g ⇒ Total mass = 111,580.8 × 8 = 892,646.4 g ≈ 892.26 kg.`,
      ],
      voiceExplanation:
        'This solid iron pole consists of a massive base cylinder of height 220 centimeters surmounted by a smaller cylinder of height 60 centimeters. Summing both cylindrical volumes gives approximately 111,580 cubic centimeters, which with a density of 8 grams per cubic centimeter yields a total mass of about 892 kilograms.',
      questionChallenge: {
        problemText:
          'A solid iron pole consists of a cylinder of height 220 cm and base diameter 24 cm, which is surmounted by another cylinder of height 60 cm and radius 8 cm. Find the mass of the pole, given that 1 cm³ of iron has approximately 8g mass.',
        givenData: [
          { label: 'Base Cylinder (h₁)', value: '220 cm' },
          { label: 'Base Radius (r₁)', value: '12 cm' },
          { label: 'Upper Cylinder (h₂)', value: '60 cm' },
          { label: 'Upper Radius (r₂)', value: '8 cm' },
          { label: 'Iron Density', value: '8 g / cm³' },
        ],
        toFind: 'Total Mass of Iron Pole in kg',
        difficulty: 'Board Exam',
        diagramType: 'stepped_pole',
      },
      bounds: { minX: -20, maxX: 20, minY: -20, maxY: 20, minZ: 0, maxZ: 300 },
      keyPoints: [
        { label: 'Pole Top', x: 0, y: h1 + h2, z: 0, description: 'Upper apex at 280cm', color: '#38bdf8' },
        { label: 'Shoulder Joint', x: r1, y: h1, z: 0, description: 'Cylinder step boundary', color: '#f59e0b' },
        { label: 'Ground Base', x: 0, y: 0, z: 0, description: 'Center of ground footprint', color: '#10b981' },
      ],
      dimensions: { radius: r1, height: h1, radius2: r2, depth: h2 },
    };
  }

  // 5. Frustum of a Cone (Drinking Glass / Bucket, Ex 13.4 Q1, Q4)
  if (lower.includes('frustum') || lower.includes('drinking glass') || lower.includes('bucket')) {
    let r1 = 2; // top radius
    let r2 = 1; // bottom radius
    let h = 14; // height
    if (lower.includes('bucket') || lower.includes('16') || lower.includes('20')) {
      r1 = 20;
      r2 = 8;
      h = 16;
    }
    const l = Math.sqrt(h * h + Math.pow(r1 - r2, 2));
    const vol = ((1 / 3) * Math.PI * h * (r1 * r1 + r2 * r2 + r1 * r2)).toFixed(2);
    const csa = (Math.PI * (r1 + r2) * l).toFixed(2);

    return {
      input: q,
      type: 'frustum_cone',
      title: `Frustum of a Cone (${lower.includes('bucket') ? 'Metallic Bucket' : 'Drinking Glass'})`,
      subtitle: 'Truncated Cone Formed by Cutting a Cone Parallel to Base',
      standardEquation: `V = \\frac{1}{3}\\pi h(r_1^2 + r_2^2 + r_1 r_2) = ${vol}\\text{ units}^3`,
      parametricFormula: 'x(u, θ) = (r_2 + u(r_1 - r_2))\\cosθ, \\; y(u, θ) = (r_2 + u(r_1 - r_2))\\sinθ, \\; z = u \\cdot h',
      cbseTopic: 'CBSE Class 10 Chapter 13: Surface Areas and Volumes',
      cbseChapter: 'NCERT Class 10 Section 13.5: Frustum of a Cone (Exercises 13.4)',
      properties: [
        { label: 'Upper Radius (r₁)', value: `${r1} cm` },
        { label: 'Lower Radius (r₂)', value: `${r2} cm` },
        { label: 'Vertical Height (h)', value: `${h} cm` },
        { label: 'Slant Height (l)', value: `√(h² + (r₁ - r₂)²) = ${l.toFixed(2)} cm` },
        { label: 'Curved Surface Area', value: `π(r₁ + r₂)l = ${csa} cm²` },
        { label: 'Capacity (Volume)', value: `${vol} cm³` },
      ],
      stepByStep: [
        `1. Given radii r₁ = ${r1} cm, r₂ = ${r2} cm, vertical height h = ${h} cm.`,
        `2. Slant height l = √(h² + (r₁ - r₂)²) = √(${h}² + (${r1 - r2})²) = ${l.toFixed(2)} cm.`,
        `3. Capacity V = 1/3 π h (r₁² + r₂² + r₁·r₂) = 1/3 × π × ${h} × (${r1 * r1} + ${r2 * r2} + ${r1 * r2}) = ${vol} cm³.`,
        `4. Curved surface area = π(r₁ + r₂)l = ${csa} cm².`,
      ],
      voiceExplanation: `This solid is a frustum of a cone with upper radius ${r1} centimeters, lower radius ${r2} centimeters, and height ${h} centimeters. Its capacity is calculated using the frustum volume formula, yielding ${vol} cubic centimeters.`,
      questionChallenge: {
        problemText: lower.includes('bucket')
          ? 'A metallic bucket open at top is in the form of a frustum of a cone with height 16 cm and radii of lower and upper ends are 8 cm and 20 cm. Find the volume of the bucket.'
          : 'A drinking glass is in the shape of a frustum of a cone of height 14 cm. The diameters of its two circular ends are 4 cm and 2 cm. Find the capacity of the glass.',
        givenData: [
          { label: 'Top Radius r₁', value: `${r1} cm` },
          { label: 'Bottom Radius r₂', value: `${r2} cm` },
          { label: 'Height h', value: `${h} cm` },
          { label: 'Slant Height l', value: `${l.toFixed(2)} cm` },
        ],
        toFind: 'Capacity (Volume) & Slant Height',
        difficulty: 'Board Exam',
        diagramType: 'frustum',
      },
      bounds: { minX: -r1 * 1.5, maxX: r1 * 1.5, minY: -r1 * 1.5, maxY: r1 * 1.5, minZ: 0, maxZ: h * 1.2 },
      keyPoints: [
        { label: 'Top Rim', x: r1, y: h, z: 0, description: `Radius r₁ = ${r1}cm`, color: '#38bdf8' },
        { label: 'Bottom Rim', x: r2, y: 0, z: 0, description: `Radius r₂ = ${r2}cm`, color: '#06b6d4' },
      ],
      dimensions: { radius: r1, radius2: r2, height: h },
    };
  }

  // 6. Circus Tent / Cylinder + Conical Top (Ex 13.1 Q7)
  if (lower.includes('tent') || (lower.includes('cylinder') && lower.includes('conical top'))) {
    const r = 2; // m (diam 4m)
    const h = 2.1; // m
    const l = 2.8; // m
    const csaCyl = 2 * Math.PI * r * h;
    const csaCone = Math.PI * r * l;
    const totalCanvas = csaCyl + csaCone; // 44 m²
    const cost = totalCanvas * 500; // at 500/m² = 22,000

    return {
      input: q,
      type: 'composite_tent',
      title: 'Circus Conical Tent (Cylinder with Conical Roof)',
      subtitle: 'CBSE Class 10 NCERT Chapter 13 Exercise 13.1 Question 7',
      standardEquation: `\\text{Canvas Area} = 2\\pi r h + \\pi r l = \\pi r(2h + l) = ${totalCanvas.toFixed(1)}\\text{ m}^2`,
      cbseTopic: 'CBSE Class 10 Chapter 13: Surface Areas and Volumes',
      cbseChapter: 'NCERT Class 10 Exercise 13.1 Question 7 (Canvas of Tent)',
      properties: [
        { label: 'Radius (r)', value: `${r} m`, detail: 'Diameter = 4 m' },
        { label: 'Cylinder Wall Height (h)', value: `${h} m` },
        { label: 'Conical Roof Slant Height (l)', value: `${l} m` },
        { label: 'CSA of Cylindrical Wall', value: `${csaCyl.toFixed(2)} m²` },
        { label: 'CSA of Conical Roof', value: `${csaCone.toFixed(2)} m²` },
        { label: 'Total Canvas Area Required', value: `${totalCanvas.toFixed(1)} m² (44 m²)` },
        { label: 'Cost of Canvas (@ ₹500/m²)', value: `₹${cost.toLocaleString()}` },
      ],
      stepByStep: [
        `1. Radius of cylinder and cone r = 4 / 2 = 2 m.`,
        `2. Height of cylindrical part h = 2.1 m, slant height of cone l = 2.8 m.`,
        `3. Total canvas area = CSA of cylinder + CSA of cone (base is not covered with canvas)`,
        `   = 2πrh + πrl = πr(2h + l) = (22/7) × 2 × (2 × 2.1 + 2.8) = (44/7) × (4.2 + 2.8) = (44/7) × 7 = 44 m².`,
        `4. Total cost of canvas = 44 × 500 = ₹22,000.`,
      ],
      voiceExplanation:
        'This circus tent consists of a cylindrical wall of height 2.1 meters topped by a conical roof with slant height 2.8 meters. The total canvas area required to build the tent is exactly 44 square meters, since the floor of the tent is not covered.',
      questionChallenge: {
        problemText:
          'A tent is in the shape of a cylinder surmounted by a conical top. If the height and diameter of the cylindrical part are 2.1 m and 4 m, and the slant height of the top is 2.8 m, find the area of the canvas used for making the tent. Also find the cost of canvas at the rate of ₹500 per m².',
        givenData: [
          { label: 'Diameter', value: '4 m (r = 2 m)' },
          { label: 'Cylinder Height h', value: '2.1 m' },
          { label: 'Slant Height l', value: '2.8 m' },
          { label: 'Rate per m²', value: '₹500' },
        ],
        toFind: 'Total Canvas Area & Cost',
        difficulty: 'Board Exam',
        diagramType: 'circus_tent',
      },
      bounds: { minX: -4, maxX: 4, minY: -4, maxY: 4, minZ: 0, maxZ: 7 },
      keyPoints: [
        { label: 'Roof Apex', x: 0, y: h + Math.sqrt(l * l - r * r), z: 0, description: 'Tent summit', color: '#f59e0b' },
        { label: 'Wall Eaves', x: r, y: h, z: 0, description: 'Wall-roof junction', color: '#06b6d4' },
      ],
      dimensions: { radius: r, height: h, depth: l },
    };
  }

  // 7. Cube with Hemispherical Depression (Ex 13.1 Q5)
  if (lower.includes('depression') || (lower.includes('cube') && lower.includes('hemis'))) {
    const a = 7; // side of cube
    const d = 4.2; // diameter of hemisphere
    const r = d / 2; // 2.1 cm
    const saCube = 6 * a * a; // 294
    const areaBaseHemi = Math.PI * r * r; // 13.86
    const csaHemi = 2 * Math.PI * r * r; // 27.72
    const totalRemainingSA = saCube - areaBaseHemi + csaHemi; // = 6a² + πr² ≈ 307.86 cm²

    return {
      input: q,
      type: 'cube_hemisphere_depression',
      title: 'Cube with Hemispherical Depression',
      subtitle: 'CBSE Class 10 NCERT Chapter 13 Exercise 13.1 Question 5',
      standardEquation: `\\text{TSA} = 6a^2 - \\pi r^2 + 2\\pi r^2 = 6a^2 + \\pi r^2 = ${totalRemainingSA.toFixed(2)}\\text{ cm}^2`,
      cbseTopic: 'CBSE Class 10 Chapter 13: Surface Areas and Volumes',
      cbseChapter: 'NCERT Class 10 Exercise 13.1 Question 5 (Hollowed-Out Solid)',
      properties: [
        { label: 'Cube Edge (a)', value: `${a} cm` },
        { label: 'Depression Diameter (d)', value: `${d} cm`, detail: `Radius r = ${r} cm` },
        { label: 'Full Cube Surface Area', value: `6a² = ${saCube} cm²` },
        { label: 'Removed Flat Circular Base', value: `πr² = ${areaBaseHemi.toFixed(2)} cm²` },
        { label: 'Added Inner Curved Cavity Area', value: `2πr² = ${csaHemi.toFixed(2)} cm²` },
        { label: 'Total Remaining Surface Area', value: `${totalRemainingSA.toFixed(2)} cm²` },
      ],
      stepByStep: [
        `1. Surface area of 6 faces of cube = 6a² = 6 × 7² = 294 cm².`,
        `2. Carving the hemisphere removes the flat circular top face area of πr² = (22/7) × 2.1² = 13.86 cm².`,
        `3. But it introduces an inner concave hemispherical surface of area 2πr² = 2 × 13.86 = 27.72 cm².`,
        `4. Total remaining surface area = 6a² - πr² + 2πr² = 6a² + πr² = 294 + 13.86 = 307.86 cm².`,
      ],
      voiceExplanation:
        'When a hemispherical cavity is carved out of a solid wooden cube, the flat circular top is removed, but an equal curved hemispherical surface is created inside. Hence, the net surface area increases by exactly pi r squared, giving approximately 307.86 square centimeters.',
      questionChallenge: {
        problemText:
          'A hemispherical depression is cut out from one face of a cubical wooden block of side 7 cm such that the diameter of the hemisphere is 4.2 cm. Determine the surface area of the remaining solid.',
        givenData: [
          { label: 'Cube Edge a', value: '7 cm' },
          { label: 'Depression Diameter d', value: '4.2 cm' },
          { label: 'Depression Radius r', value: '2.1 cm' },
        ],
        toFind: 'Remaining Total Surface Area',
        difficulty: 'HOTS',
        diagramType: 'cube_depression',
      },
      bounds: { minX: -5, maxX: 5, minY: -5, maxY: 5, minZ: -5, maxZ: 5 },
      keyPoints: [
        { label: 'Cavity Rim', x: 0, y: a / 2, z: r, description: 'Edge of depression', color: '#38bdf8' },
        { label: 'Cavity Floor', x: 0, y: a / 2 - r, z: 0, description: 'Lowest point of cavity', color: '#06b6d4' },
      ],
      dimensions: { side: a, radius: r },
    };
  }

  // 8. Satellite Dish Antenna / Paraboloid Reflector
  if (lower.includes('satellite') || lower.includes('dish antenna') || lower.includes('reflector')) {
    const diam = 12; // meters
    const depth = 3; // meters
    const r = diam / 2; // 6 meters
    // y = a * x^2 => 3 = a * 6^2 => a = 3 / 36 = 1/12
    const a = depth / (r * r);
    const focalDist = 1 / (4 * a); // 1 / (4 * 1/12) = 3 meters!

    return {
      input: q,
      type: 'surface_3d',
      title: 'Paraboloid Satellite Dish Antenna',
      subtitle: 'Optical & Electromagnetic Wave Concentrator to Focus Node',
      standardEquation: `z = \\frac{1}{12}(x^2 + y^2), \\quad \\text{Focus at } (0, 0, ${focalDist})`,
      parametricFormula: 'x = u\\cosθ, \\; y = u\\sinθ, \\; z = \\frac{u^2}{12}',
      cbseTopic: 'CBSE Class 10 Light & Optics / Class 11 Conic Sections',
      cbseChapter: 'Parabolic Reflectors & Solar Cooker Geometric Design',
      properties: [
        { label: 'Dish Aperture Diameter', value: `${diam} meters` },
        { label: 'Dish Depth at Center', value: `${depth} meters` },
        { label: 'Aperture Radius (r)', value: `${r} meters` },
        { label: 'Quadratic Constant a', value: `${a.toFixed(4)} (1/12)` },
        { label: 'Receiver Focal Distance (f)', value: `${focalDist} meters above center` },
      ],
      stepByStep: [
        `1. Place vertex at the origin (0, 0, 0). The parabolic cross section equation is z = a(x² + y²).`,
        `2. The rim has radius r = ${r} m and height z = ${depth} m.`,
        `3. Substitute: ${depth} = a(${r})² ⇒ a = ${depth} / ${r * r} = 1/12 ≈ ${a.toFixed(4)}.`,
        `4. Focal length f = 1 / (4a) = 1 / (4 × 1/12) = 12 / 4 = ${focalDist} meters.`,
        `5. The satellite horn feed receiver must be placed exactly ${focalDist} meters directly above the dish center.`,
      ],
      voiceExplanation:
        'This parabolic dish antenna has a diameter of 12 meters and central depth of 3 meters. By the reflective property of parabolas, all parallel satellite signals bounce directly into the feed horn located at the focal point, exactly 3 meters above the vertex.',
      questionChallenge: {
        problemText:
          'A parabolic satellite dish antenna has a diameter of 12 meters and a depth of 3 meters at its center. Find the position of the receiver focus above the dish vertex.',
        givenData: [
          { label: 'Diameter', value: '12 m' },
          { label: 'Radius r', value: '6 m' },
          { label: 'Center Depth', value: '3 m' },
        ],
        toFind: 'Focal Distance f = 1/(4a)',
        difficulty: 'HOTS',
        diagramType: 'parabolic_arch',
      },
      evaluator: (x, y) => (x * x + y * y) / 12,
      bounds: { minX: -8, maxX: 8, minY: -8, maxY: 8, minZ: 0, maxZ: 5 },
      keyPoints: [
        { label: 'Feed Horn Focus', x: 0, y: focalDist, z: 0, description: `Focus at (0, ${focalDist}, 0)`, color: '#f59e0b' },
        { label: 'Vertex Center', x: 0, y: 0, z: 0, description: 'Dish bottom', color: '#10b981' },
      ],
      dimensions: { width: diam, height: depth },
    };
  }

  // 9. Football Projectile Trajectory (Class 10 Polynomials)
  if (lower.includes('football') || lower.includes('projectile') || lower.includes('kicked')) {
    const a = 0.05;
    const b = 1.2;
    // y = -0.05 x^2 + 1.2 x = -a x^2 + b x
    // Vertex x = -b / (2*-a) = 1.2 / 0.1 = 12m
    const xVertex = b / (2 * a);
    const maxHeight = -a * xVertex * xVertex + b * xVertex; // 7.2m
    const xRange = b / a; // 24m

    return {
      input: q,
      type: 'conic_parabola',
      title: 'Football Projectile Trajectory',
      subtitle: 'CBSE Class 10 Chapter 2: Polynomials & Quadratic Kinematics',
      standardEquation: `y = -${a}x^2 + ${b}x = -${a}x(x - ${xRange})`,
      cbseTopic: 'CBSE Class 10 Chapter 2: Polynomials & Chapter 4: Quadratic Equations',
      cbseChapter: 'Trajectory Analysis: Zeroes of Quadratic Polynomial & Vertex Maxima',
      properties: [
        { label: 'Launch Origin', value: '(0, 0)' },
        { label: 'Total Horizontal Range', value: `${xRange} meters` },
        { label: 'Peak Flight Height', value: `${maxHeight.toFixed(2)} meters at x = ${xVertex}m` },
        { label: 'Initial Launch Slope', value: `dy/dx = ${b} (Launch angle = ${(Math.atan(b) * 180 / Math.PI).toFixed(1)}°)` },
      ],
      stepByStep: [
        `1. Roots of polynomial: -0.05x² + 1.2x = 0 ⇒ x(-0.05x + 1.2) = 0 ⇒ x = 0 or x = 1.2 / 0.05 = 24 meters.`,
        `2. Axis of symmetry is at midpoint: x = 24 / 2 = 12 meters.`,
        `3. Maximum height reached: y(12) = -0.05(144) + 1.2(12) = -7.2 + 14.4 = 7.2 meters.`,
        `4. The trajectory reaches an apex of 7.2 meters before landing 24 meters away.`,
      ],
      voiceExplanation:
        'This quadratic trajectory demonstrates how a kicked ball follows an inverted parabolic arc. The ball takes off at the origin, climbs to a peak height of 7.2 meters at the 12-meter mark, and lands 24 meters away.',
      questionChallenge: {
        problemText:
          'A football kicked from ground follows the parabolic path y = -0.05x² + 1.2x. Find the maximum height reached by the ball and the total horizontal range.',
        givenData: [
          { label: 'Trajectory Equation', value: 'y = -0.05x² + 1.2x' },
          { label: 'Quadratic Coeff a', value: '-0.05' },
          { label: 'Linear Coeff b', value: '1.2' },
        ],
        toFind: 'Max Height Vertex & Horizontal Range',
        difficulty: 'Standard',
        diagramType: 'parabolic_arch',
      },
      bounds: { minX: -2, maxX: 26, minY: -2, maxY: 10, minZ: -3, maxZ: 3 },
      keyPoints: [
        { label: 'Peak Apex', x: xVertex, y: maxHeight, z: 0, description: `Max height ${maxHeight}m`, color: '#10b981' },
        { label: 'Touchdown Landing', x: xRange, y: 0, z: 0, description: `Range ${xRange}m`, color: '#f59e0b' },
      ],
      dimensions: { width: xRange, height: maxHeight },
    };
  }

  // 10. Elliptical Whispering Gallery Arch
  if (lower.includes('whispering') || (lower.includes('ellipse') && (lower.includes('arch') || lower.includes('span')))) {
    const a = 10; // semi-major (span 20m)
    const b = 6; // semi-minor (height 6m)
    const c = Math.sqrt(a * a - b * b); // focal distance = 8m
    const e = c / a; // 0.8

    return {
      input: q,
      type: 'conic_ellipse',
      title: 'Elliptical Whispering Gallery Arch',
      subtitle: 'Acoustic Focal Reflection in Ellipsoidal Ceilings',
      standardEquation: `\\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} = 1 \\quad (y \\ge 0)`,
      cbseTopic: 'CBSE Class 11 Chapter 11: Conic Sections (Ellipse)',
      cbseChapter: 'Acoustic Focal Properties: Sound Emanating from F₁ Reflects to F₂',
      properties: [
        { label: 'Span (Major Axis 2a)', value: '20 meters' },
        { label: 'Central Height (Semi-Minor b)', value: '6 meters' },
        { label: 'Semi-Major Axis (a)', value: `${a} meters` },
        { label: 'Focal Distance (c)', value: `c = √(a² - b²) = ${c} meters` },
        { label: 'Eccentricity (e)', value: `${e.toFixed(2)}` },
        { label: 'Positions of Whispering Foci', value: `(±${c}, 0)` },
      ],
      stepByStep: [
        `1. Standard form of horizontal ellipse centered at origin: x²/a² + y²/b² = 1.`,
        `2. Total span is 20m ⇒ a = 10m. Central height is 6m ⇒ b = 6m.`,
        `3. Focal distance c = √(a² - b²) = √(100 - 36) = √64 = 8 meters.`,
        `4. The two whispering foci are located 8 meters to the left and right of the center: F₁(-8, 0) and F₂(8, 0).`,
      ],
      voiceExplanation:
        'In an elliptical whispering gallery, sound waves emitted from one focus reflect off the curved ceiling and converge precisely at the other focus. Here, with a span of 20 meters and height of 6 meters, the two whispering spots are located exactly 8 meters from the center.',
      questionChallenge: {
        problemText:
          'An elliptical arch in a whispering gallery has a span of 20 meters and a height of 6 meters at the center. Find the equation of the ellipse and the positions of the foci.',
        givenData: [
          { label: 'Span (2a)', value: '20 m' },
          { label: 'Semi-Major a', value: '10 m' },
          { label: 'Height (b)', value: '6 m' },
        ],
        toFind: 'Ellipse Equation & Focal Coordinates',
        difficulty: 'Exhibition Challenge',
        diagramType: 'parabolic_arch',
      },
      bounds: { minX: -14, maxX: 14, minY: -2, maxY: 10, minZ: -3, maxZ: 3 },
      keyPoints: [
        { label: 'Focus 1 (F₁)', x: -c, y: 0, z: 0, description: `Whispering node at (-${c}, 0)`, color: '#06b6d4' },
        { label: 'Focus 2 (F₂)', x: c, y: 0, z: 0, description: `Whispering node at (+${c}, 0)`, color: '#f59e0b' },
        { label: 'Crown Apex', x: 0, y: b, z: 0, description: `Max height ${b}m`, color: '#10b981' },
      ],
      dimensions: { a, b },
    };
  }

  // 11. Hyperbolic Cooling Tower
  if (lower.includes('cooling tower') || (lower.includes('hyperbol') && lower.includes('tower'))) {
    const a = 4; // waist radius
    const h = 12; // height
    return {
      input: q,
      type: 'quadric_hyperboloid',
      title: 'Hyperboloid Cooling Tower (Ruled Structural Surface)',
      subtitle: 'Double-Ruled Quadric Surface Formed by Straight Structural Beams',
      standardEquation: `\\frac{x^2 + y^2}{${a * a}} - \\frac{z^2}{c^2} = 1`,
      parametricFormula: 'x(u, v) = a\\cosh(v)\\cos(u), \\; y(u, v) = a\\cosh(v)\\sin(u), \\; z(u, v) = c\\sinh(v)',
      cbseTopic: 'CBSE Class 11 Conic Sections / Engineering Architecture',
      cbseChapter: 'Doubly-Ruled Surfaces: Built with Straight Steel Beams for High Aerodynamic Stability',
      properties: [
        { label: 'Narrowest Waist Radius', value: `${a} meters` },
        { label: 'Tower Height', value: `${h} meters` },
        { label: 'Structural Property', value: 'Hyperboloid of One Sheet (Doubly Ruled)' },
        { label: 'Natural Draft Convection', value: 'Narrow waist accelerates thermal updraft (Venturi effect)' },
      ],
      stepByStep: [
        '1. A hyperboloid of one sheet is generated by rotating a hyperbola around its conjugate axis.',
        '2. Remarkably, this curved 3D surface contains two complete families of straight lines.',
        '3. Cooling towers use this shape because straight steel reinforcement bars can create a curved, extremely rigid lattice.',
      ],
      voiceExplanation:
        'This cooling tower is a hyperboloid of one sheet. Even though its surface appears curved, it is doubly ruled, meaning it can be built entirely using straight steel bars. The narrow waist accelerates warm air upward through natural convection.',
      questionChallenge: {
        problemText:
          'A nuclear cooling tower is formed by rotating a hyperbola around its vertical axis. The waist diameter is 8 meters at height 10 meters, and base diameter is 16 meters. Model its ruled surface.',
        givenData: [
          { label: 'Waist Diameter', value: '8 m (r = 4 m)' },
          { label: 'Base Diameter', value: '16 m' },
          { label: 'Height', value: '12 m' },
        ],
        toFind: 'Ruled Quadric Equation & Venturi Profiles',
        difficulty: 'Exhibition Challenge',
        diagramType: 'universal_3d',
      },
      bounds: { minX: -8, maxX: 8, minY: -8, maxY: 8, minZ: -6, maxZ: 6 },
      keyPoints: [
        { label: 'Waist Throat', x: a, y: 0, z: 0, description: `Narrow waist r = ${a}m`, color: '#ec4899' },
      ],
      dimensions: { radius: a, height: h },
    };
  }

  // 12. Great Pyramid (Square Base Pyramid)
  if (lower.includes('pyramid') || lower.includes('square pyramid')) {
    const side = 10;
    const h = 8;
    const half = side / 2;
    const slantH = Math.sqrt(h * h + half * half); // √(64 + 25) = √89 ≈ 9.43m
    const baseArea = side * side;
    const vol = (1 / 3) * baseArea * h;
    const lateralArea = 2 * side * slantH;

    return {
      input: q,
      type: 'pyramid_square',
      title: 'Square Pyramid (Pyramidal Polyhedron)',
      subtitle: '3D Geometry of Polyhedra with Square Base and 4 Triangular Faces',
      standardEquation: `V = \\frac{1}{3} a^2 h = \\frac{1}{3}(${side}^2)(${h}) = ${vol.toFixed(1)}\\text{ m}^3`,
      cbseTopic: 'CBSE Class 9 & 10 Mensuration / Coordinate Geometry in 3D',
      cbseChapter: 'Pyramid Lateral Areas and Slant Height l = √(h² + (a/2)²)',
      properties: [
        { label: 'Base Side (a)', value: `${side} meters` },
        { label: 'Vertical Height (h)', value: `${h} meters` },
        { label: 'Slant Height (l)', value: `√(8² + 5²) = ${slantH.toFixed(2)} meters` },
        { label: 'Base Area', value: `${baseArea} m²` },
        { label: 'Lateral Area', value: `${lateralArea.toFixed(2)} m²` },
        { label: 'Pyramid Volume', value: `${vol.toFixed(1)} m³` },
      ],
      stepByStep: [
        `1. Base side a = ${side} m, perpendicular height h = ${h} m.`,
        `2. Distance from center to side edge is a/2 = ${half} m.`,
        `3. Slant height l = √(h² + (a/2)²) = √(64 + 25) = √89 ≈ ${slantH.toFixed(2)} m.`,
        `4. Volume = 1/3 × Base Area × Height = 1/3 × ${baseArea} × ${h} = ${vol.toFixed(1)} m³.`,
      ],
      voiceExplanation:
        `This square pyramid has a base of ${side} by ${side} meters and a vertical height of ${h} meters. Its triangular faces slope upward with a slant height of ${slantH.toFixed(2)} meters, enclosing a total volume of ${vol.toFixed(1)} cubic meters.`,
      questionChallenge: {
        problemText:
          'A square pyramid has a base side of 10 meters and a perpendicular vertical height of 8 meters. Find its slant height, lateral area, and volume.',
        givenData: [
          { label: 'Base Side a', value: '10 m' },
          { label: 'Vertical Height h', value: '8 m' },
          { label: 'Slant Height l', value: '9.43 m' },
        ],
        toFind: 'Slant Height, Lateral Area & Volume',
        difficulty: 'Board Exam',
        diagramType: 'pyramid',
      },
      bounds: { minX: -7, maxX: 7, minY: -7, maxY: 7, minZ: 0, maxZ: 10 },
      keyPoints: [
        { label: 'Apex', x: 0, y: h, z: 0, description: `Summit at (0, ${h}, 0)`, color: '#f59e0b' },
        { label: 'Base Corner', x: half, y: 0, z: half, description: 'Footprint corner', color: '#06b6d4' },
      ],
      dimensions: { base: side, height: h },
    };
  }

  // 13. Triangular Prism (Dispersion of Light)
  if (lower.includes('prism') || lower.includes('triangular prism')) {
    const side = 6;
    const len = 10;
    const baseArea = (Math.sqrt(3) / 4) * side * side;
    const vol = baseArea * len;
    const tsa = 2 * baseArea + 3 * side * len;

    return {
      input: q,
      type: 'triangular_prism',
      title: 'Equilateral Triangular Prism (Light Dispersion)',
      subtitle: 'Class 10 Science (Optics) & Class 9 Mensuration',
      standardEquation: `V = \\text{Area}_{\\text{triangle}} \\times L = \\frac{\\sqrt{3}}{4}s^2 L = ${vol.toFixed(1)}\\text{ cm}^3`,
      cbseTopic: 'CBSE Class 10 Science (Light Refraction) & Class 9 Mensuration',
      cbseChapter: 'Refraction and Dispersion of White Light by a Glass Prism',
      properties: [
        { label: 'Equilateral Side (s)', value: `${side} cm` },
        { label: 'Prism Length (L)', value: `${len} cm` },
        { label: 'Refracting Angle (A)', value: '60° (Equilateral Triangle)' },
        { label: 'Total Surface Area', value: `${tsa.toFixed(1)} cm²` },
        { label: 'Volume', value: `${vol.toFixed(1)} cm³` },
      ],
      stepByStep: [
        `1. Area of equilateral triangular base = (√3 / 4) × s² = (√3 / 4) × 36 ≈ ${baseArea.toFixed(2)} cm².`,
        `2. Volume = Base Area × Length = ${baseArea.toFixed(2)} × ${len} = ${vol.toFixed(1)} cm³.`,
        `3. Total Surface Area = 2 × Base Area + 3 × Rectangular Faces = 2(15.59) + 3(6 × 10) = 31.18 + 180 = 211.18 cm².`,
      ],
      voiceExplanation:
        'This glass triangular prism has equilateral triangular faces with sixty-degree refracting angles. As white light enters, different wavelengths refract at varying angles, dispersing into a rainbow spectrum.',
      questionChallenge: {
        problemText:
          'A glass triangular prism for light dispersion has equilateral triangular faces of side 6 cm and a length of 10 cm. Find its total surface area and volume.',
        givenData: [
          { label: 'Base Side s', value: '6 cm' },
          { label: 'Length L', value: '10 cm' },
          { label: 'Refracting Angle', value: '60°' },
        ],
        toFind: 'Total Surface Area & Volume',
        difficulty: 'Standard',
        diagramType: 'prism',
      },
      bounds: { minX: -6, maxX: 6, minY: -6, maxY: 6, minZ: -7, maxZ: 7 },
      keyPoints: [
        { label: 'Refracting Edge', x: 0, y: (Math.sqrt(3) / 2) * side, z: 0, description: 'Top optical edge', color: '#06b6d4' },
      ],
      dimensions: { base: side, height: len },
    };
  }

  // 14. Lighthouse Beacon / Conical Beam of Light (Heights & Distances)
  if (lower.includes('lighthouse') || lower.includes('beacon')) {
    const h = 50; // height
    const angleDeg = 30; // 30 deg
    const r = h / Math.tan((angleDeg * Math.PI) / 180); // 50 / tan(30) ≈ 86.6m
    const illuminatedArea = Math.PI * r * r;

    return {
      input: q,
      type: 'quadric_cone',
      title: 'Lighthouse Conical Light Beam (Trigonometry 3D)',
      subtitle: 'CBSE Class 10 Chapter 9: Some Applications of Trigonometry',
      standardEquation: `r = \\frac{h}{\\tan 30^\\circ} = 50\\sqrt{3} \\approx ${r.toFixed(1)}\\text{ m}`,
      cbseTopic: 'CBSE Class 10 Chapter 9: Some Applications of Trigonometry',
      cbseChapter: 'Heights and Distances: Angles of Depression and Conical Illumination',
      properties: [
        { label: 'Lighthouse Height (h)', value: `${h} meters` },
        { label: 'Depression Angle', value: `${angleDeg}°` },
        { label: 'Illuminated Sea Radius (r)', value: `${r.toFixed(1)} meters (50√3 m)` },
        { label: 'Illuminated Sea Surface Area', value: `${(illuminatedArea / 1000).toFixed(1)} thousand m²` },
      ],
      stepByStep: [
        `1. In right triangle formed by lighthouse tower, sea level, and line of sight:`,
        `2. tan(30°) = Opposite / Adjacent = h / r = 50 / r.`,
        `3. r = 50 / tan(30°) = 50 × √3 ≈ 50 × 1.732 = 86.6 meters.`,
        `4. Area of illuminated circular sea surface = πr² = π × (86.6)² ≈ 23,562 m².`,
      ],
      voiceExplanation:
        'From a 50-meter-high lighthouse, a 30-degree beam of light sweeps across the ocean surface, illuminating a circular safety perimeter with a radius of approximately 86.6 meters.',
      questionChallenge: {
        problemText:
          'A lighthouse of height 50 meters casts a conical beam of light subtending an angle of 30 degrees with the horizontal sea surface. Find the illuminated radius and area.',
        givenData: [
          { label: 'Lighthouse Height', value: '50 m' },
          { label: 'Beam Angle', value: '30°' },
          { label: 'tan(30°)', value: '1/√3 ≈ 0.577' },
        ],
        toFind: 'Illuminated Radius r = h / tan θ',
        difficulty: 'Standard',
        diagramType: 'universal_3d',
      },
      bounds: { minX: -10, maxX: 10, minY: -10, maxY: 10, minZ: 0, maxZ: 12 },
      keyPoints: [
        { label: 'Lamp Summit', x: 0, y: 10, z: 0, description: 'Lighthouse lamp apex', color: '#f59e0b' },
      ],
      dimensions: { radius: 8, height: 10 },
    };
  }

  // 15. 3D Torus (Donut Ring)
  if (lower.includes('torus') || lower.includes('donut')) {
    const R = 5;
    const r = 1.8;
    const vol = (2 * Math.PI * Math.PI * R * r * r).toFixed(1);
    const sa = (4 * Math.PI * Math.PI * R * r).toFixed(1);

    return {
      input: q,
      type: 'quadric_torus',
      title: '3D Geometric Torus (Donut Surface)',
      subtitle: 'Surface of Revolution Generated by Revolving a Circle in 3D Space',
      standardEquation: `(R - \\sqrt{x^2 + y^2})^2 + z^2 = r^2 \\quad (R = ${R}, r = ${r})`,
      parametricFormula: `x = (${R} + ${r}\\cos v)\\cos u, \\; y = (${R} + ${r}\\cos v)\\sin u, \\; z = ${r}\\sin v`,
      cbseTopic: 'Higher Calculus & Rotational Mensuration (Pappus Theorem)',
      cbseChapter: 'Pappus Centroid Theorem: Volume = (2πR)(πr²)',
      properties: [
        { label: 'Major Radius (R)', value: `${R} units` },
        { label: 'Minor Tube Radius (r)', value: `${r} units` },
        { label: 'Total Enclosed Volume', value: `2π²Rr² = ${vol} cu. units` },
        { label: 'Total Surface Area', value: `4π²Rr = ${sa} sq. units` },
      ],
      stepByStep: [
        '1. By Pappus Centroid Theorem, revolving a circle of radius r along a circular path of radius R sweeps a torus.',
        `2. Volume = (Circumference of path) × (Area of generating circle) = (2πR) × (πr²) = 2π²Rr² = ${vol}.`,
        `3. Surface Area = (Circumference of path) × (Perimeter of generating circle) = (2πR) × (2πr) = 4π²Rr = ${sa}.`,
      ],
      voiceExplanation:
        `This is a three-dimensional torus with major radius ${R} and tube radius ${r}. By Pappus centroid theorem, revolving a circle sweeps a surface area of four pi squared capital R small r.`,
      questionChallenge: {
        problemText:
          'A 3D torus has a major radius R = 5 units and tube radius r = 1.8 units. Calculate its volume and surface area using Pappus Centroid Theorem.',
        givenData: [
          { label: 'Major Radius R', value: '5 units' },
          { label: 'Minor Radius r', value: '1.8 units' },
        ],
        toFind: 'Volume & Surface Area via Pappus Theorem',
        difficulty: 'Exhibition Challenge',
        diagramType: 'universal_3d',
      },
      bounds: { minX: -8, maxX: 8, minY: -8, maxY: 8, minZ: -4, maxZ: 4 },
      keyPoints: [
        { label: 'Major Radius Rim', x: R, y: 0, z: 0, description: `R = ${R}`, color: '#06b6d4' },
      ],
      dimensions: { radius: R, radius2: r },
    };
  }

  // 16. Ellipsoid (Rugby Ball)
  if (lower.includes('ellipsoid') || lower.includes('spheroid') || lower.includes('rugby')) {
    const a = 6;
    const b = 4;
    const c = 3;
    const vol = ((4 / 3) * Math.PI * a * b * c).toFixed(1);

    return {
      input: q,
      type: 'quadric_ellipsoid',
      title: 'Ellipsoid of Revolution (3D Spheroid)',
      subtitle: 'Quadric Surface with Three Distinct Orthogonal Principal Radii',
      standardEquation: `\\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} + \\frac{z^2}{${c * c}} = 1`,
      parametricFormula: `x = ${a}\\sinφ\\cosθ, \\; y = ${b}\\sinφ\\sinθ, \\; z = ${c}\\cosφ`,
      cbseTopic: 'CBSE Class 11 3D Geometry & Multivariable Calculus',
      cbseChapter: 'Ellipsoidal Solids: Earth Oblate Spheroid & Celestial Mechanics',
      properties: [
        { label: 'Semi-Principal Axis a', value: `${a} units (X-axis)` },
        { label: 'Semi-Principal Axis b', value: `${b} units (Y-axis)` },
        { label: 'Semi-Principal Axis c', value: `${c} units (Z-axis)` },
        { label: 'Volume (4/3 π a b c)', value: `${vol} cu. units` },
      ],
      stepByStep: [
        `1. Standard form of tri-axial ellipsoid: x²/a² + y²/b² + z²/c² = 1.`,
        `2. Volume formula generalizes the sphere: V = 4/3 π a b c = 4/3 × π × ${a} × ${b} × ${c} = ${vol}.`,
        '3. Horizontal slices yield ellipses; vertical slices yield ellipses.',
      ],
      voiceExplanation:
        `This tri-axial ellipsoid has semi-axes of ${a}, ${b}, and ${c} units. Just as an ellipse generalizes a circle, an ellipsoid generalizes a sphere, enclosing a volume of four-thirds pi a b c.`,
      bounds: { minX: -8, maxX: 8, minY: -6, maxY: 6, minZ: -5, maxZ: 5 },
      keyPoints: [
        { label: 'Vertex X+', x: a, y: 0, z: 0, description: `(+${a}, 0, 0)`, color: '#06b6d4' },
        { label: 'Vertex Y+', x: 0, y: b, z: 0, description: `(0, +${b}, 0)`, color: '#10b981' },
        { label: 'Vertex Z+', x: 0, y: 0, z: c, description: `(0, 0, +${c})`, color: '#f59e0b' },
      ],
      dimensions: { a, b, c },
    };
  }

  // 17. Sombrero / Sinc Ripple Wave
  if (lower.includes('sombrero') || lower.includes('sinc') || lower.includes('ripple')) {
    const fn = (x: number, y: number) => {
      const r = Math.sqrt(x * x + y * y);
      return r === 0 ? 3 : (3 * Math.sin(r)) / r;
    };
    return {
      input: q,
      type: 'surface_3d',
      title: 'Sombrero Sinc Ripple Surface',
      subtitle: 'Radial Circular Wave Pattern Generated by Bessel / Sinc Function',
      standardEquation: 'z = 3 \\cdot \\frac{\\sin(\\sqrt{x^2 + y^2})}{\\sqrt{x^2 + y^2}}',
      cbseTopic: 'CBSE Class 11 Trigonometry & Calculus (Radial Symmetry)',
      cbseChapter: 'Wave Interference & Circular Diffraction Rings in Physics',
      properties: [
        { label: 'Function Form', value: 'z = 3 · sinc(r)' },
        { label: 'Peak Amplitude at Origin', value: '3.0 units (lim r→0 sin(r)/r = 1)' },
        { label: 'Radial Rings', value: 'Concentric circular ripple crests at r = 4.49, 7.72' },
      ],
      stepByStep: [
        '1. In polar coordinates, r = √(x² + y²), producing perfect radial symmetry.',
        '2. At the origin r = 0, applying L’Hôpital’s rule gives lim(r→0) sin(r)/r = 1, so z = 3.',
        '3. Alternating circular nodes and crests radiate outward with decaying amplitude 1/r.',
      ],
      voiceExplanation:
        'This is the iconic sombrero surface, formed by revolving the mathematical sinc function. It creates concentric circular ripples resembling a water droplet splash, with a central peak of three units.',
      evaluator: fn,
      bounds: { minX: -8, maxX: 8, minY: -8, maxY: 8, minZ: -1.5, maxZ: 3.5 },
      keyPoints: [
        { label: 'Apex Peak', x: 0, y: 0, z: 3, description: 'Central crown crest (+3.0)', color: '#06b6d4' },
      ],
    };
  }

  // 18. Check for Hyperbolic Paraboloid / Saddle: e.g. "z = x^2 - y^2" or "saddle"
  if (
    /x\s*\^?\s*2\s*-\s*y\s*\^?\s*2/i.test(q) ||
    lower.includes('hyperbolic paraboloid') ||
    lower.includes('saddle')
  ) {
    const a = 1;
    const b = 1;
    return {
      input: q,
      type: 'surface_3d',
      title: 'Hyperbolic Paraboloid (Saddle Surface)',
      subtitle: 'Quadric Surface of Double Curvature with Min-Max Saddle Point',
      standardEquation: 'z = \\frac{x^2}{a^2} - \\frac{y^2}{b^2}',
      parametricFormula: 'x(u, v) = u, \\; y(u, v) = v, \\; z(u, v) = u^2 - v^2',
      cbseTopic: 'Class 11 Three Dimensional Geometry & Conics / Class 12 Vector Calculus',
      cbseChapter: 'Curved Surfaces in Real-World Architecture (Pringles chip, Munich Olympic Roof)',
      properties: [
        { label: 'Surface Type', value: 'Ruled Quadric Surface' },
        { label: 'Saddle Point', value: '(0, 0, 0)', detail: 'Local minimum along x, local maximum along y' },
        { label: 'Gaussian Curvature', value: 'K < 0 (Strictly Negative)', detail: 'Anti-clastic hyperbolic geometry' },
        { label: 'Level Curves (z = c)', value: 'Hyperbolas in horizontal planes', detail: 'Asymptotes along y = ±x' },
        { label: 'Vertical Traces', value: 'Parabolas opening upward (x) & downward (y)' },
      ],
      stepByStep: [
        '1. Set y = 0 to inspect XZ plane trace: z = x², an upward-opening parabola with vertex at (0, 0, 0).',
        '2. Set x = 0 to inspect YZ plane trace: z = -y², a downward-opening parabola with apex at (0, 0, 0).',
        '3. At the origin (0, 0, 0), the gradient ∇z = (2x, -2y) = (0, 0). The second partial derivatives give D = (f_xx)(f_yy) - (f_xy)² = (2)(-2) - 0 = -4 < 0.',
        '4. By the Second Derivative Test, (0, 0, 0) is a stationary Saddle Point.',
      ],
      voiceExplanation:
        'This is a hyperbolic paraboloid, famously known as a saddle surface. Along the x-axis, the curve swoops upwards like a smiling parabola, while along the y-axis it drops downward. At the origin, both curvatures balance out into a saddle point.',
      evaluator: (x, y) => (x * x) / (a * a) - (y * y) / (b * b),
      bounds: { minX: -4, maxX: 4, minY: -4, maxY: 4, minZ: -8, maxZ: 8 },
      keyPoints: [
        { label: 'Saddle Point', x: 0, y: 0, z: 0, description: 'Minimax critical point (0, 0, 0)', color: '#06b6d4' },
        { label: 'Vertex X+', x: 2, y: 0, z: 4, description: 'Parabolic ridge', color: '#10b981' },
        { label: 'Vertex Y+', x: 0, y: 2, z: -4, description: 'Parabolic valley', color: '#f59e0b' },
      ],
      dimensions: { a: 1, b: 1 },
    };
  }

  // 19. Paraboloid of Revolution: e.g. "z = x^2 + y^2" or "paraboloid"
  if (
    /x\s*\^?\s*2\s*\+\s*y\s*\^?\s*2/i.test(q) &&
    !lower.includes('sqrt') &&
    !lower.includes('+ z') &&
    !lower.includes('= 25') &&
    !lower.includes('= 16') &&
    !lower.includes('= 9')
  ) {
    return {
      input: q,
      type: 'surface_3d',
      title: 'Elliptic Paraboloid of Revolution',
      subtitle: '3D Cup / Satellite Dish / Headlight Reflector Geometry',
      standardEquation: 'z = \\frac{x^2}{a^2} + \\frac{y^2}{b^2}',
      parametricFormula: 'x(r, θ) = r \\cosθ, \\; y(r, θ) = r \\sinθ, \\; z(r, θ) = r^2',
      cbseTopic: 'Class 10 Polynomials (Quadratic Applications) & Class 11 3D Geometry',
      cbseChapter: 'Parabolic Reflectors & Solar Cookers (NCERT Class 10 Light & Optics Connection)',
      properties: [
        { label: 'Surface Type', value: 'Elliptic Quadric of Revolution' },
        { label: 'Global Minimum', value: '(0, 0, 0) Vertex', detail: 'Lowest point of the basin' },
        { label: 'Axis of Symmetry', value: 'Z-Axis (x = 0, y = 0)', detail: 'Rotational symmetry about vertical' },
        { label: 'Horizontal Cross-Sections', value: 'Concentric Circles: x² + y² = c (for c > 0)' },
        { label: 'Focal Point', value: '(0, 0, 0.25)', detail: 'All incoming parallel rays reflect to this focus' },
      ],
      stepByStep: [
        '1. In cylindrical coordinates: let x = r cos(θ), y = r sin(θ). Then x² + y² = r².',
        '2. The equation simplifies to z = r², demonstrating perfect circular symmetry about the Z-axis.',
        '3. Vertical slices through any plane containing the Z-axis yield identical standard parabolas z = r².',
        '4. Reflective Property: Rays parallel to the Z-axis striking the bowl reflect precisely through the focal point at (0, 0, 1/4a).',
      ],
      voiceExplanation:
        'This is a paraboloid of revolution, the 3D surface created by rotating a parabola around its central axis. Satellite dishes, searchlight mirrors, and radio telescopes use this exact shape because every incoming wave bounces directly into the single focal point.',
      evaluator: (x, y) => 0.3 * (x * x + y * y),
      bounds: { minX: -4, maxX: 4, minY: -4, maxY: 4, minZ: 0, maxZ: 8 },
      keyPoints: [
        { label: 'Vertex (Min)', x: 0, y: 0, z: 0, description: 'Base apex at (0,0,0)', color: '#10b981' },
        { label: 'Optical Focus', x: 0, y: 0, z: 1.2, description: 'Reflector collector node', color: '#f59e0b' },
      ],
      dimensions: { a: 1, b: 1 },
    };
  }

  // 20. Sphere 3D: e.g. "x^2 + y^2 + z^2 = 25" or "sphere"
  if (
    /x\s*\^?\s*2\s*\+\s*y\s*\^?\s*2\s*\+\s*z\s*\^?\s*2/i.test(q) ||
    lower.includes('sphere')
  ) {
    let r = 5;
    const matchR2 = q.match(/=\s*(\d+(?:\.\d+)?)/);
    if (matchR2) {
      const val = parseFloat(matchR2[1]);
      r = Math.sqrt(val);
      if (r < 0.5) r = 4;
    }
    const matchRad = q.match(/radius\s*(?:of|=|:)?\s*(\d+(?:\.\d+)?)/i);
    if (matchRad) r = parseFloat(matchRad[1]);

    const surfaceArea = (4 * Math.PI * r * r).toFixed(2);
    const volume = ((4 / 3) * Math.PI * Math.pow(r, 3)).toFixed(2);

    return {
      input: q,
      type: 'quadric_sphere',
      title: `3D Quadric Sphere (Radius r = ${r})`,
      subtitle: 'Locus of Points in 3D Space Equidistant from Origin Center',
      standardEquation: `x^2 + y^2 + z^2 = ${Math.round(r * r)}`,
      parametricFormula: `x = ${r}\\sinφ\\cosθ, \\; y = ${r}\\sinφ\\sinθ, \\; z = ${r}\\cosφ`,
      cbseTopic: 'CBSE Class 10 Surface Areas & Volumes / Class 9 Circles Extension',
      cbseChapter: 'NCERT Class 10 Chapter 13: Surface Areas and Volumes of Spherical Solids',
      properties: [
        { label: 'Center C', value: '(0, 0, 0)', detail: 'Origin of 3D Cartesian frame' },
        { label: 'Radius r', value: `${r} units`, detail: `Diameter = ${2 * r} units` },
        { label: 'Total Surface Area', value: `4πr² = ${surfaceArea} sq. units` },
        { label: 'Enclosed Volume', value: `4/3 πr³ = ${volume} cu. units` },
        { label: 'Great Circle Circumference', value: `${(2 * Math.PI * r).toFixed(2)} units` },
      ],
      stepByStep: [
        `1. Standard Cartesian Form: (x - 0)² + (y - 0)² + (z - 0)² = r² where r = ${r}.`,
        `2. By 3D distance formula, the distance d = √(x² + y² + z²) is constant and equal to ${r}.`,
        `3. Slicing with horizontal plane z = 0 yields the equatorial Great Circle: x² + y² = ${r * r}.`,
        `4. Surface Area formula A = 4πr² = 4 × π × ${r}² = ${surfaceArea}.`,
        `5. Volume formula V = 4/3 πr³ = 4/3 × π × ${r}³ = ${volume}.`,
      ],
      voiceExplanation: `Here is a three-dimensional sphere with radius ${r}. In CBSE Class 10 geometry, a sphere is the set of all points in space that are exactly ${r} units away from the center. Its total surface area equals four pi r squared, and its volume is four-thirds pi r cubed.`,
      bounds: { minX: -r * 1.3, maxX: r * 1.3, minY: -r * 1.3, maxY: r * 1.3, minZ: -r * 1.3, maxZ: r * 1.3 },
      keyPoints: [
        { label: 'Center (0,0,0)', x: 0, y: 0, z: 0, description: 'Equidistant origin', color: '#06b6d4' },
        { label: 'North Pole', x: 0, y: 0, z: r, description: `Apex at (0, 0, ${r})`, color: '#10b981' },
        { label: 'Equator Point', x: r, y: 0, z: 0, description: `Radius vector (${r}, 0, 0)`, color: '#f59e0b' },
      ],
      dimensions: { radius: r },
    };
  }

  // 21. Cylinder
  if (lower.includes('cylinder')) {
    let r = 4;
    let h = 8;
    const matchRad = q.match(/radius\s*(?:of|=|:)?\s*(\d+(?:\.\d+)?)/i);
    if (matchRad) r = parseFloat(matchRad[1]);
    const matchH = q.match(/height\s*(?:of|=|:)?\s*(\d+(?:\.\d+)?)/i);
    if (matchH) h = parseFloat(matchH[1]);

    const csa = (2 * Math.PI * r * h).toFixed(2);
    const tsa = (2 * Math.PI * r * (r + h)).toFixed(2);
    const vol = (Math.PI * r * r * h).toFixed(2);

    return {
      input: q,
      type: 'quadric_cylinder',
      title: `Right Circular Cylinder (Radius ${r}, Height ${h})`,
      subtitle: 'Extruded Circular Locus Along Linear Axis',
      standardEquation: `x^2 + y^2 = ${r * r}, \\quad -${h / 2} \\le z \\le ${h / 2}`,
      parametricFormula: `x = ${r}\\cosθ, \\; y = ${r}\\sinθ, \\; z = z`,
      cbseTopic: 'CBSE Class 10 Chapter 13: Surface Areas and Volumes / Class 9 Mensuration',
      cbseChapter: 'Right Circular Cylinder Mensuration & Wireframe Cross-Sections',
      properties: [
        { label: 'Base Radius r', value: `${r} units` },
        { label: 'Cylinder Height h', value: `${h} units` },
        { label: 'Curved Surface Area (CSA)', value: `2πrh = ${csa} sq. units` },
        { label: 'Total Surface Area (TSA)', value: `2πr(r + h) = ${tsa} sq. units` },
        { label: 'Volume (V)', value: `πr²h = ${vol} cu. units` },
      ],
      stepByStep: [
        `1. Circular Cross-Section: At any height z, x² + y² = r² = ${r * r}.`,
        `2. Curved Surface Area: Unrolling the side rectangle gives length 2πr = ${(2 * Math.PI * r).toFixed(2)} and height ${h}. CSA = 2πrh = ${csa}.`,
        `3. Volume = Base Area × Height = πr²h = ${vol}.`,
      ],
      voiceExplanation: `This right circular cylinder has base radius ${r} and height ${h}. If you unroll the curved face, it forms a rectangle with width equal to two pi r and length equal to h.`,
      bounds: { minX: -r * 1.5, maxX: r * 1.5, minY: -r * 1.5, maxY: r * 1.5, minZ: -h * 0.7, maxZ: h * 0.7 },
      keyPoints: [
        { label: 'Base Center', x: 0, y: 0, z: -h / 2, description: 'Bottom circular center', color: '#06b6d4' },
        { label: 'Top Center', x: 0, y: 0, z: h / 2, description: 'Top circular center', color: '#10b981' },
      ],
      dimensions: { radius: r, height: h },
    };
  }

  // 22. Cone
  if (lower.includes('cone')) {
    let r = 4;
    let h = 7;
    const matchRad = q.match(/radius\s*(?:of|=|:)?\s*(\d+(?:\.\d+)?)/i);
    if (matchRad) r = parseFloat(matchRad[1]);
    const matchH = q.match(/height\s*(?:of|=|:)?\s*(\d+(?:\.\d+)?)/i);
    if (matchH) h = parseFloat(matchH[1]);

    const l = Math.sqrt(r * r + h * h);
    const csa = (Math.PI * r * l).toFixed(2);
    const vol = ((1 / 3) * Math.PI * r * r * h).toFixed(2);

    return {
      input: q,
      type: 'quadric_cone',
      title: `Right Circular Cone (r = ${r}, h = ${h})`,
      subtitle: 'Conical Solid Generated by Rotating Right Triangle Around Height Axis',
      standardEquation: `\\frac{x^2 + y^2}{${r * r}} = \\frac{(${h} - z)^2}{${h * h}}`,
      cbseTopic: 'CBSE Class 10 Chapter 13: Surface Areas and Volumes / Class 9 Surface Areas',
      cbseChapter: 'Cone Mensuration, Slant Height l = √(r² + h²)',
      properties: [
        { label: 'Base Radius r', value: `${r} units` },
        { label: 'Vertical Height h', value: `${h} units` },
        { label: 'Slant Height l', value: `√(r² + h²) = ${l.toFixed(2)} units` },
        { label: 'Curved Surface Area', value: `πrl = ${csa} sq. units` },
        { label: 'Volume', value: `1/3 πr²h = ${vol} cu. units` },
      ],
      stepByStep: [
        `1. By Pythagorean theorem, the slant height is l = √(${r}² + ${h}²) = ${l.toFixed(2)}.`,
        `2. Curved Area = πrl = ${csa}.`,
        `3. Volume = 1/3 × Base Area × Height = 1/3 × π × ${r}² × ${h} = ${vol}.`,
      ],
      voiceExplanation: `Here is a right circular cone with radius ${r} and height ${h}. Its slant height is computed using Pythagoras theorem as the square root of r squared plus h squared, which equals ${l.toFixed(2)}.`,
      bounds: { minX: -r * 1.5, maxX: r * 1.5, minY: -r * 1.5, maxY: r * 1.5, minZ: 0, maxZ: h * 1.2 },
      keyPoints: [
        { label: 'Cone Apex', x: 0, y: 0, z: h, description: `Vertex top at (0, 0, ${h})`, color: '#ec4899' },
        { label: 'Base Center', x: 0, y: 0, z: 0, description: 'Center of circular base', color: '#06b6d4' },
      ],
      dimensions: { radius: r, height: h },
    };
  }

  // 23. Inscribed Cylinder in Sphere
  if (lower.includes('inscribed')) {
    const R = 6;
    const r = 4;
    const h = 2 * Math.sqrt(R * R - r * r);
    return {
      input: q,
      type: 'inscribed_composite',
      title: 'Cylinder Inscribed Inside a Sphere',
      subtitle: 'Classic CBSE Class 10 & 12 Optimization & Solid Geometry Problem',
      standardEquation: `x^2 + y^2 + z^2 = ${R * R} \\quad \\text{with} \\quad x^2 + y^2 = ${r * r}`,
      cbseTopic: 'CBSE Class 10 Surface Areas & Volumes / Class 12 Application of Derivatives',
      cbseChapter: 'Finding Maximum Volume of Inscribed Cylinder in Sphere of Radius R',
      properties: [
        { label: 'Sphere Radius R', value: `${R} units` },
        { label: 'Inscribed Cylinder Radius r', value: `${r} units` },
        { label: 'Inscribed Cylinder Height h', value: `${h.toFixed(2)} units` },
        { label: 'Pythagorean Relation', value: 'r² + (h/2)² = R²' },
      ],
      stepByStep: [
        `1. The cross section through the vertical axis is a rectangle inscribed in a circle of radius R = ${R}.`,
        `2. The diagonal of the rectangle is the sphere's diameter 2R = ${2 * R}.`,
        `3. By Pythagoras: (2r)² + h² = (2R)², so 4r² + h² = 4R² ⇒ r² = R² - h²/4.`,
      ],
      voiceExplanation:
        'This 3D composite displays a cylinder inscribed snugly inside a sphere. Notice how the top and bottom circular rims of the cylinder touch the spherical shell perfectly.',
      bounds: { minX: -R * 1.3, maxX: R * 1.3, minY: -R * 1.3, maxY: R * 1.3, minZ: -R * 1.3, maxZ: R * 1.3 },
      keyPoints: [
        { label: 'Sphere Rim', x: R, y: 0, z: 0, description: `Sphere Radius R = ${R}`, color: '#06b6d4' },
        { label: 'Cylinder Top Rim', x: r, y: 0, z: h / 2, description: 'Contact boundary', color: '#f59e0b' },
      ],
      dimensions: { radius: R, radius2: r, height: h },
    };
  }

  // 24. Parabolic Arch Bridge
  if (lower.includes('arch') || lower.includes('bridge') || (lower.includes('parabola') && lower.includes('wide'))) {
    let span = 20;
    let height = 5;
    const matchW = q.match(/(?:wide|span|width)\s*(?:of|=|:)?\s*(\d+(?:\.\d+)?)/i);
    if (matchW) span = parseFloat(matchW[1]);
    const matchH = q.match(/(?:high|height)\s*(?:of|=|:)?\s*(\d+(?:\.\d+)?)/i);
    if (matchH) height = parseFloat(matchH[1]);

    const halfSpan = span / 2;
    const a = height / (halfSpan * halfSpan);
    const focalLength = 1 / (4 * a);

    return {
      input: q,
      type: 'conic_parabola',
      title: `Parabolic Arch Bridge (Span ${span}m, Height ${height}m)`,
      subtitle: 'Real-World Architectural Application of CBSE Class 10 Quadratic Curves',
      standardEquation: `y = -${a.toFixed(4)}x^2 + ${height}`,
      parametricFormula: `x(t) = t, \\; y(t) = -${a.toFixed(4)}t^2 + ${height}`,
      cbseTopic: 'CBSE Class 10 Chapter 2: Polynomials & Chapter 4: Quadratic Equations',
      cbseChapter: 'Word Problem: Structural Engineering using Inverted Parabolas',
      properties: [
        { label: 'Total Base Span', value: `${span} meters`, detail: `Base roots at x = ±${halfSpan} m` },
        { label: 'Maximum Height', value: `${height} meters`, detail: `Vertex at (0, ${height})` },
        { label: 'Quadratic Coefficient a', value: `-${a.toFixed(4)}`, detail: 'Governs the downward curvature' },
        { label: 'Focal Distance (f)', value: `${focalLength.toFixed(2)} m below apex` },
      ],
      stepByStep: [
        `1. Choose coordinate axes with the origin at ground center directly beneath the apex.`,
        `2. The apex is at (0, ${height}), giving standard vertex form: y = -a·x² + ${height}.`,
        `3. The bridge touches ground at x = ±${span}/2 = ±${halfSpan}, where y = 0.`,
        `4. Substitute (±${halfSpan}, 0): 0 = -a(${halfSpan})² + ${height} ⇒ a = ${height} / ${halfSpan * halfSpan} = ${a.toFixed(4)}.`,
      ],
      voiceExplanation: `This parabolic arch spans ${span} meters across with a peak clearance of ${height} meters. Using CBSE Class 10 quadratic vertex form, the coefficient a is calculated as ${a.toFixed(4)}.`,
      questionChallenge: {
        problemText: `A bridge arch in the shape of a parabola is ${span} meters wide at the base and has a maximum height of ${height} meters. Find the equation of the parabolic arch.`,
        givenData: [
          { label: 'Base Span', value: `${span} m` },
          { label: 'Max Height', value: `${height} m` },
          { label: 'Vertex', value: `(0, ${height})` },
        ],
        toFind: 'Parabolic Equation y = -ax² + h',
        difficulty: 'Exhibition Challenge',
        diagramType: 'parabolic_arch',
      },
      bounds: { minX: -halfSpan * 1.3, maxX: halfSpan * 1.3, minY: -2, maxY: height * 1.3, minZ: -3, maxZ: 3 },
      keyPoints: [
        { label: 'Apex Vertex', x: 0, y: height, z: 0, description: `Peak height ${height}m`, color: '#10b981' },
        { label: 'Left Abutment', x: -halfSpan, y: 0, z: 0, description: `Root at (-${halfSpan}, 0)`, color: '#06b6d4' },
        { label: 'Right Abutment', x: halfSpan, y: 0, z: 0, description: `Root at (${halfSpan}, 0)`, color: '#f59e0b' },
      ],
      dimensions: { a: -a, b: 0, c: height, h: 0, k: height, width: span, height: height },
    };
  }

  // 25. Circle 2D Conic
  if (lower.includes('circle') || /x\s*\^?\s*2\s*\+\s*y\s*\^?\s*2\s*=\s*\d+/i.test(q)) {
    let r = 5;
    let h = 0;
    let k = 0;
    const matchR2 = q.match(/=\s*(\d+(?:\.\d+)?)/);
    if (matchR2) {
      const val = parseFloat(matchR2[1]);
      if (val > 0) r = Math.sqrt(val);
    }
    const matchCenter = q.match(/center(?:ed)?\s*(?:at)?\s*\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)/i);
    if (matchCenter) {
      h = parseFloat(matchCenter[1]);
      k = parseFloat(matchCenter[2]);
    }
    const matchRad = q.match(/radius\s*(?:of|=|:)?\s*(\d+(?:\.\d+)?)/i);
    if (matchRad) r = parseFloat(matchRad[1]);

    const area = (Math.PI * r * r).toFixed(2);
    const circum = (2 * Math.PI * r).toFixed(2);

    return {
      input: q,
      type: 'conic_circle',
      title: `Circle (Center (${h}, ${k}), Radius ${r})`,
      subtitle: 'Conic Section with Zero Eccentricity (e = 0)',
      standardEquation: `(x - ${h})^2 + (y - ${k})^2 = ${r * r}`,
      cbseTopic: 'CBSE Class 10 Chapter 10: Circles & Class 9 Chapter 10',
      cbseChapter: 'Tangents to a Circle & Cartesian Distance Formula Extension',
      properties: [
        { label: 'Center (h, k)', value: `(${h}, ${k})` },
        { label: 'Radius (r)', value: `${r} units`, detail: `Diameter = ${2 * r} units` },
        { label: 'Area', value: `πr² = ${area} sq. units` },
        { label: 'Circumference', value: `2πr = ${circum} units` },
      ],
      stepByStep: [
        `1. Standard Cartesian equation of a circle with center (h, k) and radius r is (x - h)² + (y - k)² = r².`,
        `2. Substituting center (${h}, ${k}) and r = ${r}: (x - ${h})² + (y - ${k})² = ${r * r}.`,
      ],
      voiceExplanation: `Here is a circle centered at coordinates (${h}, ${k}) with radius ${r}. In CBSE geometry, every point on this curve maintains a constant Euclidean distance of ${r} from the center.`,
      bounds: { minX: h - r * 1.5, maxX: h + r * 1.5, minY: k - r * 1.5, maxY: k + r * 1.5, minZ: -2, maxZ: 2 },
      keyPoints: [
        { label: 'Center C', x: h, y: k, z: 0, description: `Center (${h}, ${k})`, color: '#06b6d4' },
      ],
      dimensions: { radius: r, h, k },
    };
  }

  // 26. Rhombus
  if (lower.includes('rhombus')) {
    let d1 = 12;
    let d2 = 16;
    const matchNums = q.match(/\d+(?:\.\d+)?/g);
    if (matchNums && matchNums.length >= 2) {
      d1 = parseFloat(matchNums[0]);
      d2 = parseFloat(matchNums[1]);
    }
    const side = Math.sqrt(Math.pow(d1 / 2, 2) + Math.pow(d2 / 2, 2));
    const area = (0.5 * d1 * d2).toFixed(2);
    const perimeter = (4 * side).toFixed(2);

    return {
      input: q,
      type: 'polygon_rhombus',
      title: `Rhombus (Diagonals d₁ = ${d1}, d₂ = ${d2})`,
      subtitle: 'Equilateral Quadrilateral with Perpendicular Bisecting Diagonals',
      standardEquation: `\\text{Area} = \\frac{1}{2} d_1 d_2 = \\frac{1}{2}(${d1})(${d2}) = ${area}`,
      cbseTopic: 'CBSE Class 9 Chapter 8: Quadrilaterals & Chapter 9: Areas',
      cbseChapter: 'Theorems on Rhombus: Diagonals are Perpendicular Bisectors of Each Other',
      properties: [
        { label: 'Diagonal 1 (d₁)', value: `${d1} units` },
        { label: 'Diagonal 2 (d₂)', value: `${d2} units` },
        { label: 'Side Length (a)', value: `√((d₁/2)² + (d₂/2)²) = ${side.toFixed(2)} units` },
        { label: 'Area', value: `${area} sq. units` },
        { label: 'Perimeter (4a)', value: `${perimeter} units` },
      ],
      stepByStep: [
        `1. The diagonals of a rhombus bisect each other at 90° angles at the origin.`,
        `2. Half diagonals are ${d1 / 2} and ${d2 / 2}.`,
        `3. Side a = √(${d1 / 2}² + ${d2 / 2}²) = √(${Math.pow(d1 / 2, 2) + Math.pow(d2 / 2, 2)}) = ${side.toFixed(2)}.`,
        `4. Area = 1/2 × d₁ × d₂ = 1/2 × ${d1} × ${d2} = ${area} sq. units.`,
      ],
      voiceExplanation: `This rhombus has diagonals of ${d1} and ${d2} units. Its four equal sides measure ${side.toFixed(2)} units, and its area is calculated as half the product of its diagonals, giving ${area} square units.`,
      bounds: { minX: -d1 / 2 - 2, maxX: d1 / 2 + 2, minY: -d2 / 2 - 2, maxY: d2 / 2 + 2, minZ: -2, maxZ: 2 },
      keyPoints: [
        { label: 'Vertex A', x: -d1 / 2, y: 0, z: 0, description: 'Left vertex', color: '#ec4899' },
        { label: 'Vertex B', x: 0, y: d2 / 2, z: 0, description: 'Top vertex', color: '#ec4899' },
        { label: 'Vertex C', x: d1 / 2, y: 0, z: 0, description: 'Right vertex', color: '#ec4899' },
        { label: 'Vertex D', x: 0, y: -d2 / 2, z: 0, description: 'Bottom vertex', color: '#ec4899' },
      ],
      dimensions: { d1, d2, side },
    };
  }

  // 27. Parallelogram
  if (lower.includes('parallelogram')) {
    let base = 10;
    let height = 6;
    const skew = 2.5;
    const matchNums = q.match(/\d+(?:\.\d+)?/g);
    if (matchNums && matchNums.length >= 2) {
      base = parseFloat(matchNums[0]);
      height = parseFloat(matchNums[1]);
    }
    const area = base * height;
    const side2 = Math.sqrt(skew * skew + height * height);

    return {
      input: q,
      type: 'polygon_parallelogram',
      title: `Parallelogram (Base ${base}, Height ${height})`,
      subtitle: 'Quadrilateral with Equal & Parallel Opposite Sides',
      standardEquation: `\\text{Area} = \\text{Base} \\times \\text{Height} = ${base} \\times ${height} = ${area}`,
      cbseTopic: 'CBSE Class 9 Chapter 8: Quadrilaterals & Chapter 9: Areas',
      cbseChapter: 'Parallelograms on Same Base and Between Same Parallels Have Equal Area',
      properties: [
        { label: 'Base (b)', value: `${base} units` },
        { label: 'Perpendicular Height (h)', value: `${height} units` },
        { label: 'Slanted Side', value: `${side2.toFixed(2)} units` },
        { label: 'Area (b × h)', value: `${area} sq. units` },
      ],
      stepByStep: [
        `1. Opposite sides are equal and parallel: AB || CD and BC || DA.`,
        `2. Area = Base × Altitude = ${base} × ${height} = ${area} sq. units.`,
      ],
      voiceExplanation: `Here is a parallelogram with base ${base} and vertical altitude ${height}. Its area is calculated directly as base times height, yielding ${area} square units.`,
      bounds: { minX: -base, maxX: base + skew, minY: -height, maxY: height, minZ: -1, maxZ: 1 },
      keyPoints: [
        { label: 'Corner A', x: -base / 2, y: -height / 2, z: 0, description: 'Bottom-left', color: '#8b5cf6' },
        { label: 'Corner B', x: base / 2, y: -height / 2, z: 0, description: 'Bottom-right', color: '#8b5cf6' },
      ],
      dimensions: { base, height, skew },
    };
  }

  // 28. Wave / Trigonometric Surface
  if (lower.includes('sin') || lower.includes('cos') || lower.includes('wave')) {
    const fn = compileFunctionZ(q) || ((x: number, y: number) => 1.8 * Math.sin(x) * Math.cos(y));
    return {
      input: q,
      type: 'surface_3d',
      title: 'Trigonometric Harmonic Wave Surface',
      subtitle: 'Bivariate Periodic Oscillation in 3D Space',
      standardEquation: 'z = A \\sin(kx) \\cos(ky)',
      cbseTopic: 'Class 10 Trigonometry Foundations / Class 11 Trigonometric Functions',
      cbseChapter: 'Harmonic Oscillations & Stationary Waves in Physical Media',
      properties: [
        { label: 'Surface Class', value: 'Periodic Orthogonal Wave Grid' },
        { label: 'Peak Amplitude', value: '±1.8 units' },
        { label: 'Periodicity', value: '2π along X and Y axes' },
      ],
      stepByStep: [
        '1. The height z is the product of two orthogonal sinusoids: sin(x) and cos(y).',
        '2. When x = 0, π, 2π, sin(x) = 0, creating flat nodal lines independent of y.',
      ],
      voiceExplanation:
        'This 3D harmonic wave surface demonstrates how multiplying sine and cosine functions produces an undulating egg-crate wave pattern.',
      evaluator: fn,
      bounds: { minX: -5, maxX: 5, minY: -5, maxY: 5, minZ: -2.5, maxZ: 2.5 },
      keyPoints: [
        { label: 'Wave Peak', x: Math.PI / 2, y: 0, z: 1.8, description: 'Crest (+1.8)', color: '#06b6d4' },
      ],
    };
  }

  // 29. Generic Algebraic Function fallback
  const compiled = compileFunctionZ(q);
  if (compiled) {
    return {
      input: q,
      type: 'surface_3d',
      title: `Mathematical Surface: ${q.replace(/^z\s*=\s*/i, 'z = ')}`,
      subtitle: 'Explicit 3D Bivariate Real-Function Surface z = f(x, y)',
      standardEquation: q.includes('=') ? q : `z = ${q}`,
      cbseTopic: 'CBSE Coordinate Geometry & Calculus Real-Function Plotting',
      cbseChapter: 'Graphing Algebraic Functions in 3D Coordinate Space',
      properties: [
        { label: 'Input Equation', value: q },
        { label: 'Coordinate Domain', value: 'x ∈ [-4, 4], y ∈ [-4, 4]' },
        { label: 'Evaluation Engine', value: 'Real-time High-Precision 60fps WebGL' },
      ],
      stepByStep: [
        `1. Given mathematical function: ${q}.`,
        '2. Evaluated over a discrete 50x50 lattice in the XY plane.',
      ],
      voiceExplanation: `Here is the three-dimensional graph of your custom equation: ${q}.`,
      evaluator: compiled,
      bounds: { minX: -4, maxX: 4, minY: -4, maxY: 4, minZ: -6, maxZ: 6 },
      keyPoints: [
        { label: 'Origin Point', x: 0, y: 0, z: compiled(0, 0), description: 'f(0, 0)', color: '#06b6d4' },
      ],
    };
  }

  // 30. Default fallback
  return {
    input: q,
    type: 'surface_3d',
    title: 'Hyperbolic Saddle Surface (Default Equation z = x² - y²)',
    subtitle: 'Classic Quadric Surface for Demonstration',
    standardEquation: 'z = x^2 - y^2',
    cbseTopic: 'CBSE Class 10/11 Polynomial & Coordinate Geometry',
    cbseChapter: 'Three-Dimensional Coordinate Geometry & Quadratic Surfaces',
    properties: [
      { label: 'Equation', value: 'z = x² - y²' },
      { label: 'Saddle Point', value: '(0, 0, 0)' },
    ],
    stepByStep: [
      '1. Type any algebraic equation like z = x^2 - y^2, x^2 + y^2 = 25, or z = sin(x)*cos(y).',
      '2. Or pick any question from the 32+ curated CBSE problems below!',
    ],
    voiceExplanation: 'Displaying the standard saddle surface z equals x squared minus y squared.',
    evaluator: (x, y) => x * x - y * y,
    bounds: { minX: -4, maxX: 4, minY: -4, maxY: 4, minZ: -8, maxZ: 8 },
    keyPoints: [
      { label: 'Origin (0, 0, 0)', x: 0, y: 0, z: 0, description: 'Saddle center', color: '#06b6d4' },
    ],
  };
}
