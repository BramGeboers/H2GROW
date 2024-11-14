import React from 'react';
import ForgotPassword from '@/components/auth/ForgotPassword'; // adjust the path according to your project structure
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const ForgotPasswordPage: React.FC = () => {
  return (
    <div className="md:p-20 p-10 max-w-[1080px] flex items-center justify-center mx-auto">
      <ForgotPassword />
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
  
export default ForgotPasswordPage;
