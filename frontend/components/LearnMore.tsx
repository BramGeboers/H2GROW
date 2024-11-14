import DiscordButton from "@/components/DiscordButton";
import VetplantCanvas from "@/components/canvas/PlantVariant7";
import { useTranslation } from "next-i18next";
import UserService from "@/services/UserService";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

type Props = {
  isLoggedIn: boolean;
};
const LearnMore: React.FC<Props> = ({ isLoggedIn }) => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const [easterEggsFound, setEasterEggsFound] = useState(0);

  useEffect(() => {
    if (isLoggedIn) {
      const fetchEasterEggsFound = async () => {
        const response = await UserService.getEasterEggsFound();
        const data = await response.json();
        setEasterEggsFound(data);
      };
      fetchEasterEggsFound();
    }
  }, []);

  const router = useRouter();

  return (
    <div className="flex justify-center py-12 px-4 md:px-8">
      <div className="bg-primary-gray p-8 max-w-7xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-bold mb-8">
              H2Grow: {t("general.smartplant")}
            </h1>
            <div>
              <h2 className="text-2xl font-bold mb-4">
                {t("learnMore.whatIsH2Grow")}
              </h2>
              <p className="mb-4 text-[#a5a5a5]">
                {t("learnMore.h2GrowDescription")}
              </p>
              <p className="mb-4 text-[#a5a5a5]">
                {t("learnMore.h2GrowFeatures")}
              </p>
              <ul className="list-disc text-[#a5a5a5] ml-6 mb-6 space-y-2">
                <li>
                  <strong>{t("learnMore.realTimeMonitoring")}</strong>{" "}
                  {t("learnMore.realTimeMonitoringDesc")}
                </li>
                <li>
                  <strong>{t("learnMore.automatedWatering")}</strong>{" "}
                  {t("learnMore.automatedWateringDesc")}
                </li>
                <li>
                  <strong>{t("learnMore.userFriendlyInterface")}</strong>{" "}
                  {t("learnMore.userFriendlyInterfaceDesc")}
                </li>
              </ul>
              <h3 className="text-xl font-bold mb-4">
                {t("learnMore.whyChooseH2Grow")}
              </h3>
              <ul className="list-disc text-[#a5a5a5] ml-6 space-y-2">
                <li>
                  <strong>{t("learnMore.convenience")}</strong>{" "}
                  {t("learnMore.convenienceDesc")}
                </li>
                <li>
                  <strong>{t("learnMore.accuracy")}</strong>{" "}
                  {t("learnMore.accuracyDesc")}
                </li>
                <li>
                  <strong>{t("learnMore.efficiency")}</strong>{" "}
                  {t("learnMore.efficiencyDesc")}
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <DiscordButton />
              {isLoggedIn && (
                <div>
                  <p className="mt-4">
                    {t("learnMore.easterEggsHint")}
                  </p>
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-2 mt-4 mb-4 text-xs flex rounded bg-green-200">
                      <div
                        style={{ width: `${(easterEggsFound / 4) * 100}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                      ></div>
                    </div>
                    <p className="text-white text-center">
                      {t("learnMore.easterEggsFound", { count: easterEggsFound })}
                      {currentLanguage === "fr" && (
                        <Link href="/easterEgg/baguette">
                          <span
                            className="ml-4 text-4xl"
                            role="img"
                            aria-label="baguette"
                          >
                            🥖
                          </span>
                        </Link>
                      )}
                      {easterEggsFound === 4 && (
                        <button
                          onClick={() => router.push("/easterEgg/reward")}
                          className="mt-4 bg-green-500 text-white rounded px-4 py-2 ml-4"
                        >
                          {t("learnMore.claimReward")}
                        </button>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="w-full h-0 pb-[100%] relative">
            <div className="absolute inset-0">
              <VetplantCanvas />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnMore;