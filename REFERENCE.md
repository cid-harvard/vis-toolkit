
# Reference




## Global

### `type`

> Type of template being used for the visualization.

**Default:** 'none'

**Example:** barchart, sparkline, dotplot, barchart, linechart, scatterplot, grid, stacked, piechart, slopegraph, productspace, treemap, geomap, stackedbar, ordinal_vertical, ordinal_horizontal.

**Note:** The list of all templates is available in `src/visualizations/`

### `margin`

> Defines the margins for the chart within the SVG

**Default:** No margins `{top: 0, right: 0, bottom: 0, left: 0}`

**Example:** `{top: 10, right: 10, bottom: 30, left: 30}`

**Note:** Follows the [D3 margin convention](http://bl.ocks.org/mbostock/3019563)

### `container`

> The selector for the DOM element being used to append the visualization to

**Default:** `#viz`

**Example:** `#viz`

**Note:** ..

#### `title`

> The title to use for the visualization (in case it features a space for the title)

**Default:**

**Example:**

**Note:** ..







## Data

### `data`

> The dataset being used.

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

**Default:** none

**Note:** Right now, only one level of hierarchy is provided.

**Example:** Countries can be grouped by *continent*

### `set`

> Creates custom variables when instantiating the chart

**Default:** none

**Example:** `.set('aggregated', true)` creates aggregates data with a `__aggregated` set to true

**Note:** ..

## Items and Connect

### `items`

>

**Default:**

**Example:**

**Note:** ..


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



#### Templates and Mark properties

`var_color` is the attribute being used
`var_x`     mapping to the x-axis
`var_y`     mapping to the y-axis
`var_sort`  soring
`var_text`  



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

