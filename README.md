# vis-toolkit

## Usage

Simply add the `vistk` JavaScript and CSS files as below:

```html
<link href="vistk.css" rel="stylesheet">
<script src="vistk.js"></script>
```

You can directly link to Github pages:

```html
<link href="https://cid-harvard.github.io/vis-toolkit/css.vistk.css" rel="stylesheet">
<script src="https://cid-harvard.github.io/vis-toolkit/build/vistk.js"></script>
```


## Installation

* Install project dependencies with `npm install`
* Build latest version using `grunt` and watch changes with `grunt watch` (combine both) `grunt && grunt watch`
* The latest build should be available in `build/vistk.js`

### Dependencies

* **D3** version `3.5.10` (not tested with other versions, but no reason why not)
* Eventually some `topojson.js`, `queue.js` dependencies for the [geo-map](http://cid-harvard.github.io/vis-toolkit/examples/geomap.html) as well as world shape files 
* Metadata (e.g. [product space] nodes and links) have to be loaded externally and and are available in the [vis-toolkit-datasets](https://github.com/cid-harvard/vis-toolkit-datasets/tree/gh-pages/data) repository

#### JavaScript

The code is organized as follows:

```
├── build
├── css
├── examples
├── js
├── scripts
├── src
├── tests
├── src/js
│   
│   ├── css
│   ├── data
│   ├── example
│   ├── img
│   ├── js
│   ├── script
│   ├── shapef
│   ├── src
│   └── test
```

