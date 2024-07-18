import Link from "next/link";
import Image from "next/image";
import { Col, Container, Row } from "react-bootstrap";
import footerStyles from "../styles/Footer.module.css";
import { useGlobalContext } from "../contextAPI/context";

const paymentIcons = [
  {
    id: 1,
    name: "american express",
    image: "/images/american-express.png",
  },
  {
    id: 2,
    name: "visa",
    image: "/images/visa.png",
  },
  {
    id: 3,
    name: "mastercard",
    image: "/images/mastercard.png",
  },
  {
    id: 4,
    name: "jcb",
    image: "/images/jcb.jpg",
  },
  {
    id: 5,
    name: "discover",
    image: "/images/discover.jpg",
  },
];

const Footer = () => {
  const { currentUser } = useGlobalContext();
  return (
    <footer className={footerStyles.footer}>
      <Container
        fluid
        style={{
          marginTop: "4px",
        }}
      >
        <Row>
          <Col sm={12} lg={4} className={footerStyles.footerRight}>
            {/* Footer Links */}
            <li>
              <Link href="/terms-conditions">
                <a>T & C</a>
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy">
                <a>Privacy</a>
              </Link>
            </li>
            <li>
              <Link href="/returns-policy">
                <a>Returns</a>
              </Link>
            </li>
            <li>
              <Link href="/sitemap">
                <a>Sitemap</a>
              </Link>
            </li>
          </Col>
          <Col sm={12} lg={4} className={footerStyles.footerMiddle}>
            {/* 5 images width:76, height: 45 */}
            {paymentIcons.map((icon) => (
              <li key={icon.id}>
                <div className={footerStyles.imageWrapper}>
                  <img
                    src={icon.image}
                    alt={icon.name}
                    width={50}
                    height={30}
                  />
                </div>
              </li>
            ))}
          </Col>
          <Col sm={12} lg={4} className={footerStyles.footerLeft}>
            <p>© 2022 Damned Designs. All Rights Reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
