# vis-toolkit

## Usage

Simply add the `vistk` JavaScript and CSS files as below:

```html
<link href="vistk.css" rel="stylesheet">
<script src="vistk.js"></script>
```
## Installation

* Install project dependencies with `npm install`
* Build version `build/vistk.js` with `grunt` and watch changes with `grunt watch`
* To generate the <a href='gallery.html'>thumbnails gallery</a>, install phantomjs and run `phantomjs scripts/vis_thumbnails.js`

### Dependencies

* **D3** version `3.4.10` (not tested with other versions, but no reason why not)
* Eventually some `topojson.js`, `queue.js` dependencies for the [geo-map](http://cid-harvard.github.io/vis-toolkit/examples/geomap.html) as well as world shape files 
* Metadata (e.g. [product space] nodes and links) have to be loaded externally

#### JavaScript

The code is organized as follows:

```
├── src/js
│   ├── build
│   ├── css
│   ├── data
│   ├── exampl
│   ├── img
│   ├── js
│   ├── script
│   ├── shapef
│   ├── src
│   └── test
```

