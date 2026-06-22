import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />

        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/assets/imgs/logo/favicon.png" />
        <link rel="apple-touch-icon" href="/assets/imgs/logo/favicon.png" />

        {/* Verification placeholders (replace with real codes) */}
        {/* <meta name="google-site-verification" content="YOUR_CODE" /> */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
