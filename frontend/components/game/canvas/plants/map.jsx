import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import { RigidBody } from "@react-three/rapier";

export const Map = () => {
  const map = useGLTF("models/map/free_hyper_casual_room.glb");

  useEffect(() => {
    map.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [map.scene]);
  return (
    <RigidBody name="floor" colliders="trimesh" type="fixed">
      <primitive position={[0, -6, 0]} scale={[1, 1, 1]} object={map.scene} />
    </RigidBody>
  );
};

// useGLTF.preload("models/map/free_hyper_casual_room.glb");
