import Menu from "@/components/game/Menu";
import Experience from "@/components/game/canvas/Experience";
import PlantService from "@/services/PlantService";
import { sessionStorageService } from "@/services/sessionStorageService";
import { Plant } from "@/types";
import { KeyboardControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const Controls = {
  forward: "forward",
  back: "back",
  left: "left",
  right: "right",
  jump: "jump",
  shift: "shift",
  ctrl: "ctrl",
};

const plantCoordinates = [
  [-11.9, -3.3, -9.8],
  [-11.1, -3.2, 4.85],
  [0, -2.9, -3],
  [8.6, -3.2, -11.3],
  [-9.9, -0.05, -16],
  [-1.5, -2.9, -3.6],
  [-11.6, -0.05, -16],
  [-0.2, -2.9, -4.9],
  [13.8, 4.6, 2.9],
  [7.5, -3.2, -12.5],
  [1.4, -2.9, -3.9],
  [14, 4.6, 1.3],
];

const Index = () => {
  const { t } = useTranslation();
  if (typeof window !== "undefined") {
    window.onbeforeunload = function (e) {
      // Cancel the event
      e.preventDefault();

      // Chrome requires returnValue to be set
      e.returnValue = "Really want to quit the game?";
    };

    //Prevent Ctrl+S (and Ctrl+W for old browsers and Edge)
    document.onkeydown = function (e) {
      e = e || window.event; //Get event

      if (!e.ctrlKey) return;

      var code = e.which || e.keyCode; //Get key code
      //cntl + s, cntl + w, cntl + shift + s, cntrl + space, ctrl + d
      switch (code) {
        case 83: //Block Ctrl+S
        case 87: //Block Ctrl+W -- Not work in Chrome and new Firefox
          e.preventDefault();
          e.stopPropagation();
          break;
        case 32: //Block Ctrl+Space
          e.preventDefault();
          e.stopPropagation();
          break;
        case 68: //Block Ctrl+D
          e.preventDefault();
          e.stopPropagation();
          break;
      }
    };
  }
  const map = useMemo(
    () => [
      { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
      { name: Controls.back, keys: ["ArrowDown", "KeyS"] },
      { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
      { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
      { name: Controls.jump, keys: ["Space"] },
      { name: Controls.shift, keys: ["ShiftLeft", "ShiftRight"] },
      { name: Controls.ctrl, keys: ["ControlLeft", "ControlRight"] },
    ],
    []
  );

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [plants, setPlants] = useState<Plant[]>([]);

  useEffect(() => {
    const userDataString = sessionStorageService.isLoggedIn();
    setIsLoggedIn(userDataString as boolean);
  }, []);

  useEffect(() => {
    const fetchPlants = async () => {
      if (isLoggedIn) {
        const response = await PlantService.getAllPlants();
        const data = await response.json();
        setPlants(data);
      }
    };

    fetchPlants();
  }, [isLoggedIn]);

  const [isOpen, setOpen] = useState(false);

  const changeOpen = () => {
    setOpen(!isOpen);
  };

  return (
    <div className=" h-[100vh]">
      <Link
        href={"/"}
        className="flex items-center px-3 py-2 fixed top-10 left-10 z-50 bg-primary-green hover:bg-secondary-green transition-all text-white rounded-sm drop-shadow-default"
      >
        {t("general.return")}
      </Link>
      <Menu changeOpen={changeOpen} open={isOpen} />

      <KeyboardControls map={map}>
        <Canvas shadows camera={{ position: [0, 20, 6], fov: 30, near: 2 }}>
          <color attach="background" args={["#242424"]} />
          <Suspense>
            <Physics>
              {plants && (
                <Experience
                  downgradedPerformance={false}
                  plants={plants}
                  plantCoordinates={plantCoordinates}
                />
              )}
            </Physics>
          </Suspense>
        </Canvas>
      </KeyboardControls>
    </div>
  );
};

export const getServerSideProps = async (context: { locale: any }) => {
  const { locale } = context;

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
  };
};

export default Index;