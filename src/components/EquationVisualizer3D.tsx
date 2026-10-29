/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import {
  ParsedMathResult,
  parseMathQuery,
  CURATED_QUESTIONS,
  CuratedQuestionItem,
} from '../utils/mathParser';
import { speechSynthesizer } from '../utils/voiceTutor';
import { QuestionDiagram3D } from './QuestionDiagram3D';
import {
  Rotate3d,
  Layers,
  Sparkles,
  Play,
  Pause,
  Download,
  Check,
  Copy,
  BookOpen,
  Info,
  Sliders,
  ChevronDown,
  ChevronUp,
  Search,
  Volume2,
  X,
  Compass,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

interface EquationVisualizer3DProps {
  initialQuery?: string;
  onNavigateToVision?: () => void;
}

export const EquationVisualizer3D: React.FC<EquationVisualizer3DProps> = ({
  initialQuery = 'A medicine capsule is in the shape of a cylinder with two hemispheres stuck to each of its ends. The length of the entire capsule is 14 mm and the diameter is 5 mm. Find its surface area and volume.',
  onNavigateToVision,
}) => {
  const [queryInput, setQueryInput] = useState<string>(initialQuery);
  const [currentQuery, setCurrentQuery] = useState<string>(initialQuery);
  const [parsedModel, setParsedModel] = useState<ParsedMathResult>(() => parseMathQuery(initialQuery));

  // Category and Search Filtering for the 32+ Curated Questions
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [isCuratedDrawerOpen, setIsCuratedDrawerOpen] = useState<boolean>(true);

  // Visualization display controls
  const [viewMode, setViewMode] = useState<'3d' | '2d_cad' | 'split'>('3d');
  const [renderStyle, setRenderStyle] = useState<'shaded' | 'wireframe' | 'xray' | 'heatmap'>('heatmap');
  const [showAxes, setShowAxes] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showKeyPoints, setShowKeyPoints] = useState<boolean>(true);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [isHudCollapsed, setIsHudCollapsed] = useState<boolean>(false);
  const [copiedEquation, setCopiedEquation] = useState<boolean>(false);
  const [clipZ, setClipZ] = useState<number>(10); // Cross-section slice slider

  // DOM Refs for Three.js WebGL and 2D CAD Canvas
  const mountRef = useRef<HTMLDivElement | null>(null);
  const canvas2dRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const objectGroupRef = useRef<THREE.Group | null>(null);
  const pointsGroupRef = useRef<THREE.Group | null>(null);
  const isInteractingRef = useRef<boolean>(false);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cameraSphericalRef = useRef<{ radius: number; theta: number; phi: number }>({
    radius: 14,
    theta: Math.PI / 4,
    phi: Math.PI / 3,
  });

  // Re-parse when currentQuery changes
  useEffect(() => {
    const result = parseMathQuery(currentQuery);
    setParsedModel(result);
  }, [currentQuery]);

  // Filtered curated questions
  const filteredQuestions = useMemo(() => {
    return CURATED_QUESTIONS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        searchFilter.trim() === '' ||
        item.label.toLowerCase().includes(searchFilter.toLowerCase()) ||
        item.query.toLowerCase().includes(searchFilter.toLowerCase()) ||
        item.chapter.toLowerCase().includes(searchFilter.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchFilter]);

  // Three.js Scene Setup & Render Loop
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 520;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050814); // Deep space CAD background
    scene.fog = new THREE.FogExp2(0x050814, 0.025);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    cameraRef.current = camera;
    updateCameraPosition();

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);
    renderer.domElement.style.outline = 'none';
    renderer.domElement.style.cursor = 'grab';

    // 4. Lighting Rig
    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.2);
    keyLight.position.set(10, 15, 10);
    scene.add(keyLight);

    const fillLight = new THREE.HemisphereLight(0x38bdf8, 0x0f172a, 1.4);
    fillLight.position.set(0, 20, 0);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x34d399, 1.5);
    rimLight.position.set(-10, -5, -10);
    scene.add(rimLight);

    // 5. Grid Helper & Axis Helper
    const grid = new THREE.GridHelper(16, 16, 0x06b6d4, 0x1e293b);
    grid.position.y = -0.01;
    scene.add(grid);

    const axesHelper = new THREE.AxesHelper(6);
    axesHelper.name = 'axes_helper';
    scene.add(axesHelper);

    // 6. Object & Key Points Groups
    const objectGroup = new THREE.Group();
    scene.add(objectGroup);
    objectGroupRef.current = objectGroup;

    const pointsGroup = new THREE.Group();
    scene.add(pointsGroup);
    pointsGroupRef.current = pointsGroup;

    // 7. Interactive Orbit Controls (Pointer Drag & Wheel Zoom)
    const dom = renderer.domElement;

    const handlePointerDown = (e: PointerEvent) => {
      isInteractingRef.current = true;
      mousePosRef.current = { x: e.clientX, y: e.clientY };
      dom.style.cursor = 'grabbing';
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isInteractingRef.current) return;
      const dx = e.clientX - mousePosRef.current.x;
      const dy = e.clientY - mousePosRef.current.y;
      mousePosRef.current = { x: e.clientX, y: e.clientY };

      const sph = cameraSphericalRef.current;
      sph.theta -= dx * 0.008;
      sph.phi = Math.max(0.1, Math.min(Math.PI - 0.1, sph.phi - dy * 0.008));
      updateCameraPosition();
    };

    const handlePointerUp = () => {
      isInteractingRef.current = false;
      dom.style.cursor = 'grab';
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const sph = cameraSphericalRef.current;
      sph.radius = Math.max(4, Math.min(40, sph.radius + e.deltaY * 0.015));
      updateCameraPosition();
    };

    dom.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    dom.addEventListener('wheel', handleWheel, { passive: false });

    // 8. Animation / Render Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (autoRotate && !isInteractingRef.current) {
        cameraSphericalRef.current.theta += 0.004;
        updateCameraPosition();
      }

      renderer.render(scene, camera);
    };
    animate();

    // 9. Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const ro = new ResizeObserver(handleResize);
    ro.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      dom.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      dom.removeEventListener('wheel', handleWheel);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update Three.js camera from spherical coordinates
  const updateCameraPosition = () => {
    const cam = cameraRef.current;
    if (!cam) return;
    const sph = cameraSphericalRef.current;
    cam.position.x = sph.radius * Math.sin(sph.phi) * Math.sin(sph.theta);
    cam.position.y = sph.radius * Math.cos(sph.phi);
    cam.position.z = sph.radius * Math.sin(sph.phi) * Math.cos(sph.theta);
    cam.lookAt(0, 0, 0);
  };

  // Rebuild 3D Meshes whenever parsedModel, renderStyle, or clipZ changes
  useEffect(() => {
    const group = objectGroupRef.current;
    const pointsGroup = pointsGroupRef.current;
    if (!group || !pointsGroup) return;

    // Clear existing objects
    while (group.children.length > 0) {
      const child = group.children[0] as THREE.Mesh;
      group.remove(child);
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose());
        } else {
          (child.material as THREE.Material).dispose();
        }
      }
    }
    while (pointsGroup.children.length > 0) {
      const child = pointsGroup.children[0] as THREE.Mesh;
      pointsGroup.remove(child);
      if (child.geometry) child.geometry.dispose();
      if (child.material) (child.material as THREE.Material).dispose();
    }

    // Material Helper
    const createMaterial = (baseColor: number = 0x06b6d4, wireframeOnly: boolean = false) => {
      if (wireframeOnly || renderStyle === 'wireframe') {
        return new THREE.MeshBasicMaterial({
          color: baseColor,
          wireframe: true,
          transparent: true,
          opacity: 0.85,
        });
      }
      if (renderStyle === 'xray') {
        return new THREE.MeshPhysicalMaterial({
          color: baseColor,
          transparent: true,
          opacity: 0.35,
          roughness: 0.1,
          metalness: 0.3,
          clearcoat: 1.0,
          depthWrite: false,
          wireframe: false,
        });
      }
      return new THREE.MeshStandardMaterial({
        color: baseColor,
        roughness: 0.25,
        metalness: 0.2,
        side: THREE.DoubleSide,
        vertexColors: renderStyle === 'heatmap',
      });
    };

    // Construct 3D Geometry Based on Parsed Type
    switch (parsedModel.type) {
      // 1. Medicine Capsule / Gulab Jamun (Cylinder + 2 Hemispherical Ends)
      case 'capsule_cylinder_spheres': {
        const r = parsedModel.dimensions?.radius || 2.5;
        const cylH = parsedModel.dimensions?.height || 9;

        // Central Cylinder
        const cylGeo = new THREE.CylinderGeometry(r, r, cylH, 32);
        const cylMesh = new THREE.Mesh(cylGeo, createMaterial(0x06b6d4));
        group.add(cylMesh);

        // Top Hemisphere Cap
        const topHemiGeo = new THREE.SphereGeometry(r, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        topHemiGeo.translate(0, cylH / 2, 0);
        const topHemiMesh = new THREE.Mesh(topHemiGeo, createMaterial(0xf59e0b));
        group.add(topHemiMesh);

        // Bottom Hemisphere Cap
        const botHemiGeo = new THREE.SphereGeometry(r, 24, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
        botHemiGeo.translate(0, -cylH / 2, 0);
        const botHemiMesh = new THREE.Mesh(botHemiGeo, createMaterial(0xf59e0b));
        group.add(botHemiMesh);

        // Seam Rings
        const ring1 = new THREE.RingGeometry(r - 0.05, r + 0.05, 36);
        ring1.rotateX(Math.PI / 2);
        ring1.translate(0, cylH / 2, 0);
        group.add(new THREE.Mesh(ring1, new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide })));

        const ring2 = new THREE.RingGeometry(r - 0.05, r + 0.05, 36);
        ring2.rotateX(Math.PI / 2);
        ring2.translate(0, -cylH / 2, 0);
        group.add(new THREE.Mesh(ring2, new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide })));
        break;
      }

      // 2. Wooden Toy (Cone Mounted on Hemisphere)
      case 'composite_toy': {
        const r = parsedModel.dimensions?.radius || 3.5;
        const coneH = parsedModel.dimensions?.height || 12;

        // Conical Top
        const coneGeo = new THREE.ConeGeometry(r, coneH, 32);
        coneGeo.translate(0, coneH / 2, 0);
        const coneMesh = new THREE.Mesh(coneGeo, createMaterial(0xec4899));
        group.add(coneMesh);

        // Hemispherical Base
        const hemiGeo = new THREE.SphereGeometry(r, 24, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
        const hemiMesh = new THREE.Mesh(hemiGeo, createMaterial(0x06b6d4));
        group.add(hemiMesh);

        // Junction Ring
        const ring = new THREE.RingGeometry(r - 0.06, r + 0.06, 36);
        ring.rotateX(Math.PI / 2);
        group.add(new THREE.Mesh(ring, new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide })));
        break;
      }

      // 3. Frustum of a Cone (Drinking Glass / Bucket)
      case 'frustum_cone': {
        const r1 = parsedModel.dimensions?.radius || 4; // top
        const r2 = parsedModel.dimensions?.radius2 || 2; // bottom
        const h = parsedModel.dimensions?.height || 14;

        const frustumGeo = new THREE.CylinderGeometry(r1, r2, h, 36);
        const frustumMesh = new THREE.Mesh(frustumGeo, createMaterial(0x06b6d4));
        group.add(frustumMesh);

        const wireGeo = new THREE.WireframeGeometry(frustumGeo);
        group.add(
          new THREE.LineSegments(
            wireGeo,
            new THREE.LineBasicMaterial({ color: 0x38bdf8, opacity: 0.35, transparent: true })
          )
        );
        break;
      }

      // 4. Solid Iron Pole (Stepped Cylinders)
      case 'stepped_pole': {
        const r1 = 2.4; // scaled
        const h1 = 7.0;
        const r2 = 1.6;
        const h2 = 3.0;

        // Base Cylinder
        const cyl1Geo = new THREE.CylinderGeometry(r1, r1, h1, 32);
        cyl1Geo.translate(0, h1 / 2 - 4, 0);
        group.add(new THREE.Mesh(cyl1Geo, createMaterial(0x64748b)));

        // Upper Cylinder
        const cyl2Geo = new THREE.CylinderGeometry(r2, r2, h2, 32);
        cyl2Geo.translate(0, h1 + h2 / 2 - 4, 0);
        group.add(new THREE.Mesh(cyl2Geo, createMaterial(0x0ea5e9)));

        // Shoulder Rim
        const ring = new THREE.RingGeometry(r2, r1, 32);
        ring.rotateX(-Math.PI / 2);
        ring.translate(0, h1 - 4, 0);
        group.add(new THREE.Mesh(ring, new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide })));
        break;
      }

      // 5. Circus Tent (Cylinder + Conical Roof)
      case 'composite_tent': {
        const r = parsedModel.dimensions?.radius || 3;
        const h = parsedModel.dimensions?.height || 3.5;
        const roofH = 3.0;

        // Cylindrical Wall
        const wallGeo = new THREE.CylinderGeometry(r, r, h, 32);
        wallGeo.translate(0, h / 2 - 2, 0);
        group.add(new THREE.Mesh(wallGeo, createMaterial(0x06b6d4)));

        // Conical Roof
        const roofGeo = new THREE.ConeGeometry(r * 1.05, roofH, 32);
        roofGeo.translate(0, h + roofH / 2 - 2, 0);
        group.add(new THREE.Mesh(roofGeo, createMaterial(0xf59e0b)));
        break;
      }

      // 6. Cube with Hemispherical Depression
      case 'cube_hemisphere_depression': {
        const a = 5;
        const r = 2.0;

        // Wooden Cube
        const cubeGeo = new THREE.BoxGeometry(a, a, a);
        group.add(new THREE.Mesh(cubeGeo, createMaterial(0x475569)));

        // Inverted Cavity Mesh inside top face
        const cavityGeo = new THREE.SphereGeometry(r, 24, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
        cavityGeo.rotateX(Math.PI);
        cavityGeo.translate(0, a / 2, 0);
        group.add(new THREE.Mesh(cavityGeo, createMaterial(0x0284c7)));

        // Cavity Rim
        const rim = new THREE.RingGeometry(r - 0.06, r + 0.06, 36);
        rim.rotateX(-Math.PI / 2);
        rim.translate(0, a / 2 + 0.01, 0);
        group.add(new THREE.Mesh(rim, new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide })));
        break;
      }

      // 7. Square Pyramid
      case 'pyramid_square': {
        const side = parsedModel.dimensions?.base || 6;
        const h = parsedModel.dimensions?.height || 5;

        const pyrGeo = new THREE.ConeGeometry(side / Math.SQRT2, h, 4);
        pyrGeo.rotateY(Math.PI / 4);
        pyrGeo.translate(0, h / 2 - 2, 0);
        group.add(new THREE.Mesh(pyrGeo, createMaterial(0xf59e0b)));

        const wireGeo = new THREE.WireframeGeometry(pyrGeo);
        group.add(
          new THREE.LineSegments(
            wireGeo,
            new THREE.LineBasicMaterial({ color: 0xfbbf24, opacity: 0.6, transparent: true })
          )
        );
        break;
      }

      // 8. Triangular Prism
      case 'triangular_prism': {
        const side = 4;
        const len = 7;
        const prismGeo = new THREE.CylinderGeometry(side / Math.sqrt(3), side / Math.sqrt(3), len, 3);
        prismGeo.rotateZ(Math.PI / 2);
        group.add(new THREE.Mesh(prismGeo, createMaterial(0x06b6d4)));

        const wireGeo = new THREE.WireframeGeometry(prismGeo);
        group.add(
          new THREE.LineSegments(
            wireGeo,
            new THREE.LineBasicMaterial({ color: 0x38bdf8, opacity: 0.45, transparent: true })
          )
        );
        break;
      }

      // 9. 3D Torus
      case 'quadric_torus': {
        const R = parsedModel.dimensions?.radius || 5;
        const r = parsedModel.dimensions?.radius2 || 1.8;
        const torusGeo = new THREE.TorusGeometry(R, r, 24, 48);
        torusGeo.rotateX(Math.PI / 2);
        group.add(new THREE.Mesh(torusGeo, createMaterial(0xec4899)));
        break;
      }

      // 10. Ellipsoid (Rugby Ball)
      case 'quadric_ellipsoid': {
        const a = parsedModel.dimensions?.a || 6;
        const b = parsedModel.dimensions?.b || 4;
        const c = parsedModel.dimensions?.c || 3;
        const sphGeo = new THREE.SphereGeometry(1, 32, 24);
        sphGeo.scale(a * 0.7, b * 0.7, c * 0.7);
        group.add(new THREE.Mesh(sphGeo, createMaterial(0x10b981)));
        break;
      }

      // 11. Hyperboloid of One Sheet (Cooling Tower)
      case 'quadric_hyperboloid': {
        const a = parsedModel.dimensions?.radius || 4;
        const h = parsedModel.dimensions?.height || 10;
        // Ruled hyperboloid surface
        const segsU = 36;
        const segsV = 20;
        const geo = new THREE.BufferGeometry();
        const positions: number[] = [];
        const indices: number[] = [];

        for (let j = 0; j <= segsV; j++) {
          const v = -1.2 + (j / segsV) * 2.4;
          const z = v * (h / 2.4);
          const rAtZ = a * Math.sqrt(1 + (z * z) / (4 * 4));
          for (let i = 0; i <= segsU; i++) {
            const u = (i / segsU) * Math.PI * 2;
            positions.push(rAtZ * Math.cos(u), z, rAtZ * Math.sin(u));
          }
        }

        for (let j = 0; j < segsV; j++) {
          for (let i = 0; i < segsU; i++) {
            const aIdx = j * (segsU + 1) + i;
            const bIdx = (j + 1) * (segsU + 1) + i;
            const cIdx = (j + 1) * (segsU + 1) + (i + 1);
            const dIdx = j * (segsU + 1) + (i + 1);
            indices.push(aIdx, bIdx, dIdx);
            indices.push(bIdx, cIdx, dIdx);
          }
        }

        geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geo.setIndex(indices);
        geo.computeVertexNormals();
        group.add(new THREE.Mesh(geo, createMaterial(0x06b6d4)));
        break;
      }

      // 12. Standard 3D Heightfield Surface
      case 'surface_3d': {
        const segs = 48;
        const b = parsedModel.bounds;
        const width = b.maxX - b.minX;
        const depth = b.maxY - b.minY;
        const geo = new THREE.PlaneGeometry(width, depth, segs, segs);
        geo.rotateX(-Math.PI / 2);

        const pos = geo.attributes.position;
        const colors: number[] = [];
        const colorLow = new THREE.Color(0x06b6d4);
        const colorMid = new THREE.Color(0xf59e0b);
        const colorHigh = new THREE.Color(0xec4899);
        const evalFn = parsedModel.evaluator || ((x, y) => x * x - y * y);

        for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i);
          const zCoord = pos.getZ(i);
          let valY = evalFn(x, zCoord);

          if (valY > clipZ) valY = clipZ;
          if (valY < -clipZ) valY = -clipZ;

          pos.setY(i, valY);

          const normY = THREE.MathUtils.clamp((valY - b.minZ) / (b.maxZ - b.minZ || 1), 0, 1);
          const vColor = new THREE.Color();
          if (normY < 0.5) {
            vColor.lerpColors(colorLow, colorMid, normY * 2);
          } else {
            vColor.lerpColors(colorMid, colorHigh, (normY - 0.5) * 2);
          }
          colors.push(vColor.r, vColor.g, vColor.b);
        }

        geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geo.computeVertexNormals();

        const mesh = new THREE.Mesh(geo, createMaterial(0x06b6d4));
        group.add(mesh);

        const wireGeo = new THREE.WireframeGeometry(geo);
        group.add(
          new THREE.LineSegments(
            wireGeo,
            new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35 })
          )
        );
        break;
      }

      // 13. Sphere
      case 'quadric_sphere': {
        const r = parsedModel.dimensions?.radius || 5;
        const sphereGeo = new THREE.SphereGeometry(r, 36, 24);
        group.add(new THREE.Mesh(sphereGeo, createMaterial(0x06b6d4)));

        const ringGeo = new THREE.RingGeometry(r - 0.05, r + 0.05, 64);
        ringGeo.rotateX(Math.PI / 2);
        group.add(new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide })));
        break;
      }

      // 14. Cylinder
      case 'quadric_cylinder': {
        const r = parsedModel.dimensions?.radius || 4;
        const h = parsedModel.dimensions?.height || 8;
        const cylGeo = new THREE.CylinderGeometry(r, r, h, 36, 16);
        group.add(new THREE.Mesh(cylGeo, createMaterial(0x10b981)));
        break;
      }

      // 15. Cone
      case 'quadric_cone': {
        const r = parsedModel.dimensions?.radius || 4;
        const h = parsedModel.dimensions?.height || 7;
        const coneGeo = new THREE.ConeGeometry(r, h, 36, 16);
        coneGeo.translate(0, h / 2 - 2, 0);
        group.add(new THREE.Mesh(coneGeo, createMaterial(0xec4899)));
        break;
      }

      // 16. Inscribed Cylinder in Sphere
      case 'inscribed_composite': {
        const R = parsedModel.dimensions?.radius || 6;
        const r = parsedModel.dimensions?.radius2 || 4;
        const h = parsedModel.dimensions?.height || 2 * Math.sqrt(R * R - r * r);

        const sphGeo = new THREE.SphereGeometry(R, 32, 24);
        const sphMat = new THREE.MeshPhysicalMaterial({
          color: 0x06b6d4,
          transparent: true,
          opacity: 0.28,
          roughness: 0.1,
          depthWrite: false,
        });
        group.add(new THREE.Mesh(sphGeo, sphMat));

        const cylGeo = new THREE.CylinderGeometry(r, r, h, 32);
        group.add(new THREE.Mesh(cylGeo, createMaterial(0xf59e0b)));
        break;
      }

      // 17. Parabolic Arch
      case 'conic_parabola': {
        const span = parsedModel.dimensions?.width || 20;
        const height = parsedModel.dimensions?.height || 5;
        const halfSpan = span / 2;
        const aCoeff = height / (halfSpan * halfSpan);

        const shape = new THREE.Shape();
        const archPts = 40;
        shape.moveTo(-halfSpan, 0);
        for (let i = 0; i <= archPts; i++) {
          const x = -halfSpan + (i / archPts) * span;
          const y = height - aCoeff * x * x;
          shape.lineTo(x, y);
        }
        shape.lineTo(halfSpan, 0);
        shape.lineTo(-halfSpan, 0);

        const extrudeSettings = {
          depth: 3,
          bevelEnabled: true,
          bevelSegments: 3,
          steps: 1,
          bevelSize: 0.2,
          bevelThickness: 0.2,
        };
        const archGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        archGeo.center();
        archGeo.translate(0, height / 2 - 2, 0);

        group.add(new THREE.Mesh(archGeo, createMaterial(0x14b8a6)));
        break;
      }

      // 18. Conic Circle
      case 'conic_circle': {
        const r = parsedModel.dimensions?.radius || 5;
        const circleShape = new THREE.Shape();
        circleShape.absarc(0, 0, r, 0, Math.PI * 2, false);

        const extrudeGeo = new THREE.ExtrudeGeometry(circleShape, {
          depth: 0.8,
          bevelEnabled: true,
          bevelThickness: 0.1,
          bevelSize: 0.1,
        });
        extrudeGeo.rotateX(-Math.PI / 2);
        group.add(new THREE.Mesh(extrudeGeo, createMaterial(0x06b6d4)));
        break;
      }

      // 19. Rhombus
      case 'polygon_rhombus': {
        const d1 = parsedModel.dimensions?.d1 || 10;
        const d2 = parsedModel.dimensions?.d2 || 6;
        const shape = new THREE.Shape();
        shape.moveTo(-d1 / 2, 0);
        shape.lineTo(0, d2 / 2);
        shape.lineTo(d1 / 2, 0);
        shape.lineTo(0, -d2 / 2);
        shape.closePath();

        const extrudeGeo = new THREE.ExtrudeGeometry(shape, {
          depth: 0.6,
          bevelEnabled: true,
          bevelSize: 0.15,
          bevelThickness: 0.15,
        });
        extrudeGeo.rotateX(-Math.PI / 2);
        group.add(new THREE.Mesh(extrudeGeo, createMaterial(0xec4899)));
        break;
      }

      // 20. Parallelogram
      case 'polygon_parallelogram': {
        const base = parsedModel.dimensions?.base || 8;
        const h = parsedModel.dimensions?.height || 5;
        const skew = parsedModel.dimensions?.skew || 2.5;

        const shape = new THREE.Shape();
        shape.moveTo(-base / 2, -h / 2);
        shape.lineTo(base / 2, -h / 2);
        shape.lineTo(base / 2 + skew, h / 2);
        shape.lineTo(-base / 2 + skew, h / 2);
        shape.closePath();

        const extrudeGeo = new THREE.ExtrudeGeometry(shape, {
          depth: 0.6,
          bevelEnabled: true,
          bevelSize: 0.15,
          bevelThickness: 0.15,
        });
        extrudeGeo.rotateX(-Math.PI / 2);
        group.add(new THREE.Mesh(extrudeGeo, createMaterial(0x8b5cf6)));
        break;
      }

      default: {
        const box = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 4), createMaterial(0x06b6d4));
        group.add(box);
        break;
      }
    }

    // Key 3D Feature Nodes
    if (showKeyPoints && parsedModel.keyPoints) {
      parsedModel.keyPoints.forEach((pt) => {
        const sphereGeo = new THREE.SphereGeometry(0.22, 16, 16);
        const sphereMat = new THREE.MeshBasicMaterial({
          color: pt.color ? new THREE.Color(pt.color) : 0xffffff,
        });
        const marker = new THREE.Mesh(sphereGeo, sphereMat);
        marker.position.set(pt.x, pt.y, pt.z);
        pointsGroup.add(marker);

        // Pulsing halo ring
        const haloGeo = new THREE.RingGeometry(0.35, 0.45, 24);
        const haloMat = new THREE.MeshBasicMaterial({
          color: pt.color ? new THREE.Color(pt.color) : 0x06b6d4,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.6,
        });
        const halo = new THREE.Mesh(haloGeo, haloMat);
        halo.position.set(pt.x, pt.y, pt.z);
        halo.lookAt(cameraRef.current ? cameraRef.current.position : new THREE.Vector3(10, 10, 10));
        pointsGroup.add(halo);
      });
    }
  }, [parsedModel, renderStyle, clipZ, showKeyPoints]);

  // Toggle visual helpers
  useEffect(() => {
    if (!sceneRef.current) return;
    const axes = sceneRef.current.getObjectByName('axes_helper');
    if (axes) axes.visible = showAxes;

    sceneRef.current.traverse((obj) => {
      if (obj instanceof THREE.GridHelper) {
        obj.visible = showGrid;
      }
    });

    if (pointsGroupRef.current) {
      pointsGroupRef.current.visible = showKeyPoints;
    }
  }, [showAxes, showGrid, showKeyPoints]);

  // Render 2D CAD Blueprint view onto the 2D canvas
  useEffect(() => {
    if (viewMode === '3d') return;
    const canvas = canvas2dRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Dark CAD grid
    ctx.fillStyle = '#060a17';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Cartesian Axes
    const cx = w / 2;
    const cy = h / 2;

    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(w, cy);
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, h);
    ctx.stroke();

    // Blueprint schematic text
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(`CAD ORTHOGRAPHIC PROJECTION: ${parsedModel.title}`, 20, 30);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.fillText(`Standard: ${parsedModel.standardEquation}`, 20, 48);
    ctx.fillText(`CBSE Chapter: ${parsedModel.cbseChapter}`, 20, 64);

    // Draw central blueprint contours
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 70, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#f59e0b';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(cx, cy, 40, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }, [viewMode, parsedModel]);

  const handleExecuteQuery = (textToRun: string) => {
    if (!textToRun.trim()) return;
    setCurrentQuery(textToRun.trim());
  };

  const handleCopyEquation = () => {
    navigator.clipboard.writeText(parsedModel.standardEquation);
    setCopiedEquation(true);
    setTimeout(() => setCopiedEquation(false), 2000);
  };

  const handleHearVoiceExplanation = () => {
    speechSynthesizer.speak(parsedModel.voiceExplanation);
  };

  const handleDownloadSnapshot = () => {
    const renderer = rendererRef.current;
    if (!renderer) return;
    const dataUrl = renderer.domElement.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `MathLens_3D_${parsedModel.type}.png`;
    a.click();
  };

  const setCameraView = (view: 'isometric' | 'top' | 'front' | 'side') => {
    const sph = cameraSphericalRef.current;
    switch (view) {
      case 'isometric':
        sph.theta = Math.PI / 4;
        sph.phi = Math.PI / 3;
        sph.radius = 14;
        break;
      case 'top':
        sph.theta = 0;
        sph.phi = 0.05;
        sph.radius = 16;
        break;
      case 'front':
        sph.theta = 0;
        sph.phi = Math.PI / 2;
        sph.radius = 14;
        break;
      case 'side':
        sph.theta = Math.PI / 2;
        sph.phi = Math.PI / 2;
        sph.radius = 14;
        break;
    }
    updateCameraPosition();
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* 1. Header Banner & Query Console */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 rounded-3xl border border-cyan-500/30 p-5 shadow-2xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-96 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col gap-4 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <Rotate3d className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
                  <span>3D Mathematical Equation & Question Studio</span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono uppercase">
                    CBSE Class 9 & 10 + Conics
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Type any algebraic equation ($z = x^2 - y^2$, $\sin(x)\cos(y)$) or any CBSE word problem.
                  Visual 3D image diagrams appear instantly alongside the real-time WebGL stage!
                </p>
              </div>
            </div>

            {onNavigateToVision && (
              <button
                onClick={onNavigateToVision}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span>Return to Vision Lens</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search / Equation Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleExecuteQuery(queryInput);
            }}
            className="flex flex-col sm:flex-row items-center gap-2.5"
          >
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Enter equation (e.g. z = x^2 - y^2) or question (e.g. A medicine capsule of length 14mm and diameter 5mm...)"
                className="w-full bg-slate-950/90 text-sm font-mono text-cyan-200 placeholder:text-slate-500 pl-4 pr-12 py-3 rounded-xl border border-cyan-800/80 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 transition-all shadow-inner"
              />
              <span className="absolute right-3 top-3 text-xs font-mono text-slate-500">
                f(x,y)
              </span>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Simulate & Solve in 3D</span>
            </button>
          </form>

          {/* Quick Syntax Helper Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
            <span className="font-semibold text-slate-300">Quick Math Tokens:</span>
            {[
              { label: 'x²', token: 'x^2' },
              { label: 'y²', token: 'y^2' },
              { label: 'z²', token: 'z^2' },
              { label: '√()', token: 'sqrt(' },
              { label: 'sin()', token: 'sin(' },
              { label: 'cos()', token: 'cos(' },
              { label: 'π', token: 'pi' },
              { label: 'Capsule', token: 'A medicine capsule of length 14mm and diameter 5mm' },
              { label: 'Toy', token: 'A toy in the form of a cone of radius 3.5cm mounted on hemisphere' },
              { label: 'Frustum', token: 'A drinking glass in the shape of a frustum of height 14cm' },
            ].map((op) => (
              <button
                key={op.label}
                type="button"
                onClick={() => {
                  if (op.token.length > 15) {
                    setQueryInput(op.token);
                    handleExecuteQuery(op.token);
                  } else {
                    setQueryInput((prev) => prev + op.token);
                  }
                }}
                className="px-2 py-0.5 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 font-mono border border-slate-700/80 transition-colors cursor-pointer"
              >
                {op.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. ACTIVE PROBLEM CHALLENGE & 3D SCHEMATIC DIAGRAM CARD */}
      <div className="bg-slate-900/95 rounded-3xl border border-cyan-500/40 p-5 shadow-2xl flex flex-col gap-4 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-display">
              Active Question & 3D Architectural Blueprint:
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
              {parsedModel.cbseTopic}
            </span>
            <button
              onClick={handleHearVoiceExplanation}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-all cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Voice Tutor</span>
            </button>
          </div>
        </div>

        {/* Dual Grid: 3D Schematic Diagram (Left) + Problem Formulation & Metrics (Right) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
          {/* Left Column: Isometric 3D Diagram Schematic (5 cols) */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <QuestionDiagram3D
              model={parsedModel}
              className="h-full min-h-[220px]"
              showDetails={true}
            />
          </div>

          {/* Right Column: Problem Statement & Given Values (7 cols) */}
          <div className="md:col-span-7 flex flex-col justify-between bg-slate-950/80 rounded-2xl border border-slate-800/80 p-4 gap-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Problem Prompt & Given Data:
                </span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                  {parsedModel.cbseChapter}
                </span>
              </div>

              <p className="text-sm text-slate-200 leading-relaxed font-sans bg-slate-900/60 p-3 rounded-xl border border-slate-800/60">
                {parsedModel.questionChallenge?.problemText || parsedModel.input}
              </p>
            </div>

            {/* Quick Metrics & Formula Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Standard Form</span>
                <strong className="text-cyan-300 font-mono text-xs truncate block" title={parsedModel.standardEquation}>
                  {parsedModel.standardEquation}
                </strong>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Model Type</span>
                <strong className="text-emerald-400 font-mono text-xs block">
                  {parsedModel.type.toUpperCase()}
                </strong>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Primary Target</span>
                <strong className="text-amber-300 font-mono text-xs truncate block" title={parsedModel.questionChallenge?.toFind || 'Evaluate Surface'}>
                  {parsedModel.questionChallenge?.toFind || '3D Geometry Mesh'}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. CURATED 3D EQUATIONS & CBSE PROBLEMS CAROUSEL (32+ QUESTIONS) */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-4 shadow-xl flex flex-col gap-3">
        {/* Drawer Header with Category Filters & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-display">
              Curated 3D Equations & CBSE Problems ({filteredQuestions.length} of {CURATED_QUESTIONS.length})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search 32+ questions..."
                className="pl-8 pr-7 py-1.5 bg-slate-950 text-xs rounded-xl border border-slate-700 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 w-44 sm:w-56"
              />
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter('')}
                  className="absolute right-2 top-2 text-slate-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <button
              onClick={() => setIsCuratedDrawerOpen((prev) => !prev)}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold cursor-pointer"
            >
              {isCuratedDrawerOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        {isCuratedDrawerOpen && (
          <div className="flex flex-wrap items-center gap-1.5 pb-2">
            {[
              { id: 'all', label: 'All Problems (32)' },
              { id: 'CBSE Class 10 Mensuration', label: 'Class 10 Mensuration (8)' },
              { id: 'CBSE Conics & Arches', label: 'Conics & Arches (6)' },
              { id: 'CBSE Trigonometry 3D', label: 'Trigonometry 3D (4)' },
              { id: 'Quadrilaterals', label: 'Quadrilaterals (4)' },
              { id: 'Calculus & Quadrics', label: 'Calculus & Quadrics (7)' },
              { id: 'Architecture & Real World', label: 'Architecture (3)' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Question Cards Grid */}
        {isCuratedDrawerOpen && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
            {filteredQuestions.map((item) => {
              const isSelected = currentQuery === item.query;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setQueryInput(item.query);
                    handleExecuteQuery(item.query);
                  }}
                  className={`p-3 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between gap-2.5 group ${
                    isSelected
                      ? 'bg-gradient-to-br from-cyan-950/80 to-slate-900 border-cyan-400 shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-400/50'
                      : 'bg-slate-950/80 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/90'
                  }`}
                >
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xl group-hover:scale-110 transition-transform">
                        {item.icon}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          item.difficulty === 'Board Exam'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : item.difficulty === 'HOTS'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        }`}
                      >
                        {item.difficulty}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors line-clamp-1">
                      {item.label}
                    </h4>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight">
                      {item.query}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px]">
                    <span className="text-slate-500 font-mono">{item.cbseClass}</span>
                    <span className="text-cyan-400 group-hover:translate-x-0.5 transition-transform font-semibold flex items-center gap-1">
                      <span>View in 3D</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. MAIN 3D VIEWPORT STAGE & DERIVATION INSPECTOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Interactive 3D WebGL Canvas (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl relative flex flex-col">
            {/* Viewport Top Bar */}
            <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 z-10">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span className="text-xs font-bold font-display text-white truncate">
                  {parsedModel.title}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
                  {parsedModel.standardEquation}
                </span>
              </div>

              {/* View Tabs: 3D Scene / 2D CAD Orthographic / Split */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setViewMode('3d')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    viewMode === '3d'
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  3D WebGL
                </button>
                <button
                  onClick={() => setViewMode('2d_cad')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    viewMode === '2d_cad'
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  2D CAD Projection
                </button>
                <button
                  onClick={() => setViewMode('split')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    viewMode === 'split'
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Dual Split
                </button>
              </div>
            </div>

            {/* Viewport Canvas Area */}
            <div className="relative w-full h-[520px] bg-slate-950 select-none overflow-hidden">
              {/* 3D WebGL Canvas Container */}
              <div
                ref={mountRef}
                className={`w-full h-full ${viewMode === '2d_cad' ? 'hidden' : 'block'} ${
                  viewMode === 'split' ? 'w-1/2 float-left border-r border-slate-800' : ''
                }`}
              />

              {/* 2D CAD Canvas */}
              <div
                className={`w-full h-full ${viewMode === '3d' ? 'hidden' : 'block'} ${
                  viewMode === 'split' ? 'w-1/2 float-right' : ''
                }`}
              >
                <canvas
                  ref={canvas2dRef}
                  width={viewMode === 'split' ? 420 : 800}
                  height={520}
                  className="w-full h-full block"
                />
              </div>

              {/* Floating Camera View Indicator / Gizmo (Top Left) */}
              <div className="absolute top-3 left-3 bg-slate-900/85 border border-slate-800/90 rounded-xl p-1.5 flex items-center gap-1 text-[11px] text-slate-300 pointer-events-auto shadow-lg backdrop-blur-sm">
                <span className="text-[10px] uppercase font-bold text-slate-400 px-1">Views:</span>
                <button
                  onClick={() => setCameraView('isometric')}
                  className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold cursor-pointer"
                >
                  Iso
                </button>
                <button
                  onClick={() => setCameraView('top')}
                  className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                >
                  Top (XY)
                </button>
                <button
                  onClick={() => setCameraView('front')}
                  className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                >
                  Front (XZ)
                </button>
                <button
                  onClick={() => setCameraView('side')}
                  className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                >
                  Side (YZ)
                </button>
              </div>

              {/* Quick Actions (Top Right) */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 pointer-events-auto">
                <button
                  onClick={() => setAutoRotate((prev) => !prev)}
                  title={autoRotate ? 'Pause 3D Auto-Rotation' : 'Resume 3D Auto-Rotation'}
                  className={`p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    autoRotate
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={handleDownloadSnapshot}
                  title="Download High-Res 3D Snapshot"
                  className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-300 transition-all shadow-md cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* COLLAPSIBLE BOTTOM DOCK */}
              <div
                className={`absolute bottom-3 left-1/2 -translate-x-1/2 w-[95%] max-w-[720px] transition-all duration-300 pointer-events-auto z-20 ${
                  isHudCollapsed ? 'translate-y-[calc(100%-32px)]' : 'translate-y-0'
                }`}
              >
                {/* Collapse / Expand Toggle Button */}
                <div className="flex justify-center -mb-2 relative z-30">
                  <button
                    onClick={() => setIsHudCollapsed((prev) => !prev)}
                    className="flex items-center gap-1 px-3 py-1 bg-slate-900 text-[10px] font-bold text-slate-400 hover:text-cyan-300 rounded-t-xl border-t border-x border-slate-800 shadow-md transition-colors uppercase tracking-wider cursor-pointer"
                  >
                    {isHudCollapsed ? (
                      <>
                        <ChevronUp className="w-3 h-3 text-cyan-400" />
                        <span>Show 3D Studio Dock</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3 h-3 text-cyan-400" />
                        <span>Hide Dock (Zen Mode)</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Glassmorphic Dock Container */}
                <div className="bg-slate-900/95 border border-slate-800/90 rounded-2xl p-3 shadow-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
                  {/* Style Mode Swatches */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Style:</span>
                    <button
                      onClick={() => setRenderStyle('heatmap')}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                        renderStyle === 'heatmap'
                          ? 'bg-gradient-to-r from-cyan-500 to-amber-500 text-slate-950 font-bold shadow-sm'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      Heatmap
                    </button>
                    <button
                      onClick={() => setRenderStyle('wireframe')}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                        renderStyle === 'wireframe'
                          ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      Wireframe
                    </button>
                    <button
                      onClick={() => setRenderStyle('shaded')}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                        renderStyle === 'shaded'
                          ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      Solid Matte
                    </button>
                    <button
                      onClick={() => setRenderStyle('xray')}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                        renderStyle === 'xray'
                          ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      X-Ray Glass
                    </button>
                  </div>

                  {/* Toggle Checkers */}
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
                      <input
                        type="checkbox"
                        checked={showAxes}
                        onChange={(e) => setShowAxes(e.target.checked)}
                        className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                      />
                      <span>XYZ Axes</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
                      <input
                        type="checkbox"
                        checked={showGrid}
                        onChange={(e) => setShowGrid(e.target.checked)}
                        className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                      />
                      <span>Grid</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
                      <input
                        type="checkbox"
                        checked={showKeyPoints}
                        onChange={(e) => setShowKeyPoints(e.target.checked)}
                        className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                      />
                      <span>Nodes</span>
                    </label>
                  </div>

                  {/* Cross-Section Slice Slider */}
                  {parsedModel.type === 'surface_3d' && (
                    <div className="flex items-center gap-2 text-[11px] w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-slate-800 pt-2 sm:pt-0 sm:pl-3">
                      <span className="text-slate-400 whitespace-nowrap">Z-Clipping:</span>
                      <input
                        type="range"
                        min={1}
                        max={10}
                        step={0.5}
                        value={clipZ}
                        onChange={(e) => setClipZ(parseFloat(e.target.value))}
                        className="w-20 accent-cyan-400 cursor-pointer"
                      />
                      <span className="font-mono text-cyan-300">±{clipZ}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Viewport Footer Information */}
            <div className="bg-slate-900 border-t border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
              <div className="flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-cyan-400" />
                <span>
                  <strong>Interactive 3D Navigation:</strong> Left-click & drag to orbit rotate. Scroll to zoom in/out.
                </span>
              </div>
              <span className="text-cyan-300 font-mono">
                Model: {parsedModel.type.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Mathematical Derivation & CBSE NCERT Curriculum Panel (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Card 1: Standard Form & Quick Copy */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-display">
                Mathematical Model:
              </span>
              <button
                onClick={handleCopyEquation}
                className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
              >
                {copiedEquation ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy LaTeX</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 font-mono text-cyan-300 text-sm tracking-wide break-all text-center shadow-inner">
              {parsedModel.standardEquation}
            </div>

            {parsedModel.parametricFormula && (
              <div className="text-[11px] text-slate-400 font-mono bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                Parametric: {parsedModel.parametricFormula}
              </div>
            )}

            <p className="text-xs text-slate-300 leading-relaxed">
              {parsedModel.subtitle}
            </p>
          </div>

          {/* Card 2: Geometric & Algebraic Properties */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl flex flex-col gap-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-display flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              Calculated Parameters & Metrics:
            </h3>

            <div className="grid grid-cols-1 gap-2">
              {parsedModel.properties.map((prop, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 flex flex-col gap-0.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">{prop.label}:</span>
                    <strong className="text-cyan-300 font-mono font-bold">{prop.value}</strong>
                  </div>
                  {prop.detail && (
                    <span className="text-[10px] text-slate-500 leading-tight">
                      {prop.detail}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: CBSE NCERT Curriculum Mapping & Derivation */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950/40 rounded-2xl border border-indigo-900/50 p-4 shadow-xl flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-indigo-900/40 pb-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <div>
                <h4 className="text-xs font-bold text-white font-display">
                  {parsedModel.cbseTopic}
                </h4>
                <p className="text-[10px] text-slate-400">{parsedModel.cbseChapter}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                Step-by-Step Derivation:
              </span>
              <div className="flex flex-col gap-1.5 text-xs text-slate-300 leading-relaxed">
                {parsedModel.stepByStep.map((step, idx) => (
                  <div key={idx} className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                    {step}
                  </div>
                ))}
              </div>
            </div>

            {/* AI Voice Explanation Player */}
            <div className="mt-1 pt-3 border-t border-indigo-900/40 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <span>Hear 3D Audio Lesson</span>
              </div>
              <button
                onClick={handleHearVoiceExplanation}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
              >
                Play Audio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
