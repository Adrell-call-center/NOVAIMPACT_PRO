import RootLayout from "@/components/common/layout/RootLayout";
import PortfolioCaseStudy from "@/components/portfolio/PortfolioCaseStudy";
import PageSeo from "@/components/seo/PageSeo";
import { getProjectBySlug, getAllProjectSlugs } from "@/data/projects";
import { caseStudySchema } from "@/lib/schema-helpers";
import { absoluteUrl } from "@/lib/site";

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
  const pageUrl = absoluteUrl(`/portfolio/${project.slug}`);
  const title =
    project.seoTitle || `${project.title} — Case Study — Nova Impact`;
  const description = project.metaDescription || project.description;
  const ogImage = absoluteUrl(project.thumbnail || project.heroImage);

  return (
    <>
      <PageSeo
        title={title}
        description={description}
        canonical={pageUrl}
        ogImage={ogImage}
        ogType="article"
        schema={caseStudySchema(project)}
      />
      <main>
        <RootLayout header="header3" footer="footer3">
          <PortfolioCaseStudy project={project} />
        </RootLayout>
      </main>
    </>
  );
};

export default PortfolioDetails;
