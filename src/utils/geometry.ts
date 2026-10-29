import {
  MathPoint,
  Point,
  CoordinateSystem,
  CircleParams,
  SquareParams,
  RectangleParams,
  TriangleParams,
  RhombusParams,
  ParallelogramParams,
  ParabolaParams,
  SlopeParams,
} from '../types';

export function toMathCoords(p: Point, sys: CoordinateSystem): MathPoint {
  return {
    x: Number(((p.x - sys.originX) / sys.pixelsPerUnit).toFixed(3)),
    y: Number(((sys.originY - p.y) / sys.pixelsPerUnit).toFixed(3)),
  };
}

export function toPixelCoords(mp: MathPoint, sys: CoordinateSystem): Point {
  return {
    x: sys.originX + mp.x * sys.pixelsPerUnit,
    y: sys.originY - mp.y * sys.pixelsPerUnit,
  };
}

export function rotatePoint(p: MathPoint, center: MathPoint, angleDeg: number): MathPoint {
  const rad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const dx = p.x - center.x;
  const dy = p.y - center.y;
  return {
    x: Number((center.x + dx * cos - dy * sin).toFixed(3)),
    y: Number((center.y + dx * sin + dy * cos).toFixed(3)),
  };
}

// ----------------------------------------------------
// CIRCLE GEOMETRY (CBSE Class 10 Ch 10 & Ch 12)
// ----------------------------------------------------
export function fitCircleFrom3Points(p1: MathPoint, p2: MathPoint, p3: MathPoint): CircleParams | null {
  const x1 = p1.x, y1 = p1.y;
  const x2 = p2.x, y2 = p2.y;
  const x3 = p3.x, y3 = p3.y;

  const d = 2 * (x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2));
  if (Math.abs(d) < 1e-6) return null;

  const p1Sq = x1 * x1 + y1 * y1;
  const p2Sq = x2 * x2 + y2 * y2;
  const p3Sq = x3 * x3 + y3 * y3;

  const h = (p1Sq * (y2 - y3) + p2Sq * (y3 - y1) + p3Sq * (y1 - y2)) / d;
  const k = (p1Sq * (x3 - x2) + p2Sq * (x1 - x3) + p3Sq * (x2 - x1)) / d;
  const r = Math.sqrt((x1 - h) ** 2 + (y1 - k) ** 2);

  return {
    h: Number(h.toFixed(2)),
    k: Number(k.toFixed(2)),
    r: Number(r.toFixed(2)),
    showTangents: true,
    showSector: true,
    sectorAngle: 60,
  };
}

export function calculateCircleMetrics(params: CircleParams) {
  const r = Math.max(0.01, params.r);
  const diameter = 2 * r;
  const circumference = 2 * Math.PI * r;
  const area = Math.PI * r * r;

  const hSign = params.h >= 0 ? `- ${params.h.toFixed(2)}` : `+ ${Math.abs(params.h).toFixed(2)}`;
  const kSign = params.k >= 0 ? `- ${params.k.toFixed(2)}` : `+ ${Math.abs(params.k).toFixed(2)}`;
  const standardEq = `(x ${hSign})² + (y ${kSign})² = ${(r * r).toFixed(2)}`;

  const twoG = -2 * params.h;
  const twoF = -2 * params.k;
  const c = params.h * params.h + params.k * params.k - r * r;
  const generalEq = `x² + y² ${twoG >= 0 ? '+ ' + twoG.toFixed(2) : '- ' + Math.abs(twoG).toFixed(2)}x ${twoF >= 0 ? '+ ' + twoF.toFixed(2) : '- ' + Math.abs(twoF).toFixed(2)}y ${c >= 0 ? '+ ' + c.toFixed(2) : '- ' + Math.abs(c).toFixed(2)} = 0`;

  const sectorAngle = params.sectorAngle || 60;
  const sectorArea = (sectorAngle / 360) * area;
  const arcLength = (sectorAngle / 360) * circumference;

  return {
    radius: r,
    diameter,
    circumference,
    area,
    standardEq,
    generalEq,
    sectorArea,
    arcLength,
  };
}

// ----------------------------------------------------
// SQUARE GEOMETRY (CBSE Class 9 Ch 8 Quadrilaterals & Mensuration)
// ----------------------------------------------------
export function calculateSquareMetrics(p: SquareParams) {
  const s = Math.max(0.1, p.side);
  const area = s * s;
  const perimeter = 4 * s;
  const diagonal = s * Math.SQRT2;
  const inradius = s / 2;
  const circumradius = s / Math.SQRT2;

  const half = s / 2;
  const center: MathPoint = { x: p.h, y: p.k };
  const rawVertices: MathPoint[] = [
    { x: p.h - half, y: p.k + half }, // Top-Left A
    { x: p.h + half, y: p.k + half }, // Top-Right B
    { x: p.h + half, y: p.k - half }, // Bottom-Right C
    { x: p.h - half, y: p.k - half }, // Bottom-Left D
  ];

  const vertices = rawVertices.map((v) => rotatePoint(v, center, p.rotationDeg));

  return {
    side: s,
    area,
    perimeter,
    diagonal,
    inradius,
    circumradius,
    vertices,
    standardEq: `Area = s² = ${(s * s).toFixed(2)} m² | Diagonal = ${(s * Math.SQRT2).toFixed(2)} m`,
  };
}

// ----------------------------------------------------
// RECTANGLE GEOMETRY (CBSE Class 9 Ch 8 Quadrilaterals - Phone, Tab)
// ----------------------------------------------------
export function calculateRectangleMetrics(p: RectangleParams) {
  const w = Math.max(0.1, p.width);
  const h = Math.max(0.1, p.height);
  const area = w * h;
  const perimeter = 2 * (w + h);
  const diagonal = Math.sqrt(w * w + h * h);
  const aspectRatio = (w / h).toFixed(2);

  const hw = w / 2;
  const hh = h / 2;
  const center: MathPoint = { x: p.h, y: p.k };
  const rawVertices: MathPoint[] = [
    { x: p.h - hw, y: p.k + hh }, // A
    { x: p.h + hw, y: p.k + hh }, // B
    { x: p.h + hw, y: p.k - hh }, // C
    { x: p.h - hw, y: p.k - hh }, // D
  ];

  const vertices = rawVertices.map((v) => rotatePoint(v, center, p.rotationDeg));

  return {
    width: w,
    height: h,
    area,
    perimeter,
    diagonal,
    aspectRatio,
    vertices,
    standardEq: `Area = ${w.toFixed(2)} × ${h.toFixed(2)} = ${area.toFixed(2)} m² | d = ${diagonal.toFixed(2)} m`,
  };
}

// ----------------------------------------------------
// TRIANGLE GEOMETRY (CBSE Class 9 Heron's Formula & Class 10 Ch 6)
// ----------------------------------------------------
export function calculateTriangleMetrics(p: TriangleParams) {
  const a = Math.hypot(p.x3 - p.x2, p.y3 - p.y2); // BC
  const b = Math.hypot(p.x1 - p.x3, p.y1 - p.y3); // AC
  const c = Math.hypot(p.x2 - p.x1, p.y2 - p.y1); // AB

  const perimeter = a + b + c;
  const s = perimeter / 2;
  // Heron's formula
  const heronArea = Math.sqrt(Math.max(0, s * (s - a) * (s - b) * (s - c)));

  // Coordinate Geometry Area Formula: 0.5 * |x1(y2-y3) + x2(y3-y1) + x3(y1-y2)|
  const coordArea = 0.5 * Math.abs(p.x1 * (p.y2 - p.y3) + p.x2 * (p.y3 - p.y1) + p.x3 * (p.y1 - p.y2));

  // Centroid G( (x1+x2+x3)/3, (y1+y2+y3)/3 )
  const centroid: MathPoint = {
    x: Number(((p.x1 + p.x2 + p.x3) / 3).toFixed(2)),
    y: Number(((p.y1 + p.y2 + p.y3) / 3).toFixed(2)),
  };

  // Interior angles via Law of Cosines
  const angleA = (Math.acos(Math.max(-1, Math.min(1, (b * b + c * c - a * a) / (2 * b * c)))) * 180) / Math.PI;
  const angleB = (Math.acos(Math.max(-1, Math.min(1, (a * a + c * c - b * b) / (2 * a * c)))) * 180) / Math.PI;
  const angleC = 180 - (angleA + angleB);

  // Classification
  let type = 'Scalene Triangle';
  if (Math.abs(a - b) < 0.1 && Math.abs(b - c) < 0.1) {
    type = 'Equilateral Triangle (60°, 60°, 60°)';
  } else if (Math.abs(a - b) < 0.1 || Math.abs(b - c) < 0.1 || Math.abs(a - c) < 0.1) {
    type = 'Isosceles Triangle';
  }
  const sides = [a, b, c].sort((s1, s2) => s1 - s2);
  if (Math.abs(sides[0] ** 2 + sides[1] ** 2 - sides[2] ** 2) < 0.25) {
    type += ' (Right-Angled)';
  }

  return {
    sideA: a,
    sideB: b,
    sideC: c,
    perimeter,
    semiPerimeter: s,
    area: heronArea || coordArea,
    centroid,
    angleA,
    angleB,
    angleC,
    type,
    standardEq: `Heron's Area = √[s(s-a)(s-b)(s-c)] = ${(heronArea || coordArea).toFixed(2)} m²`,
  };
}

// ----------------------------------------------------
// RHOMBUS GEOMETRY (CBSE Class 9 Ch 8 Quadrilaterals - Kites & Toys)
// ----------------------------------------------------
export function calculateRhombusMetrics(p: RhombusParams) {
  const d1 = Math.max(0.1, p.d1);
  const d2 = Math.max(0.1, p.d2);
  const area = 0.5 * d1 * d2;
  const side = Math.hypot(d1 / 2, d2 / 2);
  const perimeter = 4 * side;

  const center: MathPoint = { x: p.h, y: p.k };
  const rawVertices: MathPoint[] = [
    { x: p.h, y: p.k + d2 / 2 }, // Top vertex
    { x: p.h + d1 / 2, y: p.k }, // Right vertex
    { x: p.h, y: p.k - d2 / 2 }, // Bottom vertex
    { x: p.h - d1 / 2, y: p.k }, // Left vertex
  ];

  const vertices = rawVertices.map((v) => rotatePoint(v, center, p.rotationDeg));

  return {
    d1,
    d2,
    side,
    area,
    perimeter,
    vertices,
    standardEq: `Area = ½ × d₁ × d₂ = ${(area).toFixed(2)} m² | Side = ${side.toFixed(2)} m`,
  };
}

// ----------------------------------------------------
// PARALLELOGRAM GEOMETRY (CBSE Class 9 Ch 8 Quadrilaterals)
// ----------------------------------------------------
export function calculateParallelogramMetrics(p: ParallelogramParams) {
  const base = Math.max(0.1, p.base);
  const height = Math.max(0.1, p.height);
  const skew = p.skew;
  const area = base * height;
  const slantSide = Math.hypot(skew, height);
  const perimeter = 2 * (base + slantSide);

  const center: MathPoint = { x: p.h, y: p.k };
  const hw = base / 2;
  const hh = height / 2;
  const hs = skew / 2;

  const rawVertices: MathPoint[] = [
    { x: p.h - hw + hs, y: p.k + hh }, // Top-Left
    { x: p.h + hw + hs, y: p.k + hh }, // Top-Right
    { x: p.h + hw - hs, y: p.k - hh }, // Bottom-Right
    { x: p.h - hw - hs, y: p.k - hh }, // Bottom-Left
  ];

  const vertices = rawVertices.map((v) => rotatePoint(v, center, p.rotationDeg));

  return {
    base,
    height,
    slantSide,
    skew,
    area,
    perimeter,
    vertices,
    standardEq: `Area = Base × Height = ${base.toFixed(2)} × ${height.toFixed(2)} = ${area.toFixed(2)} m²`,
  };
}

// ----------------------------------------------------
// PARABOLA GEOMETRY (CBSE Class 10 Ch 2 & Ch 4)
// ----------------------------------------------------
export function fitParabolaFrom3Points(p1: MathPoint, p2: MathPoint, p3: MathPoint): ParabolaParams | null {
  const x1 = p1.x, y1 = p1.y;
  const x2 = p2.x, y2 = p2.y;
  const x3 = p3.x, y3 = p3.y;

  const denom = (x1 - x2) * (x1 - x3) * (x2 - x3);
  if (Math.abs(denom) < 1e-6) return null;

  const a = (x3 * (y2 - y1) + x2 * (y1 - y3) + x1 * (y3 - y2)) / denom;
  const b = (x3 * x3 * (y1 - y2) + x2 * x2 * (y3 - y1) + x1 * x1 * (y2 - y3)) / denom;
  const c = (x2 * x3 * (x2 - x3) * y1 + x3 * x1 * (x3 - x1) * y2 + x1 * x2 * (x1 - x2) * y3) / denom;

  if (Math.abs(a) < 1e-6) return null;

  const h = -b / (2 * a);
  const k = c - (b * b) / (4 * a);

  return {
    a: Number(a.toFixed(4)),
    b: Number(b.toFixed(3)),
    c: Number(c.toFixed(2)),
    h: Number(h.toFixed(2)),
    k: Number(k.toFixed(2)),
    useVertexForm: false,
    showRoots: true,
    showDirectrix: true,
  };
}

export function calculateParabolaMetrics(p: ParabolaParams) {
  const a = p.a;
  const b = p.b;
  const c = p.c;
  const h = p.h;
  const k = p.k;

  const discriminant = b * b - 4 * a * c;
  let roots: number[] = [];
  if (discriminant > 1e-6) {
    const sqrtD = Math.sqrt(discriminant);
    roots = [(-b + sqrtD) / (2 * a), (-b - sqrtD) / (2 * a)].sort((r1, r2) => r1 - r2);
  } else if (Math.abs(discriminant) <= 1e-6) {
    roots = [-b / (2 * a)];
  }

  const signB = b >= 0 ? `+ ${b.toFixed(3)}` : `- ${Math.abs(b).toFixed(3)}`;
  const signC = c >= 0 ? `+ ${c.toFixed(2)}` : `- ${Math.abs(c).toFixed(2)}`;
  const standardEq = `y = ${a.toFixed(4)}x² ${signB}x ${signC}`;

  const fDist = 1 / (4 * a);
  const focus = { x: h, y: k + fDist };
  const directrixY = k - fDist;

  return {
    vertex: { x: h, y: k },
    discriminant,
    roots,
    standardEq,
    focus,
    directrixY,
    axisOfSymmetry: h,
    direction: a > 0 ? 'Upward (Convex)' : 'Downward (Concave Arch)',
  };
}

// ----------------------------------------------------
// SLOPE & TRIGONOMETRY (CBSE Class 10 Ch 8 & Ch 9 - Tree & Ramp)
// ----------------------------------------------------
export function calculateSlopeMetrics(params: SlopeParams) {
  const dx = params.x2 - params.x1;
  const dy = params.y2 - params.y1;
  const hypotenuse = Math.sqrt(dx * dx + dy * dy);

  const angleRad = Math.atan2(dy, dx);
  const angleDeg = (angleRad * 180) / Math.PI;

  const slope = Math.abs(dx) > 1e-6 ? dy / dx : Infinity;
  const elevationDeg = Math.abs(angleDeg);
  const elevationRad = (elevationDeg * Math.PI) / 180;

  const sinVal = Math.sin(elevationRad);
  const cosVal = Math.cos(elevationRad);
  const tanVal = Math.tan(elevationRad);

  let lineEq = '';
  if (isFinite(slope)) {
    const intercept = params.y1 - slope * params.x1;
    const intSign = intercept >= 0 ? `+ ${intercept.toFixed(2)}` : `- ${Math.abs(intercept).toFixed(2)}`;
    lineEq = `y = ${slope.toFixed(3)}x ${intSign}`;
  } else {
    lineEq = `x = ${params.x1.toFixed(2)}`;
  }

  const gradePercent = isFinite(slope) ? Math.abs(slope) * 100 : 999;

  return {
    dx,
    dy,
    hypotenuse,
    slope,
    angleDeg,
    elevationDeg,
    sinVal,
    cosVal,
    tanVal,
    lineEq,
    gradePercent,
  };
}
