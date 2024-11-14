import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import UserService from "@/services/UserService";
import cactus from "@/public/gieter.png";
import cactus2 from "@/public/cactus2.png";
import { useTranslation } from "next-i18next";

const PlantGame = () => {
  const [gameStatus, setGameStatus] = useState('not-started');
  const [buttonCount, setButtonCount] = useState(0);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [isClaimed, setIsClaimed] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showNice, setShowNice] = useState(false);
  const [showMiss, setShowMiss] = useState(false);
  const [clickPosition, setClickPosition] = useState({ top: 0, left: 0 });
  const [showClaimedMessage, setShowClaimedMessage] = useState(true);
  const { t } = useTranslation();

  const router = useRouter();

  useEffect(() => {
    const claimed = localStorage.getItem('easterEggClaimed4') === 'true';
    setIsClaimed(claimed);
    if (gameStatus === 'in-progress' && buttonCount < 7) {
      const id = setTimeout(() => {
        const top = Math.random() * (window.innerHeight - 50);
        const left = Math.random() * (window.innerWidth - 50);
        setButtonPosition({ top, left });
        const hideId = setTimeout(() => {
          if (gameStatus === 'in-progress') {
            setGameStatus('not-started');
            setShowInstructions(true);
            setButtonCount(0);
          }
        }, 1000);
        setTimeoutId(hideId);
      }, buttonCount === 0 ? 0 : Math.random() * 4000 + 1000);
      setTimeoutId(id);
    } else if (gameStatus === 'ended' || buttonCount === 7) {
      setButtonPosition({ top: -100, left: -100 });
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [gameStatus, buttonCount]);

  const startGame = (event: any) => {
    event.stopPropagation();
    setGameStatus('in-progress');
    setButtonCount(0);
    setShowInstructions(false);
  };

  const buttonClick = (event: any) => {
    event.stopPropagation();
    const { clientX, clientY } = event;
    setClickPosition({ top: clientY, left: clientX });
    setShowNice(true);
    setTimeout(() => setShowNice(false), 500);
    if (timeoutId) clearTimeout(timeoutId);
    setButtonPosition({ top: -100, left: -100 }); // Move the button off-screen
    setButtonCount(buttonCount + 1);
    if (buttonCount + 1 === 7) {
      setGameStatus('ended');
    }
  };

  const missClick = (event: any) => {
    const { clientX, clientY } = event;
    setClickPosition({ top: clientY, left: clientX });
    setShowMiss(true);
    setTimeout(() => setShowMiss(false), 500);
    if (gameStatus === 'in-progress') {
      setGameStatus('not-started'); // Reset the game status to 'not-started'
      setButtonCount(0); // Reset the button count
      setShowInstructions(true); // Show the instructions again
    }
  };

  const handleButtonClick = () => {
    UserService.incrementEasterEggsFound();
    localStorage.setItem('easterEggClaimed4', 'true');
    setIsClaimed(true);
    if (router.pathname === '/learnMore') {
      router.reload();
    } else {
      router.push('/learnMore');
    }
  };

  return (
    <div onClick={missClick} className="h-[80vh] max-w-full flex items-center justify-center border-2 border-white m-4">
      {showNice && <p style={{ position: 'absolute', top: clickPosition.top, left: clickPosition.left, zIndex: 9999 }} className="text-green-500">{t('game.nice')}</p>}
      {showMiss && <p style={{ position: 'absolute', top: clickPosition.top, left: clickPosition.left, zIndex: 9999 }} className="text-red-500">{t('game.miss')}</p>}
      {showInstructions && (
        <div className="flex flex-col items-center">
          <p className="mt-4 text-white">{t('game.instructions')}</p>
          {gameStatus !== 'in-progress' && (
            <button onClick={startGame} className="p-2 bg-blue-500 text-white rounded mt-4">{t('game.start')}</button>
          )}
        </div>
      )}
      {gameStatus === 'in-progress' && (
        <>
          <img
            src={cactus2.src}
            alt="cactus2"
            className="absolute"
          />
          <div className="overflow-hidden h-5 w-80 mt-4 mb-4 mr-4 text-xs flex rounded bg-blue-200 absolute bottom-20">
            <div style={{ width: `${(buttonCount / 7) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 rounded"></div>
          </div>
          <p className="absolute text-lg font-bold top-40 text-white">{t('game.giveWater')}</p>
          <img
            src={cactus.src}
            alt="cactus"
            onClick={(event) => buttonClick(event)}
            style={{ position: 'absolute', top: buttonPosition.top, left: buttonPosition.left }}
          />
        </>
      )}
      {gameStatus === 'ended' && buttonCount === 7 && !isClaimed && (
        <button onClick={handleButtonClick} className="bg-green-500 px-4 py-2 rounded mt-4 text-center absolute m-4">
          {t('game.claimEasterEgg')}
        </button>
      )}
      {isClaimed && showClaimedMessage && (
        <div className="text-red-500 mt-4 absolute m-4">
          {t('game.alreadyClaimed')}
          <button onClick={() => setShowClaimedMessage(false)} className="ml-2">
            x
          </button>
        </div>
      )}
    </div>
  );
};

export default PlantGame;