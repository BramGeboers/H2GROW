import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import UserService from "@/services/UserService";
import { useTranslation } from "next-i18next";

const Cactus = () => {
  const [answer, setAnswer] = useState(null);
  const [number, setNumber] = useState('');
  const [error, setError] = useState('');
  const [isClaimed, setIsClaimed] = useState(false);
  const [showClaimButton, setShowClaimButton] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    const claimed = localStorage.getItem('easterEggClaimed2') === 'true';
    setIsClaimed(claimed);
  }, []);

  const handleAnswer = (option: any) => {
    setAnswer(option);
  };

  const handleNumberChange = (e: any) => {
    if (e.target.value.length <= 5) {
      setNumber(e.target.value);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (parseInt(number) < 99999) {
      setError('Higher ↑');
      setTimeout(() => setError(''), 2000);
    } else {
      setShowClaimButton(true);
    }
  };

  const handleButtonClick = () => {
    UserService.incrementEasterEggsFound();
    localStorage.setItem('easterEggClaimed2', 'true');
    setIsClaimed(true);
    if (router.pathname === '/learnMore') {
      router.reload();
    } else {
      router.push('/learnMore');
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Image src="/cactus2.png" alt="Cactus" width={500} height={500} />
      <p className="text-lg font-bold text-white">{t("general.likeThePlant")}</p>
      {answer === false && <p className="text-red-500">{t("general.wrongOption")}</p>}
      <div className="space-x-4">
        <button onClick={() => handleAnswer(true)} className="bg-green-500 px-4 py-2 rounded">{t("general.yes")}</button>
        <button onClick={() => handleAnswer(false)} className="bg-red-500 px-4 py-2 rounded">{t("general.no")}</button>
      </div>
      {answer === true && (
        <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-6">
          <p className="text-lg font-bold text-white mt-6">{t("general.payForPlant")}</p>
          <div className="flex flex-col items-center">
          <div className="euro-input relative">
            <span className="euro-symbol absolute left-2 top-1/2 transform -translate-y-1/2">€</span>
            <input
              type="number"
              value={number}
              onChange={handleNumberChange}
              className="p-2 mt-1 border-gray-300 drop-shadow-default text-white bg-tertairy-gray focus:outline-none focus:border-none focus:ring-0 pl-6"
            />
          </div>
          {error && <span className="error text-red-500">{error}</span>}
        </div>
          <button type="submit" className="bg-blue-500 px-4 py-2 rounded mb-4">{t("general.submit")}</button>
          {showClaimButton && (isClaimed ? (
            <p className="text-red-500 mt-4">{t("general.alreadyClaimed")}</p>
          ) : (
            <button onClick={handleButtonClick} className="bg-green-500 px-4 py-2 rounded mt-4">
              {t("general.claimEasterEgg")}
            </button>
          ))}
        </form>
      )}
    </div>
  );
};

export default Cactus;