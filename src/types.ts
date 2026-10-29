export type Mode =
  | 'circle'
  | 'square'
  | 'rectangle'
  | 'triangle'
  | 'rhombus'
  | 'parallelogram'
  | 'parabola'
  | 'slope';

export type InputSource = 'webcam' | 'virtual-bench' | 'upload' | 'preset';

export type CompareMode = 'overlay' | 'split-curtain' | 'cad-blueprint' | 'side-by-side';

export type CADTheme =
  | 'cyan-blueprint'
  | 'amber-terminal'
  | 'emerald-matrix'
  | 'monochrome-plotter';

export type ReticleStyle =
  | 'tactical'
  | 'aviation'
  | 'golden-ratio'
  | 'rule-of-thirds'
  | 'none';

export type CADTool =
  | 'none'
  | 'caliper'
  | 'protractor'
  | 'polygon'
  | 'arc'
  | 'calibrate';

export interface Point {
  x: number; // canvas pixel coordinates
  y: number;
}

export interface MathPoint {
  x: number; // mathematical Cartesian coordinates relative to origin
  y: number;
}

export interface CaliperMeasurement {
  id: string;
  p1: MathPoint;
  p2: MathPoint;
  distance: number;
  dx: number;
  dy: number;
  slopeAngleDeg: number;
}

export interface AngleMeasurement {
  id: string;
  p1: MathPoint;
  vertex: MathPoint;
  p2: MathPoint;
  angleDeg: number;
  angleRad: number;
}

export interface PolygonMeasurement {
  id: string;
  points: MathPoint[];
  perimeter: number;
  area: number;
  centroid: MathPoint;
}

export interface CameraSettings {
  facingMode: 'user' | 'environment';
  torch: boolean;
  zoom: number; // 1.0 to 3.0
  reticle: ReticleStyle;
  filter: 'none' | 'edge-matrix' | 'cyber-hud' | 'monochrome';
  shutterTimer: 0 | 3;
}

export interface CircleParams {
  h: number; // center math x
  k: number; // center math y
  r: number; // radius in math units
  showTangents?: boolean;
  showSector?: boolean;
  sectorAngle?: number; // degrees
}

export interface SquareParams {
  h: number; // center math x
  k: number; // center math y
  side: number; // side length s
  rotationDeg: number; // rotation in degrees
}

export interface RectangleParams {
  h: number; // center math x
  k: number; // center math y
  width: number;
  height: number;
  rotationDeg: number;
}

export interface TriangleParams {
  x1: number; // vertex A
  y1: number;
  x2: number; // vertex B
  y2: number;
  x3: number; // vertex C
  y3: number;
}

export interface RhombusParams {
  h: number; // center math x
  k: number; // center math y
  d1: number; // horizontal diagonal
  d2: number; // vertical diagonal
  rotationDeg: number;
}

export interface ParallelogramParams {
  h: number; // center math x
  k: number; // center math y
  base: number; // base length
  height: number; // perpendicular height
  skew: number; // horizontal skew offset
  rotationDeg: number;
}

export interface ParabolaParams {
  a: number; // y = a(x-h)^2 + k or y = ax^2 + bx + c
  b: number;
  c: number;
  useVertexForm?: boolean;
  h: number; // vertex math x
  k: number; // vertex math y
  showRoots?: boolean;
  showDirectrix?: boolean;
}

export interface SlopeParams {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  angleDeg: number;
  targetObject?: string; // e.g. "Tree Height", "Ramp Incline"
}

export interface CoordinateSystem {
  originX: number; // canvas pixel where (0,0) is located
  originY: number;
  pixelsPerUnit: number; // scale factor
  showGrid: boolean;
  showAxes: boolean;
  unitLabel: string; // e.g. "m" or "cm"
}

export type ObjectType =
  | 'phone'
  | 'tab'
  | 'wheel'
  | 'tree'
  | 'toy'
  | 'bridge'
  | 'ramp'
  | 'ferris-wheel'
  | 'satellite-dish'
  | 'solar-panel'
  | 'roof-truss'
  | 'wind-turbine'
  | 'suspension-cable'
  | 'diamond-kite'
  | 'conveyor-ramp'
  | 'sports-pitch'
  | 'chess-board';

export interface PresetImage {
  id: string;
  name: string;
  category: string;
  objectType: ObjectType;
  url: string;
  defaultMode: Mode;
  description: string;
  defaultParams: {
    circle?: Partial<CircleParams>;
    square?: Partial<SquareParams>;
    rectangle?: Partial<RectangleParams>;
    triangle?: Partial<TriangleParams>;
    rhombus?: Partial<RhombusParams>;
    parallelogram?: Partial<ParallelogramParams>;
    parabola?: Partial<ParabolaParams>;
    slope?: Partial<SlopeParams>;
    originOffset?: { x: number; y: number };
    scale?: number;
  };
}

export interface CBSEChapter {
  id: string;
  title: string;
  classGrade: 'Class 9' | 'Class 10';
  chapterNum: number;
  subject: string;
  coreConcepts: string[];
  keyTheorems: string[];
  boardExamWeightage: string;
  realWorldApplication: string;
}
