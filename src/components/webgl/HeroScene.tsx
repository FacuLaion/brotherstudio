"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  Icosahedron,
  MeshDistortMaterial,
  Sparkles,
  AdaptiveDpr,
  PerformanceMonitor,
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { headState } from "@/lib/immersive";

type PointerRef = React.RefObject<{ x: number; y: number }>;

function Blob({ pointer }: { pointer: PointerRef }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const scroll =
      typeof window !== "undefined" ? window.scrollY / Math.max(window.innerHeight, 1) : 0;
    const g = group.current;
    if (!g) return;

    // Input source: head when immersive mode is active, otherwise the mouse.
    const sx = headState.active ? headState.x : pointer.current.x;
    const sy = headState.active ? headState.y : pointer.current.y;

    const active = headState.active;
    g.rotation.y = t * 0.12 + scroll * 1.2;
    g.rotation.x = Math.sin(t * 0.2) * 0.12 + scroll * 0.4;
    g.position.x = THREE.MathUtils.lerp(g.position.x, sx * (active ? 0.9 : 0.5), 0.08);
    g.position.y = THREE.MathUtils.lerp(g.position.y, sy * (active ? 0.6 : 0.35), 0.08);

    // Head-coupled camera: pronounced "look around" parallax when head-tracking is on.
    const cam = state.camera;
    const reach = active ? 2.6 : 0.4;
    cam.position.x = THREE.MathUtils.lerp(cam.position.x, sx * reach, 0.08);
    cam.position.y = THREE.MathUtils.lerp(cam.position.y, sy * reach * 0.7, 0.08);
    cam.lookAt(0, 0, 0);
  });

  return (
    <group ref={group}>
      <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.7}>
        <Icosahedron args={[1.6, 16]}>
          <MeshDistortMaterial
            color="#16181d"
            emissive="#de4959"
            emissiveIntensity={0.14}
            roughness={0.22}
            metalness={0.72}
            distort={0.36}
            speed={1.6}
          />
        </Icosahedron>
        <Icosahedron args={[1.74, 4]}>
          <meshBasicMaterial color="#de4959" wireframe transparent opacity={0.1} />
        </Icosahedron>
      </Float>
      <Sparkles count={120} scale={[14, 10, 6]} size={2} speed={0.22} color="#9aa0a8" opacity={0.5} />
    </group>
  );
}

export default function HeroScene() {
  const pointer = useRef({ x: 0, y: 0 });
  const [dpr, setDpr] = useState<number>(1.5);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} />
      <AdaptiveDpr pixelated />
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 3, 3]} intensity={1.1} />
      <pointLight position={[-4, -2, -2]} intensity={2.4} color="#de4959" />
      <Blob pointer={pointer} />
      <EffectComposer>
        <Bloom intensity={0.75} luminanceThreshold={0.2} luminanceSmoothing={0.4} mipmapBlur />
        <Vignette offset={0.22} darkness={0.92} eskil={false} />
      </EffectComposer>
    </Canvas>
  );
}
