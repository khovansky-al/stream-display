# stream-display [![Build Status](https://travis-ci.org/khovansky-al/stream-display.svg?branch=master)](https://travis-ci.org/khovansky-al/stream-display) ![License](https://img.shields.io/badge/license-MIT-blue.svg)

A tiny Typescript wrapper around Screen Capture API `getDisplayMedia` that sends screen video feed as `ImageData` to your desired callback.

## Installation

### NPM package

```bash
npm install stream-display
```

and then

```javascript
import StreamDisplay from 'stream-display';
```

### In browser without bundlers

You can take the `dist/stream-display.js` file or use a service like [unpkg](https://unpkg.com/stream-display@latest/dist/stream-display.js). Example:

```html
<script src="https://unpkg.com/stream-display@latest/dist/stream-display.js"></script>
<script>
  const stream = new StreamDisplay(...);
</script>
```

## Usage

```javascript
const processImageData = imageData => {...};
const stream = new StreamDisplay(processImageData);

stream.startCapture();
// ...
stream.stopCapture();
```



### Build a new instance of stream-display:

```javascript
new StreamDisplay(callback, options = {})
```

#### Arguments

- `callback: (image: ImageData) => any` - A function that takes one argument — image data from the screen capture feed
- `options` (optional) — a configuration object, currently can have only one option:
  - `scanInterval: number (ms)` — interval between every callback invocation. Default value — `1000 `. **NB**: when your tab enters background — most browsers will cap the setInterval at `1000ms` maximum. Setting this value lower will not have any effect.

### Start/stop capture

`async startCapture()` — will trigger the screen capture modal and as soon as user accepts — start sending the `ImageData`. On error will return a rejected `Promise` with the error. A list of possible exceptions can be found on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia).

`stopCapture()` — ends the capture session.

## Tests

This library is using `tape` as a test runner. Tests themselves are also written in typescript and launched using `ts-node`.

To run the tests simpy launch

```bash
npm run test
```

 If you want to debug the tests, you can use the following configuration (VSCode):

```json
{
  "type": "node",
  "request": "launch",
  "name": "Launch Program",
  "args": [
    "${workspaceRoot}/tests/StreamDisplay.test.ts"
  ],
  "runtimeArgs": [
    "-r",
    "ts-node/register"
  ],
  "cwd": "${workspaceRoot}",
  "protocol": "inspector",
  "internalConsoleOptions": "openOnSessionStart",
  "env": {
    "TS_NODE_IGNORE": "false"
  }
}
```

## Building

To build the library locally you need to

```bash
npm install
npm run build
```

A fresh build will be waiting for you in the `/dist` folder.