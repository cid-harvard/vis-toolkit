# vis-toolkit

The **vis-toolkit** is a collection of visualization templates (line chart, treemap, etc.) using **D3**. Its goal is to render visualizations quickly, with a simple interface that can be used across various templates. Right now the goal it to make those charts work, In the future, goals will be cleaning code and make it faster, and also to:

* Allow complex charts composition using reusable components
* Enable storytelling with step by step display and annotations
* Provide transitions between visualizations in a generic and efficient way

One of the fundamental design idea of the toolkit is to consider each element to display as **items** (e.g. countries, users of a social network). Those items are usually rows of a dataset. They will be bound to graphical marks, sometimes after some preprocessing (e.g. a line chart represents the same item, but over multiple time points). Each item is visually encoding using **dimensions** (e.g. population, gdp). Each item's dimensions can be updated over **time**.

Each visualization should implement the following set of interactions: 

* `.highlight()` highlights an item like if a `mouseover` event had been triggered on the item. Only one item can be highlighted at a time. Highlight is removed once a `mouseout` event is triggered or another `mouseover` event

* `.focus()` is a more persistent form of highlight, triggered after a `click` event. Multiple elements can be focused at the same time. Another `click` allows the removal from the current set of focused items.

* `.selection()` selects a group of items. Each selection can be differentiated from another one with a visual encoding, such as color.

* `.filter()` removes items based on a similar attribute (e.g. defined by a `.group()`)

* `.aggregate()` groups items sharing an attribute

* `.time()` changes the current time point

## Usage

Simply add the `vistk` JavaScript and CSS files as below:

```html
<link href="vistk.css" rel="stylesheet">
<script src="vistk.js"></script>
```

### Dependencies

* **D3** version `3.4.10` (not tested with other versions, but no reason why not)
* Eventually some `topojson.js`, `queue.js` dependencies for the geomap
* Also relies on world shape files for maps (should be avoided in the future?)

## Examples

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

## Tests

* Should provide a series of tests (client or server)
* Using releveant datasets in terms of size, number of attributes, missing data, etc.
 * http://jonsadka.com/blog/how-to-create-live-updating-and-flexible-d3-line-charts-using-pseudo-data/
* Unit testings
 * Cross Browser Compatibility
 * Cross Device Compatibility
 * Use strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode


* Build your own graph environment
 * Using an editor (see existing rich text edit envs http://ace.c9.io/#nav=about)
 * Build your own grid
 * Customize charts interactively
 * Derive values? E.g. active or not for the rca value

## Data Management (TODO: discuss with QUINN)

### Input Format

* Which format should be used as input?
 * Most likely a flat file that can easily filtered
 * Might be larger than a complex/nested structure, but easier to process
* How to detect items? rows?
* How to deal with trees?
 * Again a flat file and then connecting/aggregating might do the job


* Flat list of items 
 * Table, 
* Tree data structure
 * Treemap, radial tree

Time data

* Used to draw one line of the Sparkline

`{Date: "Dec 18, 2013", Close: "1084.75", date: Wed Dec 18 2013 00:00:00 GMT-0500 (EST), close: 1084.75}
{Date: "Dec 17, 2013", Close: "1069.86", date: Tue Dec 17 2013 00:00:00 GMT-0500 (EST), close: 1069.86}
`
 * Time should have been parsed
 * What about missing values?

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

 * https://github.com/mozilla/metrics-graphics/blob/34e56c4a387940c3e5e58a458062389a8110c4e5/src/js/misc/process.js#L93


* Then other properties, attributes, can be loaded on-demand and eventually be kept
 * How do we decide to get rid of some items/attributes/properties?

* Dynamically load data, lazy data loading

* Streaming data?
 * Some visualizations accumulate data, other only display most recent items

* Custom format for charts
 * e.g. `.total_bar({"prefix": "Export Value: $", "suffix": " USD", "format": ",f"})`


## How to create a new chart

* What is the interface? Options are:
 * Object inheritance
 * Create a list of pre-defined visualization
 * Implement a specific interface (à la d3plus)
* What should be reused or not?
* How to define the transitions to other apps?

## Chart 

1. Data wrangling
 * Standard structure
 * Temporal data structure
 * Tree creation

2. Data processing
 * Filter
 * Aggregate
 * Time update

3. Merging with other datasets
 * Attributes (e.g. color)
 * Structure for visualization (e.g. graph)

4. Create the visualization
 * Layers
 * Highlight
 * Focus on element
 * Show selection of elements
 * Aggregation of elements
 * Show filtered out data

## UI widgets



## Roadmap

* v0.1 Alpha (mid-April)
 * Fundamental visualizations
 * Basic interactions: filter, aggregate, time update, focus
 * Dev environment

* v0.2 Beta (mid-May)
 * Generic data format as input
 * Couple of more visualizations
 * Code testing and production deployement

* v0.3
 * States
 * Fully tested with API
 * Included in a real website

## Visualizations

### Lists of visualizations

* http://annkemery.com/essentials/
* d3js.org

* Stacked graph http://bl.ocks.org/mbostock/4060954 and transition to [small multiples](http://bl.ocks.org/mbostock/9490516) and [here too](http://bl.ocks.org/mbostock/3885211)
 
* Circles maps http://bl.ocks.org/curran/752b97cef3f880a813ab


* Choropleth map (using geojson)
* Some flow map or graph such as [pivotgraph](http://bl.ocks.org/mbostock/4343153)

 * Rings
  * http://bl.ocks.org/bansaghi/e490c7c238a67a77996d 

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
 * Teaching / demos / snippets http://tributary.io/inlet/4653053
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
 * Customizable tooltips (d3plus.tooltip.create()) http://bl.ocks.org/tgk/6044254

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
* Vertical scrolling support? 
 * [graph-scroll](http://1wheel.github.io/graph-scroll/)
 * Another use of graph scroll http://emeeks.github.io/gestaltdataviz/section4.html
* See [Miso project](https://github.com/misoproject/storyboard)
* Step by step widget http://nbremer.github.io/urbanization/
* Previous work on visual decomposition

Template
* See http://bost.ocks.org/mike/chart/
* See http://bost.ocks.org/mike/chart/time-series-chart.js

Annotations
* Linear regression lines http://www.highcharts.com/demo/combo-regression/grid
* Multiple layers (e.g. background with grid, ..)

## Create a chart

We should be able to create a chart like that:

* `.id()` tells which attribute can be used as unique idenfifier for the data
 * `.id("country")` the `country` variable is going to be used
 * `.id(["continent", "country"])` the `country` is still the id, but `continent` may be used as a natural hierarchy

* http://trifacta.github.io/vega/editor/ loads the data with a specific variable for each dataset
 *  "data": [{"name": "jobs"}, "url": "data/jobs.json"}]
 * 

* `.time()` sets the current time variable and time point    
 * `.time({var_time: "year", current_time: 1995})`

* `.type(type)` 

### Table

* http://handsontable.com/demo/pagination.html#5
* https://github.com/mleibman/SlickGrid

* Efficient DOM handling http://nexts.github.io/Clusterize.js/

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

Text wrap
* http://bl.ocks.org/mbostock/7555321

Other
* Treeemap ([with word wrap](http://bl.ocks.org/mundhradevang/1387786))

### Rankings

```json
.type("rankings")
.cols(["A", "B", "C"])
.order()
```

### Line chart

* 

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

### Scatterplot

* Scatterplot http://bl.ocks.org/mbostock/3887118


### Dot plot

* Horizontal or vertical dot plot (https://github.com/marmelab/EventDrops)
* http://www.education-inequalities.org/indicators/mlevel1/countries/kyrgyzstan#?dimension=wealth_quintile&group=all&age_group=|mlevel1_3&year=|2009


### Matrix

* http://bost.ocks.org/mike/miserables/

### Scatterplot Matrix

* http://bl.ocks.org/mbostock/4063663

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
 * http://bl.ocks.org/syntagmatic/42d5b54c5cfe002e7dd8
* Bar chart

Listing of charts
* http://www.niceone.org/infodesignpatterns/index.php5#/patterns.php5

TODO: investigate the charts genealogy/reusable componants

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

* Automatic generation of charts http://uwdata.github.io/voyager/#/

## Existing D3 toolkits

* NVd3 - http://nvd3.org/ 
* C3.js - http://c3js.org/ 
* xCharts - http://tenxer.github.io/xcharts/ 
* Rickshaw - http://code.shutterstock.com/rickshaw/
* D3 Charts - https://github.com/ndarville/d3-charts
* Metrics Graphics - http://metricsgraphicsjs.org/interactive-demo.htm
* Vega - https://github.com/trifacta/vega
