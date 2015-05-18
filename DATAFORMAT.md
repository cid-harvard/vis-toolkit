# Internal Data Format


## Time series (Line Chart, Sparkline)

* Data items properties are organized by time points (e.g. `date`).
* Each data items has multiple time points
* Years have a specific format e.g. `var parseDate = d3.time.format("%Y").parse`


```json
  {
    Date: "Dec 18, 2013", Close: "1084.75", date: Wed Dec 18 2013 00:00:00 GMT-0500 (EST), close: 1084.75
  }
```

TODO
* Line chart contains a mechanism to make sure there is no missing data
* Requires a function that flattens a file into the corret format
* How to 

## Items per year (Dot plot, ScatterPlot, Table)

* Each item and its properties are in the object
* Objects are duplicated for each year
* Code as id to exerternal reference

```json
  {
    dept_code: 5,
    sum(export_value): 0,
    value_added: 0,
    year: 2000
  }
```

TODO
* Split the object in two: dictionnary of items, and time-changing values

## Tree structure (Treemap)

* Right now is being done internally
* Each children has a reference to its children and parent

```json
  {
    area: 200332.1437138461
    children: [
      {
        area: 123,
        depth: 2
      }
    ],
    depth: 1,
    group: 8,
    name: "Unwrought tin",
    parent: Object,
    value: 464478170740.7,
    x: 558,
    y: 4,
    z: true,
  }
```

TODO
* Automate the nesting for the treemap
* Add links to parents

## Others

* Might need some specific structure for ring-like visualizations
* 
