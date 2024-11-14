import AuthService from "@/services/AuthService";
import { StatusMessage } from "@/types/login";
import axios from "axios";
import { useTranslation } from "next-i18next";
import React, { useContext, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { AuthContext } from "@/components/auth/AuthContext";

const Login: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<StatusMessage>();
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { setIsLoggedIn, setUserRole } = useContext(AuthContext);

  const router = useRouter();

  const handleLogin = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage(undefined);
    if (!validation()) {
      return;
    }

    console.log("validation passed");
    try {
      setLoading(true);
      const data = await AuthService.login({ email, password });

      console.log("token: " + data.token);
      console.log("email: " + data.email);
      console.log("username: " + data.username);
      console.log("role: " + data.role);

      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("email", data.email);
      sessionStorage.setItem("username", data.username);
      sessionStorage.setItem("role", data.role);

      setIsLoggedIn(true);
      setUserRole(data.role);

      router.push("/");
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const errorData = error.response.data as { message: string };
          const errorMessage = errorData.message;
          if (
            errorMessage.includes(
              "Your account is locked. Please contact an administrator."
            )
          ) {
            setStatusMessage({
              type: "error",
              message: t("error.accountLocked"),
            });
          } else if (errorMessage.includes("Invalid credentials")) {
            setStatusMessage({
              type: "error",
              message: t("error.invalidCredentials"),
            });
          } else if (errorMessage.includes("User not found")) {
            setStatusMessage({
              type: "error",
              message: t("error.userNotFound"),
            });
          } else {
            setStatusMessage({ type: "error", message: errorMessage });
          }
        } else {
          setStatusMessage({ type: "error", message: t("error.loginFailed") });
        }
      } else {
        setStatusMessage({ type: "error", message: t("error.loginFailed") });
      }
    }
  };

  const validation = (): boolean => {
    setEmailError("");
    setPasswordError("");

    let returnBool = true;

    // Email regex pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || email.trim() === "") {
      setEmailError(t("error.emailR"));
      returnBool = false;
    } else if (!emailPattern.test(email)) {
      setEmailError(t("error.emailFormat"));
      returnBool = false;
    }

    if (!password || password.trim() === "") {
      setPasswordError(t("error.passwordR"));
      returnBool = false;
    } else if (password.length < 4) {
      setPasswordError(t("error.passAtLeast3Char"));
      returnBool = false;
    }

    return returnBool;
  };

  return (
    <div className="flex flex-col items-center bg-primary-gray w-full max-w-[700px] md:py-10 py-4 md:px-24 sm:px-10 px-4 text-white text-lg">
      <div className="flex flex-row w-full m-2 pb-4 justify-around">
        <h2 className="bg-primary-green p-3 w-full text-center drop-shadow-default">
          {t("general.login")}
        </h2>
        <Link
          href="/register"
          className="bg-secondary-green hover:bg-tertiary-green transition-all p-3 w-full text-center drop-shadow-default"
        >
          {t("general.register")}
        </Link>
      </div>
      <form onSubmit={handleLogin} className="flex flex-col w-full">
        {statusMessage && (
          <p className="text-red-500 text-center">{statusMessage.message}</p>
        )}
        <label htmlFor="email" className="pb-2 drop-shadow-default">
          {t("general.email")}
        </label>
        <input
          className="w-full p-3 mb-2 bg-tertairy-gray text-md text-white drop-shadow-default focus:outline-none focus:border-none focus:ring-0"
          type="text"
          name="email"
          onChange={(input) => setEmail(input.target.value.toLocaleLowerCase())}
          placeholder={t("general.emailT")}
        />
        <span className="text-red-500 mb-6">{emailError}</span>
        <label htmlFor="password" className="pb-2 drop-shadow-default">
          {t("general.password")}
        </label>
        <input
          className="w-full p-3 mb-2 bg-tertairy-gray text-md text-white drop-shadow-default focus:outline-none focus:border-none focus:ring-0"
          type="password"
          name="password"
          onChange={(input) => setPassword(input.target.value)}
          placeholder={t("general.passwordT")}
        />
        <Link
          href="/forgot-password"
          className="drop-shadow-default text-base text-quarternairy-gray"
        >
          {t("general.forgotPassword")}
        </Link>
        <span className="text-red-500 mb-6">{passwordError}</span>
        {loading ? (
          <button
            type="button"
            className="bg-teriary-green w-full mt-6 p-3 drop-shadow-default flex items-center justify-center"
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
                strokeWidth="4"
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
            {t("general.login")}
          </button>
        )}
      </form>
    </div>
  );
};

export default Login;
