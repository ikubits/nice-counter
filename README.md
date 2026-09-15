# Nice Counter

An Odometer.js-inspired counter web component implementation with smooth easing, motion blur effect, custom delimiter patterns, and programmatic controls. Built with Vite.

## Features & Goals

- **Default Initialization**: `<nice-counter>123 456 789.12</nice-counter>` renders `123 456 789.12`.
- **Zero / Empty Pattern Initialization**: `<nice-counter value="">123 456 789.12</nice-counter>` renders `000 000 000.00`.
- **Custom Patterns & Delimiters**: Supports spaces, dashes, dots, commas, and other characters matching the pattern structure.
- **Dynamic Setters & Animation**:
  - `el.value = null` -> resets and animates back to the default initial value.
  - `el.value = ""` -> animates to the value pattern filled with zeros (`000 000 000.00`).
  - `el.value = "987-654-321.55"` -> animates smoothly to any matching pattern value.
- **Duration Control**: Configure animation duration via the `duration` attribute (in milliseconds) or the `duration` property setter.

---

## Usage Examples

### 1. HTML Custom Element (`<nice-counter>`)

#### Default Value (Text Content)
```html
<!-- Renders 123 456 789.12 initially -->
<nice-counter>123 456 789.12</nice-counter>
```

#### Empty / Zero Pattern (`value=""`)
```html
<!-- Renders 000 000 000.00 initially based on the pattern -->
<nice-counter value="">123 456 789.12</nice-counter>
```

#### Custom Target Value & Duration Attribute
```html
<!-- Animates to target value with a 1200ms duration -->
<nice-counter value="987-654-321.55" duration="1200">123 456 789.12</nice-counter>
```

---

### 2. JavaScript Setters & Properties

You can control `<nice-counter>` elements programmatically via DOM properties and attributes:

```html
<nice-counter id="counter" duration="1000">123 456 789.12</nice-counter>

<script type="module">
  import 'nice-counter';

  const el = document.getElementById('counter');

  // 1. Animate to another valid pattern value
  el.value = "987-654-321.55";

  // 2. Change duration via property or attribute
  el.duration = 1500;
  // or el.setAttribute('duration', '1500');

  // 3. Reset to default value (animates back to textContent)
  setTimeout(() => {
    el.value = null;
  }, 2000);

  // 4. Fill pattern with zeros (animates to 000 000 000.00)
  setTimeout(() => {
    el.value = "";
  }, 4000);
</script>
```

---

### 3. Programmatic API (`createCounter`)

For non-custom element or custom container usage:

```js
import createCounter from 'nice-counter';
// Or import { es } export path:
// import createCounter from 'nice-counter/es';

// createCounter(initialValue, defaultValue, options)
// - initialValue: initial rendered value (or null/"" for default/zero)
// - defaultValue: reference pattern (text content)
// - options: { duration: 1000 }
const counter = createCounter('987 654 321.98', '123 456 789.12', { duration: 1000 });

// Mount to DOM
document.body.appendChild(counter.getRootEl());

// Animate to new value
counter.setValue('456 123 789.00');

// Change duration dynamically
counter.setDuration(1500);

// Reset to default value pattern
counter.setValue(null);

// Reset to zero pattern
counter.setValue('');

// Clean up instance
// counter.destroy();
```

---

### 4. Browser IIFE Bundle

Include the standalone bundle script in your HTML file to automatically register and use `<nice-counter>` globally:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Nice Counter Example</title>
</head>
<body>
  <nice-counter value="987-654-321.55" duration="1200">123 456 789.12</nice-counter>

  <!-- Include the IIFE bundle -->
  <script src="./dist/nice-counter.iife.js"></script>
</body>
</html>
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

To build the library bundles (ES, CJS, IIFE) and the static demo page:

```bash
npm run build
```

### Linting

To run ESLint across the codebase:

```bash
npm run lint
```
