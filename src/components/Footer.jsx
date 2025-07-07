import { useEffect, useState } from 'react';

export default function Footer() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = time.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });

  const formattedDate = time.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'numeric',
    day: 'numeric',
  }).replace(',', '');

  const handleHomeClick = (e) => {
  e.preventDefault();
  const sound = new Audio('/home.wav');
  sound.volume = 0.2; // adjust as needed
  sound.play().catch(() => {});
  setTimeout(() => {
    window.location.href = '/menu';
  }, 800);
};


  return (
    <div className="wii-footer">
      <div className="footer-left">
        <a
          href="/menu"
          className="footer-bubble wii-hover-effect"
          onClick={handleHomeClick}
        >
          <span className="footer-label">Home</span>
        </a>
      </div>

      <div className="footer-center">
        <div className="clock">{formattedTime}</div>
        <div className="date">{formattedDate}</div>
      </div>

      <div className="footer-right" style={{ display: 'flex', gap: '1rem' }}>
        <a
          href="https://x.com/miicoin"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-bubble wii-hover-effect"
        >
          <span style={{ fontSize: '1.8rem' }}>𝕏</span>
        </a>
        <a
          href="https://letsbonk.fun"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-bubble wii-hover-effect"
        >
          <img src="/bonk_fun.png" alt="letsbonk.fun" />
          <span className="footer-label">MiiCoin</span>
        </a>
      </div>
    </div>
  );
}
