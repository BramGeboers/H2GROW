import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';

const Reward: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Image src="/cookie.jpg" alt="Reward" width={500} height={500} />
    </div>
  );
};

export const getServerSideProps = async (context: { locale: any }) => {
    const { locale } = context;
  
    return {
      props: {
        ...(await serverSideTranslations(locale ?? "en", ["common"])),
      },
    };
  };

export default Reward;