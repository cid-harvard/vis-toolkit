# vis-toolkit


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
 * Create time slider
 * Create filters button

* Templating visualizations
 * Standard interface to create them
 * Consider states issues later on 
 * Export: svg, png, ..
 * 
* Boilerplate code
 * Dev environment
 * Automate compilation
 * Testing (using Travis)
 * Performances (included in unit testing?)
 * Sample datasets we will be using
 * Consistent input file


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
* Some storytelling feature: step by step animation, etc.
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


