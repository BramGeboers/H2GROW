import React, { useEffect, useState } from "react";
import Cactus from "@/components/easterEgg/Cactus";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { sessionStorageService } from "@/services/sessionStorageService";
import Link from "next/link";
import UnauthorizedError from "@/components/auth/UnauthorizedError";

const CactusPage: React.FC = () => {
  const { t } = useTranslation();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const userDataString = sessionStorageService.isLoggedIn();
    setIsLoggedIn(userDataString as boolean);
  }, []);

  return (
    <div className="max-w-[1100px] mx-auto">
      {isLoggedIn ? <Cactus /> : <UnauthorizedError />}
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

export default CactusPage;