import { Mode, ObjectType } from '../types';

export interface VoiceExplanationContext {
  objectType?: ObjectType;
  mode: Mode;
  metrics?: {
    radius?: number;
    circumference?: number;
    area?: number;
    perimeter?: number;
    side?: number;
    width?: number;
    height?: number;
    diagonal?: number;
    angleDeg?: number;
    slope?: number;
    vertexX?: number;
    vertexY?: number;
    a?: number;
    b?: number;
    c?: number;
    hypotenuse?: number;
    baseRun?: number;
    d1?: number;
    d2?: number;
    aspectRatio?: string;
  };
}

export interface VoiceTutorScript {
  title: string;
  subtitle: string;
  text: string;
  cbseRef: string;
  durationEstSec: number;
}

/**
 * Static baseline scripts for every everyday object and geometric shape.
 */
export const OBJECT_SCRIPTS: Record<string, VoiceTutorScript> = {
  bridge: {
    title: 'Parabolic Arch Bridge',
    subtitle: 'CBSE Class 10: Polynomials & Quadratic Arches',
    text: "This is a parabolic arch. Notice how the quadratic coefficient 'a' is negative, causing the curve to open downwards and transfer immense compression loads safely to the bridge abutments. The highest point is the vertex.",
    cbseRef: 'NCERT Class 10 Ch 2 (Polynomials) & Ch 4 (Quadratic Equations)',
    durationEstSec: 10,
  },
  wheel: {
    title: 'Bicycle Wheel Rim & Spoke Hub',
    subtitle: 'CBSE Class 10: Circles & Areas Related to Circles',
    text: "This is a circular bicycle wheel. Every point on the rim is equidistant from the hub at radius 'r'. For every complete rotation of 360 degrees, the bicycle moves forward by exactly its circumference, 2 pi r.",
    cbseRef: 'NCERT Class 10 Ch 10 (Circles) & Ch 12 (Areas Related to Circles)',
    durationEstSec: 10,
  },
  phone: {
    title: 'Smartphone Rectangular Display',
    subtitle: 'CBSE Class 9: Quadrilaterals & Pythagoras Theorem',
    text: "This is a rectangular smartphone. Notice the four right-angled vertices and opposite parallel edges. By applying the Pythagorean theorem, the screen's diagonal is the square root of width squared plus height squared.",
    cbseRef: 'NCERT Class 9 Ch 8 (Quadrilaterals) & Class 10 Ch 6 (Triangles)',
    durationEstSec: 10,
  },
  tab: {
    title: 'Tablet Screen Geometry',
    subtitle: 'CBSE Class 9: Mensuration & Surface Areas',
    text: "This is a tablet display, forming an exact rectangle. Its screen aspect ratio defines the balance between width and height, giving a total viewing surface area equal to width multiplied by height.",
    cbseRef: 'NCERT Class 9 Ch 8 (Quadrilaterals) & Mensuration',
    durationEstSec: 9,
  },
  tree: {
    title: 'Tall Cedar Tree Height Estimation',
    subtitle: 'CBSE Class 10: Applications of Trigonometry',
    text: "Here we apply trigonometry to find the tree's height without climbing! By measuring the horizontal distance and the angle of elevation theta, tangent of theta equals opposite over adjacent, giving the exact tree height.",
    cbseRef: 'NCERT Class 10 Ch 9 (Some Applications of Trigonometry)',
    durationEstSec: 11,
  },
  toy: {
    title: 'Geometric Toy Blocks & Kite',
    subtitle: 'CBSE Class 9: Quadrilaterals & Heron\'s Formula',
    text: "These toys showcase classic quadrilaterals and triangles. The diamond kite forms a rhombus where the diagonals intersect at exactly 90 degrees, splitting it into four congruent right triangles.",
    cbseRef: 'NCERT Class 9 Ch 8 (Quadrilaterals) & Ch 12 (Heron\'s Formula)',
    durationEstSec: 10,
  },
  ramp: {
    title: 'Skatepark Ramp Wedge',
    subtitle: 'CBSE Class 10: Trigonometry & Inclined Planes',
    text: "This skate ramp forms an inclined plane with a right-angled triangle profile. The slope gradient 'm' equals tangent of theta, determining both skater acceleration and the elevation gain over horizontal run.",
    cbseRef: 'NCERT Class 10 Ch 8 & Ch 9 (Introduction & Applications of Trigonometry)',
    durationEstSec: 10,
  },
  'ferris-wheel': {
    title: 'Giant Observation Ferris Wheel',
    subtitle: 'CBSE Class 10: Circles & Areas Related to Circles',
    text: "This giant observation wheel demonstrates circular symmetry. Its passengers revolve at a constant radius 'r', traversing a sector arc length equal to theta over 360 times 2 pi r for each cabin interval.",
    cbseRef: 'NCERT Class 10 Ch 10 (Circles) & Ch 12 (Areas Related to Circles)',
    durationEstSec: 10,
  },
  'satellite-dish': {
    title: 'Deep Space Satellite Parabolic Dish',
    subtitle: 'CBSE Class 10: Quadratic Polynomials & Focal Geometry',
    text: "This parabolic reflector dish follows y = a x squared. Parallel incoming radio waves bounce off the curved dish and converge precisely at the focal point, located at distance 1 over 4a from the vertex.",
    cbseRef: 'NCERT Class 10 Ch 2 (Polynomials) & Ch 4 (Quadratic Equations)',
    durationEstSec: 11,
  },
  'solar-panel': {
    title: 'Solar PV Module Array',
    subtitle: 'CBSE Class 9: Quadrilaterals & Surface Areas',
    text: "This photovoltaic array forms a large rectangle. Its electrical energy output is directly proportional to its surface area, which is width times height, while its diagonal wiring follows the Pythagorean theorem.",
    cbseRef: 'NCERT Class 9 Ch 8 (Quadrilaterals) & Class 10 Mensuration',
    durationEstSec: 10,
  },
  'roof-truss': {
    title: 'Triangular Architectural Roof Truss',
    subtitle: 'CBSE Class 9: Heron\'s Formula & Class 10: Triangles',
    text: "Triangles are the only rigid geometric polygon that cannot deform without breaking a side. Engineers use Heron's formula to calculate truss panel areas directly from side lengths without needing perpendicular altitudes.",
    cbseRef: 'NCERT Class 9 Ch 12 (Heron\'s Formula) & Class 10 Ch 6 (Triangles)',
    durationEstSec: 11,
  },
  'wind-turbine': {
    title: 'Aerodynamic Wind Turbine Rotor',
    subtitle: 'CBSE Class 10: Circles & Swept Area Power',
    text: "As these turbine blades rotate, they sweep out a complete circular area equal to pi r squared. The power captured from the wind is directly proportional to the square of blade radius 'r'.",
    cbseRef: 'NCERT Class 10 Ch 10 (Circles) & Ch 12 (Areas Related to Circles)',
    durationEstSec: 10,
  },
  'suspension-cable': {
    title: 'Suspension Bridge Catenary Cable',
    subtitle: 'CBSE Class 10: Quadratic Equations & Parabolic Sag',
    text: "The main suspension cable sags in a parabolic curve modeled by y = a x squared plus c. The lowest point is the vertex, where horizontal tension reaches its maximum equilibrium.",
    cbseRef: 'NCERT Class 10 Ch 4 (Quadratic Equations)',
    durationEstSec: 10,
  },
  'diamond-kite': {
    title: 'High-Altitude Diamond Stunt Kite',
    subtitle: 'CBSE Class 9: Quadrilaterals & Rhombus Properties',
    text: "This aerodynamic kite is a true rhombus. Its perpendicular diagonals d1 and d2 bisect each other at exactly 90 degrees, and its total sail area is calculated as half times d1 times d2.",
    cbseRef: 'NCERT Class 9 Ch 8 (Quadrilaterals)',
    durationEstSec: 10,
  },
  'conveyor-ramp': {
    title: 'Industrial Cargo Conveyor Incline',
    subtitle: 'CBSE Class 10: Some Applications of Trigonometry',
    text: "This conveyor ramp forms a right-angled triangle. The slope gradient 'm' equals tangent of theta, defining the rise over run ratio that mechanical gearboxes must overcome against gravitational load.",
    cbseRef: 'NCERT Class 10 Ch 9 (Applications of Trigonometry)',
    durationEstSec: 10,
  },
  'sports-pitch': {
    title: 'Stadium Sports Pitch Projection',
    subtitle: 'CBSE Class 9: Quadrilaterals & Parallelograms',
    text: "Viewed from an elevated camera angle, this regulation sports pitch projects as a parallelogram. Its area remains base times perpendicular height, with opposite boundary touchlines strictly parallel.",
    cbseRef: 'NCERT Class 9 Ch 8 (Quadrilaterals) & Areas of Parallelograms',
    durationEstSec: 10,
  },
  'chess-board': {
    title: 'Tournament Chessboard Grid Matrix',
    subtitle: 'CBSE Class 9: Quadrilaterals & Square Properties',
    text: "A tournament chessboard is an equilateral and equiangular square with 64 congruent sub-squares. Its diagonal equals side length times the square root of 2, exhibiting complete 90-degree rotational symmetry.",
    cbseRef: 'NCERT Class 9 Ch 8 (Quadrilaterals)',
    durationEstSec: 10,
  },
};

export const SHAPE_SCRIPTS: Record<Mode, VoiceTutorScript> = {
  circle: {
    title: 'Circle Geometry',
    subtitle: 'CBSE Class 10: Circles (Ch 10)',
    text: "A circle is the set of all points at a fixed radius 'r' from center (h, k). According to CBSE Theorem 10.1, the tangent at any point of a circle is strictly perpendicular to the radius through the point of contact.",
    cbseRef: 'NCERT Class 10 Ch 10 (Circles)',
    durationEstSec: 10,
  },
  square: {
    title: 'Square Properties',
    subtitle: 'CBSE Class 9: Quadrilaterals (Ch 8)',
    text: "A square is a regular quadrilateral with four equal sides and four right angles. Its diagonals are equal, bisect each other perpendicularly at 90 degrees, and each diagonal measures 's' times the square root of 2.",
    cbseRef: 'NCERT Class 9 Ch 8 (Quadrilaterals)',
    durationEstSec: 10,
  },
  rectangle: {
    title: 'Rectangle Properties',
    subtitle: 'CBSE Class 9: Quadrilaterals (Ch 8)',
    text: "A rectangle is an equiangular parallelogram where each interior angle is 90 degrees. Its opposite sides are equal, its diagonals are equal in length, and its area is width times height.",
    cbseRef: 'NCERT Class 9 Ch 8 (Quadrilaterals)',
    durationEstSec: 9,
  },
  triangle: {
    title: 'Triangle & Heron\'s Formula',
    subtitle: 'CBSE Class 9: Heron\'s Formula (Ch 12)',
    text: "A triangle is formed by three line segments. With Heron's formula, you can calculate the exact area from side lengths 'a', 'b', and 'c' using the semi-perimeter 's', without ever needing to measure perpendicular height.",
    cbseRef: 'NCERT Class 9 Ch 12 (Heron\'s Formula)',
    durationEstSec: 10,
  },
  rhombus: {
    title: 'Rhombus & Perpendicular Diagonals',
    subtitle: 'CBSE Class 9: Quadrilaterals (Ch 8)',
    text: "A rhombus has four equal sides. A key property in CBSE geometry is that its diagonals bisect each other at right angles, and its area is calculated as half the product of its two diagonals.",
    cbseRef: 'NCERT Class 9 Ch 8 (Quadrilaterals)',
    durationEstSec: 10,
  },
  parallelogram: {
    title: 'Parallelogram Mechanics',
    subtitle: 'CBSE Class 9: Quadrilaterals (Ch 8)',
    text: "In a parallelogram, opposite sides are parallel and congruent, and opposite angles are equal. The area equals base times perpendicular height, regardless of how far the shape skews.",
    cbseRef: 'NCERT Class 9 Ch 8 (Quadrilaterals)',
    durationEstSec: 9,
  },
  parabola: {
    title: 'Parabolic Curves & Quadratics',
    subtitle: 'CBSE Class 10: Polynomials & Quadratic Equations',
    text: "This curve represents the quadratic equation y = a x squared plus b x plus c. The coefficient 'a' determines how wide the parabola opens, and its turning point is the vertex.",
    cbseRef: 'NCERT Class 10 Ch 2 (Polynomials) & Ch 4 (Quadratics)',
    durationEstSec: 9,
  },
  slope: {
    title: 'Slope, Vectors & Trigonometry',
    subtitle: 'CBSE Class 10: Heights & Distances',
    text: "The slope indicates the steepness of a line. In CBSE trigonometry, the slope gradient 'm' is defined as tangent of theta, which represents vertical rise divided by horizontal run.",
    cbseRef: 'NCERT Class 10 Ch 8 & Ch 9 (Trigonometry)',
    durationEstSec: 9,
  },
};

/**
 * Generates an explanation enriched with current real-time measurements.
 */
export function getLiveExplanation(ctx: VoiceExplanationContext): VoiceTutorScript {
  const { objectType, mode, metrics } = ctx;

  // 1. If an everyday object is active and relevant, build tailored dynamic object explanation
  if (objectType && OBJECT_SCRIPTS[objectType]) {
    const base = OBJECT_SCRIPTS[objectType];
    let liveText = base.text;

    if (objectType === 'wheel' && metrics?.radius) {
      liveText = `This bicycle wheel has a radius of ${metrics.radius.toFixed(2)} meters. Its circumference is ${metrics.circumference?.toFixed(2) || (2 * Math.PI * metrics.radius).toFixed(2)} meters, meaning with each single turn the wheel rolls exactly that far forward!`;
    } else if (objectType === 'bridge' && metrics?.vertexY !== undefined) {
      liveText = `This parabolic arch reaches its vertex apex at ${metrics.vertexY.toFixed(2)} meters with a curvature coefficient of ${metrics.a?.toFixed(3) || '-0.015'}. The downward curve efficiently directs the bridge load into the banks.`;
    } else if (objectType === 'tree' && metrics?.angleDeg && metrics?.height) {
      liveText = `Viewing the cedar tree top at an elevation angle of ${metrics.angleDeg.toFixed(1)} degrees gives a calculated height of ${metrics.height.toFixed(2)} meters using tangent of theta times distance!`;
    } else if (objectType === 'phone' && metrics?.width && metrics?.height) {
      liveText = `This phone display measures ${metrics.width.toFixed(1)} by ${metrics.height.toFixed(1)} units, giving a diagonal screen length of ${metrics.diagonal?.toFixed(2) || '10'} units using the Pythagorean theorem.`;
    } else if (objectType === 'tab' && metrics?.area) {
      liveText = `This tablet screen has a computed display area of ${metrics.area.toFixed(2)} square units and an aspect ratio of ${metrics.aspectRatio || '4 to 3'}.`;
    } else if (objectType === 'ramp' && metrics?.angleDeg) {
      liveText = `This skate ramp incline is set at ${Math.abs(metrics.angleDeg).toFixed(1)} degrees. The slope gradient is tangent of theta, yielding a value of ${Math.abs(metrics.slope || 0.58).toFixed(2)}.`;
    } else if (objectType === 'toy' && metrics?.d1 && metrics?.d2) {
      liveText = `This diamond kite rhombus has perpendicular diagonals of ${metrics.d1.toFixed(1)} and ${metrics.d2.toFixed(1)} units, producing an area of ${(0.5 * metrics.d1 * metrics.d2).toFixed(2)} square units.`;
    } else if (objectType === 'ferris-wheel' && metrics?.radius) {
      liveText = `This observation wheel has a radius of ${metrics.radius.toFixed(2)} meters and a circumference of ${metrics.circumference?.toFixed(2) || (2 * Math.PI * metrics.radius).toFixed(2)} meters. Cabins travel along a 45-degree sector arc length of ${(Math.PI * metrics.radius / 4).toFixed(2)} meters!`;
    } else if (objectType === 'satellite-dish' && metrics?.a !== undefined) {
      liveText = `This satellite dish parabola has curvature coefficient a = ${metrics.a.toFixed(3)}. The receiver horn at focus is situated exactly 1 over 4a from the dish vertex!`;
    } else if (objectType === 'solar-panel' && metrics?.width && metrics?.height) {
      liveText = `This solar panel array measures ${metrics.width.toFixed(1)} by ${metrics.height.toFixed(1)} meters, providing an active capture area of ${(metrics.area || metrics.width * metrics.height).toFixed(2)} square meters!`;
    } else if (objectType === 'roof-truss' && metrics?.area) {
      liveText = `This triangular roof truss distributes architectural loads across rigid steel members. By Heron's formula, its web area is ${metrics.area.toFixed(2)} square meters!`;
    } else if (objectType === 'wind-turbine' && metrics?.radius) {
      liveText = `These turbine blades span a radius of ${metrics.radius.toFixed(1)} meters, sweeping an aerodynamic capture disk area of ${(Math.PI * Math.pow(metrics.radius, 2)).toFixed(2)} square meters!`;
    } else if (objectType === 'suspension-cable' && metrics?.vertexY !== undefined) {
      liveText = `This suspension bridge main cable sags in a quadratic curve reaching its lowest vertex at ${metrics.vertexY.toFixed(2)} meters, transferring immense deck tension directly into anchor bedrock!`;
    } else if (objectType === 'diamond-kite' && metrics?.d1 && metrics?.d2) {
      liveText = `This diamond stunt kite has orthogonal diagonals of ${metrics.d1.toFixed(1)} and ${metrics.d2.toFixed(1)} meters, giving a total aerodynamic sail area of ${(0.5 * metrics.d1 * metrics.d2).toFixed(2)} square meters!`;
    } else if (objectType === 'conveyor-ramp' && metrics?.angleDeg) {
      liveText = `This industrial conveyor inclines at ${Math.abs(metrics.angleDeg).toFixed(1)} degrees. The trigonometric gradient m = tan(theta) equals ${Math.abs(metrics.slope || 0.42).toFixed(2)}!`;
    } else if (objectType === 'sports-pitch' && metrics?.width && metrics?.height) {
      liveText = `Under camera perspective, this sports pitch forms an affine parallelogram with base ${metrics.width.toFixed(1)} meters and height ${metrics.height.toFixed(1)} meters, yielding an area of ${(metrics.area || metrics.width * metrics.height).toFixed(2)} square units!`;
    } else if (objectType === 'chess-board' && metrics?.side) {
      liveText = `This tournament chessboard is a regular square with side length ${metrics.side.toFixed(1)} meters, enclosing 64 cell squares and a diagonal of ${(metrics.side * Math.SQRT2).toFixed(2)} meters!`;
    }

    return {
      title: base.title,
      subtitle: base.subtitle,
      text: liveText,
      cbseRef: base.cbseRef,
      durationEstSec: 10,
    };
  }

  // 2. Otherwise use the active geometric shape
  const shapeBase = SHAPE_SCRIPTS[mode];
  let liveText = shapeBase.text;

  if (mode === 'circle' && metrics?.radius) {
    liveText = `This circle has a radius of ${metrics.radius.toFixed(2)} units and an enclosed area of ${metrics.area?.toFixed(2) || (Math.PI * metrics.radius * metrics.radius).toFixed(2)} square units. Any tangent line meets the radius at exactly 90 degrees.`;
  } else if (mode === 'square' && metrics?.side) {
    liveText = `This square has four equal sides of ${metrics.side.toFixed(2)} units. Its perimeter is ${metrics.perimeter?.toFixed(2)} units, area is ${metrics.area?.toFixed(2)} square units, and diagonal is ${(metrics.side * Math.SQRT2).toFixed(2)} units.`;
  } else if (mode === 'rectangle' && metrics?.width && metrics?.height) {
    liveText = `This rectangle measures ${metrics.width.toFixed(2)} wide by ${metrics.height.toFixed(2)} high, with an area of ${metrics.area?.toFixed(2)} square units and perimeter of ${metrics.perimeter?.toFixed(2)} units.`;
  } else if (mode === 'triangle' && metrics?.area) {
    liveText = `Using Heron's formula on this triangle gives an area of ${metrics.area.toFixed(2)} square units and semi-perimeter of ${( (metrics.perimeter || 10) / 2 ).toFixed(2)} units.`;
  } else if (mode === 'rhombus' && metrics?.d1 && metrics?.d2) {
    liveText = `This rhombus has diagonals of ${metrics.d1.toFixed(2)} and ${metrics.d2.toFixed(2)} units intersecting at 90 degrees, giving an area of ${metrics.area?.toFixed(2)} square units.`;
  } else if (mode === 'parallelogram' && metrics?.width && metrics?.height) {
    liveText = `This parallelogram has a base of ${metrics.width.toFixed(2)} units and perpendicular altitude of ${metrics.height.toFixed(2)} units, yielding an area of ${metrics.area?.toFixed(2)} square units.`;
  } else if (mode === 'parabola' && metrics?.a !== undefined) {
    liveText = `This parabola follows y = ${metrics.a.toFixed(3)} x squared, with vertex at (${metrics.vertexX?.toFixed(1) || '0'}, ${metrics.vertexY?.toFixed(1) || '0'}). Notice how coefficient 'a' determines its curve curvature!`;
  } else if (mode === 'slope' && metrics?.angleDeg !== undefined) {
    liveText = `This slope forms an angle of ${Math.abs(metrics.angleDeg).toFixed(1)} degrees with the horizon, producing a trigonometric tangent gradient of ${Math.abs(metrics.slope || 0).toFixed(2)}.`;
  }

  return {
    title: shapeBase.title,
    subtitle: shapeBase.subtitle,
    text: liveText,
    cbseRef: shapeBase.cbseRef,
    durationEstSec: 10,
  };
}

/**
 * Audio synthesis helper wrapper around the Web Speech API.
 */
class SpeechSynthesizer {
  private utterance: SpeechSynthesisUtterance | null = null;
  private currentVoice: SpeechSynthesisVoice | null = null;
  private isSupported: boolean = typeof window !== 'undefined' && 'speechSynthesis' in window;

  constructor() {
    if (this.isSupported) {
      // Pre-select best English voice when voices load
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          this.pickBestVoice();
        };
      }
      this.pickBestVoice();
    }
  }

  private pickBestVoice(): void {
    if (!this.isSupported) return;
    const voices = window.speechSynthesis.getVoices();
    // Prioritize natural sounding English voices
    const preferred = voices.find(
      (v) =>
        (v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Karen')))
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (preferred) {
      this.currentVoice = preferred;
    }
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (!this.isSupported) return [];
    return window.speechSynthesis.getVoices().filter((v) => v.lang.startsWith('en'));
  }

  public setVoice(voice: SpeechSynthesisVoice): void {
    this.currentVoice = voice;
  }

  public speak(
    text: string,
    onStart?: () => void,
    onEnd?: () => void,
    onWordBoundary?: (word: string, charIndex: number) => void,
    rate = 1.0,
    pitch = 1.0
  ): boolean {
    if (!this.isSupported) return false;

    this.stop();

    const cleanText = text.replace(/pi/gi, 'pie');
    const u = new SpeechSynthesisUtterance(cleanText);
    u.rate = rate;
    u.pitch = pitch;
    if (this.currentVoice) {
      u.voice = this.currentVoice;
    }

    u.onstart = () => {
      onStart?.();
    };

    u.onend = () => {
      this.utterance = null;
      onEnd?.();
    };

    u.onerror = (e) => {
      console.warn('Speech synthesis error/interrupted:', e);
      this.utterance = null;
      onEnd?.();
    };

    if (onWordBoundary) {
      u.onboundary = (event) => {
        if (event.name === 'word') {
          const word = text.substring(event.charIndex, event.charIndex + (event.charLength || 6));
          onWordBoundary(word, event.charIndex);
        }
      };
    }

    this.utterance = u;
    window.speechSynthesis.speak(u);
    return true;
  }

  public stop(): void {
    if (!this.isSupported) return;
    window.speechSynthesis.cancel();
    this.utterance = null;
  }

  public isSpeaking(): boolean {
    if (!this.isSupported) return false;
    return window.speechSynthesis.speaking;
  }
}

export const speechSynthesizer = new SpeechSynthesizer();
