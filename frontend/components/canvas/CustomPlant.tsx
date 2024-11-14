import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { Suspense, useEffect, useState } from "react";

import { PlantModel } from "@/types";
import CanvasLoader from "../Loader";

interface CustomPlantProps {
  modelUrl: string;
  plantModel: PlantModel;
}

const CustomPlant: React.FC<CustomPlantProps> = ({ plantModel, modelUrl }) => {
  const plant = useGLTF(modelUrl);

  const [rotationY, setRotationY] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setRotationY((prevRotation) => prevRotation + 0.01); // Increment rotation
    }, 50);

    return () => clearInterval(timer);
  }, []);

  return (
    <group position={[0, -2, 0]}>
      <primitive
        object={plant.scene}
        scale={plantModel.scale}
        position={[plantModel.x, plantModel.y, plantModel.z]}
        rotation={[0, rotationY, 0]}
        castShadow
      />
      <mesh
        receiveShadow
        castShadow
        rotation={[-Math.PI / 2, 0, 0]} // Rotate the plane to make it horizontal
        position={[plantModel.x, 0, plantModel.z]} // Adjust Y position as needed
      >
        <circleGeometry args={[5, 32]} />{" "}
        <meshBasicMaterial color="#3B733E" transparent opacity={0.5} />
      </mesh>
    </group>
  );
};

const PlantCanvas: React.FC<CustomPlantProps> = ({ plantModel, modelUrl }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false); // Simulate loading completion
  }, []);

  return (
    <Canvas
      frameloop="demand"
      shadows
      camera={{
        position: [40, 10, 0],
        fov: 20,
      }}
    >
      {" "}
      <directionalLight
        position={[20, 40, 20]}
        intensity={5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.001}
      />
      <ambientLight intensity={0.5} />
      <OrbitControls />
      <Suspense fallback={<CanvasLoader />}>
        {!loading && (
          <>
            <CustomPlant plantModel={plantModel} modelUrl={modelUrl} />
          </>
        )}
        {/* <Cylinder /> */}
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default PlantCanvas;
