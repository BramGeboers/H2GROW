import "@/styles/globals.css";
import { appWithTranslation } from "next-i18next";
import type { AppProps } from "next/app";
import localfont from "next/font/local";
import { JetBrains_Mono } from 'next/font/google'

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "flag-icons/css/flag-icons.min.css";
import { AuthProvider } from "@/components/auth/AuthContext";
import { usePathname } from "next/navigation";

const monoJet = JetBrains_Mono({
  subsets: ["latin"],
});

// const mono = localfont({
//   src: [
//     {
//       path: "@/public/fonts/JetBrainsMono-Light.ttf",
//       weight: "300",
//     },
//     {
//       path: "@/public/fonts/JetBrainsMono-Regular.ttf",
//       weight: "400",
//     },
//     {
//       path: "@/public/fonts/JetBrainsMono-Medium.ttf",
//       weight: "500",
//     },
//     {
//       path: "@/public/fonts/JetBrainsMono-Semibold.ttf",
//       weight: "600",
//     },
//     {
//       path: "@/public/fonts/JetBrainsMono-Bold.ttf",
//       weight: "700",
//     },
//   ],
//   variable: "--font-mono",
// });

const App = ({ Component, pageProps }: AppProps) => {
  const url = usePathname();
  if (url.includes("/game")) {
    return (
      <div
        className={`${monoJet.className} min-h-screen font-mono bg-repeat-y bg-cover bg-black`}
      >
        <Component {...pageProps} />
      </div>
    );
  }
  return (
    <AuthProvider>
      <>
        <div
          className={`${monoJet.className} min-h-[100vh] bg-hero-pattern font-mono bg-repeat-y bg-cover bg-tertairy-gray`}
        >
          <div className="min-h-[95vh]">
            <Navbar />
            <Component {...pageProps} />
          </div>
          <Footer />
        </div>
      </>
    </AuthProvider>
  );
};

export default appWithTranslation(App);
