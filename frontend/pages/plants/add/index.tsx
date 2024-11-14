import UnauthorizedError from "@/components/auth/UnauthorizedError";
import AddPlantForm from "@/components/plant/AddPlant";
import { sessionStorageService } from "@/services/sessionStorageService";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const AddPlantPage: React.FC = () => {
  const { t } = useTranslation();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const userDataString = sessionStorageService.isLoggedIn();
    setIsLoggedIn(userDataString as boolean);
  }, []);

  return (
    <div className="max-w-[1450px] mx-auto">
      {isLoggedIn ? <AddPlantForm /> : <UnauthorizedError />}
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

export default AddPlantPage;
