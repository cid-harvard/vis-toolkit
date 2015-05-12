# vis-toolkit

The **vis-toolkit** is a collection of visualization templates (line chart, treemap, etc.) using **D3**. Its goal is to render visualizations quickly, with a simple interface that can be used across various templates. Right now the goal it to make those charts work. In the future, goals will be cleaning code and make it faster, and also to:

* Allow complex charts composition using reusable components
* Enable storytelling with step by step display and annotations
* Provide transitions between visualizations in a generic and efficient way

One of the fundamental design idea of the toolkit is to consider each element to display as **items** (e.g. countries, products). Items are usually rows of a dataset, and their properties the columns or **dimensions** (e.g. population, gdp), which can be updated over time. Items will be bound to graphical marks, sometimes after some preprocessing (e.g. a line chart represents the same item, but over multiple time points). And the graphical marks properties encode the dimensions. Each item's dimensions can be updated over **time** and consequently updates the graphical mark and its properties.

Each visualization should implement the following set of interactions: 

* `.highlight()` highlights an item like if a `mouseover` event had been triggered on the item. Only one item can be highlighted at a time. Highlight is removed once a `mouseout` event is triggered or another `mouseover` event

* `.selection()` is a more persistent form of highlight, triggered after a `click` event. Multiple elements can be focused at the same time. Another `click` allows the removal from the current set of focused items.

The above selections do not change the data. The ones below do but do not add any:

* `.filter()` removes items based on a similar attribute (e.g. defined by a `.group()`)

* `.time()` changes the current time point

Finally, the ones below add new data (usually derived from existing data):

* `.aggregate()` groups items sharing an attribute

## Usage

Simply add the `vistk` JavaScript and CSS files as below:

```html
<link href="vistk.css" rel="stylesheet">
<script src="vistk.js"></script>
```

Look a the [various examples](http://cid-harvard.github.io/vis-toolkit/examples/) for more details on using the toolkit.

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

Re-creation of standard examples

* Anscombe quartet ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/anscombe.html)
* Gapminder
* 

## Data Management

### Input Format

* Look at data transform options https://github.com/trifacta/vega/wiki/Data-Transforms

* Flat list of items 
 * Table, 
* Tree data structure
 * Treemap, radial tree

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

Data-driven UI widgets
* Filter
* Aggregate
* Time update

* Show highlighted element
* Show selected elements + reset

* Charts options such as to change the type of scale (absolute vs relative)

* Either from the visualization itself, or with auto-generated widgets
* Binding with external buttons/widgets


## Utils for visualization

* http://bl.ocks.org/dbuezas/9306799

* Infer data type from data http://uwdata.github.io/datalib/
* http://www.macwright.org/simple-statistics/
* https://github.com/alexandersimoes/d3plus/wiki/Utilities

* Visual manager 
* Initialize components constructors
* Use d3.dispatch and custom events for transimtions management
 * Example of event dispatch http://bl.ocks.org/mbostock/5872848


Annotations
* Linear regression lines http://www.highcharts.com/demo/combo-regression/grid
* Multiple layers (e.g. background with grid, ..)
* Markers http://metricsgraphicsjs.org/interactive-demo.htm

Labels
* http://bl.ocks.org/dbuezas/9306799


Legends
 * Color scale / legend (should contain the min/max values and min/max color range)
 * Should take the visual mapping as input and automatically generate it

## Customization

* Margin, padding, etc.
* Number format. Font, font weight.

Mostly done using the `.params()` helper

* Customized visual design
 * Default CSS but should allow this to be overloaded


## Visualizations

Below is the list of currently implemented visualizations and list of upcoming ones.

### Table

* Countries table ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/table.html) | [Source](examples/table.html))

* Using pagination http://handsontable.com/demo/pagination.html#5
* https://github.com/mleibman/SlickGrid



* Efficient DOM handling do progressively display a lot of elements http://nexts.github.io/Clusterize.js/

* Another efficient way of scrolling rows http://bl.ocks.org/jasondavies/3689677


Readings

* http://vis4.net/blog/posts/making-html-tables-in-d3-doesnt-need-to-be-a-pain/

### Rankings

Instance of a table, plus some ordering features:

* Generic headers to re-sort regardless the data type
* Sticky headers
* Automatic generate time slider (find time boudaries)
* Auto generate list of filters (find unique classes)
* Aggregation/nesting (create nesting of data (construct_nest function)
* Custom filters (e.g. per capita, ..)

* Flags http://atlas.cid.harvard.edu/media/img/icons/flag_ago.png
* Communities http://atlas.cid.harvard.edu/media/img/icons/community_10.png

* Show the rank?



### Treemap


Requires a tree structure 
* http://bl.ocks.org/d3noob/8329404
* http://www.d3noob.org/2014/01/tree-diagrams-in-d3js_11.html
* http://stackoverflow.com/questions/18017869/build-tree-array-from-flat-array-in-javascript

Text wrap
* Done using HTML elements http://bl.ocks.org/mbostock/7555321
* Another treeemap with word wrap http://bl.ocks.org/mundhradevang/1387786


### Line chart

* [Line Chart with countries](http://cid-harvard.github.io/vis-toolkit/examples/linechart.html) | [Source](examples/linechart.html))

* Should have bins for each time point (as an option)


#### Sparkline

Line chart without any decoration (e.g. axis, ..) and that primarily show one item at a time.

* Sparkline ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/sparkline.html) | [Source](examples/sparkline.html))

* Should be able to display two or more items (as comparison)

* Example using angular.js http://bl.ocks.org/enjalot/6457608

### Geo map

Map of countries that can be colored and labeled.

* Geo Map ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/geomap.html) | [Source](examples/geomap.html))

* http://techslides.com/demos/d3/d3-world-map-mouse-zoom.html
* https://github.com/yaph/d3-geomap/blob/master/src/coffee/choropleth.coffee
* http://d3-geomap.github.io/map/choropleth/world/

* Click and zoom on country http://techslides.com/d3-world-maps-tooltips-zooming-and-queue
 * http://stackoverflow.com/questions/14492284/center-a-map-in-d3-given-a-geojson-object
 * http://techslides.com/responsive-d3-map-with-zoom-and-pan-limits
 * Better projection http://bl.ocks.org/jasondavies/4188334

* Nice geo-maps https://www.pinterest.com/janwillemtulp/maps/

* Circles maps http://bl.ocks.org/curran/752b97cef3f880a813ab

* Choropleth map (using geojson)
* Some flow map or graph such as [pivotgraph](http://bl.ocks.org/mbostock/4343153)

* Hex tiles http://blog.apps.npr.org/2015/05/11/hex-tile-maps.html

### Scatterplot

* Scatterplot http://bl.ocks.org/mbostock/3887118


#### Dot plot

Horizontal scatterplot without a Y-axis:

* Horizontal or vertical dot plot (https://github.com/marmelab/EventDrops)
* http://www.education-inequalities.org/indicators/mlevel1/countries/kyrgyzstan#?dimension=wealth_quintile&group=all&age_group=|mlevel1_3&year=|2009

* Dot chart http://bl.ocks.org/nrabinowitz/2034281


#### Bubble plot 

### Matrix

An array with rows and columns.

* http://bost.ocks.org/mike/miserables/


### Scatterplot Matrix

Combination of a matrix with nested scatterplots within each cell. The matrix being the cross product of the dimensions to represent.

* http://bl.ocks.org/mbostock/4063663


### Node link

* Node-Link ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/nodelink.html) | [Source](examples/nodelink.html))

* Test with curved links http://bl.ocks.org/mbostock/4600693

* Rings http://bl.ocks.org/bansaghi/e490c7c238a67a77996d 

* Self-organized Packing http://colinwhite.net/Packed%20Circle/index.html

 * Zoom to bounding box http://bl.ocks.org/mbostock/4699541

### Bar chart

* http://bl.ocks.org/mbostock/3885304

* Diverging bar charts http://bl.ocks.org/wpoely86/e285b8e4c7b84710e463


#### Histogram

Just some kind of bar chart combined with a binning function

* Histogram with line chart overlay


### Stacked Graph

Area chart with stacked shapes on top of each other (the previous layer being the Y-offset for the next layer).

* Stacked graph http://bl.ocks.org/mbostock/4060954 

* Transition to [small multiples](http://bl.ocks.org/mbostock/9490516) and [here too](http://bl.ocks.org/mbostock/3885211)


### Parallel Coordinates

* Parallel coordinates http://bl.ocks.org/syntagmatic/42d5b54c5cfe002e7dd8


### Other charts

Listing of charts
* http://www.niceone.org/infodesignpatterns/index.php5#/patterns.php5
* http://annkemery.com/essentials/
* http://www.d3js.org/


## Roadmap

* v0.1 Alpha
 * Fundamental visualizations
 * Basic interactions: filter, aggregate, time update, focus
 * Dev environment

* v0.2 Beta
 * Generic data format as input
 * Couple of more visualizations
 * Code testing and production deployment

* v0.3
 * States
 * Fully tested with API
 * Included in a real website

* Tests
 * Should provide a series of tests (client or server)
 * Using releveant datasets in terms of size, number of attributes, missing data, etc.
  * http://jonsadka.com/blog/how-to-create-live-updating-and-flexible-d3-line-charts-using-pseudo-data/
 * Unit testings
  * Cross Browser Compatibility
  * Cross Device Compatibility
  * Use strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode

* Build your own graph environment
 * Using an editor 
  * Rich text edit envs http://ace.c9.io/#nav=about
  * http://trifacta.github.io/vega/editor/index.html?spec=barley
  * Teaching / demos / snippets http://tributary.io/inlet/4653053
 * Build your own grid
 * Customize charts interactively
 * Derive values? E.g. active or not for the rca value

* Misc
 * Automate compilation
 * Testing (using Travis?)
 * Sample datasets we will be using
 * Consistent input file format
 * Possibility to customize rendering: svg, png, .. (see [rasterize](http://cburgmer.github.io/rasterizeHTML.js/))

* Should be fast (e.g. only requires attributes to be loaded once)
 * More importantly: we should be able to measure the performances
 * Benchmark with other toolkits for similar visualizations
* Able to create multiple instances of visualizations on the same page
 * And eventually coordinate them (e.g brushing one filters another one)
 * Should also share some similar attributes/properties

* Default values should be coherent
 * Default parameters
 * Especially when transitioning
 * Enable minimal set of parameters to begin with

* Make sure it works for all types of data
 * But should make sure an input format has been defined
 * Dealing/robust even with missing data
 * Should be visually reflected too

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
 
Interesting reading on D3 modular/reusable

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
 * Controlled by external widgets
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
* Allow click on text to update the chart http://square.github.io/crossfilter/

Template
* See http://bost.ocks.org/mike/chart/
* See http://bost.ocks.org/mike/chart/time-series-chart.js


# Refs / External Resources

## Interactive environments

* Automatic generation of charts http://uwdata.github.io/voyager/#/
* https://vnijs.shinyapps.io/marketing/?SSUID=905c430fe9e124989ee1a1c8557041d5

## Existing D3 toolkits

* NVd3 - http://nvd3.org/ 
* C3.js - http://c3js.org/ 
* xCharts - http://tenxer.github.io/xcharts/ 
* Rickshaw - http://code.shutterstock.com/rickshaw/
* D3 Charts - https://github.com/ndarville/d3-charts
* Metrics Graphics - http://metricsgraphicsjs.org/interactive-demo.htm
* Vega - https://github.com/trifacta/vega
* Visible - http://visible.io/examples.html