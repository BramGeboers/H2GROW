/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 .\public\models\peers\Character_Soldier.gltf -o .\components\game\sprites\AnimatedPlayer.jsx -r public 
*/

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Color, MeshStandardMaterial } from "three";
import { useGLTF, useAnimations, useKeyboardControls } from "@react-three/drei";
import { useFrame, useGraph } from "@react-three/fiber";
import { Controls } from "@/pages/game/index";
import { SkeletonUtils } from "three-stdlib";
import { useStore } from "../canvas/store/store";

const WEAPONS = [
  "GrenadeLauncher",
  "AK",
  "Knife_1",
  "Knife_2",
  "Pistol",
  "Revolver",
  "Revolver_Small",
  "RocketLauncher",
  "ShortCannon",
  "SMG",
  "Shotgun",
  "Shovel",
  "Sniper",
  "Sniper_2",
  "Copper_Wand",
  "WIllaw_Wand",
  "Platium_Wand",
  "Steel_Wand",
];

export function KeyboardAnimatedPlayer({
  weapon = "Copper_Wand",
  color = "black",
  ...props
}) {
  const group = useRef();

  const { materials, animations, scene } = useGLTF(
    "/models/peers/Character_Soldier_test_v2.gltf"
  );

  const {setIsHealing,isHealing} = useStore()
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes } = useGraph(clone);
  const { actions } = useAnimations(animations, group);
  const [animation, setAnimation] = useState("Idle");
  const forwardPressed = useKeyboardControls(
    (state) => state[Controls.forward]
  );
  const backwardPressed = useKeyboardControls((state) => state[Controls.back]);
  const leftPressed = useKeyboardControls((state) => state[Controls.left]);
  const rightPressed = useKeyboardControls((state) => state[Controls.right]);
  const jumpPressed = useKeyboardControls((state) => state[Controls.jump]);
  const shiftPressed = useKeyboardControls((state) => state[Controls.shift]);
  const ctrlPressed = useKeyboardControls((state) => state[Controls.ctrl]);

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (actions[animation]) {
      actions[animation].reset().fadeIn(0.5).play();
      return () => {
        if (mountedRef.current) {
          actions[animation].fadeOut(0.5);
        }
      };
    }
  }, [animation, actions, mountedRef]);

  const playerColorMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: new Color(color),
      }),
    [color]
  );
  useEffect(() => {
    // HIDING NON-SELECTED WEAPONS
    WEAPONS.forEach((wp) => {
      const isCurrentWeapon = wp === weapon;
      nodes[wp].visible = isCurrentWeapon;
    });

    // ASSIGNING CHARACTER COLOR
    nodes.Body.traverse((child) => {
      if (child.isMesh && child.material.name === "Character_Main") {
        child.material = playerColorMaterial;
      }
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    nodes.Head.traverse((child) => {
      if (child.isMesh && child.material.name === "Character_Main") {
        child.material = playerColorMaterial;
      }
    });
    clone.traverse((child) => {
      if (child.isMesh && child.material.name === "Character_Main") {
        child.material = playerColorMaterial;
      }
      if (child.isMesh) {
        child.castShadow = true;
      }
    });
  }, [nodes, clone]);

  useFrame(() => {
    if (rightPressed || leftPressed || forwardPressed || backwardPressed) {
      setAnimation("Walk");
      if (ctrlPressed) {
        setAnimation("Run");
      }
    } else {
      setAnimation("Idle");
    }
    if (
      shiftPressed &&
      !forwardPressed &&
      !backwardPressed &&
      !leftPressed &&
      !rightPressed
    ) {
      setAnimation("Magic");
      setIsHealing(true)
    }else{
      setIsHealing(false)
    }
    if (shiftPressed && forwardPressed) {
      setAnimation("Walk_Shoot");
    }
  });
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="CharacterArmature">
          <primitive object={nodes.Root} />
          <group name="Body_1">
            <skinnedMesh
              name="Cube004"
              geometry={nodes.Cube004.geometry}
              material={materials.Skin}
              skeleton={nodes.Cube004.skeleton}
            />
            <skinnedMesh
              name="Cube004_1"
              geometry={nodes.Cube004_1.geometry}
              material={materials.DarkGrey}
              skeleton={nodes.Cube004_1.skeleton}
            />
            <skinnedMesh
              name="Cube004_2"
              geometry={nodes.Cube004_2.geometry}
              material={materials.Pants}
              skeleton={nodes.Cube004_2.skeleton}
            />
            <skinnedMesh
              name="Cube004_3"
              geometry={nodes.Cube004_3.geometry}
              material={materials.Character_Main}
              skeleton={nodes.Cube004_3.skeleton}
            />
            <skinnedMesh
              name="Cube004_4"
              geometry={nodes.Cube004_4.geometry}
              material={materials.Black}
              skeleton={nodes.Cube004_4.skeleton}
            />
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/peers/Character_Soldier_test_v2.gltf");
