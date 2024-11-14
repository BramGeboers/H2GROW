import React, { useEffect, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { sessionStorageService } from "@/services/sessionStorageService";
import Link from "next/link";
import { useRouter } from "next/router";
import PlantService from "@/services/PlantService";
import AdminService from "@/services/AdminService";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";

const PlantDetails: React.FC = () => {
  const { t } = useTranslation();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const router = useRouter();
  const { plantId } = router.query;

  useEffect(() => {
    const isAdminUser = sessionStorageService.isAdmin();
    setIsAdmin(isAdminUser as boolean);
  }, []);

  const fetchPlantDetails = async () => {
    try {
      const response = await PlantService.getPlantById(Number(plantId));
      const plantDetails = await response.json();
      return plantDetails;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchWateringLogs = async () => {
    try {
      const response = await AdminService.getAllLogsByPlantId(Number(plantId));
      const wateringLogs = await response.json();
      return wateringLogs;
    } catch (error) {
      console.log(error);
    }
  };

  const { data: plantDetails } = useSWR(
    isAdmin ? "plantDetails" : null,
    fetchPlantDetails
  );
  const { data: wateringLogs } = useSWR(
    isAdmin ? "wateringLogs" : null,
    fetchWateringLogs
  );

  useInterval(() => {
    if (isAdmin) {
      mutate("plantDetails");
      fetchPlantDetails();
      mutate("wateringLogs");
      fetchWateringLogs();
    }
  }, 5000);

  return (
    <div className="max-w-[1100px] mx-auto text-white">
      {isAdmin && plantDetails ? (
        <div className="flex flex-col gap-8">
          <div className="bg-primary-gray p-6 rounded-md">
            <h2 className="text-2xl font-bold mb-4">{t("admin.plantDetails")}</h2>
            <p>ID: {plantDetails.id}</p>
            <p>{t("plants.name")}: {plantDetails.name}</p>
            <p>{t("plants.owner")}: {plantDetails.owner?.username}</p>
          </div>
          <div className="bg-primary-gray p-6 rounded-md">
            <h2 className="text-2xl font-bold mb-4">{t("admin.wateringLogs")}</h2>
            {wateringLogs.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left">{t("admin.ownerId")}</th>
                    <th className="text-left">{t("plants.owner")}</th>
                    <th className="text-left">{t("general.type")}</th>
                    <th className="text-left">{t("general.timestamp")}</th>
                  </tr>
                </thead>
                <tbody>
                  {wateringLogs.map((log: any, index: any) => (
                    <tr
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? "#2e2e2e" : "#3e3e3e",
                      }}
                      key={log.id}
                    >
                      <td>{log.user.userId}</td>
                      <td>{log.user.username}</td>
                      <td>{log.type}</td>
                      <td>{log.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>{t("admin.noWateringLogsForPlant")}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-start mt-20 min-h-screen text-2xl">
          <p className="text-red-500">{t("error.adminOnly")}</p>
          <Link href="/">
            <p className="text-white underline cursor-pointer mt-4">
              {t("general.returnToHome")}
            </p>
          </Link>
        </div>
      )}
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

export default PlantDetails;
