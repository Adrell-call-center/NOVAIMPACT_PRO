import RootLayout from "@/components/common/layout/RootLayout";
import Head from "next/head";

export default function MentionsLegales() {
  return (
    <div>
      <Head>
        <title>Mentions légales — Nova Impact</title>
        <meta name="description" content="Mentions légales et informations légales de NOVA IMPACT LTD." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <RootLayout>
        <main className="legal-page">
          <div className="container" style={{ maxWidth: "860px", margin: "0 auto", padding: "100px 20px 80px" }}>
            <h1 style={{ marginBottom: "40px" }}>Mentions légales</h1>

            <section style={{ marginBottom: "40px" }}>
              <h2>Informations légales</h2>
              <p><strong>Raison sociale :</strong> NOVA IMPACT LTD</p>
              <p><strong>Forme juridique :</strong> Private Limited Company (LTD)</p>
              <p><strong>Numéro d'enregistrement :</strong> 16126510 (Companies House – Royaume-Uni)</p>
              <p><strong>Siège social :</strong> 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, UNITED KINGDOM</p>
              <p><strong>Site internet :</strong> <a href="https://novaimpact.io">https://novaimpact.io</a></p>
              <p><strong>Email :</strong> <a href="mailto:contact@novaimpact.io">contact@novaimpact.io</a></p>
              <p><strong>Directeur de la publication :</strong> M. Zak MEG</p>
              <p>Le site internet <a href="https://novaimpact.io">https://novaimpact.io</a> est édité par la société NOVA IMPACT LTD.</p>
              <p>La conception et le développement ont été réalisés en interne par NOVA IMPACT LTD.</p>
              <p>L'hébergement est assuré par Namecheap, Inc. – 4600 East Washington Street, Suite 305, Phoenix, AZ 85034, USA.</p>
              <p>Ce site est régi par la législation britannique et, le cas échéant, par la réglementation européenne. Les utilisateurs étrangers sont invités à vérifier la conformité de leur navigation aux lois locales.</p>
              <p>Les présentes mentions peuvent être modifiées à tout moment, sans préavis. Nous vous conseillons de les consulter régulièrement.</p>
            </section>

            <section style={{ marginBottom: "40px" }}>
              <h2>Crédits</h2>
              <p><strong>Responsable de la publication :</strong> M. Zak MEG</p>
              <p><strong>Email de contact :</strong> <a href="mailto:contact@novaimpact.io">contact@novaimpact.io</a></p>
            </section>

            <section style={{ marginBottom: "40px" }}>
              <h2>Avertissement</h2>
              <p>NOVA IMPACT LTD veille à la fiabilité des informations publiées sur son site, mais ne garantit ni leur exactitude, ni leur actualisation constante.</p>
              <p>Le contenu peut être modifié à tout moment sans préavis.</p>
              <p>NOVA IMPACT LTD décline toute responsabilité en cas d'erreurs, d'omissions, ou d'intrusions extérieures.</p>
              <p>La société ne pourra être tenue responsable de tout dommage direct ou indirect lié à l'utilisation de ce site.</p>
              <p>Aucune donnée personnelle n'est commercialisée. Les éventuelles données collectées servent uniquement à des fins statistiques ou de service.</p>
            </section>

            <section style={{ marginBottom: "40px" }}>
              <h2>Propriété intellectuelle</h2>
              <p>Tous les contenus présents sur le site <a href="https://novaimpact.io">https://novaimpact.io</a> (textes, images, illustrations, logos, icônes…) sont la propriété exclusive de NOVA IMPACT LTD, sauf mention contraire.</p>
              <p>Toute reproduction, représentation ou modification sans autorisation écrite préalable est strictement interdite.</p>
              <p>Toute utilisation non autorisée sera considérée comme une contrefaçon et pourra faire l'objet de poursuites selon les lois en vigueur au Royaume-Uni et dans l'UE.</p>
            </section>

            <section style={{ marginBottom: "40px" }}>
              <h2>Cookies et traceurs</h2>
              <p>Ce site utilise des cookies à des fins de mesure d'audience et d'interactions sociales. Conformément à la réglementation européenne, votre consentement est requis avant toute activation de ces traceurs.</p>
              <p>Vous pouvez configurer votre navigateur pour accepter ou refuser les cookies. Le refus de cookies peut restreindre certaines fonctionnalités.</p>
              <h3 style={{ marginTop: "20px" }}>Mesure d'audience</h3>
              <p>Les cookies analytiques permettent de suivre les visites, pages consultées et sources de trafic.</p>
              <p>Ce site utilise notamment : Google Analytics, Meta Pixel, LinkedIn Insight, Hotjar.</p>
            </section>

            <section style={{ marginBottom: "40px" }}>
              <h2>Newsletter</h2>
              <p>En vous abonnant à notre newsletter, vous acceptez de recevoir des communications de notre part.</p>
              <p>Vous pouvez vous désabonner à tout moment via le lien en bas de chaque email. Vos données restent strictement confidentielles.</p>
            </section>

            <section style={{ marginBottom: "40px" }}>
              <h2>Liens hypertextes</h2>
              <p>Le site peut contenir des liens vers des sites tiers. NOVA IMPACT LTD ne contrôle pas le contenu de ces sites et décline toute responsabilité à leur égard.</p>
            </section>

            <section style={{ marginBottom: "40px" }}>
              <h2>Flux RSS</h2>
              <p>Les flux RSS de ce site sont réservés à un usage personnel. Toute republication sans accord écrit est interdite.</p>
            </section>
          </div>
        </main>
      </RootLayout>
    </div>
  );
}
