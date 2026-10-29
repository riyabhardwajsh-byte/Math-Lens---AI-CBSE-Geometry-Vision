/**
 * Generates and exports the self-contained single-file HTML document
 * containing the full Math Lens interactive web app:
 * - 8 Geometric shape overlays (Circle, Square, Rectangle, Triangle, Rhombus, Parallelogram, Parabola, Slope)
 * - Everyday objects (Phone, Tab, Wheel, Tree, Toys/Kite, Arch Bridge, Skate Ramp)
 * - "AI Voice Tutor" 10-second SpeechSynthesis audio lessons
 * - "Before vs. After: Architecture Comparison" (Draggable split-screen curtain + futuristic wireframe CAD blueprint)
 * - CBSE Class 9 & 10 syllabus mapping & interactive metric calculations
 */
import standaloneHtml from '../../math_lens.html?raw';

export function generateStandaloneHTML(): string {
  return standaloneHtml;
}

export function downloadStandaloneHTML(filename = 'math_lens.html') {
  const content = generateStandaloneHTML();
  const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
