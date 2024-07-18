import { NextSeo } from "next-seo";
import React from "react";

export default function SeoConfig({ passedSeoData }) {
  return (
    <NextSeo
      title={passedSeoData.title}
      description={passedSeoData.description}
      canonical={passedSeoData.url}
      twitter={{
        handle: "@handle",
        site: "@site",
        cardType: "summary_large_image",
      }}
    />
  );
}

export const SearchSEOConfig = ({ title }) => {
  return (
    <NextSeo
      title={`You Searched for ${title}`}
      description={SeoData.knives.description}
      twitter={{
        handle: "@handle",
        site: "@site",
        cardType: "summary_large_image",
      }}
    />
  );
};

export const IndividualProductSEOConfig = ({
  title,
  description,
  openGraph,
}) => {
  const { og_title, og_description, images, og_site_name } = openGraph;
  return (
    <NextSeo
      title={
        title
          ? title + " - Damned Designs"
          : "Premium Folding Pocket Knives for All Occasions - Damned Designs"
      }
      noindex={false}
      nofollow={false}
      description={
        og_description
          ? og_description
          : "Browse a range of products offered by Damned Designs"
      }
      twitter={{
        handle: "@handle",
        site: "@site",
        cardType: "summary_large_image",
      }}
      openGraph={{
        site_name: og_site_name,
        title: `${
          og_title
            ? og_title
            : "Premium Folding Pocket Knives for All Occasions - Damned Designs"
        }`,
        description: `${
          og_description
            ? og_description
            : "Browse a range of products offered by Damned Designs"
        }`,
        images: images,
      }}
    />
  );
};

export const SeoData = {
  knives: {
    title: "Premium Folding Pocket Knives for All Occasions - Damned Designs",
    description:
      "Damned Designs offers expertly crafted folding knives that are both beautiful to look at and tremendously functional. Affordable yet substantial.",
    url: "https://www.damnedventures.com/shop/knives/",
  },
  fidget: {
    title:
      "Fidget products: Fidget spinners, Clickers and Sliders - Damned Designs",
    description:
      "Stylishly designed and well-constructed, each Damned Design fidget product feels substantial and offers years of continued use and enjoyment to everyone.",
    url: "https://www.damnedventures.com/shop/fidget/",
  },
  edc: {
    title: "Every Day Carry: EDC tools and accessories - Damned Designs",
    description:
      "EDC tools, expertly crafted with great attention to detail. Damned Designs is where breathtaking aesthetics meets uncompromising functionality.",
    url: "https://www.damnedventures.com/shop/edc/",
  },
  login: {
    title: "Login to Your Account Damned Designs",
    description: "Login to View Orders and Items in Your Wishlist",
    url: "https://www.damnedventures.com/login/",
  },
  register: {
    title: "Create an Account - Damned Designs",
    description: "Create an Account to Shop Knives, EDC and Fidgets",
    url: "https://www.damnedventures.com/register/",
  },
  forgotPassword: {
    title: "Forgot Password - Damned Designs",
    description: "Reset Forgotten Account Password ",
    url: "https://www.damnedventures.com/forgot-password/",
  },
  cart: {
    title: "Cart and Products - Damned Designs",
    description: "Checkout Items in Cart ",
    url: "https://www.damnedventures.com/cart/",
  },
  contact: {
    title: "Damned Designs - Questions? Concerns? Contact us now!",
    description:
      "Questions? Concerns? Need help navigating the site? Want to know about upcoming projects? We would love to hear from you!",
    url: "https://www.damnedventures.com/contact/",
  },
  checkout: {
    title: "Checkout Your Orders - Damned Designs",
    description: "Checkout Items from Your Cart",
    url: "https://www.damnedventures.com/checkout/",
  },
  privacyPolicy: {
    title: "Privacy Policy - Damned Designs",
    description:
      "PRIVACY POLICY   Welcome to Damned Designs! Damned Designs is owned and operated by Damned Ventures LLC. Damned Designs values your privacy and the protection of your personal data. This privacy policy describes what information we collect from you, how we collect it, how we use it, how we obtain your consent",
    url: "https://www.damnedventures.com/privacy-policy/",
  },
  termsConditions: {
    title: "Terms & Conditions - Damned Designs",
    description:
      "This section of the website explains the terms and conditions that you need to know about when trying to purchase our variety......",
    url: "https://www.damnedventures.com/terms-conditions/",
  },
  returnPolicy: {
    title: "Returns Policy - Damned Designs",
    description:
      "Return & Refund Policy Thanks for shopping at Damned Designs. Since most of our products are sold on pre order, we only exchange or refund in case there are manufacturing defects. Returns You have 3 calendar days to reach out to us from the date you received it with proof of the defects.",
    url: "https://www.damnedventures.com/returns-policy/",
  },
  shop: {
    title: "All Products - Damned Designs",
    description: "Browse a range of products offered by Damned Designs",
    url: "https://www.damnedventures.com/all-products/",
  },
};
