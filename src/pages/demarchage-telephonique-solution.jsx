import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import PageSeo from "@/components/seo/PageSeo";
import { trackLead } from "@/lib/consent";
import { absoluteUrl, ORGANIZATION_ID, SITE_URL } from "@/lib/site";
import { breadcrumbSchema, webPageSchema } from "@/lib/schema-helpers";
import styles from "@/styles/avant-appel.module.css";

const image = (name) => `/images/avant/${name}`;
const PAGE_PATH = "/demarchage-telephonique-solution";
const PAGE_URL = absoluteUrl(PAGE_PATH);
const PAGE_TITLE = "Solution de démarchage téléphonique AVANT | Nova Impact";
const PAGE_DESCRIPTION = "AVANT vérifie les données et preuves disponibles de vos prospects, puis relie votre site d’acquisition à un tableau de bord pour les nouveaux leads et leur consentement.";

const faqs = [
  ["Le formulaire suffit-il à autoriser un appel ?", "Non. Le consentement doit être libre, spécifique, éclairé, univoque et révocable. Une case précochée ou une simple saisie de numéro ne suffit pas."],
  ["Puis-je conserver mon CRM actuel ?", "Oui. AVANT est pensé comme une étape de vérification et de traçabilité qui s’ajoute à votre organisation. Les intégrations sont définies selon votre environnement."],
  ["Puis-je appeler une ancienne base de prospects ?", "Pas automatiquement. Chaque contact doit disposer d’une base légale applicable et d’une autorisation valable lorsque celle-ci est requise."],
  ["Combien de temps le consentement reste-t-il valable ?", "La durée dépend des règles applicables et du contexte. Les échéances et les retraits doivent être suivis avant toute prise de contact."],
];

const pageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    { ...webPageSchema({ url: PAGE_URL, name: PAGE_TITLE, description: PAGE_DESCRIPTION }), inLanguage: "fr-FR", primaryImageOfPage: { "@type": "ImageObject", url: absoluteUrl(image("hero-dashboard-real.webp")) } },
    breadcrumbSchema([
      { name: "Accueil", url: SITE_URL },
      { name: "Solution de démarchage téléphonique", url: PAGE_URL },
    ]),
    {
      "@type": "Service",
      "@id": `${PAGE_URL}#service`,
      name: "AVANT — solution de démarchage téléphonique",
      description: PAGE_DESCRIPTION,
      url: PAGE_URL,
      serviceType: "Vérification des contacts, traçabilité du consentement et acquisition de prospects",
      provider: { "@id": ORGANIZATION_ID },
      areaServed: { "@type": "Country", name: "France" },
    },
    {
      "@type": "FAQPage",
      "@id": `${PAGE_URL}#faq`,
      mainEntity: faqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })),
    },
  ],
};

function DemoForm({ onSuccess }) {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    setStatus("sending");
    setError("");
    try {
      const response = await fetch("/api/avant-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          company: values.company.trim(),
          message: values.message.trim(),
        }),
      });
      if (!response.ok) throw new Error("Votre demande n’a pas pu être envoyée. Réessayez dans un instant.");
      // Tracked only once the server has accepted the lead.
      trackLead({
        email: values.email,
        phone: values.phone,
        name: values.name,
      });
      form.reset();
      setStatus("sent");
      onSuccess?.();
    } catch (err) {
      setError(err.message);
      setStatus("idle");
    }
  }

  return <form className={styles.demoForm} action="/api/avant-demo" method="post" onSubmit={handleSubmit}>
    <div className={styles.formFields}>
      <label>Nom complet <input name="name" autoComplete="name" required placeholder="Votre nom" /></label>
      <label>Email professionnel <input name="email" type="email" autoComplete="email" required placeholder="vous@entreprise.fr" /></label>
      <label>Entreprise <input name="company" autoComplete="organization" required placeholder="Nom de votre société" /></label>
      <label>Téléphone <input name="phone" type="tel" autoComplete="tel" placeholder="Votre numéro" /></label>
    </div>
    <label>Votre besoin <textarea name="message" rows="4" placeholder="Votre activité, votre CRM, votre volume d’appels…" /></label>
    <button className={styles.limeButton} type="submit" disabled={status === "sending"}>{status === "sending" ? "Envoi en cours…" : "Envoyer ma demande →"}</button>
    {status === "sent" && <p className={styles.formSuccess} role="status">Merci ! Votre demande a bien été envoyée. Nous vous répondrons bientôt.</p>}
    {error && <p className={styles.formError} role="alert">{error}</p>}
  </form>;
}

export default function AvantAppel() {
  const pageRef = useRef(null);

  useEffect(() => {
    const root = pageRef.current;
    if (!root || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const targets = [...root.querySelectorAll('main section, main article')].filter((node) => !node.classList.contains(styles.hero));
    targets.forEach((node) => node.classList.add(styles.scrollTarget));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.scrollVisible);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px 40px 0px' });
    targets.forEach((node) => observer.observe(node));
    root.classList.add(styles.motionReady);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const pauseClosedVideo = () => {
      if (window.location.hash !== "#video-dialog") document.querySelector("#video-dialog video")?.pause();
    };
    window.addEventListener("hashchange", pauseClosedVideo);
    return () => window.removeEventListener("hashchange", pauseClosedVideo);
  }, []);

  return (
    <>
      <PageSeo title={PAGE_TITLE} description={PAGE_DESCRIPTION} keywords="solution démarchage téléphonique, vérification contacts, consentement prospection, leads organiques, AVANT" canonical={PAGE_URL} ogImage={absoluteUrl(image("hero-dashboard-real.webp"))} schema={pageSchema} />
      <Head>
        <meta name="theme-color" content="#fafaf8" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>
      <div ref={pageRef} className={styles.page} id="top">
        <header className={styles.header}>
          <div className={styles.wrap + " " + styles.nav}>
            <a className={styles.headerLogo} href="/" aria-label="Nova Impact, accueil"><img src="/assets/imgs/logo/logo-black.png" alt="Nova Impact" /></a>
            <nav id="avant-navigation" aria-label="Navigation principale"><a href="#solution">La solution</a><a href="#fonctionnement">Comment ça marche</a><a href="#clients">Nos clients</a><a href="#faq">Questions fréquentes</a><a href="#contact">Contact</a></nav>
            <div className={styles.headerActions}><a className={styles.limeButton} href="#contact-dialog"><span className={styles.desktopDemoLabel}>Nous contacter</span><span className={styles.mobileDemoLabel}>Contact</span> <b>→</b></a><details className={styles.mobileMenu}><summary aria-label="Ouvrir le menu"><span /><span /><span /></summary><nav aria-label="Navigation mobile"><a href="#solution">La solution</a><a href="#fonctionnement">Comment ça marche</a><a href="#clients">Nos clients</a><a href="#faq">Questions fréquentes</a><a href="#contact">Contact</a></nav></details></div>
          </div>
        </header>

        <main>
          <section className={styles.hero}>
            <div className={styles.wrap + " " + styles.heroGrid}>
              <div className={styles.heroCopy}>
                <span className={styles.tag}>SOLUTION DÉMARCHAGE TÉLÉPHONIQUE · FRANCE</span>
                <h1>Vos commerciaux savent vendre.<br />Donnez-leur le droit d’appeler.</h1>
                <p className={styles.lead}>Gardez vos équipes, votre CRM et votre méthode de travail. Ajoutez la preuve de consentement avant chaque appel.</p>
                <div className={styles.actions}><a className={styles.darkButton} href="#contact-dialog">Parler de votre projet <span>→</span></a><a className={styles.outlineButton} href="#video-dialog"><span>▷</span> Voir comment ça marche</a></div>
                <div className={styles.benefits}><span><b>♧</b>Vos équipes restent les mêmes</span><span><b>▤</b>Compatible avec votre CRM</span><span><b>♢</b>Une prospection plus sereine</span></div>
              </div>
              <div className={styles.heroVisual}>
                <img src={image("hero-dashboard-real.webp")} alt="Tableau de bord AVANT avec liste importée, lead qualifié et preuve de consentement" />
              </div>
            </div>
          </section>

          <div className={styles.ribbon}><div className={styles.wrap}><strong>LE BON RÉFLEXE, AVANT L’APPEL</strong><span>Une autorisation vérifiable, un historique clair et un contrôle avant la mise en relation.</span><a href="#solution">Découvrir →</a></div></div>

          <section className={styles.story}>
            <div className={styles.storyGrid}><div className={styles.storyVisual}><img className={styles.storyPhoto} src={image("focused_call_center_specialist.webp")} alt="Conseillère au casque dans un centre d’appels" /><p className={styles.photoNote}>Toujours la même envie de développer<br />de nouvelles opportunités.</p></div><div className={styles.storyCopy}><span className={styles.eyebrow}>LA RÉALITÉ AUJOURD’HUI</span><h2>Hier, un numéro suffisait.<br />Aujourd’hui, il faut une preuve.</h2><p>Vos équipes veulent continuer à développer votre activité. Mais un numéro collecté sans autorisation valable ne suffit pas à justifier un appel commercial.</p><div className={styles.warning}><span>⚠</span><div><strong>Consentement introuvable</strong><p>Sans preuve suffisante, le lead doit être vérifié avant que l’équipe ne l’appelle.</p></div><b className={styles.phoneIcon}>⌕</b></div><p className={styles.handNote}>Un risque pour vos équipes<br />et pour votre activité.</p></div></div>
          </section>

          <section className={styles.section} id="solution"><div className={styles.wrap}>
            <span className={styles.eyebrow}>NOTRE SOLUTION</span><div className={styles.sectionIntro}><h2>Votre liste de prospects, vérifiée.<br />De nouveaux leads, documentés dès leur arrivée.</h2><p>AVANT relie deux besoins : contrôler les contacts déjà présents dans votre CRM et créer un parcours d’acquisition qui recueille le consentement des nouveaux prospects.</p></div>
            <div className={styles.solutionCards}>
              <article className={styles.solutionCard}><div className={styles.solutionNumber}>01 <i /></div><h3>Vous avez déjà une liste de prospects</h3><p>Votre CRM ou votre fichier peut contenir des contacts sans preuve d’accord valable. Avant de les appeler, identifiez ceux dont l’autorisation manque ou doit être examinée.</p><span className={styles.solutionBadge + " " + styles.solutionBadgeRed}>⚠ Liste à vérifier</span><a className={styles.solutionImage} href="#image-prospects-dialog" aria-label="Agrandir l’image de la liste de prospects"><img src={image("liste-de-prospects.webp")} alt="Exemple de liste importée avec consentement manquant" /><span>Agrandir l’image ↗</span></a><div className={styles.solutionCaption}><strong>Le point de départ :</strong> posséder un numéro ne donne pas, à lui seul, le droit d’appeler.</div></article>
              <article className={styles.solutionCard}><div className={styles.solutionNumber}>02 <i /></div><h3>AVANT contrôle chaque contact</h3><p>La solution analyse les données disponibles, repère les preuves manquantes et distingue les contacts vérifiés de ceux à compléter ou à exclure de la prospection.</p><span className={styles.solutionBadge + " " + styles.solutionBadgePurple}>✓ Vérification et tri</span><a className={styles.solutionImage} href="#image-verification-dialog" aria-label="Agrandir l’image de vérification des contacts"><img src={image("verification-des-contacts.webp")} alt="Exemple de tableau de vérification des contacts et de leurs statuts" /><span>Agrandir l’image ↗</span></a><div className={styles.solutionCaption}><strong>Pour votre équipe :</strong> un statut et une preuve visibles avant de décider d’appeler. Une ancienne liste sans accord ne devient pas autorisée par simple import.</div></article>
              <article className={styles.solutionCard}><div className={styles.solutionNumber}>03 <i /></div><h3>Nous créons aussi de nouveaux leads</h3><p>Un site personnalisé attire des visiteurs depuis la recherche. Ses formulaires recueillent les demandes et transmettent les nouveaux leads à votre tableau de bord avec leur source et leur preuve de consentement.</p><span className={styles.solutionBadge + " " + styles.solutionBadgeGreen}>↗ Site, leads et tableau de bord</span><a className={styles.solutionImage} href="#image-leads-dialog" aria-label="Agrandir l’image des nouveaux leads"><img src={image("leads-organiques.webp")} alt="Parcours du trafic organique au formulaire puis au tableau de bord des leads" /><span>Agrandir l’image ↗</span></a><div className={styles.solutionCaption}><strong>Le résultat :</strong> un parcours d’acquisition sur mesure, des demandes entrantes et une trace de l’accord donné lors de chaque formulaire.</div></article>
            </div>
            <p className={styles.solutionNote}><strong>Le parcours en bref :</strong> importez vos contacts existants pour identifier les situations à vérifier, puis développez une acquisition organique avec un site et un tableau de bord adaptés à votre activité.</p>
            <div className={styles.sectionCta}><a className={styles.limeButton} href="#contact-dialog">Parler de votre projet <b>→</b></a></div>
          </div></section>

          <section className={styles.process} id="fonctionnement"><div className={styles.wrap}><span className={styles.eyebrow}>VOTRE PARCOURS, SIMPLEMENT SÉCURISÉ</span><div className={styles.processHeading}><h2>Même équipe.<br />Même CRM.<br />Un nouveau réflexe.</h2><p>Contrôlez votre base existante et recevez de nouveaux leads documentés avant la prise de contact.</p></div><div className={styles.steps}>{[["glossy_purple_database_icon.webp","VOTRE LISTE","Importez les contacts de votre CRM"],["glossy_purple_shield_checkmark_icon.webp","VÉRIFICATION","Repérez les preuves et les accords manquants"],["glossy_purple_form_icon_badge.webp","NOUVEAUX LEADS","Le site recueille les demandes et leur consentement"],["glossy_lime_phone_call_button.webp","APPEL","Vos équipes vérifient avant d’appeler"]].map(([src,title,desc])=><div className={styles.step} key={title}><img src={image(src)} alt=""/><strong>{title}</strong><p>{desc}</p></div>)}</div><div className={styles.sectionCta}><a className={styles.limeButton} href="#contact-dialog">Parler de votre projet <b>→</b></a></div></div></section>

          <section className={styles.clients} id="clients"><div className={styles.wrap}><div className={styles.clientsIntro}><div><span className={styles.eyebrow}>NOS CLIENTS</span><h2>Des parcours d’acquisition<br />dans des secteurs exigeants.</h2></div><p>Découvrez trois plateformes de comparaison et d’information dans l’univers de la complémentaire santé.</p></div><div className={styles.clientCards}>
            <a className={styles.clientCard} href="https://my-mutuelle.com/" target="_blank" rel="noopener noreferrer"><img src={image("client-my-mutuelle.webp")} alt="Logo MyMutuelle" /><div className={styles.clientDomain}>my-mutuelle.com <span>↗</span></div><p>Comparaison de complémentaires santé et parcours de demande personnalisée.</p><strong>Découvrir le site →</strong></a>
            <a className={styles.clientCard} href="https://mutuellespaschere.com/" target="_blank" rel="noopener noreferrer"><img src={image("client-mutuelle-pas-chere.webp")} alt="Logo Mutuelle pas chère" /><div className={styles.clientDomain}>mutuellespaschere.com <span>↗</span></div><p>Information et recherche de solutions de mutuelle adaptées aux besoins des particuliers.</p><strong>Découvrir le site →</strong></a>
            <a className={styles.clientCard} href="https://mutuelle-senior-pas-chere.fr/" target="_blank" rel="noopener noreferrer"><img src={image("client-mutuelle-senior.webp")} alt="Logo Mutuelle senior pas chère" /><div className={styles.clientDomain}>mutuelle-senior-pas-chere.fr <span>↗</span></div><p>Parcours d’information et de comparaison dédié aux complémentaires santé senior.</p><strong>Découvrir le site →</strong></a>
          </div><p className={styles.clientNote}>Ces références illustrent notre expérience des parcours digitaux et de la génération de demandes.</p></div></section>

          <section className={styles.section + " " + styles.faqSection} id="faq"><div className={styles.wrap + " " + styles.faqGrid}><div className={styles.faqHeading}><span className={styles.eyebrow}>QUESTIONS FRÉQUENTES</span><h2>Des questions ?<br />Nous y répondons.</h2></div><div className={styles.faqList}>{faqs.map(([question,answer])=><details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div><div className={styles.faqVisual}><img className={styles.faqPhoto} src={image("friendly_tech_support_professional.webp")} alt="Conseiller AVANT prêt à accompagner votre équipe" /><span>Une équipe à vos côtés<br />à chaque étape.</span></div></div></section>

          <section className={styles.cta}><div className={styles.wrap + " " + styles.ctaGrid}><div><span className={styles.eyebrow}>PASSEZ À L’ACTION</span><h2>Ne laissez pas la réglementation freiner votre croissance.</h2><p className={styles.lead}>Découvrez comment préparer vos équipes à une prospection mieux documentée.</p><a className={styles.limeButton} href="#contact-dialog">Parler de votre projet <b>→</b></a></div><div className={styles.ctaVisual}><img src={image("friendly_tech_support_professional.webp")} alt="Un conseiller disponible pour présenter AVANT"/><p className={styles.signature}>La preuve avant l’appel.<br />Simple. Efficace. Durable.</p><div className={styles.brandCard}><strong>AVANT<span>.</span></strong><small>La preuve avant l’appel.</small></div></div></div></section>
          <section className={styles.contactSection} id="contact"><div className={styles.wrap + " " + styles.contactGrid}><div><span className={styles.eyebrow}>PARLONS DE VOTRE PROJET</span><h2>Voyons comment AVANT s’intègre à votre activité.</h2><p>Présentez-nous vos équipes et vos outils. Nous reviendrons vers vous pour préparer une présentation adaptée à vos besoins.</p></div><div className={styles.contactPanel}><h3>Parlons de votre projet</h3><p id="contact-sent" className={styles.nativeSuccess} role="status">Merci ! Votre demande a bien été envoyée.</p><p id="contact-error" className={styles.nativeError} role="alert">L’envoi a échoué. Réessayez ou contactez-nous directement.</p><DemoForm /></div></div></section>
        </main>

        <footer className={styles.footer}><div className={styles.wrap}><a className={styles.footerLogo} href="/" aria-label="Nova Impact, accueil"><img src="/assets/imgs/logo/footer-logo-white.png" alt="Nova Impact" /></a><nav aria-label="Liens de pied de page"><a href="#solution">La solution</a><a href="#fonctionnement">Comment ça marche</a><a href="#clients">Nos clients</a><a href="#faq">Questions fréquentes</a><a href="#contact">Nous contacter</a></nav><small>AVANT · La preuve avant l’appel</small></div></footer>
      </div>
      <div id="contact-dialog" className={styles.modalBackdrop}><div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="demo-modal-title"><a className={styles.modalClose} href="#contact" aria-label="Fermer">×</a><span className={styles.eyebrow}>CONTACTEZ-NOUS</span><h2 id="demo-modal-title">Parlons de votre projet</h2><p>Décrivez votre activité et nous reviendrons vers vous avec une présentation adaptée.</p><DemoForm /></div></div>
      <div id="video-dialog" className={styles.modalBackdrop}><div className={styles.videoModal} role="dialog" aria-modal="true" aria-labelledby="video-modal-title"><a className={styles.videoClose} href="/demarchage-telephonique-solution?video=closed#fonctionnement" onClick={(event) => { event.preventDefault(); window.location.hash = "fonctionnement"; }} aria-label="Fermer la vidéo">×</a><span className={styles.eyebrow}>SOLUTION DÉMARCHAGE TÉLÉPHONIQUE · FRANCE</span><h2 id="video-modal-title">Comment ça marche</h2><video controls playsInline preload="metadata" poster="/videos/prospection-consentement-poster.jpg" aria-label="Démonstration de la prospection avec consentement"><source src="/videos/prospection-consentement.mp4" type="video/mp4" />Votre navigateur ne peut pas lire cette vidéo.</video></div></div>
      <div id="image-prospects-dialog" className={styles.imageBackdrop}><div className={styles.imageDialog} role="dialog" aria-modal="true" aria-label="Liste de prospects"><a className={styles.imageClose} href="#solution" aria-label="Fermer l’image">×</a><img src={image("liste-de-prospects.webp")} alt="Exemple de liste importée avec consentement manquant" /></div></div>
      <div id="image-verification-dialog" className={styles.imageBackdrop}><div className={styles.imageDialog} role="dialog" aria-modal="true" aria-label="Vérification des contacts"><a className={styles.imageClose} href="#solution" aria-label="Fermer l’image">×</a><img src={image("verification-des-contacts.webp")} alt="Exemple de tableau de vérification des contacts et de leurs statuts" /></div></div>
      <div id="image-leads-dialog" className={styles.imageBackdrop}><div className={styles.imageDialog} role="dialog" aria-modal="true" aria-label="Nouveaux leads"><a className={styles.imageClose} href="#solution" aria-label="Fermer l’image">×</a><img src={image("leads-organiques.webp")} alt="Parcours du trafic organique au formulaire puis au tableau de bord des leads" /></div></div>
    </>
  );
}
