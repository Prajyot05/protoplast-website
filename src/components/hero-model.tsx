"use client";

import { Canvas } from "@react-three/fiber";
import { useGLTF, Float, Stage, OrbitControls } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";

function Model() {
  const { scene } = useGLTF("/3d-model.glb");
  return <primitive object={scene} />;
}

export default function HeroModel() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full h-[400px] md:h-[500px] lg:h-[650px] relative cursor-grab active:cursor-grabbing touch-none">
      {/* Optional soft glowing background behind the model */}
      <div className="absolute inset-0 bg-gradient-to-tr from-green-500/10 via-transparent to-blue-500/10 rounded-full blur-3xl -z-10 animate-pulse" />

      <Canvas
        camera={{ position: [0, 1, 6], fov: 45 }}
        dpr={[1, 2]} // Optimal performance on retina displays
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <Stage environment="city" intensity={0.5} adjustCamera={1.4}>
              <Model />
            </Stage>
          </Float>

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={1.5}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Preload for better performance
if (typeof window !== "undefined") {
  useGLTF.preload("/3d-model.glb");
}
