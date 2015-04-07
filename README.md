# vis-toolkit

* A simple, fast visualization toolkit based on D3 charts
* Enable storytelling with step by step display and annotations
* Allow transitions between charts
* Extensible with a modular architecture

## Usage

Simply add the vistk JavaScript and CSS files.

```html
<link href="vistk.css" rel="stylesheet">
<script src="vistk.js"></script>
```

### Dependencies

* D3 (which version? latest one?)

## Examples

* Table ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/table.html) | [Source](examples/table.html))
* Treemap ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/treemap.html) | [Source](examples/treemap.html))
* Scatterplot ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/scatterplot.html) | [Source](examples/scatterplot.html))
* Node-Link ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/nodelink.html) | [Source](examples/nodelink.html))

* Build your own graph environment
 * Using an editor http://ace.c9.io/#nav=about
 * Build your own grid

## Tests

* What should be tested?
* Where should it be tested? Client or remove server?
* Which dataset should be used for the tests?

## Input Format

* Which format should be used as input?
* How to detect items? rows?
* How to deal with trees?
* Different types of datasets
 * **Items:** which are elements we want to visualize
 * **Properties:** which are the static properties of the items
 * **Attributes:** which are some none-static, non-universal properties
 * **Time-dependent:** attributes that change over time

Example with Colombia:
* Departments are items http://54.172.130.22/api/departments/
* International product space http://54.172.130.22/labs/data/atlas_international_product_space.json
* Attributes http://54.172.130.22/api/products/?aggregation=2digit

What to do when some attribuets are missing over time?

* Some of the properties are made for the visualization (e.g. product space)

## Data Management (TODO: discuss with QUINN)

* Items should be loaded first, and ideally loaded only once
 * But for which level of details?..

* Then other properties, attributes, can be loaded on-demand and eventually be kept
 * How do we decide to get rid of some items/attributes/properties?

* Dynamically load data, lazy data loading

* Streaming data?

## States (TODO: discuss with QUINN)

* Capture state (and enable slide shows), enable loading at a specific state
 * Default states (similar to default config)

* Internal state
 * How is this kept by the application?

## Howto create a new chart

* What is the interface? Options are:
 * Object inheritance
 * Create a list of pre-defined visualization
 * Implement a specific interface (à la d3plus)
* What should be reused or not?
* How to define the transitions to other apps?


## Roadmap

* Re-create standard examples from d3
 * Treeemap ([with word wrap](http://bl.ocks.org/mundhradevang/1387786))
 * Scatterplot http://bl.ocks.org/mbostock/3887118
 * Stacked graph http://bl.ocks.org/mbostock/4060954 and transition to [small multiples](http://bl.ocks.org/mbostock/9490516) and [here too](http://bl.ocks.org/mbostock/3885211)
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
 * Export: svg, png, ..

* Boilerplate code
 * Dev environment
 * Automate compilation
 * Testing (using Travis?)
 * Performances (included in unit testing?)
 * Sample datasets we will be using
 * Consistent input file format

* Visual customization
 * Margin, padding, etc.
 * Number format. Font, font weight.

* Interactions: 
 * `.focus` highlights one particular element
 * `.selection` selects a group of nodes
 * `.filter` 
 * `aggregate`
 * `time change`

* UI elements for interaction
 * Either from the visualization itslef, or with auto-generated widgets
 * Binding with external buttons/widgets

* Visual manager 
* Initialize components constructors
* Use d3.dispatch and custom events for transimtions management


## What it should achieve

* Should be fast (e.g. only requires attributes to be loaded once)
 * More importantly: we should be able to measure the performances
 * Benchmark with other toolkits for similar visualizations
* Able to create multiple instances of visualizations on the same page
 * And eventually coordinate them (e.g brushing one filters another one)
 * Should also share some similar attributes/properties


* Customized visual design
 * Default CSS but should allow this to be overloaded

* Default values should be coherent
 * Default parameters
 * Especially when transitionning
 * Enable minimal set of parameters to begin with

* Extensible to add new functionalities
 * New charts
 * New utils functions
 * New components (parts of the chart)

* Make sure it works for all types of data
 * But should make sure an input format has been defined
 * Dealing/robust even with missing data
 * Should be visually reflected too

* Animation but carefully used
 * Should we use object consistancy to transform them? http://bost.ocks.org/mike/constancy/
 * Using points for transition?

* Text wrap for long names (see [d3plus word wrap](https://github.com/alexandersimoes/d3plus/wiki/Basic-Utilities#wordwrap))
 * Guaranty that exported SVG will be correct
 * Same with other export file formats
 * Customizable tooltips (d3plus.tooltip.create())

* Callback once the loading is terminated
 * This is quite tricky as many things are pending
 * enter, update and exit
 * Other transitions (e.g. attrTween)
 * Other custom transitions, physical simulation, etc.
 * Dispatching other events

* Legend: should be informative on the mapping and the quantity of attributes, also actionable for filtering. 
 * Multiple selections should be allowed
 * Automatically generated
 

Intresting reading on D3 modular/reusable

* [Mike Bostock’s reusable D3](http://bost.ocks.org/mike/chart/)

* https://blog.safaribooksonline.com/2013/07/11/reusable-d3-js-using-attrtween-transitions-and-mv/

Storytelling

* Show one step at a time
 * Use delays and duration
 * Controled by external widgets
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
* examples - currently supported visualizations
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

### Table

* http://handsontable.com/demo/pagination.html#5
* https://github.com/mleibman/SlickGrid

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
* https://github.com/ndarville/d3-charts
