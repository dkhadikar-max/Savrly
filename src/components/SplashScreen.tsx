import { useEffect, useState } from 'react';

interface Props {
  onDone: () => void;
}

export function SplashScreen({ onDone }: Props) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 2200);
    const doneTimer = setTimeout(() => onDone(), 2700);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div
      className={`absolute inset-0 z-[100] bg-neutral-900 flex items-center justify-center transition-opacity duration-500 ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="savrly-logo-float flex flex-col items-center gap-3">
        <div className="savrly-logo rounded-2xl px-6 py-4">
          <span className="text-4xl font-bold tracking-tight text-white">
            Savrly
          </span>
        </div>
        <span className="text-xs text-white/40 tracking-widest uppercase">
          Mindful Eating
        </span>
      </div>
    </div>
  );
}
