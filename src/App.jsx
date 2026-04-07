import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useRef, useState, useEffect } from "react"; // Added useEffect
import "./App.css";
import CelebrationPage from "./components/CelebrationPage";
import Countdown from "./components/Countdown";
import Effects from "./components/Effects";
import Gallery from "./components/Gallery";
import Hearts from "./components/Hearts";
import MessageCard from "./components/MessageCard";
import MusicPlayer from "./components/MusicPlayer";

const closingImg = "https://media.tenor.com/wto_9CjqJTcAAAAM/dance-cat.gif"; 

gsap.registerPlugin(ScrollToPlugin);

function App() {
  const [currentPage, setCurrentPage] = useState(1); 
  const [birthdayReached, setBirthdayReached] = useState(false);
  const [showEffects, setShowEffects] = useState(false);

  const page1Ref = useRef(null); 
  const page2Ref = useRef(null); 
  const page3Ref = useRef(null); 
  const page4Ref = useRef(null); 
  const musicPlayerRef = useRef(null); 

  // 👇 NEW: Music Auto-Switcher Logic
  useEffect(() => {
    if (musicPlayerRef.current) {
      let trackPath = "";

      // Assign tracks to pages
      // Ensure these files exist in your public/music folder!
      switch (currentPage) {
        case 1:
          trackPath = "/countdown.mp3";
          break;
        case 2:
          trackPath = "/music/celebration.mp3";
          break;
        case 3:
          trackPath = "/music.mp3";
          break;
        case 4:
          trackPath = "/music/gallery.mp3";
          break;
        default:
          trackPath = "/countdown.mp3";
      }

      // We call a function inside your MusicPlayer component
      // (Make sure your MusicPlayer has a method to change the source)
      if (musicPlayerRef.current.changeTrack) {
        musicPlayerRef.current.changeTrack(trackPath);
      }
    }
  }, [currentPage]); // Runs every time page changes

  const goToPage = (pageNumber) => {
    const refs = { 1: page1Ref, 2: page2Ref, 3: page3Ref, 4: page4Ref };
    const currentPageRef = refs[currentPage];
    const nextPageRef = refs[pageNumber];

    const isForward = pageNumber > currentPage;

    gsap.to(currentPageRef.current, {
      x: isForward ? "-100%" : "100%",
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut",
    });

    gsap.set(nextPageRef.current, {
      x: isForward ? "100%" : "-100%",
      opacity: 0,
      visibility: "visible",
    });

    gsap.to(nextPageRef.current, {
      x: "0%",
      opacity: 1,
      duration: 0.6,
      ease: "power2.inOut",
      delay: 0.2,
      onComplete: () => {
        setCurrentPage(pageNumber);
        gsap.set(currentPageRef.current, { x: "0%", visibility: "hidden" });
        gsap.to(window, { duration: 0.3, scrollTo: { y: 0 } });
      },
    });
  };

  const handleBirthdayReached = () => {
    setBirthdayReached(true);
    localStorage.setItem("birthdayReached", "true");
    setShowEffects(true);
    setTimeout(() => setShowEffects(false), 10000);
  };

  return (
    <div className="app">
      {/* Pass the ref here */}
      <MusicPlayer ref={musicPlayerRef} />
      <Hearts />

      {/* PAGE 1: Countdown Timer */}
      <div
        ref={page1Ref}
        className={`page ${currentPage === 1 ? "active" : ""}`}
        style={{ visibility: currentPage === 1 ? "visible" : "hidden" }}
      >
        <section className="hero">
          <h1 id="heroTitle">
            {birthdayReached ? (
              <>
                <span className="highlight">Happiestest Birthday Khushi</span>🫶
              </>
            ) : (
              <>
                <span className="highlight">POV: Its April</span>{""}
              </>
            )}
          </h1>
          <p>
            {birthdayReached 
              ? "Bauni ka budday😋" 
              : "and the countdown begins...!🎂"}
          </p>
        </section>

        <Countdown
          onBirthdayReached={handleBirthdayReached}
          birthdayReached={birthdayReached}
        />

        <section className="teaser">
          <h2 id="teaserHeading">
            {birthdayReached ? "Another year around the sun:)" : "Jalpari🧜‍♀️"}
          </h2>
          <p className="teaser-hint">
            {birthdayReached
              ? "Pls don't crush any bottle this time😭" 
              : "Maharani ji ka b'day aane wala hei🫡"}
          </p>
        </section>

        <button
          id="surpriseBtn"
          className="celebrate-btn"
          disabled={!birthdayReached}
          onClick={() => goToPage(2)}
        >
          Click here
        </button>
      </div>

      {/* PAGE 2: Celebration/QNA Page */}
      <div
        ref={page2Ref}
        className={`page ${currentPage === 2 ? "active" : ""}`}
        style={{ visibility: currentPage === 2 ? "visible" : "hidden" }}
      >
        <CelebrationPage
          onComplete={() => goToPage(3)}
          musicPlayerRef={musicPlayerRef}
        />
      </div>

      {/* PAGE 3: Message Card */}
      <div
        ref={page3Ref}
        className={`page ${currentPage === 3 ? "active" : ""}`}
        style={{ visibility: currentPage === 3 ? "visible" : "hidden" }}
      >
        <button className="back-btn" onClick={() => goToPage(1)}>
          ← Back
        </button>
        <MessageCard isActive={currentPage === 3} />
        <button className="page-nav-btn" onClick={() => goToPage(4)}>
          📸 Pokémon Collection
        </button>
      </div>

      {/* PAGE 4: Gallery */}
      <div
        ref={page4Ref}
        className={`page ${currentPage === 4 ? "active" : ""}`}
        style={{ visibility: currentPage === 4 ? "visible" : "hidden" }}
      >
        <button className="back-btn" onClick={() => goToPage(3)}>
          ← Back
        </button>
        <Gallery isActive={currentPage === 4} />
        <section className="final">
          <h2 className="final-message">💖💖</h2>
          <p className="final-subtitle">Tum Husn Pari🫪Tum Jaane Jahaan😍
            Tum Sab Se Haseen😋Tum Sab Se Jawaan💅</p>
        </section>
      </div>

      {showEffects && <Effects />}
    </div>
  );
}

export default App;
