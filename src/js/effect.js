import { SVG_NS } from './consts';
import { createSvgEl } from './elements';

export default function createEffect() {
  const svgEl = createSvgEl('svg', {
    width: 0,
    height: 0,
    viewBox: '0 0 0 0',
    class: 'nc__effect',
  });
  const filterEl = createSvgEl('filter', {
    id: 'nc-effect',
  });
  const blurEl = createSvgEl('feGaussianBlur', {
    stdDeviation: '0 5',
  });

  filterEl.appendChild(blurEl);
  svgEl.appendChild(filterEl);

  /**
   * Sets filter strength
   * @param {number} newValue filter strength
   */
  function setValue(newValue) {
    blurEl.setAttributeNS(SVG_NS, 'stdDeviation', `0 ${newValue}`);
  }

  /**
   * Returns counter box element
   * @returns {element} counter box element
   */
  function getEl() {
    return svgEl;
  }

  /**
   * Destroy clean up
   */
  function destroy() {

  }

  return {
    getEl,
    setValue,
    destroy,
  };
}
