# ROADMAP

* Implement more basic [chart types](http://www.excelcharts.com/blog/classification-chart-types/).
* Polish existing examples
* Create more cross overs

## Upcoming versions

0.0.3
* Fix treemap blank squares #3


0.0.4
* Aggregation for treemap
* Highlight product space links when node is highlighted
* Filter product space links
* Fix table ([Demo](http://cid-harvard.github.io/vis-toolkit/examples/table.html) | [Source](examples/table.html))

0.0.5
* Fix geo map
* Fix transition geo map to grid

0.1

* Chart nesting function
* Views (aka a mechanism to duplicate items)
* Testing: non-regression, performances, .. and fully automated
* Custom `group by` function

0.2

* Create a [show reel](http://cid-harvard.github.io/vis-toolkit/examples/stepper_all.html) similar to [D3 show reel](http://bl.ocks.org/mbostock/1256572) to demonstrate transitions between charts



## TODO

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
  * Example using Vega http://bl.ocks.org/timelyportfolio/5342818
  * Teaching / demos / snippets http://tributary.io/inlet/4653053
 * Build your own grid
 * Customize charts interactively
 * Derive values? E.g. active or not for the rca value

* Misc
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

* Tooltips
 * Customizable tooltips (d3plus.tooltip.create()) http://bl.ocks.org/tgk/6044254
 * http://bl.ocks.org/d3noob/c37cb8e630aaef7df30d
 * http://bl.ocks.org/rveciana/5181105
 * http://bl.ocks.org/bobmonteverde/2070123

* Callback once the loading is terminated
 * This is quite tricky as many things are pending
 * enter, update and exit
 * Other transitions (e.g. attrTween)
 * Other custom transitions, physical simulation, etc.
 * Dispatching other events
