import Head from "next/head";
import RootLayout from "@/components/common/layout/RootLayout";
import PortfolioDetails1 from "@/components/portfolio/PortfolioDetails1";
import { getProjectBySlug, getAllProjectSlugs } from "@/data/projects";

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
  return (
    <>
      <Head>
        <title>{project.title} — Case Study — Nova Impact</title>
        <meta
          name="description"
          content={`How Nova Impact transformed ${project.title}'s online presence through digital strategy and design.`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={`${project.title} — Nova Impact`} />
        <meta property="og:description" content={project.description} />
        <meta property="og:url" content={project.url} />
        <meta property="og:type" content="website" />
      </Head>
      <main>
        <RootLayout header="header3" footer="footer3">
          <PortfolioDetails1 project={project} />
        </RootLayout>
      </main>
    </>
  );
};

export default PortfolioDetails;
