import Head from "next/head";
import RootLayout from "@/components/common/layout/RootLayout";
import PortfolioDetails1 from "@/components/portfolio/PortfolioDetails1";

const PortfolioDetails = () => {
  return (
    <>
      <Head>
        <title>Zoom Assurance — Case Study — Nova Impact</title>
        <meta name="description" content="How Nova Impact transformed Zoom Assurance's online presence through digital strategy and SEO." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <RootLayout header="header3" footer="footer3">
          <PortfolioDetails1 />
        </RootLayout>
      </main>
    </>
  );
};

export default PortfolioDetails;
