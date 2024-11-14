import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Select from "react-select";
import { useTranslation } from "next-i18next";
import PlantService from "@/services/PlantService";
import gieter from "@/public/gieter.png";
import { Plant } from "@/types";

type Props = {
  plants: Array<Plant>;
  imagesDict: { [key: string]: string };
  setPlants: React.Dispatch<React.SetStateAction<Plant[]>>;
  setAscending: React.Dispatch<React.SetStateAction<boolean>>;
  ascending: boolean;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  sortBy: string;
};

const customStyles = {
  option: (provided: any, state: any) => ({
    ...provided,
    color: "white",
    backgroundColor: state.isFocused
      ? "#3b733E"
      : state.isSelected || state.checked
      ? "#373737"
      : "#373737",
    outline: "none",
    borderRadius: 0,
    border: "none",
    "&:hover": {
      backgroundColor: "#3b733E",
    },
  }),
  control: (provided: any, state: { isFocused: any }) => ({
    ...provided,
    display: "flex",
    backgroundColor: "#373737",
    color: "white",
    width: 200,
    border: "none",
    boxShadow: "0 4px 4px rgba(0, 0, 0, 0.25)",
    // Set SVG color to white
    "& svg": {
      fill: "white",
    },
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "white",
    // Set SVG color to white
    "& svg": {
      fill: "white",
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: "#373737",
  }),
};

const PlantOverview: React.FC<Props> = ({
  plants,
  imagesDict,
  setPlants,
  setAscending,
  ascending,
  setSortBy,
  sortBy,
}) => {
  const [deletedPlant, setDeletedPlant] = useState<Plant | null>(null);
  const deleteTimeout = useRef<NodeJS.Timeout | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const { t } = useTranslation();
  const [deleteStatus, setDeleteStatus] = useState<
    "idle" | "countdown" | "gif"
  >("idle");

  useEffect(() => {
    if (deletedPlant) {
      setDeleteStatus("countdown");
      let timer = 3; // 3 seconds
      const intervalId = setInterval(() => {
        setCountdown(--timer);
        if (timer <= 0) {
          clearInterval(intervalId);
          setDeleteStatus("gif");
          deleteTimeout.current = setTimeout(() => {
            PlantService.deletePlant(deletedPlant.id);
            const newPlants = plants.filter((p) => p.id !== deletedPlant.id);
            setPlants(newPlants);
            setDeletedPlant(null);
            setDeleteStatus("idle");
          }, 1000);
        }
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [deletedPlant]);

  const toggleAscending = () => {
    setAscending(!ascending);
  };

  useEffect(() => {
    if (deletedPlant && countdown === 0) {
      setDeleteStatus("gif");
      deleteTimeout.current = setTimeout(() => {
        PlantService.deletePlant(deletedPlant.id);
        const newPlants = plants.filter((p) => p.id !== deletedPlant.id);
        setPlants(newPlants);
        setDeletedPlant(null);
        setDeleteStatus("idle");
      }, 1300);
    }
  }, [deletedPlant, countdown]);

  const deletePlant = (plant: Plant) => {
    setDeletedPlant(plant);
    setCountdown(3);
    setDeleteStatus("countdown");
    if (deleteTimeout.current) clearTimeout(deleteTimeout.current);
  };

  const undoDelete = () => {
    if (deleteTimeout.current) clearTimeout(deleteTimeout.current);
    setDeletedPlant(null);
    setCountdown(null);
    setDeleteStatus("idle");
  };

  useEffect(() => {
    const fetchSortedPlants = async () => {
      const response = await PlantService.sortPlants(
        sortBy,
        ascending ? "desc" : "asc",
        0,
        10
      );
      setPlants(response.content);
    };

    fetchSortedPlants();
  }, [sortBy, ascending]);

  const handleSortByChange = (selectedOption: any) => {
    setSortBy(selectedOption.value);
  };

  const getSortByLabel = (sortBy: string) => {
    switch(sortBy) {
      case 'name':
        return t('plants.name');
      case 'lastWatered':
        return t('plants.lastWatered');
      case 'wateringInterval':
        return t('plants.wateringInterval');
      case 'idealMoisture':
        return t('plants.idealMoisture');
      case 'type':
      default:
        return "Plant type";
    }
  };

  return (
    <>
      <div className="max-w-[950px] mx-auto">
        <div className="relative bg-primary-gray drop-shadow-default py-10 px-10 mx-10 text-white">
          <div className="flex flex-col items-center">
            <div className="flex md:flex-row flex-col justify-around items-center md:gap-12 gap-6 md:pb-8">
              <h2 className="md:text-4xl text-3xl font-semibold">
                {t("plants.myplants")}
              </h2>

              <div className="flex flex-row items-center justify-center gap-4 mb-6 md:mb-0">
              <Select
              value={{
                value: sortBy,
                label: getSortByLabel(sortBy),
              }}
              onChange={handleSortByChange}
              options={[
                { value: 'name', label: t('plants.name') },
                { value: 'lastWatered', label: t('plants.lastWatered') },
                { value: 'wateringInterval', label: t('plants.wateringInterval') },
                { value: 'idealMoisture', label: t('plants.idealMoisture') },
                { value: 'type', label: 'Plant type' },
              ]}
              defaultValue={{
                value: sortBy,
                label: getSortByLabel(sortBy),
              }}
              styles={customStyles}
            />
                <button
                  onClick={toggleAscending}
                  className="bg-tertairy-gray drop-shadow-default transition-all text-white px-4 py-2 rounded hover:bg-primary-green ml-2"
                >
                  {ascending ? "▼" : "▲"}
                </button>
              </div>

              {sortBy === "lastWatered" && (
                <img
                  src={gieter.src}
                  alt="gieter"
                  className="ml-4 mb-10"
                  draggable="true"
                  onDragStart={(event) => {
                    event.dataTransfer.setData(
                      "text/plain",
                      "This text may be any string, and may include a unique identifier for this image"
                    );
                  }}
                  onDragEnd={(event) => {}}
                />
              )}
            </div>
            <div className="flex flex-row flex-wrap gap-8 w-full items-center justify-around max-w-[700px] font-semibold uppercase">
              {plants.map((plant, index) => (
                <div
                  key={index}
                  className="relative bg-tertairy-gray drop-shadow-default w-[150px] h-[150px] group flex items-center justify-center"
                >
                  {deletedPlant?.id === plant.id ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
                      {deleteStatus === "countdown" && (
                        <>
                          <button
                            onClick={undoDelete}
                            className="text-white underline text-sm transition-opacity"
                          >
                            Cancel
                          </button>
                          {countdown !== null && (
                            <p className="text-white text-sm">{countdown}</p>
                          )}
                        </>
                      )}
                      {deleteStatus === "gif" && (
                        <img
                          src={`/disappear.gif?${Date.now()}`}
                          alt="Deleting..."
                        />
                      )}
                    </div>
                  ) : (
                    <>
                      <Link
                        href={`/plants/${plant.id}`}
                        className="flex flex-col gap-2 overflow-hidden items-center justify-center h-full w-full"
                      >
                        <p className="absolute text-center inset-0 flex items-center justify-center pointer-events-none z-40 drop-shadow-default">
                          {plant.name}
                        </p>
                        <Image
                          src={imagesDict[plant.filelink]}
                          alt=""
                          width={150}
                          height={150}
                          className="object-contain opacity-70 p-4 hover:scale-105 transition-all"
                        />
                      </Link>
                      <button
                        onClick={() => deletePlant(plant)}
                        className="absolute bottom-4 mb-2 text-white bg-red-600 hover:bg-red-800 rounded px-2 py-1 text-sm opacity-0 group-hover:opacity-100 transition-all"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              ))}
              <Link
                href="/plants/add"
                className="items-center justify-center content-center text-xl transition-all hover:text-gray-300 drop-shadow-default text-center w-[150px] h-[150px] bg-tertairy-gray"
              >
                <p>
                  <span className="text-3xl">+</span>
                  <br />
                  {t("plants.addPlant")}
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlantOverview;
