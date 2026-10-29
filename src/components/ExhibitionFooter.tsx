import React from 'react';
import { Shapes, BookOpen, Layers, Sparkles, Download, Heart } from 'lucide-react';
import { Mode } from '../types';

interface ExhibitionFooterProps {
  onSelectShape: (m: Mode) => void;
  onExportSingleFileHtml: () => void;
  onOpen3DStudio?: () => void;
}

export const ExhibitionFooter: React.FC<ExhibitionFooterProps> = ({
  onSelectShape,
  onExportSingleFileHtml,
  onOpen3DStudio,
}) => {
  return (
    <footer className="mt-12 bg-slate-900/90 border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Brand & Exhibition Mission */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 via-indigo-500 to-amber-400 p-[1px]">
                <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
                  <Shapes className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="text-base font-bold text-white font-display">Math Lens</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              An interactive Mathematics & AI exhibition platform designed to bridge CBSE Class 9 and 10 NCERT textbook concepts with real-time computer vision and geometric overlays on everyday objects.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={onExportSingleFileHtml}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-lg flex items-center gap-1.5 transition-colors text-[11px] font-medium"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Standalone HTML</span>
              </button>
              {onOpen3DStudio && (
                <button
                  onClick={onOpen3DStudio}
                  className="px-3 py-1.5 bg-indigo-950 hover:bg-indigo-900 text-cyan-300 border border-indigo-700/60 rounded-lg flex items-center gap-1.5 transition-colors text-[11px] font-medium"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>3D Equation Studio</span>
                </button>
              )}
            </div>
          </div>

          {/* Column 2: CBSE Curriculum Mappings */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-1.5 text-slate-200 font-semibold text-xs uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>NCERT Syllabus Mapped</span>
            </div>
            <ul className="space-y-1.5 text-slate-400 text-xs">
              <li>
                <button
                  onClick={() => onSelectShape('rectangle')}
                  className="hover:text-cyan-300 transition-colors text-left"
                >
                  <strong className="text-slate-300">Class 9 Ch 8:</strong> Quadrilaterals (Rectangle & Square)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectShape('triangle')}
                  className="hover:text-emerald-300 transition-colors text-left"
                >
                  <strong className="text-slate-300">Class 9 Ch 12:</strong> Heron's Formula (Triangle Area)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectShape('circle')}
                  className="hover:text-cyan-300 transition-colors text-left"
                >
                  <strong className="text-slate-300">Class 10 Ch 10 & 12:</strong> Circles (Tangents & Revolutions)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectShape('slope')}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  <strong className="text-slate-300">Class 10 Ch 9:</strong> Trigonometry (Tree Heights & Distances)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectShape('parabola')}
                  className="hover:text-emerald-300 transition-colors text-left"
                >
                  <strong className="text-slate-300">Class 10 Ch 2 & 4:</strong> Polynomials & Quadratic Arches
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Everyday Objects Covered */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-1.5 text-slate-200 font-semibold text-xs uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Objects in the Wild</span>
            </div>
            <ul className="space-y-1.5 text-slate-400 text-xs">
              <li>
                <span className="text-slate-300">📱 Smartphone:</span> Screen diagonal & aspect ratio
              </li>
              <li>
                <span className="text-slate-300">💻 Tablet:</span> 4:3 display perimeter & area
              </li>
              <li>
                <span className="text-slate-300">🚲 Bicycle Wheel:</span> Revolutions per km ($N = D/2\pi r$)
              </li>
              <li>
                <span className="text-slate-300">🌲 Cedar Tree:</span> Inaccessible height via clinometer $\tan\theta$
              </li>
              <li>
                <span className="text-slate-300">🪁 Kites & Toys:</span> Rhombus diagonals ($\frac{1}{2}d_1 d_2$)
              </li>
              <li>
                <span className="text-slate-300">🌉 Arch Bridge:</span> Parabola span & river pier clearances
              </li>
              <li>
                <span className="text-slate-300">🛹 Skate Ramp:</span> Right-angled wedge slope & % grade
              </li>
            </ul>
          </div>

          {/* Column 4: Exhibition Features */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-1.5 text-slate-200 font-semibold text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Interactive Exhibition Features</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              • Real-time client-side Sobel edge detection matrix filter.<br />
              • Interactive on-canvas handles for dragging vertices and scale origin.<br />
              • Live CBSE Board Exam Problem Generator calculating exact real-time solutions.<br />
              • Instant 3-point geometry snapping and polynomial curve regression.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div className="flex items-center gap-1">
            <span>Crafted for CBSE Mathematics Exhibitions · Made with</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            <span>for students & teachers</span>
          </div>
          <div>
            <span>Math Lens v2.0 · Single-File Web Application Bundle Available</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
