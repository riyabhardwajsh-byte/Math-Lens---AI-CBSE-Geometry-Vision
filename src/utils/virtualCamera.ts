/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type VirtualBenchScene = 'wheel' | 'bridge' | 'phone' | 'ramp' | 'tree';

export interface VirtualBenchConfig {
  id: VirtualBenchScene;
  title: string;
  subtitle: string;
  targetMode: 'circle' | 'parabola' | 'rectangle' | 'slope';
}

export const VIRTUAL_BENCH_SCENES: VirtualBenchConfig[] = [
  {
    id: 'wheel',
    title: 'Kinetic Bicycle Wheel',
    subtitle: 'Dynamic rotating rim with spokes & tire cross-section',
    targetMode: 'circle',
  },
  {
    id: 'bridge',
    title: 'Suspension Bridge Arch',
    subtitle: 'Parabolic cable geometry with vertical stays & roadway',
    targetMode: 'parabola',
  },
  {
    id: 'phone',
    title: 'Mobile Device Screen',
    subtitle: 'Aspect ratio 19.5:9 flagship screen on lab desk',
    targetMode: 'rectangle',
  },
  {
    id: 'ramp',
    title: 'Inclined Physics Ramp',
    subtitle: 'Standard elevation vector with rolling spherical mass',
    targetMode: 'slope',
  },
  {
    id: 'tree',
    title: 'Surveyor Field Tower',
    subtitle: 'Class 10 Trigonometry height & distance telemetry',
    targetMode: 'slope',
  },
];

/**
 * Renders an animated realistic virtual camera feed onto a target canvas.
 */
export function renderVirtualCameraScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scene: VirtualBenchScene,
  timeMs: number
) {
  const t = timeMs * 0.001;

  ctx.save();

  switch (scene) {
    case 'wheel': {
      // Dark urban tarmac background
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#0a0f1d');
      grad.addColorStop(0.7, '#111827');
      grad.addColorStop(1, '#030712');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Floor grid perspective
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
      ctx.lineWidth = 1;
      const groundY = height * 0.85;
      for (let i = 0; i <= width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, groundY);
        ctx.lineTo(width / 2 + (i - width / 2) * 2.5, height);
        ctx.stroke();
      }

      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.32;

      // Tire Outer Tread
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 16;
      ctx.beginPath();
      ctx.arc(cx, cy, radius + 8, 0, Math.PI * 2);
      ctx.stroke();

      // Rim
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Hub
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.arc(cx, cy, 22, 0, Math.PI * 2);
      ctx.fill();

      // Rotating Spokes
      const angleOffset = t * 1.5;
      const spokeCount = 24;
      ctx.strokeStyle = 'rgba(203, 213, 225, 0.7)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < spokeCount; i++) {
        const theta = angleOffset + (i * 2 * Math.PI) / spokeCount;
        ctx.beginPath();
        ctx.moveTo(cx + 20 * Math.cos(theta), cy + 20 * Math.sin(theta));
        ctx.lineTo(cx + radius * Math.cos(theta), cy + radius * Math.sin(theta));
        ctx.stroke();
      }

      // Valve Stem
      const valveTheta = angleOffset;
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx + (radius - 4) * Math.cos(valveTheta), cy + (radius - 4) * Math.sin(valveTheta));
      ctx.lineTo(cx + (radius - 22) * Math.cos(valveTheta), cy + (radius - 22) * Math.sin(valveTheta));
      ctx.stroke();
      break;
    }

    case 'bridge': {
      // Twilight sky
      const sky = ctx.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0, '#0c1a30');
      sky.addColorStop(0.5, '#1e293b');
      sky.addColorStop(1, '#064e3b');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, width, height);

      // Water body
      const waterY = height * 0.72;
      ctx.fillStyle = '#061325';
      ctx.fillRect(0, waterY, width, height - waterY);

      // Bridge Deck
      const deckY = height * 0.62;
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, deckY, width, 18);

      // Bridge Towers
      const tw1 = width * 0.22;
      const tw2 = width * 0.78;
      const towerTop = height * 0.18;
      ctx.fillStyle = '#64748b';
      ctx.fillRect(tw1 - 12, towerTop, 24, deckY - towerTop + 30);
      ctx.fillRect(tw2 - 12, towerTop, 24, deckY - towerTop + 30);

      // Main Parabolic Suspension Cable
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(0, deckY);
      ctx.lineTo(tw1, towerTop);
      // Parabola between towers
      const span = tw2 - tw1;
      for (let x = tw1; x <= tw2; x += 4) {
        const nx = (x - (tw1 + tw2) / 2) / (span / 2); // -1 to 1
        const py = towerTop + (deckY - 14 - towerTop) * (nx * nx);
        ctx.lineTo(x, py);
      }
      ctx.lineTo(width, deckY);
      ctx.stroke();

      // Vertical Hanger Cables
      ctx.strokeStyle = 'rgba(251, 146, 60, 0.45)';
      ctx.lineWidth = 1;
      for (let x = tw1 + 16; x < tw2; x += 20) {
        const nx = (x - (tw1 + tw2) / 2) / (span / 2);
        const py = towerTop + (deckY - 14 - towerTop) * (nx * nx);
        ctx.beginPath();
        ctx.moveTo(x, py);
        ctx.lineTo(x, deckY);
        ctx.stroke();
      }

      // Moving vehicle on bridge
      const carX = ((t * 80) % (width + 60)) - 30;
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(carX, deckY - 8, 20, 8);
      break;
    }

    case 'phone': {
      // Tech desk background
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);

      // Desk mat texture
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(40, 30, width - 80, height - 60);

      // Phone Body
      const pw = Math.min(260, width * 0.38);
      const ph = pw * 2.1;
      const px = width / 2 - pw / 2;
      const py = height / 2 - ph / 2;

      // Drop shadow
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.beginPath();
      ctx.roundRect(px + 6, py + 10, pw, ph, 26);
      ctx.fill();

      // Phone Bezel
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(px, py, pw, ph, 26);
      ctx.fill();
      ctx.stroke();

      // OLED Screen
      const margin = 8;
      const sw = pw - margin * 2;
      const sh = ph - margin * 2;
      const sx = px + margin;
      const sy = py + margin;

      const screenGrad = ctx.createLinearGradient(sx, sy, sx + sw, sy + sh);
      screenGrad.addColorStop(0, '#1e1b4b');
      screenGrad.addColorStop(0.5, '#0f172a');
      screenGrad.addColorStop(1, '#064e3b');
      ctx.fillStyle = screenGrad;
      ctx.beginPath();
      ctx.roundRect(sx, sy, sw, sh, 20);
      ctx.fill();

      // Dynamic Island / Camera Punch Hole
      ctx.fillStyle = '#020617';
      ctx.beginPath();
      ctx.roundRect(width / 2 - 20, sy + 6, 40, 12, 6);
      ctx.fill();

      // Screen App Grid Mockup
      ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 3; c++) {
          const ix = sx + 20 + c * ((sw - 40) / 2.5);
          const iy = sy + 40 + r * 38;
          ctx.beginPath();
          ctx.roundRect(ix, iy, 24, 24, 6);
          ctx.fill();
        }
      }
      break;
    }

    case 'ramp': {
      // Lab background
      ctx.fillStyle = '#050b14';
      ctx.fillRect(0, 0, width, height);

      // Floor
      const fy = height * 0.78;
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, fy, width, height - fy);

      // Triangular Ramp
      const rx1 = width * 0.18;
      const ry1 = fy;
      const rx2 = width * 0.78;
      const ry2 = fy;
      const rx3 = width * 0.78;
      const ry3 = height * 0.32;

      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.moveTo(rx1, ry1);
      ctx.lineTo(rx2, ry2);
      ctx.lineTo(rx3, ry3);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Rolling ball down incline
      const cycle = (t * 0.8) % 2; // 0 to 2
      const progress = cycle < 1.4 ? cycle / 1.4 : 1;
      const bx = rx3 + (rx1 - rx3) * progress;
      const by = ry3 + (ry1 - ry3) * progress;

      // Ball shadow & ball
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(bx - 10, by - 10, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#e0f2fe';
      ctx.lineWidth = 2;
      ctx.stroke();
      break;
    }

    case 'tree': {
      // Landscape field
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#0c2340');
      skyGrad.addColorStop(0.6, '#1e3a5f');
      skyGrad.addColorStop(1, '#064e3b');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      const groundY = height * 0.82;
      ctx.fillStyle = '#064e3b';
      ctx.fillRect(0, groundY, width, height - groundY);

      // Tall pine tree
      const tx = width * 0.65;
      // Trunk
      ctx.fillStyle = '#78350f';
      ctx.fillRect(tx - 10, height * 0.35, 20, groundY - height * 0.35);

      // Foliage tiers
      ctx.fillStyle = '#10b981';
      for (let i = 0; i < 4; i++) {
        const topY = height * 0.15 + i * 40;
        const botY = topY + 70;
        const spread = 40 + i * 22;
        ctx.beginPath();
        ctx.moveTo(tx, topY);
        ctx.lineTo(tx + spread, botY);
        ctx.lineTo(tx - spread, botY);
        ctx.closePath();
        ctx.fill();
      }

      // Surveyor Theodolite on left
      const sx = width * 0.22;
      const sy = groundY - 50;
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      // Tripod
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx - 20, groundY);
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + 20, groundY);
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx, groundY);
      ctx.stroke();

      // Instrument
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(sx - 12, sy - 14, 24, 14);

      // Elevation Sight Line
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(sx, sy - 8);
      ctx.lineTo(tx, height * 0.15);
      ctx.stroke();
      ctx.setLineDash([]);
      break;
    }
  }

  // Camera Status Watermark
  ctx.font = 'bold 9px "JetBrains Mono", monospace';
  ctx.fillStyle = 'rgba(56, 189, 248, 0.7)';
  ctx.fillText(`BENCH SIMULATION: ${scene.toUpperCase()} · 60 FPS`, 20, height - 18);

  ctx.restore();
}
