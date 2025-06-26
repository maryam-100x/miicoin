import { useEffect, useState } from 'react';
import ChannelButton from './ChannelButton';
import Footer from '../Footer'; // Import the reusable footer

export default function WiiMenu() {
  const baseChannels = [
    { name: 'Mii Maker', icon: '/miimaker.png', onClick: () => window.location.href = '/miimaker' },
    { name: 'Dexscreener', icon: '/dexscreener.png', onClick: () => window.open('https://dexscreener.com/solana', '_blank') },
    { name: 'X Community', icon: '/xcom.png', onClick: () => window.open('https://x.com/i/communities/1934339572261175545', '_blank') },
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

      <Footer /> {/* Reusable footer */}
    </div>
  );
}
