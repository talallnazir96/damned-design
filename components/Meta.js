import Head from "next/head";
import Script from "next/script";
const Meta = ({ title, keywords, description }) => {
  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="keywords" content={keywords} />
      <meta name="description" content={description} />
      <meta charSet="utf-8" />
      <link rel="icon" href="/favicon.ico" />
      <meta property="og:locale" content="en_US" />
      <link rel="canonical" href="https://www.damnedventures.com" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://www.damnedventures.com" />
      <meta
        property="og:site_name"
        content="Damned Designs - Best Knives, EDC and Fidgets"
      />
      <meta
        property="article:modified_time"
        content={`${new Date().toISOString()}`}
      />
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>

      <Script
        type="text/javascript"
        src="https://cdn.routeapp.io/route-widget/stable/route-widget-stable.min.js"
      ></Script>
      <Script
        type="text/javascript"
        src="https://route-cdn.s3.amazonaws.com/route-widget-shopify/route-widget-static.min.js"
      ></Script>

      <title>{title}</title>
    </Head>
  );
};

Meta.defaultProps = {
  title: `Damned Designs - The best folding knives, EDC and Fidget products in ${new Date().getFullYear()}`,
  keywords:
    "knives, edc, fidgets, foldable, custom knives, best pocket knives, automatic knives, knife",
  description:
    "From folding knives to fidget spinners – Damned Designs is where breathtaking aesthetics meets uncompromising functionality.",
};

export default Meta;
