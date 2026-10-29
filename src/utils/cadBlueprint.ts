import {
  Mode,
  CoordinateSystem,
  CircleParams,
  SquareParams,
  RectangleParams,
  TriangleParams,
  RhombusParams,
  ParallelogramParams,
  ParabolaParams,
  SlopeParams,
  Point,
  CADTheme,
  CaliperMeasurement,
  AngleMeasurement,
  PolygonMeasurement,
} from '../types';
import {
  toPixelCoords,
  calculateSquareMetrics,
  calculateRectangleMetrics,
  calculateTriangleMetrics,
  calculateRhombusMetrics,
  calculateParallelogramMetrics,
  calculateCircleMetrics,
  calculateParabolaMetrics,
  calculateSlopeMetrics,
} from './geometry';
import { CVEdgeResult } from './cv';

export interface CADRenderOptions {
  width: number;
  height: number;
  clipRect?: { x: number; y: number; width: number; height: number };
  objectType?: string;
  cadTheme?: CADTheme;
  calipers?: CaliperMeasurement[];
  angles?: AngleMeasurement[];
  polygons?: PolygonMeasurement[];
}

export interface CADThemePalette {
  bg: string;
  gridMinor: string;
  gridMajor: string;
  mark: string;
  datum: string;
  primary: string;
  accent: string;
  calloutBg: string;
  calloutBorder: string;
  text: string;
  laserEdge: { r: number; g: number; b: number };
}

export const CAD_THEMES: Record<CADTheme, CADThemePalette> = {
  'cyan-blueprint': {
    bg: '#030c1b',
    gridMinor: 'rgba(14, 165, 233, 0.08)',
    gridMajor: 'rgba(14, 165, 233, 0.22)',
    mark: 'rgba(56, 189, 248, 0.6)',
    datum: '#38bdf8',
    primary: '#06b6d4',
    accent: '#38bdf8',
    calloutBg: 'rgba(3, 12, 27, 0.9)',
    calloutBorder: 'rgba(56, 189, 248, 0.5)',
    text: '#e0f2fe',
    laserEdge: { r: 14, g: 165, b: 233 },
  },
  'amber-terminal': {
    bg: '#100a03',
    gridMinor: 'rgba(245, 158, 11, 0.08)',
    gridMajor: 'rgba(245, 158, 11, 0.24)',
    mark: 'rgba(251, 191, 36, 0.6)',
    datum: '#fbbf24',
    primary: '#f59e0b',
    accent: '#fbbf24',
    calloutBg: 'rgba(24, 13, 3, 0.9)',
    calloutBorder: 'rgba(245, 158, 11, 0.5)',
    text: '#fef3c7',
    laserEdge: { r: 245, g: 158, b: 11 },
  },
  'emerald-matrix': {
    bg: '#02130e',
    gridMinor: 'rgba(16, 185, 129, 0.08)',
    gridMajor: 'rgba(16, 185, 129, 0.24)',
    mark: 'rgba(52, 211, 153, 0.6)',
    datum: '#34d399',
    primary: '#10b981',
    accent: '#34d399',
    calloutBg: 'rgba(2, 26, 19, 0.9)',
    calloutBorder: 'rgba(16, 185, 129, 0.5)',
    text: '#d1fae5',
    laserEdge: { r: 16, g: 185, b: 129 },
  },
  'monochrome-plotter': {
    bg: '#090d16',
    gridMinor: 'rgba(226, 232, 240, 0.08)',
    gridMajor: 'rgba(226, 232, 240, 0.24)',
    mark: 'rgba(248, 250, 252, 0.6)',
    datum: '#f8fafc',
    primary: '#cbd5e1',
    accent: '#f8fafc',
    calloutBg: 'rgba(15, 23, 42, 0.9)',
    calloutBorder: 'rgba(203, 213, 225, 0.5)',
    text: '#ffffff',
    laserEdge: { r: 203, g: 213, b: 225 },
  },
};

/**
 * Draws an authentic, futuristic wireframe CAD-style mathematical blueprint
 * onto a 2D canvas context.
 */
export function drawCADBlueprint(
  ctx: CanvasRenderingContext2D,
  mode: Mode,
  coordSys: CoordinateSystem,
  circleParams: CircleParams,
  squareParams: SquareParams,
  rectangleParams: RectangleParams,
  triangleParams: TriangleParams,
  rhombusParams: RhombusParams,
  parallelogramParams: ParallelogramParams,
  parabolaParams: ParabolaParams,
  slopeParams: SlopeParams,
  edgeResult: CVEdgeResult | null,
  options: CADRenderOptions
) {
  const { width, height, clipRect, objectType, cadTheme = 'cyan-blueprint', calipers, angles, polygons } = options;
  const palette = CAD_THEMES[cadTheme] || CAD_THEMES['cyan-blueprint'];

  ctx.save();

  // If clipped (for split-screen curtain), apply clipping rectangle
  if (clipRect) {
    ctx.beginPath();
    ctx.rect(clipRect.x, clipRect.y, clipRect.width, clipRect.height);
    ctx.clip();
  }

  // 1. Deep CAD Blueprint Background
  ctx.fillStyle = palette.bg;
  ctx.fillRect(clipRect ? clipRect.x : 0, 0, clipRect ? clipRect.width : width, height);

  // 2. Blueprint Engineering Grid (Fine + Major divisions)
  const ox = coordSys.originX || width / 2;
  const oy = coordSys.originY || height / 2;
  const ppu = coordSys.pixelsPerUnit;

  // Minor grid (sub-divisions)
  ctx.lineWidth = 0.5;
  ctx.strokeStyle = palette.gridMinor;
  const minorStep = ppu / 4;
  for (let x = ox % minorStep; x < width; x += minorStep) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = oy % minorStep; y < height; y += minorStep) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Major metric grid
  ctx.lineWidth = 1;
  ctx.strokeStyle = palette.gridMajor;
  for (let x = ox % ppu; x < width; x += ppu) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = oy % ppu; y < height; y += ppu) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // 3. Technical Corner Crop & Registration Marks (+)
  ctx.strokeStyle = palette.mark;
  ctx.lineWidth = 1.5;
  const markSize = 14;
  const corners = [
    { x: 18, y: 18 },
    { x: width - 18, y: 18 },
    { x: 18, y: height - 18 },
    { x: width - 18, y: height - 18 },
  ];
  corners.forEach(({ x, y }) => {
    ctx.beginPath();
    ctx.moveTo(x - markSize, y);
    ctx.lineTo(x + markSize, y);
    ctx.moveTo(x, y - markSize);
    ctx.lineTo(x, y + markSize);
    ctx.stroke();
  });

  // 4. Wireframe Edge Filter (Laser Edge Matrix)
  if (edgeResult) {
    try {
      const off = document.createElement('canvas');
      off.width = edgeResult.width;
      off.height = edgeResult.height;
      const offCtx = off.getContext('2d');
      if (offCtx) {
        const idata = offCtx.createImageData(edgeResult.width, edgeResult.height);
        const src = edgeResult.edgeData;
        const dst = idata.data;
        const { r, g, b } = palette.laserEdge;
        for (let i = 0; i < src.length; i += 4) {
          const val = src[i];
          if (val > 40) {
            dst[i] = r;
            dst[i + 1] = g;
            dst[i + 2] = b;
            dst[i + 3] = Math.min(255, val * 1.4);
          } else {
            dst[i + 3] = 0;
          }
        }
        offCtx.putImageData(idata, 0, 0);

        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = 0.75;
        ctx.drawImage(off, 0, 0, width, height);
        ctx.restore();
      }
    } catch {
      // Fallback gracefully
    }
  }

  // 5. Cartesian Center Reference Axis
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = palette.gridMajor;
  ctx.setLineDash([6, 3]);
  ctx.beginPath();
  ctx.moveTo(0, oy);
  ctx.lineTo(width, oy);
  ctx.moveTo(ox, 0);
  ctx.lineTo(ox, height);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw Origin Datum ⨁
  ctx.strokeStyle = palette.datum;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(ox, oy, 8, 0, Math.PI * 2);
  ctx.stroke();
  ctx.font = '9px "JetBrains Mono", monospace';
  ctx.fillStyle = palette.datum;
  ctx.fillText('DATUM (0,0)', ox + 12, oy - 10);

  // 6. Draw Exact Geometric CAD Wireframe & Dimension Callouts
  drawShapeCAD(
    ctx,
    mode,
    coordSys,
    circleParams,
    squareParams,
    rectangleParams,
    triangleParams,
    rhombusParams,
    parallelogramParams,
    parabolaParams,
    slopeParams,
    palette
  );

  // 6.5. Draw Custom CAD Calipers, Protractors, and Polygons
  if (calipers && calipers.length > 0) {
    drawActiveCalipers(ctx, coordSys, calipers, palette);
  }
  if (angles && angles.length > 0) {
    drawActiveAngles(ctx, coordSys, angles, palette);
  }
  if (polygons && polygons.length > 0) {
    drawActivePolygons(ctx, coordSys, polygons, palette);
  }

  // 7. Architectural Blueprint Title Block in bottom-right corner
  drawCADTitleBlock(ctx, width, height, mode, objectType, palette);

  ctx.restore();
}

/**
 * Draws CAD architectural dimension line with arrows and callout text.
 */
function drawDimensionLine(
  ctx: CanvasRenderingContext2D,
  p1: Point,
  p2: Point,
  label: string,
  offset: number = 0,
  isVertical: boolean = false,
  palette: CADThemePalette = CAD_THEMES['cyan-blueprint']
) {
  ctx.save();
  ctx.strokeStyle = palette.accent;
  ctx.fillStyle = palette.accent;
  ctx.lineWidth = 1.2;
  ctx.font = '10px "JetBrains Mono", monospace';

  const ox = isVertical ? offset : 0;
  const oy = !isVertical ? offset : 0;

  const x1 = p1.x + ox, y1 = p1.y + oy;
  const x2 = p2.x + ox, y2 = p2.y + oy;

  // Extension leader lines from feature to dimension line
  if (Math.abs(offset) > 3) {
    ctx.setLineDash([2, 2]);
    ctx.strokeStyle = palette.gridMajor;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(x1, y1);
    ctx.moveTo(p2.x, p2.y);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Dimension main line
  ctx.strokeStyle = palette.accent;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  // Tick arrows
  const arrowSize = 5;
  const angle = Math.atan2(y2 - y1, x2 - x1);

  // Arrow at p1
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x1 + arrowSize * Math.cos(angle + Math.PI / 6), y1 + arrowSize * Math.sin(angle + Math.PI / 6));
  ctx.moveTo(x1, y1);
  ctx.lineTo(x1 + arrowSize * Math.cos(angle - Math.PI / 6), y1 + arrowSize * Math.sin(angle - Math.PI / 6));
  ctx.stroke();

  // Arrow at p2
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - arrowSize * Math.cos(angle + Math.PI / 6), y2 - arrowSize * Math.sin(angle + Math.PI / 6));
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - arrowSize * Math.cos(angle - Math.PI / 6), y2 - arrowSize * Math.sin(angle - Math.PI / 6));
  ctx.stroke();

  // Dimension Callout Text with background badge
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  ctx.font = 'bold 9px "JetBrains Mono", monospace';
  const textWidth = ctx.measureText(label).width;

  ctx.fillStyle = palette.calloutBg;
  ctx.strokeStyle = palette.calloutBorder;
  ctx.lineWidth = 1;
  ctx.fillRect(midX - textWidth / 2 - 4, midY - 7, textWidth + 8, 14);
  ctx.strokeRect(midX - textWidth / 2 - 4, midY - 7, textWidth + 8, 14);

  ctx.fillStyle = palette.text;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, midX, midY);

  ctx.restore();
}

/**
 * Draws active interactive calipers on CAD lens.
 */
function drawActiveCalipers(
  ctx: CanvasRenderingContext2D,
  coordSys: CoordinateSystem,
  calipers: CaliperMeasurement[],
  palette: CADThemePalette
) {
  calipers.forEach((c) => {
    const p1 = toPixelCoords(c.p1, coordSys);
    const p2 = toPixelCoords(c.p2, coordSys);
    const label = `CALIPER: ${c.distance.toFixed(2)}${coordSys.unitLabel} [Δx: ${Math.abs(c.dx).toFixed(1)}, Δy: ${Math.abs(c.dy).toFixed(1)}]`;
    drawDimensionLine(ctx, p1, p2, label, 16, Math.abs(p2.x - p1.x) < Math.abs(p2.y - p1.y), palette);
  });
}

/**
 * Draws active interactive angle protractors on CAD lens.
 */
function drawActiveAngles(
  ctx: CanvasRenderingContext2D,
  coordSys: CoordinateSystem,
  angles: AngleMeasurement[],
  palette: CADThemePalette
) {
  angles.forEach((a) => {
    const p1 = toPixelCoords(a.p1, coordSys);
    const v = toPixelCoords(a.vertex, coordSys);
    const p2 = toPixelCoords(a.p2, coordSys);

    ctx.save();
    ctx.strokeStyle = palette.accent;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 2]);

    // Rays from vertex to points
    ctx.beginPath();
    ctx.moveTo(v.x, v.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.moveTo(v.x, v.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Angle Arc
    const a1 = Math.atan2(p1.y - v.y, p1.x - v.x);
    const a2 = Math.atan2(p2.y - v.y, p2.x - v.x);
    const arcRadius = 32;

    ctx.strokeStyle = palette.primary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(v.x, v.y, arcRadius, a1, a2);
    ctx.stroke();

    // Angle Label
    const midAngle = (a1 + a2) / 2;
    const lx = v.x + (arcRadius + 16) * Math.cos(midAngle);
    const ly = v.y + (arcRadius + 16) * Math.sin(midAngle);

    ctx.font = 'bold 9px "JetBrains Mono", monospace';
    const text = `θ = ${a.angleDeg.toFixed(1)}° (${a.angleRad.toFixed(2)} rad)`;
    const tw = ctx.measureText(text).width;

    ctx.fillStyle = palette.calloutBg;
    ctx.strokeStyle = palette.calloutBorder;
    ctx.fillRect(lx - tw / 2 - 4, ly - 7, tw + 8, 14);
    ctx.strokeRect(lx - tw / 2 - 4, ly - 7, tw + 8, 14);

    ctx.fillStyle = palette.text;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, lx, ly);

    ctx.restore();
  });
}

/**
 * Draws active interactive polygons on CAD lens.
 */
function drawActivePolygons(
  ctx: CanvasRenderingContext2D,
  coordSys: CoordinateSystem,
  polygons: PolygonMeasurement[],
  palette: CADThemePalette
) {
  polygons.forEach((poly) => {
    if (poly.points.length < 3) return;
    const pts = poly.points.map((p) => toPixelCoords(p, coordSys));

    ctx.save();
    // Shaded fill
    ctx.fillStyle = palette.gridMajor;
    ctx.strokeStyle = palette.primary;
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i].x, pts[i].y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Centroid marker & metrics
    const c = toPixelCoords(poly.centroid, coordSys);
    ctx.fillStyle = palette.accent;
    ctx.beginPath();
    ctx.arc(c.x, c.y, 4, 0, Math.PI * 2);
    ctx.fill();

    const label = `AREA: ${poly.area.toFixed(2)}${coordSys.unitLabel}² · PERIMETER: ${poly.perimeter.toFixed(2)}${coordSys.unitLabel}`;
    ctx.font = 'bold 9px "JetBrains Mono", monospace';
    const tw = ctx.measureText(label).width;

    ctx.fillStyle = palette.calloutBg;
    ctx.strokeStyle = palette.calloutBorder;
    ctx.fillRect(c.x - tw / 2 - 4, c.y + 10, tw + 8, 14);
    ctx.strokeRect(c.x - tw / 2 - 4, c.y + 10, tw + 8, 14);

    ctx.fillStyle = palette.text;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, c.x, c.y + 17);

    ctx.restore();
  });
}

/**
 * Dispatches drawing the specific shape wireframe and ISO dimensions.
 */
function drawShapeCAD(
  ctx: CanvasRenderingContext2D,
  mode: Mode,
  coordSys: CoordinateSystem,
  circleParams: CircleParams,
  squareParams: SquareParams,
  rectangleParams: RectangleParams,
  triangleParams: TriangleParams,
  rhombusParams: RhombusParams,
  parallelogramParams: ParallelogramParams,
  parabolaParams: ParabolaParams,
  slopeParams: SlopeParams,
  palette: CADThemePalette
) {
  ctx.save();

  if (mode === 'circle') {
    const c = toPixelCoords({ x: circleParams.h, y: circleParams.k }, coordSys);
    const rPx = circleParams.r * coordSys.pixelsPerUnit;
    const m = calculateCircleMetrics(circleParams);

    // Center Crosshair
    ctx.strokeStyle = palette.datum;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(c.x - 12, c.y); ctx.lineTo(c.x + 12, c.y);
    ctx.moveTo(c.x, c.y - 12); ctx.lineTo(c.x, c.y + 12);
    ctx.stroke();

    // Main Circle Wireframe
    ctx.strokeStyle = palette.primary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(c.x, c.y, rPx, 0, Math.PI * 2);
    ctx.stroke();

    // Radial Leader Line
    const radAngle = -Math.PI / 4;
    const pRim = { x: c.x + rPx * Math.cos(radAngle), y: c.y + rPx * Math.sin(radAngle) };
    const pLeaderEnd = { x: pRim.x + 35, y: pRim.y - 25 };

    ctx.strokeStyle = palette.accent;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(c.x, c.y);
    ctx.lineTo(pRim.x, pRim.y);
    ctx.lineTo(pLeaderEnd.x, pLeaderEnd.y);
    ctx.lineTo(pLeaderEnd.x + 50, pLeaderEnd.y);
    ctx.stroke();

    // Dimension Callouts
    ctx.font = 'bold 10px "JetBrains Mono", monospace';
    ctx.fillStyle = palette.text;
    ctx.fillText(`R = ${circleParams.r.toFixed(2)}${coordSys.unitLabel}`, pLeaderEnd.x + 6, pLeaderEnd.y - 4);
    ctx.font = '8px "JetBrains Mono", monospace';
    ctx.fillStyle = palette.accent;
    ctx.fillText(`Ø = ${(circleParams.r * 2).toFixed(2)}${coordSys.unitLabel} | AREA = ${m.area.toFixed(2)}${coordSys.unitLabel}²`, pLeaderEnd.x + 6, pLeaderEnd.y + 10);
  } else if (mode === 'rectangle') {
    const c = toPixelCoords({ x: rectangleParams.h, y: rectangleParams.k }, coordSys);
    const wPx = rectangleParams.width * coordSys.pixelsPerUnit;
    const hPx = rectangleParams.height * coordSys.pixelsPerUnit;
    const m = calculateRectangleMetrics(rectangleParams);

    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate((rectangleParams.rotationDeg * Math.PI) / 180);

    // Box
    ctx.strokeStyle = palette.primary;
    ctx.lineWidth = 2;
    ctx.strokeRect(-wPx / 2, -hPx / 2, wPx, hPx);

    // Center Cross
    ctx.strokeStyle = palette.datum;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-10, 0); ctx.lineTo(10, 0);
    ctx.moveTo(0, -10); ctx.lineTo(0, 10);
    ctx.stroke();

    // Dimension lines
    drawDimensionLine(ctx, { x: -wPx / 2, y: -hPx / 2 }, { x: wPx / 2, y: -hPx / 2 }, `W = ${rectangleParams.width.toFixed(2)}${coordSys.unitLabel}`, -20, false, palette);
    drawDimensionLine(ctx, { x: wPx / 2, y: -hPx / 2 }, { x: wPx / 2, y: hPx / 2 }, `H = ${rectangleParams.height.toFixed(2)}${coordSys.unitLabel}`, 20, true, palette);

    ctx.font = 'bold 9px "JetBrains Mono", monospace';
    ctx.fillStyle = palette.text;
    ctx.fillText(`ASPECT: ${m.aspectRatio}:1 · AREA = ${m.area.toFixed(2)}${coordSys.unitLabel}²`, -wPx / 2, hPx / 2 + 22);
    ctx.restore();
  } else if (mode === 'square') {
    const c = toPixelCoords({ x: squareParams.h, y: squareParams.k }, coordSys);
    const sPx = squareParams.side * coordSys.pixelsPerUnit;
    const m = calculateSquareMetrics(squareParams);

    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate((squareParams.rotationDeg * Math.PI) / 180);

    ctx.strokeStyle = palette.primary;
    ctx.lineWidth = 2;
    ctx.strokeRect(-sPx / 2, -sPx / 2, sPx, sPx);

    drawDimensionLine(ctx, { x: -sPx / 2, y: -sPx / 2 }, { x: sPx / 2, y: -sPx / 2 }, `SIDE s = ${squareParams.side.toFixed(2)}${coordSys.unitLabel}`, -20, false, palette);
    drawDimensionLine(ctx, { x: sPx / 2, y: -sPx / 2 }, { x: sPx / 2, y: sPx / 2 }, `s = ${squareParams.side.toFixed(2)}${coordSys.unitLabel}`, 20, true, palette);

    ctx.font = 'bold 9px "JetBrains Mono", monospace';
    ctx.fillStyle = palette.text;
    ctx.fillText(`DIAGONAL d = ${m.diagonal.toFixed(2)}${coordSys.unitLabel} · AREA = ${m.area.toFixed(2)}${coordSys.unitLabel}²`, -sPx / 2, sPx / 2 + 22);
    ctx.restore();
  } else if (mode === 'triangle') {
    const p1 = toPixelCoords({ x: triangleParams.x1, y: triangleParams.y1 }, coordSys);
    const p2 = toPixelCoords({ x: triangleParams.x2, y: triangleParams.y2 }, coordSys);
    const p3 = toPixelCoords({ x: triangleParams.x3, y: triangleParams.y3 }, coordSys);
    const m = calculateTriangleMetrics(triangleParams);

    ctx.strokeStyle = palette.primary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.closePath();
    ctx.stroke();

    drawDimensionLine(ctx, p1, p2, `a = ${m.sideA.toFixed(2)}${coordSys.unitLabel}`, 18, false, palette);
    drawDimensionLine(ctx, p2, p3, `b = ${m.sideB.toFixed(2)}${coordSys.unitLabel}`, 18, false, palette);
    drawDimensionLine(ctx, p3, p1, `c = ${m.sideC.toFixed(2)}${coordSys.unitLabel}`, 18, false, palette);

    ctx.font = 'bold 9px "JetBrains Mono", monospace';
    ctx.fillStyle = palette.text;
    ctx.fillText(`HERON'S FORMULA AREA: ${m.area.toFixed(2)}${coordSys.unitLabel}² · PERIMETER: ${m.perimeter.toFixed(2)}${coordSys.unitLabel}`, (p1.x + p2.x + p3.x) / 3 - 80, (p1.y + p2.y + p3.y) / 3 + 24);
  } else if (mode === 'rhombus') {
    const c = toPixelCoords({ x: rhombusParams.h, y: rhombusParams.k }, coordSys);
    const d1Px = rhombusParams.d1 * coordSys.pixelsPerUnit;
    const d2Px = rhombusParams.d2 * coordSys.pixelsPerUnit;
    const m = calculateRhombusMetrics(rhombusParams);

    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate((rhombusParams.rotationDeg * Math.PI) / 180);

    const top = { x: 0, y: -d2Px / 2 };
    const right = { x: d1Px / 2, y: 0 };
    const bottom = { x: 0, y: d2Px / 2 };
    const left = { x: -d1Px / 2, y: 0 };

    ctx.strokeStyle = palette.primary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(top.x, top.y);
    ctx.lineTo(right.x, right.y);
    ctx.lineTo(bottom.x, bottom.y);
    ctx.lineTo(left.x, left.y);
    ctx.closePath();
    ctx.stroke();

    // Diagonals
    ctx.strokeStyle = palette.accent;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(left.x, left.y); ctx.lineTo(right.x, right.y);
    ctx.moveTo(top.x, top.y); ctx.lineTo(bottom.x, bottom.y);
    ctx.stroke();
    ctx.setLineDash([]);

    drawDimensionLine(ctx, left, right, `d₁ = ${rhombusParams.d1.toFixed(2)}${coordSys.unitLabel}`, 20, false, palette);
    drawDimensionLine(ctx, top, bottom, `d₂ = ${rhombusParams.d2.toFixed(2)}${coordSys.unitLabel}`, -20, true, palette);

    ctx.font = 'bold 9px "JetBrains Mono", monospace';
    ctx.fillStyle = palette.text;
    ctx.fillText(`AREA = ½ × d₁ × d₂ = ${m.area.toFixed(2)}${coordSys.unitLabel}²`, -70, d2Px / 2 + 36);
    ctx.restore();
  } else if (mode === 'parallelogram') {
    const c = toPixelCoords({ x: parallelogramParams.h, y: parallelogramParams.k }, coordSys);
    const bPx = parallelogramParams.base * coordSys.pixelsPerUnit;
    const hPx = parallelogramParams.height * coordSys.pixelsPerUnit;
    const sPx = parallelogramParams.skew * coordSys.pixelsPerUnit;
    const m = calculateParallelogramMetrics(parallelogramParams);

    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate((parallelogramParams.rotationDeg * Math.PI) / 180);

    const bl = { x: -bPx / 2 - sPx / 2, y: hPx / 2 };
    const br = { x: bPx / 2 - sPx / 2, y: hPx / 2 };
    const tr = { x: bPx / 2 + sPx / 2, y: -hPx / 2 };
    const tl = { x: -bPx / 2 + sPx / 2, y: -hPx / 2 };

    ctx.strokeStyle = palette.primary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bl.x, bl.y);
    ctx.lineTo(br.x, br.y);
    ctx.lineTo(tr.x, tr.y);
    ctx.lineTo(tl.x, tl.y);
    ctx.closePath();
    ctx.stroke();

    drawDimensionLine(ctx, bl, br, `BASE = ${parallelogramParams.base.toFixed(2)}${coordSys.unitLabel}`, 20, false, palette);
    drawDimensionLine(ctx, { x: tr.x + 10, y: tr.y }, { x: tr.x + 10, y: br.y }, `HEIGHT = ${parallelogramParams.height.toFixed(2)}${coordSys.unitLabel}`, 16, true, palette);

    ctx.font = 'bold 9px "JetBrains Mono", monospace';
    ctx.fillStyle = palette.text;
    ctx.fillText(`AREA = BASE × HEIGHT = ${m.area.toFixed(2)}${coordSys.unitLabel}²`, -60, hPx / 2 + 38);
    ctx.restore();
  } else if (mode === 'parabola') {
    const m = calculateParabolaMetrics(parabolaParams);
    const vert = toPixelCoords({ x: m.vertex.x, y: m.vertex.y }, coordSys);

    // Plot parabola curve in CAD style
    ctx.strokeStyle = palette.primary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    let first = true;
    for (let mathX = -12; mathX <= 12; mathX += 0.2) {
      const mathY = parabolaParams.a * mathX * mathX + parabolaParams.b * mathX + parabolaParams.c;
      const pt = toPixelCoords({ x: mathX, y: mathY }, coordSys);
      if (first) {
        ctx.moveTo(pt.x, pt.y);
        first = false;
      } else {
        ctx.lineTo(pt.x, pt.y);
      }
    }
    ctx.stroke();

    // Vertex marker
    ctx.strokeStyle = palette.datum;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(vert.x, vert.y, 6, 0, Math.PI * 2);
    ctx.stroke();

    ctx.font = 'bold 9px "JetBrains Mono", monospace';
    ctx.fillStyle = palette.text;
    ctx.fillText(`VERTEX (${m.vertex.x.toFixed(2)}, ${m.vertex.y.toFixed(2)})`, vert.x + 10, vert.y - 10);
    ctx.fillText(`EQUATION: y = ${parabolaParams.a.toFixed(3)}x² + ${parabolaParams.b.toFixed(2)}x + ${parabolaParams.c.toFixed(2)}`, vert.x - 80, vert.y + 30);
  } else if (mode === 'slope') {
    const p1 = toPixelCoords({ x: slopeParams.x1, y: slopeParams.y1 }, coordSys);
    const p2 = toPixelCoords({ x: slopeParams.x2, y: slopeParams.y2 }, coordSys);
    const corner = { x: p2.x, y: p1.y };
    const m = calculateSlopeMetrics(slopeParams);

    ctx.strokeStyle = palette.primary;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();

    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = palette.accent;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y); ctx.lineTo(corner.x, corner.y); ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    ctx.setLineDash([]);

    drawDimensionLine(ctx, p1, corner, `RUN = ${m.dx.toFixed(2)}${coordSys.unitLabel}`, 18, false, palette);
    drawDimensionLine(ctx, corner, p2, `RISE = ${m.dy.toFixed(2)}${coordSys.unitLabel}`, 18, true, palette);

    ctx.font = 'bold 9px "JetBrains Mono", monospace';
    ctx.fillStyle = palette.text;
    ctx.fillText(`θ = ${m.angleDeg.toFixed(1)}° | SLOPE m = tan(θ) = ${m.slope.toFixed(3)}`, p1.x + 20, p1.y - 14);
  }

  ctx.restore();
}

/**
 * Technical CAD Title Block in bottom-right corner.
 */
function drawCADTitleBlock(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  mode: Mode,
  objectType?: string,
  palette: CADThemePalette = CAD_THEMES['cyan-blueprint']
) {
  const blockW = 270;
  const blockH = 80;
  const bx = width - blockW - 16;
  const by = height - blockH - 16;

  ctx.save();
  ctx.fillStyle = palette.calloutBg;
  ctx.strokeStyle = palette.calloutBorder;
  ctx.lineWidth = 1.2;
  ctx.fillRect(bx, by, blockW, blockH);
  ctx.strokeRect(bx, by, blockW, blockH);

  // Divider lines
  ctx.beginPath();
  ctx.moveTo(bx, by + 24); ctx.lineTo(bx + blockW, by + 24);
  ctx.moveTo(bx, by + 52); ctx.lineTo(bx + blockW, by + 52);
  ctx.moveTo(bx + 145, by + 52); ctx.lineTo(bx + 145, by + blockH);
  ctx.stroke();

  // Typography
  ctx.font = 'bold 9px "JetBrains Mono", monospace';
  ctx.fillStyle = palette.accent;
  ctx.fillText('CAD ARCHITECTURE // MATH LENS', bx + 8, by + 16);

  ctx.font = '8px "JetBrains Mono", monospace';
  ctx.fillStyle = palette.text;
  ctx.fillText(`TARGET: ${(objectType || mode).toUpperCase()} BLUEPRINT`, bx + 8, by + 40);

  ctx.fillText('SCALE: 1:50 METRIC (CBSE)', bx + 8, by + 68);
  ctx.fillText('ISO 128 DRAFTING STAMP', bx + 152, by + 68);

  ctx.restore();
}
