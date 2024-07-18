import React, { useEffect, useRef } from "react";

const Preloader = ({innerComponent}) => {
  const myVideo = useRef(null);
  useEffect(() => {
    myVideo.current.muted = true;
    myVideo.current.loop = true;
    myVideo.current.play();
  }, []);
  return (
    <div
      className={`preloaderAnimation ${innerComponent && 'preloaderInnerComponent'}`}
    >
      <video ref={myVideo} src="/animation.mp4" /> 
    </div>
  );
};

export default Preloader;
