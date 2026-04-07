import { gsap } from "gsap";
import { useEffect, useState } from "react";
import "./CelebrationPage.css";

// 👇 YOUR GIF LINK
const angryImg = "https://media.tenor.com/y1utwcb1ZkYAAAAM/dog-side-eyeing-side-eye.gif"; 

const generateHeartPositions = () =>
  [...Array(15)].map(() => ({
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 8 + Math.random() * 4,
  }));

const heartPositions = generateHeartPositions();

function CelebrationPage({ onComplete }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [noClicked, setNoClicked] = useState(false);

  const slides = [
    {
      icon: <img src="https://i.pinimg.com/736x/14/fe/1b/14fe1b985f8fa73d3562c205af299464.jpg" style={{ width: '200px' }} />,
      text: "It's 21st!",
      type: "announcement",
    },
    {
      icon: <img src="https://i.pinimg.com/736x/3e/14/55/3e1455b7c5d8ad7601a2be82bda112f5.jpg" style={{ width: '200px' }} />,
      text: "Want to see what's next?",
      type: "question",
      options: [
        { text: "Yes", value: "yes" },
        { text: "No", value: "no" },
      ],
    },
    {
      icon: <img src="https://media.tenor.com/m8ks5CktT0wAAAAM/dogo-luldogo.gif" style={{ width: '200px' }} />,
      text: "Here we go😼",
      type: "announcement",
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      gsap.to(".slide-content", {
        opacity: 0,
        y: -30,
        duration: 0.4,
        onComplete: () => {
          setCurrentSlide(currentSlide + 1);
          gsap.fromTo(
            ".slide-content",
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.5 }
          );
        },
      });
    } else {
      // Direct jump to the Message Page (onComplete)
      if (onComplete) onComplete();
    }
  };

  const handleAnswer = (value) => {
    if (value === "no") {
      setNoClicked(true);
    } else {
      handleNext();
    }
  };

  return (
    <div className="celebration-page">
      {/* Floating hearts background */}
      <div className="floating-hearts-bg">
        {heartPositions.map((pos, i) => (
          <div
            key={i}
            className="heart-float"
            style={{
              left: `${pos.left}%`,
              animationDelay: `${pos.delay}s`,
              animationDuration: `${pos.duration}s`,
            }}
          >
            💗
          </div>
        ))}
      </div>

      <div className="slides-container">
        <div className="slide-content">
          <div className="slide-icon">{slides[currentSlide].icon}</div>
          
          <h2 className="slide-text">
              {noClicked ? "I see🤖" : slides[currentSlide].text}
          </h2>

          {slides[currentSlide].type === "question" ? (
            noClicked ? (
              <div className="funny-response" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "15px" }}>
                <img src={angryImg} alt="Funny response" style={{ width: "220px", borderRadius: "15px", border: "3px solid #fff" }} />
                <button className="option-button yes-button" onClick={() => setNoClicked(false)}>
                  lol okay
                </button>
              </div>
            ) : (
              <div className="question-options">
                {slides[currentSlide].options.map((option, index) => (
                  <button
                    key={index}
                    className={`option-button ${option.value === "yes" ? "yes-button" : "no-button"}`}
                    onClick={() => handleAnswer(option.value)}
                  >
                    {option.text} 
                  </button>
                ))}
              </div>
            )
          ) : (
            <button className="next-button" onClick={handleNext}>
              {currentSlide < slides.length - 1 ? "Next" : "Let's Go!🎉"}
            </button>
          )}
        </div>

        {/* Progress dots */}
        <div className="slide-progress">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`progress-dot ${index === currentSlide ? "active" : ""} ${index < currentSlide ? "completed" : ""}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CelebrationPage;
