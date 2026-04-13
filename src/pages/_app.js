import { Kanit } from "next/font/google";
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
  return (
    <main className={kanit.className}>
      <Component {...pageProps} />
    </main>
  );
}
