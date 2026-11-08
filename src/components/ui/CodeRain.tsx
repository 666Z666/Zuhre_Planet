import React, { useEffect, useRef } from 'react';

/**
 * Zühre Planet V4.0 - CodeRain Component
 * 
 * Cinematic digital character rain for Shadow Shield encryption visuals.
 * Themed in Magenta/Violet for the luxury brand identity.
 */
export function CodeRain({ opacity = 0.15 }: { opacity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas to parent size
    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Characters from space/cyber theme
    const chars = "ZUHREPLANET01ØΣΩΔΨΦΓΞ";
    const charArray = chars.split("");
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    const draw = () => {
      // Semi-transparent black to create trailing effect
      ctx.fillStyle = `rgba(10, 10, 15, ${0.1})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Magenta/Violet characters
      ctx.fillStyle = "#d4af37"; // Zühre Magenta
      ctx.font = `black ${fontSize}px Orbitron, monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        
        // Varying opacity for depth
        ctx.globalAlpha = Math.random() * 0.5 + 0.5;
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        // Reset drop position or increment
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33); // ~30 FPS

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none transition-opacity duration-1000 mix-blend-screen opacity-dynamic"
      style={{ '--dynamic-opacity': opacity } as React.CSSProperties}
    />
  );
}
