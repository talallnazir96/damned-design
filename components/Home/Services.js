import Image from "next/image";
import React from "react";
import { Col, Row } from "react-bootstrap";

export default function Services({ homeData }) {
  return (
    <div style={{ background: "#F1F3F4" }} className="wrapperkaWrapper">
      <Row className="iconBoxWrapper">
        <Col className="iconBox">
          <img
            src={homeData?.icon_box_3_ib_icon}
            width={27}
            height={30}
            className="iconBoxImage"
            alt={homeData?.icon_box_3_ib_title}
          />
          <h5 className="iconBoxHeading">{homeData?.icon_box_3_ib_title}</h5>
          <p className="iconBoxDesc">{homeData?.icon_box_3_ib_desc}</p>
        </Col>
        <Col className="iconBox">
          <img
            src={homeData?.icon_box_2_ib_icon}
            width={27}
            height={30}
            className="iconBoxImage"
            alt={homeData?.icon_box_2_ib_title}
          />
          <h5 className="iconBoxHeading">{homeData?.icon_box_2_ib_title}</h5>
          <p className="iconBoxDesc">{homeData?.icon_box_2_ib_desc}</p>
        </Col>
        <Col className="iconBox">
          <img
            src={homeData?.icon_box_1_ib_icon}
            width={27}
            height={30}
            className="iconBoxImage"
            alt={homeData?.icon_box_1_ib_title}
          />
          <h5 className="iconBoxHeading">{homeData?.icon_box_1_ib_title}</h5>
          <p className="iconBoxDesc">{homeData?.icon_box_1_ib_desc}</p>
        </Col>
        <Col className="iconBox">
          <img
            src={homeData?.icon_box_0_ib_icon}
            width={27}
            height={30}
            className="iconBoxImage"
            alt={homeData?.icon_box_0_ib_title}
          />
          <h5 className="iconBoxHeading">{homeData?.icon_box_0_ib_title}</h5>
          <p className="iconBoxDesc">{homeData?.icon_box_0_ib_desc}</p>
        </Col>
      </Row>
    </div>
  );
}
