import React from 'react';
import ResetPassword from '@/components/auth/ResetPassword';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const ResetPasswordPage: React.FC = () => {
  return (
    <div className="md:p-20 p-10 max-w-[1080px] flex items-center justify-center mx-auto">
      <ResetPassword />
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

export default ResetPasswordPage;
