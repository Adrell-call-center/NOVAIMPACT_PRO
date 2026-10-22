import { Kanit } from "next/font/google";
import { useRouter } from "next/router";
import { useEffect } from "react";
import ConsentBanner from "@/components/consent/ConsentBanner";
import { trackPageView } from "@/lib/consent";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../public/assets/scss/master.scss";
import "@/styles/extra.css";
import "@fortawesome/fontawesome-svg-core/styles.css";

import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

const kanit = Kanit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-kanit",
});

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    router.events.on("routeChangeComplete", trackPageView);
    return () => router.events.off("routeChangeComplete", trackPageView);
  }, [router.events]);

  return (
    <div className={kanit.className}>
      <Component {...pageProps} />
      <ConsentBanner />
    </div>
  );
}
