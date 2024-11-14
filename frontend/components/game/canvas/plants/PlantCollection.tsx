import PlantService from '@/services/PlantService'
import { Gltf, Outlines } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'
import React, { useEffect } from 'react'
import * as THREE from 'three'


interface Props {
    playerposition: THREE.Vector3 | undefined;
  }
const PlantCollection:React.FC<Props> = ({playerposition}) => {
    const [plants, setPlants] = React.useState<any|never>()

    const getAllPlants = async () => {
        const response = await PlantService.getAllPlants()
        const data = await response.json()
        console.log(data)
        setPlants(data)
    }

    useEffect(() => {
        getAllPlants()
    }, [])



    const generatePosition = (id:any) => {
       //plant position in a circle around the player
       if (id === 1 )sessionStorage.setItem('plants', JSON.stringify([]))
        const radius = 10
        const angle = Math.random() * Math.PI * 2
        // if (!playerposition) return [0,0,0]
        const x =  1+Math.cos(angle) * radius
        const z = 2+ Math.sin(angle) * radius
        const position = [x,-2,z]
        //add plant position to sessionstorage list of all plants
        const currentPlants = JSON.parse(sessionStorage.getItem('plants')!) || []
        currentPlants.push({id, position})
        sessionStorage.setItem('plants', JSON.stringify(currentPlants))


        return new THREE.Vector3(...position)
    }


    const getPathForPlantType = (plantType:Number) => {
        switch(plantType) {
            case 1:
                return '../models/low_poly_plant_in_a_pot/scene.gltf'
            // case 2:
            //     return '../models/flowering_cannabis_plant_in_a_pot/scene.gltf'
            // case 3:
            //     return '../models/plant_lowpoly/scene.gltf'
            // case 4:
            //     return '../models/low_poly_style_plant/scene.gltf'
            // case 5:
            //     return '../models/giant_low_poly_tree/scene.gltf'
            //     case 6:
            //     return '../models/low_poly_succulent_plant/scene.gltf'
            // case 7:
            //     return '../models/low_poly_cactus/scene.gltf'
            // case 8:
            //     return '../models/tulips/scene.gltf'
             default:
                return '../models/low_poly_plant_in_a_pot/scene.gltf'
        }
    }
    const getRightScaleForPlantType = (plantType:Number) => {
        let scale;
        switch(plantType) {
            case 1:
                scale = [0.5,0.5,0.5]

            default:
              scale = [0.5,0.5,0.5]

        }
        return new THREE.Vector3(...scale)
    }
  return (
    <>
    {plants && plants.map((plant:any, index:number) => {
        return (
           <>


                <RigidBody type='fixed' colliders='trimesh'>
                <Gltf
                    key={index}
                    src={getPathForPlantType(plant.type)}
                    position={generatePosition(plant.id)}
                    scale={getRightScaleForPlantType(plant.type)}
                    rotation={[0,0,0]}
                    castShadow
                    receiveShadow
                />
                   <Outlines thickness={1} color="hotpink" />
                   </RigidBody>

    </>
        )
    }
    )}
    </>
  )
}

export default PlantCollection