
## Reference

### `type`

> Type of template being used for the visualization

Default: 'none'

Ex: barchart, sparkline, dotplot, barchart, "linechart", "scatterplot", "grid", "stacked", "piechart", "slopegraph", "productspace", "treemap", "geomap", "stackedbar", "ordinal_vertical" "ordinal_horizontal".


The list of all templates is available in


### `margin`

> Defines



 {top: 10, right: 10, bottom: 30, left: 30}

### `container`


#### default

'#viz'

#### title


### `data`

The dataset being used.

An `item` is a row in the dataset and should be identified by a unique `id` set with **var_id**. By default, if no `id` exist, it will automatically create one using the index of each raw and set the `var_id` parameter to the `__id` attribute.<br>

##### Example

`[0, 1, 2, 3]` with no item `id`, or `[{id: 0, value: 10}, {id: 1, value: 20}, {id: 2, value: 30}, {id: 3, value: 40}]` with `id` as **var_id**.

##### Default

`{}`

##### Note

If no id in the dataset, then it considers each rows as an item and creates a `var__id` attribute which value is the index of the row.

`aggregated` data are appended to the original dataset with a `__aggregated` attribute set to true. This means those two datasets will co-habit together.

### `var_id`

The attribute being used to identify each item in the dataset.


#### Example


#### Note


### `var_group`

The variable use to create groups of items


#### Example 

Countries can be grouped by *continent*


### `time`

Makes a dataset temporal.

#### Format

```html
time: {
  var_time: 'year', 
  current_time: 2012,
  parse: function(d) { return d; }
}
```

#### Default

No time is given

The `current_time` can defined to a specific value, or be set using `vistk.utils.min` which is a public function to retrieve

### `items`



#### Templates and Mark properties

`var_color` is the attribute being used
`var_x`     mapping to the x-axis
`var_y`     mapping to the y-axis
`var_sort`  soring
`var_text`  

### `ui`

Specify which UI element to be used.

#### Format

```js
{
  default: true,
  options: ["country", "continent", "year"],
  sort: ['continent', "name", 'avg_products', 'nb_products']
}
```

### `selection`

Selected items, which differ from the highlight as tt is more persitent.

#### Example

["France"]


### `highlight`

Highlighted items

#### Example

["France", "Germany"]

#### Default

### `set`

Creates custom variables when instantiating the chart

#### Example

`.set('aggregated', true)` creates aggregates data with a `__aggregated` set to true


# Utils

A list of public functions


### `vistk.utils.min`

Returns the min value

### `vistk.utils.max`

Returns the max value

### `vistk.utils.translate_along`

Transition between item and connect marks

