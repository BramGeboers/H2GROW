import React, { useEffect, useRef, useState } from "react";
import { RigidBody, vec3, CapsuleCollider } from "@react-three/rapier";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { AnimatedPlayer } from "./AnimatedPlayer";

const JUMP_FORCE = 0.5;
let MOVEMENT_SPEED = 0.1;
const MAX_VEL = 3;
const RUN_VEL = 1.5;

const CharacterController = () => {
  const [gamepadIndex, setGamepadIndex] = useState(null);
  const [characterState, setCharacterState] = useState();
  const [rightTriggerValue, setRightTriggerValue] = useState(0); // State for right trigger value
  const [linvel, setLinvel] = useState(0); // State for right trigger value
  const [leftTriggerValue, setLeftTriggerValue] = useState(0); // State for right trigger value

  const isOnFloor = useRef(true);
  const waterStreams = useRef([]); // Add this line

  useEffect(() => {
    const handleGamepadConnect = (event) => {
      console.log("Gamepad connected");
      setGamepadIndex(event.gamepad.index);
    };

    const handleGamepadDisconnect = (event) => {
      console.log("Gamepad disconnected");
      if (gamepadIndex === event.gamepad.index) {
        setGamepadIndex(null);
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

  useFrame((state, delta) => {
    const impulse = { x: 0, y: 0, z: 0 };
    const gamepad = navigator.getGamepads()[gamepadIndex];
    if (rigidbody.current&&rigidbody.current.translation().y < -10) {
      resetPosition();
    }

    if (gamepad) {
      const newRightTriggerValue = gamepad.buttons[7].value;
      const newLeftTriggerValue = gamepad.buttons[6].value;

      setLeftTriggerValue(newLeftTriggerValue);

      setRightTriggerValue(newRightTriggerValue);
      //   const linvel = rigidbody.current.linvel();
      setLinvel(rigidbody.current.linvel());

      // Apply impulse based on the right trigger value
      if (rightTriggerValue > 0.1) {
        const angle = character.current.rotation.y;
        const impulseX = 0.5 * rightTriggerValue * Math.sin(angle);
        const impulseZ = -0.5 * rightTriggerValue * Math.cos(angle);

        // Apply the impulse
        impulse.x = impulseX;
        impulse.y = 0.1;
        impulse.z = -impulseZ;

        // Clamp velocity to the maximum
        if (
          Math.abs(linvel.x + impulseX) <= MAX_VEL &&
          Math.abs(linvel.z - impulseZ) <= MAX_VEL
        ) {
          rigidbody.current.applyImpulse(impulse, true);
        }
      }

      // Adjust character rotation
      if (Math.abs(gamepad.axes[0]) > 0.1 || Math.abs(gamepad.axes[1]) > 0.1) {
        const angle = Math.atan2(gamepad.axes[0], gamepad.axes[1]);
        character.current.rotation.y = angle;
      }

      // Update character state based on velocity
      const velocityMagnitude = Math.sqrt(linvel.x ** 2 + linvel.z ** 2);
      if (velocityMagnitude > RUN_VEL) {
        setCharacterState("Run");
      } else {
        setCharacterState("Idle");
      }

      // Camera follow logic
      const characterWorldPosition = character.current.getWorldPosition(
        new THREE.Vector3()
      );

      const targetCameraPosition = new THREE.Vector3(
        characterWorldPosition.x - 3,
        5,
        characterWorldPosition.z + 25
      );

      state.camera.position.lerp(targetCameraPosition, delta * 2);

      const targetLookAt = new THREE.Vector3(
        characterWorldPosition.x,
        0,
        characterWorldPosition.z
      );

      const direction = new THREE.Vector3();
      state.camera.getWorldDirection(direction);

      const position = new THREE.Vector3();
      state.camera.getWorldPosition(position);

      const currentLookAt = position.clone().add(direction);
      const lerpedLookAt = new THREE.Vector3();

      lerpedLookAt.lerpVectors(currentLookAt, targetLookAt, delta * 2);

      state.camera.lookAt(lerpedLookAt);
    }
  });

  const rigidbody = useRef(null);
  const character = useRef(null);

  const resetPosition = () => {
    rigidbody.current.setTranslation(vec3({ x: 0, y: 0, z: 4 }));
    rigidbody.current.setLinvel(vec3({ x: 0, y: 0, z: 0 }));
  };

  return (
    <group>
      <RigidBody
        ref={rigidbody}
        name="character"
        colliders={false}
        position={[0, -1, 5]}
        scale={[0.5, 0.5, 0.5]}
        enabledRotations={[false, false, false]}
        onCollisionEnter={() => {
          isOnFloor.current = true;
        }}
        onIntersectionEnter={({ other }) => {
          if (other.rigidBodyObject.name === "void") {
            resetPosition();
          }
        }}
      >
        <CapsuleCollider
          scale={[2, 2, 2]}
          args={[0.8, 0.4]}
          position={[0, 1.2, 0]}
        />
        <group ref={character}>
          <AnimatedPlayer
            position={[0, -1, 0]}
            scale={[2, 2, 2]}
            linvel={linvel}
            leftTriggerValue={leftTriggerValue}
          />
        </group>
      </RigidBody>
      {waterStreams.current && waterStreams.current.map((stream) => stream)}
    </group>
  );
};

export default CharacterController;
