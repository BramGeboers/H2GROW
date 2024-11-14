import LearnMore from "@/components/LearnMore";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { sessionStorageService } from "@/services/sessionStorageService";
const LearnMorePage = () => {
  const { t } = useTranslation();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const userDataString = sessionStorageService.isLoggedIn();
    setIsLoggedIn(userDataString as boolean);
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen text-white">
      <LearnMore isLoggedIn={isLoggedIn} />
    </div>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

export default LearnMorePage;
