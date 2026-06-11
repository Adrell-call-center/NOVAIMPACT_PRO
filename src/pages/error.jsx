import RootLayout from "@/components/common/layout/RootLayout";
import Error1 from "@/components/error/Error1";
import PageSeo from "@/components/seo/PageSeo";

const Error = () => {
  return (
    <>
      <PageSeo
        title="Page Not Found — Nova Impact"
        description="The page you are looking for could not be found."
        robots="noindex, nofollow"
      />
      <main>
        <RootLayout header="header3" footer="none">
          <Error1 />
        </RootLayout>
      </main>
    </>
  );
};

export default Error;
