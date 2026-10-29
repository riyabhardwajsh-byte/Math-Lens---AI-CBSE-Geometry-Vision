import { CBSEChapter, Mode } from '../types';

export const CBSE_CHAPTERS: Record<Mode, CBSEChapter[]> = {
  circle: [
    {
      id: 'c10-ch10',
      title: 'Chapter 10: Circles',
      classGrade: 'Class 10',
      chapterNum: 10,
      subject: 'Mathematics',
      coreConcepts: [
        'Tangent to a Circle & Point of Contact',
        'Theorem 10.1: Tangent is perpendicular to the radius (OP ⟂ T)',
        'Theorem 10.2: Lengths of tangents from an external point are equal (PQ = PR)',
        'Secants, Chords & Concentric Circles',
      ],
      keyTheorems: [
        'Theorem 10.1: Radius through point of contact is perpendicular to the tangent.',
        'Theorem 10.2: Tangents drawn from an external point to a circle subtend equal angles at the center.',
      ],
      boardExamWeightage: '6 to 8 Marks',
      realWorldApplication: 'Analyzing bicycle wheels, gears, bearings, steering wheels, and circular dials.',
    },
    {
      id: 'c10-ch12',
      title: 'Chapter 12: Areas Related to Circles',
      classGrade: 'Class 10',
      chapterNum: 12,
      subject: 'Mathematics',
      coreConcepts: [
        'Circumference = 2πr, Area = πr²',
        'Area of Sector = (θ/360°) × πr²',
        'Length of Arc = (θ/360°) × 2πr',
        'Wheel revolutions in distance D: N = D / (2πr)',
      ],
      keyTheorems: [
        'Number of complete rotations of a wheel of radius r traveling distance D: N = D / (2πr).',
      ],
      boardExamWeightage: '4 to 6 Marks',
      realWorldApplication: 'Calculating distance traveled per revolution of bicycle wheels, car tires, and circular tracks.',
    },
  ],
  square: [
    {
      id: 'c9-ch8-sq',
      title: 'Chapter 8: Quadrilaterals (Square)',
      classGrade: 'Class 9',
      chapterNum: 8,
      subject: 'Mathematics',
      coreConcepts: [
        'A quadrilateral whose all 4 sides are equal and all angles are 90°',
        'Diagonals are equal and bisect each other at right angles (90°)',
        'Diagonal length d = s√2',
        'Perimeter P = 4s, Area A = s²',
      ],
      keyTheorems: [
        'Theorem: If the diagonals of a quadrilateral bisect each other at right angles and are equal, then it is a square.',
        'Mid-point theorem applied to squares: joining mid-points of sides forms another square.',
      ],
      boardExamWeightage: '6 Marks',
      realWorldApplication: 'Wooden square toy blocks, floor tiles, digital pixel chips, and solar photovoltaic cells.',
    },
  ],
  rectangle: [
    {
      id: 'c9-ch8-rect',
      title: 'Chapter 8: Quadrilaterals (Rectangle)',
      classGrade: 'Class 9',
      chapterNum: 8,
      subject: 'Mathematics',
      coreConcepts: [
        'Parallelogram with one right angle (all 4 angles = 90°)',
        'Opposite sides are equal and parallel (AB = CD, BC = DA)',
        'Diagonals are equal (AC = BD) and bisect each other',
        'Pythagoras theorem on diagonal: d = √(width² + height²)',
        'Area = width × height, Perimeter = 2(width + height)',
      ],
      keyTheorems: [
        'Theorem: Diagonals of a rectangle are of equal length and bisect each other.',
      ],
      boardExamWeightage: '6 Marks',
      realWorldApplication: 'Smartphone screens, tablet computers, televisions, books, and architectural windows.',
    },
  ],
  triangle: [
    {
      id: 'c9-ch12-tri',
      title: "Chapter 12: Heron's Formula",
      classGrade: 'Class 9',
      chapterNum: 12,
      subject: 'Mathematics',
      coreConcepts: [
        'Semi-perimeter: s = (a + b + c) / 2',
        "Heron's Formula for Area: Area = √[s(s - a)(s - b)(s - c)]",
        'Application to triangular toy blocks, roof trusses, and park plots',
      ],
      keyTheorems: [
        "Heron's theorem computes area of any triangle given its 3 side lengths without needing perpendicular height.",
      ],
      boardExamWeightage: '4 to 6 Marks',
      realWorldApplication: 'Triangular building blocks, triangular street signs, and roof gable trusses.',
    },
    {
      id: 'c10-ch6-tri',
      title: 'Chapter 6: Triangles (Similarity)',
      classGrade: 'Class 10',
      chapterNum: 6,
      subject: 'Mathematics',
      coreConcepts: [
        'Basic Proportionality Theorem (Thales Theorem)',
        'Criteria for Similarity: AAA, SSS, SAS',
        'Right Triangle & Pythagoras Theorem: a² + b² = c²',
      ],
      keyTheorems: [
        'Theorem 6.1 (BPT): If a line is drawn parallel to one side of a triangle, it divides the other two sides in the same ratio.',
      ],
      boardExamWeightage: '8 to 10 Marks',
      realWorldApplication: 'Determining heights of objects using shadow similarity and right-angled structural wedges.',
    },
  ],
  rhombus: [
    {
      id: 'c9-ch8-rhombus',
      title: 'Chapter 8: Quadrilaterals (Rhombus)',
      classGrade: 'Class 9',
      chapterNum: 8,
      subject: 'Mathematics',
      coreConcepts: [
        'Parallelogram with all four sides equal',
        'Diagonals bisect each other at right angles (90°)',
        'Area of Rhombus = ½ × d₁ × d₂ (product of diagonals)',
        'Perimeter = 4a, where side a = √[(d₁/2)² + (d₂/2)²]',
      ],
      keyTheorems: [
        'Theorem: The diagonals of a rhombus are perpendicular bisectors of each other.',
      ],
      boardExamWeightage: '5 to 6 Marks',
      realWorldApplication: 'Diamond kite toys, diamond road caution signs, and tessellated flooring tiles.',
    },
  ],
  parallelogram: [
    {
      id: 'c9-ch8-parall',
      title: 'Chapter 8: Quadrilaterals (Parallelogram)',
      classGrade: 'Class 9',
      chapterNum: 8,
      subject: 'Mathematics',
      coreConcepts: [
        'Opposite sides are parallel and equal',
        'Opposite angles are equal',
        'Adjacent angles are supplementary (sum to 180°)',
        'Diagonals bisect each other',
        'Area = Base × Perpendicular Height',
      ],
      keyTheorems: [
        'Theorem 8.1: A diagonal of a parallelogram divides it into two congruent triangles.',
        'Theorem 8.2: In a parallelogram, opposite sides and angles are equal.',
      ],
      boardExamWeightage: '6 Marks',
      realWorldApplication: 'Solar panel tilt brackets, wooden geometric tangram blocks, and mechanical linkages.',
    },
  ],
  parabola: [
    {
      id: 'c10-ch2-para',
      title: 'Chapter 2 & 4: Polynomials & Quadratic Equations',
      classGrade: 'Class 10',
      chapterNum: 2,
      subject: 'Mathematics',
      coreConcepts: [
        'Graph of quadratic polynomial y = ax² + bx + c is a Parabola',
        'Direction: a > 0 opens upwards, a < 0 opens downwards (arch curve)',
        'Discriminant D = b² - 4ac determines number of X-axis contact points',
        'Vertex coordinates V(-b/2a, -D/4a)',
      ],
      keyTheorems: [
        'Zeroes of the polynomial ax² + bx + c are the x-coordinates of the points where the parabola intersects the X-axis.',
      ],
      boardExamWeightage: '8 to 10 Marks',
      realWorldApplication: 'Bridge structural arch profiles, water fountain arcs, and satellite dish reflectors.',
    },
  ],
  slope: [
    {
      id: 'c10-ch9-trig',
      title: 'Chapter 9: Some Applications of Trigonometry (Heights & Distances)',
      classGrade: 'Class 10',
      chapterNum: 9,
      subject: 'Mathematics',
      coreConcepts: [
        'Angle of Elevation: Angle between horizontal ground and line of sight to apex',
        'Tree Height Calculation: Height = Distance × tan(θ)',
        'Accessible Ramp Gradient: Slope m = tan(θ) = Rise / Run',
        'Pythagoras theorem on slope vector: Hypotenuse² = Base² + Height²',
      ],
      keyTheorems: [
        'tan(θ) = Opposite / Adjacent = Height / Base distance.',
        'Height of an inaccessible object (like a tall tree) can be determined using a clinometer angle θ and measured baseline distance.',
      ],
      boardExamWeightage: '8 Marks (Standard Long Answer)',
      realWorldApplication: 'Estimating tall tree height from ground, wheelchair ramp compliance, and roof rafters.',
    },
  ],
};

export interface PracticeProblem {
  title: string;
  question: string;
  given: string[];
  formula: string[];
  steps: string[];
  answer: string;
}

export function generateLiveCBSEProblem(
  mode: Mode,
  params: {
    radius?: number;
    side?: number;
    width?: number;
    height?: number;
    triSides?: [number, number, number];
    d1?: number;
    d2?: number;
    base?: number;
    pHeight?: number;
    vertexH?: number;
    vertexK?: number;
    archA?: number;
    angleDeg?: number;
    dx?: number;
    dy?: number;
    hypotenuse?: number;
    objectName?: string;
    unit?: string;
  }
): PracticeProblem {
  const unit = params.unit || 'm';

  if (mode === 'circle') {
    const r = params.radius || 2.5;
    const circ = (2 * Math.PI * r).toFixed(2);
    const area = (Math.PI * r * r).toFixed(2);
    const revPerKm = Math.round(1000 / (2 * Math.PI * r));

    return {
      title: 'CBSE Class 10 Board Question (Circles & Wheel Revolutions)',
      question: `A wheel detected in the exhibition camera has a measured radius of r = ${r} ${unit}. (i) Find the circumference and total area of the wheel. (ii) Calculate the number of complete revolutions the wheel makes in traveling a distance of 1 kilometer (1000 m). [NCERT Ch 12 Exercise 12.1 Q4]`,
      given: [
        `Radius of wheel: r = ${r} ${unit}`,
        `Total distance to travel: D = 1000 m`,
        `Value of π ≈ 3.1416`,
      ],
      formula: [
        `Circumference: C = 2πr (distance covered in 1 complete rotation)`,
        `Total Area: A = πr²`,
        `Number of revolutions: N = Total Distance / Circumference = D / (2πr)`,
      ],
      steps: [
        `Step 1: Calculate Circumference C = 2 × 3.1416 × ${r} = ${circ} ${unit}`,
        `Step 2: Calculate Area A = 3.1416 × (${r})² = ${area} ${unit}²`,
        `Step 3: Number of complete revolutions N = 1000 / ${circ} = ${revPerKm} revolutions`,
      ],
      answer: `Circumference = ${circ} ${unit} ; Area = ${area} ${unit}² ; Revolutions per km = ${revPerKm}`,
    };
  }

  if (mode === 'square') {
    const s = params.side || 3.5;
    const area = (s * s).toFixed(2);
    const peri = (4 * s).toFixed(2);
    const diag = (s * Math.SQRT2).toFixed(2);

    return {
      title: 'CBSE Class 9 Board Question (Quadrilaterals - Square Toy Block)',
      question: `A square wooden toy block is measured on the grid with side length s = ${s} ${unit}. (i) Find its perimeter and area. (ii) Using the Pythagoras theorem, calculate the exact length of its diagonal.`,
      given: [
        `Side length of square: s = ${s} ${unit}`,
        `All 4 interior angles = 90°`,
      ],
      formula: [
        `Perimeter: P = 4s`,
        `Area: A = s²`,
        `Diagonal: d = √(s² + s²) = s√2`,
      ],
      steps: [
        `Step 1: Perimeter P = 4 × ${s} = ${peri} ${unit}`,
        `Step 2: Area A = (${s})² = ${area} ${unit}²`,
        `Step 3: In right triangle ABC, AC² = AB² + BC² = ${s}² + ${s}² = ${(2 * s * s).toFixed(2)}`,
        `Step 4: Diagonal d = √(${(2 * s * s).toFixed(2)}) = ${s} × 1.414 = ${diag} ${unit}`,
      ],
      answer: `Perimeter = ${peri} ${unit} ; Area = ${area} ${unit}² ; Diagonal = ${diag} ${unit}`,
    };
  }

  if (mode === 'rectangle') {
    const w = params.width || 4.2;
    const h = params.height || 9.0;
    const area = (w * h).toFixed(2);
    const peri = (2 * (w + h)).toFixed(2);
    const diag = Math.sqrt(w * w + h * h).toFixed(2);
    const ar = (h / w).toFixed(2);

    return {
      title: 'CBSE Class 9 Mensuration (Smartphone / Tablet Display Geometry)',
      question: `A digital device (phone/tab) screen forms a rectangle ABCD with width = ${w} ${unit} and height = ${h} ${unit}. (i) Find the display surface area and perimeter. (ii) Calculate the screen diagonal size using the Pythagorean theorem. (iii) Determine the aspect ratio.`,
      given: [
        `Screen Width: w = ${w} ${unit}`,
        `Screen Height: h = ${h} ${unit}`,
        `Opposite sides are parallel and all angles = 90°`,
      ],
      formula: [
        `Display Area: A = width × height`,
        `Perimeter: P = 2(width + height)`,
        `Diagonal: d = √(width² + height²)`,
        `Aspect Ratio: Height : Width`,
      ],
      steps: [
        `Step 1: Display Area = ${w} × ${h} = ${area} ${unit}²`,
        `Step 2: Perimeter = 2 × (${w} + ${h}) = ${peri} ${unit}`,
        `Step 3: Diagonal² = (${w})² + (${h})² = ${(w * w).toFixed(2)} + ${(h * h).toFixed(2)} = ${(w * w + h * h).toFixed(2)}`,
        `Step 4: Diagonal d = √(${(w * w + h * h).toFixed(2)}) = ${diag} ${unit}`,
        `Step 5: Aspect Ratio = ${ar} : 1`,
      ],
      answer: `Area = ${area} ${unit}² ; Perimeter = ${peri} ${unit} ; Diagonal = ${diag} ${unit} (${ar}:1 aspect ratio)`,
    };
  }

  if (mode === 'triangle') {
    const a = params.triSides?.[0] || 4.0;
    const b = params.triSides?.[1] || 5.0;
    const c = params.triSides?.[2] || 6.0;
    const peri = (a + b + c).toFixed(2);
    const s = ((a + b + c) / 2).toFixed(2);
    const sNum = (a + b + c) / 2;
    const area = Math.sqrt(Math.max(0.01, sNum * (sNum - a) * (sNum - b) * (sNum - c))).toFixed(2);

    return {
      title: "CBSE Class 9 Board Question (Heron's Formula on Triangular Toy Block)",
      question: `A triangular wooden toy block has measured side lengths a = ${a.toFixed(2)} ${unit}, b = ${b.toFixed(2)} ${unit}, and c = ${c.toFixed(2)} ${unit}. Find the surface area of the block using Heron's formula.`,
      given: [
        `Sides of triangle: a = ${a.toFixed(2)} ${unit}, b = ${b.toFixed(2)} ${unit}, c = ${c.toFixed(2)} ${unit}`,
      ],
      formula: [
        `Semi-perimeter: s = (a + b + c) / 2`,
        `Heron's Formula: Area = √[s(s - a)(s - b)(s - c)]`,
      ],
      steps: [
        `Step 1: Calculate semi-perimeter s = (${a.toFixed(2)} + ${b.toFixed(2)} + ${c.toFixed(2)}) / 2 = ${peri} / 2 = ${s} ${unit}`,
        `Step 2: Calculate differences: (s - a) = ${(sNum - a).toFixed(2)}, (s - b) = ${(sNum - b).toFixed(2)}, (s - c) = ${(sNum - c).toFixed(2)}`,
        `Step 3: Area = √[${s} × ${(sNum - a).toFixed(2)} × ${(sNum - b).toFixed(2)} × ${(sNum - c).toFixed(2)}]`,
        `Step 4: Area = ${area} ${unit}²`,
      ],
      answer: `Perimeter = ${peri} ${unit} ; Semi-perimeter s = ${s} ${unit} ; Area = ${area} ${unit}²`,
    };
  }

  if (mode === 'rhombus') {
    const d1 = params.d1 || 5.5;
    const d2 = params.d2 || 7.2;
    const area = (0.5 * d1 * d2).toFixed(2);
    const side = Math.hypot(d1 / 2, d2 / 2).toFixed(2);
    const peri = (4 * parseFloat(side)).toFixed(2);

    return {
      title: 'CBSE Class 9 Case Study (Quadrilaterals - Diamond Kite Toy)',
      question: `A diamond kite toy is shaped like a rhombus with cross-strut diagonal lengths d₁ = ${d1} ${unit} and d₂ = ${d2} ${unit}. (i) Find the total surface area of paper required to make the kite. (ii) Using the theorem that diagonals bisect each other at right angles, calculate the length of its outer side and total perimeter.`,
      given: [
        `Diagonal 1: d₁ = ${d1} ${unit}`,
        `Diagonal 2: d₂ = ${d2} ${unit}`,
        `Theorem: Diagonals of a rhombus bisect each other at 90°`,
      ],
      formula: [
        `Area of Rhombus = ½ × d₁ × d₂`,
        `In right triangle at center: Side² = (d₁/2)² + (d₂/2)²`,
        `Perimeter = 4 × Side`,
      ],
      steps: [
        `Step 1: Calculate Area = ½ × ${d1} × ${d2} = ${area} ${unit}²`,
        `Step 2: Half-diagonals are d₁/2 = ${(d1 / 2).toFixed(2)} ${unit} and d₂/2 = ${(d2 / 2).toFixed(2)} ${unit}`,
        `Step 3: Side² = (${(d1 / 2).toFixed(2)})² + (${(d2 / 2).toFixed(2)})² = ${((d1 / 2) ** 2 + (d2 / 2) ** 2).toFixed(2)}`,
        `Step 4: Side a = √(${((d1 / 2) ** 2 + (d2 / 2) ** 2).toFixed(2)}) = ${side} ${unit}`,
        `Step 5: Perimeter = 4 × ${side} = ${peri} ${unit}`,
      ],
      answer: `Area = ${area} ${unit}² ; Side = ${side} ${unit} ; Perimeter = ${peri} ${unit}`,
    };
  }

  if (mode === 'parallelogram') {
    const b = params.base || 4.2;
    const h = params.pHeight || 2.8;
    const area = (b * h).toFixed(2);

    return {
      title: 'CBSE Class 9 Board Question (Quadrilaterals - Parallelogram Block)',
      question: `A geometric parallelogram block has a base of ${b} ${unit} and a perpendicular altitude of ${h} ${unit}. (i) Calculate the surface area. (ii) State the relation between its opposite sides and opposite angles according to NCERT Theorem 8.2.`,
      given: [
        `Base of Parallelogram: b = ${b} ${unit}`,
        `Perpendicular Height (Altitude): h = ${h} ${unit}`,
      ],
      formula: [
        `Area of Parallelogram = Base × Height`,
        `Theorem 8.2: Opposite sides and opposite angles are equal`,
      ],
      steps: [
        `Step 1: Identify base = ${b} ${unit} and altitude = ${h} ${unit}`,
        `Step 2: Area = ${b} × ${h} = ${area} ${unit}²`,
        `Step 3: A diagonal divides it into two congruent triangles each of area = ½ × ${area} = ${(parseFloat(area) / 2).toFixed(2)} ${unit}²`,
      ],
      answer: `Total Area = ${area} ${unit}²`,
    };
  }

  if (mode === 'parabola') {
    const k = Math.abs(params.vertexK || 4.8);
    const a = params.archA || -0.015;
    const span = (2 * Math.sqrt(Math.abs(k / a))).toFixed(2);

    return {
      title: 'CBSE Class 10 Case Study (Polynomials & Arch Bridge)',
      question: `The structural arch of the bridge follows the quadratic parabola equation y = ${a.toFixed(4)}x² + ${k.toFixed(2)}. (i) Find the maximum crown height of the arch. (ii) Find the horizontal span between the river piers where y = 0.`,
      given: [
        `Equation of Arch: y = ${a.toFixed(4)}x² + ${k.toFixed(2)}`,
        `Vertex coordinates: (0, ${k.toFixed(2)})`,
        `Baseline water level: y = 0`,
      ],
      formula: [
        `Maximum height is at vertex: y_max = ${k.toFixed(2)}`,
        `Zeroes of polynomial when y = 0 ⇒ x = ±√(-c / a)`,
        `Span = |x₂ - x₁| = 2 × √(-c / a)`,
      ],
      steps: [
        `Step 1: Coefficient a = ${a.toFixed(4)} < 0 confirms downward parabolic arch.`,
        `Step 2: Maximum clearance height = ${k.toFixed(2)} ${unit}.`,
        `Step 3: Solve ${a.toFixed(4)}x² + ${k.toFixed(2)} = 0 ⇒ x² = ${(Math.abs(k / a)).toFixed(2)} ⇒ x = ±${(Math.sqrt(Math.abs(k / a))).toFixed(2)}`,
        `Step 4: Total span between piers = 2 × ${(Math.sqrt(Math.abs(k / a))).toFixed(2)} = ${span} ${unit}`,
      ],
      answer: `Max Height = ${k.toFixed(2)} ${unit} ; Pier Span = ${span} ${unit}`,
    };
  }

  // Slope / Tree Height / Ramp
  const theta = (params.angleDeg || 61.4).toFixed(1);
  const run = (params.dx || 4.6).toFixed(2);
  const rise = (params.dy || 8.4).toFixed(2);
  const hyp = (params.hypotenuse || 9.5).toFixed(2);
  const tanVal = Math.tan((Number(theta) * Math.PI) / 180).toFixed(3);

  return {
    title: 'CBSE Class 10 Board Question (Trigonometry - Inaccessible Tree Height)',
    question: `A student at an exhibition measures the angle of elevation to the top of a tall cedar tree from a point on the ground at a distance of ${run} ${unit} from the base of the tree. The angle of elevation is measured as θ = ${theta}°. Calculate the total height of the tree. [NCERT Ch 9 Example 1]`,
    given: [
      `Distance from observation point to tree trunk (Base): d = ${run} ${unit}`,
      `Angle of elevation: θ = ${theta}°`,
      `tan(${theta}°) ≈ ${tanVal}`,
    ],
    formula: [
      `In right triangle ABC: tan(θ) = Opposite / Adjacent = Tree Height / Base Distance`,
      `Tree Height = Base Distance × tan(θ)`,
      `Line of Sight Distance (Hypotenuse) = Base Distance / cos(θ)`,
    ],
    steps: [
      `Step 1: In right triangle ABC formed by the ground, the tree trunk, and line of sight:`,
      `Step 2: tan(${theta}°) = Tree Height / ${run}`,
      `Step 3: Tree Height = ${run} × tan(${theta}°) = ${run} × ${tanVal} = ${rise} ${unit}`,
      `Step 4: Direct line of sight distance (hypotenuse) = √(${run}² + ${rise}²) = ${hyp} ${unit}`,
    ],
    answer: `Tree Height = ${rise} ${unit} ; Line of Sight Hypotenuse = ${hyp} ${unit}`,
  };
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const EXHIBITION_QUIZZES: Record<Mode, QuizQuestion[]> = {
  circle: [
    {
      id: 'q-c1',
      question: 'What is the angle between a radius and the tangent at the point of contact (CBSE Theorem 10.1)?',
      options: ['45°', '90° (Perpendicular)', '180°', '60°'],
      correctIndex: 1,
      explanation: 'Theorem 10.1 proves that the tangent at any point is perpendicular (90°) to the radius through the point of contact.',
    },
    {
      id: 'q-c2',
      question: 'A bicycle wheel of radius r travels distance D. What is the formula for the number of complete revolutions?',
      options: ['D / (πr²)', 'D / (2πr)', '2πr / D', 'D × 2πr'],
      correctIndex: 1,
      explanation: 'Each revolution covers one circumference (2πr). Hence, Number of revolutions = D / (2πr).',
    },
  ],
  square: [
    {
      id: 'q-sq1',
      question: 'If a square toy block has side length s, what is the length of its diagonal?',
      options: ['s√2', '2s', 's²', 's / √2'],
      correctIndex: 0,
      explanation: 'By Pythagoras theorem on diagonal: d = √(s² + s²) = √(2s²) = s√2.',
    },
  ],
  rectangle: [
    {
      id: 'q-rect1',
      question: 'Which of the following properties is true for every rectangle (e.g. phone or tablet screen)?',
      options: ['Diagonals are perpendicular', 'Diagonals are equal and all angles are 90°', 'All 4 sides are equal', 'Diagonals do not bisect'],
      correctIndex: 1,
      explanation: 'By NCERT Ch 8, a rectangle has all 4 angles equal to 90° and equal diagonals that bisect each other.',
    },
  ],
  triangle: [
    {
      id: 'q-tri1',
      question: "In Heron's formula Area = √[s(s-a)(s-b)(s-c)], what does 's' represent?",
      options: ['Longest side', 'Sum of all angles', 'Semi-perimeter: (a+b+c)/2', 'Perpendicular altitude'],
      correctIndex: 2,
      explanation: 's is the semi-perimeter of the triangle, defined as half the perimeter: (a + b + c) / 2.',
    },
  ],
  rhombus: [
    {
      id: 'q-rh1',
      question: 'What is the formula for the area of a diamond kite (rhombus) with diagonals d₁ and d₂?',
      options: ['d₁ × d₂', '½ × d₁ × d₂', '4 × (d₁ + d₂)', 'd₁² + d₂²'],
      correctIndex: 1,
      explanation: 'The area of a rhombus is half the product of its diagonals: Area = ½ × d₁ × d₂.',
    },
  ],
  parallelogram: [
    {
      id: 'q-parall1',
      question: 'According to CBSE Theorem 8.1, what does a diagonal of a parallelogram do?',
      options: ['Divides it into 2 congruent triangles', 'Divides it into 2 squares', 'Always equals the base', 'Bisects angles at 90°'],
      correctIndex: 0,
      explanation: 'Theorem 8.1 states that a diagonal of a parallelogram divides it into two congruent triangles.',
    },
  ],
  parabola: [
    {
      id: 'q-p1',
      question: 'In the arch bridge equation y = ax² + bx + c, what does a < 0 signify?',
      options: ['Arch opens upwards', 'Arch opens downwards (inverted curve)', 'Straight pier', 'No vertex'],
      correctIndex: 1,
      explanation: 'When a < 0, the parabola opens downwards, matching real-world architectural bridge arches.',
    },
  ],
  slope: [
    {
      id: 'q-s1',
      question: 'To find the height of a tree without climbing it, which trigonometric ratio is used with base distance d?',
      options: ['sin(θ)', 'cos(θ)', 'tan(θ) = Height / d', 'cot(θ)'],
      correctIndex: 2,
      explanation: 'tan(θ) = Opposite / Adjacent = Height / Distance. Thus, Height = d × tan(θ).',
    },
  ],
};
