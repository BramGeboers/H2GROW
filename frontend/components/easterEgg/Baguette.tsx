import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import UserService from "@/services/UserService";
import baguette from "@/public/baguette.png";
import baguette2 from "@/public/baguette2.png";
import baguette3 from "@/public/baguette3.png";
import { useTranslation } from "next-i18next";

type Emoji = {
  emoji: string;
  top: number;
  left: number;
};

const Baguette = () => {
  const [emojis, setEmojis] = useState<Emoji[]>([]);
  const [isClaimed, setIsClaimed] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    const claimed = localStorage.getItem('easterEggClaimed3') === 'true';
    setIsClaimed(claimed);
    const newEmojis = new Array(50).fill('🥖').map(() => ({
        emoji: '🥖',
        top: Math.random() * (window.innerHeight - 150),
        left: Math.random() * (window.innerWidth - 100)
      }));
    setEmojis(newEmojis);
  }, []);

  const handleEmojiClick = (index: number) => {
    setEmojis(prevEmojis => {
      const newEmojis = [...prevEmojis];
      newEmojis.splice(index, 1);
      return newEmojis;
    });
  };

  const handleButtonClick = () => {
    UserService.incrementEasterEggsFound();
    localStorage.setItem('easterEggClaimed3', 'true');
    setIsClaimed(true);
    if (router.pathname === '/learnMore') {
      router.reload();
    } else {
      router.push('/learnMore');
    }
  };

  return (

    <div className="relative h-screen w-screen overflow-hidden flex items-center justify-center" style={{ overflowX: 'hidden', maxWidth: '1500px' }}>
      <img src={baguette.src} alt="baguette" className="absolute z-30 mb-16" />
      <img src={baguette3.src} alt="baguette3" className="absolute z-20 mb-16" />
      <img src={baguette2.src} alt="baguette2" className="absolute z-10 mb-16" />
      {emojis.map((emoji, index) => (
        <span 
          key={index} 
          className="absolute text-2xl cursor-pointer" 
          style={{ top: `${emoji.top}px`, left: `${emoji.left}px` }} 
          onClick={() => handleEmojiClick(index)}
        >
          {emoji.emoji}
        </span>
      ))}
      {emojis.length === 0 && !isClaimed && (
        <button onClick={handleButtonClick} className="bg-green-500 px-4 py-2 rounded mt-4 text-center absolute m-4">
          {t("general.claimEasterEgg")}
        </button>
      )}
      {isClaimed && <p className="text-red-500 mt-4 absolute  m-4">{t("general.alreadyClaimed")}</p>}
    </div>
  );
};

export default Baguette;