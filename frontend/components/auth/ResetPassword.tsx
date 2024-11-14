import React, { useState } from 'react';
import LoginService from '@/services/AuthService';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Link from 'next/link';

const ResetPassword: React.FC = () => {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<React.ReactNode>('');
  const router = useRouter();
  const { token } = router.query;

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage(t('error.passwordsDoNotMatch'));
      return;
    }
    try {
      const response = await LoginService.passwordReset(token as string, password);
      if (response.ok) {
        setMessage(
          <>
            <span>{t('resetPassword.passwordResetSuccess')}</span>
            <Link href="/login">
              <span className="underline cursor-pointer">{t('general.login')}</span>
            </Link>
            <span>{t('resetPassword.withNewPassword')}</span>
          </>
        );
      } else {
        setMessage(t('resetPassword.userNotFound'));
      }
    } catch (error) {
      setMessage(t('error.tryAgain'));
    }
  };

  return (
    <div className="flex flex-col items-center bg-primary-gray w-full max-w-[700px] md:py-10 py-4 md:px-24 sm:px-10 px-4 text-white text-lg">
      <h2 className=" bg-primary-green p-3 w-full text-center drop-shadow-default">
        {t("general.resetPassword")}
      </h2>
      <form onSubmit={handleResetPassword} className="flex flex-col w-full">
        {message ? (
          <p className="text-green-500 text-center">{message}</p>
        ) : (
          <p> </p>
        )}
        <label htmlFor="password" className="pb-2 drop-shadow-default">
          {t("general.newPassword")}
        </label>
        <input
          className="w-full p-3 mb-2 bg-tertairy-gray text-md text-white drop-shadow-default focus:outline-none focus:border-none focus:ring-0"
          type="password"
          name="password"
          onChange={(input) => setPassword(input.target.value)}
          placeholder={"******"}
        />
        <label htmlFor="confirm-password" className="pb-2 drop-shadow-default">
          {t("general.repeatNewPassword")}
        </label>
        <input
          className="w-full p-3 mb-2 bg-tertairy-gray text-md text-white drop-shadow-default focus:outline-none focus:border-none focus:ring-0"
          type="password"
          name="confirm-password"
          onChange={(input) => setConfirmPassword(input.target.value)}
          placeholder={"******"}
        />
        <button
          className="bg-primary-green w-full mt-6 p-3 drop-shadow-default hover:bg-secondary-green transition-all"
          type="submit"
        >
          {t("general.resetPassword")}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
