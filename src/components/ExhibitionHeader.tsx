import React from 'react';
import { InputSource } from '../types';
import { Camera, Download, Sparkles, Shapes, Volume2 } from 'lucide-react';

interface ExhibitionHeaderProps {
  inputSource: InputSource;
  isWebcamActive: boolean;
  isFrozen: boolean;
  activeTab?: 'vision' | '3d-equations';
  onSelectTab?: (tab: 'vision' | '3d-equations') => void;
  onToggleWebcam: () => void;
  onSnapshot: () => void;
  onExportSingleFileHtml: () => void;
}

export const ExhibitionHeader: React.FC<ExhibitionHeaderProps> = ({
  isWebcamActive,
  isFrozen,
  activeTab = 'vision',
  onSelectTab,
  onToggleWebcam,
  onSnapshot,
  onExportSingleFileHtml,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/90 shadow-lg">
      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark with Joyful Geometric Prism Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (onSelectTab) onSelectTab('vision');
          }}
          className="flex items-center gap-2.5 whitespace-nowrap shrink-0 group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-amber-400 p-[1.5px] shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Shapes className="w-5 h-5 text-cyan-400 group-hover:text-amber-300 transition-colors" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white font-display leading-tight flex items-center gap-1.5">
              Math Lens
              <span className="text-[10px] uppercase font-mono font-semibold px-1.5 py-0.2 rounded bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/30">
                CBSE 9 & 10
              </span>
            </span>
            <span className="text-[11px] text-slate-400 leading-tight hidden sm:block">
              Real-World Vision & 3D Math Studio
            </span>
          </div>
        </a>

        {/* Zone 1.5: Primary Studio Mode Switcher */}
        {onSelectTab && (
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold shrink-0">
            <button
              onClick={() => onSelectTab('vision')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'vision'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Camera & CAD Lens</span>
            </button>
            <button
              onClick={() => onSelectTab('3d-equations')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === '3d-equations'
                  ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-slate-950 font-bold shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>3D Equation & Question Studio</span>
            </button>
          </div>
        )}

        {/* Zone 2: Navigation Links */}
        <nav className="hidden xl:flex items-center gap-5 text-xs font-medium text-slate-300">
          <button
            onClick={() => onSelectTab && onSelectTab('3d-equations')}
            className="text-amber-400 hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 font-bold"
          >
            <span>⚡ 3D Equation Visualizer</span>
          </button>
          <a
            href="#ai-voice-tutor"
            onClick={() => onSelectTab && onSelectTab('vision')}
            className="text-cyan-400 hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Voice Tutor</span>
          </a>
          <a
            href="#vision-stage"
            onClick={() => onSelectTab && onSelectTab('vision')}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <span>Architecture CAD</span>
          </a>
          <a
            href="#everyday-objects"
            onClick={() => onSelectTab && onSelectTab('vision')}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <span>Everyday Objects</span>
          </a>
          <a
            href="#cbse-curriculum"
            onClick={() => onSelectTab && onSelectTab('vision')}
            className="hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <span>NCERT Solver</span>
          </a>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Webcam button */}
          <button
            onClick={onToggleWebcam}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              isWebcamActive
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isWebcamActive ? 'Stop Camera' : 'Live Camera'}</span>
            <span className="sm:hidden">{isWebcamActive ? 'Stop' : 'Cam'}</span>
          </button>

          {/* Freeze frame if webcam active */}
          {isWebcamActive && (
            <button
              onClick={onSnapshot}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all whitespace-nowrap shrink-0 ${
                isFrozen
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30 animate-pulse'
                  : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 hover:bg-indigo-500/30'
              }`}
            >
              {isFrozen ? 'Unfreeze' : 'Snapshot'}
            </button>
          )}

          {/* 1-Click Export Standalone HTML */}
          <button
            onClick={onExportSingleFileHtml}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-300 hover:from-cyan-300 hover:to-amber-200 rounded-lg shadow-sm shadow-cyan-500/20 transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 font-display"
            title="Download the complete standalone single-file HTML version to run offline anywhere"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export HTML</span>
          </button>
        </div>
      </div>
    </header>
  );
};
