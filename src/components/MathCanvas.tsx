import React, { useRef, useEffect, useState, useCallback } from 'react';
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
  MathPoint,
  CompareMode,
  InputSource,
  CADTheme,
  ReticleStyle,
  CADTool,
  CaliperMeasurement,
  AngleMeasurement,
  PolygonMeasurement,
} from '../types';
import {
  toMathCoords,
  toPixelCoords,
  calculateSquareMetrics,
  calculateRectangleMetrics,
  calculateTriangleMetrics,
  calculateRhombusMetrics,
  calculateParallelogramMetrics,
} from '../utils/geometry';
import { CVEdgeResult } from '../utils/cv';
import { drawCADBlueprint } from '../utils/cadBlueprint';
import { drawReticleOverlay } from '../utils/reticleOverlay';
import { renderVirtualCameraScene, VirtualBenchScene } from '../utils/virtualCamera';
import { audioFeedback } from '../utils/audioFeedback';
import { Crosshair, ZoomIn, ZoomOut, RotateCcw, Volume2, Split, Compass, Eye, Ruler } from 'lucide-react';

interface MathCanvasProps {
  mode: Mode;
  inputSource: InputSource;
  imageElement: HTMLImageElement | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isWebcamActive: boolean;
  isFrozen: boolean;
  coordSys: CoordinateSystem;
  circleParams: CircleParams;
  squareParams: SquareParams;
  rectangleParams: RectangleParams;
  triangleParams: TriangleParams;
  rhombusParams: RhombusParams;
  parallelogramParams: ParallelogramParams;
  parabolaParams: ParabolaParams;
  slopeParams: SlopeParams;
  edgeResult: CVEdgeResult | null;
  showEdgeFilter: boolean;
  isThreePointMode: boolean;
  threePoints: MathPoint[];
  compareMode: CompareMode;
  splitPosition: number;
  cadTheme: CADTheme;
  cadTool: CADTool;
  reticleStyle: ReticleStyle;
  cameraZoom: number;
  activeVirtualScene: VirtualBenchScene;
  calipers: CaliperMeasurement[];
  angles: AngleMeasurement[];
  polygons: PolygonMeasurement[];
  onUpdateSplitPosition: (pos: number) => void;
  onSetCompareMode: (mode: CompareMode) => void;
  objectType?: string;
  onUpdateCircle: (params: CircleParams) => void;
  onUpdateSquare: (params: SquareParams) => void;
  onUpdateRectangle: (params: RectangleParams) => void;
  onUpdateTriangle: (params: TriangleParams) => void;
  onUpdateRhombus: (params: RhombusParams) => void;
  onUpdateParallelogram: (params: ParallelogramParams) => void;
  onUpdateParabola: (params: ParabolaParams) => void;
  onUpdateSlope: (params: SlopeParams) => void;
  onUpdateCoordSys: (sys: Partial<CoordinateSystem>) => void;
  onAddThreePoint: (pt: MathPoint) => void;
  onAddCaliper: (caliper: CaliperMeasurement) => void;
  onAddAngle: (angle: AngleMeasurement) => void;
  onAddPolygon: (poly: PolygonMeasurement) => void;
  onTriggerVoiceTutor?: () => void;
}

type DragTarget =
  | 'none'
  | 'split-divider'
  | 'origin'
  | 'circle-center'
  | 'circle-radius'
  | 'square-center'
  | 'square-corner'
  | 'rectangle-center'
  | 'rectangle-corner'
  | 'triangle-p1'
  | 'triangle-p2'
  | 'triangle-p3'
  | 'rhombus-center'
  | 'rhombus-d1'
  | 'rhombus-d2'
  | 'parallelogram-center'
  | 'parallelogram-corner'
  | 'parabola-vertex'
  | 'slope-p1'
  | 'slope-p2';

export const MathCanvas: React.FC<MathCanvasProps> = ({
  mode,
  inputSource,
  imageElement,
  videoRef,
  isWebcamActive,
  isFrozen,
  coordSys,
  circleParams,
  squareParams,
  rectangleParams,
  triangleParams,
  rhombusParams,
  parallelogramParams,
  parabolaParams,
  slopeParams,
  edgeResult,
  showEdgeFilter,
  isThreePointMode,
  threePoints,
  compareMode = 'overlay',
  splitPosition = 0.5,
  cadTheme = 'cyan-blueprint',
  cadTool = 'none',
  reticleStyle = 'tactical',
  cameraZoom = 1.0,
  activeVirtualScene = 'wheel',
  calipers = [],
  angles = [],
  polygons = [],
  onUpdateSplitPosition,
  onSetCompareMode,
  objectType,
  onUpdateCircle,
  onUpdateSquare,
  onUpdateRectangle,
  onUpdateTriangle,
  onUpdateRhombus,
  onUpdateParallelogram,
  onUpdateParabola,
  onUpdateSlope,
  onUpdateCoordSys,
  onAddThreePoint,
  onAddCaliper,
  onAddAngle,
  onAddPolygon,
  onTriggerVoiceTutor,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenEdgeCanvas = useRef<HTMLCanvasElement | null>(null);
  const clickStartPosRef = useRef<Point>({ x: 0, y: 0 });

  const [mouseMathPos, setMouseMathPos] = useState<MathPoint | null>(null);
  const [activeDrag, setActiveDrag] = useState<DragTarget>('none');
  const [dragOffset, setDragOffset] = useState<Point>({ x: 0, y: 0 });
  const [canvasDim, setCanvasDim] = useState({ width: 800, height: 500 });
  const [isHoveringDivider, setIsHoveringDivider] = useState<boolean>(false);

  // In-progress interactive tool points
  const [cadToolPoints, setCadToolPoints] = useState<MathPoint[]>([]);

  useEffect(() => {
    // Reset temporary CAD tool points if tool changes
    setCadToolPoints([]);
  }, [cadTool]);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const w = Math.floor(rect.width);
        const h = Math.max(420, Math.floor(rect.height || (rect.width * 9) / 16));
        setCanvasDim({ width: w, height: h });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (coordSys.originX === 0 && coordSys.originY === 0 && canvasDim.width > 0) {
      onUpdateCoordSys({
        originX: Math.floor(canvasDim.width / 2),
        originY: Math.floor(canvasDim.height / 2),
      });
    }
  }, [canvasDim, coordSys.originX, coordSys.originY, onUpdateCoordSys]);

  // Main Render Routine
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // A. 100% Full CAD Blueprint View
    if (compareMode === 'cad-blueprint') {
      drawCADBlueprint(
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
        edgeResult,
        {
          width,
          height,
          objectType,
          cadTheme,
          calipers,
          angles,
          polygons,
        }
      );

      // Draw Reticle if enabled
      drawReticleOverlay(ctx, width, height, reticleStyle);
      return;
    }

    // Helper: Draw Primary Feed (Live webcam, Virtual Bench, or Uploaded Image)
    const drawPrimaryFeed = (clipRect?: { x: number; y: number; width: number; height: number }) => {
      ctx.save();
      if (clipRect) {
        ctx.beginPath();
        ctx.rect(clipRect.x, clipRect.y, clipRect.width, clipRect.height);
        ctx.clip();
      }

      ctx.fillStyle = '#060b17';
      ctx.fillRect(clipRect ? clipRect.x : 0, 0, clipRect ? clipRect.width : width, height);

      // Apply Zoom transformation if > 1
      if (cameraZoom && cameraZoom > 1) {
        ctx.translate(width / 2, height / 2);
        ctx.scale(cameraZoom, cameraZoom);
        ctx.translate(-width / 2, -height / 2);
      }

      if (inputSource === 'virtual-bench') {
        renderVirtualCameraScene(ctx, width, height, activeVirtualScene, performance.now());
      } else if (isWebcamActive && videoRef.current && videoRef.current.readyState >= 2 && !isFrozen) {
        const v = videoRef.current;
        const vRatio = v.videoWidth / v.videoHeight;
        const cRatio = width / height;
        let sw = width,
          sh = height,
          sx = 0,
          sy = 0;
        if (vRatio > cRatio) {
          sw = height * vRatio;
          sx = (width - sw) / 2;
        } else {
          sh = width / vRatio;
          sy = (height - sh) / 2;
        }
        ctx.drawImage(v, sx, sy, sw, sh);
      } else if (imageElement && imageElement.complete && imageElement.naturalWidth > 0) {
        const imgRatio = imageElement.naturalWidth / imageElement.naturalHeight;
        const cRatio = width / height;
        let dw = width,
          dh = height,
          dx = 0,
          dy = 0;
        if (imgRatio > cRatio) {
          dw = width;
          dh = width / imgRatio;
          dy = (height - dh) / 2;
        } else {
          dh = height;
          dw = height * imgRatio;
          dx = (width - dw) / 2;
        }
        ctx.drawImage(imageElement, dx, dy, dw, dh);
      } else {
        ctx.fillStyle = '#0b1120';
        ctx.fillRect(0, 0, width, height);
      }
      ctx.restore();
    };

    // B. Split-Screen Curtain Mode or Side-by-Side Mode
    if (compareMode === 'split-curtain' || compareMode === 'side-by-side') {
      const splitX = compareMode === 'side-by-side' ? Math.floor(width / 2) : Math.round(width * splitPosition);

      // 1. Draw Normal Photo Feed on Left
      drawPrimaryFeed({ x: 0, y: 0, width: splitX, height });

      // Real photo watermark label
      ctx.save();
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.fillText('CAMERA / REAL PHOTO', 20, 30);
      ctx.restore();

      // 2. Call drawCADBlueprint clipped to the right
      drawCADBlueprint(
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
        edgeResult,
        {
          width,
          height,
          clipRect: { x: splitX, y: 0, width: width - splitX, height },
          objectType,
          cadTheme,
          calipers,
          angles,
          polygons,
        }
      );

      // 3. Draw Split Laser Divider & Handle
      ctx.save();
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = 'rgba(6, 182, 212, 0.8)';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(splitX, 0);
      ctx.lineTo(splitX, height);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Center draggable handle pill
      const handleH = 46;
      const handleW = 28;
      const handleY = height / 2 - handleH / 2;
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(splitX - handleW / 2, handleY, handleW, handleH, 14);
      ctx.fill();
      ctx.stroke();

      // Grip notches
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(splitX - 6, handleY + 16, 2, 14);
      ctx.fillRect(splitX - 1, handleY + 14, 2, 18);
      ctx.fillRect(splitX + 4, handleY + 16, 2, 14);

      // Badges on either side of curtain
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.textAlign = 'right';
      ctx.fillText('◄ REAL PHOTO', splitX - 14, 28);

      ctx.fillStyle = '#38bdf8';
      ctx.textAlign = 'left';
      ctx.fillText('CAD BLUEPRINT ►', splitX + 14, 28);
      ctx.restore();

      // Reticle overlay
      drawReticleOverlay(ctx, width, height, reticleStyle);
      return;
    }

    // C. Normal Full HUD Overlay Mode
    drawPrimaryFeed();

    // Edge Matrix filter
    if (showEdgeFilter && edgeResult) {
      if (!offscreenEdgeCanvas.current) {
        offscreenEdgeCanvas.current = document.createElement('canvas');
      }
      const off = offscreenEdgeCanvas.current;
      if (off.width !== edgeResult.width || off.height !== edgeResult.height) {
        off.width = edgeResult.width;
        off.height = edgeResult.height;
      }
      const offCtx = off.getContext('2d');
      if (offCtx) {
        const idata = offCtx.createImageData(edgeResult.width, edgeResult.height);
        idata.data.set(edgeResult.edgeData);
        offCtx.putImageData(idata, 0, 0);

        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = 0.85;
        ctx.drawImage(off, 0, 0, width, height);
        ctx.restore();
      }
    }

    // Grid & Coordinate Axes
    const ox = coordSys.originX || width / 2;
    const oy = coordSys.originY || height / 2;
    const ppu = coordSys.pixelsPerUnit;

    if (coordSys.showGrid) {
      ctx.save();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.09)';

      const leftCount = Math.ceil(ox / ppu);
      const rightCount = Math.ceil((width - ox) / ppu);
      for (let i = -leftCount; i <= rightCount; i++) {
        if (i === 0) continue;
        const x = ox + i * ppu;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();

        if (i % 2 === 0) {
          ctx.fillStyle = 'rgba(148, 163, 184, 0.45)';
          ctx.font = '10px JetBrains Mono, monospace';
          ctx.fillText(`${i}`, x + 3, oy + 14);
        }
      }

      const topCount = Math.ceil(oy / ppu);
      const bottomCount = Math.ceil((height - oy) / ppu);
      for (let j = -topCount; j <= bottomCount; j++) {
        if (j === 0) continue;
        const y = oy - j * ppu;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();

        if (j % 2 === 0) {
          ctx.fillStyle = 'rgba(148, 163, 184, 0.45)';
          ctx.font = '10px JetBrains Mono, monospace';
          ctx.fillText(`${j}`, ox + 5, y - 4);
        }
      }
      ctx.restore();
    }

    if (coordSys.showAxes) {
      ctx.save();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.65)';

      ctx.beginPath();
      ctx.moveTo(0, oy);
      ctx.lineTo(width, oy);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(ox, 0);
      ctx.lineTo(ox, height);
      ctx.stroke();

      ctx.font = 'bold 11px Outfit, sans-serif';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`+X (${coordSys.unitLabel})`, width - 52, oy - 8);
      ctx.fillText(`+Y (${coordSys.unitLabel})`, ox + 8, 22);

      // Bullseye Origin
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(ox, oy, 7, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
      ctx.fill();

      ctx.font = '10px JetBrains Mono, monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('(0,0)', ox + 9, oy + 14);
      ctx.restore();
    }

    // Render Active Geometric Shape with Joyful Colors
    if (mode === 'circle') renderCircle(ctx, coordSys, circleParams);
    else if (mode === 'square') renderSquare(ctx, coordSys, squareParams);
    else if (mode === 'rectangle') renderRectangle(ctx, coordSys, rectangleParams);
    else if (mode === 'triangle') renderTriangle(ctx, coordSys, triangleParams);
    else if (mode === 'rhombus') renderRhombus(ctx, coordSys, rhombusParams);
    else if (mode === 'parallelogram') renderParallelogram(ctx, coordSys, parallelogramParams);
    else if (mode === 'parabola') renderParabola(ctx, coordSys, parabolaParams, width, height);
    else if (mode === 'slope') renderSlope(ctx, coordSys, slopeParams);

    // Render Manual CAD Calipers
    calipers.forEach((c) => {
      const p1 = toPixelCoords(c.p1, coordSys);
      const p2 = toPixelCoords(c.p2, coordSys);
      ctx.save();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();

      // End markers
      [p1, p2].forEach((p) => {
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // Label
      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;
      const label = `${c.distance.toFixed(2)} ${coordSys.unitLabel}`;
      ctx.font = 'bold 10px JetBrains Mono, monospace';
      ctx.fillStyle = '#0f172a';
      const tw = ctx.measureText(label).width;
      ctx.fillRect(midX - tw / 2 - 4, midY - 8, tw + 8, 16);
      ctx.strokeStyle = '#f59e0b';
      ctx.strokeRect(midX - tw / 2 - 4, midY - 8, tw + 8, 16);
      ctx.fillStyle = '#fef08a';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, midX, midY);
      ctx.restore();
    });

    // Render In-Progress CAD Tool markers
    if (cadToolPoints.length > 0) {
      ctx.save();
      cadToolPoints.forEach((pt, idx) => {
        const pix = toPixelCoords(pt, coordSys);
        ctx.fillStyle = '#ec4899';
        ctx.beginPath();
        ctx.arc(pix.x, pix.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#fbcfe8';
        ctx.font = 'bold 10px JetBrains Mono, monospace';
        ctx.fillText(`Pt ${idx + 1}`, pix.x + 8, pix.y - 4);
      });
      ctx.restore();
    }

    // 3-Point Mode Markers
    if (threePoints.length > 0) {
      ctx.save();
      threePoints.forEach((pt, idx) => {
        const pix = toPixelCoords(pt, coordSys);
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(pix.x, pix.y, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#fde68a';
        ctx.font = 'bold 11px Outfit, sans-serif';
        ctx.fillText(`P${idx + 1} (${pt.x}, ${pt.y})`, pix.x + 10, pix.y - 6);
      });
      ctx.restore();
    }

    // Viewfinder Reticle Overlay
    drawReticleOverlay(ctx, width, height, reticleStyle);
  }, [
    mode,
    inputSource,
    imageElement,
    videoRef,
    isWebcamActive,
    isFrozen,
    coordSys,
    circleParams,
    squareParams,
    rectangleParams,
    triangleParams,
    rhombusParams,
    parallelogramParams,
    parabolaParams,
    slopeParams,
    edgeResult,
    showEdgeFilter,
    threePoints,
    compareMode,
    splitPosition,
    cadTheme,
    reticleStyle,
    cameraZoom,
    activeVirtualScene,
    calipers,
    angles,
    polygons,
    cadToolPoints,
    objectType,
  ]);

  useEffect(() => {
    let animId: number;
    const loop = () => {
      render();
      if ((isWebcamActive && !isFrozen) || inputSource === 'virtual-bench') {
        animId = requestAnimationFrame(loop);
      }
    };
    loop();
    return () => cancelAnimationFrame(animId);
  }, [render, isWebcamActive, isFrozen, inputSource]);

  // SHAPE RENDERERS
  function renderCircle(ctx: CanvasRenderingContext2D, sys: CoordinateSystem, p: CircleParams) {
    const center = toPixelCoords({ x: p.h, y: p.k }, sys);
    const radiusPix = p.r * sys.pixelsPerUnit;
    ctx.save();

    if (p.showSector) {
      const angleRad = ((p.sectorAngle || 60) * Math.PI) / 180;
      ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
      ctx.beginPath();
      ctx.moveTo(center.x, center.y);
      ctx.arc(center.x, center.y, radiusPix, -angleRad, 0);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(center.x, center.y);
      ctx.lineTo(center.x + radiusPix, center.y);
      ctx.moveTo(center.x, center.y);
      ctx.lineTo(center.x + radiusPix * Math.cos(-angleRad), center.y + radiusPix * Math.sin(-angleRad));
      ctx.stroke();

      ctx.fillStyle = '#e0f2fe';
      ctx.font = 'bold 11px JetBrains Mono, monospace';
      ctx.fillText(`${p.sectorAngle || 60}° Sector`, center.x + radiusPix * 0.4, center.y - 12);
    }

    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = 'rgba(6, 182, 212, 0.6)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(center.x, center.y, radiusPix, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Center handle
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.arc(center.x, center.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Radius handle knob
    const rimHandle = { x: center.x + radiusPix, y: center.y };
    ctx.fillStyle = '#22d3ee';
    ctx.beginPath();
    ctx.arc(rimHandle.x, rimHandle.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Radius line
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 2]);
    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(rimHandle.x, rimHandle.y);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#cffafe';
    ctx.font = 'bold 11px Outfit, sans-serif';
    ctx.fillText(`r = ${p.r.toFixed(2)} ${sys.unitLabel}`, center.x + radiusPix * 0.45, center.y - 6);
    ctx.fillText(`Center (${p.h.toFixed(1)}, ${p.k.toFixed(1)})`, center.x + 10, center.y + 18);
    ctx.restore();
  }

  function renderSquare(ctx: CanvasRenderingContext2D, sys: CoordinateSystem, p: SquareParams) {
    const center = toPixelCoords({ x: p.h, y: p.k }, sys);
    const sidePix = p.side * sys.pixelsPerUnit;
    const m = calculateSquareMetrics(p);
    ctx.save();
    ctx.translate(center.x, center.y);
    ctx.rotate((p.rotationDeg * Math.PI) / 180);

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = 'rgba(245, 158, 11, 0.6)';
    ctx.shadowBlur = 10;
    ctx.strokeRect(-sidePix / 2, -sidePix / 2, sidePix, sidePix);
    ctx.shadowBlur = 0;

    // Corner handle
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(sidePix / 2, sidePix / 2, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#fef3c7';
    ctx.font = 'bold 11px Outfit, sans-serif';
    ctx.fillText(`s = ${p.side.toFixed(2)} ${sys.unitLabel}`, -sidePix / 2 + 8, -sidePix / 2 - 8);
    ctx.fillText(`Area = ${m.area.toFixed(2)} ${sys.unitLabel}²`, -sidePix / 4, 4);
    ctx.restore();
  }

  function renderRectangle(ctx: CanvasRenderingContext2D, sys: CoordinateSystem, p: RectangleParams) {
    const center = toPixelCoords({ x: p.h, y: p.k }, sys);
    const wPix = p.width * sys.pixelsPerUnit;
    const hPix = p.height * sys.pixelsPerUnit;
    const m = calculateRectangleMetrics(p);
    ctx.save();
    ctx.translate(center.x, center.y);
    ctx.rotate((p.rotationDeg * Math.PI) / 180);

    ctx.strokeStyle = '#818cf8';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = 'rgba(129, 140, 248, 0.6)';
    ctx.shadowBlur = 10;
    ctx.strokeRect(-wPix / 2, -hPix / 2, wPix, hPix);
    ctx.shadowBlur = 0;

    // Corner handle
    ctx.fillStyle = '#a5b4fc';
    ctx.beginPath();
    ctx.arc(wPix / 2, hPix / 2, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#e0e7ff';
    ctx.font = 'bold 11px Outfit, sans-serif';
    ctx.fillText(`${p.width.toFixed(1)} × ${p.height.toFixed(1)} ${sys.unitLabel}`, -wPix / 2 + 8, -hPix / 2 - 8);
    ctx.fillText(`Aspect: ${m.aspectRatio}:1`, -wPix / 4, 4);
    ctx.restore();
  }

  function renderTriangle(ctx: CanvasRenderingContext2D, sys: CoordinateSystem, p: TriangleParams) {
    const p1 = toPixelCoords({ x: p.x1, y: p.y1 }, sys);
    const p2 = toPixelCoords({ x: p.x2, y: p.y2 }, sys);
    const p3 = toPixelCoords({ x: p.x3, y: p.y3 }, sys);
    const m = calculateTriangleMetrics(p);
    ctx.save();

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = 'rgba(16, 185, 129, 0.6)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.closePath();
    ctx.stroke();
    ctx.shadowBlur = 0;

    [
      { pt: p1, label: 'A' },
      { pt: p2, label: 'B' },
      { pt: p3, label: 'C' },
    ].forEach(({ pt, label }) => {
      ctx.fillStyle = '#34d399';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#d1fae5';
      ctx.font = 'bold 11px Outfit, sans-serif';
      ctx.fillText(label, pt.x + 8, pt.y - 4);
    });

    const cx = (p1.x + p2.x + p3.x) / 3;
    const cy = (p1.y + p2.y + p3.y) / 3;
    ctx.fillStyle = '#d1fae5';
    ctx.font = 'bold 11px Outfit, sans-serif';
    ctx.fillText(`Area: ${m.area.toFixed(2)} ${sys.unitLabel}²`, cx - 35, cy);
    ctx.restore();
  }

  function renderRhombus(ctx: CanvasRenderingContext2D, sys: CoordinateSystem, p: RhombusParams) {
    const center = toPixelCoords({ x: p.h, y: p.k }, sys);
    const d1Pix = p.d1 * sys.pixelsPerUnit;
    const d2Pix = p.d2 * sys.pixelsPerUnit;
    ctx.save();
    ctx.translate(center.x, center.y);
    ctx.rotate((p.rotationDeg * Math.PI) / 180);

    const top = { x: 0, y: -d2Pix / 2 };
    const right = { x: d1Pix / 2, y: 0 };
    const bottom = { x: 0, y: d2Pix / 2 };
    const left = { x: -d1Pix / 2, y: 0 };

    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = 'rgba(236, 72, 153, 0.6)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(top.x, top.y);
    ctx.lineTo(right.x, right.y);
    ctx.lineTo(bottom.x, bottom.y);
    ctx.lineTo(left.x, left.y);
    ctx.closePath();
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Handles
    ctx.fillStyle = '#f472b6';
    [right, bottom].forEach((pt) => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    ctx.fillStyle = '#fce7f3';
    ctx.font = 'bold 11px Outfit, sans-serif';
    ctx.fillText(`d₁=${p.d1.toFixed(1)}, d₂=${p.d2.toFixed(1)} ${sys.unitLabel}`, -40, d2Pix / 2 + 18);
    ctx.restore();
  }

  function renderParallelogram(ctx: CanvasRenderingContext2D, sys: CoordinateSystem, p: ParallelogramParams) {
    const center = toPixelCoords({ x: p.h, y: p.k }, sys);
    const bPix = p.base * sys.pixelsPerUnit;
    const hPix = p.height * sys.pixelsPerUnit;
    const sPix = p.skew * sys.pixelsPerUnit;
    ctx.save();
    ctx.translate(center.x, center.y);
    ctx.rotate((p.rotationDeg * Math.PI) / 180);

    const bl = { x: -bPix / 2 - sPix / 2, y: hPix / 2 };
    const br = { x: bPix / 2 - sPix / 2, y: hPix / 2 };
    const tr = { x: bPix / 2 + sPix / 2, y: -hPix / 2 };
    const tl = { x: -bPix / 2 + sPix / 2, y: -hPix / 2 };

    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = 'rgba(139, 92, 246, 0.6)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(bl.x, bl.y);
    ctx.lineTo(br.x, br.y);
    ctx.lineTo(tr.x, tr.y);
    ctx.lineTo(tl.x, tl.y);
    ctx.closePath();
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#ede9fe';
    ctx.font = 'bold 11px Outfit, sans-serif';
    ctx.fillText(`Base: ${p.base.toFixed(1)}, Height: ${p.height.toFixed(1)} ${sys.unitLabel}`, -50, hPix / 2 + 18);
    ctx.restore();
  }

  function renderParabola(
    ctx: CanvasRenderingContext2D,
    sys: CoordinateSystem,
    p: ParabolaParams,
    width: number,
    height: number
  ) {
    ctx.save();
    ctx.strokeStyle = '#14b8a6';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = 'rgba(20, 184, 166, 0.6)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    let first = true;
    for (let mathX = -12; mathX <= 12; mathX += 0.2) {
      const mathY = p.a * mathX * mathX + p.b * mathX + p.c;
      const pt = toPixelCoords({ x: mathX, y: mathY }, sys);
      if (first) {
        ctx.moveTo(pt.x, pt.y);
        first = false;
      } else {
        ctx.lineTo(pt.x, pt.y);
      }
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    const vert = toPixelCoords({ x: p.h, y: p.k }, sys);
    ctx.fillStyle = '#2dd4bf';
    ctx.beginPath();
    ctx.arc(vert.x, vert.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ccfbf1';
    ctx.font = 'bold 11px Outfit, sans-serif';
    ctx.fillText(`Vertex (${p.h.toFixed(1)}, ${p.k.toFixed(1)})`, vert.x + 10, vert.y - 10);
    ctx.restore();
  }

  function renderSlope(ctx: CanvasRenderingContext2D, sys: CoordinateSystem, p: SlopeParams) {
    const p1 = toPixelCoords({ x: p.x1, y: p.y1 }, sys);
    const p2 = toPixelCoords({ x: p.x2, y: p.y2 }, sys);
    const corner = { x: p2.x, y: p1.y };
    ctx.save();

    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();

    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#fdba74';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(corner.x, corner.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    ctx.setLineDash([]);

    [p1, p2].forEach((pt, i) => {
      ctx.fillStyle = '#fb923c';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#ffedd5';
      ctx.font = 'bold 11px Outfit, sans-serif';
      ctx.fillText(i === 0 ? 'P1' : 'P2', pt.x + 8, pt.y - 4);
    });

    ctx.fillStyle = '#ffedd5';
    ctx.font = 'bold 11px Outfit, sans-serif';
    ctx.fillText(`θ = ${p.angleDeg.toFixed(1)}°`, p1.x + 20, p1.y - 12);
    ctx.restore();
  }

  // MOUSE & TOUCH EVENT HANDLERS
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mousePix: Point = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    clickStartPosRef.current = { x: mousePix.x, y: mousePix.y };
    const mathPos = toMathCoords(mousePix, coordSys);

    // 1. 3-Point Mode Handling
    if (isThreePointMode) {
      onAddThreePoint(mathPos);
      audioFeedback.playSnap();
      return;
    }

    // 2. Interactive CAD Tools Handling (Caliper, Protractor, Polygon, Scale Calibrate)
    if (cadTool !== 'none') {
      if (cadTool === 'caliper') {
        if (cadToolPoints.length === 0) {
          setCadToolPoints([mathPos]);
          audioFeedback.playSnap();
        } else {
          const p1 = cadToolPoints[0];
          const p2 = mathPos;
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dist = Math.hypot(dx, dy);
          const slopeAngle = (Math.atan2(dy, dx) * 180) / Math.PI;

          onAddCaliper({
            id: `caliper-${Date.now()}`,
            p1,
            p2,
            distance: Number(dist.toFixed(2)),
            dx: Number(dx.toFixed(2)),
            dy: Number(dy.toFixed(2)),
            slopeAngleDeg: Number(slopeAngle.toFixed(1)),
          });
          audioFeedback.playSnap();
          setCadToolPoints([]);
        }
        return;
      }

      if (cadTool === 'protractor') {
        if (cadToolPoints.length < 2) {
          setCadToolPoints((prev) => [...prev, mathPos]);
          audioFeedback.playSnap();
        } else {
          const p1 = cadToolPoints[0];
          const vertex = cadToolPoints[1];
          const p2 = mathPos;

          const a1 = Math.atan2(p1.y - vertex.y, p1.x - vertex.x);
          const a2 = Math.atan2(p2.y - vertex.y, p2.x - vertex.x);
          let diffRad = Math.abs(a2 - a1);
          if (diffRad > Math.PI) diffRad = 2 * Math.PI - diffRad;
          const diffDeg = (diffRad * 180) / Math.PI;

          onAddAngle({
            id: `angle-${Date.now()}`,
            p1,
            vertex,
            p2,
            angleDeg: Number(diffDeg.toFixed(1)),
            angleRad: Number(diffRad.toFixed(3)),
          });
          audioFeedback.playSnap();
          setCadToolPoints([]);
        }
        return;
      }

      if (cadTool === 'polygon') {
        if (cadToolPoints.length >= 3) {
          // Check if user clicked near first point to close
          const firstPix = toPixelCoords(cadToolPoints[0], coordSys);
          if (Math.hypot(mousePix.x - firstPix.x, mousePix.y - firstPix.y) < 20) {
            // Close polygon
            let area = 0;
            let perimeter = 0;
            const pts = cadToolPoints;
            for (let i = 0; i < pts.length; i++) {
              const j = (i + 1) % pts.length;
              area += pts[i].x * pts[j].y - pts[j].x * pts[i].y;
              perimeter += Math.hypot(pts[j].x - pts[i].x, pts[j].y - pts[i].y);
            }
            area = Math.abs(area) / 2;

            const avgX = pts.reduce((s, p) => s + p.x, 0) / pts.length;
            const avgY = pts.reduce((s, p) => s + p.y, 0) / pts.length;

            onAddPolygon({
              id: `polygon-${Date.now()}`,
              points: pts,
              perimeter: Number(perimeter.toFixed(2)),
              area: Number(area.toFixed(2)),
              centroid: { x: Number(avgX.toFixed(2)), y: Number(avgY.toFixed(2)) },
            });
            audioFeedback.playSnap();
            setCadToolPoints([]);
            return;
          }
        }
        setCadToolPoints((prev) => [...prev, mathPos]);
        audioFeedback.playSnap();
        return;
      }

      if (cadTool === 'calibrate') {
        if (cadToolPoints.length === 0) {
          setCadToolPoints([mathPos]);
          audioFeedback.playSnap();
        } else {
          const p1Pix = toPixelCoords(cadToolPoints[0], coordSys);
          const p2Pix = mousePix;
          const pixelDist = Math.hypot(p2Pix.x - p1Pix.x, p2Pix.y - p1Pix.y);

          const promptVal = window.prompt(
            'Enter the real-world distance between these two points in meters (e.g. 0.15 for 15 cm, 1.0 for 1 m):',
            '1.0'
          );
          if (promptVal && !isNaN(Number(promptVal)) && Number(promptVal) > 0) {
            const realUnits = Number(promptVal);
            const newPPU = Math.round(pixelDist / realUnits);
            onUpdateCoordSys({ pixelsPerUnit: Math.max(10, Math.min(250, newPPU)) });
            audioFeedback.playSnap();
          }
          setCadToolPoints([]);
        }
        return;
      }
    }

    // 3. Before/After Split Curtain divider drag
    if (compareMode === 'split-curtain') {
      const splitX = canvas.width * splitPosition;
      if (Math.abs(mousePix.x - splitX) < 24) {
        setActiveDrag('split-divider');
        return;
      }
    }

    // 4. Origin Datum Drag
    const hit = 16;
    if (Math.hypot(mousePix.x - coordSys.originX, mousePix.y - coordSys.originY) < hit) {
      setActiveDrag('origin');
      setDragOffset({ x: mousePix.x - coordSys.originX, y: mousePix.y - coordSys.originY });
      return;
    }

    // 5. Geometric Shape Handles Drag
    if (mode === 'circle') {
      const c = toPixelCoords({ x: circleParams.h, y: circleParams.k }, coordSys);
      const rPix = circleParams.r * coordSys.pixelsPerUnit;
      if (Math.hypot(mousePix.x - c.x, mousePix.y - c.y) < hit) setActiveDrag('circle-center');
      else if (Math.abs(Math.hypot(mousePix.x - c.x, mousePix.y - c.y) - rPix) < hit)
        setActiveDrag('circle-radius');
    } else if (mode === 'square') {
      const c = toPixelCoords({ x: squareParams.h, y: squareParams.k }, coordSys);
      if (Math.hypot(mousePix.x - c.x, mousePix.y - c.y) < hit) setActiveDrag('square-center');
      else {
        const m = calculateSquareMetrics(squareParams);
        const verts = m.vertices.map((v) => toPixelCoords(v, coordSys));
        if (verts.some((v) => Math.hypot(mousePix.x - v.x, mousePix.y - v.y) < hit))
          setActiveDrag('square-corner');
      }
    } else if (mode === 'rectangle') {
      const c = toPixelCoords({ x: rectangleParams.h, y: rectangleParams.k }, coordSys);
      if (Math.hypot(mousePix.x - c.x, mousePix.y - c.y) < hit) setActiveDrag('rectangle-center');
      else {
        const m = calculateRectangleMetrics(rectangleParams);
        const verts = m.vertices.map((v) => toPixelCoords(v, coordSys));
        if (verts.some((v) => Math.hypot(mousePix.x - v.x, mousePix.y - v.y) < hit))
          setActiveDrag('rectangle-corner');
      }
    } else if (mode === 'triangle') {
      const p1 = toPixelCoords({ x: triangleParams.x1, y: triangleParams.y1 }, coordSys);
      const p2 = toPixelCoords({ x: triangleParams.x2, y: triangleParams.y2 }, coordSys);
      const p3 = toPixelCoords({ x: triangleParams.x3, y: triangleParams.y3 }, coordSys);
      if (Math.hypot(mousePix.x - p1.x, mousePix.y - p1.y) < hit) setActiveDrag('triangle-p1');
      else if (Math.hypot(mousePix.x - p2.x, mousePix.y - p2.y) < hit) setActiveDrag('triangle-p2');
      else if (Math.hypot(mousePix.x - p3.x, mousePix.y - p3.y) < hit) setActiveDrag('triangle-p3');
    } else if (mode === 'rhombus') {
      const c = toPixelCoords({ x: rhombusParams.h, y: rhombusParams.k }, coordSys);
      if (Math.hypot(mousePix.x - c.x, mousePix.y - c.y) < hit) setActiveDrag('rhombus-center');
      else {
        const d1Knob = toPixelCoords(
          { x: rhombusParams.h + rhombusParams.d1 / 2, y: rhombusParams.k },
          coordSys
        );
        const d2Knob = toPixelCoords(
          { x: rhombusParams.h, y: rhombusParams.k + rhombusParams.d2 / 2 },
          coordSys
        );
        if (Math.hypot(mousePix.x - d1Knob.x, mousePix.y - d1Knob.y) < hit) setActiveDrag('rhombus-d1');
        else if (Math.hypot(mousePix.x - d2Knob.x, mousePix.y - d2Knob.y) < hit) setActiveDrag('rhombus-d2');
      }
    } else if (mode === 'parallelogram') {
      const c = toPixelCoords({ x: parallelogramParams.h, y: parallelogramParams.k }, coordSys);
      if (Math.hypot(mousePix.x - c.x, mousePix.y - c.y) < hit) setActiveDrag('parallelogram-center');
      else setActiveDrag('parallelogram-corner');
    } else if (mode === 'parabola') {
      const v = toPixelCoords({ x: parabolaParams.h, y: parabolaParams.k }, coordSys);
      if (Math.hypot(mousePix.x - v.x, mousePix.y - v.y) < hit) setActiveDrag('parabola-vertex');
    } else if (mode === 'slope') {
      const p1 = toPixelCoords({ x: slopeParams.x1, y: slopeParams.y1 }, coordSys);
      const p2 = toPixelCoords({ x: slopeParams.x2, y: slopeParams.y2 }, coordSys);
      if (Math.hypot(mousePix.x - p1.x, mousePix.y - p1.y) < hit) setActiveDrag('slope-p1');
      else if (Math.hypot(mousePix.x - p2.x, mousePix.y - p2.y) < hit) setActiveDrag('slope-p2');
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mousePix: Point = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    const mathPos = toMathCoords(mousePix, coordSys);
    setMouseMathPos(mathPos);

    if (compareMode === 'split-curtain') {
      const splitX = canvas.width * splitPosition;
      setIsHoveringDivider(Math.abs(mousePix.x - splitX) < 20);
    } else {
      setIsHoveringDivider(false);
    }

    if (activeDrag === 'none') return;

    if (activeDrag === 'split-divider') {
      const newPos = Math.max(0.05, Math.min(0.95, mousePix.x / canvas.width));
      onUpdateSplitPosition(newPos);
      return;
    }

    if (activeDrag === 'origin') {
      onUpdateCoordSys({ originX: mousePix.x - dragOffset.x, originY: mousePix.y - dragOffset.y });
    } else if (activeDrag === 'circle-center') {
      onUpdateCircle({ ...circleParams, h: mathPos.x, k: mathPos.y });
    } else if (activeDrag === 'circle-radius') {
      const r = Math.hypot(mathPos.x - circleParams.h, mathPos.y - circleParams.k);
      onUpdateCircle({ ...circleParams, r: Math.max(0.2, Number(r.toFixed(2))) });
    } else if (activeDrag === 'square-center') {
      onUpdateSquare({ ...squareParams, h: mathPos.x, k: mathPos.y });
    } else if (activeDrag === 'square-corner') {
      const side = Math.hypot(mathPos.x - squareParams.h, mathPos.y - squareParams.k) * Math.SQRT2;
      onUpdateSquare({ ...squareParams, side: Math.max(0.5, Number(side.toFixed(2))) });
    } else if (activeDrag === 'rectangle-center') {
      onUpdateRectangle({ ...rectangleParams, h: mathPos.x, k: mathPos.y });
    } else if (activeDrag === 'rectangle-corner') {
      const w = Math.abs(mathPos.x - rectangleParams.h) * 2;
      const h = Math.abs(mathPos.y - rectangleParams.k) * 2;
      onUpdateRectangle({
        ...rectangleParams,
        width: Math.max(0.5, Number(w.toFixed(2))),
        height: Math.max(0.5, Number(h.toFixed(2))),
      });
    } else if (activeDrag === 'triangle-p1') {
      onUpdateTriangle({ ...triangleParams, x1: mathPos.x, y1: mathPos.y });
    } else if (activeDrag === 'triangle-p2') {
      onUpdateTriangle({ ...triangleParams, x2: mathPos.x, y2: mathPos.y });
    } else if (activeDrag === 'triangle-p3') {
      onUpdateTriangle({ ...triangleParams, x3: mathPos.x, y3: mathPos.y });
    } else if (activeDrag === 'rhombus-center') {
      onUpdateRhombus({ ...rhombusParams, h: mathPos.x, k: mathPos.y });
    } else if (activeDrag === 'rhombus-d1') {
      const d1 = Math.abs(mathPos.x - rhombusParams.h) * 2;
      onUpdateRhombus({ ...rhombusParams, d1: Math.max(0.5, Number(d1.toFixed(2))) });
    } else if (activeDrag === 'rhombus-d2') {
      const d2 = Math.abs(mathPos.y - rhombusParams.k) * 2;
      onUpdateRhombus({ ...rhombusParams, d2: Math.max(0.5, Number(d2.toFixed(2))) });
    } else if (activeDrag === 'parallelogram-center') {
      onUpdateParallelogram({ ...parallelogramParams, h: mathPos.x, k: mathPos.y });
    } else if (activeDrag === 'parallelogram-corner') {
      const b = Math.abs(mathPos.x - parallelogramParams.h) * 2;
      const h = Math.abs(mathPos.y - parallelogramParams.k) * 2;
      onUpdateParallelogram({
        ...parallelogramParams,
        base: Math.max(0.5, Number(b.toFixed(2))),
        height: Math.max(0.5, Number(h.toFixed(2))),
      });
    } else if (activeDrag === 'parabola-vertex') {
      const a = parabolaParams.a;
      const newB = -2 * a * mathPos.x;
      const newC = a * mathPos.x * mathPos.x + mathPos.y;
      onUpdateParabola({
        ...parabolaParams,
        h: mathPos.x,
        k: mathPos.y,
        b: Number(newB.toFixed(3)),
        c: Number(newC.toFixed(2)),
      });
    } else if (activeDrag === 'slope-p1') {
      const angle =
        Math.atan2(slopeParams.y2 - mathPos.y, slopeParams.x2 - mathPos.x) * (180 / Math.PI);
      onUpdateSlope({ ...slopeParams, x1: mathPos.x, y1: mathPos.y, angleDeg: Number(angle.toFixed(1)) });
    } else if (activeDrag === 'slope-p2') {
      const angle =
        Math.atan2(mathPos.y - slopeParams.y1, mathPos.x - slopeParams.x1) * (180 / Math.PI);
      onUpdateSlope({ ...slopeParams, x2: mathPos.x, y2: mathPos.y, angleDeg: Number(angle.toFixed(1)) });
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas && onTriggerVoiceTutor && !isThreePointMode && cadTool === 'none') {
      const rect = canvas.getBoundingClientRect();
      const mousePix = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      const dx = Math.abs(mousePix.x - clickStartPosRef.current.x);
      const dy = Math.abs(mousePix.y - clickStartPosRef.current.y);
      if (dx < 6 && dy < 6) {
        onTriggerVoiceTutor();
      }
    }
    setActiveDrag('none');
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[440px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col justify-center items-center"
    >
      <canvas
        ref={canvasRef}
        width={canvasDim.width}
        height={canvasDim.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => setActiveDrag('none')}
        className={`w-full h-full block ${
          cadTool !== 'none' || isThreePointMode
            ? 'cursor-crosshair'
            : isHoveringDivider || activeDrag === 'split-divider'
            ? 'cursor-ew-resize'
            : activeDrag !== 'none'
            ? 'cursor-grabbing'
            : 'cursor-default'
        }`}
      />

      {/* Floating Canvas Quick Navigation Pills */}
      <div className="absolute top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-slate-900/95 backdrop-blur-md px-2 py-1 rounded-xl border border-slate-700/80 shadow-2xl text-xs z-20">
        <button
          onClick={() => onSetCompareMode('overlay')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all ${
            compareMode === 'overlay'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="Normal Camera/Image with Math Overlays"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">HUD Overlay</span>
        </button>

        <button
          onClick={() => onSetCompareMode('split-curtain')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all ${
            compareMode === 'split-curtain'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="Before vs. After: Draggable Split-Screen (Photo vs. Wireframe CAD Blueprint)"
        >
          <Split className="w-3.5 h-3.5" />
          <span>Before / After Split</span>
        </button>

        <button
          onClick={() => onSetCompareMode('cad-blueprint')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all ${
            compareMode === 'cad-blueprint'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="100% Futuristic Wireframe CAD Mathematical Blueprint"
        >
          <Compass className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">CAD Blueprint</span>
        </button>
      </div>

      {/* Floating Scale & Origin Controls */}
      <div className="absolute top-3.5 left-3.5 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 shadow-lg text-xs text-slate-200">
        <button
          onClick={() =>
            onUpdateCoordSys({ pixelsPerUnit: Math.min(140, Math.round(coordSys.pixelsPerUnit * 1.15)) })
          }
          title="Zoom in scale"
          className="p-1 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() =>
            onUpdateCoordSys({ pixelsPerUnit: Math.max(15, Math.round(coordSys.pixelsPerUnit * 0.85)) })
          }
          title="Zoom out scale"
          className="p-1 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <span className="text-slate-600">|</span>
        <button
          onClick={() =>
            onUpdateCoordSys({
              originX: Math.floor(canvasDim.width / 2),
              originY: Math.floor(canvasDim.height / 2),
            })
          }
          title="Center (0,0) Origin"
          className="flex items-center gap-1.5 p-1 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors font-medium text-[11px]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Origin (0,0)</span>
        </button>
      </div>

      {/* Floating AI Voice Tutor Quick Action */}
      {onTriggerVoiceTutor && !isThreePointMode && cadTool === 'none' && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTriggerVoiceTutor();
          }}
          title="Listen to 10-second AI Voice Tutor explanation"
          className="absolute top-3.5 right-3.5 flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 via-indigo-500 to-amber-400 p-[1.5px] rounded-xl shadow-lg shadow-indigo-500/20 group hover:scale-105 active:scale-95 transition-all z-10"
        >
          <div className="bg-slate-950/90 group-hover:bg-slate-900/90 px-3 py-1.5 rounded-[10px] flex items-center gap-1.5 text-xs font-semibold text-cyan-300">
            <Volume2 className="w-3.5 h-3.5 text-cyan-400 group-hover:animate-pulse" />
            <span>AI Voice Tutor</span>
          </div>
        </button>
      )}

      {/* Live Coordinate Readout Badge */}
      <div className="absolute bottom-3.5 left-3.5 flex items-center gap-3 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-700/80 text-xs font-mono tabular-nums text-slate-200 shadow-xl">
        <span className="flex items-center gap-1.5 text-cyan-400 font-semibold font-display">
          <Crosshair className="w-3.5 h-3.5" />
          Math Lens
        </span>
        <span className="text-slate-600">/</span>
        <span>
          X: <strong className="text-white">{mouseMathPos ? mouseMathPos.x.toFixed(2) : '0.00'}</strong>{' '}
          {coordSys.unitLabel}
        </span>
        <span>
          Y: <strong className="text-white">{mouseMathPos ? mouseMathPos.y.toFixed(2) : '0.00'}</strong>{' '}
          {coordSys.unitLabel}
        </span>
        <span className="text-slate-600">/</span>
        <span className="text-amber-400 font-semibold uppercase">{mode}</span>
      </div>

      {/* Tool In-Progress Instruction Pill */}
      {cadTool !== 'none' && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 font-bold px-4 py-1.5 rounded-full shadow-2xl text-xs flex items-center gap-2 animate-bounce">
          <Ruler className="w-3.5 h-3.5" />
          {cadTool === 'caliper' && (
            <span>
              {cadToolPoints.length === 0
                ? 'Click 1st point to start caliper measurement'
                : 'Click 2nd point to lock caliper distance'}
            </span>
          )}
          {cadTool === 'protractor' && (
            <span>
              {cadToolPoints.length === 0
                ? 'Click 1st point (Arm 1)'
                : cadToolPoints.length === 1
                ? 'Click 2nd point (Angle Vertex)'
                : 'Click 3rd point (Arm 2) to calculate θ'}
            </span>
          )}
          {cadTool === 'polygon' && (
            <span>
              Click points around shape. Click 1st point to close polygon ({cadToolPoints.length} pts placed).
            </span>
          )}
          {cadTool === 'calibrate' && (
            <span>
              {cadToolPoints.length === 0
                ? 'Click 1st calibration reference point'
                : 'Click 2nd reference point to calibrate scale'}
            </span>
          )}
        </div>
      )}

      {isThreePointMode && (
        <div className="absolute top-3.5 right-3.5 bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl shadow-xl text-xs animate-pulse">
          Click 3 points on canvas to mathematically snap {mode}
        </div>
      )}

      {compareMode === 'split-curtain' && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md px-3.5 py-1 rounded-full border border-cyan-500/40 text-[11px] font-mono text-cyan-300 shadow-xl pointer-events-none flex items-center gap-1.5 animate-pulse">
          <span>↔</span>
          <span>Drag the vertical cyan divider to peel between Real Photo & CAD Blueprint</span>
        </div>
      )}
    </div>
  );
};
