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
    container : "",
    dev : true,
    id : "id",
    id_var : "id",
    group_var: null,
    data: [],
    year: null,
    title: "",
    solo: [],
    nesting: null,
    nesting_aggs: {},
    type: "table",

    filter: [],

    width: 1000,
    height: 600,

    margin: {top: 20, right: 150, bottom: 30, left: 40},

    time_current: 0,

    // PRIVATE (set automatically)

    // TABLE
    columns: [],
    color: d3.scale.category20c(),
    accessor_year: function(d) { return d; },
    svg: null,
  }


 // vars.parent = d3.select(vars.container);

  if (vars.dev) console.log("Init")

  // TODO: remove visualization
	// d3.select(vars.container).select("table").remove();

	if (!vars.data) vars.data = []

	// Constructor
	chart = function(selection) {	

    if(!vars.svg) {
     
      vars.svg = d3.select(vars.container).append("svg")
          .attr("width", vars.width)
          .attr("height", vars.height)
        .append("g")
          .attr("transform", "translate(-.5,-.5)");

      vars.width = vars.width - vars.margin.left - vars.margin.right;
      vars.height = vars.height - vars.margin.top - vars.margin.bottom;

    }

    new_data = vars.data;

    // FILTER DATA
    if(vars.filter.length > 0) {
      new_data = new_data.filter(function(d) {
          // We don't keep values that are not in the vars.filter array
          return vars.filter.indexOf(d["continent"]) > -1;
        })
    }

    // AGGREGATE DATA
    if(vars.aggregate == 'continent') {

      accessor_year = vars.accessor_year;

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
              'avg_products': d3.sum(leaves, function(d) {
                return accessor_year(d).years[0]['avg_products'];
              }),
              'nb_products': d3.mean(leaves, function(d) {
                return accessor_year(d).years[0]['nb_products'];
              }),
            }]
          }
        })
        .entries(new_data);      

      // Transform key/value into values tab only
      new_data = nested_data.map(function(d) { return d.values});
    }

    selection.each(function() {
    
      if(vars.type == "undefined") {

        // Basic dump of the data we have
        d3.select(vars.container).append("span")
          .html(JSON.stringify(vars.data));

      } else if(vars.type == "table") {


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


        // If no column have been specified, take all columns

        vars.columns = d3.keys(vars.data[0])

        // Basic dump of the data we have
        create_table(vars.data)

        // Now update the table

        // ENTER

        // REMOVE

        // UPDATE

      } else if(vars.type == "treemap") {

        var treemap = d3.layout.treemap()
            .padding(4)
            .size([vars.width, vars.height])
            .value(function(d) { return d.size; });

        var cell = vars.svg.data(vars.data).selectAll("g")
            .data(treemap.nodes)
          .enter().append("g")
            .attr("class", "cell")
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

        cell.append("rect")
            .attr("width", function(d) { return d.dx; })
            .attr("height", function(d) { return d.dy; })
            .style("fill", function(d) { return d.children ? vars.color(d.name) : null; });

        cell.append("text")
            .attr("x", function(d) { return 10; })
            .attr("y", function(d) { return 10; })
            .attr("dy", ".35em")
            .attr("text-anchor", "left")
            .text(function(d) { return d.children ? null : d.name; })
           // .call(wrap)

      } else if(vars.type == "scatterplot") {

        // Original scatterplot from http://bl.ocks.org/mbostock/3887118

        var x = d3.scale.linear()
            .range([0, vars.width]);

        var y = d3.scale.linear()
            .range([vars.height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        vars.svg.selectAll(".label").data(new_data).enter().append("text")
            .attr("class", "year label")
            .attr("text-anchor", "end");

        vars.svg.selectAll(".label")    
            .attr("y", 124)
            .attr("x", 500)
            .text(vars.time_current);

          x.domain([0, d3.max(new_data, function(d) { return d3.max(d.years, function(e) { return e[vars.x_var]; }) })]).nice();
          y.domain([0, d3.max(new_data, function(d) { return d3.max(d.years, function(e) { return e[vars.y_var]; }) })]).nice();

          vars.svg.selectAll(".x.axis").data([new_data]).enter().append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + (vars.height-vars.margin.bottom) + ")")              
            .append("text")
              .attr("class", "label")
              .attr("x", vars.width)
              .attr("y", -6)
              .style("text-anchor", "end")
              .text("Countries Diversity");

          vars.svg.selectAll(".y.axis").data([new_data]).enter().append("g")
              .attr("class", "y axis")
              .attr("transform", "translate("+vars.margin.left+", 0)")              
            .append("text")
              .attr("class", "label")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("Average number of countries making the same products")


          vars.svg.selectAll(".x.axis").call(xAxis)
          vars.svg.selectAll(".y.axis").call(yAxis)

          var gPoints = vars.svg.selectAll(".points")
                          .data(new_data);

          gPoints_enter = gPoints.enter()
                          .append("g")
                          .attr("class", "points")
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

          gPoints_exit = gPoints.exit().style("opacity", .1);


          gPoints.style("opacity", 1)    

          vars.svg.selectAll(".points")
                          .transition()
                          .attr("transform", function(d) {
                            return "translate("+x(d.years[vars.time_current].nb_products)+", "+y(d.years[vars.time_current].avg_products)+")";
                          })


          var dots = gPoints_enter.append("circle")
            .attr("r", 5)
            .attr("cx", 0)
            .attr("cy", 0)
            .style("fill", function(d) { return vars.color(d.name); })

          var labels = gPoints_enter.append("text")
              .attr("x", 10)
              .attr("y", 0)
              .attr("dy", ".35em")
              .style("text-anchor", "start")
              .text(function(d) { return d.name; });

      } else if(vars.type == "nodelink") {

        var force = d3.layout.force()
            .charge(-120)
            .linkDistance(30)
            .size([vars.width, vars.height]);

        //d3.json("../data/product_space_hs4.json", function(raw) {

          d3.json("../data/network_hs.json", function(graph) {

            var min_x = Infinity, max_x = 0;
            var min_y = Infinity, max_y = 0;

            graph.nodes.forEach(function(d, i) {

              d.id = i;

              if(d.x < min_x)
                min_x = d.x;

              if(d.y < min_y)
                min_y = d.y;

              if(d.x > max_x)
                max_x = d.x;

              if(d.y > max_y)
                max_y = d.y;

            })

            graph.links.forEach(function(d, i) {

              d.source = graph.nodes[d.source];
              d.target = graph.nodes[d.target];

            })

            var x = d3.scale.linear()
                .range([0, vars.width]);

            var y = d3.scale.linear()
                .range([vars.height, 0]);

            x.domain([min_x, max_x]);
            y.domain([min_y, max_y]);

            var link = vars.svg.selectAll(".link")
                .data(graph.links)
              .enter().append("line")
                .attr("class", "link")
                .style("stroke-width", function(d) { return Math.sqrt(d.value); });

            var node = vars.svg.selectAll(".node")
                .data(graph.nodes)
              .enter().append("circle")
                .attr("class", "node")
                .attr("r", 5)
            //    .style("fill", function(d) { return color(d.group); })

            link.attr("x1", function(d) { return x(d.source.x); })
                .attr("y1", function(d) { return y(d.source.y); })
                .attr("x2", function(d) { return x(d.target.x); })
                .attr("y2", function(d) { return y(d.target.y); });

            node.attr("cx", function(d) { return x(d.x); })
                .attr("cy", function(d) { return y(d.y); });

          });

      }

      if(vars.group_var) {

        unique_categories = d3.set(vars.data.map(function(d) { return d[vars.group_var]; })).values();

        var label_checkboxes = d3.select(vars.container).selectAll("input").data(unique_categories)
          .enter()
            .append("label");

        label_checkboxes.append("input")
            .attr("type", "checkbox")
            .attr("value", function(d) { return d; })
            .property("checked", false)
            .on("change", function(d) { 

              update_filters(this.value, this.checked);
              /*
              vars.data = vars.data.filter(function(e, j) {
                console.log(e[vars.group_var], d)
                return e[vars.group_var] == d;
              })
*/

              d3.select("#viz").call(visualization);
            })

        label_checkboxes.append("span")
            .html(function(d) { return d})

      }

      if(typeof vars.id == "object") {

         label_radios = d3.select(vars.container).selectAll(".aggregations").data(vars.id)
          .enter()
            .append("label")
            .attr("class", "aggregations")

        // TODO: find levels of aggregation
        label_radios.append("input")
                   .attr("type", "radio")
                   .attr("id", "id")  
                   .attr("value", function(d) { return d; })
                   .attr("name", "radio-nest")
                   .property("checked", true)
                   .on("change", function(d) { 

                     vars.aggregate=d;
                     d3.select("#viz").call(visualization);

                   })

        label_radios.append("span")
            .html(function(d) { return d})


      }

      if(vars.year) {

        // TODO: find time range
        d3.select(vars.container).append("input")
                      .attr("type", "range")
                      .attr("class", "slider-random")
                      .property("min", 0)
                      .property("max", 1000)
                      .property("value", 100)
                      .attr("step", 1)
                      .on("input", function() {
                        d3.select("#max-time").text(this.value);
                      })
                      .style("width", "100px")

      }


     function update_filters(value, add) {
        if(vars.debug) console.log("[update_filters]", value);  
        // If we add a new value to filter
        if(add) {
          if(vars.filter.indexOf(value) < 0) {
            vars.filter.push(value)
          }
        } else {
          var index = vars.filter.indexOf(value)
          if(index > -1)
            vars.filter.splice(index, 1);
        }
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

  // NODELINK

  chart.size = function(size) {
    if (!arguments.length) return vars.size;
    vars.size = size;
    return chart;
  };

	if(vars.dev)   
		console.log("update", chart.year())

  return chart;
}

/* One way to wrap text.. 
http://bl.ocks.org/mbostock/7555321

function wrap(text, width) {

  text.each(function() {

    width = d3.select(this).data()[0].dx;

    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}
*/