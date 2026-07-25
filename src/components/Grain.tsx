import { useEffect, useRef } from 'react';

/**
 * Animated film grain overlay on a 2D canvas.
 *
 * Rendered at a fixed low resolution and stretched by CSS — the browser's
 * upscaling is what gives it the chunky analogue texture, and it keeps the
 * per-frame ImageData write tiny. Redrawn at ~12fps, which reads as grain
 * without burning a full 60fps of main-thread time.
 */
export default function Grain({ opacity = 0.16 }: { opacity?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const W = 180;
    const H = 180;
    canvas.width = W;
    canvas.height = H;

    const image = ctx.createImageData(W, H);
    const buf = image.data;

    let raf = 0;
    let last = 0;
    let visible = true;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const draw = () => {
      for (let i = 0; i < buf.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        buf[i] = v;
        buf[i + 1] = v;
        buf[i + 2] = v;
        buf[i + 3] = 255;
      }
      ctx.putImageData(image, 0, 0);
    };

    const loop = (now: number) => {
      if (now - last > 80) {
        draw();
        last = now;
      }
      raf = visible ? requestAnimationFrame(loop) : 0;
    };

    draw();
    if (!reduced) raf = requestAnimationFrame(loop);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf && !reduced) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return <canvas ref={ref} className="grain" style={{ opacity }} aria-hidden="true" />;
}
