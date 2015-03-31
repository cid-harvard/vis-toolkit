# vis-toolkit


## Roadmap

* Re-create standard examples from d3
 * Treeemap ([with word wrap](http://bl.ocks.org/mundhradevang/1387786))
 * Scatterplot http://bl.ocks.org/mbostock/3887118
 * Stacked graph http://bl.ocks.org/mbostock/4060954 and transition to [small multiples](http://bl.ocks.org/mbostock/9490516)
 * Maps
 * Google maps
 * SVG geojson
 * Some flow map or graph such as [pivotgraph](http://bl.ocks.org/mbostock/4343153)
 * Horizontal or vertical dot plot
 * Rankings

* Boilerplate code
 * Dev environment
 * Automate compilation
 * Testing 

## What it should achieve

* Should be fast, kept simple
* Create multiple instances of visualizations on the same page
* Interactions: focus, selection, filter, aggregate, time change
* Customized visual design
* Default values should be coherent
* Extensible to add new functionalities
* Performances
* Testings
* Consistent input file
* Export: svg, png, ..
* Make sure it works for all types of data
* Animation but carefully used
* Dealing with missing data
* Text wrap for long names (see [d3plus word wrap](https://github.com/alexandersimoes/d3plus/wiki/Basic-Utilities#wordwrap))
* Guaranty that exported SVG will be correct
* Make components as reusable as possible (e.g. axis, ..)
* Customizable tooltips
* Capture state (and enable slide shows), enable loading at a specific state
* Dynamically load data, lazy data loading
* Some storytelling feature: step by step animation, etc.
* Callback once the loading is terminated
* Binding with external buttons/widgets
* Legend: should be informative on the mapping and the quantity of attributes, also actionable for filtering. Multiple selections should be allowed.
