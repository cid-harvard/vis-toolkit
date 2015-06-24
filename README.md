# vis-toolkit

## Usage

Simply add the `vistk` JavaScript and CSS files as below:

```html
<link href="vistk.css" rel="stylesheet">
<script src="vistk.js"></script>
```
## Installation

* Install project dependencies with `npm install`
* Run Grunt with `grunt`

### Dependencies

* **D3** version `3.4.10` (not tested with other versions, but no reason why not)
* Eventually some `topojson.js`, `queue.js` dependencies for the geomap
* Also relies on world shape files for maps (should be avoided in the future?)
* Plus metadata (e.g. product space nodes and links)

## Examples

The current version aims at implementing basic [chart types](http://www.excelcharts.com/blog/classification-chart-types/).

* Table ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/table.html) | [Source](examples/table.html))
* Treemap ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/treemap.html) | [Source](examples/treemap.html))
* Scatterplot ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/scatterplot.html) | [Source](examples/scatterplot.html))
* Node-Link ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/nodelink.html) | [Source](examples/nodelink.html))
* Line Chart ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/linechart.html) | [Source](examples/linechart.html))
* Sparkline ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/sparkline.html) | [Source](examples/sparkline.html))
* Dot plot ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/dotplot.html) | [Source](examples/dotplot.html))
* Geo Map ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/geomap.html) | [Source](examples/geomap.html))

Composite examples (using coordinated views)

* Profile overview ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/profile_overview.html)
* Profile complexity ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/profile_complexity.html)
* Profile exports ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/profile_exports.html)
* Profile possibilities ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/profile_possibilities.html )

Re-creation of standard examples

* Anscombe quartet ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/anscombe.html)

Look a the [various examples](http://cid-harvard.github.io/vis-toolkit/examples/).

## Customization

```json
var visualization = vistk.viz()
      .params({})
```

* Default charts configs
* Charts customize default config themself
* User customization

### Default charts configs

* Basic charts

### Charts configs

* All the files in `src/visualizations/*.js` are 

### User configs

* Everything that is in the HTML file



