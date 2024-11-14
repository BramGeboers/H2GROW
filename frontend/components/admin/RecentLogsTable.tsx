import AdminService from "@/services/AdminService";
import { sessionStorageService } from "@/services/sessionStorageService";
import React, { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";
import { useTranslation } from "next-i18next";

const RecentLogsTable: React.FC = () => {
  const { t } = useTranslation();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const isAdminUser = sessionStorageService.isAdmin();
    setIsAdmin(isAdminUser as boolean);
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchWateringLogs();
    }
  }, [isAdmin]);

  const fetchWateringLogs = async () => {
    try {
      const response = await AdminService.getLast10Logs();
      const wateringLogs = await response.json();
      return wateringLogs;
    } catch (error) {
      console.log(error);
    }
  };

  const { data: wateringLogs } = useSWR(
    isAdmin ? "wateringLogs" : null,
    fetchWateringLogs
  );

  useInterval(() => {
    if (isAdmin) {
      mutate("wateringLogs");
      fetchWateringLogs();
    }
  }, 5000);

  return (
    <div className="bg-primary-gray p-6 rounded-md">
      <h2 className="text-2xl font-bold mb-4">{t("admin.latestWateringLogs")}</h2>
      {wateringLogs && wateringLogs.length > 0 ? (
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left"><p>{t("admin.plant")}</p> ID</th>
              <th className="text-left">{t("admin.plant")} {t("admin.name")}</th>
              <th className="text-left">{t("admin.owner")} ID</th>
              <th className="text-left">{t("admin.owner")}</th>
              <th className="text-left">{t("admin.type")}</th>
              <th className="text-left">{t("admin.timestamp")}</th>
            </tr>
          </thead>
          <tbody>
            {wateringLogs.map((log: any, index: any) => (
              <tr
                style={{
                  backgroundColor: index % 2 === 0 ? "#2e2e2e" : "#3e3e3e",
                }}
                key={log.id}
              >
                <td>{log.plant.id}</td>
                <td>{log.plant.name}</td>
                <td>{log.user.userId}</td>
                <td>{log.user.username}</td>
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
  );
};

export default RecentLogsTable;
