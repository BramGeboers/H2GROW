import PlantService from "@/services/PlantService";
import { ThingsBoardService } from "@/services/ThingsBoardService";
import WateringService from "@/services/WateringService";
import { Plant } from "@/types";
import { Typography } from "@mui/material";
import LinearProgress, {
  LinearProgressProps,
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import useInterval from "use-interval";
import CustomPlant from "../canvas/CustomPlant";

interface PlantFocusProps {
  plant: Plant;
  modelUrl: string | undefined;
}

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", position: "relative" }}>
        <div
          style={{
            position: "absolute",
            width: "100%",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 100,
          }}
        >
          <Typography
            sx={{ fontWeight: "bold" }}
            variant="body2"
            color="white"
          >{`${Math.round(props.value)}%`}</Typography>
        </div>
        <LinearProgress variant="determinate" {...props} />
      </div>
    </div>
  );
}

const BorderLinearProgressBlue = styled(LinearProgressWithLabel)(
  ({ theme }) => ({
    height: 30,
    borderRadius: 0,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor:
        theme.palette.grey[theme.palette.mode === "dark" ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 0,
      border: 2,
      backgroundColor: theme.palette.mode === "light" ? "#244872" : "#252525",
    },
  })
);

const BorderLinearProgressYellow = styled(LinearProgressWithLabel)(
  ({ theme }) => ({
    height: 30,
    borderRadius: 0,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor:
        theme.palette.grey[theme.palette.mode === "dark" ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 0,
      border: 2,
      backgroundColor: theme.palette.mode === "light" ? "#726524" : "#252525",
    },
  })
);

const PlantFocus: React.FC<PlantFocusProps> = ({
  plant: initialPlant,
  modelUrl,
}) => {
  const [progress, setProgress] = useState(0);

  const [autoPilot, setAutoPilot] = useState<boolean>(initialPlant.autoPilot);

  const [temperature, setTemperature] = useState(0);
  const [lightLevel, setLightLevel] = useState(0);
  const [moistureLevel, setMoistureLevel] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [waterLevel, setWaterLevel] = useState(0);

  const [userEmail, setUserEmail] = useState("");

  // console.log(modelUrl)

  useEffect(() => {
    const email = sessionStorage.getItem("email");
    if (email) setUserEmail(email);
  }, []);

  const router = useRouter();

  const { data: plantData, mutate: mutatePlantData } = useSWR(
    initialPlant?.id ? `/plants/${initialPlant.id}` : null,
    async (url) => {
      const res = await PlantService.getPlantById(initialPlant!.id!);
      return res.json();
    }
  );

  const handleWaterPlant = async () => {
    try {
      if (plantData && plantData.id) {
        const success = await PlantService.waterPlant(plantData.id);
        await WateringService.logWatering(plantData.id, userEmail, "MANUAL");
        if (success.status === 200) {
          await ThingsBoardService.giveWater(
            plantData.deviceId,
            plantData.idealMoisture,
            autoPilot
          );
          mutatePlantData();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const getStats = async () => {
  //   const data = await ThingsBoardService.getBasicStats();
  //   if (data) {
  //     const t = data["temperature"];
  //     const l = data["Light Level"];
  //     const m = data["Soil Moisture"];
  //     const h = data["Humidity"];
  //     const w = data["WaterLevel"];

  //     if (t) {
  //       setTemperature(t[0].value);
  //     }
  //     if (l) {
  //       setLightLevel(l[0].value);
  //     }
  //     if (m) {
  //       setMoistureLevel(m[0].value);
  //     }
  //     if (h) {
  //       setHumidity(h[0].value);
  //     }
  //     if (w) {
  //       setWaterLevel(w[0].value);
  //     }
  //   }
  // };

  // React.useEffect(() => {
  //   getStats();
  // }, []);

  // useInterval(() => {
  //   getStats();
  // }, 2000);

  const { t } = useTranslation("common");

  useInterval(() => {
    const diff = Math.random() * 2;
    if (progress < plantData.xp) {
      setProgress((prevProgress) =>
        Math.min(prevProgress + diff, plantData.xp)
      );
    }
    if (progress < moistureLevel) {
      setProgress((prevProgress) =>
        Math.min(prevProgress + diff, moistureLevel)
      );
    }
    if (progress < waterLevel) {
      setProgress((prevProgress) => Math.min(prevProgress + diff, waterLevel));
    }
  }, 50);

  const updateAuto = async () => {
    let p: Plant = plantData;
    p.autoPilot = !autoPilot;
    const res = await PlantService.updateAutoPilot(plantData.id, p);
    return res.status === 200;
  };

  const ToggleAuto = async () => {
    const change = await updateAuto();
    if (change) {
      const newAutoPilot = !autoPilot;
      setAutoPilot(newAutoPilot);
      if (plantData.id) {
        await WateringService.logWatering(
          plantData.id,
          userEmail,
          newAutoPilot ? "AUTO_ON" : "AUTO_OFF"
        );
        mutatePlantData();
      } else {
        console.error("Plant ID is undefined");
      }
    }
    await ThingsBoardService.giveWater(
      plantData.deviceId,
      plantData.idealMoisture,
      !autoPilot
    );
  };
  return (
    <>
      <div className="py-20 md:mx-24 mx-10">
        <div className="flex flex-col items-center text-white">
          <ul className="md:flex flex-wrap lg:flex-nowrap flex-row gap-16 w-full uppercase">
            <div className="flex flex-col gap-8 w-full">
              <div className="flex flex-col w-full lg:h-[520px] items-center bg-primary-gray p-6 rounded-md shadow-md justify-around text-2xl font-bold">
                {initialPlant.name} #{initialPlant.id}
                {initialPlant.plantModel?.modelLink && modelUrl && (
                  <CustomPlant
                    plantModel={initialPlant.plantModel}
                    modelUrl={modelUrl}
                  />
                )}
              </div>
              <div className="w-full flex flex-row justify-between">
                <button
                  className="bg-primary-blue hover:bg-secondary-blue transition-all text-3xl lg:block hidden uppercase w-8/12 p-6 drop-shadow-default rounded-md"
                  type="submit"
                  onClick={handleWaterPlant}
                >
                  {t("plants.waterPlant")}
                </button>
                <button
                  className={
                    (autoPilot
                      ? "bg-red-700 "
                      : "bg-primary-green hover:bg-secondary-green ") +
                    "text-3xl lg:block hidden uppercase w-auto p-6 drop-shadow-default rounded-md transition-all "
                  }
                  onClick={ToggleAuto}
                >
                  Auto
                </button>
              </div>
              <Link
                className="bg-primary-blue hover:bg-secondary-blue transition-all text-3xl text-center lg:block hidden w-full p-6 drop-shadow-default rounded-md"
                type="submit"
                href={`/plants/model/${initialPlant.id}`}
              >
                Edit Model
              </Link>
            </div>
            <div className="flex flex-col gap-8 w-full">
              <div className="flex flex-col gap-2 lg:h-[520px] w-full items-center text-center bg-primary-gray lg:p-4 rounded-md shadow-md lg:py-8 justify-center text-xl">
                <p className="font-bold p-4 text-2xl">
                  {t("plants.plantStats")}
                </p>
                <div className="w-full px-8 pb-4">
                  <p className="pb-2">{t("plants.waterReservoir")}</p>
                  <BorderLinearProgressBlue
                    className="border-4 border-secondary-gray drop-shadow-default"
                    variant="determinate"
                    value={waterLevel}
                  />
                </div>
                <div className="w-full px-8 pb-4">
                  <p className="pb-2">{t("plants.moistureLevel")}</p>
                  <BorderLinearProgressBlue
                    className="border-4 border-secondary-gray drop-shadow-default"
                    variant="determinate"
                    value={moistureLevel}
                  />
                </div>
                <div className="w-full px-8 pb-4">
                  <p className="pb-2">XP</p>
                  <BorderLinearProgressYellow
                    className="border-4 border-secondary-gray drop-shadow-default"
                    variant="determinate"
                    value={
                      plantData && plantData.xp
                        ? progress > plantData.xp
                          ? plantData.xp
                          : progress
                        : 0
                    }
                  />
                </div>
                <p className="w-full px-8 pb-4">
                  {t("plants.temperature")}{" "}
                  {temperature ? (temperature - 0).toFixed(1) : "-"}°C
                </p>
                <p className="w-full px-8 pb-4">
                  {t("plants.humidity")}{" "}
                  {humidity ? (humidity - 0).toFixed(1) : "-"}%
                </p>
                <p className="w-full px-8 pb-6 lg:pb-4">
                  {t("plants.lightLevelN")}{" "}
                  {lightLevel ? (temperature - 0).toFixed(1) : "-"} Lux
                </p>
              </div>
              <button
                className="bg-primary-blue text-3xl lg:hidden block w-full p-6 drop-shadow-default rounded-md"
                onClick={handleWaterPlant}
              >
                {t("plants.waterPlant")}
              </button>
              <Link
                href={`/plants/${initialPlant.id}/stats`}
                className="text-center bg-primary-gray hover:bg-secondary-gray transition-all text-3xl w-full p-6 drop-shadow-default rounded-md"
                type="submit"
              >
                {t("plants.allStats")}
              </Link>

              <Link
                href={`/plants/${initialPlant.id}/edit`}
                className="text-center bg-primary-gray hover:bg-secondary-gray transition-all text-3xl w-full p-6 drop-shadow-default rounded-md"
                type="submit"
              >
                Edit
              </Link>
            </div>
          </ul>
        </div>
      </div>
    </>
  );
};

export default PlantFocus;
