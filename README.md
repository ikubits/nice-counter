# Nice Counter

An Odometer.js-inspired animated counter Web Component with smooth easing, motion blur effect, and custom delimiter patterns. Built with Vite and Tailwind CSS.

## Installation

Install the package via npm:

```bash
npm i nice-counter
```

---

## Usage

To use the `<nice-counter>` custom element in your HTML, you must first load the library (either via ES module import or script tag).

### Option A: ES Module

```js
// main.js or app.js
import 'nice-counter';
```

```html
<!-- index.html -->
<script type="module" src="./main.js"></script>

<nice-counter>123 456 789.12</nice-counter>
```

### Option B: Browser Script Tag (IIFE)

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

## Initialization & Rendering Examples

- **Default Value (Text Content)**:
  ```html
  <!-- Renders 123 456 789.12 initially -->
  <nice-counter>123 456 789.12</nice-counter>
  ```

- **Zero / Empty Pattern (`value=""`)**:
  ```html
  <!-- Renders 000 000 000.00 initially based on the pattern -->
  <nice-counter value="">123 456 789.12</nice-counter>
  ```

- **Custom Initial Value & Duration**:
  ```html
  <!-- Animates to target value with a 1200ms duration -->
  <nice-counter value="987-654-321.55" duration="1200">123 456 789.12</nice-counter>
  ```

---

## Programmatic Control via JavaScript

You can control `<nice-counter>` instances dynamically using JavaScript properties and setters:

```html
<nice-counter id="counter" duration="1000">123 456 789.12</nice-counter>

<script type="module">
  import 'nice-counter';

  const el = document.getElementById('counter');

  // 1. Animate to a new valid pattern value
  el.value = "987-654-321.55";

  // 2. Change animation duration dynamically
  el.duration = 1500;

  // 3. Reset to the default value (text content)
  setTimeout(() => {
    el.value = null;
  }, 2000);

  // 4. Fill pattern with zeros (000 000 000.00)
  setTimeout(() => {
    el.value = "";
  }, 4000);
</script>
```

---

## Development & Contribution

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Linting
```bash
npm run lint
```
