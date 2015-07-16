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

### Dependencies

* **D3** version `3.4.10` (not tested with other versions, but no reason why not)
* Eventually some `topojson.js`, `queue.js` dependencies for the [geo-map](http://cid-harvard.github.io/vis-toolkit/examples/geomap.html) as well as world shape files 
* Metadata (e.g. product space nodes and links) are also loaded externally

## Examples

Colombian Atlas Profile charts

* Dot plot ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/dotplot.html) | [Source](examples/dotplot.html))
* Sparkline ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/sparkline.html) | [Source](examples/sparkline.html))
* Treemap ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/treemap.html) | [Source](examples/treemap.html))
* Product Space ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/scatterplot_productspace.html)


Other Charts

* Scatterplot ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/scatterplot.html) | [Source](examples/scatterplot.html))
* Line Chart ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/linechart.html) | [Source](examples/linechart.html))
* Industry Space ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/scatterplot_industryspace.html)

Work-In-Progress

* Geo Map ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/geomap.html) | [Source](examples/geomap.html))

## HOWTO

### Default Chart

Create a [default chart](http://cid-harvard.github.io/vis-toolkit/examples/default_minimal.html) where each row of the dataset `[0, 1, 2, 3]` is a dot that self-organized in the SVG canvs. The SVG is attached to a parent DOM element (e.g. `#viz`):

```html
<div id="viz"></div>
<script>

var  visualization = vistk.viz()
    .params({
      container: "#viz",
      data: [10, 20, 30, 40],
    });

d3.select("#viz").call(visualization);

</script>
```

By default, `vistk` creates a chart of `none` type as a self-organizing chart with 3 `items`. An `item` is a row in the dataset and should be identified by a unique `id`. By default, if no `id` exist, it will automatically create one using the index of each raw and set the `var_id` parameter to the `__id` attribute.

```jsons
    .params({
      container: "#viz",
      data: [{var__id: 0, value: 10}, {var__id: 1, value: 20}, {var__id: 2, value: 30}, {var__id: 3, value: 40}],
      var_id: '__id',
      var_text: 'value'
    });
</script>
```

### Dot Plot


A dotplot consists of data points plotted on a simple linear scale (horizontal or vertical). This is one of the many charts template (located in `src/visualizations/*.js`). Such a template can either be applied when creating the chart, or to update an existing chart. To add the `dotplot` template simply add a `type` parameter (e.g. "sparkline", "dotplot", "barchart", "linechart", "scatterplot", "grid", "stacked", "piechart", "slopegraph", "productspace", "treemap", "geomap", "stackedbar", "ordinal_vertical" or "ordinal_horizontal"):

```json
var visualization = vistk.viz()
      .params({
        container: "#viz"
        data: [10, 20, 30, 40],
        type: 'dotplot'
        var_id: 'id',
        var_x: 'value',
        var_text: 'value'
      })
```


### Sparkline

### Treemap

### Scatterplot


### Product Space


## Roadmap

*

*

* Table ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/table.html) | [Source](examples/table.html))

### Roadmap

* Cover implementation of basic [chart types](http://www.excelcharts.com/blog/classification-chart-types/).

* Create a [show reel](http://cid-harvard.github.io/vis-toolkit/examples/stepper_all.html) similar to [D3 show reel](http://bl.ocks.org/mbostock/1256572) to demonstrate transitions between charts
