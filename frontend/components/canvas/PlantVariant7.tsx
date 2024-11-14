import React, { Suspense, useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";
import { useRouter } from "next/router";

interface VetplantProps {
  isMobile: boolean;
}

const Vetplant: React.FC<VetplantProps> = ({ isMobile }) => {
  const router = useRouter();
  const { locale } = router;
  const [language, setLanguage] = useState(locale !== "en");

  const plant = useGLTF(
    language
      ? "../../models/low_poly_cactus/scene.gltf"
      : "../models/low_poly_cactus/scene.gltf"
  );

  const [rotationY, setRotationY] = useState(0);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    const targetRotation = Math.PI / 5; // Desired final rotation (adjust as needed)
    const newRotation = (elapsedTime * Math.PI) / 10; // Adjust rotation speed as needed
    setRotationY(newRotation);
  });

  return (
    <group>
      <hemisphereLight intensity={0.15} groundColor="black" />
      <pointLight intensity={5} />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={10}
        castShadow
        shadow-mapSize={1024}
      />
      <directionalLight
        position={[10, 10, 10]}
        intensity={3.4}
        castShadow
        shadow-mapSize={2048}
      />
      <primitive
        object={plant.scene}
        scale={isMobile ? 1.5 : 2}
        position={isMobile ? [0, -0.4, 0] : [0, -1, 0]}
        rotation={[0, rotationY, 0]}
      />
    </group>
  );
};

const VetplantCanvas: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 500px)");

    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <Canvas
      frameloop="demand"
      shadows
      dpr={[1, 2]}
      camera={{ position: [20, 7, 5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <Vetplant isMobile={isMobile} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default VetplantCanvas;
