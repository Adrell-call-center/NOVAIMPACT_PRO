import Head from "next/head";
import RootLayout from "@/components/common/layout/RootLayout";
import PortfolioCaseStudy from "@/components/portfolio/PortfolioCaseStudy";
import { getProjectBySlug, getAllProjectSlugs } from "@/data/projects";

const SITE_URL = "https://novaimpact.io";

export async function getStaticPaths() {
  const slugs = getAllProjectSlugs();
  const paths = slugs.map((slug) => ({
    params: { slug },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      project,
    },
  };
}

const PortfolioDetails = ({ project }) => {
  const pageUrl = `${SITE_URL}/portfolio/${project.slug}`;

  return (
    <>
      <Head>
        <title>{project.seoTitle || `${project.title} — Case Study — Nova Impact`}</title>
        <meta name="description" content={project.metaDescription || project.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={`${project.title} — Nova Impact`} />
        <meta property="og:description" content={project.metaDescription || project.description} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={`${SITE_URL}${project.thumbnail}`} />
        <meta property="og:type" content="article" />
      </Head>
      <main>
        <RootLayout header="header3" footer="footer3">
          <PortfolioCaseStudy project={project} />
        </RootLayout>
      </main>
    </>
  );
};

export default PortfolioDetails;
