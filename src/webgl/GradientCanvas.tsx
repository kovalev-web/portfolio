import { useEffect, useRef } from 'react';
import { VERT, FRAG } from './gradient.glsl';

export type Palette = [string, string, string, string];

type Props = {
  palette: Palette;
  /** Grain intensity, 0–0.1. */
  grain?: number;
  /** Animation speed multiplier. */
  speed?: number;
  className?: string;
};

const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '');
  const n = parseInt(
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h,
    16,
  );
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

/**
 * Fullscreen animated gradient on a raw WebGL context.
 *
 * Deliberately dependency-free — three.js/OGL would add 150kb+ for what is a
 * single fullscreen triangle. Pauses when scrolled out of view, when the tab
 * is hidden, and when the user asks for reduced motion.
 */
export default function GradientCanvas({ palette, grain = 0.035, speed = 1, className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      antialias: false,
      alpha: false,
      powerPreference: 'low-power',
      // We stop the RAF loop when the card scrolls away or the tab is
      // backgrounded. Without this the drawing buffer is wiped on the next
      // composite and the card goes black until the loop resumes.
      preserveDrawingBuffer: true,
    });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // One oversized triangle covering the viewport — no index buffer needed.
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'aPosition');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = {
      res: gl.getUniformLocation(prog, 'uResolution'),
      time: gl.getUniformLocation(prog, 'uTime'),
      grain: gl.getUniformLocation(prog, 'uGrain'),
      a: gl.getUniformLocation(prog, 'uColorA'),
      b: gl.getUniformLocation(prog, 'uColorB'),
      c: gl.getUniformLocation(prog, 'uColorC'),
      d: gl.getUniformLocation(prog, 'uColorD'),
    };

    const [ca, cb, cc, cd] = palette.map(hexToRgb);
    gl.uniform3fv(u.a, ca);
    gl.uniform3fv(u.b, cb);
    gl.uniform3fv(u.c, cc);
    gl.uniform3fv(u.d, cd);
    gl.uniform1f(u.grain, grain);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));

      // Resizing the backing store is the expensive part, so guard only that.
      // The viewport and uResolution must be re-sent unconditionally: they
      // live on the GL context and the program respectively, and a remount
      // (StrictMode, HMR) builds a fresh program against a canvas that is
      // already the right size — skipping the write there would leave
      // uResolution at (0,0) and every fragment would divide by zero.
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(u.res, w, h);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let raf = 0;
    let visible = true;
    let t = 0;
    let last = performance.now();

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t += dt * speed;
      gl.uniform1f(u.time, t);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (visible && !reduced && !document.hidden) raf = requestAnimationFrame(frame);
      else raf = 0;
    };

    const play = () => {
      if (!raf && visible && !reduced && !document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    // Render one frame even under reduced-motion / hidden tab, so there is
    // never an empty black rectangle.
    gl.uniform1f(u.time, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    play();

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        play();
      },
      { rootMargin: '100px' },
    );
    io.observe(canvas);

    const onVis = () => play();
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, [palette, grain, speed]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
