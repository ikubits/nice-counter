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
};
