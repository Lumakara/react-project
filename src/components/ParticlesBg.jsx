import { useEffect, useState } from 'react';

export default function ParticlesBg() {
  const [particles, setParticles] = useState(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: Math.random() + i,
      size: Math.random() * 4 + 2,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 3 + 4 // between 4s and 7s
    }));
  });

  useEffect(() => {
    // Periodically add new particles and recycle older ones
    const interval = setInterval(() => {
      setParticles(prev => {
        const newParticle = {
          id: Math.random(),
          size: Math.random() * 4 + 2,
          x: Math.random() * 100,
          y: Math.random() * 100,
          duration: Math.random() * 3 + 4
        };
        if (prev.length >= 25) {
          return [...prev.slice(1), newParticle];
        }
        return [...prev, newParticle];
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute bg-primary/20 dark:bg-secondary/15 rounded-full"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.x}%`,
            top: `${p.y}%`,
            animation: `particleFloat ${p.duration}s ease-in-out infinite`
          }}
        />
      ))}
    </div>
  );
}
