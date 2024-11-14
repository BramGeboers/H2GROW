import React, { useEffect, useState } from "react";
import Baguette from "@/components/easterEgg/Baguette";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { sessionStorageService } from "@/services/sessionStorageService";
import UnauthorizedError from "@/components/auth/UnauthorizedError";

const BaguetteHuntPage: React.FC = () => {
  const { t } = useTranslation();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const userDataString = sessionStorageService.isLoggedIn();
    setIsLoggedIn(userDataString as boolean);
  }, []);

  return (
    <div className="">
      {isLoggedIn ? <Baguette /> : <UnauthorizedError />}
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

export default BaguetteHuntPage;