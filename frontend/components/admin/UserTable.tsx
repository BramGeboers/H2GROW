import React, { useState } from "react";
import { User, Plant } from "@/types";
import Link from "next/link";
import UserService from "@/services/UserService";
import { sessionStorageService } from "@/services/sessionStorageService";
import { useTranslation } from "next-i18next";

interface Props {
  users: User[];
  plants: Plant[];
  setPlants: React.Dispatch<Plant[]>; // Define the type for setPlants
  setUsers: React.Dispatch<User[]>; // Define the type for setPlants
}

const UserTable: React.FC<Props> = ({ users, plants, setPlants, setUsers }) => {
  const { t } = useTranslation();
  const [loadingUserId, setLoadingUserId] = useState<number | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const currentUserEmail = sessionStorageService.getItem("email");

  const handleUserAction = async (userId: number, action: string) => {
    try {
      setLoadingUserId(userId);
      setLoadingAction(action);

      if (action === "promote") {
        await UserService.updateUserRole(userId, "ADMIN");
        // Update the users state to reflect the promoted user
        const updatedUsers = users.map((user) =>
          user.userId === userId ? { ...user, role: "ADMIN" } : user
        );
        setUsers(updatedUsers as User[]);
      } else if (action === "demote") {
        await UserService.updateUserRole(userId, "MEMBER");
        const updatedUsers = users.map((user) =>
          user.userId === userId ? { ...user, role: "MEMBER" } : user
        );
        setUsers(updatedUsers as User[]);
      } else if (action === "lock") {
        await UserService.lockUser(userId);
        const updatedUsers = users.map((user) =>
          user.userId === userId ? { ...user, locked: true } : user
        );
        setUsers(updatedUsers);
      } else if (action === "unlock") {
        await UserService.unlockUser(userId);
        const updatedUsers = users.map((user) =>
          user.userId === userId ? { ...user, locked: false } : user
        );
        setUsers(updatedUsers);
      } else if (action === "delete") {
        // Check if the user is not the current user
        const userEmail = users.find((user) => user.userId === userId)?.email;
        if (currentUserEmail === userEmail) {
          alert("You cannot delete your own account.");
          return;
        }
        await UserService.deleteUser(userId);
        const newUsers = users.filter((p) => p.userId !== userId);
        setUsers(newUsers);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingUserId(null);
      setLoadingAction(null);
    }
  };

  return (
    <div className="flex flex-col my-10">
      <div className="bg-primary-gray p-6 rounded-md">
        <h2 className="text-2xl text-white font-bold mb-4">{t("admin.users")}</h2>
        <table className="min-w-full rounded-md table-fixed text-white">
          <thead>
            <tr>
              <th className="text-left py-3 px-6">{t("admin.username")}</th>
              <th className="text-left py-3 px-6">{t("admin.email")}</th>
              <th className="text-left py-3 px-6">{t("admin.role")}</th>
              <th className="text-left py-3 px-6">{t("admin.status")}</th>
              <th className="text-left py-3 px-6">{t("admin.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: User) => (
              <tr key={user.userId} className={user.locked ? "opacity-50" : ""}>
                <td className="py-3 px-6">{user.username}</td>
                <td className="py-3 px-6">{user.email}</td>
                <td className="py-3 px-6">
                  <div className="flex items-center space-x-2">
                    {user.role === "MEMBER" ? (
                      <>
                        <span className="text-green-500">{t("admin.member")}</span>
                        {currentUserEmail === user.email ? (
                          <div className="relative group">
                            <button
                              className="bg-gray-400 text-gray-600 px-3 py-1 rounded-sm cursor-not-allowed"
                              disabled
                            >
                              {t("admin.promote")}
                            </button>
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {t("admin.notPromoteYourself")}
                            </span>
                          </div>
                        ) : (
                          <button
                            className="bg-purple-800 hover:bg-purple-900 text-white px-3 py-1 rounded-sm"
                            onClick={() =>
                              handleUserAction(user.userId, "promote")
                            }
                          >
                            {t("admin.promote")}
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        <span className="text-purple-800">{t("admin.admin")}</span>
                        {currentUserEmail === user.email ? (
                          <div className="relative group">
                            <button
                              className="bg-gray-400 text-gray-600 px-3 py-1 rounded-sm cursor-not-allowed"
                              disabled
                            >
                              {t("admin.demote")}
                            </button>
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {t("admin.notDemoteYourself")}
                            </span>
                          </div>
                        ) : (
                          <button
                            className="bg-primary-green hover:bg-secondary-green text-white px-3 py-1 rounded-sm"
                            onClick={() =>
                              handleUserAction(user.userId, "demote")
                            }
                          >
                            {t("admin.demote")}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </td>
                <td className="py-3 px-6">
                  <div className="flex items-center space-x-2">
                    {user.locked ? (
                      <>
                        <span className="text-red-500">{t("admin.locked")}</span>
                        {currentUserEmail === user.email ? (
                          <div className="relative group">
                            <button
                              className="bg-gray-400 text-gray-600 px-3 py-1 rounded-sm cursor-not-allowed"
                              disabled
                            >
                              {t("admin.unlock")}
                            </button>
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                             {t("admin.notUnlockYourself")}
                            </span>
                          </div>
                        ) : (
                          <button
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-sm"
                            onClick={() =>
                              handleUserAction(user.userId, "unlock")
                            }
                          >
                            {t("admin.unlock")}
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        <span className="text-green-500">{t("admin.active")}</span>
                        {currentUserEmail === user.email ? (
                          <div className="relative group">
                            <button
                              className="bg-gray-400 text-gray-600 px-3 py-1 rounded-sm cursor-not-allowed"
                              disabled
                            >
                              {t("admin.lock")}
                            </button>
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {t("admin.notLockYourself")}
                            </span>
                          </div>
                        ) : (
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-sm"
                            onClick={() =>
                              handleUserAction(user.userId, "lock")
                            }
                          >
                            {t("admin.lock")}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </td>
                <td>
                  <div className="flex space-x-2">
                    <Link href={`/admin/user/${user.userId}`}>
                      <button className="bg-primary-green hover:bg-secondary-green text-white px-3 py-1 rounded-sm">
                        {t("admin.moreInfo")}
                      </button>
                    </Link>
                    {currentUserEmail === user.email ? (
                      <div className="relative group">
                        <button
                          className="bg-gray-400 text-gray-600 px-3 py-1 rounded-sm cursor-not-allowed"
                          disabled
                        >
                          {t("admin.delete")}
                        </button>
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {t("admin.notDeleteYourself")}
                        </span>
                      </div>
                    ) : (
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-sm"
                        onClick={() => handleUserAction(user.userId, "delete")}
                      >
                        {t("admin.delete")}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
