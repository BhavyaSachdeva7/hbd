import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import "./MusicPlayer.css";

const MusicPlayer = forwardRef((props, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSrc, setCurrentSrc] = useState("/music.mp3"); // Default track
  const audioRef = useRef(null);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error("Error playing audio:", error);
            setIsPlaying(false);
          });
      }
    }
  };

  // Expose methods to App.jsx
  useImperativeHandle(ref, () => ({
    play: () => {
      audioRef.current?.play().then(() => setIsPlaying(true));
    },
    pause: () => {
      audioRef.current?.pause();
      setIsPlaying(false);
    },
    toggle: () => {
      toggleMusic();
    },
    // 👇 THIS IS THE NEW FUNCTION FOR AUTO-SWITCHING
    changeTrack: (newPath) => {
      if (audioRef.current && currentSrc !== newPath) {
        const wasPlaying = isPlaying;
        setCurrentSrc(newPath); // Update state with new file path
        
        // Use a small timeout to let React update the src attribute
        setTimeout(() => {
          audioRef.current.load();
          if (wasPlaying || true) { // Always try to play on page change
            audioRef.current.play()
              .then(() => setIsPlaying(true))
              .catch(err => console.log("Playback interrupted:", err));
          }
        }, 50);
      }
    }
  }));

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.5;
      // Try to autoplay on first load
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, []);

  return (
    <>
      {/* We put src directly on audio for easier dynamic updates */}
      <audio ref={audioRef} src={currentSrc} loop preload="auto" />
      
      <button
        className="music-toggle"
        onClick={toggleMusic}
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? "⏸ Pause Music" : "Play Music🎵"}
      </button>
    </>
  );
});

MusicPlayer.displayName = "MusicPlayer";

export default MusicPlayer;
MusicPlayer.displayName = "MusicPlayer";

export default MusicPlayer;
