import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HealthWarning from './components/HealthWarning';
import ChannelButton from './components/WiiMenu/ChannelButton';
import { Howl } from 'howler';
import WiiMenu from './components/WiiMenu/WiiMenu';
import MiiMaker from './pages/MiiMaker';
import MiiMakerManual from './pages/MiiMakerManual';

export default function App() {
  const [fading, setFading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    const handleClick = () => {
      const clickSound = new Audio('/select.wav');
      clickSound.volume = 0.4; // Set volume to 20% (adjust as needed)
      clickSound.play().catch(() => {});
    };

    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, []);

  const handleFadeOut = () => {
    setFading(true);
    setMenuVisible(true);
    const menuMusic = new Howl({ src: ['/wiimenu.mp3'], volume: 0.4, loop: true });
    menuMusic.play();
    setTimeout(() => {
      setShowMenu(true);
      setFading(false);
    }, 1000);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              {!showMenu && <HealthWarning onFinish={handleFadeOut} />}
              <div
                style={{
                  display: menuVisible ? 'block' : 'none',
                  opacity: showMenu ? 1 : 0,
                  transition: 'opacity 1s ease',
                  position: fading ? 'absolute' : 'relative',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 1,
                }}
              >
                <WiiMenu />
              </div>
            </>
          }
        />
        <Route path="/menu" element={<WiiMenu />} />
        <Route path="/miimaker" element={<MiiMaker />} />
        <Route path="/miimaker2" element={<MiiMakerManual />} />
      </Routes>
    </Router>
  );
}