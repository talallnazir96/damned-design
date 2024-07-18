import Nav from "./Nav";
import Meta from "./Meta";
import Footer from "./Footer";
import NewsLetter from "./NewsLetter";
import styles from "../styles/Layout.module.css";
import { useRouter } from "next/router";
import { useGlobalContext } from "../contextAPI/context";
import { NotificationContainer } from "react-notifications";

const dontShowNewsLetterInPages = [
  "/cart",
  "/checkout",
  "/order-confirmation",
  "/dashboard",
  "/product/[id]",
];
// get the current page
const currentPage =
  typeof window !== "undefined" ? window.location.pathname : "";
const Layout = ({ children }) => {
  const  { currentUser } = useGlobalContext()
  const router = useRouter();
  return (
    <>
      <Meta />
      <Nav />
      <main className={styles.main}>{children}</main>

      {!currentUser && dontShowNewsLetterInPages.indexOf(router.pathname) === -1 && (
        <NewsLetter />
      )}
      <Footer />
      <NotificationContainer />
    </>
  );
};

export default Layout;
