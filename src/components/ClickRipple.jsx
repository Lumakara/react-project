import { useEffect, useState } from 'react';
import { sfx } from './SoundEffects';

export default function ClickRipple() {
  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    const handleGlobalClick = (e) => {
      const newRipple = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY
      };
      
      setRipples(prev => [...prev, newRipple]);
      
      // Play pop sound synthesized in code!
      sfx.playClick();
      
      // Clean up ripple after animation ends
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 700);
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999]" aria-hidden="true">
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="click-ripple"
          style={{ left: ripple.x, top: ripple.y }}
        />
      ))}
    </div>
  );
}
