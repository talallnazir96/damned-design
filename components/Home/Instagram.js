/* eslint-disable @next/next/no-img-element */
import instaStyles from "./Instagram.module.css";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Image from "next/image";
import { format } from "date-fns";
import {
  AccessTime,
  Favorite,
  PhotoLibrary,
  Person,
  ChatBubble,
  AddCircleOutline,
} from "@material-ui/icons";
import InstagramIcon from "@material-ui/icons/Instagram";
import Link from "next/link";
import { numberWithCommas } from "../../functions/numbers";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useState, useCallback } from "react";
// import FontAwesomeIcon from "font-awesome";

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 4,
    slidesToSlide: 4,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 4,
  },
  tablet: {
    breakpoint: { max: 1024, min: 479 },
    items: 4,
    slidesToSlide: 4,
  },
  mobile: {
    breakpoint: { max: 479, min: 0 },
    items: 2,
    slidesToSlide: 2,
  },
};
const insta_modal = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 1,
    slidesToSlide: 1,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
    slidesToSlide: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
    slidesToSlide: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};
function Instagram({ instagramPostData, pageInformation }) {
  return (
    <section className={instaStyles.insta}>
      <div className={instaStyles.accountInfoContainer}>
        <Link href={`https://instagr.am/${pageInformation.username}`}>
          <a target={"_blank"}>
            <div className={instaStyles.infoWrapper}>
              <div className={instaStyles.profilePicContainer}>
                <img
                  className={instaStyles.profilePic}
                  // src={pageInformation.profile_picture_url}
                  src={pageInformation.local_avatar}
                  alt="Damned Designs Instagram Profile Picture"
                />
                <div className={instaStyles.plusIcon}>
                  <AddCircleOutline />
                </div>
              </div>
              <span className={instaStyles.pageName}>
                {pageInformation.username}
              </span>
              <div className={instaStyles.pageFollowersAndPosts}>
                <div className={instaStyles.accountInfo}>
                  <PhotoLibrary />
                  <div>{pageInformation.media_count}</div>
                </div>
                <div className={instaStyles.accountInfo}>
                  <Person />
                  <div>{numberWithCommas(pageInformation.followers_count)}</div>
                </div>
              </div>
            </div>
          </a>
        </Link>
      </div>

      <Carousel
        // currentIndex={4}
        swipeable={true}
        draggable={true}
        arrows={false}
        showDots={true}
        responsive={responsive}
        infinite={true}
        autoPlaySpeed={5000}
        transitionDuration={500}
        itemClass={instaStyles.carousel}
        partialVisbile={false}
        renderDotsOutside={true}
      >
        {instagramPostData.map((instapost, index) => (
          <>
            <InstagramReelsWrapper
              instapost={instapost}
              index={index}
              key={index}
              instagramPostData={instagramPostData}
            />
            <LikeAndCommentsCount
              likesCount={instapost.like_count}
              commentsCount={instapost.comments_count}
            />
          </>
        ))}
      </Carousel>
      <div className={instaStyles.followLink}>
        <Link passHref href={"https://instagram.com/damneddesigns"}>
          <a target={"_blank"} rel="noopener noreferrer">
            <button className={instaStyles.followButton}>
              <InstagramIcon /> Follow
            </button>
          </a>
        </Link>
      </div>
    </section>
  );
}

function InstagramReelsWrapper({ instapost, index, key, instagramPostData }) {
  const [show, setShow] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleClose = () => setShow(false);
  const handleShow = (i) => {
    setShow(true);
    setSelectedIndex(i);
  };
  const [toggler, setToggler] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);

  const openLightbox = useCallback((event, { photo, index }) => {
    setCurrentImage(index);
    setViewerIsOpen(true);
  }, []);

  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
  };

  const changeItemIndex = (itemArr, startingIndex) => {
    let result = [];
    let remainingItems = [];

    for (let i = 0; i < itemArr.length; i++) {
      let itemIndex = itemArr.indexOf(itemArr[i]);

      if (itemIndex >= startingIndex) {
        result.push(itemArr[i]);
      } else {
        remainingItems.push(itemArr[i]);
      }
    }
    return result.concat(remainingItems);
  };

  return (
    <>
      <Button
        onClick={() => handleShow(index)}
        // onClick={() => setToggler(!toggler)}
        className={instaStyles.modal_btn}
        key={index}
      >
        <a target="_blank" rel="noopener noreferrer">
          <div className={instaStyles.instaPostContainer} id="postContainer">
            <div className={instaStyles.captionWrapper}>
              <div className={instaStyles.postInfoWrapper}>
                <div className={instaStyles.dateText}>
                  <AccessTime />
                  <div>{format(new Date(instapost.timestamp), "MMMM dd")}</div>
                </div>
              </div>
              <div className={instaStyles.postCaption}>
                {instapost.caption.slice(0, 100) + "..."}
              </div>
            </div>
            {instapost.media_type === "VIDEO" ? (
              <div>
                <video
                  className={instaStyles.instagram_video}
                  id={instaStyles.poster_holder}
                  poster={instapost.thumbnail_url}
                  // poster="https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dmlld3xlbnwwfHwwfHw%3D&w=1000&q=80"
                >
                  <source src={instapost.media_url} type="video/mp4"></source>
                </video>
                <img src="/images/play.svg" className={instaStyles.playbtn} />
                {/* <FontAwesomeIcon icon="fa-solid fa-play" /> */}
                {/* <i class="fa-solid fa-play"></i> */}
              </div>
            ) : (
              <img
                src={instapost.media_url}
                // src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png"
                className={instaStyles.instagram_img}
                id="cus_img_height"
              />
            )}
          </div>
        </a>
      </Button>
      {/* <FsLightbox toggler={toggler} sources={instapost.media_url} />; */}
      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Body style={{ padding: "0" }}>
          <div
            className="clos_btn"
            onClick={handleClose}
            style={{
              position: "absolute",
              top: "2px",
              right: "1%",
              zIndex: "999",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            x
          </div>
          <Carousel
            swipeable={true}
            draggable={true}
            arrows={true}
            showDots={false}
            responsive={insta_modal}
            infinite={true}
            autoPlaySpeed={5000}
            transitionDuration={500}
            itemClass={instaStyles.carousel}
            partialVisbile={false}
            renderDotsOutside={true}
          >
            {/* {instagramPostData.map((elm) => { */}
            {changeItemIndex(instagramPostData, selectedIndex).map((elm) => {
              return (
                <div className={instaStyles.main_insta_block}>
                  <div
                    className={instaStyles.video_img}
                    // style={{ width: "68%" }}
                  >
                    {elm.media_type === "VIDEO" ? (
                      <video controls className={instaStyles.video_modal}>
                        <source src={elm.media_url} type="video/mp4"></source>
                      </video>
                    ) : (
                      <img
                        src={elm.media_url}
                        className={instaStyles.img_modal_insta}
                      />
                    )}
                  </div>

                  <div className={instaStyles.insta_caption_modal}>
                    <a
                      className={instaStyles.sbi_lightbox_username}
                      href="https://www.instagram.com/damneddesigns/"
                      target="_blank"
                      rel="noopener"
                    >
                      <img
                        src="https://www.damnedventures.com/wp-content/uploads/sb-instagram-feed-images/damneddesigns.jpg"
                        style={{ width: "30px", height: "30px" }}
                      />
                      <p style={{ margin: "0" }}>@damneddesigns</p>
                    </a>

                    {elm?.caption?.split("\n").map((elem) => {
                      return (
                        <p
                          style={{
                            color: "black",
                            marginBottom: "0",
                            fontSize: "13px",
                            fontWeight: "bolder",
                          }}
                        >
                          {elem}
                        </p>
                      );
                    })}
                    <a
                      href={elm.permalink}
                      target="_blank"
                      rel="noopener"
                      className={instaStyles.permLink}
                    >
                      <svg
                        class="svg-inline--fa fa-instagram fa-w-14"
                        aria-hidden="true"
                        data-fa-processed=""
                        data-prefix="fab"
                        data-icon="instagram"
                        role="presentation"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        height="20px"
                      >
                        <path
                          fill="currentColor"
                          d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"
                        ></path>
                      </svg>
                      Instagram
                    </a>
                  </div>
                </div>
              );
            })}
          </Carousel>
        </Modal.Body>
      </Modal>
    </>
  );
}

const LikeAndCommentsCount = ({ likesCount, commentsCount }) => {
  return (
    <div className={instaStyles.likesCommentsCount}>
      <div className={instaStyles.engagementInfo}>
        <Favorite />
        <div>{likesCount}</div>
      </div>
      <div className={instaStyles.engagementInfo}>
        <ChatBubble />
        <div>{commentsCount}</div>
      </div>
    </div>
  );
};

const CustomDot = ({ onClick, ...rest }) => {
  const {
    onMove,
    index,
    active,
    carouselState: { currentSlide, deviceType },
  } = rest;
  const carouselItems = [CarouselItem1, CaourselItem2, CarouselItem3];
  // onMove means if dragging or swiping in progress.
  // active is provided by this lib for checking if the item is active or not.
  return (
    <button
      className={active ? "active" : "inactive"}
      onClick={() => onClick()}
    >
      {React.Children.toArray(carouselItems)[index]}
    </button>
  );
};

export default Instagram;
