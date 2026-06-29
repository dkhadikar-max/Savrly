import { useEffect, useState } from 'react';

interface Props {
  onDone: () => void;
}

export function SplashScreen({ onDone }: Props) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // reveal GIF is ~2.7s; start fade just after it completes
    const fadeTimer = setTimeout(() => setFading(true), 2800);
    const doneTimer = setTimeout(() => onDone(), 3300);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div
      className={`absolute inset-0 z-[100] flex items-center justify-center transition-opacity duration-500 ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ backgroundColor: '#0D0D0D' }}
    >
      <img
        src="/images/savrly_logo_reveal.gif"
        alt="Savrly"
        className="w-64 h-64 object-contain"
      />
    </div>
  );
}
