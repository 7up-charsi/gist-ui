# @gist-ui/button

A button allows a user to perform an action, with mouse, touch, and keyboard interactions.

This component heavilly depends on `@gist-ui/theme`. Because theme package contains all component styles and TailwindCSS plugin.

## Features

- Accessible – Uses a native button element under the hood, with support for the Space and Enter keys.
- Cross-browser – Mouse, touch, keyboard, and focus interactions are normalized to ensure consistency across browsers and devices.

for more details refer to this [blog post](https://react-spectrum.adobe.com/blog/building-a-button-part-1.html)

## Installation

1.  lets assume you have setup TailwindCSS. If not please refer to this [guide](https://tailwindcss.com/docs/installation)
2.  set path and plugin

    ```js
    // file: tailwind.config.js
    import { gistui } from "@gist-ui/theme";

    export default {
      content: [
        // includes theme package so tailwindcss generate component styles],
        "./node_modules/@gist-ui/theme/dist/**/*.{js,jsx}",
      ],
      // add plugin because @gist-ui uses custom configurations
      plugins: [gistui()],
    };
    ```

3.  install button component

    ```bash
    pnpm add @gist-ui/button
    # or
    yarn add @gist-ui/button
    # or
    npm i @gist-ui/button
    ```

## API Reference

is in progress

## Usage/Examples

```js
import { Button } from "@gist-ui/button";

function App() {
  return <Button>gist ui</Button>;
}
```

## Licence

This project is licensed under **MIT license**
