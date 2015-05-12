var vistk = window.vistk || {};
window.vistk = vistk;

vistk.version = "0.1";
vistk.dev = true;
vistk.utils = vistk.utils || {};

vistk.viz = function() {

  if(typeof nb_viz == "undefined") {
    nb_viz = 0;
    global = {};
    global.evt = [];
  }

  // Parameters for the visualization
  vars = {
    // PUBLIC (set by the user)
    container : "",
    dev : true,
    id : "id",
    id_var : "id",
    var_group: null,
    data: [],
    links: [],
    title: null,
    focus: [],
    nesting: null,
    nesting_aggs: {},
    type: "",

    // Default dimensions
    width: 1000,
    height: 600,
    margin: {top: 30, right: 20, bottom: 10, left: 30},

    // Default Variables mapping
    var_text: "name",
    var_color: null,

    // Interaction
    highlight: [],
    selection: [],
    filter: [],
    aggregate: [],
    current_time: null,

    // TABLE
    columns: [],
    sort_by: {'column': 'name', 'asc': true},

    // DOTPLOT
    x_type: "linear",
    x_scale: null,
    x_ticks: 5,
    x_axis: null,

    // SCATTERPLOT (INCLUDES DOTPLOT)
    y_type: "linear",
    y_scale: null,
    y_ticks: 5,
    y_axis: null,

    // Automatically generate UI elements
    ui: true,

    // Graphical properties for graphical marks
    color: d3.scale.category20c(),
    size: d3.scale.linear(),

    accessor_year: function(d) { return d; },

    dispatch: [],
    evt: {register: function() {}, call: function() {}},  

    // SVG Container
    svg: null,

    nb_viz: nb_viz
  }

  nb_viz++;

  if (vars.dev) console.log("Init")

  if (!vars.data) vars.data = []

  // Calculate new dimensions based on margins
  vars.width = vars.width - vars.margin.left - vars.margin.right;
  vars.height = vars.height - vars.margin.top - vars.margin.bottom;

  // Events 
  vars.dispatch = d3.dispatch("init", "end", "highlightOn", "highlightOut", "selection");

	// Constructor
	chart = function(selection) {	

    if(!vars.svg) {
       if(vars.type != "table") {
       
        vars.svg = d3.select(vars.container).append("svg")
          .attr("width", vars.width + vars.margin.left + vars.margin.right)
          .attr("height", vars.height + vars.margin.top + vars.margin.bottom)
          .append("g")
            .attr("transform", "translate(" + vars.margin.left + "," + vars.margin.top + ")");

      } else {
        // HTML Container for table
        vars.svg = d3.select(vars.container).append("div").style({height: vars.height+"px", width: vars.width+"px", overflow: "scroll"})

      }
    }

    // Get a copy of the whole dataset
    new_data = vars.data;

    // Filter data by time
    if(typeof vars.var_time != "undefined" && vars.current_time != null) {

      console.log("[time.filter]", vars.var_time, vars.current_time)
      new_data = new_data.filter(function(d) {
        return d[vars.var_time] == vars.current_time;
      })

    }

    // Init
    if(vars.focus.length > 0) {
      
      new_data.forEach(function(d, i) {
          if(i == vars.focus[0])
            d.focus = true;
          else
            d.focus = false;

        })
    }

    // Filter data by attribute
    // TODO: not sure we should remove data, but add an attribute instead would better
    if(vars.filter.length > 0) {

      new_data = new_data.filter(function(d) {
        // We don't keep values that are not in the vars.filter array
        return vars.filter.indexOf(d[vars.var_group]) > -1;
      })
    
    }

    // Aggregate data
    if(vars.aggregate == vars.var_group) {

      accessor_year = vars.accessor_year;

      // Do the nesting
      // Should make sure it works for a generc dataset
      // Also for time or none-time attributes
      nested_data = d3.nest()
        .key(function(d) {
          return d[vars.var_group];
        })
        .rollup(function(leaves) {
          // Generates a new dataset with aggregated data

          var aggregation = {};

          aggregation[vars.var_text] = leaves[0][vars.var_group];

          aggregation[vars.var_group] = leaves[0][vars.var_group];

          aggregation[vars.var_x] = d3.mean(leaves, function(d) {
            return d[vars.var_x];
          });

          aggregation[vars.var_y] = d3.mean(leaves, function(d) {
              return d[vars.var_y];
            })

          vars.columns.forEach(function(c) {
            if(c == vars.var_text || c == vars.var_group)
              return;

            aggregation[c] = d3.mean(leaves, function(d) {
              return d[c];
            })
          })

          return aggregation;
        })
        .entries(new_data);

      // Transform key/value into values tab only
      new_data = nested_data.map(function(d) { return d.values});
    }

    selection.each(function() {

      if(vars.type == "undefined") {

        // Basic dump of the data we have
         vars.svg.append("span")
          .html(JSON.stringify(vars.data));

      } else if(vars.type == "table") {

       vars.svg.select("table").remove();

       function row_data(row, i) {

        // Creates an array first of the size of the desired rows
        // Then fills the array with the appropriate data
        // Applies some formatting depending on the index of the column
        return vars.columns.map(function(column, i) {
          
          // console.log( vars.accessor_year(row)[vars.columns[i]], i, vars.columns, row["group"], row[vars.columns[i]])

           return row[column];      
/*
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

            return vars.var_year;

          }
          */
        });
      }

      vars.evt.register("highlightOn", function(d) {
        vars.svg.selectAll("tr")
                .filter(function(e, j) { return e === d; })
                .style("background-color", "#F3ED86");
      })

      vars.evt.register("highlightOut", function(d) {
        tbody.selectAll("tr")
          .style("background-color", null)
      });

      function create_table(data) {

        if(vars.debug) console.log("[create_table]");    

        var table = vars.svg.append("table").style("overflow-y", "scroll"),
          thead = table.append("thead").attr("class", "thead");
          tbody = table.append("tbody");

        if(vars.title != null) {

          var title = vars.title;

          if(typeof vars.current_time != "undefined")
            title += " (" + vars.current_time + ")";

          table.append("caption")
            .html(title);
        }

        thead.append("tr").selectAll("th")
          .data(vars.columns)
        .enter()
          .append("th")
          .text(function(d) { return d; })
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
            vars.evt.call("highlightOn", d3.select(this.parentNode).data()[0]);     
          })
          .on("mouseout", function(d) {
            vars.evt.call("highlightOut", d3.select(this.parentNode).data()[0]); 
          })
          .on("click", function(d) {

            var data = d3.select(this.parentNode).data()[0];
            var index = vars.selection.indexOf(data);

            if(index <0)
              vars.selection.push(data);
            else
              vars.selection.splice(index, 1);

          });

        }

       // Function that orders the rows of the table
        function sort_by(header) {

          if(vars.debug) console.log("[sort_by]", header);

          vars.sort_by.column = header;
          vars.sort_by.is_sorted = !vars.sort_by.is_sorted;
/*
          if(vars.aggregate == 'continent') {
            vars.accessor_year = accessor_year_agg;
          } else {
            vars.accessor_year = accessor_year;
          }
  */
          d3.select(".thead").selectAll("th").attr("id", null);

          // For those specific columns, we are sorting strings
          if (header == "continent" || header == "name") {

            tbody.selectAll("tr").sort(function(a, b) {
              var ascending = d3.ascending(a[header], b[header]);
              return vars.sort_by.is_sorted ? ascending : - ascending;
            });

          // For the others, we sort numerical values
          } else {

            tbody.selectAll("tr").sort(function(a, b) {

              a = vars.accessor_year(a)[header];
              b = vars.accessor_year(b)[header];
              var ascending =  a > b ? 1 : a == b ? 0 : -1;

              return vars.sort_by.is_sorted ? ascending : - ascending;
            });

          }
        }


        function click_header(header) {

          var this_node = d3.selectAll("th").filter(function(d) {
              return d == header;
            })

          var is_sorted = (this_node.attr("class") == "sorted");

          d3.selectAll("th").text(function(d) {
            return d.replace("▴", "");
          })
          d3.selectAll("th").text(function(d) {
            return d.replace("▾", "");
          })

          if(!is_sorted) {
            this_node.classed("sorted", true)
            this_node.text(this_node.text()+"▾")
          }
          else {
            this_node.classed("sorted", false)
            this_node.text(this_node.text()+"▴")
          }

          if(vars.debug) console.log("[click_header]", is_sorted)

         // vars.sort_by.is_sorted = !vars.sort_by.is_sorted;
          sort_by(header);

        }

        function paint_zebra_rows(rows) {
          rows.filter(function() {
            return d3.select(this).style("display") != "none";
          })
            .classed("odd", function(d, i) { return (i % 2) == 0; });
        }

        // If no column have been specified, take all columns
        // vars.columns = d3.keys(vars.data[0])

        // Basic dump of the data we have
        create_table(new_data)

        paint_zebra_rows(tbody.selectAll("tr.row"));
        // Now update the table

        // ENTER

        // EXIT

        // UPDATE

      } else if(vars.type == "treemap") {

        vars.evt.register("highlightOn", function(d) {
          vars.svg.selectAll("rect")
            .filter(function(e, j) { return e === d; })
            .classed("focus", true);
        });

        vars.evt.register("highlightOut", function(d) {
          vars.svg.selectAll("rect")
            .classed("focus", false);
        });

        // Create the root node
        r = {}
        r.name = "root";
        groups = [];

        // Creates the groups here
        new_data.map(function(d, i) {

          if(typeof groups[d[vars.var_group]] == "undefined") {
            groups[d[vars.var_group]] = [];
          }

          groups[d[vars.var_group]]
           .push({name: d.name, size: d.value, attr: d.item_id, group: +d[vars.var_group], year: d.year, id: i, focus: d.focus});

        })

        // Make sure there is no empty elements
        groups = groups.filter(function(n){ return n != undefined }); 
        
        // Creates the parent nodes
        parents = groups.map(function(d, i) {

          node = {};
          node.name = d[0].name;
          node.group = d[0].group;

          // Create the children nodes
          node.children = d.map(function(e, j) {
            return {name: e.name, size: e.size, group: e.group, year: e.year, id: e.id, focus: e.focus}
          })

          return node;
        })

        // Add parents to the root
        r.children = parents;

        var treemap = d3.layout.treemap()
            .padding(4)
            .sticky(true)
            .size([vars.width, vars.height])
            .value(function(d) { return d[vars.var_size]; });

        // PRE-UPDATE
        var cell = vars.svg.data([r]).selectAll("g")
            .data(treemap.nodes);

        // ENTER
        var cell_enter = cell.enter().append("g")
            .attr("class", "cell")
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

        cell_enter.append("rect")
            .attr("width", function(d) { return d.dx; })
            .attr("height", function(d) { return d.dy; })
            .style("fill", function(d) {
              return d.children ? vars.color(d[vars.var_color]) : null; 
            })

        // TODO: persistent bug when hovering a cell
        cell
          .filter(function(d) { return d.depth == 2})
          .on("mousemove", function(d) {      
            vars.evt.call("highlightOn", d);
          }).on("mouseout", function(d) {
            vars.evt.call("highlightOut", d);
          })

        cell_enter.append("text")
            .attr("x", function(d) { return 10; })
            .attr("y", function(d) { return 10; })
            .attr("dy", ".35em")
            .attr("text-anchor", "left")
            .style("font-size", 15)
            .text(function(d) { 
              if(d.depth == 1)
                return d.name;
            //  return d.children ? null : d[vars.var_text].slice(0, 3)+"..."; 
            })
            .on("mouseenter", function(d, i) {                
              vars.dispatch.highlightOn(d)              
            }).on("mouseout", function(d) {
              vars.dispatch.highlightOut(d)  
            })

        // EXIT
        var cell_exit = cell.exit().remove();

        // UPDATE
        cell.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

        cell.select("rect")
            .attr("width", function(d) { return d.dx; })
            .attr("height", function(d) { return d.dy; })
            .style("fill", function(d) {
              return d.children ? vars.color(d[vars.var_color]) : null; 
            })
            .classed("focus", function(d, i) { return d.focus; })

        cell.select("text")
            .call(wrap)

      } else if(vars.type == "scatterplot") {

        vars.evt.register("highlightOn", function(d) {

          gPoints.selectAll(".dot__circle").classed("highlighted", function(e, j) { return e === d; });
          gPoints.selectAll(".dot__label").classed("highlighted", function(e, j) { return e === d; });

          // Tentative of data driven selection update
          vars.data.forEach(function(e) {
            if(d === e)
              e.__highlight = true;
            else
              e.__highlight = false;
          })

        });

        vars.evt.register("highlightOut", function(d) {

          gPoints.selectAll(".dot__circle").classed("highlighted", false);
          gPoints.selectAll(".dot__label").classed("highlighted", false);

          vars.data.forEach(function(e) { d.__highlight = false; })
        });

        vars.x_scale = d3.scale.linear()
            .range([vars.margin.left, vars.width-vars.margin.left-vars.margin.right]);

        vars.y_scale = d3.scale.linear()
            .range([vars.height-vars.margin.top-vars.margin.bottom, vars.margin.top]);

        vars.x_axis = d3.svg.axis()
            .scale(vars.x_scale)
            .orient("bottom");

        vars.y_axis = d3.svg.axis()
            .scale(vars.y_scale)
            .orient("left");

        vars.svg.selectAll(".label").data(new_data)
          .enter()
            .append("text")
            .attr("class", "year label")
            .attr("text-anchor", "end");

        // Background year label
        vars.svg.selectAll(".label")
            .attr("y", 124)
            .attr("x", 500)
            .text(vars.current_time);

        vars.x_scale.domain([0, d3.max(vars.data, function(d) { return d[vars.var_x]; })]).nice();
        vars.y_scale.domain([0, d3.max(vars.data, function(d) { return d[vars.var_y]; })]).nice();

        vars.svg.selectAll(".x.axis").data([new_data])
          .enter()
            .append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (vars.height-vars.margin.bottom-vars.margin.top) + ")")              
          .append("text")
            .attr("class", "label")
            .attr("x", vars.width-vars.margin.left-vars.margin.right)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text(function(d) { return vars.var_x; })

        vars.svg.selectAll(".y.axis").data([new_data]).enter().append("g")
            .attr("class", "y axis")
            .attr("transform", "translate("+vars.margin.left+", 0)")              
          .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(function(d) { return vars.var_y; })

        vars.svg.selectAll(".x.axis").call(vars.x_axis);
        vars.svg.selectAll(".y.axis").call(vars.y_axis);

        var gPoints = vars.svg.selectAll(".points")
                        .data(new_data, function(d, i) { return d.name + " " + i; });

        // Here we want to deal with aggregated datasets
        if(vars.aggregate == vars.var_group) {

          var gPoints_enter = gPoints.selectAll(".points")
                        .enter()
                          .append("g")
                          .attr("class", "points")

          var dots = gPoints_enter.append("rect")
            .attr("r", 5)
            .attr("height", 10)
            .attr("width", 10)
            .style("fill", function(d) { return vars.color(d[vars.var_color]); })

          var labels = gPoints_enter.append("text")
              .attr("x", 10)
              .attr("y", 0)
              .attr("dy", ".35em")
              .style("text-anchor", "start")
              .text(function(d) { return d[vars.var_text]; });

          var gPoints_exit = gPoints.exit().style("opacity", .1);

          // Update all the remaining dots
          gPoints.style("opacity", 1)    

          gPoints
              .transition()
              .attr("transform", function(d) {
                return "translate(" + vars.x_scale(d[vars.var_x])+", " + vars.y_scale(d[vars.var_y]) + ")";
              })

        } else { 

          // ENTER
          var gPoints_enter = gPoints.enter()
                        .append("g")
                          .attr("class", "points")
                          .on("mouseenter", function(d, i) {
                            vars.evt.call("highlightOn", d);
                          })
                          .on("mouseout", function(d) {
                            vars.evt.call("highlightOut", d);
                          })
                          .on("click", function(d) {
                            vars.evt.call("clicked", d);
                          });

          var dots = gPoints_enter.append("circle")
              .attr("r", 5)
              .attr("cx", 0)
              .attr("cy", 0)
              .attr("class", "dot__circle")
              .style("fill", function(d) { return vars.color(d[vars.var_color]); })

          var labels = gPoints_enter.append("text")
              .attr("x", 10)
              .attr("y", 0)
              .attr("dy", ".35em")
              .attr("class", "dot__label")              
              .style("text-anchor", "start")
              .text(function(d) { return d[vars.var_text]; });

          // EXIT
          var gPoints_exit = gPoints.exit().style("opacity", .1);

          // UPDATE
          if(vars.data.filter(function(d) { return d.__highlight;}).length > 0) {

            // Update all the remaining dots
            gPoints.style("opacity", function(d) {
              console.log(d.__highlight)
                if(d.__highlight)
                  return 1;
                else
                  return .1;
              })              

          } else {

            gPoints.style("opacity", 1)
          
          }

          gPoints
            .transition()
            .attr("transform", function(d) {
              return "translate(" + vars.x_scale(d[vars.var_x]) + ", " + vars.y_scale(d[vars.var_y]) + ")";
            })
        }

      } else if(vars.type == "dotplot") {

        vars.evt.register("highlightOn", function(d) {

          gPoints.selectAll(".dot__circle").classed("highlighted", function(e, j) { return e === d; });
          gPoints.selectAll(".dot__label").classed("highlighted", function(e, j) { return e === d; });
        
        });

        vars.evt.register("highlightOut", function(d) {

          gPoints.selectAll(".dot__circle").classed("highlighted", false);
          gPoints.selectAll(".dot__label").classed("highlighted", false);

        });

        vars.evt.register("selection", function(d) {

          var clicked_node = d3.selectAll(".dot__circle")
            .filter(function(e, j) { return e === d; })

          clicked_node.classed("selected", !clicked_node.classed("selected"));

        });

        if(vars.x_type == "index") {

          vars.x_scale = d3.scale.ordinal()
                .domain(d3.range(new_data.length))
                .rangeBands([vars.margin.left, vars.width-vars.margin.left-vars.margin.right]);

          new_data.sort(function ascendingKey(a, b) {
            return d3.ascending(a[vars.var_x], b[vars.var_x]);
          })
          .forEach(function(d, i) {
            d.rank = vars.x_scale(i);
          });

        } else {

          vars.x_scale = d3.scale.linear()
              .range([vars.margin.left, vars.width-vars.margin.left-vars.margin.right])
              .domain([0, d3.max(new_data, function(d) { return d[vars.var_x]; })]).nice();
        
        }

        vars.x_axis = d3.svg.axis()
            .scale(vars.x_scale)
            .ticks(vars.nb_ticks)
            .orient("bottom");

        vars.svg.selectAll(".label").data(new_data)
          .enter()
            .append("text")
            .attr("text-anchor", "end");

        vars.svg.selectAll(".x.axis").data([new_data])
          .enter()
            .append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (vars.height/2) + ")")              
          .append("text")
            .attr("class", "label")
            .attr("x", vars.width-vars.margin.left-vars.margin.right)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text(function(d) { 
              if(typeof vars.x_text != undefined && vars.x_text != null)
                return vars.var_x;
              else
                return '';
            })

        vars.svg.selectAll(".x.axis").transition().call(vars.x_axis)

        var gPoints = vars.svg.selectAll(".points")
                        .data(new_data, function(d, i) { return d[vars.var_text]; });

        var gPoints_enter = gPoints.enter()
                        .append("g")
                        .attr("class", "points")
                        .attr("transform", function(d, i) {
                          return "translate("+ vars.margin.left +", "+vars.height/2+")";
                        })
                        .on("mouseover",function(d) {
                          vars.evt.call("highlightOn", d);
                        })
                        .on("mouseleave", function(d) {
                          vars.evt.call("highlightOut", d);
                        })

        if(typeof vars.mark != "undefined") {

          switch(vars.mark.type) {

            case "circle":
 
              gPoints_enter.append("circle")
                              .attr("r", 5)
                              .attr("cx", 0)
                              .attr("cy", 0)
                              .attr("class", "dot__circle");

              break;

            case "rect":
 
             gPoints_enter.append("rect")
                              .attr("height", vars.mark.height)
                              .attr("width", vars.mark.width)                              
                              .attr("x", -vars.mark.width/2)
                              .attr("y", -vars.mark.height/2)
                              .attr("class", "dot__circle");

              break;

            case "diamond":

             gPoints_enter.append("rect")
                              .attr("height", vars.mark.height)
                              .attr("width", vars.mark.width)                              
                              .attr("x", -vars.mark.width/2)
                              .attr("y", -vars.mark.height/2)
                              .attr("class", "dot__circle")
                              .attr("transform", "rotate(45)")

              break;
          }

        }
 
        gPoints_enter.append("text")
                        .attr("x", 10)
                        .attr("y", 0)
                        .attr("dy", ".35em")
                        .attr("class", "dot__label")
                        .attr("transform", "rotate(-30)")
                        .text(function(d) { return d[vars.var_text]; })
                        .on("click", function(d) {
                           vars.evt.call("selection", d);
                          /*
                          var index = vars.selection.indexOf(d);

                          if(index <0)
                            vars.selection.push(d);
                          else
                            vars.selection.splice(index, 1);
                          */
                        })

        var gPoints_exit = gPoints.exit().style("opacity", .1);

        if(vars.x_type == "index") {

          vars.svg.selectAll(".points")
                          .transition().delay(function(d, i) { return i / vars.data.length * 100; }).duration(1000)
                          .attr("transform", function(d, i) {
                            return "translate("+d.rank+", "+vars.height/2+")";
                          })

        } else {

          vars.svg.selectAll(".points")
                          .transition().delay(function(d, i) { return i / vars.data.length * 100; }).duration(1000)
                          .attr("transform", function(d) {
                            return "translate(" + vars.x_scale(d[vars.var_x]) + ", " + vars.height/2 + ")";
                          })
        }

/*      // For some reasons hides the labels
        if(typeof vars.highlight.length != undefined) {
          vars.evt.call("highlightOn", vars.data[vars.highlight]);
        }
*/
        // TODO: dispatch focus event here and highlight nodes
        if(vars.selection.length > 0) {

          var selection_points = gPoints
            .filter(function(d, i) {
              return i == vars.selection[0];
            })

          selection_points.select(".dot__circle")
            .classed("selected", false)

          selection_points.select(".dot__label")
            .filter(function(d, i) {
              return i == vars.selection[0];
            })
            .classed("selected", true)

        }

      } else if(vars.type == "piechart") {

        var r = vars.width/6;
        
        var color = d3.scale.category20c();

        vis = d3.select(vars.container)
                    .data(new_data)
                  .enter()
                    .append("g")
                    .attr("transform", "translate(" + vars.width/2 + "," + vars.height/2 + ")");
        
        var pie = d3.layout.pie().value(function(d){ return 1; }); // equal share

        // declare an arc generator function
        var arc = d3.svg.arc().outerRadius(r);

        // select paths, use arc generator to draw
        var arcs = vis.selectAll("g.slice")
                      .data(pie)
                    .enter()
                      .append("svg:g")
                      .attr("class", "slice");
        
        arcs.append("svg:path")
            .attr("fill", function(d, i){
              return color(i);
            })
            .attr("d", function (d) {
              return arc(d);
            });

      } else if(vars.type == "nodelink") {

        vars.evt.register("highlightOn", function(d) {

          // Highlight nodes
          vars.svg.selectAll(".node").style("opacity", .1)    
          vars.svg.selectAll(".node").filter(function(e, j) { return e === d; }).style("opacity", 1);

          // Highlight Links
          vars.svg.selectAll(".link").style("opacity", .1);
          
          vars.svg.selectAll(".source_"+d.id).each(function(e) {
              vars.svg.select("#node_"+e.target.id).style("opacity", 1) 
            })
            .style("opacity", 1)
            .style("stroke-width", function(d) { return 3; });

          vars.svg.selectAll(".target_"+d.id).each(function(e) {
            vars.svg.select("#node_"+e.source.id).style("opacity", 1) 
          })
          .style("opacity", 1)
          .style("stroke-width", function(d) { return 3; })

          // TODO: quick fix to coordinate with a table
          vars.svg.selectAll(".node").filter(function(e, j) { return e.data === d; }).style("opacity", 1);
          vars.svg.selectAll(".source_"+d.product_id).each(function(e) {
            vars.svg.select("#node_"+e.target.data.product_id).style("opacity", 1) 
          })
          .style("opacity", 1)
          .style("stroke-width", function(d) { return 3; });

          vars.svg.selectAll(".target_"+d.product_id).each(function(e) {
            vars.svg.select("#node_"+e.source.data.product_id).style("opacity", 1) 
          })
          .style("opacity", 1)
          .style("stroke-width", function(d) { return 3; })

        });

        vars.evt.register("highlightOut", function(d) {

          vars.svg.selectAll(".node").style("opacity", 1)
          vars.svg.selectAll(".link")
            .style("opacity", .4)
            .style("stroke-width", function(d) { return 1; })

        });

        // TODO: use in case we don't have (x, y) coordinates for nodes'
        var force = d3.layout.force()
            .charge(-120)
            .linkDistance(30)
            .size([vars.width, vars.height]);

        var min_x = Infinity, max_x = 0;
        var min_y = Infinity, max_y = 0;

        vars.nodes.forEach(function(d, i) {

          if(d.x < min_x)
            min_x = d.x;

          if(d.y < min_y)
            min_y = d.y;

          if(d.x > max_x)
            max_x = d.x;

          if(d.y > max_y)
            max_y = d.y;

          // Find the value in vars.data
          d.data = find_data_by_id(d.id);

          if(typeof d.data == "undefined") {
            d.data = {};
            d.data.category = 0;
          }

        })

        vars.links.forEach(function(d, i) {

          d.source = find_node_by_id(d.source);
          d.target = find_node_by_id(d.target);

        })

        var x = d3.scale.linear()
            .range([0, vars.width]);

        var y = d3.scale.linear()
            .range([0, vars.height]); // Reverted Scale!

        x.domain([min_x, max_x]);
        y.domain([min_y, max_y]);

        var link = vars.svg.selectAll(".link")
            .data(vars.links)
          .enter().append("line")
            .attr("class", function(d) {
              return "link source_"+d.source.id+" target_"+d.target.id;
            })
            .style("stroke-width", function(d) { return Math.sqrt(d.value); })
            .style("opacity", .4);

        var node = vars.svg.selectAll(".node")
            .data(vars.nodes, function(d) { return d.id});

        var node_enter = node.enter().append("circle")
            .attr("class", "node")
            .attr("id", function(d) { return "node_"+d.id; })
            .attr("r", 5)
           /* .attr("r", function(d) { 
              if(typeof d.data != "undefined")
                return Math.max(0, d.data["cog"]*10);
              else
                return 0;
            }) */
            .style("fill", function(d) { 
              return vars.color(d.data[vars.var_color]); 
            })
            .on("mouseenter",function(d){ 
              vars.evt.call("highlightOn", d);
            })
            .on("mouseleave",function(d){
              vars.evt.call("highlightOut", d);
            });

        var node_exit = node.exit().style({opacity: .1})

        link.attr("x1", function(d) { return x(d.source.x); })
            .attr("y1", function(d) { return y(d.source.y); })
            .attr("x2", function(d) { return x(d.target.x); })
            .attr("y2", function(d) { return y(d.target.y); })

        node.attr("cx", function(d) { return x(d.x); })
            .attr("cy", function(d) { return y(d.y); });

      } else if(vars.type == "linechart") {

        vars.evt.register("highlightOn", function(d) {

          vars.svg.selectAll(".line:not(.selected)").style("opacity", 0.2);
          vars.svg.selectAll(".text:not(.selected)").style("opacity", 0.2);

          vars.svg.selectAll("#"+d[vars.var_id]).style("opacity", 1);

          vars.svg.selectAll(".line").filter(function(e, j) { return e === d; }).style("stroke-width", 3);
          vars.svg.selectAll(".text").filter(function(e, j) { return e === d; }).style("text-decoration", "underline");

        })

        vars.evt.register("highlightOut", function(d) {

          vars.svg.selectAll(".country:not(.selected)").style("opacity", 1);

          vars.svg.selectAll(".line").filter(function(e, j) { return e === d; }).style("stroke-width", 1);
          vars.svg.selectAll(".text").filter(function(e, j) { return e === d; }).style("text-decoration", "none");

        })

        vars.evt.register("selection", function(d) {

          vars.svg.selectAll("#"+d[vars.var_id])
                  .classed("selected", !vars.svg.selectAll("#"+d[vars.var_id]).classed("selected"));

        });

        // TODO: Put into the format parameters
        var parseDate = d3.time.format("%Y").parse;

        vars.x_scale = d3.time.scale()
            .range([0, vars.width-100]);

        vars.y_scale = d3.scale.linear()
            .range([0, vars.height-100]);

        vars.x_axis = d3.svg.axis()
            .scale(vars.x_scale)
            .orient("top");

        vars.y_axis = d3.svg.axis()
            .scale(vars.y_scale)
            .orient("left");

        // FIX FOR MISSING VALUES
        // https://github.com/mbostock/d3/wiki/SVG-Shapes
        var line = d3.svg.line()
        // https://gist.github.com/mbostock/3035090
            .defined(function(d) { return d.rank != null; })
            .interpolate("monotone")
            .x(function(d) { return vars.x_scale(d[vars.var_time]); })
            .y(function(d) { return vars.y_scale(d.rank); });

        // TODO: fix the color scale
        vars.color.domain(d3.keys(new_data[0]).filter(function(key) { return key !== "date"; }));

        new_data.forEach(function(d) {
          d[vars.var_time] = parseDate(d.year);
        });
        
        var min_max_years = d3.extent(new_data, function(d) { return d[vars.var_time]; });

        all_years = d3.set(new_data.map(function(d) { return d.year;})).values();

        // Find unique countries and create ids
        countries = d3.set(new_data.map(function(d) { return d[vars.var_text]; })).values().map(function(c) {
          return {
            id: c.replace(" ", "_"),
            name: c,
            values: new_data.filter(function(d) {
              return d[vars.var_text] == c;
            }).map(function (d) {
              return {date: parseDate(d.year), rank: +d.rank, year: d.year};
            })
          };
        })

        // Make sure all countries and all ranks are there
        countries.forEach(function(c) {

          all_years.forEach(function(y) {
            var is_year = false;
            c.values.forEach(function(v) {
              if(v.year == y)
                is_year = true;
            })
            if(!is_year) {
              c.values.push({date: parseDate(y), rank: null, year: y})
            }
          });

        });

        vars.x_scale.domain(min_max_years);

        vars.y_scale.domain([
          d3.min(countries, function(c) { return d3.min(c.values, function(v) { return v.rank; }); }),
          d3.max(countries, function(c) { return d3.max(c.values, function(v) { return v.rank; }); })
        ]);

        // unique_years = d3.set(vars.data.map(function(d) { return d[vars.var_time];})).values();

        // Create the background grid
        // http://www.d3noob.org/2013/01/adding-grid-lines-to-d3js-graph.html

        function make_x_axis() {        
            return d3.svg.axis()
                .scale(vars.x_scale)
                 .orient("bottom")
                 .ticks(10);
        }

        vars.svg.append("g")
            .attr("class", "x grid")
            .attr("transform", "translate(0," + vars.height + ")")
            .call(make_x_axis()
            .tickSize(-vars.height, 0, 0)
            .tickFormat(""));

        vars.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + -5 + ")")
            .call(vars.x_axis);

        vars.svg.append("g")
            .attr("class", "y axis")
            .call(vars.y_axis)
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "-1.71em")
            .style("text-anchor", "end")
            .text(vars.y_text);

        var country = vars.svg.selectAll(".country")
            .data(countries)
          .enter()
            .append("g")
            .attr("class", function(d) {

              var c = "country";

              if(vars.selection.indexOf(d.name) >= 0)
                c += " selected";

              if(vars.highlight.indexOf(d.name) >= 0)
                c += " highlighted";

              return c;

            });

        country.append("path")
            .attr("class", "country line")
            .attr("d", function(d) {
              return line(d.values); 
            })
            .attr("id", function(d) { return d[vars.var_id]; })
            .attr("class", function(d) {

              var c = "country line";

              if(vars.selection.indexOf(d.name) >= 0)
                c += " selected";

              if(vars.highlight.indexOf(d.name) >= 0)
                c += " highlighted";

              return c;
            })
            .style("stroke", function(d) { return vars.color(d[vars.var_color]); });

        country.append("text")
            .datum(function(d) { 
              d.values.sort(function(a, b) { return a.year > b.year;}); 
              return {name: d.name, id: d[vars.var_id], value: d.values[d.values.length - 1]}; 
            })
            .attr("transform", function(d) { 
              return "translate(" + vars.x_scale(d.value[vars.var_time]) + "," + vars.y_scale(d.value.rank) + ")"; 
            })
            .attr("x", 3)
            .attr("class", function(d) {

              var c = "country text";

              if(vars.selection.indexOf(d.name) >= 0)
                c += " selected";

              if(vars.highlight.indexOf(d.name) >= 0)
                c += " highlighted";

              return c;
            })
            .attr("dy", ".35em")
            .attr("id", function(d) { return d[vars.var_id]; })
            .text(function(d) { return d[vars.var_text]; })

            vars.svg.selectAll(".country").on("mouseover", function(d) {
              vars.evt.call("highlightOn", d);
            })
            .on("mouseout", function(d) {
              vars.evt.call("highlightOut", d);
            });

        vars.svg.selectAll("text.country").on("click", function(d) {

          vars.evt.call("selection", d);

        })
/*
        vars.svg.select("svg").on("click", function(d) {

          d3.selectAll(".selected").classed("selected", false);
          d3.selectAll(".line:not(.selected)").style("opacity", 1);
          d3.selectAll(".text:not(.selected)").style("opacity", 1);

        })
*/
      } else if(vars.type == "sparkline") {

        // From http://www.tnoda.com/blog/2013-12-19
        var x = d3.scale.linear().range([0, vars.width - 2]);
        var y = d3.scale.linear().range([vars.height - 4, 0]);

        var line = d3.svg.line()
                     .interpolate("basis")
                     .x(function(d) { return x(d[vars.var_time]); })
                     .y(function(d) { return y(d[vars.var_y]); });
        
        x.domain(d3.extent(new_data, function(d) { return d[vars.var_time]; }));
        y.domain(d3.extent(new_data, function(d) { return d[vars.var_y]; }));

        vars.svg.selectAll(".sparkline").data([new_data])
          .enter().append('path')
        //   .datum(data)
           .attr('class', 'sparkline')
           .attr('d', line);

        vars.svg.append('circle')
           .attr('class', 'start sparkcircle')
           .attr('cx', x(new_data[0][vars.var_time]))
           .attr('cy', y(new_data[0][vars.var_y]))
           .attr('r', 1.5);  

        vars.svg.append('circle')
           .attr('class', 'end sparkcircle')
           .attr('cx', x(new_data[new_data.length-1][vars.var_time]))
           .attr('cy', y(new_data[new_data.length-1][vars.var_y]))
           .attr('r', 1.5);  

      } else if(vars.type == "geomap") {

        // http://techslides.com/demos/d3/d3-world-map-colors-tooltips.html
        var projection = d3.geo.mercator()
                        .translate([vars.width/2, vars.height/2])
                        .scale(100);

        var path = d3.geo.path()
            .projection(projection);

        var tooltip = d3.select(vars.container).append("div")
            .attr("class", "tooltip");

        vars.gSvg = vars.svg
            .call(d3.behavior.zoom()
            .on("zoom", redraw))
            .append("g");

        function redraw() {
            vars.gSvg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        }

        queue()
            .defer(d3.json, "../data/world-110m.json")
            .defer(d3.tsv, "../data/world-country-names.tsv")
            .await(ready);

        function ready(error, world, names) {

          countries = topojson.object(world, world.objects.countries).geometries,
              neighbors = topojson.neighbors(world, countries),
              i = -1,
              n = countries.length;

          countries.forEach(function(d) { 

            // Retrieve the country name based on its id
            d._name = names.filter(function(n) { return d.id == n.id; })[0].name; 

            // TODO: should merge on a more reliable join (e.g. 2-char)
            d.data = new_data.filter(function(n) { return d._name == n.name; })[0];

          });

          // TODO: see above
          countries = countries.filter(function(d) {
            return typeof d.data != "undefined";
          })

          // Update
          var country = vars.gSvg.selectAll(".country").data(countries);

          // We override the current color scale to make it linear
          vars.color = d3.scale.linear()
            .domain([d3.min(new_data, function(d) { return d[vars.var_color]; }), d3.max(new_data, function(d) { return d[vars.var_color]; })])
            .range(["red", "green"]);

          var country_enter = country.enter()
                                .insert("path")
                                .attr("class", "country")    
                                  .attr("title", function(d,i) { 
                                    return d.name; 
                                  })
                                  .attr("d", path)
                                  .style("fill", function(d, i) { 
                                    return vars.color(d.data[vars.var_color]);
                                  });

          vars.dispatch.on("highlightOn", function(d) {
            console.log(d)
          });

          vars.dispatch.on("highlightOut", function(d) {
            console.log(d)
          });

          //Show/hide tooltip
          country_enter
                .on("mouseenter", function(d, i) {
                  vars.dispatch.highlightOn(d);
                })
                .on("mousemove", function(d,i) {


                  var mouse = d3.mouse(vars.gSvg.node()).map( function(d) { return parseInt(d); } );

                  tooltip
                    .classed("hidden", false)
                    .attr("style", "left:"+(mouse[0]+25)+"px;top:"+mouse[1]+"px")
                    .html(d._name);

                })
                .on("mouseout",  function(d,i) {
                  vars.dispatch.highlightOut(d);                  
                  tooltip.classed("hidden", true)
                });

          country_exit = country.exit().style({"display": "none"});

          }


         } else if(vars.type == "grid") {

          nb_dimension =  Math.ceil(Math.sqrt(vars.data.length));

          // Create the x and y scale as index scale
          vars.x_scale = d3.scale.linear()
                    .domain([0, nb_dimension])
                    .range([0, vars.width]);

          vars.y_scale = d3.scale.linear()
                    .domain([0, nb_dimension])
                    .range([0, vars.height]);

          res = [];

          // Create foci for each dimension
          // TOFIX: should update children, not necessary replace
          d3.range(nb_dimension).map(function(d, i) {
             d3.range(nb_dimension).map(function(e, j) {

              // To make sure we don't update more points than necessary
              if(i*nb_dimension+j < vars.data.length) {

                // IMPORTANT to clone the _params here
                var index = i*nb_dimension+j;
                res.push({index: index, x: vars.x_scale(i), y: vars.y_scale(j)});
              }
            })
          })

        var gPoints = vars.svg.selectAll(".points")
                        .data(res, function(d, i) { return d["index"]; });

          // ENTER
          var gPoints_enter = gPoints.enter()
                        .append("g")
                          .attr("class", "points")
                          .on("mouseenter", function(d, i) {
                            vars.evt.call("highlightOn", d);
                          })
                          .on("mouseout", function(d) {
                            vars.evt.call("highlightOut", d);
                          })
                          .on("click", function(d) {
                            vars.evt.call("clicked", d);
                          });

          var dots = gPoints_enter.append("circle")
              .attr("r", 5)
              .attr("cx", 0)
              .attr("cy", 0)
              .attr("class", "dot__circle")
              .style("fill", function(d) { return vars.color(d[vars.var_color]); })

          vars.svg.selectAll(".points")
              .transition()
              .attr("transform", function(d) {
                console.log(d)
                return "translate(" + d.x + ", " + d.y + ")";
              })


      } else {

        console.log("No chart type defined!")

      }

      function find_node_by_id(id) {
        var res = vars.nodes.filter(function(d) {
          return d.id == id;
        })[0];

        if(typeof res == "undefined")
          console.log("id not found", id)

        return res;
      }

      function find_data_by_id(id) {
        var res = new_data.filter(function(d) {
          return d[vars.var_id] == +id;
        })[0];

        if(typeof res == "undefined")
          console.log("Data id not found", id)

        return res;
      }

      if(vars.ui) {

        // BUILDING THE UI elements
        d3.select(vars.container).selectAll(".break").data([vars.var_id])
          .enter()
            .append("p")
            .attr("class", "break");

        if(vars.var_group) {

          unique_categories = d3.set(new_data.map(function(d) { return d[vars.var_group]; })).values();

          label_checkboxes = d3.select(vars.container).selectAll(".checkboxes").data(unique_categories)
            .enter()
              .append("label")
              .attr("class", "checkboxes")

          label_checkboxes.append("input")
              .attr("type", "checkbox")
              .attr("value", function(d) { return d; })
              .property("checked", false)
              .on("change", function(d) { 

                update_filters(this.value, this.checked);
                /*
                vars.data = vars.data.filter(function(e, j) {
                  console.log(e[vars.var_group], d)
                  return e[vars.var_group] == d;
                })
                */

                d3.select("#viz").call(visualization);

              })

          label_checkboxes.append("span")
              .html(function(d) { 
                var count = new_data.filter(function(e, j) { return e[vars.var_group] == d; }).length;
                return d + " (" + count + ")";
              })

        }

        if(typeof vars.var_id == "object") {

          var label_radios = d3.select(vars.container).selectAll(".aggregations").data(vars.var_id)
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

                     });

          label_radios.append("span")
              .html(function(d) { 
  //              var count = vars.data.filter(function(e, j) { return e[vars.var_group] == d; }).length;
                // TODO
                var count = "";
                return d + " (" + count + ")";
              });

        }

        if(vars.var_time) {

          var label_slider = d3.select(vars.container).selectAll(".slider").data([vars.var_id])
            .enter()
              .append("label")
              .attr("class", "slider")

          // Assuming we have continuous years
          unique_years = d3.set(vars.data.map(function(d) { return d[vars.var_time];})).values();

          // TODO: find time range
          label_slider.append("input")
                        .attr("type", "range")
                        .attr("class", "slider-random")
                        .property("min", d3.min(unique_years))
                        .property("max", d3.max(unique_years))
                        .property("value", vars.current_time)
                        .attr("step", 1)
                        .on("input", function() {
                          vars.current_time = +this.value;
                          d3.select("#viz").call(visualization);
                        })
                        .style("width", "100px")

        }


/* LOADING DATASETS

      var label_loader = d3.select(vars.container).selectAll(".loader").data([vars.var_id])
        .enter()
          .append("label")
          .attr("class", "loader")

      label_loader.append("select")
        .attr("id", "select_var_x")
        .on("change", function(d) {
          vars.var_x = this.value;
          ds.update(vars.current_view);
        })
        .selectAll("option")
        .data(["../data/exports_2012.json"])
      .enter()
        .append("option")
        .attr("value", function(d) { return d; })
        .html(function(d) { return d; })
*/

      // Highlight 
      var label_litems = d3.select(vars.container).selectAll(".items").data([vars.var_id])
        .enter()
          .append("label")
          .attr("class", "items")

      label_litems.append("select")
        .attr("id", "select_items")
        .style("width", vars.width/2)
        .on("change", function(d, i) {

          // Focus on a sepecifc item
          var id_focus = new_data.map(function(d) {return d[vars.var_text]; }).indexOf(this.value);
          visualization.focus(1);

          d3.select("#viz").call(visualization);

        })
        .selectAll("option")
        .data(new_data)
      .enter()
        .append("option")
        .attr("value", function(d) { return d[vars.var_text]; })
        .html(function(d) { return d[vars.var_text]; })

      d3.select(vars.container).selectAll(".clearSelection").data([vars.var_id]).enter().append("button")
             .attr("type", "button")
             .attr("class", "clearSelection")
             .on("click", function() {

                vars.svg.selectAll(".selected").classed("selected", false);
                vars.selection = [];
                d3.select("#viz").call(visualization);

              })
             .html("Clear selection")

      d3.select(vars.container).selectAll(".clearHighlight").data([vars.var_id]).enter().append("button")
             .attr("type", "button")
             .attr("class", "clearHighlight")
             .on("click", function() {

                vars.svg.selectAll(".highlighted").classed("highlighted", false);
                vars.highlight = [];                
                d3.select("#viz").call(visualization);

              })
             .html("Clear highlight")

    }

      // d3.json("../data/exports_2012.json", function(error, data) {


     function update_filters(value, add) {
        if(vars.dev) console.log("[update_filters]", value);  
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
    if (!arguments.length) return vars.var_id;
    vars.var_id = x;
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

  chart.join = function(data, var_join) {

    if (!arguments.length) return vars.var_join;

    vars.var_join = var_join;

    join_data = data;

    // Go through all the dataset and merge with the current one
    data.forEach(function(d, i) {

      vars.data.forEach(function(e, j) {

        if( (d[vars.var_join] == e[vars.var_join]) && (d.year == 2011)) {

//          console.log("merge", d, e, merge(d, e));
          return  merge(d, e);

        }
      });
    });

    return chart;
  };

  chart.time = function(params) {
    if (!arguments.length) return vars.current_time;
    vars.var_time = params.var_time;
    vars.current_time = params.current_time;
    return chart;
  };

  chart.group = function(x) {
    if (!arguments.length) return vars.var_group;
    vars.var_group = x;
    return chart;
  };

  chart.text = function(x) {
    if (!arguments.length) return vars.var_text;
    vars.var_text = x;
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
  chart.var_x = function(x) {
    if (!arguments.length) return vars.var_x;
    vars.var_x = x;
    return chart;
  };

  chart.var_y = function(y) {
    if (!arguments.length) return vars.var_y;
    vars.var_y = y;
    return chart;
  };

  // DOTPLOT
  chart.x_type = function(x) {
    if (!arguments.length) return vars.x_type;
    vars.x_type = x;
    return chart;
  }; 

  chart.y_scale = function(x) {
    if (!arguments.length) return vars.y_scale;
    vars.y_scale = x;
    return chart;
  }; 

  chart.connect = function(x) {
    if (!arguments.length) return vars.var_connect;
    vars.var_connect = x;
    return chart;
  }; 

  // NODELINK
  chart.size = function(size) {
    if (!arguments.length) return vars.var_size;
    vars.var_size = size;
    return chart;
  };

  chart.links = function(links) {
    if (!arguments.length) return vars.links;
    vars.links = links;
    return chart;
  };

  chart.nodes = function(nodes) {
    if (!arguments.length) return vars.nodes;
    vars.nodes = nodes;
    return chart;
  };

  // MISC
  chart.items = function(size) {
    if (!arguments.length) return vars.items;
    vars.items = size;
    return chart;
  };

  chart.color = function(x) {
    if (!arguments.length) return vars.var_color;
    vars.var_color = x;
    return chart;
  };

  chart.share = function(x) {
    if (!arguments.length) return vars.var_share;
    vars.var_share = x;
    return chart;
  };

  // TODO: register those evens
  chart.on = function(x, params) {
    if (!arguments.length) return x;
    // Trigger the corresponding event
    vars.evt.register("highlightOn", function(d) { 
      params(d);
    });
    return chart;
  };

  chart.ui = function(x) {
    if (!arguments.length) return vars.ui;
    vars.ui = x;
    return chart;
  };

  chart.vars = function(x) {
    if (!arguments.length) return vars;
    vars = x;
    return chart;
  };

  // Generic parameters function
  chart.params = function(x) {
    if (!arguments.length) return vars;
    vars = merge(vars, x);
    return chart;
  };

  // Mouse hover
  chart.focus = function(x) {
    if (!arguments.length) return vars.focus;

    vars.focus = [x];

/* Smart but should be done for selection

    if(x instanceof Array) {
      vars.focus = x;
    } else {
      if(vars.focus.indexOf(x) > -1){
        vars.focus.splice(vars.focus.indexOf(x), 1)
      } else {
        vars.focus.push(x)
      }
    }
*/
    return chart;
  };


  // Pre-selected list of items by id
  chart.selection = function(selection) {
    if (!arguments.length) return vars.selection;
    vars.selection = selection;
    return chart;
  };

  // Mouse click
  chart.highlight = function(highlight) {
    if (!arguments.length) return vars.highlight;
    vars.highlight = highlight;
    return chart;
  };

  vars.evt.register = function(evt, f, d) {

    if(vars.dev) console.log("[vars.evt.register]", evt)

    if(typeof evt == "string")
      evt = [evt];

    evt.forEach(function(e) {
      if(typeof global.evt[e] == "undefined")
        global.evt[e] = [];
      
      global.evt[e].push([f,d]);
    })
  }

  vars.evt.call = function(evt, a) {

    if(vars.dev) console.log("[vars.evt.call]", evt, a)

    if(typeof global.evt[evt] == "undefined") {
      if(vars.dev) console.warn("No callback for event", evt, a)
      return;
    }

    global.evt[evt].forEach(function(e) {
      if(global.dev) console.log("[calling evt]", e)
      if(typeof(e[0]) != "undefined")
        e[0](a)
    });
  }

  return chart;
}

// UTIS FUNCTIONS

// http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically
var merge = function() {
    var obj = {},
        i = 0,
        il = arguments.length,
        key;
    for (; i < il; i++) {
        for (key in arguments[i]) {
            if (arguments[i].hasOwnProperty(key)) {
                obj[key] = arguments[i][key];
            }
        }
    }
    return obj;
};

function flattenYears(data) {
    var flat = [];

    //for each country
    data.forEach(function(root) {
        //for each year in each country
        root.years.forEach(function(year) {
            //extend the year object with the common properties stored just once in the country object

          var current_year = merge(root, year);
          delete current_year.years;

            //add it to the final flat array
            flat.push(current_year);
        })
    });

    return flat;
}


// One way to wrap text.. but creates too many elements..
// http://bl.ocks.org/mbostock/7555321

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