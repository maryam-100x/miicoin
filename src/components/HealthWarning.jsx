import { useEffect, useState } from 'react';
import { Howl } from 'howler';

export default function HealthWarning({ onFinish }) {
  const [ready, setReady] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const handleContinue = () => {
      if (!ready) {
        setReady(true);
        setFadeOut(true); // start fade-out animation

        const menuMusic = new Howl({ src: ['/wiimenu.mp3'], volume: 0, loop: true });
        menuMusic.play();

        setTimeout(() => {
          onFinish();
        }, 1100); // let fade-out animation finish first
      }
    };

    window.addEventListener('keydown', handleContinue);
    window.addEventListener('click', handleContinue);
    window.addEventListener('touchstart', handleContinue);

    return () => {
      window.removeEventListener('keydown', handleContinue);
      window.removeEventListener('click', handleContinue);
      window.removeEventListener('touchstart', handleContinue);
    };
  }, [ready, onFinish]);




    return (
    <div
      className={`health-warning ${fadeOut ? 'fade-out' : ''}`}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'black',
        color: 'white',
        fontFamily: 'Helvetica, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        zIndex: 9999,
        padding: '2rem',
        transition: 'opacity 1s ease',
        opacity: fadeOut ? 0 : 1
      }}
    >
      <div style={{ maxWidth: '1200px', width: '100%' }}>
        <div style={{ color: 'yellow', fontWeight: 'bold', fontSize: '3vw' }}>
          ⚠️ WARNING–HEALTH AND SAFETY
        </div>
        <p style={{ marginTop: '2vw', fontSize: '2vw', lineHeight: '1.6' }}>
          BEFORE USING, UNDERSTAND THAT WE DO NOT CARE ABOUT YOUR HEALTH & MONEY. THIS WEBSITE IS NOT RESPONSIBLE FOR EMOTIONAL DAMAGE OF BEING SIDELINED.
        </p>
        <p style={{ marginTop: '1vw', fontSize: '1.8vw' }}>
          Also online at<br />
          <a href="https://www.miicoin.fun/healthsafety/" target="_blank" style={{ color: '#5ab0ff' }}>
            www.miicoin.fun/healthsafety/
          </a>
        </p>
        <p
          className="fade-blink"
          style={{
            marginTop: '5vw',
            fontSize: '2.2vw',
            fontWeight: 'bold',
          }}
        >
          Press any button to continue.
        </p>
      </div>
    </div>
  );
}

