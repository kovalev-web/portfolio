/**
 * Animated gradient shader.
 *
 * Technique: value-noise fBm run through two rounds of domain warping, then
 * used to mix four brand colours. This is the same *class* of effect the
 * reference site uses (a slow-moving flow field rendered on a fullscreen
 * quad) but written from scratch so the palette and motion are ours.
 *
 * Cost is one fullscreen fragment pass — cheap enough to run at 60fps on a
 * laptop GPU, and we cap DPR at 1.5 in GradientCanvas.
 */

export const VERT = /* glsl */ `
attribute vec2 aPosition;
varying vec2 vUv;

void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

export const FRAG = /* glsl */ `
precision highp float;

varying vec2 vUv;

uniform vec2  uResolution;
uniform float uTime;
uniform float uGrain;
uniform vec3  uColorA;
uniform vec3  uColorB;
uniform vec3  uColorC;
uniform vec3  uColorD;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

// Bilinear value noise with a smoothstep fade — cheaper than gradient noise
// and plenty for a soft gradient.
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8); // rotate each octave to hide grid artefacts

  for (int i = 0; i < 5; i++) {
    v += amp * noise(p);
    p = rot * p * 2.02;
    amp *= 0.5;
  }
  return v;
}

void main() {
  // Aspect-corrected, centred coordinates
  vec2 p = vUv - 0.5;
  p.x *= uResolution.x / uResolution.y;
  p *= 2.2;

  float t = uTime * 0.045;

  // --- domain warp, pass 1 ---
  vec2 q = vec2(
    fbm(p + vec2(0.0, 0.0) + t),
    fbm(p + vec2(5.2, 1.3) - t * 0.7)
  );

  // --- domain warp, pass 2 ---
  vec2 r = vec2(
    fbm(p + 3.0 * q + vec2(1.7, 9.2) + t * 0.5),
    fbm(p + 3.0 * q + vec2(8.3, 2.8) - t * 0.35)
  );

  float f = fbm(p + 3.5 * r);

  // Mix the four stops along the field value, then bias by the warp so the
  // colours drift laterally instead of just pulsing.
  vec3 col = mix(uColorA, uColorB, clamp(f * f * 2.4, 0.0, 1.0));
  col = mix(col, uColorC, clamp(length(q) * 0.85, 0.0, 1.0));
  col = mix(col, uColorD, clamp(r.x * 0.9, 0.0, 1.0));

  // Slight lift in the centre so the headline always has contrast beneath it
  col *= 0.86 + 0.22 * f;

  // Film grain — kills banding on wide flat gradients
  float g = hash(gl_FragCoord.xy + fract(uTime) * 100.0) - 0.5;
  col += g * uGrain;

  gl_FragColor = vec4(col, 1.0);
}
`;
