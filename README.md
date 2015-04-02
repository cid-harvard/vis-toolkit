# vis-toolkit

## Usage

Simply add the vistk JavaScript and CSS files.

```html
<link href="vistk.css" rel="stylesheet">
<script src="vistk.js"></script>
```

### Dependencies

* D3 (which version?)

## Examples

* Table
* Treemap

* Build your own graph environment

## Tests


## Howto create a new app

* What is the interface?
* What should be reused or not?



## Roadmap

* Re-create standard examples from d3
 * Treeemap ([with word wrap](http://bl.ocks.org/mundhradevang/1387786))
 * Scatterplot http://bl.ocks.org/mbostock/3887118
 * Stacked graph http://bl.ocks.org/mbostock/4060954 and transition to [small multiples](http://bl.ocks.org/mbostock/9490516)
 * Maps
 * Google maps
 * Choropleth map (using geojson)
 * Some flow map or graph such as [pivotgraph](http://bl.ocks.org/mbostock/4343153)
 * Horizontal or vertical dot plot (https://github.com/marmelab/EventDrops)
 * Rankings
 * Diverging bar charts http://bl.ocks.org/wpoely86/e285b8e4c7b84710e463

* With utils
 * Labels http://bl.ocks.org/dbuezas/9306799
 * Color scale / legend (should contain the min/max values and min/max color range)
 * Time slider
 * Filters button
 * Title

* Templating visualizations
 * Standard interface to create them
 * Consider states issues later on 
 * Export: svg, png, ..


* Boilerplate code
 * Dev environment
 * Automate compilation
 * Testing (using Travis)
 * Performances (included in unit testing?)
 * Sample datasets we will be using
 * Consistent input file

* Visual customization
 * Margin, padding, etc.
 * Number format. Font, font weight.


## What it should achieve

* Should be fast (e.g. only requires attributes to be loaded once)
* Create multiple instances of visualizations on the same page
* Interactions: focus, selection, filter, aggregate, time change
* Customized visual design
* Default values should be coherent
* Extensible to add new functionalities
* Make sure it works for all types of data
* Animation but carefully used
* Dealing/robust even with missing data
* Text wrap for long names (see [d3plus word wrap](https://github.com/alexandersimoes/d3plus/wiki/Basic-Utilities#wordwrap))
* Guaranty that exported SVG will be correct
* Make components as reusable as possible (e.g. axis, ..)
* Customizable tooltips (d3plus.tooltip.create())
* Capture state (and enable slide shows), enable loading at a specific state
* Dynamically load data, lazy data loading
* Callback once the loading is terminated
* Binding with external buttons/widgets
* Legend: should be informative on the mapping and the quantity of attributes, also actionable for filtering. Multiple selections should be allowed.
* Complex states should be captured and avaibale via the URL

Storytelling

* Show one step at a time
* Wireframe, then color mapping, then ...
* Part of the visualization
* See https://idl.cs.washington.edu/files/2014-Ellipsis-EuroVis.pdf
* See also http://www.visualcinnamon.com/2014/12/using-data-storytelling-with-chord.html
* Vertical scrolling support? [graph-scroll](http://1wheel.github.io/graph-scroll/)
* See [Miso project](https://github.com/misoproject/storyboard)

* Tentative
 * Use the grammar of graphics visual decomposition
 * First show the background
 * Or a specificly highlighted element (e.g. focus)
 * 

Misc Considerations (TBD)

* Cross Browser Compatibility
* Cross Device Compatibility


Template
* See http://bost.ocks.org/mike/chart/
* See http://bost.ocks.org/mike/chart/time-series-chart.js

## Code Structure

* build
** vistk.css
** vistk.js
* examples
* src
* test
** treemapTest.html


## Create a chart

We should be able to create a chart like that:

```json
var chart = new vistk.Chart({
    data: datasource,
    type: 'line',
    x: 'x-var',
    y: 'y-var',
    color: 'type'
});
```

```json
.container("#viz")
.height(height)
.width(width)
.data(data)
.id("name")
.year("year")
.render()
```

### Tree_map

```json
.type("tree_map")
.size("value")
.color(function(d){
  return color(d);
})
.text("name")
```

### Rankings

```json
.type("rankings")
.cols(["A", "B", "C"])
.order()
```

### Line chart

```json
.type("rankings")
```

### Geo map

```json
.type("geo_map")
.text("text")

```

## Update a chart

```json
vis.render()
```

# Refs

* NVd3 - http://nvd3.org/ 
* C3.js - http://c3js.org/ 
* xCharts - http://tenxer.github.io/xcharts/ 
* Rickshaw - http://code.shutterstock.com/rickshaw/

