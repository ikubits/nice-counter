# Nice Counter

An Odometer.js-inspired counter web component implementation with a separate library source and static demo documentation page. Built with Vite and Tailwind CSS v4.

## Usage

### 1. Inline in HTML `<nice-counter>` Tag

Use the `<nice-counter>` custom element directly in your HTML. You can specify initial values via text content and target values or durations via attributes.

```html
<!-- Basic counter -->
<nice-counter value="123 456 789.12" duration="1000">123 456 789.12</nice-counter>

<!-- Custom delimiters (spaces, dashes, dots, commas) -->
<nice-counter value="987-654-321.98">123 456 789.12</nice-counter>
```

### 2. Using via Script Tag (Browser IIFE)

Include the standalone IIFE bundle script in your HTML file to automatically register and use `<nice-counter>` globally without a module bundler:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Nice Counter Example</title>
</head>
<body>
  <nice-counter value="123 456 789.12" duration="1200">123 456 789.12</nice-counter>

  <!-- Include the IIFE bundle -->
  <script src="./dist/nice-counter.iife.js"></script>
</body>
</html>
```

### 3. Using in Own Modules (ES / CJS)

#### Variant A: ES Module & HTML `<nice-counter>` Tag
Import the library in your application's JavaScript entry point to register the `<nice-counter>` custom element, then use it freely in your HTML templates or component markup:

```js
// main.js or app.js
import 'nice-counter';
// Or explicit export path:
// import 'nice-counter/es';
```

```html
<!-- index.html -->
<script type="module" src="./src/main.js"></script>

<nice-counter value="123 456 789.12" duration="800">123 456 789.12</nice-counter>
```

#### Variant B: Programmatic API Creation
Import the `createCounter` function to programmatically instantiate, mount, and control counter elements directly in JavaScript:

```js
import createCounter from 'nice-counter';
// Or: import createCounter from 'nice-counter/es';

// Create counter instance
const counter = createCounter('123 456 789.12', '', { duration: 1000 });

// Append to the DOM
document.body.appendChild(counter.getRootEl());

// Animate to a new value
counter.setValue('987 654 321.98');

// Change duration dynamically
counter.setDuration(1500);

// Reset to default
counter.setValue(null);

// Empty counter
counter.setValue('');

// Clean up when removing component
// counter.destroy();
```

### Value Assignment & Behavior

- **Custom Values**: Custom values with spaces, dashes, dots, and other delimiters animate smoothly between patterns.
- **`null`**: Setting the value to `null` (via JS property) or omitting/resetting resets and animates back to the default initial pattern.
- **`''` (Empty String)**: Setting the value to an empty string (`''`) animates the counter to empty/zero signature.

### Attributes

- `value`: The target numeric/pattern value to animate towards.
- `duration`: Animation duration in milliseconds (default: `1000`).

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
