import Head from "next/head";
import RootLayout from "@/components/common/layout/RootLayout";
import Contact1 from "@/components/contact/Contact1";

const Contact = () => {
  return (
    <>
      <Head>
        <title>Contact Us — Nova Impact</title>
        <meta name="description" content="Get in touch with Nova Impact. We're based in Marseille, France." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <RootLayout header="header3" footer="footer3">
          <Contact1 />
        </RootLayout>
      </main>
    </>
  );
};

export default Contact;
