import UnauthorizedError from "@/components/auth/UnauthorizedError";
import PlantFocus from "@/components/plant/PlantFocus";
import MediaService from "@/services/MediaService";
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
  const { plantId } = router.query;
  const [plant, setPlant] = useState<Plant>();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [modelUrl, setModelUrl] = useState<string>("");

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
          console.error("Error fetching plant data:", error);
        }
      }
    };

    fetchPlantData();
  }, [plantId, isLoggedIn]);

  useEffect(() => {
    if (plant && plant.plantModel) {
      if (plant?.plantModel?.modelLink?.includes("static.poly.pizza")) {
        setModelUrl(plant.plantModel.modelLink);
      } else {
        const fetchModel = async () => {
          try {
            if (!plant.plantModel?.modelLink) return;
            const response = await MediaService.getMediaByPath(
              plant.plantModel.modelLink
            );
            const modelBlob = await response.blob();
            const url = URL.createObjectURL(modelBlob);
            setModelUrl(url);
            console.log(modelUrl);
          } catch (error) {
            console.error("Error fetching model:", error);
          }
        };
        fetchModel();
      }
    }
  }, [plant]);

  return (
    <div className="mx-auto max-w-[1200px] ">
      {isLoggedIn ? (
        plant ? (
          <PlantFocus plant={plant} modelUrl={modelUrl} />
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
