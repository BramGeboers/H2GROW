import React, { useState } from "react";
import Link from "next/link";
import { Plant, PlantModel } from "@/types";
import { useTranslation } from "next-i18next";
import CustomPlant from "../canvas/CustomPlant";
import PlantModelService from "@/services/PlantModelService";
import router from "next/router";

interface PlantFocusProps {
  plant: Plant;
  modelUrl: string | undefined;
}

const PlantFocus: React.FC<PlantFocusProps> = ({ plant, modelUrl }) => {
  const { t } = useTranslation("common");

  const [formData, setFormData] = useState<PlantModel>({
    id: plant.plantModel?.id || 0,
    modelLink: plant.plantModel?.modelLink || "",
    scale: plant.plantModel?.scale || 0,
    rotation: plant.plantModel?.rotation || 0,
    x: plant.plantModel?.x || 0,
    y: plant.plantModel?.y || 0,
    z: plant.plantModel?.z || 0,
  });

  // Function to handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseFloat(value), // Parse the value to float
    });
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.id !== undefined) {
      await PlantModelService.updatePlantModel(formData, formData.id);
      console.log("Form submitted:", formData);

      router.reload();
    } else {
      console.error("Plant model ID is undefined");
    }
  };

  return (
    <>
      <div className="py-20 md:mx-24 mx-10">
        <div className="flex flex-col items-center text-white">
          <ul className="md:flex flex-wrap lg:flex-nowrap flex-row gap-16 w-full uppercase">
            <div className="flex flex-col py-8 gap-8 w-full justify-between lg:h-[864px] bg-primary-gray p-4 lg:drop-shadow-default">
              <div className="flex flex-col overflow-hidden w-full h-full items-center  p-6 rounded-md justify-around text-2xl font-bold">
                <p className="pb-2">
                  {plant.name} #{plant.id}
                </p>
                <div className="md:h-[450px] bg-tertairy-gray drop-shadow-default">
                  {plant.plantModel && modelUrl && (
                    <CustomPlant
                      plantModel={plant.plantModel}
                      modelUrl={modelUrl}
                    />
                  )}
                </div>
              </div>
              <Link
                className="bg-primary-blue text-3xl text-center uppercase lg:block hidden w-full p-6 drop-shadow-default rounded-md"
                type="submit"
                href={`/plants/${plant.id}`}
              >
                Return
              </Link>
            </div>
            <div className="flex flex-col gap-8 w-full">
              <div className="flex flex-col gap-2 w-full lg:h-[864px] items-center text-center bg-primary-gray lg:p-4 rounded-md shadow-md lg:py-8 justify-center text-xl ">
                <p className="font-bold pb-4 text-2xl">
                  {t("plants.plantStats")}
                </p>
                <form
                  onSubmit={handleSubmit}
                  className="w-full text-white text-lg"
                >
                  <div className="flex flex-col gap-2 p-2">
                    <div className="flex flex-row items-center gap-2 p-2 pb-4">
                      <label htmlFor="rotation" className="w-[170px] text-left">
                        Rotation
                      </label>
                      <input
                        type="number"
                        name="rotation"
                        value={formData.rotation}
                        onChange={handleChange}
                        className="p-1 pl-2 border-gray-300 drop-shadow-default bg-tertairy-gray w-full focus:outline-none focus:border-none focus:ring-0"
                        step="1"
                        max="500"
                        min="-500"
                      />
                    </div>
                    <h2>Desktop</h2>
                    <div className="flex flex-row items-center gap-2 p-2">
                      <label htmlFor="scale" className="w-[170px] text-left">
                        Scale
                      </label>
                      <input
                        type="number"
                        name="scale"
                        value={formData.scale}
                        onChange={handleChange}
                        className="p-1 pl-2 border-gray-300 drop-shadow-default bg-tertairy-gray w-full focus:outline-none focus:border-none focus:ring-0"
                        step="0.01"
                        max="500"
                        min="-500"
                      />
                    </div>
                    <div className="flex flex-row items-center gap-2 p-2">
                      <label htmlFor="x" className="w-[170px] text-left">
                        X
                      </label>
                      <input
                        type="number"
                        name="x"
                        value={formData.x}
                        onChange={handleChange}
                        className="p-1 pl-2 border-gray-300 drop-shadow-default bg-tertairy-gray w-full focus:outline-none focus:border-none focus:ring-0"
                        step="0.05"
                        max="500"
                        min="-500"
                      />
                    </div>
                    <div className="flex flex-row items-center gap-2 p-2">
                      <label htmlFor="y" className="w-[170px] text-left">
                        Y
                      </label>
                      <input
                        type="number"
                        name="y"
                        value={formData.y}
                        onChange={handleChange}
                        className="p-1 pl-2 border-gray-300 drop-shadow-default bg-tertairy-gray w-full focus:outline-none focus:border-none focus:ring-0"
                        step="0.05"
                        max="500"
                        min="-500"
                      />
                    </div>
                    <div className="flex flex-row items-center gap-2 p-2 pb-4">
                      <label htmlFor="z" className="w-[170px] text-left">
                        Z
                      </label>
                      <input
                        type="number"
                        name="z"
                        value={formData.z}
                        onChange={handleChange}
                        className="p-1 pl-2 border-gray-300 drop-shadow-default bg-tertairy-gray w-full focus:outline-none focus:border-none focus:ring-0"
                        step="0.05"
                        max="500"
                        min="-500"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="bg-primary-blue text-white uppercase mt-6 text-3xl w-full p-6 drop-shadow-default rounded-md"
                  >
                    {t("general.save")}
                  </button>
                </form>
              </div>
              <Link
                className="bg-primary-blue text-3xl lg:hidden text-center block w-full p-6 drop-shadow-default rounded-md"
                type="submit"
                href={`plants/${plant.id}`}
              >
                {t("general.return")}
              </Link>
            </div>
          </ul>
        </div>
      </div>
    </>
  );
};

export default PlantFocus;
