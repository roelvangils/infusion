+++
title = "Installation and configuration"
weight = 1
+++

To use Albos in a production environment, you need to include `albos.min.js` in your HTML document. The easiest way is to use our CDN version, but you can also use NPM or clone the repository locally.

## Get the file

### Link to the file using our CDN

If you don't mind hosting from an external location, you can simply paste this line of code before your closing `</body>`:

```html
<script src="cdn/albos.min.js" />
```

### Using NPM

To host NPM yourself and it include it as a depency in other projects, install the Albos package using NPM:

{{<cmd>}}
  npm install albos
{{</cmd>}}
