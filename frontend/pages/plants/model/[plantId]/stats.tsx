import PlantStats from "@/components/plant/PlantStats";
import PlantService from "@/services/PlantService";
import { Plant } from "@/types";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const PlantStatsPage: React.FC = () => {
  const { t } = useTranslation();

  const router = useRouter();
  const { plantId } = router.query;
  const [plant, setPlant] = useState<Plant>();

  useEffect(() => {
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
  }, [plantId]);

  return <>{plant && <PlantStats plant={plant} />}</>;
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

export default PlantStatsPage;
