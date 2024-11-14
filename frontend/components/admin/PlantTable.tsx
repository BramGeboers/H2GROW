import React, { useState } from "react";
import { Plant } from "@/types";
import Link from "next/link";
import PlantService from "@/services/PlantService";
import { useTranslation } from "next-i18next";

interface Props {
  plants: Plant[];
  setPlants: React.Dispatch<Plant[]>; // Define the type for setPlants
}

const PlantTable: React.FC<Props> = ({ plants, setPlants }) => {
  const { t } = useTranslation();
  const handleDeletePlant = async (plantId: any) => {
    try {
      await PlantService.deletePlant(plantId);
      // fetchPlants();

      const newPlants = plants.filter((p) => p.id !== plantId);

      setPlants(newPlants);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-primary-gray p-6 rounded-md">
      <h2 className="text-2xl font-bold m-4">Plants</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left py-3 px-6">{t("admin.name")}</th>
            <th className="text-left py-3 px-6">{t("admin.owner")}</th>
            <th className="text-left py-3 px-6">{t("admin.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(plants) &&
            plants.map((plant) => (
              <tr key={plant.id}>
                <td className="py-3 px-6">{plant.name}</td>
                <td className="py-3 px-6">{plant.owner.username}</td>
                <td className="py-3 px-6">
                  <div className="flex space-x-2">
                    <Link href={`/admin/plant/${plant.id}`}>
                      <button className="bg-primary-green hover:bg-secondary-green text-white px-3 py-1 rounded-sm">
                        {t("general.moreInfo")}
                      </button>
                    </Link>

                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-sm"
                      onClick={() => handleDeletePlant(plant.id)}
                    >
                      {t("admin.delete")}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlantTable;
