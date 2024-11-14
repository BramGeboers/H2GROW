import UnauthorizedError from "@/components/auth/UnauthorizedError";
import EditPlantForm from "@/components/plant/EditPlant";
import PlantService from "@/services/PlantService";
import { sessionStorageService } from "@/services/sessionStorageService";
import { Plant } from "@/types";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Index: React.FC<{ locale: string }> = () => {
  const router = useRouter();

  const { t } = useTranslation();
  const [image, setImage] = useState<string>();
  const { plantId } = router.query;
  const [plant, setPlant] = useState<Plant>();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const userDataString = sessionStorageService.isLoggedIn();
    setIsLoggedIn(Boolean(userDataString));
  }, []);

  useEffect(() => {
    const fetchPlantData = async () => {
      if (plantId && isLoggedIn) {
        try {
          const plantIdNumber = parseInt(plantId as string);
          const response = await PlantService.getPlantById(plantIdNumber);
          const plantJson = await response.json();
          setPlant(plantJson);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchPlantData();
  }, [plantId, isLoggedIn]);

  return (
    <div className="mx-auto max-w-[1200px] ">
      {isLoggedIn ? (
        plant ? (
          <EditPlantForm _plant={plant} />
        ) : (
          <p>{t("general.loading")}</p>
        )
      ) : (
        <UnauthorizedError />
      )}
    </div>
  );
};

export const getServerSideProps = async (context: { locale: string }) => {
  const { locale } = context;

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
      locale,
    },
  };
};

export default Index;
