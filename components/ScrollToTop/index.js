import React, { useEffect, useState } from "react";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import ScrollToTopStyles from "./ScrollToTop.module.css";
export default function ScrollToTop() {
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  const toggleScroll = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 200) {
        setIsButtonVisible(true);
      } else {
        setIsButtonVisible(false);
      }
    });
  }, []);

  return (
    <>
      {isButtonVisible && (
        <div
          onClick={toggleScroll}
          className={ScrollToTopStyles.scrollToTopButton}
        >
          <ArrowUpward
            fontSize="large"
            className={ScrollToTopStyles.arrowIcon}
          />
        </div>
      )}
    </>
  );
}
