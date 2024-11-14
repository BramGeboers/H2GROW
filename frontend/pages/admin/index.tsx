import PlantTable from "@/components/admin/PlantTable";
import RecentLogsTable from "@/components/admin/RecentLogsTable";
import UserTable from "@/components/admin/UserTable";
import AdminUnauthorizedError from "@/components/auth/AdminUnauthorizedError";
import PlantService from "@/services/PlantService";
import userService from "@/services/UserService";
import { sessionStorageService } from "@/services/sessionStorageService";
import { Plant, User } from "@/types";
import { Pagination } from "@mui/material";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useEffect, useState } from "react";

const AdminPanel: React.FC = () => {
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const { t } = useTranslation();

  useEffect(() => {
    const isAdminUser = sessionStorageService.isAdmin();
    setIsAdmin(isAdminUser as boolean);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userService.getAllUsers();
        const users = await response.json();
        setUsers(users);
      } catch (error) {
        console.log(error);
        return [];
      }
    };

    fetchUsers();
  }, [isAdmin, currentPage]);

  useEffect(() => {
    const fetchPlants = async () => {
      if (isAdmin) {
        const response = await PlantService.getAllPlantsPage(currentPage);
        const data = await response.json();
        const { content: plants, totalPages } = data;
        setPlants(plants);
        setTotalPages(totalPages);
      }
    };

    fetchPlants();
  }, [isAdmin, currentPage]);

  // const { data: users } = useSWR(isAdmin ? "users" : null, fetchUsers);
  // const { data: plants } = useSWR(isAdmin ? "plants" : null, fetchPlants);

  return (
    <div className="max-w-[1100px] mx-auto text-white">
      <div className="xl:hidden h-full min-h-[80vh] flex items-center justify-center w-full">
        <p className="text-2xl">{t("error.mobileAccessDenied")}</p>
      </div>

      {isAdmin ? (
        <div className="hidden xl:flex flex-col gap-5 ">
          {users && plants ? (
            <>
              <UserTable
                users={users}
                plants={plants}
                setPlants={setPlants}
                setUsers={setUsers}
              />
              <PlantTable plants={plants} setPlants={setPlants} />

              {totalPages != 1 && (
                <div className="bg-primary-gray max-w-[250px] flex justify-center drop-shadow-default mb-2 rounded-md p-1 mx-auto">
                  <Pagination
                    count={totalPages}
                    page={currentPage + 1}
                    onChange={(event, page) => setCurrentPage(page - 1)}
                    size="large"
                    sx={{
                      "& .MuiPaginationItem-page.Mui-selected": {
                        color: "white", // Change color of selected page
                      },
                      "& .MuiPaginationItem-page": {
                        color: "white", // Change color of unselected pages
                      },
                      "& svg": {
                        fill: "white", // Make SVG icons white
                      },
                      "& .Mui-selected": {
                        bgcolor: "#3B733E", // Change color of the selection circle
                      },
                    }}
                  />
                </div>
              )}

              <RecentLogsTable />
            </>
          ) : (
            <div>{t("general.loading")}</div>
          )}
        </div>
      ) : (
        <AdminUnauthorizedError />
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

export default AdminPanel;
