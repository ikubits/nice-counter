/* eslint-disable no-param-reassign */

export function linear(f) {
  return f;
}

export function easeInQuad(f) {
  return f * f;
}

export function easeOutQuad(f) {
  f = 1 - f;
  return 1 - (f * f);
}

export function easeInOutQuad(f) {
  f *= 2;
  if (f <= 1) return (f * f) / 2;
  f = 2 - f;
  return 1 - ((f * f) / 2);
}

export function easeInCubic(f) {
  return f * f * f;
}

export function easeOutCubic(f) {
  f = 1 - f;
  return 1 - (f * f * f);
}

export function easeInOutCubic(f) {
  f *= 2;
  if (f <= 1) return (f * f * f) / 2;
  f = 2 - f;
  return 1 - ((f * f * f) / 2);
}

export function easeInQuart(f) {
  return f * f * f * f;
}

export function easeOutQuart(f) {
  f = 1 - f;
  return 1 - (f * f * f * f);
}

export function easeInOutQuart(f) {
  f *= 2;
  if (f <= 1) return (f * f * f * f) / 2;
  f = 2 - f;
  return 1 - ((f * f * f * f) / 2);
}

export function cubicBezierAxis(p1, c1, c2, p2, f) {
  const nf = 1 - f;

  return (
    nf * nf * nf * p1
    + 3 * nf * nf * f * c1
    + 3 * nf * f * f * c2
    + f * f * f * p2
  );
}

export function cubicBezier(p1, c1, c2, p2, f) {
  return [
    cubicBezierAxis(p1[0], c1[0], c2[0], p2[0], f),
    cubicBezierAxis(p1[1], c1[1], c2[1], p2[1], f),
  ];
}

/**
 *
 * @param {number} c1 control point 1 x
 * @param {number} c2 control point 2 x
 * @returns {function}
 */
export function getEaseBazier(c1, c2) {
  return function easeBazier(f) {
    return cubicBezierAxis(0, c1, c2, 1, f);
  };
}

export default {
  linear,
  easeInQuad,
  easeOutQuad,
  easeInOutQuad,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  easeInQuart,
  easeOutQuart,
  easeInOutQuart,
  getEaseBazier,
};
