# Assets.js
Assets.js allows you to use relative paths to serve your assets on Glitch.

Replacing this: `https://cdn.glitch.com/us-east-1%3A1a0f89c8-26bf-4073-baed-2b409695e959%2Ffoobar.png` :(

With this: `/assets/foobar.png` :)

## Getting Started

### Install:
Just copy and paste the contents of `assets.js` into your project.

### Example usage:
Then reference that file as follows:
```
var assets = require("./assets");
var express = require("express");

var app = express();
app.use("/assets", assets);
```