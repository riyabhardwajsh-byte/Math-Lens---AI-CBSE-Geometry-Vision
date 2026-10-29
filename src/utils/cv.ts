import {
  Point,
  MathPoint,
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
import { toMathCoords } from './geometry';

export interface CVEdgeResult {
  width: number;
  height: number;
  edgeData: Uint8ClampedArray; // RGBA edge map
  edgePoints: Point[]; // list of detected edge coordinates
}

/**
 * Perform Sobel Edge Detection on a Canvas ImageData object.
 */
export function runSobelFilter(imageData: ImageData, threshold: number = 42): CVEdgeResult {
  const width = imageData.width;
  const height = imageData.height;
  const src = imageData.data;
  const gray = new Float32Array(width * height);

  // 1. Grayscale conversion
  for (let i = 0, j = 0; i < src.length; i += 4, j++) {
    gray[j] = 0.299 * src[i] + 0.587 * src[i + 1] + 0.114 * src[i + 2];
  }

  // 2. 3x3 Gaussian Blur
  const blurred = new Float32Array(width * height);
  const kernel = [
    1 / 16, 2 / 16, 1 / 16,
    2 / 16, 4 / 16, 2 / 16,
    1 / 16, 2 / 16, 1 / 16,
  ];

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let sum = 0;
      let k = 0;
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          sum += gray[(y + ky) * width + (x + kx)] * kernel[k++];
        }
      }
      blurred[y * width + x] = sum;
    }
  }

  // 3. Sobel Convolution (Gx, Gy)
  const edgeOutput = new Uint8ClampedArray(width * height * 4);
  const edgePoints: Point[] = [];

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;

      const gx =
        -1 * blurred[(y - 1) * width + (x - 1)] +
        1 * blurred[(y - 1) * width + (x + 1)] +
        -2 * blurred[y * width + (x - 1)] +
        2 * blurred[y * width + (x + 1)] +
        -1 * blurred[(y + 1) * width + (x - 1)] +
        1 * blurred[(y + 1) * width + (x + 1)];

      const gy =
        -1 * blurred[(y - 1) * width + (x - 1)] +
        -2 * blurred[(y - 1) * width + x] +
        -1 * blurred[(y - 1) * width + (x + 1)] +
        1 * blurred[(y + 1) * width + (x - 1)] +
        2 * blurred[(y + 1) * width + x] +
        1 * blurred[(y + 1) * width + (x + 1)];

      const magnitude = Math.sqrt(gx * gx + gy * gy);
      const outIdx = idx * 4;

      if (magnitude > threshold) {
        edgeOutput[outIdx] = 34; // Cyan #22d3ee
        edgeOutput[outIdx + 1] = 211;
        edgeOutput[outIdx + 2] = 238;
        edgeOutput[outIdx + 3] = Math.min(255, Math.floor(magnitude * 1.8));

        if (Math.random() < 0.25) {
          edgePoints.push({ x, y });
        }
      } else {
        edgeOutput[outIdx + 3] = 0;
      }
    }
  }

  return { width, height, edgeData: edgeOutput, edgePoints };
}

// Bounding box helper from edge points
function getEdgeBounds(edgePoints: Point[], canvasWidth: number, canvasHeight: number) {
  if (edgePoints.length < 10) {
    return {
      minX: canvasWidth * 0.2,
      maxX: canvasWidth * 0.8,
      minY: canvasHeight * 0.2,
      maxY: canvasHeight * 0.8,
      centerX: canvasWidth * 0.5,
      centerY: canvasHeight * 0.5,
      width: canvasWidth * 0.6,
      height: canvasHeight * 0.6,
    };
  }

  const marginX = canvasWidth * 0.05;
  const marginY = canvasHeight * 0.05;
  const filtered = edgePoints.filter(
    (p) => p.x > marginX && p.x < canvasWidth - marginX && p.y > marginY && p.y < canvasHeight - marginY
  );
  const pts = filtered.length > 20 ? filtered : edgePoints;

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  let sumX = 0, sumY = 0;
  for (const p of pts) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
    sumX += p.x;
    sumY += p.y;
  }

  return {
    minX,
    maxX,
    minY,
    maxY,
    centerX: sumX / pts.length,
    centerY: sumY / pts.length,
    width: maxX - minX,
    height: maxY - minY,
  };
}

export function autoDetectCircle(
  edgePoints: Point[],
  coordSys: CoordinateSystem,
  canvasWidth: number,
  canvasHeight: number
): CircleParams {
  const b = getEdgeBounds(edgePoints, canvasWidth, canvasHeight);
  const mathCenter = toMathCoords({ x: b.centerX, y: b.centerY }, coordSys);
  const radiusMath = Number((Math.min(b.width, b.height) * 0.45 / coordSys.pixelsPerUnit).toFixed(2));

  return {
    h: mathCenter.x,
    k: mathCenter.y,
    r: Math.max(0.5, radiusMath),
    showTangents: true,
    showSector: true,
    sectorAngle: 60,
  };
}

export function autoDetectSquare(
  edgePoints: Point[],
  coordSys: CoordinateSystem,
  canvasWidth: number,
  canvasHeight: number
): SquareParams {
  const b = getEdgeBounds(edgePoints, canvasWidth, canvasHeight);
  const mathCenter = toMathCoords({ x: b.centerX, y: b.centerY }, coordSys);
  const sideMath = Number((Math.min(b.width, b.height) * 0.75 / coordSys.pixelsPerUnit).toFixed(2));

  return {
    h: mathCenter.x,
    k: mathCenter.y,
    side: Math.max(0.8, sideMath),
    rotationDeg: 0,
  };
}

export function autoDetectRectangle(
  edgePoints: Point[],
  coordSys: CoordinateSystem,
  canvasWidth: number,
  canvasHeight: number
): RectangleParams {
  const b = getEdgeBounds(edgePoints, canvasWidth, canvasHeight);
  const mathCenter = toMathCoords({ x: b.centerX, y: b.centerY }, coordSys);
  const wMath = Number((b.width * 0.8 / coordSys.pixelsPerUnit).toFixed(2));
  const hMath = Number((b.height * 0.8 / coordSys.pixelsPerUnit).toFixed(2));

  return {
    h: mathCenter.x,
    k: mathCenter.y,
    width: Math.max(1.0, wMath),
    height: Math.max(1.0, hMath),
    rotationDeg: 0,
  };
}

export function autoDetectTriangle(
  edgePoints: Point[],
  coordSys: CoordinateSystem,
  canvasWidth: number,
  canvasHeight: number
): TriangleParams {
  const b = getEdgeBounds(edgePoints, canvasWidth, canvasHeight);
  const p1 = toMathCoords({ x: b.minX + b.width * 0.1, y: b.maxY - b.height * 0.1 }, coordSys); // Bottom-left
  const p2 = toMathCoords({ x: b.maxX - b.width * 0.1, y: b.maxY - b.height * 0.1 }, coordSys); // Bottom-right
  const p3 = toMathCoords({ x: b.centerX, y: b.minY + b.height * 0.15 }, coordSys); // Apex

  return {
    x1: p1.x,
    y1: p1.y,
    x2: p2.x,
    y2: p2.y,
    x3: p3.x,
    y3: p3.y,
  };
}

export function autoDetectRhombus(
  edgePoints: Point[],
  coordSys: CoordinateSystem,
  canvasWidth: number,
  canvasHeight: number
): RhombusParams {
  const b = getEdgeBounds(edgePoints, canvasWidth, canvasHeight);
  const mathCenter = toMathCoords({ x: b.centerX, y: b.centerY }, coordSys);
  const d1 = Number((b.width * 0.75 / coordSys.pixelsPerUnit).toFixed(2));
  const d2 = Number((b.height * 0.85 / coordSys.pixelsPerUnit).toFixed(2));

  return {
    h: mathCenter.x,
    k: mathCenter.y,
    d1: Math.max(1.0, d1),
    d2: Math.max(1.0, d2),
    rotationDeg: 0,
  };
}

export function autoDetectParallelogram(
  edgePoints: Point[],
  coordSys: CoordinateSystem,
  canvasWidth: number,
  canvasHeight: number
): ParallelogramParams {
  const b = getEdgeBounds(edgePoints, canvasWidth, canvasHeight);
  const mathCenter = toMathCoords({ x: b.centerX, y: b.centerY }, coordSys);
  const base = Number((b.width * 0.65 / coordSys.pixelsPerUnit).toFixed(2));
  const height = Number((b.height * 0.6 / coordSys.pixelsPerUnit).toFixed(2));
  const skew = Number((base * 0.35).toFixed(2));

  return {
    h: mathCenter.x,
    k: mathCenter.y,
    base: Math.max(1.0, base),
    height: Math.max(1.0, height),
    skew,
    rotationDeg: 0,
  };
}

export function autoDetectParabola(
  edgePoints: Point[],
  coordSys: CoordinateSystem,
  canvasWidth: number,
  canvasHeight: number
): ParabolaParams {
  if (edgePoints.length < 15) {
    const mathCenter = toMathCoords({ x: canvasWidth / 2, y: canvasHeight * 0.35 }, coordSys);
    return {
      a: -0.015,
      b: 0,
      c: mathCenter.y,
      h: mathCenter.x,
      k: mathCenter.y,
      showRoots: true,
      showDirectrix: true,
    };
  }

  const mathPts: MathPoint[] = edgePoints
    .filter((_, idx) => idx % 2 === 0)
    .map((p) => toMathCoords(p, coordSys));

  let s0 = mathPts.length;
  let s1 = 0, s2 = 0, s3 = 0, s4 = 0;
  let t0 = 0, t1 = 0, t2 = 0;

  for (const p of mathPts) {
    const x = p.x;
    const y = p.y;
    const x2 = x * x;
    s1 += x;
    s2 += x2;
    s3 += x2 * x;
    s4 += x2 * x2;
    t0 += y;
    t1 += x * y;
    t2 += x2 * y;
  }

  const det =
    s4 * (s2 * s0 - s1 * s1) -
    s3 * (s3 * s0 - s1 * s2) +
    s2 * (s3 * s1 - s2 * s2);

  if (Math.abs(det) > 1e-4) {
    const detA =
      t2 * (s2 * s0 - s1 * s1) -
      s3 * (t1 * s0 - s1 * t0) +
      s2 * (t1 * s1 - s2 * t0);
    const detB =
      s4 * (t1 * s0 - s1 * t0) -
      t2 * (s3 * s0 - s1 * s2) +
      s2 * (s3 * t0 - t1 * s2);
    const detC =
      s4 * (s2 * t0 - t1 * s1) -
      s3 * (s3 * t0 - t1 * s2) +
      t2 * (s3 * s1 - s2 * s2);

    const a = detA / det;
    const b = detB / det;
    const c = detC / det;

    if (Math.abs(a) > 0.0001 && Math.abs(a) < 5) {
      const h = -b / (2 * a);
      const k = c - (b * b) / (4 * a);
      return {
        a: Number(a.toFixed(4)),
        b: Number(b.toFixed(3)),
        c: Number(c.toFixed(2)),
        h: Number(h.toFixed(2)),
        k: Number(k.toFixed(2)),
        showRoots: true,
        showDirectrix: true,
      };
    }
  }

  return {
    a: -0.015,
    b: 0,
    c: 4.8,
    h: 0,
    k: 4.8,
    showRoots: true,
    showDirectrix: true,
  };
}

export function autoDetectSlope(
  edgePoints: Point[],
  coordSys: CoordinateSystem,
  canvasWidth: number,
  canvasHeight: number
): SlopeParams {
  if (edgePoints.length < 10) {
    const p1 = toMathCoords({ x: canvasWidth * 0.25, y: canvasHeight * 0.7 }, coordSys);
    const p2 = toMathCoords({ x: canvasWidth * 0.75, y: canvasHeight * 0.35 }, coordSys);
    const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
    return {
      x1: p1.x,
      y1: p1.y,
      x2: p2.x,
      y2: p2.y,
      angleDeg: Number(angle.toFixed(1)),
    };
  }

  const b = getEdgeBounds(edgePoints, canvasWidth, canvasHeight);
  const p1 = toMathCoords({ x: b.minX, y: b.maxY }, coordSys);
  const p2 = toMathCoords({ x: b.maxX, y: b.minY }, coordSys);
  const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);

  return {
    x1: p1.x,
    y1: p1.y,
    x2: p2.x,
    y2: p2.y,
    angleDeg: Number(angle.toFixed(1)),
  };
}
