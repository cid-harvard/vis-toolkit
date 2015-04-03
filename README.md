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

* Table ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/table.html) | [Source](examples/table.html))
* Treemap ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/treemap.html) | [Source](examples/treemap.html))
* Scatterplot ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/scatterplot.html) | [Source](examples/scatterplot.html))

* Build your own graph environment

## Tests

## Howto create a new app

* What is the interface?
* What should be reused or not?
* What is inherited from the main interface?

* Parameters
* Internal state

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
** More importantly: we should be able to measure the performances
* Able to create multiple instances of visualizations on the same page
** And eventually coordinate them (e.g brushing one filters another one)
* Interactions: focus, selection, filter, aggregate, time change
** Either from the visualization itslef, or with auto-generated widgets
** Binding with external buttons/widgets
* Customized visual design
** Default CSS but should allow this to be overloaded
* Default values should be coherent
** Especially when transitionning
* Extensible to add new functionalities
** New charts
** New utils functions
* Make sure it works for all types of data
* Animation but carefully used
** Should we use object consistancy to transform them? http://bost.ocks.org/mike/constancy/
* Dealing/robust even with missing data
* Text wrap for long names (see [d3plus word wrap](https://github.com/alexandersimoes/d3plus/wiki/Basic-Utilities#wordwrap))
* Guaranty that exported SVG will be correct
** Same with other export file formats
* Customizable tooltips (d3plus.tooltip.create())
* Capture state (and enable slide shows), enable loading at a specific state
* Dynamically load data, lazy data loading
* Callback once the loading is terminated
* Legend: should be informative on the mapping and the quantity of attributes, also actionable for filtering. Multiple selections should be allowed.
* Complex states should be captured and avaibale via the URL

Storytelling

* Show one step at a time
** Use delays and duration
** Controled by external widgets
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

