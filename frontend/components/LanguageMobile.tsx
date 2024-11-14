import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const LanguageMobile: React.FC = () => {
  const { i18n } = useTranslation();
  const [languageOpen, setLanguageOpen] = useState(false);
  const router = useRouter();
  const languageRef = useRef<HTMLDivElement>(null);

  const changeLanguage = (lng: string) => {
    router.push(router.pathname, router.asPath, { locale: lng });
    setLanguageOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageRef.current &&
        !languageRef.current.contains(event.target as Node)
      ) {
        setLanguageOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative ml-4" ref={languageRef}>
      <div
        className="cursor-pointer drop-shadow-default"
        onClick={() => setLanguageOpen(!languageOpen)}
      >
        <span className={`fi fi-${i18n.language === "en" ? "gb" : i18n.language} text-2xl`}></span>
      </div>
      <div
        className={`absolute left-0 bottom-0 mb-10 w-48 bg-[#2E2E2E] rounded-md shadow-xl z-20 overflow-hidden transition-all duration-300 ease-in-out ${
          languageOpen ? "max-h-48" : "max-h-0"
        }`}
      >
        <a
          href="#"
          className="block px-4 py-2 text-white hover:bg-[#373737]"
          onClick={() => changeLanguage("en")}
        >
          <span className="fi fi-gb mr-2"></span> English
        </a>
        <a
          href="#"
          className="block px-4 py-2 text-white hover:bg-[#373737]"
          onClick={() => changeLanguage("nl")}
        >
          <span className="fi fi-nl mr-2"></span> Nederlands
        </a>
        <a
          href="#"
          className="block px-4 py-2 text-white hover:bg-[#373737]"
          onClick={() => changeLanguage("fr")}
        >
          <span className="fi fi-fr mr-2"></span> Français
        </a>
      </div>
    </div>
  );
};

export default LanguageMobile;