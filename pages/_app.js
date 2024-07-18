import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-notifications/lib/notifications.css";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Router from "next/router";
import { AppProvider } from "../contextAPI/context";
import ScrollToTop from "../components/ScrollToTop";
import { QueryClient, QueryClientProvider } from "react-query";
import { useState } from "react";
import { useEffect } from "react";
import Script from "next/script";

NProgress.configure({
  minimum: 0.3,
  easing: "ease",
  speed: 800,
  showSpinner: false,
});

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  
  <Script
    src="https://secure.safewebservices.com/token/Collect.js"
    data-tokenization-key="5mN8N7-jhr55W-N22pxX-uAW2s9"
  ></Script>;

  useEffect(() => {
    const cart = localStorage?.getItem("cart");
    !cart && localStorage.setItem("cart", JSON.stringify([]));
  }, []);

  return (
    <AppProvider>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
        <ScrollToTop />
      </QueryClientProvider>
    </AppProvider>
  );
}

export default MyApp;
