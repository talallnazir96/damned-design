import Image from "next/image";
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import aboutStyles from "./About.module.css";

function About({ homeData }) {
  const [secondSection, setSecondSection] = React.useState({});

  React.useEffect(() => {
    if (homeData) {
      setSecondSection(homeData?.sec_product_desc);
    }
  }, [homeData]);

  return (
    <section className={aboutStyles.about}>
      <div dangerouslySetInnerHTML={{ __html: secondSection }}></div>
    </section>
  );
}

export default About;
