/**
 * lerp - linear interpolation
 * @param {Number} begin begin value
 * @param {Number} end end value
 * @param {Number} factor in range 0.0 - 1.0
 * @returns interpolated value
 */
export function lerp(begin, end, factor) {
  return begin + ((end - begin) * factor);
}

/**
 * clamp a number
 * @param {number} min min value
 * @param {number} max max value
 * @returns {number} clamped value
 */
export function clamp(min, max, value) {
  if (value < min) return min;
  if (value > max) return max;

  return value;
}

/**
 * map a value from in range to out range
 * @param {number} in0 in range begin
 * @param {number} in1 in range end
 * @param {number} out0 out range begin
 * @param {number} out1 out range end
 * @param {number} value value in in range
 * @returns {number} value in out range
 */
export function mapRange(in0, in1, out0, out1, value) {
  if (value <= in0) return out0;
  if (value >= in1) return out1;

  const factor = (value - in0) / (in1 - in0);
  return out0 + ((out1 - out0) * factor);
  // return lerp(out0, out1, factor);
}

export default {
  lerp,
  clamp,
  mapRange,
};
