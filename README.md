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
* Eventually some `topojson.js`, `queue.js` dependencies for the [geo-map](http://cid-harvard.github.io/vis-toolkit/examples/geomap.html) as well as world shape files 
* Metadata (e.g. product space nodes and links)

## Examples

* Treemap ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/treemap.html) | [Source](examples/treemap.html))
* Scatterplot ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/scatterplot.html) | [Source](examples/scatterplot.html))

* Line Chart ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/linechart.html) | [Source](examples/linechart.html))

Colombian Profile charts

* Dot plot ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/dotplot.html) | [Source](examples/dotplot.html))
* Sparkline ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/sparkline.html) | [Source](examples/sparkline.html))

* Geo Map ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/geomap.html) | [Source](examples/geomap.html))

## How to

Create a new chart and attach it to DOM element (e.g. `#viz`):

```json
var visualization = vistk.viz()
      .params({
        container: "#viz"
        data: [0, 1, 2]
      })
```

By default, it creates a chart of `none` type as a self-organizing chart with 3 `items`. An `item` is a row in the dataset and should be identified by a unique `id`. By default, if no `id` exist, it will automatically create one using the index of each raw. 

To create a chart using one of the templates in (located in `src/visualizations/*.js`), then a a `type` paramter (e.g. )

```json
var visualization = vistk.viz()
      .params({
        container: "#viz"
        data: [{id: 0}, {id: 1}, {id: 2}],
        type: 'dotplot'
        var_id: 'id',
        var_x: 'id'
      })
```



### Default charts configs

* Basic charts

### Charts configs


* Table ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/table.html) | [Source](examples/table.html))

### Roadmap

* Cover implemetation of basic [chart types](http://www.excelcharts.com/blog/classification-chart-types/).

* VisTK show reel similar to [D3 show reel](http://bl.ocks.org/mbostock/1256572) to demonstrate transitions between charts





