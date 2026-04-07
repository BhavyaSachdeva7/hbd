import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useRef, useState } from "react";
import "./App.css";
import CelebrationPage from "./components/CelebrationPage";
import Countdown from "./components/Countdown";
import Effects from "./components/Effects";
import Gallery from "./components/Gallery";
import Hearts from "./components/Hearts";
import MessageCard from "./components/MessageCard";
import MusicPlayer from "./components/MusicPlayer";

// 👇 OPTION 1: If you want to use a local photo:
// 1. Rename your photo to "closing.jpg"
// 2. Put it in the "src/assets" folder
// 3. Uncomment the line below (remove //):
// import closingImg from "./assets/closing.jpg";

// 👇 OPTION 2: Using a link for now (so the app doesn't crash):
const closingImg = "https://media.tenor.com/wto_9CjqJTcAAAAM/dance-cat.gif"; 

gsap.registerPlugin(ScrollToPlugin);

function App() {
  const [currentPage, setCurrentPage] = useState(1); // Start at 1 for Countdown page

  // ⚠️ FOR TESTING: Comment out lines 18-21 to reset on every reload
  // Check localStorage to persist birthday reached state
  /* const [birthdayReached, setBirthdayReached] = useState(() => {
  const saved = localStorage.getItem("birthdayReached");
    return saved === "true";
  });
  */

  // ✅ FOR TESTING: Uncomment this line to always show countdown on reload
  const [birthdayReached, setBirthdayReached] = useState(false);

  const [showEffects, setShowEffects] = useState(false);

  const page1Ref = useRef(null); // Countdown page
  const page2Ref = useRef(null); // Celebration Page
  const page3Ref = useRef(null); // MessageCard
  const page4Ref = useRef(null); // Gallery
  const musicPlayerRef = useRef(null); // Music player control

  const goToPage = (pageNumber) => {
    const refs = { 1: page1Ref, 2: page2Ref, 3: page3Ref, 4: page4Ref };
    const currentPageRef = refs[currentPage];
    const nextPageRef = refs[pageNumber];

    const isForward = pageNumber > currentPage;

    // Animate out current page
    gsap.to(currentPageRef.current, {
      x: isForward ? "-100%" : "100%",
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut",
    });

    // Prepare next page
    gsap.set(nextPageRef.current, {
      x: isForward ? "100%" : "-100%",
      opacity: 0,
      visibility: "visible",
    });

    // Animate in next page
    gsap.to(nextPageRef.current, {
      x: "0%",
      opacity: 1,
      duration: 0.6,
      ease: "power2.inOut",
      delay: 0.2,
      onComplete: () => {
        setCurrentPage(pageNumber);
        // Reset current page position
        gsap.set(currentPageRef.current, { x: "0%", visibility: "hidden" });

        // Smooth scroll to top
        gsap.to(window, { duration: 0.3, scrollTo: { y: 0 } });
      },
    });
  };

  const handleBirthdayReached = () => {
    setBirthdayReached(true);
    localStorage.setItem("birthdayReached", "true"); // Persist to localStorage
    setShowEffects(true);
    // Stop effects after some time
    setTimeout(() => setShowEffects(false), 10000);
  };

  return (
    <div className="app">
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
          </h1>{/* Dynamic Subtitle */}
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
          {birthdayReached
            ? "Another year around the sun:)"
            : "Jalpari🧜‍♀️"}
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
          onClick={() => goToPage(3)}
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
        
      </div>

 

      {/* Effects */}
      {showEffects && <Effects />}
    </div>
  );
}

export default App;
