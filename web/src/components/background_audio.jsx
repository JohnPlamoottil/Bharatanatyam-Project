import React, { useEffect, useRef } from "react";

const BackgroundAudio = () => {
  const audioRef = useRef(null);

  // 🎚️ Initialize volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.01; // Set background volume between 0.0 and 1.0
    }
  }, []);

  // 🖱️ Auto play on first click (bypass browser autoplay restrictions)
  useEffect(() => {
    function handleClick() {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
      }
    }

    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <audio ref={audioRef} autoPlay loop preload="auto">
      <source src="/bkgd_music.mp3" type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  );
};

export default BackgroundAudio;
