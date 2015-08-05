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
* Metadata (e.g. [product space] nodes and links) have to be loaded externally

## Examples

Current Colombian Atlas Profile charts

* Dot plot ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/dotplot.html) | [Source](examples/dotplot.html))
* Sparkline ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/sparkline.html) | [Source](examples/sparkline.html))
* Treemap ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/treemap.html) | [Source](examples/treemap.html))
* Product Space ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/scatterplot_productspace.html))


Other Charts

* Scatterplot ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/scatterplot.html) | [Source](examples/scatterplot.html))
* Line Chart ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/linechart.html) | [Source](examples/linechart.html))
* Industry Space ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/scatterplot_industryspace.html))

Work-In-Progress

* Geo Map ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/geomap.html) | [Source](examples/geomap.html))

## HOWTO: Create a Chart

The philosophy behind `vistk` is to use a configuration file that instantiate a chart template  (e.g. "sparkline", "dotplot", "barchart", "linechart", "scatterplot", "grid", "stacked", "piechart", "slopegraph", "productspace", "treemap", "geomap", "stackedbar", "ordinal_vertical" or "ordinal_horizontal").

This is one of the many charts template (located in `src/visualizations/*.js`). Such a template can either be applied when creating the chart, or to update an existing chart. To add the `dotplot` template simply add a `type` parameter.

### Boilerplate

```html
<div id="viz"></div>
<script>

var  visualization = vistk.viz()
    .params({});

d3.select("#viz").call(visualization);

</script>
```html

### Minimal Chart

A [default chart](http://cid-harvard.github.io/vis-toolkit/examples/default_minimal.html) is a minimal representation with no mapping besides showing each row as a dot. For instance, the dataset `[0, 1, 2, 3]` is plotted as a self-organized graph within the SVG canvas boundaries (position doesn't encode anything(. The SVG canvas is attached to a parent DOM element (e.g. `#viz`) as follows:

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

Each chart in `vistk` has a `type` and for the default chart it is called `none`. An `item` is a row in the dataset and should be identified by a unique `id`. By default, if no `id` exist, it will automatically create one using the index of each raw and set the `var_id` parameter to the `__id` attribute.

```jsons
.params({
  container: "#viz",
  data: [{var__id: 0, value: 10}, {var__id: 1, value: 20}, {var__id: 2, value: 30}, {var__id: 3, value: 40}],
  var_id: '__id',
  var_text: 'value'
});
```

### Dot Plot


```json
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

> A small line chart showing variations of a measure without any axis.

```json
.params({
  type: "sparkline",
  container: "#viz",
  var_y: "realgdp",
  time: {
    var_time: "year", 
    parse: d3.time.format("%Y").parse,
    current_time: '2012',
    filter_interval: ['2000', '2012']
  },
  items: [{
    marks: [{
      type: "diamond"
    }, {
      var_mark: '__highlighted',
    }]
  }],
  var_x: "year"
});
```

### Treemap


### Scatterplot

> 

### Product Space

## HOWTO: Chart Customizations

### Items

```json
params.items = [{
  attr: "name",
  marks: [{
    type: "circle",
  },{
    type: "text",
    rotate: "-90"
  }]
}];
```

### Connections

## HOWTO: Interaction

### Attributes

Interaction with the chart (e.g. mouseover, click, ..) automatically updated items attributes

* `__highlighted`
* `__selected`
* `__zoom`

Custom attributes can be created

Custom event dispatches as well

### Data Mapping to Marks


## Roadmap

* Implement more basic [chart types](http://www.excelcharts.com/blog/classification-chart-types/).
* Polish existing examples
* Create more cross overs

### Roadmap

0.0.3
* Fix geo map
* Fix transition geo map to grid
* Fix treemap blank squares #3

0.0.4
* Aggregation for treemap
* Highlight product space links when node is highlighted
* Filter product space links
* Fix table ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/table.html) | [Source](examples/table.html))


0.1

* Chart nesting function
* Views (aka a mechanism to duplicate items)
* Testing: non-regression, performances, .. and fully automated
* Custom `group by` function

0.2

* Create a [show reel](http://cid-harvard.github.io/vis-toolkit/examples/stepper_all.html) similar to [D3 show reel](http://bl.ocks.org/mbostock/1256572) to demonstrate transitions between charts
