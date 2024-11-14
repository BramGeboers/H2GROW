import Link from "next/link";
import React from "react";
import { IoTriangleSharp } from "react-icons/io5";
import { useTranslation } from "next-i18next";

interface Props {
  changeOpen: () => void; // Specify the type of changeOpen prop
  open: Boolean;
}

const Menu: React.FC<Props> = ({ changeOpen, open }) => {
  const { t } = useTranslation();
  // Destructure changeOpen from props
  return (
    <div
      className={
        !open
          ? "flex flex-col items-center fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-primary-gray w-full max-w-[650px] md:py-10 py-4 md:px-16 sm:px-10 px-4 text-white text-lg"
          : "hidden"
      }
    >
      <div className="flex flex-row w-full m-2 pb-4 justify-around">
        <h2 className="text-3xl font-semibold p-3 w-full text-center drop-shadow-default">
          {t("general.welcomeToGame")}
        </h2>
      </div>
      <div className="flex flex-col w-full pb-8">
        <h3 className="pb-3 text-xl font-semibold">{t("general.controls")}</h3>
        <div className="w-full flex flex-row gap-8 justify-between pb-8">
          <div className="flex flex-col items-center gap-4">
            <div className="bg-tertairy-gray w-10 h-10 drop-shadow-default flex items-center justify-center">
              <IoTriangleSharp />
            </div>
            <div className="gap-4 flex flex-row">
              <div className="bg-tertairy-gray w-10 h-10 drop-shadow-default flex items-center justify-center">
                <IoTriangleSharp style={{ transform: "rotate(-90deg)" }} />
              </div>
              <div className="bg-tertairy-gray w-10 h-10 drop-shadow-default flex items-center justify-center">
                <IoTriangleSharp style={{ transform: "rotate(180deg)" }} />
              </div>
              <div className="bg-tertairy-gray w-10 h-10 drop-shadow-default flex items-center justify-center">
                <IoTriangleSharp style={{ transform: "rotate(90deg)" }} />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-4 items-center">
              <p>{t("general.sprint")}</p>
              <div className="bg-tertairy-gray px-6 h-10 drop-shadow-default flex items-center justify-center">
                Ctrl
              </div>
            </div>
            <div className="flex flex-row gap-4 items-center">
              <p>{t("general.sprint")}</p>
              <div className="bg-tertairy-gray px-6 h-10 drop-shadow-default flex items-center justify-center">
                Shift
              </div>
            </div>
          </div>
        </div>
        <h3 className="pb-3 text-xl font-semibold">{t("general.instructions")}</h3>
        <div>
          <p>{t("general.gameInstructions")}</p>
        </div>
      </div>
      <div className="flex flex-row gap-6 w-full text-center uppercase font-semibold">
        <button
          onClick={changeOpen}
          className=" bg-primary-green w-full uppercase mt-6 p-3 drop-shadow-default hover:bg-secondary-green transition-all"
          type="submit"
        >
          {t("general.continue")}
        </button>
        <Link
          className=" bg-primary-green w-full mt-6 p-3 drop-shadow-default hover:bg-secondary-green transition-all"
          type="submit"
          href={"/"}
        >
          {t("general.return")}
        </Link>
      </div>
      <Link
        className=" bg-primary-blue w-full mt-6 p-3 drop-shadow-default uppercase text-center hover:bg-secondary-blue transition-all"
        type="submit"
        href={"/game-gamepad"}
      >
        {t("general.useGamepad")}
      </Link>
    </div>
  );
};

export default Menu;
