import UnauthorizedError from "@/components/auth/UnauthorizedError";
import PlantStats from "@/components/plant/PlantStats";
import PlantService from "@/services/PlantService";
import { sessionStorageService } from "@/services/sessionStorageService";
import { Plant } from "@/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";

const PlantStatsPage: React.FC = () => {
  const router = useRouter();
  const { plantId } = router.query;
  const [plant, setPlant] = useState<Plant>();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (!isLoggedIn) {
      const userDataString = sessionStorageService.isLoggedIn();
      setIsLoggedIn(Boolean(userDataString));
    } else {
      const plantIdNumber = parseInt(plantId as string);
      const fetchData = async () => {
        try {
          const response = await PlantService.getPlantById(plantIdNumber);
          const result = await response.json();
          setPlant(result);
        } catch (error) {
          console.log(error);
        }
      };
      if (plantIdNumber) {
        fetchData();
      }
    }
  }, [plantId, isLoggedIn]);

  return (
    <div className="mx-auto max-w-[1200px] ">
      {isLoggedIn ? (
        plant ? (
          <PlantStats plant={plant} />
        ) : (
          <p>{t("general.loading")}</p>
        )
      ) : (
        <UnauthorizedError />
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

export default PlantStatsPage;
