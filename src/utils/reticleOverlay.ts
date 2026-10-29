/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReticleStyle } from '../types';

/**
 * Draws professional camera viewfinder HUD reticles on canvas.
 */
export function drawReticleOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  style: ReticleStyle,
  devicePitchRoll?: { pitch: number; roll: number }
) {
  if (style === 'none') return;

  const cx = width / 2;
  const cy = height / 2;

  ctx.save();

  switch (style) {
    case 'tactical': {
      // Tactical precision crosshairs with mil-dots
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.65)';
      ctx.lineWidth = 1.2;

      // Outer targeting brackets
      const bracketSize = 28;
      const bracketOffset = 64;

      // Top-Left bracket
      ctx.beginPath();
      ctx.moveTo(cx - bracketOffset, cy - bracketOffset + bracketSize);
      ctx.lineTo(cx - bracketOffset, cy - bracketOffset);
      ctx.lineTo(cx - bracketOffset + bracketSize, cy - bracketOffset);
      ctx.stroke();

      // Top-Right bracket
      ctx.beginPath();
      ctx.moveTo(cx + bracketOffset - bracketSize, cy - bracketOffset);
      ctx.lineTo(cx + bracketOffset, cy - bracketOffset);
      ctx.lineTo(cx + bracketOffset, cy - bracketOffset + bracketSize);
      ctx.stroke();

      // Bottom-Left bracket
      ctx.beginPath();
      ctx.moveTo(cx - bracketOffset, cy + bracketOffset - bracketSize);
      ctx.lineTo(cx - bracketOffset, cy + bracketOffset);
      ctx.lineTo(cx - bracketOffset + bracketSize, cy + bracketOffset);
      ctx.stroke();

      // Bottom-Right bracket
      ctx.beginPath();
      ctx.moveTo(cx + bracketOffset - bracketSize, cy + bracketOffset);
      ctx.lineTo(cx + bracketOffset, cy + bracketOffset);
      ctx.lineTo(cx + bracketOffset, cy + bracketOffset - bracketSize);
      ctx.stroke();

      // Central ring & crosshair
      ctx.beginPath();
      ctx.arc(cx, cy, 26, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#22d3ee';
      ctx.fill();

      // Extended crosshair lines with ticks
      const ext = 120;
      ctx.beginPath();
      // Left
      ctx.moveTo(cx - ext, cy);
      ctx.lineTo(cx - 32, cy);
      // Right
      ctx.moveTo(cx + 32, cy);
      ctx.lineTo(cx + ext, cy);
      // Top
      ctx.moveTo(cx, cy - ext);
      ctx.lineTo(cx, cy - 32);
      // Bottom
      ctx.moveTo(cx, cy + 32);
      ctx.lineTo(cx, cy + ext);
      ctx.stroke();

      // Mil-dots
      for (let d = 45; d <= ext; d += 25) {
        // Horizontal ticks
        ctx.beginPath();
        ctx.moveTo(cx - d, cy - 4);
        ctx.lineTo(cx - d, cy + 4);
        ctx.moveTo(cx + d, cy - 4);
        ctx.lineTo(cx + d, cy + 4);
        // Vertical ticks
        ctx.moveTo(cx - 4, cy - d);
        ctx.lineTo(cx + 4, cy - d);
        ctx.moveTo(cx - 4, cy + d);
        ctx.lineTo(cx + 4, cy + d);
        ctx.stroke();
      }

      // Readout
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(6, 182, 212, 0.8)';
      ctx.fillText('RETICLE: TACTICAL MIL-DOT', cx - bracketOffset, cy - bracketOffset - 6);
      ctx.fillText('TARGET LOCK: TRACKING', cx - bracketOffset, cy + bracketOffset + 14);
      break;
    }

    case 'aviation': {
      // Aviation / Flight HUD with Artificial Horizon & Compass Ladder
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1.5;

      const roll = (devicePitchRoll?.roll || 0) * (Math.PI / 180);
      const pitch = devicePitchRoll?.pitch || 0;

      // Roll arc on top
      ctx.beginPath();
      ctx.arc(cx, cy, 140, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();

      // Aircraft symbol at center (V + wings)
      ctx.beginPath();
      ctx.moveTo(cx - 36, cy);
      ctx.lineTo(cx - 14, cy);
      ctx.lineTo(cx, cy + 8);
      ctx.lineTo(cx + 14, cy);
      ctx.lineTo(cx + 36, cy);
      ctx.stroke();

      // Pitch Ladder Lines
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(roll);

      const ladderOffsets = [-60, -30, 30, 60];
      ladderOffsets.forEach((offset, idx) => {
        const deg = (idx < 2 ? (2 - idx) * 10 : (idx - 1) * -10) + pitch;
        const lineW = 44;
        ctx.beginPath();
        ctx.moveTo(-lineW, offset);
        ctx.lineTo(lineW, offset);
        ctx.stroke();

        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = '#34d399';
        ctx.fillText(`${deg > 0 ? '+' : ''}${deg}°`, lineW + 6, offset + 3);
        ctx.fillText(`${deg > 0 ? '+' : ''}${deg}°`, -lineW - 26, offset + 3);
      });
      ctx.restore();

      // Digital Telemetry Top & Bottom
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = '#34d399';
      ctx.fillText('PITCH: 0.0° · ROLL: 0.0°', 24, 45);
      ctx.fillText('HEADING: 358° N [MAGNETIC]', 24, 60);
      break;
    }

    case 'golden-ratio': {
      // Golden Ratio Fibonacci Logarithmic Spiral Overlay
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)';
      ctx.lineWidth = 1.5;

      // Draw Golden Rectangles & logarithmic spiral
      const phi = 1.61803398875;
      let rw = Math.min(width, height * phi) * 0.75;
      let rh = rw / phi;
      let rx = cx - rw / 2;
      let ry = cy - rh / 2;

      ctx.strokeRect(rx, ry, rw, rh);

      // Recursive subdivisions for spiral
      const iterations = 6;
      let currentX = rx;
      let currentY = ry;
      let currentW = rw;
      let currentH = rh;

      ctx.beginPath();
      for (let i = 0; i < iterations; i++) {
        const side = Math.min(currentW, currentH);
        if (i % 4 === 0) {
          ctx.strokeRect(currentX, currentY, side, side);
          currentX += side;
          currentW -= side;
        } else if (i % 4 === 1) {
          ctx.strokeRect(currentX, currentY, side, side);
          currentY += side;
          currentH -= side;
        } else if (i % 4 === 2) {
          ctx.strokeRect(currentX + currentW - side, currentY, side, side);
          currentW -= side;
        } else {
          ctx.strokeRect(currentX, currentY + currentH - side, side, side);
          currentH -= side;
        }
      }

      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = '#fbbf24';
      ctx.fillText('GOLDEN RATIO φ = 1.61803... (EUCLID EXTREME & MEAN RATIO)', rx + 6, ry - 8);
      break;
    }

    case 'rule-of-thirds': {
      // Rule of Thirds grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);

      const x1 = width / 3;
      const x2 = (width * 2) / 3;
      const y1 = height / 3;
      const y2 = (height * 2) / 3;

      // Vertical lines
      ctx.beginPath();
      ctx.moveTo(x1, 0);
      ctx.lineTo(x1, height);
      ctx.moveTo(x2, 0);
      ctx.lineTo(x2, height);
      // Horizontal lines
      ctx.moveTo(0, y1);
      ctx.lineTo(width, y1);
      ctx.moveTo(0, y2);
      ctx.lineTo(width, y2);
      ctx.stroke();
      ctx.setLineDash([]);

      // 4 Power Intersections
      const powerPoints = [
        { x: x1, y: y1 },
        { x: x2, y: y1 },
        { x: x1, y: y2 },
        { x: x2, y: y2 },
      ];
      ctx.fillStyle = 'rgba(6, 182, 212, 0.7)';
      powerPoints.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#22d3ee';
        ctx.stroke();
      });

      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fillText('RULE OF THIRDS (3×3 FRAMING)', 20, 30);
      break;
    }
  }

  ctx.restore();
}
