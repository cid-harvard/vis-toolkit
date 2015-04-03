var vistk = window.vistk || {};
window.vistk = vistk;

vistk.version = "0.0.0.1";
vistk.dev = true;
vistk.utils = vistk.utils || {};

vistk.viz = function() {

	// Plenty of default params here
	// TODO: should we keep them?
  vars = {

    // PUBLIC (set by the user)
    "container" : "",
    "dev" : true,
    "id" : "id",
    "id_var" : "id",
    "group_var": "",
    "data"  : [],
    "year"  : 1995,
    "title": "",
    "solo": [],
    "nesting": null,
    "nesting_aggs": {},
    "type": "table",

    // PRIVATE (set automatically)

    // TABLE
    "columns": [],

    "accessor_year": function(d) { return d; }
  }

 // vars.parent = d3.select(vars.container);

  if (vars.dev) console.log("Init")

  // TODO: remove visualization
	// d3.select(vars.container).select("table").remove();

	if (!vars.data) vars.data = []

	// Constructor
	chart = function(selection) {	


    /* TODO

    -Should aggregate and filter happen here?
    -

  // AGGREGATE DATA
    if(vars.aggregate == 'continent') {

      vars.accessor_year = accessor_year_agg;

      // Do the nesting by continent
      nested_data = d3.nest()
        .key(function(d) { 
          return d.continent;
        })
        .rollup(function(leaves) {

          // Generates a new dataset with aggregated data
          return {
            "name" : leaves[0].continent,
            "continent": leaves[0].continent,
            "years": [{
              'population': d3.sum(leaves, function(d) {
                return accessor_year(d)['population'];
              }),
              'life_expectancy': d3.mean(leaves, function(d) {
                return accessor_year(d)['life_expectancy'];
              }),
              'gdp': d3.mean(leaves, function(d) {
                return accessor_year(d)['gdp'];
              }),
            }]
          }
        })
        .entries(agg_data);      

      // Transform key/value into values tab only
      agg_data = nested_data.map(function(d) { return d.values});
    }

    // FILTER DATA
    if(vars.filter.length > 0) {
      agg_data = agg_data.filter(function(d) {

          // We don't keep values that are not in the vars.filter array
          return vars.filter.indexOf(d["continent"]) > -1;
        })
    }


    */


    selection.each(function(data_passed) {

      if(vars.type == "undefined") {

        // Basic dump of the data we have
        d3.select(vars.container).append("span")
          .html(JSON.stringify(vars.data));

      } else if(vars.type == "table") {

        // If no column have been specified, take all columns

        vars.columns = d3.keys(vars.data[0])

        // Basic dump of the data we have
        create_table(vars.data)

        // Now update the table

        // ENTER

        // REMOVE

        // UPDATE

      } else if(vars.type == "treemap") {

        var width = vars.width,
        height = vars.height,
        color = d3.scale.category20c();

        var treemap = d3.layout.treemap()
            .padding(4)
            .size([width, height])
            .value(function(d) { return d.size; });

        var svg = d3.select(vars.container).append("svg")
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(-.5,-.5)");

        var cell = svg.data(vars.data).selectAll("g")
            .data(treemap.nodes)
          .enter().append("g")
            .attr("class", "cell")
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

        cell.append("rect")
            .attr("width", function(d) { return d.dx; })
            .attr("height", function(d) { return d.dy; })
            .style("fill", function(d) { return d.children ? color(d.name) : null; });

        cell.append("text")
            .attr("x", function(d) { return d.dx / 2; })
            .attr("y", function(d) { return d.dy / 2; })
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .text(function(d) { return d.children ? null : d.name; });


      } else if(vars.type == "scatterplot") {

        // Original scatterplot from http://bl.ocks.org/mbostock/3887118
        var margin = {top: 20, right: 150, bottom: 30, left: 40},
            width = 1060 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom;

        var x = d3.scale.linear()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var color = d3.scale.category10();

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var svg = d3.select("#viz").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var time_current = 0;

        var label = svg.append("text")
            .attr("class", "year label")
            .attr("text-anchor", "end")
            .attr("y", 124)
            .attr("x", 500)
            .text(time_current);

          x.domain([0, d3.max(vars.data, function(d) { return d3.max(d.years, function(e) { return e[vars.x_var]; }) })]).nice();
          y.domain([0, d3.max(vars.data, function(d) { return d3.max(d.years, function(e) { return e[vars.y_var]; }) })]).nice();

          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis)
            .append("text")
              .attr("class", "label")
              .attr("x", width)
              .attr("y", -6)
              .style("text-anchor", "end")
              .text("Countries Diversity");

          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("class", "label")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("Average number of countries making the same products")

          var gPoints = svg.selectAll(".points")
                          .data(vars.data)
                        .enter()
                          .append("g")
                          .attr("class", "points")
                          .attr("transform", function(d) {
                            return "translate("+x(d.years[time_current].nb_products)+", "+y(d.years[time_current].avg_products)+")";
                          })
                          .on("mouseenter",function(d, i) {

                            dots.style("opacity", .1)
                            labels.style("opacity", 0)          
                            d3.select(this).select("circle").style("opacity", 1)
                            d3.select(this).select("text").style("opacity", 1)
                          //  dragit.trajectory.display(d, i);

                          })
                          .on("mouseleave", function(d, i) {
                            dots.style("opacity", 1)
                            labels.style("opacity", 1)     
        //                    dragit.trajectory.remove(d, i)
                          })
                       //   .call(dragit.object.activate)

          var dots = gPoints.append("circle")
            .attr("r", 5)
            .attr("cx", 0)
            .attr("cy", 0)
            .style("fill", function(d) { return color(d.name); })

          var labels = gPoints.append("text")
              .attr("x", 10)
              .attr("y", 0)
              .attr("dy", ".35em")
              .style("text-anchor", "start")
              .text(function(d) { return d.name; });





      }

  	});

  }

  // Public Variables
  chart.id = function(x) {
    if (!arguments.length) return vars.id;
    vars.id = x;
    return chart;
  };

  chart.id_var = function(x) {
    if (!arguments.length) return vars.id_var;
    vars.id_var = x;
    return chart;
  };

  chart.year = function(x) {
    if (!arguments.length) return vars.year;
    vars.year = x;
    return chart;
  };

	chart.height = function(x) {
	  if (!arguments.length) return vars.height;
	  vars.height = x;
	  return chart;
	};

  chart.width = function(x) {
    if (!arguments.length) return vars.width;
    vars.width = x;
    return chart;
  };

  chart.container = function(x) {
    if (!arguments.length) return vars.container;
    vars.container = x;
    return chart;
  };

  chart.title = function(x) {
    if (!arguments.length) return vars.title;
    vars.title = x;
    return chart;
  };

  chart.type = function(x) {
    if (!arguments.length) return vars.type;
    vars.type = x;
    return chart;
  };

  chart.data = function(x) {
    if (!arguments.length) return vars.data;
    vars.data = x;
    return chart;
  };

	chart.solo = function(x) {
	  if (!arguments.length) return vars.solo;

	  if(x instanceof Array) {
	    vars.solo = x;
	  } else {
	    if(vars.solo.indexOf(x) > -1){
	      vars.solo.splice(vars.solo.indexOf(x), 1)
	    } else {
	      vars.solo.push(x)
	    }
	  }

	  return chart;
	};

  chart.group = function(x) {
    if (!arguments.length) return vars.group_var;
    vars.group_var = x;
    return chart;
  };

	chart.nesting = function(x) {
	  if (!arguments.length) return vars.nesting;
	  vars.nesting = x;
	  return chart;
	};

	chart.nesting_aggs = function(x) {
	  if (!arguments.length) return vars.nesting_aggs;
	  vars.nesting_aggs = x;
	  return chart;
	};

	chart.depth = function(x) {
	  if (!arguments.length) return vars.depth;
	  vars.depth = x;
	  return chart;
	};

	// RANKINGS
  chart.columns = function(x) {
    if (!arguments.length) return vars.columns;
    vars.columns = x;
    return chart;
  };

  // SCATTERPLOT
  chart.x_var = function(x) {
    if (!arguments.length) return vars.x_var;
    vars.x_var = x;
    return chart;
  };

  chart.y_var = function(y) {
    if (!arguments.length) return vars.y_var;
    vars.y_var = y;
    return chart;
  };

	if(vars.dev)   
		console.log("update", chart.year())

  return chart;
}

function row_data(row, i) {

  // Creates an array first of the size of the desired rows
  // Then fills the array with the appropriate data
  // Applies some formatting depending on the index of the column
  return vars.columns.map(function(column, i) {
    
    console.log( vars.accessor_year(row)[vars.columns[i]], i, vars.columns, row["group"], row[vars.columns[i]])

    if(i==0 || i==1) {

      return row[column];      

     } else if(i == 4) {

      var million_scale = 1;
      var population = vars.accessor_year(row)[vars.columns[i]];

      return d3.format(",")(population);//+d3.formatPrefix(million_scale).symbol;
    
     } else if(i == 3) {

      return parseFloat(vars.accessor_year(row)[vars.columns[i]]).toFixed(1);

    } else if(i == 2) {

      var gdp = vars.accessor_year(row)[vars.columns[i]];
      var million_scale = 1000000000;
      return d3.round(d3.formatPrefix(million_scale, 1).scale(gdp), 1)+d3.formatPrefix(million_scale).symbol;
    
    // Extra attribute that we manually added
    } else {

      return vars.year;

    }
  });
}

function create_table(data) {

    if(vars.debug) console.log("[create_table]");    

    var table = d3.select(vars.container).append("table"),
      thead = table.append("thead").attr("class", "thead");
      tbody = table.append("tbody");

    table.append("caption")
      .html(vars.title);

    thead.append("tr").selectAll("th")
      .data(vars.columns)
    .enter()
      .append("th")
      .text(function(d) { return d; })

      // Sorting function 
      .on("click", function(header, i) {

        click_header(header);
        paint_zebra_rows(tbody.selectAll("tr.row"));

      });

    var rows = tbody.selectAll("tr.row")
      .data(data)
    .enter()
      .append("tr")
      .attr("class", "row");

    var cells = rows.selectAll("td")
      .data(row_data)
      .enter()
      .append("td")
      .text(function(d) { return d; })
      .on("mouseover", function(d, i) {

        // Highlight the current row (which is a parent of the current cell)
        d3.select(this.parentNode)
          .style("background-color", "#F3ED86");
    
      }).on("mouseout", function() {

        // Reset highlight all the rows (not the cells)
        tbody.selectAll("tr")
          .style("background-color", null)

      });

  }