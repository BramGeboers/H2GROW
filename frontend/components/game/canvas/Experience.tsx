import { Environment } from "@react-three/drei";
import React, { useEffect, useState } from "react";
import { KeyboardCharacterController } from "../sprites/KeyboardCharacterController";
import { Map } from "./plants/map";

import { Plant } from "@/types";
import CustomCharacter from "./plants/CustomCharacter";
import { useStore } from "./store/store";
// import { GamepadCharacterController } from "../sprites/GamepadController";

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
  const {activePlant, setActivePlant,setActivePlantCoordinates} = useStore();
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
      <KeyboardCharacterController />
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
          .slice(0, 12) // Limit the array to the first 12 elements
          .map((plant: Plant, index) => (
            <mesh
              onClick={() => {
                if(activePlant === plant) {
                  setActivePlant(null);
                  setActivePlantCoordinates([0, 0, 0]);
                  return;
                }
                setActivePlant(plant);
                setActivePlantCoordinates(plantCoordinates[index]);
              }}
              key={plant.id} // Moved the key prop to the outermost element
            >
              <CustomCharacter
                plant={plant}
                coordinates={plantCoordinates[index] || [0, 0, 0]}
                activePlant={activePlant}
                health={0}
              />
            </mesh>
          ))}

      <Environment preset="sunset" />
    </>
  );
};

export default Experience;
