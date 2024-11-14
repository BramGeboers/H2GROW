import React, { act, useEffect, useMemo, useRef,useState } from 'react'
import { useGLTF, useAnimations, OrbitControls, OrthographicCamera,useKeyboardControls } from '@react-three/drei'
import { Controls } from '@/pages/game/index'
import { SkeletonUtils } from 'three-stdlib'
import * as THREE from 'three'
import { useFrame, useGraph, useThree } from '@react-three/fiber'
import { useInputs } from '@/services/game/hooks/userInputs'

export function AnimatedMan({
  skinColor = '#ffdbac',
  shirtColor = '#ff0000',
  shoeColor = '#000000',
  hairColor = '#000000',
  eyeColor = '#000000',
  color = 'black',
  currentAnimation = 'CharacterArmature|Idle',
  ...props
}) {


 

  const group = useRef()
  const { scene, materials, animations } = useGLTF('/models/peers/HoodieCharacter_WaterCan_v2.glb')
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes } = useGraph(clone)
  const forwardPressed = useKeyboardControls((state)=> state[Controls.forward])
  const backwardPressed = useKeyboardControls((state)=> state[Controls.back])
  const leftPressed = useKeyboardControls((state)=> state[Controls.left])
  const rightPressed = useKeyboardControls((state)=> state[Controls.right])

  const { actions } = useAnimations(animations, group)
  const [animation, setAnimation] = useState("CharacterArmature|Idle");


  useEffect(() => {
    actions[animation].reset().fadeIn(0.5).play()
    return () => actions[animation].fadeOut(0.5)
  }
  , [animation])

  useFrame(() => {
    if (rightPressed||leftPressed||forwardPressed||backwardPressed) {
      setAnimation("CharacterArmature|Walk");
    } else {
      setAnimation("CharacterArmature|Idle");
    }
  })

  // const playerColor = useMemo(
  //   ()=> new THREE.MeshStandardMaterial({color: new THREE.Color(color)}),
  //   [color]
  // )

// useEffect(() => {
//   // WEAPONS.forEach(wp => {
//   //   const isCurrentWeapon = wp === weapon
//   //   nodes[wp].visible = isCurrentWeapon
//   // }
//   // )
//   nodes.Casual_Body_1.traverse((child) => {
//     if (child.isMesh && child.material.name === 'Skin') {
//       child.material = playerColor
//     }
//     if (child.isMesh){
//       child.castShadow = true
//       child.receiveShadow = true
//     }
//   }
//   )
//   nodes.Casual_Head_1.traverse((child) => {
//     if (child.isMesh && child.material.name === 'Hair') {
//       child.material = playerColor
//     }
//     if (child.isMesh){
//       child.castShadow = true
//       child.receiveShadow = true
//     }
//   }
//   )
//   nodes.Casual_Head_4.traverse((child) => {
//     if (child.isMesh && child.material.name === 'Hair') {
//       child.material = playerColor
//     }
//     if (child.isMesh){
//       child.castShadow = true
//       child.receiveShadow = true
//     }
//   }
//   )
// }, [color])

  return (
    <>
      {/* <OrthographicCamera ref={controlsref} camera={camera} /> */}
      <group ref={group} dispose={null}>
        <group name="Root_Scene">
          <group name="RootNode" position-y={-0.8}>
            <group name="CharacterArmature" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
              <primitive object={nodes.Root} />
            </group>
            <group name="Casual_Feet" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
              <skinnedMesh  castShadow receiveShadow name="Casual_Feet_1" geometry={nodes.Casual_Feet_1.geometry} material={materials.White} skeleton={nodes.Casual_Feet_1.skeleton} >
                <meshStandardMaterial color={shoeColor} />
              </skinnedMesh>
              <skinnedMesh  castShadow receiveShadow name="Casual_Feet_2" geometry={nodes.Casual_Feet_2.geometry} material={materials.Purple} skeleton={nodes.Casual_Feet_2.skeleton} >
                <meshStandardMaterial color={shoeColor} />
              </skinnedMesh>
            </group>
            <group name="Casual_Legs" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
              <skinnedMesh  castShadow receiveShadow name="Casual_Legs_1" geometry={nodes.Casual_Legs_1.geometry} material={materials.Skin} skeleton={nodes.Casual_Legs_1.skeleton} >
                <meshStandardMaterial color={skinColor} />
              </skinnedMesh>
              <skinnedMesh   castShadow receiveShadow name="Casual_Legs_2" geometry={nodes.Casual_Legs_2.geometry} material={materials.LightBlue} skeleton={nodes.Casual_Legs_2.skeleton} />
            </group>
            <group name="Casual_Head" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
              <skinnedMesh  castShadow receiveShadow name="Casual_Head_1" geometry={nodes.Casual_Head_1.geometry} material={materials.Skin} skeleton={nodes.Casual_Head_1.skeleton} >
                <meshStandardMaterial color={skinColor} />
              </skinnedMesh>
              <skinnedMesh  castShadow receiveShadow name="Casual_Head_2" geometry={nodes.Casual_Head_2.geometry} material={materials.Eyebrows} skeleton={nodes.Casual_Head_2.skeleton} />
              <skinnedMesh  castShadow receiveShadow name="Casual_Head_3" geometry={nodes.Casual_Head_3.geometry} material={materials.Eye} skeleton={nodes.Casual_Head_3.skeleton} >
                <meshStandardMaterial color={eyeColor} />
              </skinnedMesh>
              <skinnedMesh  castShadow receiveShadow name="Casual_Head_4" geometry={nodes.Casual_Head_4.geometry} material={materials.Hair} skeleton={nodes.Casual_Head_4.skeleton} >
                <meshStandardMaterial color={hairColor} />
              </skinnedMesh>
            </group>
            <group name="Casual_Body" position={[0, 0.007, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
              <skinnedMesh  castShadow receiveShadow name="Casual_Body_1" geometry={nodes.Casual_Body_1.geometry} material={materials.Purple} skeleton={nodes.Casual_Body_1.skeleton} >
                <meshStandardMaterial color={shirtColor} />
              </skinnedMesh>
              <skinnedMesh  castShadow receiveShadow name="Casual_Body_2" geometry={nodes.Casual_Body_2.geometry} material={materials.Skin} skeleton={nodes.Casual_Body_2.skeleton} >
                <meshStandardMaterial color={skinColor} />
              </skinnedMesh>
            </group>
          </group>
        </group>
      </group>
    </>
  )
}

useGLTF.preload('/models/peers/Hoodie Character.glb')
