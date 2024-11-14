import { Billboard, Gltf, Sparkles, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useRef, useState } from "react";
const MAX_HEALTH = 100;
const HEAL_AMOUNT = 1;
const HEAL_INTERVAL = 0.5; // seconds
const PlantCharacter = () => {
  const sizeArray = [
    5.226644515991211, 8.519125938415527, 0.22724895179271698,
    8.336530685424805, 1.0916944742202759, 3.580554485321045, 3.10517954826355,
    3.9197988510131836, 8.779348373413086, 7.8477277755737305,
    6.217682838439941, 3.211954116821289, 7.654196262359619, 8.969239234924316,
    8.728499412536621, 1.2578660249710083, 1.9781354665756226,
    7.783226490020752, 7.135030269622803, 7.951484680175781,
    0.02453487180173397, 6.425464630126953, 4.645225524902344,
    8.136592864990234, 8.587510108947754, 0.8625931143760681,
    2.1332926750183105, 8.424376487731934, 8.282814025878906, 7.025123596191406,
    4.104335784912109, 0.018881360068917274, 5.965255260467529,
    3.2459824085235596, 2.505758047103882, 6.003833770751953, 5.598958492279053,
    1.3407280445098877, 3.589604377746582, 4.132833480834961, 3.374598979949951,
    4.69602632522583, 1.294266700744629, 3.0201034545898438,
    0.15400061011314392, 7.180552959442139, 2.1244091987609863,
    5.822298526763916, 2.778578519821167, 7.623974323272705, 3.161548614501953,
    1.959641933441162, 0.34465357661247253, 8.612115859985352,
    4.214746475219727, 5.12087345123291, 2.178835391998291, 1.8077505826950073,
    6.832496166229248, 1.992790937423706, 6.354423999786377, 4.070515155792236,
    8.3240385055542, 7.807681083679199, 3.5895609855651855, 8.196908950805664,
    6.5523858070373535, 2.373096227645874, 3.0299034118652344,
    2.8476715087890625, 1.3040010929107666, 3.288301467895508,
    0.2514694333076477, 6.35706901550293, 1.7965710163116455, 8.555097579956055,
    4.6912407875061035, 3.6862287521362305, 0.14939036965370178,
    3.302109479904175, 5.282652378082275, 1.7651134729385376, 8.645503044128418,
    4.44863224029541, 8.453866958618164, 2.3982036113739014, 3.1929562091827393,
    6.177720546722412, 1.6993390321731567, 7.239148139953613, 5.628854274749756,
    7.376067161560059, 2.6594202518463135, 4.194047927856445, 5.261116027832031,
    7.743869304656982, 1.5783731937408447, 4.656383991241455, 2.104067087173462,
    0.8232189416885376,
  ];
  const sizeFloat32Array = new Float32Array(sizeArray);
  const [health, setHealth] = useState(50); // Initial health
  const lastHealTime = useRef(Date.now());
  const [healing, setHealing] = useState(false);

  useFrame(() => {
    if (healing) {
      setHealth((h) => Math.min(h + HEAL_AMOUNT, MAX_HEALTH));
    }
    const elapsed = (Date.now() - lastHealTime.current) / 1000;

    if (elapsed > HEAL_INTERVAL) {
      lastHealTime.current = Date.now();
    }
  });
  return (
    <>
      <mesh>
        <RigidBody
          name="plant"
          type="fixed"
          scale={0.8}
          position={[-11.1, -2.2, 4.85]}
          onIntersectionEnter={({ other }) => {
            if (
              other.rigidBodyObject &&
              other.rigidBodyObject.name === "character"
            ) {
              setHealing(true);
            }
          }}
          onIntersectionExit={({ other }) => {
            if (
              other.rigidBodyObject &&
              other.rigidBodyObject.name === "character"
            ) {
              setHealing(false);
            }
          }}
        >
          {PlantInfo(health)}
          <Sparkles
            color="pink"
            count={500}
            noise={4}
            opacity={1}
            scale={3}
            size={sizeFloat32Array}
            speed={2}
          />
          <CuboidCollider args={[2, 1, 2]} sensor />
          <Gltf src="../models/low_poly_cactus/scene.gltf" />
        </RigidBody>
      </mesh>
    </>
  );
};

export default PlantCharacter;

const PlantInfo = (health: number) => {
  return (
    <Billboard position-y={2.5}>
      <Text position-y={0.36} fontSize={0.4}>
        Plant_example_1
        <meshBasicMaterial color="green" />
      </Text>
      <mesh position-z={-0.1}>
        <planeGeometry args={[1, 0.2]} />
        <meshBasicMaterial color="black" transparent opacity={0.5} />
      </mesh>
      <mesh scale-x={health / 100} position-x={-0.5 * (1 - health / 100)}>
        <planeGeometry args={[1, 0.2]} />
        <meshBasicMaterial color="#45b5fd" />
      </mesh>
    </Billboard>
  );
};
