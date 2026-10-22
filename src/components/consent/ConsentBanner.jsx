import Link from "next/link";
import { useEffect, useState } from "react";
import { loadMetaPixel, readConsent, writeConsent } from "@/lib/consent";
import styles from "@/styles/consent-banner.module.css";

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const choice = readConsent();
    if (choice === "granted") loadMetaPixel();
    if (!choice) setVisible(true);
  }, []);

  function choose(value) {
    writeConsent(value);
    if (value === "granted") loadMetaPixel();
    setVisible(false);
  }

  if (!visible) return null;

  return <div className={styles.banner} role="dialog" aria-label="Consentement aux cookies de mesure">
    <p className={styles.text}>
      Nous utilisons des cookies de mesure publicitaire pour savoir d’où viennent nos contacts. Vous pouvez refuser, le site fonctionne normalement. <Link href="/politique-confidentialite">Politique de confidentialité</Link>
    </p>
    <div className={styles.actions}>
      <button type="button" className={styles.decline} onClick={() => choose("denied")}>Refuser</button>
      <button type="button" className={styles.accept} onClick={() => choose("granted")}>Accepter</button>
    </div>
  </div>;
}
