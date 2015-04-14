# vis-toolkit

The **vis-toolkit** is yet another set of visualizations based on top of **D3**. Its goal is to provide access to simple, fast visualization rendering, that can easily be extended. Here are some other goals it aims to achieve:

* To allow complex charts composition
* To enables storytelling with step by step display and annotations
* To seamlessly allow transitions between charts

One of the fundamental design idea of the toolkit is to consider each element to display as **items** (e.g. countries, users of a social network). Those items are usually rows of a dataset and bound to graphical marks.

Each item is put on the space based on its **dimensions** (e.g. population, gdp) 


Finally, items can be updated over **time**. It uses templates that are a superimposition of layers that reproduce standard charts (treemap, scatterplot). Within this template, each **item** is encoded using a graphica marks (e.g. circle, rectangle).

Each visualization implements the following set of interactions: 

* `.highlight()` highlights an item. Usually triggered by a `.mouseover` event. Only one item can be highlighted at a time.

* `.focus()` is a more persistant form of highlight, triggered after a `click` event. Multiple elements can be focused at the same time. Another `click` allows the removal from the current set of focused items.

* `.selection()` selects a group of items. Each selection can be differentiated from another one with a visual encoding, such as color.

* `.filter()` removes items based on a similar attribute (e.g. defined by a `.group()`)

* `.aggregate()` groups items using a similar attribute

* `.time()` changes the current time point

## Usage

Simply add the `vistk` JavaScript and CSS files.

```html
<link href="vistk.css" rel="stylesheet">
<script src="vistk.js"></script>
```

### Dependencies

* **D3** version `3.4.10` (not tested with other versions, but no reason why not)
* Enventually some `topojson.js`, `queue.js` dependencies for the geomap
* Also relies on world shape files for maps -should be avoided

## Examples

* Table ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/table.html) | [Source](examples/table.html))
* Treemap ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/treemap.html) | [Source](examples/treemap.html))
* Scatterplot ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/scatterplot.html) | [Source](examples/scatterplot.html))
* Node-Link ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/nodelink.html) | [Source](examples/nodelink.html))
* Line Chart ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/linechart.html) | [Source](examples/linechart.html))
* Dot plot ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/dotplot.html) | [Source](examples/dotplot.html))

* Build your own graph environment
 * Using an editor (see existing rich text edit envs http://ace.c9.io/#nav=about)
 * Build your own grid
 * Customize charts interactively
 * Derive values? E.g. active or not for the rca value

## Tests

* What should be tested?
* Where should it be tested? Client or remove server?
* Which dataset should be used for the tests?
* Unit testings
 * Cross Browser Compatibility
 * Cross Device Compatibility
 * Use strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode

## Data Management (TODO: discuss with QUINN)

### Input Format

* Which format should be used as input?
 * Most likely a flat file that can easily filtered
 * Might be larger than a complex/nested structure, but easier to process
* How to detect items? rows?
* How to deal with trees?
 * Again a flat file and then connecting/aggregating might do the job


Types of visualizations
* Flat list of items 
 * Table, 
* Tree data structure
 * Treemap, radial tree
* Time aggregation
 * ..

* Doc
 * http://tenxer.github.io/xcharts/docs/#data
 * http://tenxer.github.io/xcharts/docs/#custom-vis-types


* Different types of datasets
 * **Items:** which are elements we want to visualize
 * **Properties:** which are the static properties of the items
 * **Attributes:** which are some none-static, non-universal properties
 * **Time-dependent:** attributes that change over time
 * Some of the properties are made for the visualization (e.g. product space)

Example with Colombia:
* Departments are items http://54.172.130.22/api/departments/
* International product space http://54.172.130.22/labs/data/atlas_international_product_space.json
* Attributes http://54.172.130.22/api/products/?aggregation=2digit

What to do with missing data over time?
* Depends on the type of data and the type of visualizations. For instance, time-based visualizations are more likely to fail if missing data for time point
 * Missing items
 * Missing attributes
 * Missing time points

* Then other properties, attributes, can be loaded on-demand and eventually be kept
 * How do we decide to get rid of some items/attributes/properties?

* Dynamically load data, lazy data loading

* Streaming data?
 * Some visualizations accumulate data, other only display most recent items

* Custom format for charts
 * e.g. `.total_bar({"prefix": "Export Value: $", "suffix": " USD", "format": ",f"})`

### States (TODO: discuss with QUINN)

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

* v0.1 Alpha (mid-April)
 * Fundamental visualizations
 * Basic interactions: filter, aggregate, time update, focus
 * Dev environment

* v0.2 Beta (mid-May)
 * Generic data format as input
 * Couple of more visualizations
 * Code testing and production format

* v0.3
 * States
 * Tested with API
 * Included in a real website

* Re-create standard examples from d3

 * Scatterplot http://bl.ocks.org/mbostock/3887118
 * Stacked graph http://bl.ocks.org/mbostock/4060954 and transition to [small multiples](http://bl.ocks.org/mbostock/9490516) and [here too](http://bl.ocks.org/mbostock/3885211)
 * Maps
 * Google maps
 * Choropleth map (using geojson)
 * Some flow map or graph such as [pivotgraph](http://bl.ocks.org/mbostock/4343153)
 

 * Diverging bar charts http://bl.ocks.org/wpoely86/e285b8e4c7b84710e463

* With utils
 * Labels http://bl.ocks.org/dbuezas/9306799
 * Color scale / legend (should contain the min/max values and min/max color range)
 * Time slider
 * Filters button
 * Title

* Templating visualizations
 * Standard interface to create them
 * Export: svg, png, .. (see [rasterize](http://cburgmer.github.io/rasterizeHTML.js/))

* Boilerplate code
 * Dev environment
 * Automate compilation
 * Testing (using Travis?)
 * Sample datasets we will be using
 * Consistent input file format


* Visual customization
 * Margin, padding, etc.
 * Number format. Font, font weight.



* UI elements for interaction
 * Either from the visualization itslef, or with auto-generated widgets
 * Binding with external buttons/widgets

* Visual manager 
* Initialize components constructors
* Use d3.dispatch and custom events for transimtions management
 * Example of event dispatch http://bl.ocks.org/mbostock/5872848

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
* Improved version https://javacrypt.wordpress.com/2012/12/15/improvements-to-d3s-reusable-component-pattern/
* Closure https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
* http://bocoup.com/weblog/introducing-d3-chart/

* https://blog.safaribooksonline.com/2013/07/11/reusable-d3-js-using-attrtween-transitions-and-mv/

* http://backstopmedia.booktype.pro/developing-a-d3js-edge/reusable-bar-chart/
* http://stackoverflow.com/questions/14665786/some-clarification-on-reusable-charts

* JS design patterns http://shichuan.github.io/javascript-patterns/
 * Most of the charts re-use the module design pattern 

* http://bocoup.com/weblog/reusability-with-d3/
* http://bocoup.com/weblog/introducing-d3-chart/

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
* Step by step widget http://nbremer.github.io/urbanization/
* Previous work on visual decomposition


Template
* See http://bost.ocks.org/mike/chart/
* See http://bost.ocks.org/mike/chart/time-series-chart.js


Annotations
* Linear regression lines http://www.highcharts.com/demo/combo-regression/grid
* Multiple layers (e.g. background with grid, ..)
* 

## Create a chart

We should be able to create a chart like that:

* `.id()` tells which attribute can be used as unique idenfifier for the data
 * `.id("country")` the `country` variable is going to be used
 * `.id(["continent", "country"])` the `country` is still the id, but `continent` may be used as a natural hierarchy


* `.time()` sets the current time variable and time point    
 * `.time({var_time: "year", current_time: 1995})`


### Table

* http://handsontable.com/demo/pagination.html#5
* https://github.com/mleibman/SlickGrid

* Efficient scrolling http://bl.ocks.org/jasondavies/3689677

### Treemap

```json
.type("tree_map")
.size("value")
.color(function(d){
  return color(d);
})
.text("name")
```

Create a tree structure 
* http://bl.ocks.org/d3noob/8329404
* http://www.d3noob.org/2014/01/tree-diagrams-in-d3js_11.html
* http://stackoverflow.com/questions/18017869/build-tree-array-from-flat-array-in-javascript

Other
* Treeemap ([with word wrap](http://bl.ocks.org/mundhradevang/1387786))

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

* http://techslides.com/demos/d3/d3-world-map-mouse-zoom.html
* https://github.com/yaph/d3-geomap/blob/master/src/coffee/choropleth.coffee
* http://d3-geomap.github.io/map/choropleth/world/

* Click and zoom on country http://techslides.com/d3-world-maps-tooltips-zooming-and-queue
 * http://stackoverflow.com/questions/14492284/center-a-map-in-d3-given-a-geojson-object
 * http://techslides.com/responsive-d3-map-with-zoom-and-pan-limits
 * Better projection http://bl.ocks.org/jasondavies/4188334

* Nice geo-maps https://www.pinterest.com/janwillemtulp/maps/

```json
.type("geo_map")
.text("text")

```
### Dot plot

* Horizontal or vertical dot plot (https://github.com/marmelab/EventDrops)
* http://www.education-inequalities.org/indicators/mlevel1/countries/kyrgyzstan#?dimension=wealth_quintile&group=all&age_group=|mlevel1_3&year=|2009


### Node link

* Test with curved links http://bl.ocks.org/mbostock/4600693

### Rankings

* Generic headers to re-sort regardless the data type
* Sticky headers
* Automatic generate time slider (find time boudaries)
* Auto generate list of filters (find unique classes)
* Aggregation/nesting (create nesting of data (construct_nest function)
* Custom filters (e.g. per capita, ..)

* Flags http://atlas.cid.harvard.edu/media/img/icons/flag_ago.png
* Communities http://atlas.cid.harvard.edu/media/img/icons/community_10.png

* Show the rank?

### Other charts

* Packing http://colinwhite.net/Packed%20Circle/index.html

* Parallel coordinates
* Bar chart
*

## Update a chart

```json
vis.render()
```

## Flexible chart creation

```json
vistk
  .items([“group”, “products”]) 
  .shape(“circle”)
  .connect(“line”, function(a, b) { a.source.id == b.source.id })
  .scale({“axis”: “x”, “type": “linear”, “x_var”: “population”})
  .scale({“axis”: “y”, “type": “linear”, “y_var”: “gdp”})
  .color({“category”, “color_var”: “group”})
```

# Refs

## Interactive environments

* http://uwdata.github.io/voyager/#/

## Reusable toolkits

* NVd3 - http://nvd3.org/ 
* C3.js - http://c3js.org/ 
* xCharts - http://tenxer.github.io/xcharts/ 
* Rickshaw - http://code.shutterstock.com/rickshaw/
* https://github.com/ndarville/d3-charts
