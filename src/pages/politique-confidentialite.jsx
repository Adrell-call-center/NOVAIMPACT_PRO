import RootLayout from "@/components/common/layout/RootLayout";
import Head from "next/head";

export default function PolitiqueConfidentialite() {
  return (
    <div>
      <Head>
        <title>Politique de confidentialité et de cookies — Nova Impact</title>
        <meta name="description" content="Politique de confidentialité et de cookies de NOVA IMPACT LTD." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <RootLayout>
        <main className="legal-page">
          <div className="container" style={{ maxWidth: "860px", margin: "0 auto", padding: "100px 20px 80px" }}>
            <h1 style={{ marginBottom: "10px" }}>Politique de confidentialité et de cookies</h1>
            <p style={{ marginBottom: "40px", color: "var(--gray-2)" }}>Dernière mise à jour : 21 mai 2025 — Date d'entrée en vigueur : 21 mai 2025</p>

            <p style={{ marginBottom: "40px" }}>
              Cette politique de confidentialité décrit les pratiques de NOVA IMPACT LTD, enregistrée au Royaume-Uni (Company Number : 16126510), dont le siège social est situé au 71-75, Shelton Street, Covent Garden, London, WC2H 9JQ, UNITED KINGDOM, e-mail : <a href="mailto:contact@novaimpact.io">contact@novaimpact.io</a>, concernant la collecte, l'utilisation et la protection de vos données personnelles lors de votre utilisation du site internet <a href="https://novaimpact.io">https://novaimpact.io</a>.
            </p>
            <p style={{ marginBottom: "40px" }}>
              En accédant ou en utilisant nos services, vous acceptez les conditions de cette politique. Si vous êtes en désaccord, merci de ne pas utiliser le site. Nous nous réservons le droit de modifier cette politique à tout moment. Toute modification prendra effet 180 jours après sa publication sur notre site.
            </p>

            <section style={{ marginBottom: "40px" }}>
              <h2>Données que nous collectons</h2>
              <p>Nous pouvons recueillir les données personnelles suivantes :</p>
              <ul>
                <li>Nom et prénom</li>
                <li>Adresse email</li>
                <li>Numéro de téléphone</li>
                <li>Date de naissance</li>
                <li>Adresse postale</li>
                <li>Données de connexion ou de navigation</li>
              </ul>
            </section>

            <section style={{ marginBottom: "40px" }}>
              <h2>Utilisation de vos informations</h2>
              <p>Nous utilisons vos données pour :</p>
              <ul>
                <li>Communiquer à des fins marketing et promotionnelles</li>
                <li>Mesurer l'audience de notre site</li>
                <li>Recueillir des avis clients</li>
                <li>Diffuser des publicités ciblées</li>
                <li>Garantir la sécurité du site</li>
              </ul>
              <p>Toute autre utilisation nécessitera votre consentement préalable.</p>
            </section>

            <section style={{ marginBottom: "40px" }}>
              <h2>Partage des données</h2>
              <p>Nous ne partageons vos données personnelles qu'avec :</p>
              <ul>
                <li>Prestataires de publicité</li>
                <li>Agences de marketing digital</li>
                <li>Outils d'analytique (ex. Google Analytics)</li>
              </ul>
              <p>Ces tiers s'engagent à utiliser vos données uniquement pour les objectifs définis et à ne pas les conserver au-delà de la durée nécessaire.</p>
              <p>Vos informations peuvent être divulguées si :</p>
              <ul>
                <li>Une obligation légale l'exige</li>
                <li>Une acquisition ou fusion de NOVA IMPACT LTD intervient</li>
                <li>Cela est nécessaire pour faire respecter nos conditions d'utilisation</li>
              </ul>
            </section>

            <section style={{ marginBottom: "40px" }}>
              <h2>Durée de conservation</h2>
              <p>Vos données personnelles sont conservées entre 90 jours et 2 ans après inactivité de votre compte, sauf obligations légales contraires. Certaines données anonymisées peuvent être conservées sans limite de durée à des fins d'analyses statistiques.</p>
            </section>

            <section style={{ marginBottom: "40px" }}>
              <h2>Vos droits</h2>
              <p>Conformément à la réglementation (RGPD ou autres lois applicables), vous disposez des droits suivants :</p>
              <ul>
                <li>Accès, rectification ou suppression de vos données</li>
                <li>Limitation ou opposition au traitement</li>
                <li>Portabilité des données</li>
                <li>Retrait du consentement</li>
                <li>Dépôt de plainte auprès de l'autorité compétente</li>
              </ul>
              <p>Pour exercer ces droits, contactez-nous à <a href="mailto:contact@novaimpact.io">contact@novaimpact.io</a>. Vous pouvez également vous désinscrire de nos communications à tout moment via le lien de désabonnement.</p>
            </section>

            <section style={{ marginBottom: "40px" }}>
              <h2>Cookies et technologies similaires</h2>
              <p>Nous utilisons des cookies pour améliorer votre navigation et analyser le trafic. Pour en savoir plus, consultez notre Politique relative aux cookies (disponible prochainement sur notre site).</p>
            </section>

            <section style={{ marginBottom: "40px" }}>
              <h2>Sécurité des données</h2>
              <p>Nous appliquons des mesures techniques et organisationnelles pour protéger vos données. Toutefois, aucun système n'est totalement sécurisé. Toute transmission se fait à vos risques et périls.</p>
            </section>

            <section style={{ marginBottom: "40px" }}>
              <h2>Liens vers des sites tiers</h2>
              <p>Notre site peut contenir des liens vers des sites externes. Nous déclinons toute responsabilité concernant leurs pratiques en matière de données. Veuillez consulter leurs politiques de confidentialité respectives.</p>
            </section>

            <section style={{ marginBottom: "40px" }}>
              <h2>Responsable de la protection des données</h2>
              <p>Pour toute question concernant cette politique ou le traitement de vos données, vous pouvez nous écrire à :</p>
              <address style={{ fontStyle: "normal", lineHeight: "1.8" }}>
                NOVA IMPACT LTD<br />
                71-75 Shelton Street, Covent Garden,<br />
                London, WC2H 9JQ, United Kingdom<br />
                Email : <a href="mailto:contact@novaimpact.io">contact@novaimpact.io</a>
              </address>
            </section>
          </div>
        </main>
      </RootLayout>
    </div>
  );
}
