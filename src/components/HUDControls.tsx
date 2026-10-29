import React from 'react';
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
} from '../types';
import {
  calculateCircleMetrics,
  calculateSquareMetrics,
  calculateRectangleMetrics,
  calculateTriangleMetrics,
  calculateRhombusMetrics,
  calculateParallelogramMetrics,
  calculateParabolaMetrics,
  calculateSlopeMetrics,
} from '../utils/geometry';
import {
  Circle,
  Square,
  RectangleHorizontal,
  Triangle,
  Diamond,
  Spline,
  TrendingUp,
  Sparkles,
  Eye,
  Grid,
  Pin,
  RefreshCw,
  Calculator,
} from 'lucide-react';

interface HUDControlsProps {
  mode: Mode;
  onSetMode: (m: Mode) => void;
  coordSys: CoordinateSystem;
  circleParams: CircleParams;
  squareParams: SquareParams;
  rectangleParams: RectangleParams;
  triangleParams: TriangleParams;
  rhombusParams: RhombusParams;
  parallelogramParams: ParallelogramParams;
  parabolaParams: ParabolaParams;
  slopeParams: SlopeParams;
  showEdgeFilter: boolean;
  isThreePointMode: boolean;
  onUpdateCircle: (params: CircleParams) => void;
  onUpdateSquare: (params: SquareParams) => void;
  onUpdateRectangle: (params: RectangleParams) => void;
  onUpdateTriangle: (params: TriangleParams) => void;
  onUpdateRhombus: (params: RhombusParams) => void;
  onUpdateParallelogram: (params: ParallelogramParams) => void;
  onUpdateParabola: (params: ParabolaParams) => void;
  onUpdateSlope: (params: SlopeParams) => void;
  onUpdateCoordSys: (sys: Partial<CoordinateSystem>) => void;
  onAutoDetect: () => void;
  onToggleEdgeFilter: () => void;
  onToggleThreePointMode: () => void;
  onResetOverlay: () => void;
}

export const HUDControls: React.FC<HUDControlsProps> = ({
  mode,
  onSetMode,
  coordSys,
  circleParams,
  squareParams,
  rectangleParams,
  triangleParams,
  rhombusParams,
  parallelogramParams,
  parabolaParams,
  slopeParams,
  showEdgeFilter,
  isThreePointMode,
  onUpdateCircle,
  onUpdateSquare,
  onUpdateRectangle,
  onUpdateTriangle,
  onUpdateRhombus,
  onUpdateParallelogram,
  onUpdateParabola,
  onUpdateSlope,
  onUpdateCoordSys,
  onAutoDetect,
  onToggleEdgeFilter,
  onToggleThreePointMode,
  onResetOverlay,
}) => {
  const circleMetrics = calculateCircleMetrics(circleParams);
  const squareMetrics = calculateSquareMetrics(squareParams);
  const rectangleMetrics = calculateRectangleMetrics(rectangleParams);
  const triangleMetrics = calculateTriangleMetrics(triangleParams);
  const rhombusMetrics = calculateRhombusMetrics(rhombusParams);
  const parallelogramMetrics = calculateParallelogramMetrics(parallelogramParams);
  const parabolaMetrics = calculateParabolaMetrics(parabolaParams);
  const slopeMetrics = calculateSlopeMetrics(slopeParams);

  // Joyful color identities per shape
  const shapeConfigs: Record<
    Mode,
    {
      name: string;
      color: string;
      activeClass: string;
      accentSlider: string;
      formulaBorder: string;
      icon: React.ReactNode;
      gradeTag: string;
    }
  > = {
    circle: {
      name: 'Circle',
      color: 'text-cyan-400',
      activeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-sm shadow-cyan-500/20',
      accentSlider: 'accent-cyan-400',
      formulaBorder: 'border-cyan-500/50 bg-cyan-950/40 text-cyan-200',
      icon: <Circle className="w-3.5 h-3.5" />,
      gradeTag: 'Class 10 Ch 10 & 12',
    },
    square: {
      name: 'Square',
      color: 'text-amber-400',
      activeClass: 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-sm shadow-amber-500/20',
      accentSlider: 'accent-amber-400',
      formulaBorder: 'border-amber-500/50 bg-amber-950/40 text-amber-200',
      icon: <Square className="w-3.5 h-3.5" />,
      gradeTag: 'Class 9 Ch 8',
    },
    rectangle: {
      name: 'Rectangle',
      color: 'text-indigo-400',
      activeClass: 'bg-indigo-500/25 text-indigo-300 border-indigo-400 shadow-sm shadow-indigo-500/20',
      accentSlider: 'accent-indigo-400',
      formulaBorder: 'border-indigo-500/50 bg-indigo-950/40 text-indigo-200',
      icon: <RectangleHorizontal className="w-3.5 h-3.5" />,
      gradeTag: 'Class 9 Ch 8',
    },
    triangle: {
      name: 'Triangle',
      color: 'text-emerald-400',
      activeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-400 shadow-sm shadow-emerald-500/20',
      accentSlider: 'accent-emerald-400',
      formulaBorder: 'border-emerald-500/50 bg-emerald-950/40 text-emerald-200',
      icon: <Triangle className="w-3.5 h-3.5" />,
      gradeTag: 'Class 9 Ch 12 (Heron)',
    },
    rhombus: {
      name: 'Rhombus',
      color: 'text-pink-400',
      activeClass: 'bg-pink-500/20 text-pink-300 border-pink-400 shadow-sm shadow-pink-500/20',
      accentSlider: 'accent-pink-400',
      formulaBorder: 'border-pink-500/50 bg-pink-950/40 text-pink-200',
      icon: <Diamond className="w-3.5 h-3.5" />,
      gradeTag: 'Class 9 Ch 8 (Kite)',
    },
    parallelogram: {
      name: 'Parallelogram',
      color: 'text-purple-400',
      activeClass: 'bg-purple-500/20 text-purple-300 border-purple-400 shadow-sm shadow-purple-500/20',
      accentSlider: 'accent-purple-400',
      formulaBorder: 'border-purple-500/50 bg-purple-950/40 text-purple-200',
      icon: <Spline className="w-3.5 h-3.5" />,
      gradeTag: 'Class 9 Ch 8',
    },
    parabola: {
      name: 'Parabola',
      color: 'text-teal-400',
      activeClass: 'bg-teal-500/20 text-teal-300 border-teal-400 shadow-sm shadow-teal-500/20',
      accentSlider: 'accent-teal-400',
      formulaBorder: 'border-teal-500/50 bg-teal-950/40 text-teal-200',
      icon: <span className="font-serif italic font-bold">U</span>,
      gradeTag: 'Class 10 Ch 2 & 4',
    },
    slope: {
      name: 'Slope / Trig',
      color: 'text-orange-400',
      activeClass: 'bg-orange-500/20 text-orange-300 border-orange-400 shadow-sm shadow-orange-500/20',
      accentSlider: 'accent-orange-400',
      formulaBorder: 'border-orange-500/50 bg-orange-950/40 text-orange-200',
      icon: <TrendingUp className="w-3.5 h-3.5" />,
      gradeTag: 'Class 10 Ch 8 & 9',
    },
  };

  const currentCfg = shapeConfigs[mode];

  return (
    <div className="flex flex-col gap-4 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-xl text-slate-200">
      {/* 1. Shape Switcher Tabs */}
      <div className="flex flex-col gap-2.5 border-b border-slate-800/80 pb-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-amber-400 animate-pulse"></span>
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider font-display">
              8 Geometric Shapes
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onAutoDetect}
              title="Auto-detect active shape with Computer Vision"
              className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 rounded-lg shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Auto-Fit CV</span>
            </button>
            <button
              onClick={onToggleEdgeFilter}
              title="Toggle Sobel edge detection overlay"
              className={`p-1.5 rounded-lg border transition-colors ${
                showEdgeFilter
                  ? 'bg-cyan-500/30 text-cyan-200 border-cyan-400'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onToggleThreePointMode}
              title="Click 3 points on canvas to snap shape"
              className={`p-1.5 rounded-lg border transition-colors ${
                isThreePointMode
                  ? 'bg-amber-500/30 text-amber-200 border-amber-400 animate-pulse'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              <Pin className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onResetOverlay}
              title="Reset parameters"
              className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-700 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 8 Joyful Shape Buttons */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
          {(Object.keys(shapeConfigs) as Mode[]).map((key) => {
            const item = shapeConfigs[key];
            const isSelected = mode === key;
            return (
              <button
                key={key}
                onClick={() => onSetMode(key)}
                className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-lg text-[11px] font-semibold transition-all border ${
                  isSelected
                    ? item.activeClass
                    : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/80'
                }`}
              >
                {item.icon}
                <span className="truncate">{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Joyful Equation Banner & Derived Metrics */}
      <div className="bg-slate-950/90 rounded-xl border border-slate-800/90 p-4 flex flex-col gap-3 font-mono">
        <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-2">
          <span className="flex items-center gap-1.5 text-slate-200 font-semibold font-display">
            <Calculator className="w-3.5 h-3.5 text-cyan-400" />
            {currentCfg.name} Mathematical Model
          </span>
          <span className="text-[11px] font-medium text-amber-400/90">{currentCfg.gradeTag}</span>
        </div>

        {/* Live Equation Display with Joyful Glow */}
        <div
          className={`p-2.5 rounded-lg border text-center text-xs font-semibold tracking-wide shadow-sm transition-all ${currentCfg.formulaBorder}`}
        >
          {mode === 'circle' && circleMetrics.standardEq}
          {mode === 'square' && squareMetrics.standardEq}
          {mode === 'rectangle' && rectangleMetrics.standardEq}
          {mode === 'triangle' && triangleMetrics.standardEq}
          {mode === 'rhombus' && rhombusMetrics.standardEq}
          {mode === 'parallelogram' && parallelogramMetrics.standardEq}
          {mode === 'parabola' && parabolaMetrics.standardEq}
          {mode === 'slope' && slopeMetrics.lineEq}
        </div>

        {/* 4 Crisp Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {mode === 'circle' && (
            <>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block font-sans">Radius (r)</span>
                <strong className="text-cyan-300 text-sm font-mono">{circleMetrics.radius.toFixed(2)} m</strong>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block font-sans">Diameter</span>
                <strong className="text-slate-200 text-sm font-mono">{circleMetrics.diameter.toFixed(2)} m</strong>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block font-sans">Circumference</span>
                <strong className="text-sky-300 text-sm font-mono">{circleMetrics.circumference.toFixed(2)} m</strong>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block font-sans">Area (πr²)</span>
                <strong className="text-emerald-400 text-sm font-mono">{circleMetrics.area.toFixed(2)} m²</strong>
              </div>
            </>
          )}

          {mode === 'square' && (
            <>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block font-sans">Side (s)</span>
                <strong className="text-amber-300 text-sm font-mono">{squareMetrics.side.toFixed(2)} m</strong>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block font-sans">Perimeter (4s)</span>
                <strong className="text-slate-200 text-sm font-mono">{squareMetrics.perimeter.toFixed(2)} m</strong>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block font-sans">Area (s²)</span>
                <strong className="text-emerald-400 text-sm font-mono">{squareMetrics.area.toFixed(2)} m²</strong>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block font-sans">Diagonal (s√2)</span>
                <strong className="text-yellow-300 text-sm font-mono">{squareMetrics.diagonal.toFixed(2)} m</strong>
              </div>
            </>
          )}

          {mode === 'rectangle' && (
            <>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block font-sans">Dimensions (w × h)</span>
                <strong className="text-indigo-300 text-xs font-mono">
                  {rectangleMetrics.width.toFixed(2)} × {rectangleMetrics.height.toFixed(2)} m
                </strong>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block font-sans">Display Area</span>
                <strong className="text-emerald-400 text-sm font-mono">{rectangleMetrics.area.toFixed(2)} m²</strong>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block font-sans">Diagonal Screen</span>
                <strong className="text-amber-300 text-sm font-mono">{rectangleMetrics.diagonal.toFixed(2)} m</strong>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block font-sans">Aspect Ratio</span>
                <strong className="text-cyan-300 text-sm font-mono">{rectangleMetrics.aspectRatio} : 1</strong>
              </div>
            </>
          )}

          {mode === 'triangle' && (
            <>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block font-sans">Sides (a, b, c)</span>
                <strong className="text-emerald-300 text-[11px] block truncate font-mono">
                  {triangleMetrics.sideA.toFixed(1)}, {triangleMetrics.sideB.toFixed(1)}, {triangleMetrics.sideC.toFixed(1)}
                </strong>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block font-sans">Heron's Area</span>
                <strong className="text-teal-300 text-sm font-mono">{triangleMetrics.area.toFixed(2)} m²</strong>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block font-sans">Perimeter (2s)</span>
                <strong className="text-slate-200 text-sm font-mono">{triangleMetrics.perimeter.toFixed(2)} m</strong>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block font-sans">Triangle Type</span>
                <strong className="text-amber-300 text-[10px] block truncate font-sans">{triangleMetrics.type}</strong>
              </div>
            </>
          )}

          {mode === 'rhombus' && (
            <>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block font-sans">Diagonals (d₁, d₂)</span>
                <strong className="text-pink-300 text-xs font-mono">
                  {rhombusMetrics.d1.toFixed(2)}, {rhombusMetrics.d2.toFixed(2)} m
                </strong>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block font-sans">Kite Area</span>
                <strong className="text-emerald-400 text-sm font-mono">{rhombusMetrics.area.toFixed(2)} m²</strong>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block font-sans">Side Length (a)</span>
                <strong className="text-slate-200 text-sm font-mono">{rhombusMetrics.side.toFixed(2)} m</strong>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block font-sans">Perimeter (4a)</span>
                <strong className="text-amber-300 text-sm font-mono">{rhombusMetrics.perimeter.toFixed(2)} m</strong>
              </div>
            </>
          )}

          {mode === 'parallelogram' && (
            <>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block font-sans">Base & Height</span>
                <strong className="text-purple-300 text-xs font-mono">
                  {parallelogramMetrics.base.toFixed(2)} × {parallelogramMetrics.height.toFixed(2)} m
                </strong>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block font-sans">Surface Area</span>
                <strong className="text-emerald-400 text-sm font-mono">{parallelogramMetrics.area.toFixed(2)} m²</strong>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block font-sans">Slant Side</span>
                <strong className="text-slate-200 text-sm font-mono">{parallelogramMetrics.slantSide.toFixed(2)} m</strong>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block font-sans">Perimeter</span>
                <strong className="text-amber-300 text-sm font-mono">{parallelogramMetrics.perimeter.toFixed(2)} m</strong>
              </div>
            </>
          )}

          {mode === 'parabola' && (
            <>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block font-sans">Vertex V(h, k)</span>
                <strong className="text-teal-300 text-xs font-mono">
                  ({parabolaMetrics.vertex.x.toFixed(2)}, {parabolaMetrics.vertex.y.toFixed(2)})
                </strong>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block font-sans">Discriminant (D)</span>
                <strong className="text-cyan-300 text-sm font-mono">{parabolaMetrics.discriminant.toFixed(2)}</strong>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block font-sans">Axis of Symmetry</span>
                <strong className="text-slate-200 text-sm font-mono">x = {parabolaMetrics.axisOfSymmetry.toFixed(2)}</strong>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block font-sans">Roots (Zeroes)</span>
                <strong className="text-amber-300 text-[11px] block truncate font-mono">
                  {parabolaMetrics.roots.length > 0
                    ? parabolaMetrics.roots.map((r) => r.toFixed(2)).join(', ')
                    : 'No real roots'}
                </strong>
              </div>
            </>
          )}

          {mode === 'slope' && (
            <>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block font-sans">Elevation Angle θ</span>
                <strong className="text-orange-300 text-sm font-mono">{slopeMetrics.elevationDeg.toFixed(1)}°</strong>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block font-sans">Slope m = tan(θ)</span>
                <strong className="text-amber-300 text-sm font-mono">
                  {isFinite(slopeMetrics.slope) ? slopeMetrics.slope.toFixed(3) : '∞'}
                </strong>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block font-sans">Height (Tree / Rise)</span>
                <strong className="text-emerald-300 text-sm font-mono">{Math.abs(slopeMetrics.dy).toFixed(2)} m</strong>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block font-sans">Base Distance</span>
                <strong className="text-slate-200 text-sm font-mono">{Math.abs(slopeMetrics.dx).toFixed(2)} m</strong>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 3. Sliders Tuning */}
      <div className="flex flex-col gap-2.5">
        <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
          <span className="font-display">Fine-Tune Dimensions & Angles</span>
          <span className="text-[11px] text-slate-400 font-normal">Drag handles on canvas or adjust sliders</span>
        </div>

        {mode === 'circle' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Radius (r):</span>
                <span className="font-mono text-cyan-400">{circleParams.r.toFixed(2)} m</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="12"
                step="0.05"
                value={circleParams.r}
                onChange={(e) => onUpdateCircle({ ...circleParams, r: parseFloat(e.target.value) })}
                className={`w-full ${currentCfg.accentSlider} bg-slate-800 h-1.5 rounded cursor-pointer`}
              />
            </div>
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Center X (h):</span>
                <span className="font-mono text-cyan-400">{circleParams.h.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-8"
                max="8"
                step="0.05"
                value={circleParams.h}
                onChange={(e) => onUpdateCircle({ ...circleParams, h: parseFloat(e.target.value) })}
                className={`w-full ${currentCfg.accentSlider} bg-slate-800 h-1.5 rounded cursor-pointer`}
              />
            </div>
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Center Y (k):</span>
                <span className="font-mono text-cyan-400">{circleParams.k.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-8"
                max="8"
                step="0.05"
                value={circleParams.k}
                onChange={(e) => onUpdateCircle({ ...circleParams, k: parseFloat(e.target.value) })}
                className={`w-full ${currentCfg.accentSlider} bg-slate-800 h-1.5 rounded cursor-pointer`}
              />
            </div>
          </div>
        )}

        {mode === 'square' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Side Length (s):</span>
                <span className="font-mono text-amber-400">{squareParams.side.toFixed(2)} m</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="12"
                step="0.05"
                value={squareParams.side}
                onChange={(e) => onUpdateSquare({ ...squareParams, side: parseFloat(e.target.value) })}
                className={`w-full ${currentCfg.accentSlider} bg-slate-800 h-1.5 rounded cursor-pointer`}
              />
            </div>
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Center X (h):</span>
                <span className="font-mono text-amber-400">{squareParams.h.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-8"
                max="8"
                step="0.05"
                value={squareParams.h}
                onChange={(e) => onUpdateSquare({ ...squareParams, h: parseFloat(e.target.value) })}
                className={`w-full ${currentCfg.accentSlider} bg-slate-800 h-1.5 rounded cursor-pointer`}
              />
            </div>
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Center Y (k):</span>
                <span className="font-mono text-amber-400">{squareParams.k.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-8"
                max="8"
                step="0.05"
                value={squareParams.k}
                onChange={(e) => onUpdateSquare({ ...squareParams, k: parseFloat(e.target.value) })}
                className={`w-full ${currentCfg.accentSlider} bg-slate-800 h-1.5 rounded cursor-pointer`}
              />
            </div>
          </div>
        )}

        {mode === 'rectangle' && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Width:</span>
                <span className="font-mono text-indigo-400">{rectangleParams.width.toFixed(2)} m</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="14"
                step="0.1"
                value={rectangleParams.width}
                onChange={(e) => onUpdateRectangle({ ...rectangleParams, width: parseFloat(e.target.value) })}
                className={`w-full ${currentCfg.accentSlider} bg-slate-800 h-1.5 rounded cursor-pointer`}
              />
            </div>
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Height:</span>
                <span className="font-mono text-indigo-400">{rectangleParams.height.toFixed(2)} m</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="14"
                step="0.1"
                value={rectangleParams.height}
                onChange={(e) => onUpdateRectangle({ ...rectangleParams, height: parseFloat(e.target.value) })}
                className={`w-full ${currentCfg.accentSlider} bg-slate-800 h-1.5 rounded cursor-pointer`}
              />
            </div>
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Center X:</span>
                <span className="font-mono text-indigo-400">{rectangleParams.h.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-8"
                max="8"
                step="0.05"
                value={rectangleParams.h}
                onChange={(e) => onUpdateRectangle({ ...rectangleParams, h: parseFloat(e.target.value) })}
                className={`w-full ${currentCfg.accentSlider} bg-slate-800 h-1.5 rounded cursor-pointer`}
              />
            </div>
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Center Y:</span>
                <span className="font-mono text-indigo-400">{rectangleParams.k.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-8"
                max="8"
                step="0.05"
                value={rectangleParams.k}
                onChange={(e) => onUpdateRectangle({ ...rectangleParams, k: parseFloat(e.target.value) })}
                className={`w-full ${currentCfg.accentSlider} bg-slate-800 h-1.5 rounded cursor-pointer`}
              />
            </div>
          </div>
        )}

        {mode === 'triangle' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Apex Height (C.y):</span>
                <span className="font-mono text-emerald-400">{triangleParams.y3.toFixed(2)} m</span>
              </div>
              <input
                type="range"
                min="-6"
                max="8"
                step="0.1"
                value={triangleParams.y3}
                onChange={(e) => onUpdateTriangle({ ...triangleParams, y3: parseFloat(e.target.value) })}
                className={`w-full ${currentCfg.accentSlider} bg-slate-800 h-1.5 rounded cursor-pointer`}
              />
            </div>
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Base Left (A.x):</span>
                <span className="font-mono text-emerald-400">{triangleParams.x1.toFixed(2)} m</span>
              </div>
              <input
                type="range"
                min="-8"
                max="0"
                step="0.1"
                value={triangleParams.x1}
                onChange={(e) => onUpdateTriangle({ ...triangleParams, x1: parseFloat(e.target.value) })}
                className={`w-full ${currentCfg.accentSlider} bg-slate-800 h-1.5 rounded cursor-pointer`}
              />
            </div>
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Base Right (B.x):</span>
                <span className="font-mono text-emerald-400">{triangleParams.x2.toFixed(2)} m</span>
              </div>
              <input
                type="range"
                min="0"
                max="8"
                step="0.1"
                value={triangleParams.x2}
                onChange={(e) => onUpdateTriangle({ ...triangleParams, x2: parseFloat(e.target.value) })}
                className={`w-full ${currentCfg.accentSlider} bg-slate-800 h-1.5 rounded cursor-pointer`}
              />
            </div>
          </div>
        )}

        {mode === 'rhombus' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Diagonal 1 (d₁):</span>
                <span className="font-mono text-pink-400">{rhombusParams.d1.toFixed(2)} m</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="12"
                step="0.1"
                value={rhombusParams.d1}
                onChange={(e) => onUpdateRhombus({ ...rhombusParams, d1: parseFloat(e.target.value) })}
                className={`w-full ${currentCfg.accentSlider} bg-slate-800 h-1.5 rounded cursor-pointer`}
              />
            </div>
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Diagonal 2 (d₂):</span>
                <span className="font-mono text-pink-400">{rhombusParams.d2.toFixed(2)} m</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="12"
                step="0.1"
                value={rhombusParams.d2}
                onChange={(e) => onUpdateRhombus({ ...rhombusParams, d2: parseFloat(e.target.value) })}
                className={`w-full ${currentCfg.accentSlider} bg-slate-800 h-1.5 rounded cursor-pointer`}
              />
            </div>
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Center Y:</span>
                <span className="font-mono text-pink-400">{rhombusParams.k.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-6"
                max="6"
                step="0.1"
                value={rhombusParams.k}
                onChange={(e) => onUpdateRhombus({ ...rhombusParams, k: parseFloat(e.target.value) })}
                className={`w-full ${currentCfg.accentSlider} bg-slate-800 h-1.5 rounded cursor-pointer`}
              />
            </div>
          </div>
        )}

        {mode === 'parallelogram' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Base Length:</span>
                <span className="font-mono text-purple-400">{parallelogramParams.base.toFixed(2)} m</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="12"
                step="0.1"
                value={parallelogramParams.base}
                onChange={(e) => onUpdateParallelogram({ ...parallelogramParams, base: parseFloat(e.target.value) })}
                className={`w-full ${currentCfg.accentSlider} bg-slate-800 h-1.5 rounded cursor-pointer`}
              />
            </div>
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Height:</span>
                <span className="font-mono text-purple-400">{parallelogramParams.height.toFixed(2)} m</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.1"
                value={parallelogramParams.height}
                onChange={(e) => onUpdateParallelogram({ ...parallelogramParams, height: parseFloat(e.target.value) })}
                className={`w-full ${currentCfg.accentSlider} bg-slate-800 h-1.5 rounded cursor-pointer`}
              />
            </div>
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Skew Offset:</span>
                <span className="font-mono text-purple-400">{parallelogramParams.skew.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-4"
                max="4"
                step="0.1"
                value={parallelogramParams.skew}
                onChange={(e) => onUpdateParallelogram({ ...parallelogramParams, skew: parseFloat(e.target.value) })}
                className={`w-full ${currentCfg.accentSlider} bg-slate-800 h-1.5 rounded cursor-pointer`}
              />
            </div>
          </div>
        )}

        {mode === 'parabola' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Curvature (a):</span>
                <span className="font-mono text-teal-400">{parabolaParams.a.toFixed(4)}</span>
              </div>
              <input
                type="range"
                min="-0.15"
                max="0.15"
                step="0.001"
                value={parabolaParams.a}
                onChange={(e) => {
                  const newA = parseFloat(e.target.value);
                  const newB = -2 * newA * parabolaParams.h;
                  const newC = newA * parabolaParams.h * parabolaParams.h + parabolaParams.k;
                  onUpdateParabola({ ...parabolaParams, a: newA, b: Number(newB.toFixed(3)), c: Number(newC.toFixed(2)) });
                }}
                className={`w-full ${currentCfg.accentSlider} bg-slate-800 h-1.5 rounded cursor-pointer`}
              />
            </div>
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Apex Height (k):</span>
                <span className="font-mono text-teal-400">{parabolaParams.k.toFixed(2)} m</span>
              </div>
              <input
                type="range"
                min="-6"
                max="8"
                step="0.1"
                value={parabolaParams.k}
                onChange={(e) => {
                  const newK = parseFloat(e.target.value);
                  const newC = parabolaParams.a * parabolaParams.h * parabolaParams.h + newK;
                  onUpdateParabola({ ...parabolaParams, k: newK, c: Number(newC.toFixed(2)) });
                }}
                className={`w-full ${currentCfg.accentSlider} bg-slate-800 h-1.5 rounded cursor-pointer`}
              />
            </div>
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Vertex X (h):</span>
                <span className="font-mono text-teal-400">{parabolaParams.h.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-6"
                max="6"
                step="0.1"
                value={parabolaParams.h}
                onChange={(e) => {
                  const newH = parseFloat(e.target.value);
                  const newB = -2 * parabolaParams.a * newH;
                  const newC = parabolaParams.a * newH * newH + parabolaParams.k;
                  onUpdateParabola({ ...parabolaParams, h: newH, b: Number(newB.toFixed(3)), c: Number(newC.toFixed(2)) });
                }}
                className={`w-full ${currentCfg.accentSlider} bg-slate-800 h-1.5 rounded cursor-pointer`}
              />
            </div>
          </div>
        )}

        {mode === 'slope' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Elevation θ (Clinometer):</span>
                <span className="font-mono text-orange-400">{slopeMetrics.elevationDeg.toFixed(1)}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="85"
                step="0.5"
                value={slopeMetrics.elevationDeg}
                onChange={(e) => {
                  const deg = parseFloat(e.target.value);
                  const rad = (deg * Math.PI) / 180;
                  const hyp = slopeMetrics.hypotenuse;
                  onUpdateSlope({
                    ...slopeParams,
                    x2: Number((slopeParams.x1 + hyp * Math.cos(rad)).toFixed(2)),
                    y2: Number((slopeParams.y1 + hyp * Math.sin(rad)).toFixed(2)),
                    angleDeg: deg,
                  });
                }}
                className={`w-full ${currentCfg.accentSlider} bg-slate-800 h-1.5 rounded cursor-pointer`}
              />
            </div>
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Base Distance (Run):</span>
                <span className="font-mono text-orange-400">{Math.abs(slopeMetrics.dx).toFixed(2)} m</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="14"
                step="0.1"
                value={Math.abs(slopeMetrics.dx)}
                onChange={(e) => {
                  const run = parseFloat(e.target.value);
                  onUpdateSlope({ ...slopeParams, x2: Number((slopeParams.x1 + run).toFixed(2)) });
                }}
                className={`w-full ${currentCfg.accentSlider} bg-slate-800 h-1.5 rounded cursor-pointer`}
              />
            </div>
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Height (Tree / Rise):</span>
                <span className="font-mono text-orange-400">{Math.abs(slopeMetrics.dy).toFixed(2)} m</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="14"
                step="0.1"
                value={Math.abs(slopeMetrics.dy)}
                onChange={(e) => {
                  const rise = parseFloat(e.target.value);
                  onUpdateSlope({ ...slopeParams, y2: Number((slopeParams.y1 + rise).toFixed(2)) });
                }}
                className={`w-full ${currentCfg.accentSlider} bg-slate-800 h-1.5 rounded cursor-pointer`}
              />
            </div>
          </div>
        )}

        {/* Grid Scale and Axes Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-200">
              <Grid className="w-3.5 h-3.5 text-cyan-400" />
              <input
                type="checkbox"
                checked={coordSys.showGrid}
                onChange={(e) => onUpdateCoordSys({ showGrid: e.target.checked })}
                className="rounded accent-cyan-400 cursor-pointer"
              />
              <span>Cartesian Grid</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-200">
              <input
                type="checkbox"
                checked={coordSys.showAxes}
                onChange={(e) => onUpdateCoordSys({ showAxes: e.target.checked })}
                className="rounded accent-cyan-400 cursor-pointer"
              />
              <span>X-Y Axes & Origin (0,0)</span>
            </label>
          </div>
          <div className="flex items-center gap-2">
            <span>Scale:</span>
            <input
              type="range"
              min="20"
              max="90"
              step="1"
              value={coordSys.pixelsPerUnit}
              onChange={(e) => onUpdateCoordSys({ pixelsPerUnit: parseInt(e.target.value) })}
              className="accent-cyan-400 bg-slate-800 h-1.5 w-24 rounded cursor-pointer"
            />
            <span className="font-mono text-cyan-300 w-12 text-right">{coordSys.pixelsPerUnit} px/m</span>
          </div>
        </div>
      </div>
    </div>
  );
};
