
# Reference

> Lists all the vistk parameters.

**Default:** Most default values are located in <a href='src/vars.js'>src/vars.js</a>

**Example:** Most examples are issued from the examples located in <a href='src/visualizations/'>src/visualizations/</a>.

**Note:** This is a work-in-progress.

## General

The following parameters that impact a whole chart, and will propagate to all the marks being drawn.

### `type`

> Type of template being used for the visualization.

The template includes 

**Default:** &empty;

**Example:** barchart, sparkline, dotplot, barchart, linechart, scatterplot, etc.

**Note:** The full list of templates is available in <a href='src/visualizations/'>src/visualizations/</a>.

To create a new template just add it in this folder and refer to it in the 

### `margin`

> Defines the margins for the chart within the SVG.

**Default:** Zero margin e.g. `{top: 0, right: 0, bottom: 0, left: 0}`

**Example:** `{top: 10, right: 10, bottom: 30, left: 30}`

**Note:** Follows the [D3 margin convention](http://bl.ocks.org/mbostock/3019563) for the sake of consistency with D3 examples.

### `container`

> The selector for the DOM element being used to append the visualization to.

**Default:** `#viz`

**Example:** `#viz`

**Note:** ..

#### `title`

> The title to use for the visualization (in case it features a space for the title)

**Default:**

**Example:**

**Note:** ..

### `var_color`

> Adds color to the chart using the specified attribute

**Example:** Continent grouping countries with the same color ([line chart](http://cid-harvard.github.io/vis-toolkit/examples/linechart.html)).

A custom function can be passed  `var_color: 'rank'` and `color: d3.scale.linear().domain([0, 123]).range(['red', 'blue'])`.

**Note:** Using the **color** parameter as color scale.

### `color`

> Color scale function used when drawing marks

**Default:** `d3.scale.category20c()`.

**Example:** Custom color scales can be created such as `d3.scale.ordinal().domain(["Africa", "Americas", "Asia", "Europe", "Oceania"]).range(["#99237d", "#c72439", "#6bc145", "#88c7ed", "#dd9f98"])`


### `var_text`

> Sets the variable when drawing text

**Default:**  &empty;

**Example:**

**Note:** Not all graphical marks contain text to be displayed.


## Data

All parameters related to making vistk aware of the semantic of the dataset.

### `data`

> The dataset to be used across all the visualizations.

An `item` is a row in the dataset and should be identified by a unique `id` set with **var_id**. By default, if no `id` exist, it will automatically create one using the index of each raw and set the `var_id` parameter to the `__id` attribute.<br>

**Default:** []

**Example:** `[0, 1, 2, 3]` with no item `id`, or `[{id: 0, value: 10}, {id: 1, value: 20}, {id: 2, value: 30}, {id: 3, value: 40}]` with `id` as **var_id**.

**Note:** If no id in the dataset, then it considers each rows as an item and creates a `var__id` attribute which value is the index of the row.

`aggregated` data are appended to the original dataset with a `__aggregated` attribute set to true. This means those two datasets will co-habit together.

### `var_id`

> The attribute being used to identify each item in the dataset.

**Default:** `__id`

**Example:** 

Note: The `__id` is automatically created in case no `var_id` is set.

### `var_group`

> The variable to be used to create groups of items

**Default:**  &empty;

**Note:** Right now, only one level of hierarchy is provided.

**Example:** Countries can be grouped by *continent*

### `set`

> Creates custom variables when instantiating the chart

**Default:**  &empty;

**Example:** `.set('aggregated', true)` creates aggregates data with a `__aggregated` set to true

**Note:** ..


### `x_scale`

### `y_scale`


## Items and Connect Marks

A chart is made of items and connect marks that will enable to create complex charts.

### `items`

>

**Default:**

**Example:**

**Note:**

* `title` property allows to create a new element to show tooltips

### `items.marks`

>

**Default:**

**Example:**

**Note:** ..

**Default:**

### `items.marks.type`

> The type of the graphical mark

**Default:**

**Example:**

**Note:** Can be a function


### `connect`



## Time

### `time`

> If set, informs a dataset into a temporal.

#### Format

```html
time: {
  var_time: 'year', 
  current_time: 2012,
  parse: function(d) { return d; }
}
```

**Default:**

**Note:** The `current_time` can defined to a specific value, or be set using `vistk.utils.min` which is a public function to retrieve



## UI

### `ui`

> Specify which UI element to be used.

#### Format

```js
{
  default: true,
  options: ["country", "continent", "year"],
  sort: ['continent', "name", 'avg_products', 'nb_products']
}
```

### `selection`

> Selected items, which differ from the highlight as tt is more persitent

**Example:** If using the ['France'].

**Default:** []

### `highlight`

> Highlighted items

**Example:** If using the countries dataset `["France", "Germany"]`

**Default:** `[]`

**Note:** Values are defined according to the `var_id` parameter





## Utils

A list of public functions made available mostly to be used by the parameters.

### `vistk.utils.min`

> Returns the min value

**Default:**

**Example:**

**Note:** ..


### `vistk.utils.max`

> Returns the max value

**Default:**

**Example:**

**Note:** ..


### `vistk.utils.translate_along`

> Transition between item and connect marks

**Default:**

**Example:**

**Note:** ..

### `utils.draw_mark`

> Draws a mark

**Default:**

**Example:**

**Note:** ..
