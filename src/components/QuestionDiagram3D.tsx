/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ParsedMathResult } from '../utils/mathParser';

interface QuestionDiagram3DProps {
  model: ParsedMathResult;
  className?: string;
  showDetails?: boolean;
}

/**
 * QuestionDiagram3D: Renders an isometric 3D mathematical blueprint / schematic
 * with explicit dimension callouts, leader lines, and geometric features.
 * Appears whenever a question is presented or selected.
 */
export const QuestionDiagram3D: React.FC<QuestionDiagram3DProps> = ({
  model,
  className = '',
  showDetails = true,
}) => {
  const challenge = model.questionChallenge;
  const diagramType = challenge?.diagramType || model.type;
  const dims = model.dimensions || {};

  // Render specific SVG schematic based on diagram type
  const renderSchematic = () => {
    switch (diagramType) {
      case 'capsule':
      case 'capsule_cylinder_spheres': {
        const d = dims.radius ? dims.radius * 2 : 5;
        const totalL = dims.height ? dims.height + (dims.radius || 2.5) * 2 : 14;
        const cylH = dims.height || 9;
        const r = dims.radius || 2.5;

        return (
          <svg viewBox="0 0 340 180" className="w-full h-full">
            <defs>
              <linearGradient id="capsuleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="hemiCapGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#d97706" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Center Grid Reference Lines */}
            <line x1="40" y1="90" x2="300" y2="90" stroke="#334155" strokeDasharray="3,3" strokeWidth="1" />
            <line x1="170" y1="40" x2="170" y2="140" stroke="#334155" strokeDasharray="3,3" strokeWidth="1" />

            {/* Left Hemispherical End */}
            <path
              d="M 120 50 A 40 40 0 0 0 120 130 Z"
              fill="url(#hemiCapGrad)"
              stroke="#f59e0b"
              strokeWidth="2"
            />
            {/* Left Hemisphere Junction Dashed Line */}
            <ellipse cx="120" cy="90" rx="6" ry="40" fill="none" stroke="#f59e0b" strokeDasharray="2,2" strokeWidth="1.5" />

            {/* Central Cylindrical Body */}
            <rect x="120" y="50" width="100" height="80" fill="url(#capsuleGrad)" stroke="#06b6d4" strokeWidth="2" />
            <line x1="120" y1="50" x2="220" y2="50" stroke="#38bdf8" strokeWidth="2.5" />
            <line x1="120" y1="130" x2="220" y2="130" stroke="#38bdf8" strokeWidth="2.5" />

            {/* Right Hemispherical End */}
            <path
              d="M 220 50 A 40 40 0 0 1 220 130 Z"
              fill="url(#hemiCapGrad)"
              stroke="#f59e0b"
              strokeWidth="2"
            />
            <ellipse cx="220" cy="90" rx="6" ry="40" fill="none" stroke="#f59e0b" strokeDasharray="2,2" strokeWidth="1.5" />

            {/* Dimension Callout: Diameter 2r */}
            <line x1="105" y1="50" x2="105" y2="130" stroke="#ec4899" strokeWidth="1.5" markerStart="url(#pinkDot)" />
            <line x1="100" y1="50" x2="110" y2="50" stroke="#ec4899" strokeWidth="1" />
            <line x1="100" y1="130" x2="110" y2="130" stroke="#ec4899" strokeWidth="1" />
            <text x="95" y="94" fill="#ec4899" fontSize="10" fontFamily="monospace" textAnchor="end" fontWeight="bold">
              d = {d} mm
            </text>

            {/* Dimension Callout: Cylinder Length */}
            <line x1="120" y1="145" x2="220" y2="145" stroke="#38bdf8" strokeWidth="1.5" />
            <line x1="120" y1="140" x2="120" y2="150" stroke="#38bdf8" strokeWidth="1" />
            <line x1="220" y1="140" x2="220" y2="150" stroke="#38bdf8" strokeWidth="1" />
            <text x="170" y="158" fill="#38bdf8" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
              h (cyl) = {cylH} mm
            </text>

            {/* Dimension Callout: Total Length */}
            <line x1="80" y1="30" x2="260" y2="30" stroke="#10b981" strokeWidth="1.5" />
            <line x1="80" y1="25" x2="80" y2="35" stroke="#10b981" strokeWidth="1" />
            <line x1="260" y1="25" x2="260" y2="35" stroke="#10b981" strokeWidth="1" />
            <text x="170" y="24" fill="#10b981" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
              Total Length L = {totalL} mm
            </text>

            {/* Radius Callout */}
            <text x="75" y="105" fill="#f59e0b" fontSize="9" fontFamily="monospace" textAnchor="middle">
              r = {r} mm
            </text>
          </svg>
        );
      }

      case 'toy_cone_hemi':
      case 'composite_toy': {
        const r = dims.radius || 3.5;
        const totalH = dims.height ? dims.height + r : 15.5;
        const coneH = dims.height || 12;

        return (
          <svg viewBox="0 0 340 190" className="w-full h-full">
            <defs>
              <linearGradient id="toyConeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#be185d" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="toyHemiGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0891b2" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Central Vertical Axis */}
            <line x1="170" y1="15" x2="170" y2="175" stroke="#334155" strokeDasharray="3,3" strokeWidth="1" />

            {/* Conical Top */}
            <polygon points="170,30 115,110 225,110" fill="url(#toyConeGrad)" stroke="#ec4899" strokeWidth="2" />

            {/* Boundary Rim Ellipse */}
            <ellipse cx="170" cy="110" rx="55" ry="12" fill="none" stroke="#f59e0b" strokeWidth="1.5" />

            {/* Hemispherical Base (Bowl below) */}
            <path
              d="M 115 110 A 55 55 0 0 0 225 110 Z"
              fill="url(#toyHemiGrad)"
              stroke="#06b6d4"
              strokeWidth="2"
            />

            {/* Dimension Callout: Total Height */}
            <line x1="245" y1="30" x2="245" y2="165" stroke="#10b981" strokeWidth="1.5" />
            <line x1="240" y1="30" x2="250" y2="30" stroke="#10b981" strokeWidth="1" />
            <line x1="240" y1="165" x2="250" y2="165" stroke="#10b981" strokeWidth="1" />
            <text x="255" y="100" fill="#10b981" fontSize="10" fontFamily="monospace" fontWeight="bold">
              Total H = {totalH} cm
            </text>

            {/* Dimension Callout: Cone Height */}
            <line x1="85" y1="30" x2="85" y2="110" stroke="#ec4899" strokeWidth="1.5" />
            <line x1="80" y1="30" x2="90" y2="30" stroke="#ec4899" strokeWidth="1" />
            <line x1="80" y1="110" x2="90" y2="110" stroke="#ec4899" strokeWidth="1" />
            <text x="75" y="74" fill="#ec4899" fontSize="10" fontFamily="monospace" textAnchor="end" fontWeight="bold">
              h (cone) = {coneH} cm
            </text>

            {/* Slant Height Callout */}
            <text x="130" y="65" fill="#f43f5e" fontSize="9" fontFamily="monospace" fontWeight="bold">
              l = 12.5 cm
            </text>

            {/* Radius Callout on Rim */}
            <line x1="170" y1="110" x2="225" y2="110" stroke="#f59e0b" strokeWidth="2" />
            <circle cx="170" cy="110" r="2.5" fill="#f59e0b" />
            <circle cx="225" cy="110" r="2.5" fill="#f59e0b" />
            <text x="195" y="105" fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold">
              r = {r} cm
            </text>
          </svg>
        );
      }

      case 'frustum':
      case 'frustum_cone': {
        const r1 = dims.radius || 4;
        const r2 = dims.radius2 || 2;
        const h = dims.height || 14;

        return (
          <svg viewBox="0 0 340 180" className="w-full h-full">
            <defs>
              <linearGradient id="frustumGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Center Axis */}
            <line x1="170" y1="20" x2="170" y2="160" stroke="#334155" strokeDasharray="3,3" strokeWidth="1" />

            {/* Top Rim Ellipse (Larger) */}
            <ellipse cx="170" cy="35" rx="65" ry="14" fill="#0284c7" fillOpacity="0.4" stroke="#38bdf8" strokeWidth="2" />

            {/* Frustum Body Walls */}
            <polygon points="105,35 235,35 205,145 135,145" fill="url(#frustumGrad)" stroke="#06b6d4" strokeWidth="1.5" />

            {/* Bottom Rim Ellipse (Smaller) */}
            <ellipse cx="170" cy="145" rx="35" ry="8" fill="#0369a1" fillOpacity="0.6" stroke="#06b6d4" strokeWidth="2" />

            {/* Top Radius Callout */}
            <line x1="170" y1="35" x2="235" y2="35" stroke="#f59e0b" strokeWidth="1.5" />
            <circle cx="170" cy="35" r="2.5" fill="#f59e0b" />
            <circle cx="235" cy="35" r="2.5" fill="#f59e0b" />
            <text x="202" y="30" fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold">
              r₁ = {r1} cm
            </text>

            {/* Bottom Radius Callout */}
            <line x1="170" y1="145" x2="205" y2="145" stroke="#f59e0b" strokeWidth="1.5" />
            <circle cx="170" cy="145" r="2" fill="#f59e0b" />
            <circle cx="205" cy="145" r="2" fill="#f59e0b" />
            <text x="187" y="160" fill="#f59e0b" fontSize="9" fontFamily="monospace" fontWeight="bold">
              r₂ = {r2} cm
            </text>

            {/* Height Callout */}
            <line x1="90" y1="35" x2="90" y2="145" stroke="#10b981" strokeWidth="1.5" />
            <line x1="85" y1="35" x2="95" y2="35" stroke="#10b981" strokeWidth="1" />
            <line x1="85" y1="145" x2="95" y2="145" stroke="#10b981" strokeWidth="1" />
            <text x="80" y="94" fill="#10b981" fontSize="10" fontFamily="monospace" textAnchor="end" fontWeight="bold">
              h = {h} cm
            </text>

            {/* Slant Height Label */}
            <text x="228" y="95" fill="#ec4899" fontSize="10" fontFamily="monospace" fontWeight="bold">
              l = √(h²+(r₁-r₂)²)
            </text>
          </svg>
        );
      }

      case 'stepped_pole': {
        const r1 = dims.radius || 12;
        const h1 = dims.height || 220;
        const r2 = dims.radius2 || 8;
        const h2 = dims.depth || 60;

        return (
          <svg viewBox="0 0 340 180" className="w-full h-full">
            <defs>
              <linearGradient id="poleLowerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#475569" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#1e293b" stopOpacity="0.7" />
              </linearGradient>
              <linearGradient id="poleUpperGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.6" />
              </linearGradient>
            </defs>

            {/* Center Axis */}
            <line x1="170" y1="15" x2="170" y2="170" stroke="#334155" strokeDasharray="3,3" strokeWidth="1" />

            {/* Base Cylinder */}
            <rect x="130" y="85" width="80" height="75" fill="url(#poleLowerGrad)" stroke="#64748b" strokeWidth="1.5" />
            <ellipse cx="170" cy="85" rx="40" ry="10" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
            <ellipse cx="170" cy="160" rx="40" ry="10" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />

            {/* Surmounted Smaller Cylinder */}
            <rect x="145" y="25" width="50" height="60" fill="url(#poleUpperGrad)" stroke="#38bdf8" strokeWidth="1.5" />
            <ellipse cx="170" cy="25" rx="25" ry="6" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />

            {/* Dimension Callout: Upper Cylinder */}
            <line x1="210" y1="25" x2="210" y2="85" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="218" y="58" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">
              h₂ = {h2}cm, r₂ = {r2}cm
            </text>

            {/* Dimension Callout: Lower Cylinder */}
            <line x1="225" y1="85" x2="225" y2="160" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="233" y="125" fill="#f59e0b" fontSize="9" fontFamily="monospace" fontWeight="bold">
              h₁ = {h1}cm, r₁ = {r1}cm
            </text>

            {/* Total Iron Mass Formula Indicator */}
            <text x="170" y="174" fill="#10b981" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
              Total Volume V = π(r₁²h₁ + r₂²h₂)
            </text>
          </svg>
        );
      }

      case 'circus_tent':
      case 'composite_tent': {
        return (
          <svg viewBox="0 0 340 180" className="w-full h-full">
            <defs>
              <linearGradient id="tentRoofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#d97706" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="tentWallGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0891b2" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Conical Roof */}
            <polygon points="170,25 105,90 235,90" fill="url(#tentRoofGrad)" stroke="#f59e0b" strokeWidth="2" />

            {/* Cylindrical Base Walls */}
            <rect x="105" y="90" width="130" height="55" fill="url(#tentWallGrad)" stroke="#06b6d4" strokeWidth="2" />
            <ellipse cx="170" cy="90" rx="65" ry="12" fill="none" stroke="#f59e0b" strokeDasharray="3,3" strokeWidth="1.5" />
            <ellipse cx="170" cy="145" rx="65" ry="12" fill="#0891b2" fillOpacity="0.3" stroke="#06b6d4" strokeWidth="2" />

            {/* Slant Height Callout on Roof */}
            <line x1="205" y1="55" x2="245" y2="40" stroke="#f59e0b" strokeWidth="1" />
            <text x="250" y="42" fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold">
              l = 2.8 m
            </text>

            {/* Wall Height Callout */}
            <line x1="85" y1="90" x2="85" y2="145" stroke="#06b6d4" strokeWidth="1.5" />
            <text x="75" y="122" fill="#06b6d4" fontSize="10" fontFamily="monospace" textAnchor="end" fontWeight="bold">
              h = 2.1 m
            </text>

            {/* Radius Callout */}
            <line x1="170" y1="145" x2="235" y2="145" stroke="#10b981" strokeWidth="2" />
            <text x="202" y="160" fill="#10b981" fontSize="10" fontFamily="monospace" fontWeight="bold">
              r = 2 m (diam 4m)
            </text>
          </svg>
        );
      }

      case 'cube_depression':
      case 'cube_hemisphere_depression': {
        return (
          <svg viewBox="0 0 340 180" className="w-full h-full">
            <defs>
              <linearGradient id="cubeFaceTop" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#334155" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#1e293b" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Isometric 3D Wooden Cube */}
            {/* Top Face */}
            <polygon points="170,25 240,60 170,95 100,60" fill="url(#cubeFaceTop)" stroke="#64748b" strokeWidth="1.5" />
            {/* Left Face */}
            <polygon points="100,60 170,95 170,165 100,130" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
            {/* Right Face */}
            <polygon points="170,95 240,60 240,130 170,165" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />

            {/* Hemispherical Depression Hollowed in Top Face */}
            <ellipse cx="170" cy="60" rx="35" ry="16" fill="#0284c7" fillOpacity="0.4" stroke="#38bdf8" strokeWidth="2" />
            <path d="M 135 60 A 35 25 0 0 0 205 60 Z" fill="#0369a1" fillOpacity="0.6" stroke="#0ea5e9" strokeDasharray="2,2" strokeWidth="1.5" />

            {/* Cube Side Dimension */}
            <line x1="85" y1="60" x2="85" y2="130" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="75" y="98" fill="#f59e0b" fontSize="10" fontFamily="monospace" textAnchor="end" fontWeight="bold">
              a = 7 cm
            </text>

            {/* Depression Diameter Callout */}
            <line x1="135" y1="45" x2="205" y2="45" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="170" y="38" fill="#38bdf8" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
              d = 4.2 cm
            </text>

            {/* Formula Callout */}
            <text x="170" y="175" fill="#10b981" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
              Surface Area = 6a² - πr² + 2πr² = 6a² + πr²
            </text>
          </svg>
        );
      }

      case 'parabolic_arch':
      case 'conic_parabola': {
        const span = dims.width || 20;
        const height = dims.height || 5;

        return (
          <svg viewBox="0 0 340 180" className="w-full h-full">
            <defs>
              <linearGradient id="archFill" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Ground Baseline */}
            <line x1="40" y1="140" x2="300" y2="140" stroke="#475569" strokeWidth="2" />
            {/* Central Vertical Y Axis */}
            <line x1="170" y1="20" x2="170" y2="155" stroke="#334155" strokeDasharray="3,3" strokeWidth="1" />

            {/* Parabolic Arch Path */}
            <path
              d="M 60 140 Q 170 20 280 140 Z"
              fill="url(#archFill)"
              stroke="#10b981"
              strokeWidth="2.5"
            />

            {/* Vertical Suspension Cables */}
            {[90, 120, 150, 190, 220, 250].map((x) => {
              const rel = (x - 170) / 110;
              const y = 20 + rel * rel * 120;
              return (
                <line
                  key={x}
                  x1={x}
                  y1={y}
                  x2={x}
                  y2="140"
                  stroke="#38bdf8"
                  strokeOpacity="0.6"
                  strokeDasharray="2,2"
                  strokeWidth="1"
                />
              );
            })}

            {/* Apex Marker (0, h) */}
            <circle cx="170" cy="20" r="4" fill="#f59e0b" />
            <text x="170" y="14" fill="#f59e0b" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
              Apex (0, {height}m)
            </text>

            {/* Base Span Dimension */}
            <line x1="60" y1="155" x2="280" y2="155" stroke="#06b6d4" strokeWidth="1.5" />
            <line x1="60" y1="150" x2="60" y2="160" stroke="#06b6d4" strokeWidth="1" />
            <line x1="280" y1="150" x2="280" y2="160" stroke="#06b6d4" strokeWidth="1" />
            <text x="170" y="168" fill="#06b6d4" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
              Span = {span} meters
            </text>

            {/* Left / Right Abutment Roots */}
            <circle cx="60" cy="140" r="3" fill="#ec4899" />
            <text x="50" y="132" fill="#ec4899" fontSize="9" fontFamily="monospace" textAnchor="end">
              (-{span / 2}, 0)
            </text>
            <circle cx="280" cy="140" r="3" fill="#ec4899" />
            <text x="290" y="132" fill="#ec4899" fontSize="9" fontFamily="monospace">
              (+{span / 2}, 0)
            </text>
          </svg>
        );
      }

      case 'pyramid':
      case 'pyramid_square': {
        const side = dims.base || 10;
        const h = dims.height || 8;

        return (
          <svg viewBox="0 0 340 180" className="w-full h-full">
            <defs>
              <linearGradient id="pyrFaceLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#b45309" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="pyrFaceRight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d97706" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#78350f" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            {/* Hidden Base Edges (Dashed) */}
            <line x1="80" y1="120" x2="160" y2="95" stroke="#475569" strokeDasharray="3,3" strokeWidth="1" />
            <line x1="160" y1="95" x2="260" y2="115" stroke="#475569" strokeDasharray="3,3" strokeWidth="1" />

            {/* Vertical Height Line in Interior */}
            <line x1="170" y1="25" x2="170" y2="120" stroke="#38bdf8" strokeDasharray="2,2" strokeWidth="1.5" />

            {/* Front Left Face */}
            <polygon points="170,25 80,120 180,150" fill="url(#pyrFaceLeft)" stroke="#f59e0b" strokeWidth="1.5" />
            {/* Front Right Face */}
            <polygon points="170,25 180,150 260,115" fill="url(#pyrFaceRight)" stroke="#d97706" strokeWidth="1.5" />

            {/* Apex Node */}
            <circle cx="170" cy="25" r="3.5" fill="#f59e0b" />
            <text x="170" y="16" fill="#f59e0b" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
              Apex V
            </text>

            {/* Height Callout */}
            <text x="160" y="80" fill="#38bdf8" fontSize="10" fontFamily="monospace" textAnchor="end" fontWeight="bold">
              h = {h}m
            </text>

            {/* Base Side Dimension */}
            <line x1="80" y1="160" x2="180" y2="160" stroke="#10b981" strokeWidth="1.5" />
            <text x="130" y="172" fill="#10b981" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
              base side = {side}m
            </text>
          </svg>
        );
      }

      case 'prism':
      case 'triangular_prism': {
        const side = dims.base || 6;
        const length = dims.height || 10;

        return (
          <svg viewBox="0 0 340 180" className="w-full h-full">
            <defs>
              <linearGradient id="prismFace" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Front Triangular Face */}
            <polygon points="90,40 50,135 130,135" fill="url(#prismFace)" stroke="#06b6d4" strokeWidth="2" />

            {/* Back Triangular Face (Oblique) */}
            <polygon points="250,30 210,125 290,125" fill="none" stroke="#64748b" strokeDasharray="3,3" strokeWidth="1" />

            {/* Connecting Extrusion Edges */}
            <line x1="90" y1="40" x2="250" y2="30" stroke="#38bdf8" strokeWidth="2" />
            <line x1="130" y1="135" x2="290" y2="125" stroke="#38bdf8" strokeWidth="2" />
            <line x1="50" y1="135" x2="210" y2="125" stroke="#64748b" strokeDasharray="3,3" strokeWidth="1" />

            {/* Top Slanted Face */}
            <polygon points="90,40 250,30 290,125 130,135" fill="url(#prismFace)" fillOpacity="0.5" stroke="#38bdf8" strokeWidth="1" />

            {/* Dimension Callout: Length */}
            <line x1="130" y1="150" x2="290" y2="140" stroke="#10b981" strokeWidth="1.5" />
            <text x="210" y="160" fill="#10b981" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
              Length L = {length} cm
            </text>

            {/* Dimension Callout: Triangular Side */}
            <text x="90" y="148" fill="#f59e0b" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
              Side s = {side} cm
            </text>
          </svg>
        );
      }

      default: {
        // Universal 3D Coordinate Grid Blueprint
        return (
          <svg viewBox="0 0 340 180" className="w-full h-full">
            <defs>
              <linearGradient id="surfGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* 3D Isometric Axes */}
            <line x1="170" y1="90" x2="270" y2="140" stroke="#ef4444" strokeWidth="2" />
            <text x="275" y="145" fill="#ef4444" fontSize="10" fontFamily="monospace" fontWeight="bold">
              +X
            </text>

            <line x1="170" y1="90" x2="70" y2="140" stroke="#10b981" strokeWidth="2" />
            <text x="55" y="145" fill="#10b981" fontSize="10" fontFamily="monospace" fontWeight="bold">
              +Y
            </text>

            <line x1="170" y1="90" x2="170" y2="20" stroke="#38bdf8" strokeWidth="2" />
            <text x="175" y="20" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">
              +Z
            </text>

            {/* Geometric Contour Rings */}
            <ellipse cx="170" cy="90" rx="75" ry="35" fill="url(#surfGrad)" stroke="#06b6d4" strokeWidth="1.5" />
            <ellipse cx="170" cy="65" rx="50" ry="22" fill="none" stroke="#f59e0b" strokeDasharray="3,3" strokeWidth="1.5" />
            <ellipse cx="170" cy="45" rx="25" ry="11" fill="none" stroke="#ec4899" strokeWidth="1.5" />

            <circle cx="170" cy="90" r="3.5" fill="#ffffff" />
            <text x="170" y="105" fill="#cbd5e1" fontSize="9" fontFamily="monospace" textAnchor="middle">
              Origin (0,0,0)
            </text>

            <text x="170" y="165" fill="#38bdf8" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
              {model.standardEquation}
            </text>
          </svg>
        );
      }
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/30 shadow-xl ${className}`}
    >
      {/* Schematic Top Status Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/90 border-b border-cyan-500/20 text-[11px]">
        <div className="flex items-center gap-1.5 text-cyan-400 font-bold font-mono">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>3D SCHEMATIC BLUEPRINT</span>
        </div>
        {challenge?.difficulty && (
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              challenge.difficulty === 'Board Exam'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : challenge.difficulty === 'HOTS'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
            }`}
          >
            {challenge.difficulty}
          </span>
        )}
      </div>

      {/* SVG Diagram Canvas */}
      <div className="p-2 flex items-center justify-center min-h-[160px] max-h-[200px]">
        {renderSchematic()}
      </div>

      {/* Embedded Given Data Ribbon */}
      {showDetails && challenge && (
        <div className="p-3 bg-slate-950/90 border-t border-slate-800 flex flex-col gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Given Values:
            </span>
            {challenge.givenData.map((item, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-slate-800 text-cyan-300 font-mono text-[11px] border border-slate-700"
              >
                <strong>{item.label}:</strong> {item.value}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-amber-300">
            <span className="font-bold uppercase text-[10px] text-amber-400/90">Objective:</span>
            <span>{challenge.toFind}</span>
          </div>
        </div>
      )}
    </div>
  );
};
