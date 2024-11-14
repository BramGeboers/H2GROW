import addImagelogo2 from "@/public/addimage1.png";
import addImagelogo1 from "@/public/addimage2.png";
import addmodel from "@/public/addmodel.png";
import addmodeldone from "@/public/addmodeldone.png";
import MediaService from "@/services/MediaService";
import PlantService from "@/services/PlantService";
import { Plant, PlantModel } from "@/types";
import axios from "axios";
import Image from "next/image";
import router from "next/router";

import { useTranslation } from "next-i18next";
import CustomPlant from "../canvas/CustomPlant";
import { useState } from "react";

const AddPlantForm: React.FC = () => {
  const [file1, setFile1] = useState<File>();
  const [file2, setFile2] = useState<File>();
  const { t } = useTranslation("common");

  const [plantModel, setPlantModel] = useState({
    modelLink: "",
    rotation: 1,
    scale: 1,
    x: 0,
    y: 0,
    z: 0,
    mobileScale: 1,
    mobileX: 0,
    mobileY: 0,
    mobileZ: 0,
  });

  const [plant, setPlant] = useState({
    name: "",
    species: "",
    plantModel: plantModel,
    currentMoistureLevel: 0,
    xp: 0,
    temperature: 0,
    lightLevel: 0,
    wateringInterval: 0,
    filelink: "",
    lastWatered: "",
    waterNeed: 0,
  });

  const [species, setSpecies] = useState<String>("");

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    currentMoistureLevel: "",
    plantModel: "",
    xp: "",
    temperature: "",
    lightLevel: "",
    wateringInterval: "",
    filelink: "",
    lastWatered: "",
    waterNeed: "",
  });

  const validate = (): boolean => {
    let result = true;
    let errors = {
      name: "",
      currentMoistureLevel: "",
      plantModel: "",
      xp: "",
      temperature: "",
      lightLevel: "",
      wateringInterval: "",
      filelink: "",
      lastWatered: "",
      waterNeed: "",
    };

    if (!plant.name) {
      errors.name = t("error.nameR");
      result = false;
    } else if (plant.name.length < 3) {
      errors.name = t("error.nameAtLeast3Char");
      result = false;
    }
    setErrors(errors);

    return result;
  };

  const addPlant = async (e: any) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const plantWithImage = {
      name: plant.name,
      species: species,
      currentMoistureLevel: plant.currentMoistureLevel,
      plantModel: plant.plantModel,
      xp: plant.xp,
      temperature: plant.temperature,
      lightLevel: plant.lightLevel,
      wateringInterval: plant.wateringInterval,
      filelink: plant.filelink,
      lastWatered: 0,
      waterNeed: plant.waterNeed,
    };

    const formData1 = new FormData();
    const formData2 = new FormData();

    formData1.append("file", file1 as File);
    formData2.append("file", file2 as File);

    try {
      const response1 = await PlantService.addPlant(
        plantWithImage as unknown as Plant
      );
      if (response1.ok) {
        const response2 = await MediaService.uploadMedia(
          formData1 as FormData,
          plant.filelink
        );
        if (file2) {
          console.log("upload model", formData2);
          const response3 = await MediaService.uploadMedia(
            formData2 as FormData,
            plant.plantModel.modelLink
          );
          if (response3.ok) {
            router.push("/plants");
          }
          if (!response3.ok) {
            console.log(response3);
          }
        }
        if (response2.ok) {
          router.push("/plants");
        }

        if (!response2.ok) {
          console.log(response2);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event: any) => {
    const value = event.target.value;
    setPlant({ ...plant, [event.target.name]: value });
  };

  const handleFile = async (event: any) => {
    if (!event.target.files) return;
    const file = event.target.files[0];
    setFile1(file);

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

    try {
      const plantname = await PlantService.identifyPlant(file);
      setSpecies(plantname);
      setPlant({ ...plant, species: plantname });
    } catch (error) {
      console.log(error);
    }
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
  };

  const handleFillWithAI = async () => {
    if (!species) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:11434/api/generate", {
        model: "llama3",
        prompt: `You are a zoologist renowned for your knowledge of plants. Answer my questions with ONLY a JSON. No introductions, just the JSON with the values. The values are: idealMoistureLevel (a value between 0 and 100 indicating the ideal moisture level of the soil) and wateringInterval (the number of hours that must pass before watering the plant again). Example: Monstera Deliciosa produces {"idealMoistureLevel": 60, "wateringInterval": 72}. Now do the same for the plant ${species}.`,
        stream: false,
      });

      const data = JSON.parse(response.data.response);
      setPlant({
        ...plant,
        currentMoistureLevel: data.idealMoistureLevel,
        wateringInterval: data.wateringInterval,
      });
    } catch (error) {
      console.error("Error fetching data from AI API", error);
    } finally {
      setLoading(false);
    }
  };
  const handleSetModel = (event: any) => {
    setPlantModel({
      ...plantModel,
      modelLink: modelUrl,
    });
    setPlant({
      ...plant,
      plantModel: { ...plantModel, modelLink: modelUrl },
    });
  };

  const [modelUrl, setModelUrl] = useState<string>("");
  const [requestUrl, setRequestUrl] = useState<string>("");
  const [requestNumber, setRequestNumber] = useState<number>(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Access the value from the input field
    const value = e.target.value;

    // Update the state with the new value
    setRequestUrl(value);
  };

  const fetchModel = async () => {
    try {
      const response = await fetch(
        "https://api.poly.pizza/v1/search/" + requestUrl,
        {
          headers: {
            "x-auth-token": "13ca825b280444e0b1d95ae7d8c9b95d",
          },
        }
      );
      const data = await response.json();

      // Extract the download URL from the first result in the array
      if (data.results && data.results.length > 0) {
        const downloadUrl = data.results[requestNumber].Download;
        console.log("Download URL: ", downloadUrl);
        console.log(requestNumber);
        setModelUrl(downloadUrl);
      } else {
        console.log("No results found.");
      }
    } catch (error) {
      console.error("Error fetching model:", error);
    }
  };

  const initialPlantModel: PlantModel = {
    modelLink: "",
    rotation: 0,
    scale: 1,
    x: 0,
    y: 0,
    z: 0,
  };

  return (
    <>
      <div className="bg-primary-gray flex flex-col py-10 px-10 mt-16 mx-10">
        <h2 className="text-white text-center text-4xl mb-4">
          {t("plants.addPlant")}
        </h2>
        <div className="flex md:flex-row flex-col justify-around w-full items-center gap-8 content-center">
          <div className="w-[220px] h-full min-h-[424px] cursor-pointer flex flex-col gap-4 drop-shadow-default  ">
            <input
              className="bg-tertairy-gray drop-shadow-sm text-white p-2"
              type="text"
              placeholder={t("plants.fetchM")}
              value={requestUrl} // Bind the input value to the state
              onChange={handleInputChange} // Call the handler function on change
            />
            <input
              className="bg-tertairy-gray drop-shadow-sm text-white p-2"
              type="number"
              defaultValue={0}
              value={requestNumber} // Bind the input value to the state
              onChange={(e) =>
                setRequestNumber(e.target.value as unknown as number)
              } // Call the handler function on change
            />
            <button
              className="bg-primary-blue hover:bg-secondary-blue transition-all p-2 text-white
          "
              onClick={fetchModel}
            >
              {t("plants.fetch")}
            </button>
            <div className="bg-tertairy-gray p-4 h-[230px]">
              {modelUrl && (
                <CustomPlant
                  plantModel={initialPlantModel}
                  modelUrl={modelUrl}
                />
              )}
            </div>
            <button
              className="bg-primary-blue hover:bg-secondary-blue transition-all p-2 text-white
          "
              onClick={handleSetModel}
            >
              {t("plants.set")}
            </button>
          </div>
          <div className="w-[220px] h-full cursor-pointer flex flex-col">
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
                onChange={handleFile}
                className="w-[220px] opacity-0 border-0 h-[220px] text-center focus:outline-none focus:border-none focus:ring-0 cursor-pointer"
                aria-label={t("plants.selectImage")}
              />
              <input
                name="modelLink"
                type="file"
                accept=".glb"
                onChange={handleModel}
                className="w-[220px] opacity-0 border-0 h-[220px] text-center focus:outline-none focus:border-none focus:ring-0 cursor-pointer"
                aria-label={t("plants.selectModel")}
              />
            </div>
          </div>
          <form
            onSubmit={validate}
            className="w-full flex items-center flex-col"
          >
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
                </div>
                <div className="flex flex-col">
                  <label className="text-white">
                    {t("plants.moistureLevel")} %
                  </label>
                  <input
                    type="text"
                    name="currentMoistureLevel"
                    value={loading ? "loading..." : plant.currentMoistureLevel}
                    readOnly={loading}
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
                  <label className="text-white">{t("plants.species")}</label>
                  <input
                    type="text"
                    name="species"
                    value={plant.species}
                    onChange={(e) => handleChange(e)}
                    className="p-2 mt-1 border-gray-300 drop-shadow-default text-white bg-tertairy-gray focus:outline-none focus:border-none focus:ring-0"
                    aria-label={t("plants.species")}
                  />
                  <span className="error text-red-500">
                    {errors.lightLevel}
                  </span>
                </div>
                <div className="flex flex-col">
                  <label className="text-white">
                    {t("plants.wateringInterval")} (h)
                  </label>
                  <input
                    type="text"
                    name="wateringInterval"
                    value={loading ? "loading..." : plant.wateringInterval}
                    readOnly={loading}
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
            <div className="flex justify-center my-4">
              <button
                onClick={handleFillWithAI}
                type="button"
                className={`py-2 px-4 drop-shadow-default transform text-white ${
                  species
                    ? "bg-primary-green cursor-pointer hover:bg-secondary-green transition-all"
                    : "bg-primary-blue cursor-not-allowed hover:bg-secondary-blue transition-all"
                }`}
                disabled={!species}
              >
                {t("plants.fillWithAI")}
              </button>
            </div>
            <input
              type="submit"
              onClick={addPlant}
              value={t("plants.addPlant")}
              className="py-2 cursor-pointer bg-primary-blue  hover:bg-secondary-blue transition-all w-full md:w-[676px] text-white drop-shadow-default"
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default AddPlantForm;
