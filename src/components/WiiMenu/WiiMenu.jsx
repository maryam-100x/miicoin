import { useEffect, useState } from 'react';
import ChannelButton from './ChannelButton';
import Footer from '../Footer';

export default function WiiMenu() {
  const [copied, setCopied] = useState(false);

  const openYoutubePopup = (url) => {
    const width = 800;
    const height = 500;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    
    window.open(
      url,
      'YouTubePopup',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
  };

  const baseChannels = [
    { name: 'Mii Maker', icon: '/miimaker.png', onClick: () => window.location.href = '/miimaker' },
    { name: 'Dexscreener', icon: '/dexscreener.png', onClick: () => window.open('https://dexscreener.com/solana', '_blank') },
    { name: 'X Community', icon: '/xcom.png', onClick: () => window.open('https://x.com/i/communities/1934339572261175545', '_blank') },
    {
      name: copied ? 'Copied!' : 'CA (Click to Copy)',
      icon: '/ca.png',
      onClick: () => {
        navigator.clipboard.writeText('CB9dDufT3ZuQXqqSfa1c5kY935TEreyBw9XJXxHKpump');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2s
      }
    },
    { name: 'WiiSports', icon: '/sports.png', onClick: () => openYoutubePopup('https://www.youtube.com/watch?v=vh1-WkCsNQM') },
    { name: 'MarioKartWii', icon: '/mariokart.png', onClick: () => openYoutubePopup('https://www.youtube.com/watch?v=l91fvlyzoc8') },
    { name: 'WiiSportsResort', icon: '/resort.png', onClick: () => openYoutubePopup('https://www.youtube.com/watch?v=FOjRIIoavG8') },
    { name: 'SuperMarioBros', icon: '/smb.png', onClick: () => openYoutubePopup('https://www.youtube.com/watch?v=Lg_5r3LQ3B8') },
    { name: 'WiiFit', icon: '/fit.png', onClick: () => openYoutubePopup('https://www.youtube.com/watch?v=SDfXealVJyg') },
    { name: 'Brawl', icon: '/brawl.png', onClick: () => openYoutubePopup('https://www.youtube.com/watch?v=GdTZ8UKlA78') },
    { name: 'animal', icon: '/animal.png', onClick: () => openYoutubePopup('https://www.youtube.com/watch?v=I5L1mYhqXJ0') },
    { name: 'zelda', icon: '/zelda.png', onClick: () => openYoutubePopup('https://www.youtube.com/watch?v=UrkHdov3rEQ') },
  ];

  const placeholderCount = 12 - baseChannels.length;

  const channels = [
    ...baseChannels,
    ...new Array(placeholderCount).fill(null).map((_, i) => ({
      name: `Channel ${baseChannels.length + i + 1}`,
      icon: '/placeholder-icon.png',
      onClick: () => alert(`Channel ${baseChannels.length + i + 1} clicked`),
    })),
  ];

  return (
    <div className="wii-menu">
      <div className="wii-grid">
        {channels.map((ch, i) => (
          <ChannelButton key={i} {...ch} />
        ))}
      </div>

      <Footer />
    </div>
  );
}