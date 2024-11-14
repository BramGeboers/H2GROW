import { Environment } from "@react-three/drei";
import React, { useEffect, useState } from "react";
import { Map } from "./plants/map";

import CharacterController from "../sprites/CharacterController";

import CustomCharacter from "./plants/CustomCharacter";
import { Plant } from "@/types";

type Props = {
  downgradedPerformance: boolean;
  plants: Plant[];
  plantCoordinates: number[][];
};

const Experience: React.FC<Props> = ({
  downgradedPerformance = false,
  plants,
  plantCoordinates,
}) => {
  const [gamepadconnected, setGamepadconnected] = useState(false);
  const [gamepadIndex, setGamepadIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleGamepadConnect = (event: any) => {
      console.log("Gamepad connected");
      setGamepadIndex(event.gamepad.index);
      setGamepadconnected(true);
    };

    const handleGamepadDisconnect = (event: any) => {
      console.log("Gamepad disconnected");
      if (gamepadIndex === event.gamepad.index) {
        setGamepadIndex(null);
        setGamepadconnected(false);
      }
    };

    window.addEventListener("gamepadconnected", handleGamepadConnect);
    window.addEventListener("gamepaddisconnected", handleGamepadDisconnect);

    return () => {
      window.removeEventListener("gamepadconnected", handleGamepadConnect);
      window.removeEventListener(
        "gamepaddisconnected",
        handleGamepadDisconnect
      );
    };
  }, [gamepadIndex]);

  return (
    <>
      <Map />
      <CharacterController />
      <directionalLight
        position={[-3, 18, 3]}
        intensity={0.5}
        castShadow
        shadow-camera-near={0}
        shadow-camera-far={80}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-bias={-0.0001}
      />
      <directionalLight
        position={[35, 10, -10]}
        intensity={1.3}
        castShadow
        shadow-camera-near={0}
        shadow-camera-far={80}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-bias={-0.0001}
      />
      {plants &&
        plants
          .filter((plant: Plant) => plant.id! <= 12)
          .map((plant: Plant, index) => (
            <CustomCharacter
              key={plant.id}
              plant={plant}
              coordinates={plantCoordinates[index] || [0, 0, 0]} health={0} activePlant={null}            />
          ))}

      <Environment preset="sunset" />
    </>
  );
};

export default Experience;
