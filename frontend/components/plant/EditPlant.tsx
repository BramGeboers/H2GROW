import React, { useEffect, useRef, useState } from "react";
import addImagelogo1 from "@/public/addimage2.png";
import addImagelogo2 from "@/public/addimage1.png";
import Image from "next/image";
import PlantService from "@/services/PlantService";
import router from "next/router";
import MediaService from "@/services/MediaService";
import { Plant } from "@/types";
import addmodeldone from "@/public/addmodeldone.png";
import addmodel from "@/public/addmodel.png";
import cactusImage from "@/public/kleineCactus.png";
import Link from "next/link";

import { useTranslation } from "next-i18next";

interface Props {
  _plant: Plant;
}

const EditPlantForm: React.FC<Props> = ({ _plant }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        !dropdownRef.current?.contains(event.target as Node) &&
        !toggleRef.current?.contains(event.target as Node)
      ) {
        setNavOpen(false);
      }
    }

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const { t } = useTranslation("common");

  const [plant, setPlant] = useState<Plant>({
    ..._plant,
    wateringInterval: _plant.wateringInterval / 3600000,
  });

  const [plantModel, setPlantModel] = useState({
    modelLink: "",
    rotation: 1,
    scale: 1,
    x: 0,
    y: 0,
    z: 0,
  });

  const [errors, setErrors] = useState({
    name: "",
    currentMoistureLevel: "",
    xp: "",
    temperature: "",
    lightLevel: "",
    wateringInterval: "",
    lastWatered: "",
    waterNeed: "",
    idealMoisture: "",
  });

  const validate = (): boolean => {
    let result = true;
    let newErrors = {
      name: "",
      currentMoistureLevel: "",
      xp: "",
      temperature: "",
      lightLevel: "",
      wateringInterval: "",
      lastWatered: "",
      waterNeed: "",
      idealMoisture: "",
    };

    if (!plant.name) {
      newErrors.name = t("error.nameR");
      result = false;
    } else if (plant.name.length < 3) {
      newErrors.name = t("error.nameAtLeast3Char");
      result = false;
    }
    setErrors(newErrors);

    return result;
  };

  const editPlant = async (e: any) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const plantWithImage = {
      id: _plant.id, // Ensure the ID is included
      name: plant.name,
      currentMoistureLevel: plant.currentMoistureLevel,
      plantModel: plant.plantModel,
      xp: plant.xp,
      temperature: plant.temperature,
      lightLevel: plant.lightLevel,
      wateringInterval: plant.wateringInterval,
      filelink: plant.filelink,
      lastWatered: plant.lastWatered,
      waterNeed: plant.waterNeed,
      idealMoisture: plant.idealMoisture,
    };

    const formData1 = new FormData();
    const formData2 = new FormData();

    formData1.append("file", file1 as File);
    formData2.append("file", file2 as File);

    const lastWateredTime = new Date(plant.lastWatered).getTime();
    const currentTime = Date.now();
    const timeSinceLastWatered = currentTime - lastWateredTime;

    console.log("Plant to edit:", plantWithImage); // Log the plant object

    console.log(_plant.id);

    try {
      const response1 = await PlantService.editPlant(
        plantWithImage as Plant,
        _plant.id || 0
      );

      console.log(response1);
      const response2 = await MediaService.uploadMedia(
        formData1 as FormData,
        plant.filelink
      );
      const response3 = await MediaService.uploadMedia(
        formData2 as FormData,
        plant.plantModel!.modelLink
      );
      if (!response1.ok || !response2.ok) {
        if (response1.ok) {
          router.push("/plants");
        }
        if (response2.ok) {
          if (file1?.name) {
            MediaService.deleteMedia(plant.filelink);
          }
        }
      }

      if (response1.ok && response2.ok) {
        router.push("/plants");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [navOpen, setNavOpen] = useState(false);
  const toggleNav = () => {
    setNavOpen(!navOpen);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPlant({ ...plant, [name]: value });
  };

  const handleFile = (event: any) => {
    if (!event.target.files[0]) return;
    setFile1(event.target.files[0]);
    const value = event.target.value;
    const currentDate = new Date();
    const formattedDate = currentDate
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-"); // Replace slashes with dashes
    const fileName = (formattedDate + "_" + value.split("\\").pop()).replace(
      /\s/g,
      "_"
    );
    plant.filelink = fileName;
    setPlant(plant);
  };

  const handleModel = (event: any) => {
    setFile2(event.target.files[0]);
    const value = event.target.value;
    const currentDate = new Date();
    const formattedDate = currentDate
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-"); // Replace slashes with dashes
    const formattedTime = currentDate
      .toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      .replace(/:/g, ""); // Remove colons
    const fileName = (formattedDate + "_" + value.split("\\").pop()).replace(
      /\s/g,
      "_"
    );

    setPlantModel({
      ...plantModel,
      modelLink: fileName,
    });
    setPlant({
      ...plant,
      plantModel: { ...plantModel, modelLink: fileName },
    });
    console.log(value);
  };

  const [file1, setFile1] = useState<File>();
  const [file2, setFile2] = useState<File>();

  return (
    <div className="bg-primary-gray flex flex-col py-10 px-10 mt-16 mx-10">
      <h2 className="text-white text-center text-4xl mb-4">
        {t("plants.edit")}
      </h2>
      <div className="flex md:flex-row flex-col justify-around w-full items-center gap-8 content-center">
        <div className="w-[220px] h-full cursor-pointer flex flex-col gap-4 ">
          <div>
            {file1 ? (
              <Image
                src={addImagelogo2}
                alt="Add Plant"
                className="w-[220px] p-2 h-[220px] object-cover absolute pointer-events-none"
              />
            ) : (
              <Image
                src={addImagelogo1}
                alt="Add Plant"
                className="w-[220px] p-2 h-[220px] object-cover absolute pointer-events-none"
              />
            )}
            {file2 ? (
              <Image
                src={addmodeldone}
                alt="Add Plant"
                className="w-[220px] p-2 h-[220px] object-cover absolute pointer-events-none translate-y-full"
              />
            ) : (
              <Image
                src={addmodel}
                alt="Add Plant"
                className="w-[220px] p-2 h-[220px] object-cover absolute pointer-events-none translate-y-full"
              />
            )}
            <input
              name="filelink"
              type="file"
              accept="image/*"
              onChange={(e) => handleFile(e)}
              className="w-[220px] m-2 opacity-0 border-0 h-[220px] text-center focus:outline-none focus:border-none focus:ring-0 cursor-pointer"
              aria-label={t("plants.selectImage")}
            />
            <input
              name="modelLink"
              type="file"
              accept=".fbx"
              onChange={(e) => handleModel(e)}
              className="w-[220px] m-2 opacity-0 border-0 h-[220px] text-center focus:outline-none focus:border-none focus:ring-0 cursor-pointer"
              aria-label={t("plants.selectModel")}
            />
          </div>
        </div>
        <form onSubmit={validate} className="w-full flex items-center flex-col">
          <div className="flex flex-wrap w-full flex-row gap-4 justify-center">
            <div className="w-full md:w-[330px] mb-6 md:mb-0 space-y-4">
              <div className="flex flex-col w-full">
                <label className="text-white">{t("plants.name")}</label>
                <input
                  type="text"
                  name="name"
                  value={plant.name}
                  onChange={(e) => handleChange(e)}
                  className="p-2 mt-1 border-gray-300 drop-shadow-default text-white bg-tertairy-gray focus:outline-none focus:border-none focus:ring-0"
                  aria-label={t("plants.name")}
                />
                <span className="error text-red-500">{errors.name}</span>
                {plant.name === "Cactus" && (
                  <Link href="/easterEgg/cactus">
                    <div className="">
                      <Image src={cactusImage} alt="Cactus" />
                    </div>
                  </Link>
                )}
              </div>
              <div className="flex flex-col">
                <label className="text-white">
                  {t("plants.moistureLevel")} %
                </label>
                <input
                  type="text"
                  name="idealMoisture"
                  value={plant.idealMoisture}
                  onChange={(e) => handleChange(e)}
                  className="p-2 mt-1 border-gray-300 drop-shadow-default text-white bg-tertairy-gray focus:outline-none focus:border-none focus:ring-0"
                  aria-label={t("plants.currentMoistureLevel")}
                />
                <span className="error text-red-500">
                  {errors.currentMoistureLevel}
                </span>
              </div>
            </div>
            <div className="w-full md:w-[330px] mb-6 md:mb-0 space-y-4">
              <div className="flex flex-col">
                <label className="text-white">
                  {t("plants.wateringInterval")} (h)
                </label>
                <input
                  type="text"
                  name="wateringInterval"
                  value={plant.wateringInterval}
                  onChange={(e) => handleChange(e)}
                  className="p-2 mt-1 border-gray-300 drop-shadow-default text-white bg-tertairy-gray focus:outline-none focus:border-none focus:ring-0"
                  aria-label={t("plants.wateringInterval")}
                />
                <span className="error text-red-500">
                  {errors.wateringInterval}
                </span>
              </div>
            </div>
          </div>
          <hr className="my-4" />
          <input
            type="submit"
            onClick={editPlant}
            value={t("plants.edit")}
            className="py-2 cursor-pointer bg-primary-blue hover:bg-secondary-blue transition-all w-full md:w-[676px] text-white drop-shadow-default"
          />
        </form>
      </div>
    </div>
  );
};

export default EditPlantForm;
