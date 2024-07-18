import Link from "next/link";
import { Col, Container, Row } from "react-bootstrap";
import categoriesStyles from "./Categories.module.css";

function Categories({ homeData }) {
  return (
    <>
      <section
        className={`${categoriesStyles.categoriesWrapper} displayNoneAtMobile`}
      >
        <section
          id={categoriesStyles.knives}
          style={{
            background:
              "url(" +
              homeData?.category_box_0_category_img_right +
              ") no-repeat center center/cover",
          }}
        >
          <Container>
            <Row className={categoriesStyles.categoriesRow}>
              <Col md={5} className={categoriesStyles.categoriesCol}>
                <div className={categoriesStyles.categoryTop}>
                  <h3 className={`${categoriesStyles.categoryTitle} textWhite`}>
                    {homeData?.category_box_0_category_title}
                  </h3>
                </div>
                <div className={categoriesStyles.categoryBottom}>
                  <Link href="/knives">
                    <a className={`${categoriesStyles.categoryLink}`}>
                      <span className={categoriesStyles.categoryLinkText}>
                        {homeData?.category_box_0_category_link_text}
                      </span>
                    </a>
                  </Link>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
        <section id={categoriesStyles.secondSec}>
          <div
            id={categoriesStyles.edc}
            style={{
              background:
                "url(" +
                homeData?.category_box_1_category_img_right +
                ") no-repeat center center/cover",
            }}
          >
            <Container>
              <Row className={categoriesStyles.categoriesRow}>
                <Col className={categoriesStyles.categoriesCol}>
                  <div className={categoriesStyles.categoryTop}>
                    <h2
                      className={`${categoriesStyles.categoryTitle} textWhite`}
                    >
                      {homeData?.category_box_1_category_title}
                    </h2>
                  </div>
                  <div className={categoriesStyles.categoryBottom}>
                    <Link href="/edc">
                      <a className={`${categoriesStyles.categoryLink} `}>
                        <span className={categoriesStyles.categoryLinkText}>
                          {homeData?.category_box_1_category_link_text}
                        </span>
                      </a>
                    </Link>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
          {/* Fifget */}
          <div
            id={categoriesStyles.fidget}
            style={{
              background:
                "url(" +
                homeData?.category_box_2_category_img_right +
                ") no-repeat center center/cover",
            }}
          >
            <Container>
              <Row className={categoriesStyles.categoriesRow}>
                <Col className={categoriesStyles.categoriesCol}>
                  <div className={categoriesStyles.categoryTop}>
                    <h2
                      className={`${categoriesStyles.categoryTitle} textWhite`}
                    >
                      {homeData?.category_box_2_category_title}
                    </h2>
                  </div>
                  <div className={categoriesStyles.categoryBottom}>
                    <Link href="/fidget">
                      <a className={`${categoriesStyles.categoryLink}`}>
                        <span className={categoriesStyles.categoryLinkText}>
                          {homeData?.category_box_2_category_link_text}
                        </span>
                      </a>
                    </Link>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        </section>
      </section>
      {/* Mobile Section */}
      <section
        className={`${categoriesStyles.categoriesWrapper} ${categoriesStyles.mobileVersion} displayNoneAtDesktop`}
      >
        <section id={categoriesStyles.mobileKnives}>
          {/* Button */}
          <Link href="/knives">
            <a className={`${categoriesStyles.categoryLink} `}>
              <span className={categoriesStyles.categoryLinkText}>
                View knives
              </span>
            </a>
          </Link>
        </section>
        <section id={categoriesStyles.mobileSecondSec}>
          <Row>
            <Col id={categoriesStyles.mobileEDC}>
              {/* Button */}
              <Link href="/edc">
                <a className={`${categoriesStyles.categoryLink} btn btnWhite`}>
                  <span className={categoriesStyles.categoryLinkText}>
                    View EDC
                  </span>
                </a>
              </Link>
            </Col>
            <Col id={categoriesStyles.mobileFidget}>
              {/* Button */}
              <Link href="/fidget">
                <a className={`${categoriesStyles.categoryLink} btn btnWhite`}>
                  <span className={categoriesStyles.categoryLinkText}>
                    View Fidget
                  </span>
                </a>
              </Link>
            </Col>
          </Row>
        </section>
      </section>
    </>
  );
}

export default Categories;
