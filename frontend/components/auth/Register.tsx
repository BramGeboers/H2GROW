import AuthService from "@/services/AuthService";
import { StatusMessage } from "@/types/login";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";

const Login: React.FC = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repeatPassword, setRepeatPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<StatusMessage>();
  const [statusMessage, setStatusMessage] = useState<StatusMessage>();
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [usernameError, setUsernameError] = useState<string>("");
  const [role, setRole] = useState<string>("MEMBER");
  const [repeatPasswordError, setRepeatPasswordError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleRegister = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage(undefined);
    if (!validation()) {
      console.log("validation failed");
      return;
    }

    try {
      setLoading(true);
      const response = await AuthService.register({
        username,
        email,
        password,
        role,
      });
      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem(
          "user",
          JSON.stringify({
            token: data.token,
            username: data.username,
            email: data.email,
            role: data.role,
          })
        );

        router.push("/confirm");
      } else if (!response.ok) {
        console.log(response);
        // const errorMessage = data.email.replace("email: ", "");
        setErrorMessage({ type: "error", message: t("error.emailD") });
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage === "Email already in use") {
        setErrorMessage({ type: "error", message: t("error.emailInUse") });
      } else if (errorMessage === "Username already in use") {
        setErrorMessage({ type: "error", message: t("error.usernameInUse") });
      } else {
        setStatusMessage({
          type: "error",
          message: t("error.registrationFailed"),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const validation = (): boolean => {
    let isValid = true;
    setEmailError("");
    setPasswordError("");
    setRepeatPasswordError("");
    setUsernameError("");

    if (!username || username.trim() === "") {
      console.log("username " + username);
      setUsernameError(t("error.usernameR"));
      isValid = false;
    }

    if (!email || email.trim() === "") {
      console.log("email " + email);

      setEmailError(t("error.emailR"));
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError(t("error.emailFormat"));
      isValid = false;
    }

    if (!password || password.trim() === "") {
      console.log("password " + password);

      setPasswordError(t("error.passwordR"));
      isValid = false;
    } else if (password.length < 4) {
      setPasswordError(t("error.passAtLeast3Char"));
      isValid = false;
    }

    if (
      repeatPassword != password ||
      !repeatPassword ||
      repeatPassword.trim() === ""
    ) {
      console.log("repeatPassword " + repeatPassword);

      setRepeatPasswordError(t("error.repeatPasswordR"));
      isValid = false;
    } else if (repeatPassword.length < 4) {
      setRepeatPasswordError(t("error.passAtLeast3Char"));
      isValid = false;
    }

    return isValid;
  };

  return (
    <div className="flex flex-col items-center bg-primary-gray w-full max-w-[700px] md:py-10 py-4 md:px-24 sm:px-10 px-4 text-white text-lg">
      <div className="flex flex-row w-full m-2 pb-4 justify-around">
        <Link
          href="/login"
          className="  bg-secondary-green hover:bg-tertiary-green transition-all p-3 w-full text-center drop-shadow-default"
        >
          {t("general.login")}
        </Link>
        <h2 className=" bg-primary-green p-3 w-full text-center drop-shadow-default">
          {t("general.register")}
        </h2>
      </div>
      <form onSubmit={handleRegister} className="flex flex-col w-full">
        {statusMessage ? (
          <p className="text-red-500 text-center">{statusMessage.message}</p>
        ) : (
          <p>&nbsp;</p>
        )}
        <label htmlFor="username" className="pb-2 drop-shadow-default">
          {t("general.username")}
        </label>
        <input
          className="w-full p-3 mb-2 bg-tertairy-gray text-md text-white drop-shadow-default focus:outline-none focus:border-none focus:ring-0"
          type="text"
          name="username"
          onChange={(input) => setUsername(input.target.value)}
          placeholder={t("general.usernameT")}

        />
        <span className="text-red-500 mb-6">{usernameError}</span>
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
        <span className="text-red-500 mb-6">{passwordError}</span>
        <label htmlFor="repeat-password" className="pb-2 drop-shadow-default">
          {t("general.repeatPassword")}
        </label>
        <input
          className="w-full p-3 mb-2 bg-tertairy-gray text-md text-white drop-shadow-default focus:outline-none focus:border-none focus:ring-0"
          type="password"
          name="password"
          onChange={(input) => setRepeatPassword(input.target.value)}
          placeholder={t("general.passwordTR")}
        />
        <span className="text-red-500 mb-6">{repeatPasswordError}</span>

        {errorMessage && <p className="text-red-500">{errorMessage.message}</p>}

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
            {t("general.register")}
          </button>
        )}
      </form>
    </div>
  );
};

export default Login;
