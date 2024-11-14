import { useTranslation } from "next-i18next";
import React, { useEffect, useRef, useState } from "react";
import DiscordButton from "@/components/DiscordButton";
import { DndProvider, DragSourceMonitor, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import UserService from "@/services/UserService";
import { useRouter } from "next/router";

const names = ['Bram Geboers', 'Wout Paepen', 'Davy Bellens', 'Hugo Rohach', 'Kylian Van Arkkels', 'Joren Bex', 'Gleb Prokopchuk', 'Bart Arnalsteen'];

const DraggableItem = ({ id, name, index, moveItem }: { id: any, name: any, index: any, moveItem: any }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'item',
    item: { id, index },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'item',
    hover(item: { index: number }, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      moveItem(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const ref = useRef(null);
  drag(drop(ref));

  return (
    <li ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {name}
    </li>
  );
};

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState(names);
  const [isAlphabetical, setIsAlphabetical] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);

  const moveItem = (fromIndex: any, toIndex: any) => {
    setItems((items) => {
      const newItems = [...items];
      const itemMoving = newItems[fromIndex];
      newItems.splice(fromIndex, 1);
      newItems.splice(toIndex, 0, itemMoving);
      return newItems;
    });
  };
  const router = useRouter();

  const handleButtonClick = () => {
    UserService.incrementEasterEggsFound();
    localStorage.setItem('easterEggClaimed1', 'true');
    setIsClaimed(true);
    if (router.pathname === '/learnMore') {
      router.reload();
    } else {
      router.push('/learnMore');
    }
  };

  useEffect(() => {
    setIsAlphabetical(items.join('') === [...items].sort().join(''));
    const claimed = localStorage.getItem('easterEggClaimed1') === 'true';
    setIsClaimed(claimed);
  }, [items]);

  return (
    <div className="text-white">
      <div className="flex items-center justify-center mt-20 p-8 flex-col">
        <p className="pb-2 font-semibold text-lg">
          {t("general.integrationProject")}
        </p>
        <p className="mb-4">
          {t("general.copyrights")} © 2024. {t("general.copyright")}
        </p>
        <div className="w-full max-w-md">
          <DiscordButton />
        </div>
      </div>
      <div className="w-full p-4 text-center font-semibold">
        {isAlphabetical && !isClaimed && (
          <button className="bg-primary-green p-1 mb-4 text-white" onClick={handleButtonClick}>
            {t("general.claimEasterEgg")}
          </button>
        )}
        {isAlphabetical && isClaimed && (
          <p className="text-red-500 mb-4">{t("general.alreadyClaimed")}</p>
        )}
        <DndProvider backend={HTML5Backend}>
          <ul className="flex flex-wrap gap-4 justify-around text-white">
            {items.map((item, index) => (
              <DraggableItem key={index} id={index} name={item} index={index} moveItem={moveItem} />
            ))}
          </ul>
        </DndProvider>
      </div>
    </div>
  );
};

export default Footer;
