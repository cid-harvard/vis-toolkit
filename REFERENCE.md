
## Reference

### `type`

Type of template being used for the visualization

#### Example

'barchart', "sparkline", "dotplot", "barchart", "linechart", "scatterplot", "grid", "stacked", "piechart", "slopegraph", "productspace", "treemap", "geomap", "stackedbar", "ordinal_vertical" "ordinal_horizontal".

#### Note

The list of all templates is available in ..


### `margin`

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

### var_id

The attribute being used to identify each item in the dataset.


#### Example


##### Note


### `var_group`

The variable use to create groups of items



#### Example 

Countries can be grouped by *continent*


### `time`

Makes a dataset temporal.

#### Format

```json
time: {
  var_time: 'year', 
  current_time: 2012,
  parse: function(d) { return d; }
}
```

### `items`



#### Templates and Mark properties

`var_color` is the attribute being used
`var_x` mapping to the x axis
`var_y` 'avg_products',

`var_sort` soring

`var_text` 'name',

### ui 

Specify which UI element to be used.

#### Format

```json
{
  default: true,
  options: ["country", "continent", "year"],
  sort: ['continent', "name", 'avg_products', 'nb_products']
}
```


### selection

Selected items

#### Example

["France"],


### `highlight`

Highlighted items

#### Example

["France", "Germany"]


