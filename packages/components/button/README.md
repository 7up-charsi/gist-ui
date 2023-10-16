# @front-ui/button

A button allows a user to perform an action, with mouse, touch, and keyboard interactions.

This component heavilly depends on `@front-ui/theme`. Because theme package contains all component styles and TailwindCSS plugin.

## Features

- Accessible – Uses a native button element under the hood, with support for the Space and Enter keys.
- Cross-browser – Mouse, touch, keyboard, and focus interactions are normalized to ensure consistency across browsers and devices.

for more details refer to this [blog post](https://react-spectrum.adobe.com/blog/building-a-button-part-1.html)

## Installation

1.  lets assume you have setup TailwindCSS. If not please refer to this [guide](https://tailwindcss.com/docs/installation)
2.  set path and plugin

    ```js
    // file: tailwind.config.js
    import { frontplusui } from "@front-ui/theme";

    export default {
      content: [
        // includes theme package so tailwindcss generate component styles],
        "./node_modules/@front-ui/theme/dist/**/*.{js,jsx}",
      ],
      // add plugin because @front-ui uses custom configurations
      plugins: [frontplusui()],
    };
    ```

3.  install button component

    ```bash
    pnpm add @front-ui/button
    # or
    yarn add @front-ui/button
    # or
    npm i @front-ui/button
    ```

## API Reference

is in progress

## Usage/Examples

```js
import { Button } from "@front-ui/button";

function App() {
  return <Button>frontplus ui</Button>;
}
```

## Licence

This project is licensed under **MIT license**
