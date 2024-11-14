import AuthService from "@/services/AuthService";
import { StatusMessage } from "@/types/login";
import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import { useRouter } from "next/router";

const ForgotPassword: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<StatusMessage>();
  const [emailError, setEmailError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const handlePasswordResetRequest = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage(undefined);
    if (!email || email.trim() === "") {
      setEmailError(t("error.emailR"));
      return;
    }

    try {
      setLoading(true);
      const response = await AuthService.passwordResetRequest(email);
      if (response.ok) {
        setStatusMessage({
          type: "success",
          message: "Email Sent!",
        });
      } else {
        setStatusMessage({
          type: "error",
          message: t("error.errorTAL"),
        });
      }
    } catch (error) {
      setStatusMessage({
        type: "error",
        message: t("error.errorTAL"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center bg-primary-gray w-full max-w-[700px] md:py-10 py-4 md:px-24 sm:px-10 px-4 text-white text-lg">
      <h2 className=" bg-primary-green p-3 w-full text-center drop-shadow-default">
        {t("general.forgotPassword")}
      </h2>
        <p className="text-center mt-4">{t("general.enterEmailAddress")}</p>
      <form onSubmit={handlePasswordResetRequest} className="flex flex-col w-full">
        {statusMessage ? (
          <p className="text-green-500 text-center">{statusMessage.message}</p>
        ) : (
          <p> </p>
        )}
        <label htmlFor="email" className="pb-2 drop-shadow-default">
          {t("general.email")}
        </label>
        <input
          className="w-full p-3 mb-2 bg-tertairy-gray text-md text-white drop-shadow-default focus:outline-none focus:border-none focus:ring-0"
          type="text"
          name="email"
          onChange={(input) => setEmail(input.target.value)}
          placeholder={"joske@ucll.be"}
        />
        <span className="text-red-500 mb-6">{emailError}</span>
        {loading ? (
          <button
            type="button"
            className=" bg-tertiary-green w-full mt-6 p-3 drop-shadow-default flex items-center justify-center"
            disabled
            title={t("general.loading")}
          >
            <svg
              className="mr-3 h-7 w-7 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </button>
        ) : (
          <button
            className="bg-primary-green w-full mt-6 p-3 drop-shadow-default hover:bg-secondary-green transition-all"
            type="submit"
          >
            {t("general.submit")}
          </button>
        )}
      </form>
    </div>
  );
};

export default ForgotPassword;
