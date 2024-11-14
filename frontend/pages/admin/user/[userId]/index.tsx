import React, { useEffect, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { sessionStorageService } from "@/services/sessionStorageService";
import userService from "@/services/UserService";

import Link from "next/link";
import { useRouter } from "next/router";
import PlantService from "@/services/PlantService";
import AdminService from "@/services/AdminService";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";

const UserDetails: React.FC = () => {
  const { t } = useTranslation();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const router = useRouter();
  const { userId } = router.query;

  useEffect(() => {
    const isAdminUser = sessionStorageService.isAdmin();
    setIsAdmin(isAdminUser as boolean);
  }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await userService.getUserById(Number(userId));
      const user = await response.json();
      return user;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserPlants = async () => {
    try {
      const response = await PlantService.getPlantsByOwnerId(Number(userId));
      const plants = await response.json();
      return plants;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchWateringLogs = async () => {
    try {
      const response = await AdminService.getAllLogsByUserId(Number(userId));
      const logs = await response.json();
      return logs;
    } catch (error) {
      console.log(error);
    }
  };

  const { data: user } = useSWR(isAdmin ? "user" : null, fetchUserDetails);
  const { data: plants } = useSWR(isAdmin ? "plant" : null, fetchUserPlants);
  const { data: logs } = useSWR(isAdmin ? "logs" : null, fetchWateringLogs);

  useInterval(() => {
    if (isAdmin) {
      mutate("user");
      fetchUserDetails();
      mutate("plant");
      fetchUserPlants();
      mutate("logs");
      fetchWateringLogs();
    }
  }, 5000);

  return (
    <div className="max-w-[1100px] mx-auto text-white">
      {isAdmin && user ? (
        <div className="flex flex-col gap-8">
          <div className="bg-primary-gray p-6 rounded-md">
            <h2 className="text-2xl font-bold mb-4">{t("admin.userDetails")}</h2>
            <p>ID: {user.userId}</p>
            <p>{t("general.username")}: {user.username}</p>
            <p>{t("general.email")}: {user.email}</p>
          </div>
          <div className="bg-primary-gray p-6 rounded-md">
            <h2 className="text-2xl font-bold mb-4">{t("admin.userPlants")}</h2>
            {plants && plants.length > 0 ? ( // Check if plants is defined before accessing its length property
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left">ID</th>
                    <th className="text-left">{t("plants.name")}</th>
                  </tr>
                </thead>
                <tbody>
                  {plants.map((plant: any, index: any) => (
                    <tr
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? "#2e2e2e" : "#3e3e3e",
                      }}
                      key={plant.id}
                    >
                      <td>{plant.id}</td>
                      <td>{plant.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>{t("admin.noPlantsForUser")}</p>
            )}
          </div>

          <div className="bg-primary-gray p-6 rounded-md">
            <h2 className="text-2xl font-bold mb-4">{t("admin.wateringLogs")}</h2>
            {logs.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left">{t("plants.id")}</th>
                    <th className="text-left">{t("plants.name")}</th>
                    <th className="text-left">{t("general.type")}</th>
                    <th className="text-left">{t("general.timestamp")}</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log: any, index: any) => (
                    <tr
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? "#2e2e2e" : "#3e3e3e",
                      }}
                      key={log.id}
                    >
                      <td>{log.plant.id}</td>
                      <td>{log.plant.name}</td>
                      <td>{log.type}</td>
                      <td>{log.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>{t("admin.noWateringLogsForUser")}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-start mt-20 min-h-screen text-2xl">
          <p className="text-red-500">{t("error.adminOnly")}</p>
          <Link href="/">
            <p className="text-black underline cursor-pointer mt-4">
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

export default UserDetails;
