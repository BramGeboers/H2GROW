import Head from "next/head";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import LearnMoreButton from "@/components/LearnMoreButton";
import { useContext } from "react";
import { AuthContext } from "@/components/auth/AuthContext";

const Index: React.FC = () => {
  const { t } = useTranslation();
  const { isLoggedIn } = useContext(AuthContext);
  const app = useRef<HTMLElement | null>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const t1 = useRef<HTMLHeadingElement>(null);
  const loginRegisterRef = useRef<HTMLParagraphElement>(null);
  const learnMoreButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (app.current) {
      let ctx = gsap.context(() => {
        tl.current = gsap.timeline();
        if (tl.current && t1.current) {
          tl.current.from(t1.current, { y: "40", opacity: 0, delay: 0.2 });

          if (
            !isLoggedIn &&
            loginRegisterRef.current &&
            learnMoreButtonRef.current
          ) {
            tl.current
              .from(loginRegisterRef.current, { y: "40", opacity: 0.1 })
              .from(learnMoreButtonRef.current, { opacity: 0, delay: 0.2 });
          } else if (isLoggedIn && learnMoreButtonRef.current) {
            tl.current.from(learnMoreButtonRef.current, {
              opacity: 0,
              delay: 0.2,
            });
          }
        }
      }, app.current);
      return () => ctx.revert();
    }
  }, [isLoggedIn]);

  return (
    <>
      <div className="w-full">
        <Head>
          <title>{t("home.title")}</title>
          <meta name="description" content="Generated by create next app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.png" />
        </Head>
        <main
          ref={app}
          className="flex items-center w-[100%] justify-center p-8 flex-col text-white h-[calc(100vh-160px)]"
        >
          <div className="overflow-hidden">
            <h1 ref={t1} className="md:text-6xl text-5xl drop-shadow-default">
              {t("home.welcome")}
            </h1>
          </div>
          {isLoggedIn ? (
            <div className="text-center mt-5">
              <div ref={learnMoreButtonRef} className="mt-2">
                <LearnMoreButton />
              </div>
            </div>
          ) : (
            <div className="text-center mt-5">
              <div className="overflow-hidden">
                <p
                  ref={loginRegisterRef}
                  className="md:text-xl text-lg drop-shadow-default"
                >
                  <Link
                    href="/login"
                    className="font-medium text-primary-green"
                  >
                    {t("home.login")}
                  </Link>{" "}
                  {t("home.loginOrRegister")}
                </p>
              </div>
              <div ref={learnMoreButtonRef} className="mt-6">
                <LearnMoreButton />
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

export default Index;
