import React, { useState, useRef, useEffect } from 'react';
import {
  Mode,
  InputSource,
  CoordinateSystem,
  CircleParams,
  SquareParams,
  RectangleParams,
  TriangleParams,
  RhombusParams,
  ParallelogramParams,
  ParabolaParams,
  SlopeParams,
  MathPoint,
  CompareMode,
  CADTheme,
  ReticleStyle,
  CADTool,
  CaliperMeasurement,
  AngleMeasurement,
  PolygonMeasurement,
  CameraSettings,
  ObjectType,
} from './types';
import { PRESET_IMAGES } from './data/presets';
import {
  runSobelFilter,
  autoDetectCircle,
  autoDetectSquare,
  autoDetectRectangle,
  autoDetectTriangle,
  autoDetectRhombus,
  autoDetectParallelogram,
  autoDetectParabola,
  autoDetectSlope,
  CVEdgeResult,
} from './utils/cv';
import {
  fitCircleFrom3Points,
  fitParabolaFrom3Points,
  calculateCircleMetrics,
  calculateSquareMetrics,
  calculateRectangleMetrics,
  calculateTriangleMetrics,
  calculateRhombusMetrics,
  calculateParallelogramMetrics,
  calculateParabolaMetrics,
  calculateSlopeMetrics,
} from './utils/geometry';
import { generateStandaloneHTML } from './utils/exporter';
import { ExhibitionHeader } from './components/ExhibitionHeader';
import { ExhibitionFooter } from './components/ExhibitionFooter';
import { MathCanvas } from './components/MathCanvas';
import { HUDControls } from './components/HUDControls';
import { CBSEPanel } from './components/CBSEPanel';
import { VoiceTutorPanel } from './components/VoiceTutorPanel';
import { EquationVisualizer3D } from './components/EquationVisualizer3D';
import { CameraCadToolbar } from './components/CameraCadToolbar';
import { speechSynthesizer, getLiveExplanation } from './utils/voiceTutor';
import { audioFeedback } from './utils/audioFeedback';
import { renderVirtualCameraScene, VirtualBenchScene, VIRTUAL_BENCH_SCENES } from './utils/virtualCamera';
import { drawCADBlueprint } from './utils/cadBlueprint';
import {
  Layers,
  AlertCircle,
  Sparkles,
  Smartphone,
  Tablet,
  Disc,
  Trees,
  Puzzle,
  Construction,
  TrendingDown,
  Info,
  Volume2,
  Rotate3d,
  Orbit,
  Radio,
  Sun,
  Triangle,
  Wind,
  Activity,
  Compass,
  Boxes,
  Trophy,
  Grid3X3,
} from 'lucide-react';

export default function App() {
  const [activeAppTab, setActiveAppTab] = useState<'vision' | '3d-equations'>('vision');
  const [equationQueryFor3D, setEquationQueryFor3D] = useState<string>('z = x^2 - y^2');

  const [inputSource, setInputSource] = useState<InputSource>('preset');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('smartphone-device');
  const [activeVirtualScene, setActiveVirtualScene] = useState<VirtualBenchScene>('wheel');
  const [isWebcamActive, setIsWebcamActive] = useState<boolean>(false);
  const [isFrozen, setIsFrozen] = useState<boolean>(false);
  const [webcamError, setWebcamError] = useState<string | null>(null);

  const [mode, setMode] = useState<Mode>('rectangle');
  const [compareMode, setCompareMode] = useState<CompareMode>('split-curtain');
  const [splitPosition, setSplitPosition] = useState<number>(0.52);

  // CAD Lens & Camera State
  const [cadTheme, setCadTheme] = useState<CADTheme>('cyan-blueprint');
  const [cadTool, setCadTool] = useState<CADTool>('none');
  const [reticleStyle, setReticleStyle] = useState<ReticleStyle>('tactical');
  const [cameraSettings, setCameraSettings] = useState<CameraSettings>({
    facingMode: 'environment',
    torch: false,
    zoom: 1.0,
    reticle: 'tactical',
    filter: 'none',
    shutterTimer: 0,
  });

  const [calipers, setCalipers] = useState<CaliperMeasurement[]>([]);
  const [angles, setAngles] = useState<AngleMeasurement[]>([]);
  const [polygons, setPolygons] = useState<PolygonMeasurement[]>([]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const webcamStreamRef = useRef<MediaStream | null>(null);
  const [currentImageElement, setCurrentImageElement] = useState<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [coordSys, setCoordSys] = useState<CoordinateSystem>({
    originX: 0,
    originY: 0,
    pixelsPerUnit: 36,
    showGrid: true,
    showAxes: true,
    unitLabel: 'm',
  });

  // 8 Shapes Parameters
  const [circleParams, setCircleParams] = useState<CircleParams>({
    h: 0,
    k: 0,
    r: 5.2,
    showTangents: true,
    showSector: true,
    sectorAngle: 60,
  });

  const [squareParams, setSquareParams] = useState<SquareParams>({
    h: 0,
    k: 0,
    side: 4.5,
    rotationDeg: 0,
  });

  const [rectangleParams, setRectangleParams] = useState<RectangleParams>({
    h: 0,
    k: 0,
    width: 4.2,
    height: 9.0,
    rotationDeg: 0,
  });

  const [triangleParams, setTriangleParams] = useState<TriangleParams>({
    x1: -4.5,
    y1: -3.5,
    x2: 3.5,
    y2: -3.5,
    x3: -0.5,
    y3: 4.2,
  });

  const [rhombusParams, setRhombusParams] = useState<RhombusParams>({
    h: 0,
    k: 0,
    d1: 5.5,
    d2: 7.2,
    rotationDeg: 0,
  });

  const [parallelogramParams, setParallelogramParams] = useState<ParallelogramParams>({
    h: 0,
    k: 0,
    base: 5.2,
    height: 3.6,
    skew: 1.8,
    rotationDeg: 0,
  });

  const [parabolaParams, setParabolaParams] = useState<ParabolaParams>({
    a: -0.015,
    b: 0,
    c: 4.8,
    h: 0,
    k: 4.8,
    showRoots: true,
    showDirectrix: true,
  });

  const [slopeParams, setSlopeParams] = useState<SlopeParams>({
    x1: -4.8,
    y1: -3.6,
    x2: -0.2,
    y2: 4.8,
    angleDeg: 61.4,
    targetObject: 'Tree Height',
  });

  const [edgeResult, setEdgeResult] = useState<CVEdgeResult | null>(null);
  const [showEdgeFilter, setShowEdgeFilter] = useState<boolean>(false);
  const [isThreePointMode, setIsThreePointMode] = useState<boolean>(false);
  const [threePoints, setThreePoints] = useState<MathPoint[]>([]);
  const [autoPlayVoice, setAutoPlayVoice] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(
    'Math Lens loaded! Tap Live Camera or select CAD Measurement Tools to inspect geometry.'
  );

  const activePreset = inputSource === 'preset' ? PRESET_IMAGES.find((p) => p.id === selectedPresetId) : null;
  const activeObjectType = activePreset?.objectType;

  // Active metrics calculation for voice tutor & UI
  const activeMetrics = React.useMemo(() => {
    switch (mode) {
      case 'circle': {
        const m = calculateCircleMetrics(circleParams);
        return { radius: m.radius, circumference: m.circumference, area: m.area };
      }
      case 'square': {
        const m = calculateSquareMetrics(squareParams);
        return { side: m.side, area: m.area, perimeter: m.perimeter, diagonal: m.diagonal };
      }
      case 'rectangle': {
        const m = calculateRectangleMetrics(rectangleParams);
        return {
          width: m.width,
          height: m.height,
          area: m.area,
          perimeter: m.perimeter,
          diagonal: m.diagonal,
          aspectRatio: m.aspectRatio,
        };
      }
      case 'triangle': {
        const m = calculateTriangleMetrics(triangleParams);
        return { area: m.area, perimeter: m.perimeter };
      }
      case 'rhombus': {
        const m = calculateRhombusMetrics(rhombusParams);
        return { d1: m.d1, d2: m.d2, area: m.area, perimeter: m.perimeter };
      }
      case 'parallelogram': {
        const m = calculateParallelogramMetrics(parallelogramParams);
        return { width: m.base, height: m.height, area: m.area, perimeter: m.perimeter };
      }
      case 'parabola': {
        const m = calculateParabolaMetrics(parabolaParams);
        return {
          a: parabolaParams.a,
          b: parabolaParams.b,
          c: parabolaParams.c,
          vertexX: m.vertex.x,
          vertexY: m.vertex.y,
        };
      }
      case 'slope': {
        const m = calculateSlopeMetrics(slopeParams);
        return {
          angleDeg: m.angleDeg,
          slope: m.slope,
          height: m.dy,
          baseRun: m.dx,
          hypotenuse: m.hypotenuse,
        };
      }
      default:
        return undefined;
    }
  }, [
    mode,
    circleParams,
    squareParams,
    rectangleParams,
    triangleParams,
    rhombusParams,
    parallelogramParams,
    parabolaParams,
    slopeParams,
  ]);

  const handleTriggerVoiceTutor = (customObj?: ObjectType) => {
    const obj = customObj || activeObjectType;
    const script = getLiveExplanation({ mode, objectType: obj, metrics: activeMetrics });
    speechSynthesizer.speak(script.text);
    setStatusMessage(`🔊 AI Voice Tutor Speaking: "${script.title}"`);
  };

  // Load preset image
  useEffect(() => {
    if (inputSource === 'preset') {
      const preset = PRESET_IMAGES.find((p) => p.id === selectedPresetId) || PRESET_IMAGES[0];
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = preset.url;
      img.onload = () => {
        setCurrentImageElement(img);
        setMode(preset.defaultMode);
        if (preset.defaultParams.scale) {
          setCoordSys((prev) => ({ ...prev, pixelsPerUnit: preset.defaultParams.scale || 36 }));
        }
        if (preset.defaultParams.circle) setCircleParams((prev) => ({ ...prev, ...preset.defaultParams.circle }));
        if (preset.defaultParams.square) setSquareParams((prev) => ({ ...prev, ...preset.defaultParams.square }));
        if (preset.defaultParams.rectangle) setRectangleParams((prev) => ({ ...prev, ...preset.defaultParams.rectangle }));
        if (preset.defaultParams.triangle) setTriangleParams((prev) => ({ ...prev, ...preset.defaultParams.triangle }));
        if (preset.defaultParams.rhombus) setRhombusParams((prev) => ({ ...prev, ...preset.defaultParams.rhombus }));
        if (preset.defaultParams.parallelogram) setParallelogramParams((prev) => ({ ...prev, ...preset.defaultParams.parallelogram }));
        if (preset.defaultParams.parabola) setParabolaParams((prev) => ({ ...prev, ...preset.defaultParams.parabola }));
        if (preset.defaultParams.slope) setSlopeParams((prev) => ({ ...prev, ...preset.defaultParams.slope }));

        extractEdgeMapFromImage(img);
        setStatusMessage(`Loaded "${preset.name}" · Target Geometry: ${preset.category}`);
      };
    }
  }, [selectedPresetId, inputSource]);

  const extractEdgeMapFromImage = (img: HTMLImageElement) => {
    try {
      const off = document.createElement('canvas');
      const maxDim = 800;
      let w = img.naturalWidth || 800;
      let h = img.naturalHeight || 500;
      if (w > maxDim) {
        h = Math.round((h * maxDim) / w);
        w = maxDim;
      }
      off.width = w;
      off.height = h;
      const oCtx = off.getContext('2d');
      if (!oCtx) return;
      oCtx.drawImage(img, 0, 0, w, h);
      const imgData = oCtx.getImageData(0, 0, w, h);
      const edges = runSobelFilter(imgData, 42);
      setEdgeResult(edges);
    } catch {
      // Ignore cross-origin limitations
    }
  };

  const startWebcam = async (preferredFacing?: 'user' | 'environment') => {
    try {
      setWebcamError(null);
      const facing = preferredFacing || cameraSettings.facingMode;
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facing,
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        });
        webcamStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsWebcamActive(true);
        setIsFrozen(false);
        setInputSource('webcam');
        setStatusMessage(
          `Live ${facing === 'user' ? 'front (user)' : 'rear (environment)'} camera feed active! Use Reticle HUD & Snapshot.`
        );
      } else {
        throw new Error('Camera API not supported in this browser.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to access camera';
      setWebcamError(msg);
      // Fallback to animated virtual bench
      setInputSource('virtual-bench');
      setStatusMessage('Hardware camera unavailable. Switched to Virtual Engineering Bench simulation.');
    }
  };

  const stopWebcam = () => {
    if (webcamStreamRef.current) {
      webcamStreamRef.current.getTracks().forEach((t) => t.stop());
      webcamStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsWebcamActive(false);
    setIsFrozen(false);
  };

  const toggleWebcam = () => {
    if (isWebcamActive) {
      stopWebcam();
      setInputSource('preset');
    } else {
      startWebcam();
    }
  };

  const handleFlipCamera = async () => {
    const nextFacing = cameraSettings.facingMode === 'user' ? 'environment' : 'user';
    setCameraSettings((prev) => ({ ...prev, facingMode: nextFacing, torch: false }));
    if (isWebcamActive) {
      stopWebcam();
      await startWebcam(nextFacing);
    } else {
      setStatusMessage(`Camera target set to: ${nextFacing === 'user' ? 'Front' : 'Rear'}`);
    }
  };

  const handleToggleTorch = async () => {
    if (!webcamStreamRef.current) {
      setStatusMessage('Flashlight requires an active camera stream.');
      return;
    }
    const track = webcamStreamRef.current.getVideoTracks()[0];
    if (!track) return;
    const nextTorch = !cameraSettings.torch;
    try {
      const capabilities = track.getCapabilities ? (track.getCapabilities() as Record<string, unknown>) : {};
      if ('torch' in capabilities) {
        await track.applyConstraints({
          advanced: [{ torch: nextTorch } as Record<string, unknown>],
        });
        setCameraSettings((prev) => ({ ...prev, torch: nextTorch }));
        setStatusMessage(nextTorch ? '⚡ Camera Flashlight Active' : 'Camera Flashlight Off');
      } else {
        setStatusMessage('Torch/flashlight is not supported by this camera hardware.');
      }
    } catch {
      setStatusMessage('Unable to toggle camera flashlight.');
    }
  };

  const toggleSnapshot = () => {
    if (inputSource === 'virtual-bench') {
      if (!isFrozen) {
        const off = document.createElement('canvas');
        off.width = 800;
        off.height = 500;
        const oCtx = off.getContext('2d');
        if (oCtx) {
          renderVirtualCameraScene(oCtx, 800, 500, activeVirtualScene, performance.now());
          const frozenImg = new Image();
          frozenImg.src = off.toDataURL('image/jpeg', 0.95);
          frozenImg.onload = () => {
            setCurrentImageElement(frozenImg);
            extractEdgeMapFromImage(frozenImg);
          };
        }
        setIsFrozen(true);
        setStatusMessage('Virtual Bench frame frozen! Measure geometry with CAD Calipers.');
      } else {
        setIsFrozen(false);
        setStatusMessage('Virtual Bench stream resumed.');
      }
      return;
    }

    if (!isWebcamActive || !videoRef.current) return;
    if (!isFrozen) {
      const v = videoRef.current;
      const off = document.createElement('canvas');
      off.width = v.videoWidth || 800;
      off.height = v.videoHeight || 500;
      const oCtx = off.getContext('2d');
      if (oCtx) {
        oCtx.drawImage(v, 0, 0, off.width, off.height);
        const frozenImg = new Image();
        frozenImg.src = off.toDataURL('image/jpeg', 0.95);
        frozenImg.onload = () => {
          setCurrentImageElement(frozenImg);
          extractEdgeMapFromImage(frozenImg);
        };
      }
      setIsFrozen(true);
      setStatusMessage('Snapshot captured! Measure dimensions on this frozen frame.');
    } else {
      setIsFrozen(false);
      setStatusMessage('Webcam feed resumed.');
    }
  };

  const handleCaptureSnapshotWithFeedback = () => {
    audioFeedback.playShutter();
    toggleSnapshot();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    stopWebcam();
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setCurrentImageElement(img);
        setInputSource('upload');
        extractEdgeMapFromImage(img);
        setStatusMessage(`Loaded image: "${file.name}"`);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSelectVirtualScene = (scene: VirtualBenchScene) => {
    stopWebcam();
    setInputSource('virtual-bench');
    setActiveVirtualScene(scene);
    const config = VIRTUAL_BENCH_SCENES.find((s) => s.id === scene);
    if (config) {
      setMode(config.targetMode);
      setStatusMessage(`Bench Active: "${config.title}" · ${config.subtitle}`);
    }
  };

  // CV Auto-Fit
  const handleAutoDetect = () => {
    const width = 800;
    const height = 500;
    const points = edgeResult?.edgePoints || [];

    if (mode === 'circle') {
      const fit = autoDetectCircle(points, coordSys, width, height);
      setCircleParams((prev) => ({ ...prev, ...fit }));
      setStatusMessage(`Hough circle detected: C(${fit.h}, ${fit.k}), Radius ${fit.r} m`);
    } else if (mode === 'square') {
      const fit = autoDetectSquare(points, coordSys, width, height);
      setSquareParams((prev) => ({ ...prev, ...fit }));
      setStatusMessage(`Square detected: Side = ${fit.side} m, C(${fit.h}, ${fit.k})`);
    } else if (mode === 'rectangle') {
      const fit = autoDetectRectangle(points, coordSys, width, height);
      setRectangleParams((prev) => ({ ...prev, ...fit }));
      setStatusMessage(`Rectangle detected: ${fit.width} m × ${fit.height} m (Phone / Tab screen)`);
    } else if (mode === 'triangle') {
      const fit = autoDetectTriangle(points, coordSys, width, height);
      setTriangleParams((prev) => ({ ...prev, ...fit }));
      setStatusMessage('Triangular contour fitted.');
    } else if (mode === 'rhombus') {
      const fit = autoDetectRhombus(points, coordSys, width, height);
      setRhombusParams((prev) => ({ ...prev, ...fit }));
      setStatusMessage(`Rhombus detected: d₁ = ${fit.d1} m, d₂ = ${fit.d2} m (Kite / Toy)`);
    } else if (mode === 'parallelogram') {
      const fit = autoDetectParallelogram(points, coordSys, width, height);
      setParallelogramParams((prev) => ({ ...prev, ...fit }));
      setStatusMessage(`Parallelogram detected: Base = ${fit.base} m, Height = ${fit.height} m`);
    } else if (mode === 'parabola') {
      const fit = autoDetectParabola(points, coordSys, width, height);
      setParabolaParams((prev) => ({ ...prev, ...fit }));
      setStatusMessage(`Parabolic regression fit: y = ${fit.a}x² + ${fit.b}x + ${fit.c}`);
    } else if (mode === 'slope') {
      const fit = autoDetectSlope(points, coordSys, width, height);
      setSlopeParams((prev) => ({ ...prev, ...fit }));
      setStatusMessage(`Slope vector aligned: Elevation θ = ${fit.angleDeg}°`);
    }
  };

  const handleAddThreePoint = (pt: MathPoint) => {
    const next = [...threePoints, pt];
    setThreePoints(next);

    if (next.length === 3) {
      if (mode === 'circle') {
        const fit = fitCircleFrom3Points(next[0], next[1], next[2]);
        if (fit) setCircleParams((prev) => ({ ...prev, ...fit }));
      } else if (mode === 'parabola') {
        const fit = fitParabolaFrom3Points(next[0], next[1], next[2]);
        if (fit) setParabolaParams((prev) => ({ ...prev, ...fit }));
      } else if (mode === 'triangle') {
        setTriangleParams({
          x1: next[0].x,
          y1: next[0].y,
          x2: next[1].x,
          y2: next[1].y,
          x3: next[2].x,
          y3: next[2].y,
        });
      }
      setIsThreePointMode(false);
      setThreePoints([]);
      setStatusMessage(`Fitted ${mode} passing through all 3 points.`);
    } else {
      setStatusMessage(`Point ${next.length} placed: (${pt.x}, ${pt.y}). Click ${3 - next.length} more.`);
    }
  };

  const handleResetOverlay = () => {
    if (mode === 'circle') setCircleParams({ h: 0, k: 0, r: 5.2, showTangents: true, showSector: true });
    else if (mode === 'square') setSquareParams({ h: 0, k: 0, side: 4.5, rotationDeg: 0 });
    else if (mode === 'rectangle') setRectangleParams({ h: 0, k: 0, width: 4.2, height: 9.0, rotationDeg: 0 });
    else if (mode === 'triangle') setTriangleParams({ x1: -4.5, y1: -3.5, x2: 3.5, y2: -3.5, x3: -0.5, y3: 4.2 });
    else if (mode === 'rhombus') setRhombusParams({ h: 0, k: 0, d1: 5.5, d2: 7.2, rotationDeg: 0 });
    else if (mode === 'parallelogram')
      setParallelogramParams({ h: 0, k: 0, base: 5.2, height: 3.6, skew: 1.8, rotationDeg: 0 });
    else if (mode === 'parabola') setParabolaParams({ a: -0.015, b: 0, c: 4.8, h: 0, k: 4.8, showRoots: true });
    else if (mode === 'slope') setSlopeParams({ x1: -4.8, y1: -3.6, x2: -0.2, y2: 4.8, angleDeg: 61.4 });
    setThreePoints([]);
    setIsThreePointMode(false);
    setCalipers([]);
    setAngles([]);
    setPolygons([]);
  };

  const handleExportSingleFileHtml = () => {
    const htmlCode = generateStandaloneHTML();
    const blob = new Blob([htmlCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'math_lens.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setStatusMessage('Downloaded standalone single-file "math_lens.html"!');
  };

  // High-Res CAD Drawing Exporter (PNG)
  const handleExportCADDrawing = () => {
    const width = 1600;
    const height = 1000;
    const off = document.createElement('canvas');
    off.width = width;
    off.height = height;
    const ctx = off.getContext('2d');
    if (!ctx) return;

    const exportSys: CoordinateSystem = {
      ...coordSys,
      originX: width / 2,
      originY: height / 2,
      pixelsPerUnit: coordSys.pixelsPerUnit * (width / 800),
    };

    drawCADBlueprint(
      ctx,
      mode,
      exportSys,
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
        objectType: activeObjectType,
        cadTheme,
        calipers,
        angles,
        polygons,
      }
    );

    const url = off.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `math_lens_cad_${mode}_blueprint.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setStatusMessage(`Exported high-res CAD Technical Blueprint (1600x1000 PNG) for ${mode.toUpperCase()}!`);
  };

  // Port to 3D Studio
  const handlePortTo3DStudio = () => {
    let query = 'z = x^2 - y^2';
    if (calipers.length > 0) {
      const c = calipers[calipers.length - 1];
      query = `Right angled triangle with base ${Math.abs(c.dx).toFixed(1)} meters, height ${Math.abs(c.dy).toFixed(1)} meters, and hypotenuse ${c.distance.toFixed(1)} meters`;
    } else if (angles.length > 0) {
      const a = angles[angles.length - 1];
      query = `An angle of ${a.angleDeg}° with trigonometry sin and cos on unit circle`;
    } else if (polygons.length > 0) {
      const poly = polygons[polygons.length - 1];
      query = `A polygon with ${poly.points.length} vertices, perimeter ${poly.perimeter} meters and area ${poly.area} square meters`;
    } else if (mode === 'circle') {
      query = `A circle centered at (${circleParams.h}, ${circleParams.k}) with radius ${circleParams.r} meters`;
    } else if (mode === 'parabola') {
      query = `A bridge arch parabola y = ${parabolaParams.a}x^2 + ${parabolaParams.c}`;
    } else if (mode === 'rhombus') {
      query = `A rhombus with diagonals ${rhombusParams.d1} and ${rhombusParams.d2} meters`;
    } else if (mode === 'parallelogram') {
      query = `A parallelogram with base ${parallelogramParams.base} and height ${parallelogramParams.height} meters`;
    } else if (mode === 'triangle') {
      query = `A triangle with vertices (${triangleParams.x1}, ${triangleParams.y1}), (${triangleParams.x2}, ${triangleParams.y2}), (${triangleParams.x3}, ${triangleParams.y3})`;
    } else if (mode === 'square') {
      query = `A square with side length ${squareParams.side} meters`;
    } else if (mode === 'rectangle') {
      query = `A rectangle with width ${rectangleParams.width} meters and height ${rectangleParams.height} meters`;
    }
    setEquationQueryFor3D(query);
    setActiveAppTab('3d-equations');
    setStatusMessage(`Ported geometry to 3D Studio: "${query}"`);
  };

  // Object Icon Map
  const getObjectIcon = (type: string) => {
    switch (type) {
      case 'phone':
        return <Smartphone className="w-3.5 h-3.5 text-indigo-400" />;
      case 'tab':
        return <Tablet className="w-3.5 h-3.5 text-cyan-400" />;
      case 'wheel':
        return <Disc className="w-3.5 h-3.5 text-sky-400" />;
      case 'tree':
        return <Trees className="w-3.5 h-3.5 text-emerald-400" />;
      case 'toy':
        return <Puzzle className="w-3.5 h-3.5 text-pink-400" />;
      case 'bridge':
        return <Construction className="w-3.5 h-3.5 text-teal-400" />;
      case 'ramp':
        return <TrendingDown className="w-3.5 h-3.5 text-orange-400" />;
      case 'ferris-wheel':
        return <Orbit className="w-3.5 h-3.5 text-cyan-400" />;
      case 'satellite-dish':
        return <Radio className="w-3.5 h-3.5 text-blue-400" />;
      case 'solar-panel':
        return <Sun className="w-3.5 h-3.5 text-amber-400" />;
      case 'roof-truss':
        return <Triangle className="w-3.5 h-3.5 text-emerald-400" />;
      case 'wind-turbine':
        return <Wind className="w-3.5 h-3.5 text-sky-400" />;
      case 'suspension-cable':
        return <Activity className="w-3.5 h-3.5 text-orange-400" />;
      case 'diamond-kite':
        return <Compass className="w-3.5 h-3.5 text-pink-400" />;
      case 'conveyor-ramp':
        return <Boxes className="w-3.5 h-3.5 text-yellow-400" />;
      case 'sports-pitch':
        return <Trophy className="w-3.5 h-3.5 text-green-400" />;
      case 'chess-board':
        return <Grid3X3 className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Layers className="w-3.5 h-3.5 text-cyan-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex flex-col font-sans">
      <video ref={videoRef} playsInline autoPlay muted className="hidden" />

      {/* Exhibition Header */}
      <ExhibitionHeader
        inputSource={inputSource}
        isWebcamActive={isWebcamActive}
        isFrozen={isFrozen}
        activeTab={activeAppTab}
        onSelectTab={setActiveAppTab}
        onToggleWebcam={toggleWebcam}
        onSnapshot={handleCaptureSnapshotWithFeedback}
        onExportSingleFileHtml={handleExportSingleFileHtml}
      />

      <main className="flex-1 max-w-[1520px] w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
        {activeAppTab === '3d-equations' ? (
          <EquationVisualizer3D
            initialQuery={equationQueryFor3D}
            onNavigateToVision={() => setActiveAppTab('vision')}
          />
        ) : (
          <>
            {/* Quick Switch Banner to 3D Math Studio */}
            <section className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-cyan-950/80 rounded-2xl border border-indigo-800/50 p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1.5px] shrink-0">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <Rotate3d className="w-5 h-5 text-cyan-300" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>3D Equation & Question Studio</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      WebGL 3D Studio
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Type any algebraic equation (z = x² - y², x² + y² = 25) or CBSE geometry question to generate rotatable 3D surfaces and derivations.
                  </p>
                </div>
              </div>
              <button
                onClick={handlePortTo3DStudio}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 shadow-md shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95 whitespace-nowrap shrink-0 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Open 3D Studio</span>
              </button>
            </section>

            {/* Joyful Exhibition Banner */}
            <section className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 rounded-2xl border border-indigo-900/40 p-4 sm:p-5 shadow-xl relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-cyan-500/10 via-amber-500/10 to-transparent rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      High-Precision Camera & CAD Lens
                    </span>
                    <span className="text-slate-400 text-xs">·</span>
                    <span className="text-xs text-amber-300 font-medium">Real-World Mathematics in Motion</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
                    Bridge CBSE Class 9 & 10 Mathematics with Computer Vision & CAD Lens
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
                    Live Camera feed, Virtual Engineering Bench, calibrated point-to-point calipers, 3-point protractors, area surveyors, and wireframe blueprints.
                  </p>
                </div>

                {/* Quick 3-Step Guide Chips */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 text-xs font-medium">
                  <div className="bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center text-[11px]">
                      1
                    </span>
                    <span className="text-slate-300">Live Cam / Bench</span>
                  </div>
                  <div className="bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-[11px]">
                      2
                    </span>
                    <span className="text-slate-300">CAD Calipers & HUD</span>
                  </div>
                  <div className="bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center text-[11px]">
                      3
                    </span>
                    <span className="text-slate-300">NCERT & 3D Solver</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Everyday Objects Fast Selector Bar */}
            <section
              id="everyday-objects"
              className="bg-slate-900/80 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-800 shadow-md"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-display">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    Target Objects & Inputs ({PRESET_IMAGES.length}):
                  </span>

                  <label
                    onClick={() => {
                      if (isWebcamActive) stopWebcam();
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      inputSource === 'upload'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <span>Upload Custom Image</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>

                {/* Presets Grid */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  {PRESET_IMAGES.map((preset) => {
                    const isSelected = inputSource === 'preset' && selectedPresetId === preset.id;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => {
                          stopWebcam();
                          setInputSource('preset');
                          setSelectedPresetId(preset.id);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all border ${
                          isSelected
                            ? 'bg-gradient-to-r from-cyan-950 to-indigo-950 text-cyan-300 border-cyan-500 font-bold shadow-md shadow-cyan-950/50'
                            : 'bg-slate-950 text-slate-300 border-slate-800/90 hover:text-white hover:bg-slate-800/90 hover:border-slate-700'
                        }`}
                      >
                        {getObjectIcon(preset.objectType)}
                        <span>{preset.name}</span>
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handleTriggerVoiceTutor()}
                    title="Hear AI Voice Tutor 10-second audio explanation"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 shadow-md shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95 ml-auto"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Hear AI Tutor</span>
                  </button>
                </div>
              </div>
            </section>

            {/* NEW: Camera & CAD Lens Control Bar */}
            <CameraCadToolbar
              inputSource={inputSource}
              isWebcamActive={isWebcamActive}
              isFrozen={isFrozen}
              compareMode={compareMode}
              cadTheme={cadTheme}
              cadTool={cadTool}
              reticleStyle={reticleStyle}
              cameraSettings={cameraSettings}
              coordSys={coordSys}
              activeVirtualScene={activeVirtualScene}
              hasCalipers={calipers.length > 0 || angles.length > 0 || polygons.length > 0}
              onSetInputSource={setInputSource}
              onToggleWebcam={toggleWebcam}
              onToggleTorch={handleToggleTorch}
              onFlipCamera={handleFlipCamera}
              onSetZoom={(zoom) => setCameraSettings((prev) => ({ ...prev, zoom }))}
              onSetReticle={setReticleStyle}
              onSetCompareMode={setCompareMode}
              onSetCADTheme={setCadTheme}
              onSetCADTool={(tool) => {
                setCadTool(tool);
                audioFeedback.playToolSwitch();
              }}
              onSelectVirtualScene={handleSelectVirtualScene}
              onCaptureSnapshot={handleCaptureSnapshotWithFeedback}
              onClearCADMeasurements={() => {
                setCalipers([]);
                setAngles([]);
                setPolygons([]);
                setStatusMessage('Cleared all CAD calipers and annotations.');
              }}
              onExportCADDrawing={handleExportCADDrawing}
              onPortTo3DStudio={handlePortTo3DStudio}
            />

            {/* Live Notification / Status Message */}
            {webcamError ? (
              <div className="bg-rose-950/50 border border-rose-500/40 text-rose-200 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{webcamError}</span>
                </div>
                <button
                  onClick={() => handleSelectVirtualScene('wheel')}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500 text-slate-950 font-bold text-[11px] hover:bg-cyan-400"
                >
                  Use Virtual Bench
                </button>
              </div>
            ) : statusMessage ? (
              <div className="bg-slate-900/90 border border-cyan-900/50 text-cyan-200 px-4 py-2 rounded-xl text-xs flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{statusMessage}</span>
                </div>
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  Active Shape: <strong className="text-cyan-300 uppercase">{mode}</strong>
                </span>
              </div>
            ) : null}

            {/* AI Voice Tutor Audio Explanations Panel */}
            <section id="ai-voice-tutor" className="w-full">
              <VoiceTutorPanel
                mode={mode}
                objectType={activeObjectType}
                metrics={activeMetrics}
                autoPlayOnSelect={autoPlayVoice}
                onToggleAutoPlay={setAutoPlayVoice}
                accentColor={
                  mode === 'circle'
                    ? '#06b6d4'
                    : mode === 'square'
                    ? '#f59e0b'
                    : mode === 'rectangle'
                    ? '#6366f1'
                    : mode === 'triangle'
                    ? '#10b981'
                    : mode === 'rhombus'
                    ? '#ec4899'
                    : mode === 'parallelogram'
                    ? '#8b5cf6'
                    : mode === 'parabola'
                    ? '#14b8a6'
                    : '#f97316'
                }
              />
            </section>

            {/* 2-Zone Workspace Split */}
            <div id="vision-stage" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Zone: Interactive Stage (7 cols) */}
              <section className="lg:col-span-7 flex flex-col gap-4">
                <MathCanvas
                  mode={mode}
                  inputSource={inputSource}
                  imageElement={currentImageElement}
                  videoRef={videoRef}
                  isWebcamActive={isWebcamActive}
                  isFrozen={isFrozen}
                  coordSys={coordSys}
                  circleParams={circleParams}
                  squareParams={squareParams}
                  rectangleParams={rectangleParams}
                  triangleParams={triangleParams}
                  rhombusParams={rhombusParams}
                  parallelogramParams={parallelogramParams}
                  parabolaParams={parabolaParams}
                  slopeParams={slopeParams}
                  edgeResult={edgeResult}
                  showEdgeFilter={showEdgeFilter}
                  isThreePointMode={isThreePointMode}
                  threePoints={threePoints}
                  compareMode={compareMode}
                  splitPosition={splitPosition}
                  cadTheme={cadTheme}
                  cadTool={cadTool}
                  reticleStyle={reticleStyle}
                  cameraZoom={cameraSettings.zoom}
                  activeVirtualScene={activeVirtualScene}
                  calipers={calipers}
                  angles={angles}
                  polygons={polygons}
                  onUpdateCircle={setCircleParams}
                  onUpdateSquare={setSquareParams}
                  onUpdateRectangle={setRectangleParams}
                  onUpdateTriangle={setTriangleParams}
                  onUpdateRhombus={setRhombusParams}
                  onUpdateParallelogram={setParallelogramParams}
                  onUpdateParabola={setParabolaParams}
                  onUpdateSlope={setSlopeParams}
                  onUpdateCoordSys={(partial) => setCoordSys((prev) => ({ ...prev, ...partial }))}
                  onAddThreePoint={handleAddThreePoint}
                  onAddCaliper={(c) => setCalipers((prev) => [...prev, c])}
                  onAddAngle={(a) => setAngles((prev) => [...prev, a])}
                  onAddPolygon={(p) => setPolygons((prev) => [...prev, p])}
                  onTriggerVoiceTutor={() => handleTriggerVoiceTutor()}
                  onUpdateSplitPosition={setSplitPosition}
                  onSetCompareMode={setCompareMode}
                  objectType={activeObjectType}
                />

                {/* Quick Interactive Tip */}
                <div className="bg-slate-900/80 rounded-xl border border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>
                      <strong>Interactive Controls:</strong> Select Caliper or Protractor above to click & measure real-world distances or angles on any frozen frame!
                    </span>
                  </div>
                </div>
              </section>

              {/* Right Zone: Joyful HUD Controls & CBSE Solver (5 cols) */}
              <section id="shapes-explorer" className="lg:col-span-5 flex flex-col gap-5">
                <div id="hud-controls">
                  <HUDControls
                    mode={mode}
                    onSetMode={setMode}
                    coordSys={coordSys}
                    circleParams={circleParams}
                    squareParams={squareParams}
                    rectangleParams={rectangleParams}
                    triangleParams={triangleParams}
                    rhombusParams={rhombusParams}
                    parallelogramParams={parallelogramParams}
                    parabolaParams={parabolaParams}
                    slopeParams={slopeParams}
                    showEdgeFilter={showEdgeFilter}
                    isThreePointMode={isThreePointMode}
                    onUpdateCircle={setCircleParams}
                    onUpdateSquare={setSquareParams}
                    onUpdateRectangle={setRectangleParams}
                    onUpdateTriangle={setTriangleParams}
                    onUpdateRhombus={setRhombusParams}
                    onUpdateParallelogram={setParallelogramParams}
                    onUpdateParabola={setParabolaParams}
                    onUpdateSlope={setSlopeParams}
                    onUpdateCoordSys={(partial) => setCoordSys((prev) => ({ ...prev, ...partial }))}
                    onAutoDetect={handleAutoDetect}
                    onToggleEdgeFilter={() => setShowEdgeFilter((prev) => !prev)}
                    onToggleThreePointMode={() => {
                      setIsThreePointMode((prev) => !prev);
                      setThreePoints([]);
                      setStatusMessage(
                        !isThreePointMode
                          ? `Click 3 points on canvas to mathematically snap ${mode}.`
                          : '3-Point snap disabled.'
                      );
                    }}
                    onResetOverlay={handleResetOverlay}
                  />
                </div>

                <div id="cbse-curriculum">
                  <CBSEPanel
                    mode={mode}
                    circleParams={circleParams}
                    squareParams={squareParams}
                    rectangleParams={rectangleParams}
                    triangleParams={triangleParams}
                    rhombusParams={rhombusParams}
                    parallelogramParams={parallelogramParams}
                    parabolaParams={parabolaParams}
                    slopeParams={slopeParams}
                  />
                </div>
              </section>
            </div>

            {/* Curated Real-World Objects Gallery */}
            <section className="mt-4 flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-semibold tracking-wide text-white font-display flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-400 to-emerald-400"></span>
                  Everyday Objects & CBSE Mathematical Case Studies ({PRESET_IMAGES.length} Presets)
                </h3>
                <span className="text-xs text-slate-400">Click any card to load geometry & audio lesson</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {PRESET_IMAGES.map((preset) => {
                  const isSelected = inputSource === 'preset' && selectedPresetId === preset.id;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => {
                        stopWebcam();
                        setInputSource('preset');
                        setSelectedPresetId(preset.id);
                      }}
                      className={`group cursor-pointer bg-slate-900/90 rounded-2xl border p-2.5 flex flex-col gap-2 transition-all hover:bg-slate-850 hover:scale-[1.02] ${
                        isSelected
                          ? 'border-cyan-400 shadow-lg shadow-cyan-950/60 ring-1 ring-cyan-400/50'
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-slate-950">
                        <img
                          src={preset.url}
                          alt={preset.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-1.5 left-1.5 bg-slate-950/85 backdrop-blur-sm px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold text-cyan-300 border border-cyan-800/80 uppercase">
                          {preset.category.split(' ')[0]}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-semibold text-white truncate flex items-center gap-1">
                            {getObjectIcon(preset.objectType)}
                            <span className="truncate">{preset.name.split(' (')[0]}</span>
                          </h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              stopWebcam();
                              setInputSource('preset');
                              setSelectedPresetId(preset.id);
                              handleTriggerVoiceTutor(preset.objectType);
                            }}
                            title={`Listen to AI Voice Tutor explain ${preset.name}`}
                            className="p-1 rounded-md bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 transition-colors shrink-0"
                          >
                            <Volume2 className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-1">{preset.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </main>

      {/* Proper Polished Footer */}
      <ExhibitionFooter
        onSelectShape={(m) => {
          setActiveAppTab('vision');
          setMode(m);
        }}
        onOpen3DStudio={() => setActiveAppTab('3d-equations')}
        onExportSingleFileHtml={handleExportSingleFileHtml}
      />
    </div>
  );
}
