import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, RigidBody, vec3 } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import { Controls } from "@/pages/game/index";
import { KeyboardAnimatedPlayer } from "./KeyboardAnimatedPlayer";
// import WaterStream from "@/components/game/canvas/plants/WaterStream";
import * as THREE from "three";
import { useStore } from "../canvas/store/store";

const JUMP_FORCE = 30;
const BASE_MOVEMENT_SPEED = 2;
const MAX_VEL = 3;
const RUN_VEL = 1.5;
const HEAL_RADIUS = 5;
const HEAL_AMOUNT = 0.1;

export const KeyboardCharacterController = () => {
  const { activePlant, activePlantCoordinates } = useStore();
  const jumpPressed = useKeyboardControls((state) => state[Controls.jump]);
  const leftPressed = useKeyboardControls((state) => state[Controls.left]);
  const rightPressed = useKeyboardControls((state) => state[Controls.right]);
  const backPressed = useKeyboardControls((state) => state[Controls.back]);
  const ctrlPressed = useKeyboardControls((state) => state[Controls.ctrl]);
  const shiftPressed = useKeyboardControls((state) => state[Controls.shift]);
  const forwardPressed = useKeyboardControls((state) => state[Controls.forward]);

  const [characterState, setCharacterState] = useState();
  const [isJumping, setIsJumping] = useState(false);
  const isRunning = useRef(false);
  const rigidbody = useRef();
  const isOnFloor = useRef(true);
  // const waterStreams = useRef([]);
  const yBeforeJump = useRef(0);

  useFrame((state, delta) => {
    const impulse = { x: 0, y: 0, z: 0 };
    if (rigidbody.current && rigidbody.current.translation().y < -10) {
      resetPosition();
    }

    let movementSpeed = BASE_MOVEMENT_SPEED;
    if (ctrlPressed) {
      movementSpeed *= 2;
      isRunning.current = true;
    } else {
      isRunning.current = false;
    }

    if (jumpPressed && isOnFloor.current) {
      setIsJumping(true);
      impulse.y += JUMP_FORCE;
      isOnFloor.current = false;
    }

    if (rigidbody && rigidbody.current) {
      const linvel = rigidbody.current.linvel();

      let changeRotation = false;
      if (rightPressed && linvel.x < MAX_VEL) {
        impulse.x += movementSpeed;
        changeRotation = true;
      }
      if (leftPressed && linvel.x > -MAX_VEL) {
        impulse.x -= movementSpeed;
        changeRotation = true;
      }
      if (backPressed && linvel.z < MAX_VEL) {
        impulse.z += movementSpeed;
        changeRotation = true;
      }
      if (forwardPressed && linvel.z > -MAX_VEL) {
        impulse.z -= movementSpeed;
        changeRotation = true;
      }

      rigidbody.current.applyImpulse(impulse, true);

      if (Math.abs(linvel.x) > RUN_VEL || Math.abs(linvel.z) > RUN_VEL) {
        if (characterState !== "Run") {
          setCharacterState("Run");
        }
      } else {
        if (characterState !== "Idle") {
          setCharacterState("Idle");
        }
      }

      if (changeRotation) {
        const angle = Math.atan2(linvel.x, linvel.z);
        character.current.rotation.y = angle;
      }

      const characterWorldPosition = character.current.getWorldPosition(new THREE.Vector3());
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

  const character = useRef();

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
          setIsJumping(false);
        }}
        onIntersectionEnter={({ other }) => {
          if (other.rigidBodyObject.name === "void") {
            resetPosition();
          }
        }}
      >
        <CapsuleCollider
          scale={[3, 3, 3]}
          args={[0.8, 0.4]}
          position={[0, 1.2, 0]}
        />
        <group ref={character}>
          <KeyboardAnimatedPlayer position={[0, -2.2, 0]} scale={[3, 3, 3]} />
        </group>
      </RigidBody>
     
    </group>
  );
};
