# Nice Counter

An Odometer.js-inspired counter web component implementation with a separate library source and static demo documentation page. Built with Vite and Tailwind CSS v4.

## Usage

### Web Component

Include the compiled script in your HTML and use the `<nice-counter>` custom element:

```html
<nice-counter value="123 456 789.12" duration="1000">123 456 789.12</nice-counter>
```

### Value Assignment & Behavior

- **Custom Values**: Custom values with spaces, dashes, dots, and other delimiters animate smoothly between patterns.
  ```html
  <!-- Example -->
  <nice-counter value="987-654-321.98">123 456 789.12</nice-counter>
  ```
- **`null`**: Setting the value to `null` (via JS property) or omitting/resetting resets and animates back to the default initial pattern.
- **`''` (Empty String)**: Setting the value to an empty string (`''`) animates the counter to empty/zero signature.

### Attributes

- `value`: The target numeric/pattern value to animate towards.
- `duration`: Animation duration in milliseconds (default: `1000`).

### Programmatic API

You can also import and initialize the counter programmatically:

```js
import createCounter from 'nice-counter';

const counter = createCounter('123 456 789.12', '', { duration: 1000 });
document.body.appendChild(counter.getRootEl());

// Animate to a new value
counter.setValue('987 654 321.98');

// Reset to default
counter.setValue(null);

// Empty counter
counter.setValue('');
```

---

## Development & Contribution

### Installation

Clone the repository and install dependencies:

```bash
npm install
```

### Development

To start the local development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

### Build

To build the library bundles (ES, CJS, IIFE) and the static demo page (with compiled static Tailwind CSS) into `docs/` and `dist/`:

```bash
npm run build
```

### Linting

To run ESLint across the codebase:

```bash
npm run lint
```
