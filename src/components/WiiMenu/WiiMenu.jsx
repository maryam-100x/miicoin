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
      setTimeout(() => setCopied(false), 2000);
    }
  },
];


  const placeholderCount = 12 - baseChannels.length;

  const channels = baseChannels;


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