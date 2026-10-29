/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  InputSource,
  CompareMode,
  CADTheme,
  ReticleStyle,
  CADTool,
  CameraSettings,
  CoordinateSystem,
} from '../types';
import { VIRTUAL_BENCH_SCENES, VirtualBenchScene } from '../utils/virtualCamera';
import {
  Camera,
  Layers,
  Ruler,
  Maximize2,
  Compass,
  Download,
  FlipHorizontal,
  Zap,
  Timer,
  Eye,
  Split,
  Palette,
  Crosshair,
  Sparkles,
  RotateCcw,
  Check,
  Scale,
  Video,
} from 'lucide-react';

interface CameraCadToolbarProps {
  inputSource: InputSource;
  isWebcamActive: boolean;
  isFrozen: boolean;
  compareMode: CompareMode;
  cadTheme: CADTheme;
  cadTool: CADTool;
  reticleStyle: ReticleStyle;
  cameraSettings: CameraSettings;
  coordSys: CoordinateSystem;
  activeVirtualScene: VirtualBenchScene;
  hasCalipers: boolean;
  onSetInputSource: (src: InputSource) => void;
  onToggleWebcam: () => void;
  onToggleTorch: () => void;
  onFlipCamera: () => void;
  onSetZoom: (zoom: number) => void;
  onSetReticle: (reticle: ReticleStyle) => void;
  onSetCompareMode: (mode: CompareMode) => void;
  onSetCADTheme: (theme: CADTheme) => void;
  onSetCADTool: (tool: CADTool) => void;
  onSelectVirtualScene: (scene: VirtualBenchScene) => void;
  onCaptureSnapshot: () => void;
  onClearCADMeasurements: () => void;
  onExportCADDrawing: () => void;
  onPortTo3DStudio: () => void;
}

export const CameraCadToolbar: React.FC<CameraCadToolbarProps> = ({
  inputSource,
  isWebcamActive,
  isFrozen,
  compareMode,
  cadTheme,
  cadTool,
  reticleStyle,
  cameraSettings,
  coordSys,
  activeVirtualScene,
  hasCalipers,
  onToggleWebcam,
  onToggleTorch,
  onFlipCamera,
  onSetZoom,
  onSetReticle,
  onSetCompareMode,
  onSetCADTheme,
  onSetCADTool,
  onSelectVirtualScene,
  onCaptureSnapshot,
  onClearCADMeasurements,
  onExportCADDrawing,
  onPortTo3DStudio,
}) => {
  return (
    <div className="flex flex-col gap-3 bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shadow-xl">
      {/* Top Bar: Primary Mode Navigation & Viewport Display Switches */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        {/* Left: Camera Feed & Shutter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onToggleWebcam}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isWebcamActive
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 hover:from-cyan-400 hover:to-indigo-500 shadow-md shadow-cyan-500/20'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{isWebcamActive ? 'Stop Live Camera' : 'Start Live Camera'}</span>
          </button>

          {isWebcamActive && (
            <>
              <button
                onClick={onFlipCamera}
                title="Flip Front / Rear Camera"
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              >
                <FlipHorizontal className="w-4 h-4" />
              </button>

              <button
                onClick={onToggleTorch}
                title="Toggle Torch / Flashlight"
                className={`p-1.5 rounded-xl border transition-colors ${
                  cameraSettings.torch
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
              >
                <Zap className="w-4 h-4" />
              </button>

              <button
                onClick={onCaptureSnapshot}
                title="Capture Snapshot / Freeze Frame"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  isFrozen
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500 shadow-md'
                }`}
              >
                <Timer className="w-3.5 h-3.5" />
                <span>{isFrozen ? 'Unfreeze' : 'Snapshot'}</span>
              </button>
            </>
          )}

          {/* Virtual Bench Simulation Selector (Always works even without camera hardware) */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <span className="text-[10px] text-slate-400 px-2 font-mono flex items-center gap-1">
              <Video className="w-3 h-3 text-cyan-400" />
              Bench:
            </span>
            {VIRTUAL_BENCH_SCENES.map((scene) => (
              <button
                key={scene.id}
                onClick={() => onSelectVirtualScene(scene.id)}
                className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  inputSource === 'virtual-bench' && activeVirtualScene === scene.id
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {scene.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Viewport Mode (Overlay, Split, CAD Blueprint) */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => onSetCompareMode('overlay')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
              compareMode === 'overlay'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Live Video/Image with Math Overlays"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">HUD Overlay</span>
          </button>
          <button
            onClick={() => onSetCompareMode('split-curtain')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
              compareMode === 'split-curtain'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Draggable Curtain Split: Real Camera on Left vs Wireframe Blueprint on Right"
          >
            <Split className="w-3.5 h-3.5" />
            <span>Before / After Split</span>
          </button>
          <button
            onClick={() => onSetCompareMode('cad-blueprint')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
              compareMode === 'cad-blueprint'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="100% CAD Architectural Blueprint View"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CAD Blueprint</span>
          </button>
        </div>
      </div>

      {/* Middle Bar: Interactive CAD Engineering Tools & Camera Viewfinder Reticle */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* CAD Tool Selector */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-300 font-display flex items-center gap-1 uppercase tracking-wider mr-1">
            <Ruler className="w-3.5 h-3.5 text-amber-400" />
            CAD Measurement Tools:
          </span>

          <button
            onClick={() => onSetCADTool(cadTool === 'caliper' ? 'none' : 'caliper')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all ${
              cadTool === 'caliper'
                ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm shadow-amber-500/20'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
            title="Point-to-Point Caliper: Click 2 points on canvas to measure distance and slope"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>📏 Caliper (Distance)</span>
          </button>

          <button
            onClick={() => onSetCADTool(cadTool === 'protractor' ? 'none' : 'protractor')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all ${
              cadTool === 'protractor'
                ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-sm shadow-cyan-500/20'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
            title="3-Point Protractor: Click vertex and two points to measure angle θ and radians"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>📐 Protractor (Angle)</span>
          </button>

          <button
            onClick={() => onSetCADTool(cadTool === 'polygon' ? 'none' : 'polygon')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all ${
              cadTool === 'polygon'
                ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-sm shadow-emerald-500/20'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
            title="Polygon Surveyor: Click points to calculate perimeter & enclosed area"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>🔷 Polygon (Area)</span>
          </button>

          <button
            onClick={() => onSetCADTool(cadTool === 'calibrate' ? 'none' : 'calibrate')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all ${
              cadTool === 'calibrate'
                ? 'bg-indigo-500 text-white font-bold border-indigo-400 shadow-sm'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
            title="Calibrate Scale: Click two reference points with known real-world dimension"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>⚖️ Calibrate Scale</span>
          </button>

          {hasCalipers && (
            <button
              onClick={onClearCADMeasurements}
              className="px-2 py-1.5 rounded-xl text-[11px] text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900 border border-rose-800/50 transition-colors"
              title="Clear all manual measurements"
            >
              Clear Marks
            </button>
          )}
        </div>

        {/* Viewfinder Reticle & CAD Theme & Zoom Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Zoom Selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
            <span className="text-slate-400 px-1 font-mono">Zoom:</span>
            {[1, 1.5, 2, 3].map((z) => (
              <button
                key={z}
                onClick={() => onSetZoom(z)}
                className={`px-1.5 py-0.5 rounded-md font-mono font-semibold transition-all ${
                  cameraSettings.zoom === z
                    ? 'bg-cyan-500 text-slate-950'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {z}×
              </button>
            ))}
          </div>

          {/* Reticle Overlay Selector */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
            <span className="text-slate-400 px-1.5 font-mono flex items-center gap-1">
              <Crosshair className="w-3 h-3 text-cyan-400" />
              HUD:
            </span>
            {(['none', 'tactical', 'aviation', 'golden-ratio', 'rule-of-thirds'] as ReticleStyle[]).map(
              (r) => (
                <button
                  key={r}
                  onClick={() => onSetReticle(r)}
                  className={`px-2 py-0.5 rounded-md capitalize font-medium transition-all ${
                    reticleStyle === r
                      ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {r === 'none' ? 'Clean' : r.split('-')[0]}
                </button>
              )
            )}
          </div>

          {/* CAD Theme Selector */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
            <span className="text-slate-400 px-1.5 font-mono flex items-center gap-1">
              <Palette className="w-3 h-3 text-amber-400" />
              Theme:
            </span>
            {(
              [
                { id: 'cyan-blueprint', label: 'Cyan', color: '#06b6d4' },
                { id: 'amber-terminal', label: 'Amber', color: '#f59e0b' },
                { id: 'emerald-matrix', label: 'Matrix', color: '#10b981' },
                { id: 'monochrome-plotter', label: 'Plotter', color: '#cbd5e1' },
              ] as { id: CADTheme; label: string; color: string }[]
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => onSetCADTheme(t.id)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-medium transition-all ${
                  cadTheme === t.id
                    ? 'bg-slate-800 text-white font-bold border border-slate-600'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }}></span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar: Quick Engineering Actions (Export CAD Drawing & Send to 3D Studio) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
        <div className="text-[11px] text-slate-400 font-mono">
          Scale: <strong className="text-cyan-300">1 {coordSys.unitLabel} = {coordSys.pixelsPerUnit} px</strong> (Calibrated)
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExportCADDrawing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 transition-all hover:scale-105 active:scale-95"
            title="Download high-resolution architectural CAD drawing with title block as PNG"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CAD Blueprint</span>
          </button>

          <button
            onClick={onPortTo3DStudio}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 hover:from-cyan-300 hover:to-indigo-400 shadow-md shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95"
            title="Send current measured geometry directly into the 3D Equation & Problem Visualizer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Port to 3D Studio</span>
          </button>
        </div>
      </div>
    </div>
  );
};
