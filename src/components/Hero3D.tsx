import { useEffect, useRef } from "react";
import * as THREE from "three";

interface Hero3DProps {
  className?: string;
  onUnsupported?: () => void;
}

// Soft round sprite so points render as glowing dots instead of squares
function makeGlowTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(255,255,255,0.8)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// One node per trade course, spread evenly over a sphere
const NODE_COLORS = [0xf59e0b, 0x818cf8, 0xf43f5e, 0x22d3ee, 0x34d399, 0x38bdf8, 0xc084fc, 0xfb923c];

export default function Hero3D({ className, onUnsupported }: Hero3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      onUnsupported?.();
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 10);

    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(o: T) => { disposables.push(o); return o; };

    // ── Lights ──────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x6688cc, 0.6));
    const keyLight = new THREE.PointLight(0x00d4ff, 40, 30);
    keyLight.position.set(4, 3, 5);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0xa855f7, 30, 30);
    rimLight.position.set(-5, -2, 3);
    scene.add(rimLight);

    const root = new THREE.Group();
    scene.add(root);

    // ── Core: faceted crystal + wire cage + glowing heart ───────────────
    const coreGeo = track(new THREE.IcosahedronGeometry(1.25, 1));
    const coreMat = track(new THREE.MeshStandardMaterial({
      color: 0x1a4a9c, metalness: 0.55, roughness: 0.15, flatShading: true,
      emissive: 0x0a5cff, emissiveIntensity: 0.4, transparent: true, opacity: 0.92,
    }));
    const core = new THREE.Mesh(coreGeo, coreMat);
    root.add(core);

    const cageGeo = track(new THREE.WireframeGeometry(track(new THREE.IcosahedronGeometry(1.6, 1))));
    const cageMat = track(new THREE.LineBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending }));
    const cage = new THREE.LineSegments(cageGeo, cageMat);
    root.add(cage);

    const glowTex = track(makeGlowTexture());
    const heart = new THREE.Sprite(track(new THREE.SpriteMaterial({
      map: glowTex, color: 0x33ddff, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false,
    })));
    heart.scale.setScalar(4.2);
    root.add(heart);

    // ── Orbital rings with travelling electrons ─────────────────────────
    const ringSpecs = [
      { radius: 2.3, tilt: [1.2, 0.2, 0], color: 0x00d4ff, speed: 0.9 },
      { radius: 2.7, tilt: [0.4, 1.1, 0.3], color: 0xa855f7, speed: -0.65 },
      { radius: 3.1, tilt: [-0.6, 0.5, 1.0], color: 0x22d3ee, speed: 0.5 },
    ];
    const electrons: { mesh: THREE.Sprite; ring: THREE.Group; radius: number; speed: number; phase: number }[] = [];
    ringSpecs.forEach((spec, i) => {
      const ringGroup = new THREE.Group();
      ringGroup.rotation.set(spec.tilt[0], spec.tilt[1], spec.tilt[2]);
      const torus = new THREE.Mesh(
        track(new THREE.TorusGeometry(spec.radius, 0.008, 8, 160)),
        track(new THREE.MeshBasicMaterial({ color: spec.color, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending }))
      );
      ringGroup.add(torus);
      const e = new THREE.Sprite(track(new THREE.SpriteMaterial({
        map: glowTex, color: spec.color, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
      })));
      e.scale.setScalar(0.55);
      ringGroup.add(e);
      root.add(ringGroup);
      electrons.push({ mesh: e, ring: ringGroup, radius: spec.radius, speed: spec.speed, phase: i * 2.1 });
    });

    // ── Trade nodes connected to the core ───────────────────────────────
    const nodeGeo = track(new THREE.OctahedronGeometry(0.16, 0));
    const nodes: { mesh: THREE.Mesh; halo: THREE.Sprite; base: THREE.Vector3; phase: number }[] = [];
    const linePositions: number[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    NODE_COLORS.forEach((color, i) => {
      const y = 1 - (i / (NODE_COLORS.length - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      const pos = new THREE.Vector3(Math.cos(theta) * r, y * 0.8, Math.sin(theta) * r).multiplyScalar(3.7);
      const mesh = new THREE.Mesh(nodeGeo, track(new THREE.MeshStandardMaterial({
        color, emissive: color, emissiveIntensity: 0.8, metalness: 0.4, roughness: 0.3,
      })));
      mesh.position.copy(pos);
      const halo = new THREE.Sprite(track(new THREE.SpriteMaterial({
        map: glowTex, color, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false,
      })));
      halo.scale.setScalar(0.9);
      halo.position.copy(pos);
      root.add(mesh, halo);
      nodes.push({ mesh, halo, base: pos.clone(), phase: i * 0.8 });
      linePositions.push(0, 0, 0, pos.x, pos.y, pos.z);
    });
    const linkGeo = track(new THREE.BufferGeometry());
    linkGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
    const links = new THREE.LineSegments(linkGeo, track(new THREE.LineBasicMaterial({
      color: 0x3b82f6, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending,
    })));
    root.add(links);

    // ── Particle field ──────────────────────────────────────────────────
    const PARTICLES = window.innerWidth < 768 ? 500 : 1100;
    const pPos = new Float32Array(PARTICLES * 3);
    const pCol = new Float32Array(PARTICLES * 3);
    const cA = new THREE.Color(0x00d4ff), cB = new THREE.Color(0xa855f7), tmp = new THREE.Color();
    for (let i = 0; i < PARTICLES; i++) {
      const rad = 4.5 + Math.random() * 7;
      const u = Math.random() * 2 - 1, phi = Math.random() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      pPos.set([Math.cos(phi) * s * rad, u * rad * 0.6, Math.sin(phi) * s * rad], i * 3);
      tmp.copy(cA).lerp(cB, Math.random());
      pCol.set([tmp.r, tmp.g, tmp.b], i * 3);
    }
    const pGeo = track(new THREE.BufferGeometry());
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(pCol, 3));
    const particles = new THREE.Points(pGeo, track(new THREE.PointsMaterial({
      size: 0.07, map: glowTex, vertexColors: true, transparent: true, opacity: 0.8,
      blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
    })));
    scene.add(particles);

    // ── Sizing ──────────────────────────────────────────────────────────
    const resize = () => {
      const w = mount.clientWidth || 1, h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      camera.aspect = w / h;
      // Pull back on narrow viewports so the whole scene stays in frame
      camera.position.z = w / h < 1 ? 13 : 10;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    // ── Interaction ─────────────────────────────────────────────────────
    const pointer = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    // ── Loop (paused when hidden or scrolled out of view) ───────────────
    let visible = true;
    let raf = 0;
    const clock = new THREE.Clock();
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf && !reducedMotion) { clock.getDelta(); raf = requestAnimationFrame(tick); }
    });
    io.observe(mount);

    function renderFrame(t: number) {
      const motion = reducedMotion ? 0 : 1;
      root.rotation.y += ((pointer.x * 0.5 + t * 0.12 * motion) - root.rotation.y) * 0.04;
      root.rotation.x += ((pointer.y * 0.3) - root.rotation.x) * 0.04;

      core.rotation.set(t * 0.25, t * 0.35, 0);
      cage.rotation.set(-t * 0.15, -t * 0.2, 0);
      const pulse = 1 + Math.sin(t * 2) * 0.06;
      heart.scale.setScalar(4.2 * pulse);
      coreMat.emissiveIntensity = 0.4 + Math.sin(t * 2) * 0.15;

      electrons.forEach((e) => {
        const a = t * e.speed + e.phase;
        e.mesh.position.set(Math.cos(a) * e.radius, Math.sin(a) * e.radius, 0);
      });
      nodes.forEach((n) => {
        const bob = Math.sin(t * 1.4 + n.phase) * 0.12;
        n.mesh.position.set(n.base.x, n.base.y + bob, n.base.z);
        n.halo.position.copy(n.mesh.position);
        n.mesh.rotation.y = t * 1.2 + n.phase;
      });
      particles.rotation.y = t * 0.02;
      particles.rotation.x = Math.sin(t * 0.05) * 0.1;

      renderer.render(scene, camera);
    }

    function tick() {
      raf = 0;
      if (!visible || document.hidden) return;
      renderFrame(clock.getElapsedTime());
      raf = requestAnimationFrame(tick);
    }

    const onVisibility = () => {
      if (!document.hidden && visible && !raf && !reducedMotion) raf = requestAnimationFrame(tick);
    };
    document.addEventListener("visibilitychange", onVisibility);

    if (reducedMotion) renderFrame(0);
    else raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [onUnsupported]);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}
