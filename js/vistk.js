var vistk = window.vistk || {};
window.vistk = vistk;

vistk.version = "0.0.0.1";
vistk.dev = true;
vistk.utils = vistk.utils || {};

vistk.viz = function() {

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
    year: null,
    title: "",
    focus: [],
    nesting: null,
    nesting_aggs: {},
    type: "table",

    width: 1000,
    height: 600,

    margin: {top: 20, right: 150, bottom: 30, left: 40},

    var_text: "name",

    // Interaction
    focus: [],
    selections: [],
    filter: [],
    aggregate: [],
    time_current: 0,

    // PRIVATE (set automatically)

    // TABLE
    columns: [],
    sort_by: {'column': 'name', 'asc': true},

    // DOTPLOT
    x_scale: "linear",

    var_color: null,
    color: d3.scale.category20c(),

    accessor_year: function(d) { return d; },

    // Container
    svg: null,
  }


 // vars.parent = d3.select(vars.container);

  if (vars.dev) console.log("Init")

	if (!vars.data) vars.data = []

	// Constructor
	chart = function(selection) {	

    if(!vars.svg && vars.type != "table") {
     
      vars.svg = d3.select(vars.container).append("svg")
          .attr("width", vars.width)
          .attr("height", vars.height)
        .append("g")
          .attr("transform", "translate(" + vars.margin.left + "," + vars.margin.top + ")");
/*
var margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = 1060 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
*/

   //   vars.width = vars.width - vars.margin.left - vars.margin.right;
   //   vars.height = vars.height - vars.margin.top - vars.margin.bottom;

    }

    // Get a copy of the whole dataset
    new_data = vars.data;

    // Filter data by time
    if(typeof vars.var_time != "undefined") {

      new_data = new_data.filter(function(d) {
        return d[vars.var_time] == vars.current_time;
      })

    }

    // Filter data by attribute
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

          aggregation[vars.x_var] = d3.mean(leaves, function(d) {
            return d[vars.x_var];
          });

          aggregation[vars.y_var] = d3.mean(leaves, function(d) {
              return d[vars.y_var];
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
        d3.select(vars.container).append("span")
          .html(JSON.stringify(vars.data));

      } else if(vars.type == "table") {

      d3.select(vars.container).select("table").remove();

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

            return vars.year;

          }
          */
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
             // paint_zebra_rows(tbody.selectAll("tr.row"));

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

              // TODO: what is below belongs to the focus interaction!
              // Shoul be isolated with a proper interface
              
              // Highlight the current row (which is a parent of the current cell)
              d3.select(this.parentNode)
                .style("background-color", "#F3ED86");
          
            }).on("mouseout", function() {

              // TODO: what is below belongs to the focus interaction!
              
              // Reset highlight all the rows (not the cells)
              tbody.selectAll("tr")
                .style("background-color", null)

            });

        }

       // Function that orders the rows of the table
        function sort_by(header) {

          if(vars.debug) console.log("[sort_by]", header);

          vars.sort_by.column = header;
          var is_sorted = vars.sort_by.is_sorted;
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
              return is_sorted ? ascending : - ascending;
            });

          // For the others, we sort numerical values
          } else {

            tbody.selectAll("tr").sort(function(a, b) {

              a = vars.accessor_year(a)[header];
              b = vars.accessor_year(b)[header];
              var ascending =  a > b ? 1 : a == b ? 0 : -1;

              return is_sorted ? ascending : - ascending;
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

        // If no column have been specified, take all columns
        // vars.columns = d3.keys(vars.data[0])

        // Basic dump of the data we have
        create_table(new_data)

        // Now update the table

        // ENTER

        // REMOVE

        // UPDATE

      } else if(vars.type == "treemap") {

        // THIS IS what the data should look like
        var test_data = [{
         "name": "flare",
         "children": [
          {
           "name": "analytics",
           "children": [
            {
             "name": "cluster",
             "children": [
              {"name": "AgglomerativeCluster", "size": 3938},
              {"name": "CommunityStructure", "size": 3812},
              {"name": "HierarchicalCluster", "size": 6714},
              {"name": "MergeEdge", "size": 743}
             ]
            },
            {
             "name": "cluster",
             "children": [
              {"name": "AgglomerativeCluster", "size": 3938},
              {"name": "CommunityStructure", "size": 3812},
              {"name": "HierarchicalCluster", "size": 6714},
              {"name": "MergeEdge", "size": 743}
             ]
            }
          ]
         }]
        }];

        r = {}
        r.name = "root";
        groups = []

        new_data.filter(function(d, i) { return d.world_trade > 1000000; }).map(function(d, i) {

          if(typeof groups[data.attr_data[d.product_id].code[0]] == "undefined") {
            console.log("new")
            groups[data.attr_data[d.product_id].code[0]] = [];
          }

          //groups[data.attr_data[d.product_id].code[0]]
          //.push({name: d.product_id, size: d.world_trade, attr: data.attr_data[d.product_id], group: +data.attr_data[d.product_id].code[0], year: d.year});

        })

        child = groups.map(function(d, i) {

          node = {};
          node.name = i;

          node.children = d.map(function(e, j) {
            return {name: e.attr.name, size: e.size, group: e.group, year: e.year}
          })

          return node;
        })

        r.children = child;

        var treemap = d3.layout.treemap()
            .padding(4)
            .size([vars.width, vars.height])
            .value(function(d) { return d[vars.var_size]; });

        var cell = vars.svg.data([r]).selectAll("g")
            .data(treemap.nodes)
          .enter().append("g")
            .attr("class", "cell")
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

        cell.append("rect")
            .attr("width", function(d) { return d.dx; })
            .attr("height", function(d) { return d.dy; })
            .style("fill", function(d) {
             return d.children ? vars.color(d[vars.var_color]) : null; 
            })
            .on("mouseover", function(d, i) {

              // TODO: what is below belongs to the focus interaction!
              // Shoul be isolated with a proper interface
              
              // Highlight the current row (which is a parent of the current cell)
              d3.select(this.parentNode)
                .style("background-color", "#F3ED86");
          
            }).on("mouseout", function() {

              // TODO: what is below belongs to the focus interaction!
              
              // Reset highlight all the rows (not the cells)
              d3.select(this)
                .style("background-color", null)

            });

        cell.append("text")
            .attr("x", function(d) { return 10; })
            .attr("y", function(d) { return 10; })
            .attr("dy", ".35em")
            .attr("text-anchor", "left")
            .text(function(d) { return d.children ? null : d[vars.var_text]; })
           // .call(wrap)

      } else if(vars.type == "scatterplot") {

        // Original scatterplot from http://bl.ocks.org/mbostock/3887118

        var x = d3.scale.linear()
            .range([vars.margin.left, vars.width-vars.margin.left-vars.margin.right]);

        var y = d3.scale.linear()
            .range([vars.height-vars.margin.top-vars.margin.bottom, vars.margin.top]);

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
            .text(vars.current_time);

          x.domain([0, d3.max(vars.data, function(d) { return d[vars.x_var]; })]).nice();
          y.domain([0, d3.max(vars.data, function(d) { return d[vars.y_var]; })]).nice();

          vars.svg.selectAll(".x.axis").data([new_data]).enter().append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + (vars.height-vars.margin.bottom-vars.margin.top) + ")")              
            .append("text")
              .attr("class", "label")
              .attr("x", vars.width-vars.margin.left-vars.margin.right)
              .attr("y", -6)
              .style("text-anchor", "end")
              .text(function(d) { return vars.x_var; })

          vars.svg.selectAll(".y.axis").data([new_data]).enter().append("g")
              .attr("class", "y axis")
              .attr("transform", "translate("+vars.margin.left+", 0)")              
            .append("text")
              .attr("class", "label")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text(function(d) { return vars.y_var; })

          vars.svg.selectAll(".x.axis").call(xAxis)
          vars.svg.selectAll(".y.axis").call(yAxis)

          var gPoints = vars.svg.selectAll(".points")
                          .data(new_data, function(d) { return d.name; });

          // Here we want to deal with aggregated datasets
          if(vars.aggregate == vars.var_group) {

            var gPoints_enter = gPoints.enter()
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

            vars.svg.selectAll(".points")
                            .transition()
                            .attr("transform", function(d) {
                              return "translate("+x(d[vars.x_var])+", "+y(d[vars.y_var])+")";
                            })

          // Reg
          } else { 

            var gPoints_enter = gPoints.enter()
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

            var dots = gPoints_enter.append("circle")
              .attr("r", 5)
              .attr("cx", 0)
              .attr("cy", 0)
  //            .style("fill", function(d) { return d.color; })
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

            vars.svg.selectAll(".points")
                            .transition()
                            .attr("transform", function(d) {
                              return "translate("+x(d[vars.x_var])+", "+y(d[vars.y_var])+")";
                            })

          }

      } else if(vars.type == "dotplot") {

        // Original scatterplot from http://bl.ocks.org/mbostock/3887118

         x = d3.scale.linear()
            .range([vars.margin.left, vars.width-vars.margin.left-vars.margin.right]);

        var y = d3.scale.linear()
            .range([vars.height-vars.margin.top-vars.margin.bottom, vars.margin.top]);

        x.domain([0, d3.max(new_data, function(d) { return d[vars.x_var]; })]).nice();
        y.domain([0, d3.max(new_data, function(d) { return d[vars.y_var]; })]).nice();

        if(vars.x_scale == "index") {

          x = d3.scale.ordinal()
                .domain(d3.range(new_data.length))
                .rangeBands([vars.margin.left, vars.width-vars.margin.left-vars.margin.right]);

            new_data.sort(function ascendingKey(a, b) {
              return d3.ascending(a[vars.x_var], b[vars.x_var]);
            })
            .forEach(function(d, i) {
              d.rank = x(i);
            })

        } 

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
            .attr("y", 144)
            .attr("x", 500)
            .text(vars.current_time);

        vars.svg.selectAll(".x.axis").data([new_data]).enter().append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (vars.height-vars.margin.bottom-vars.margin.top) + ")")              
          .append("text")
            .attr("class", "label")
            .attr("x", vars.width-vars.margin.left-vars.margin.right)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text(function(d) { return vars.x_var; })

        vars.svg.selectAll(".y.axis").data([new_data]).enter().append("g")
            .attr("class", "y axis")
            .attr("transform", "translate("+vars.margin.left+", 0)")              
          .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(function(d) { return vars.y_var; })

        vars.svg.selectAll(".x.axis").call(xAxis)
        vars.svg.selectAll(".y.axis").call(yAxis)

        var gPoints = vars.svg.selectAll(".points")
                        .data(new_data, function(d, i) { return d[vars.var_text]; });

        var gPoints_enter = gPoints.enter()
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

        var dots = gPoints_enter.append("circle")
                        .attr("r", 5)
                        .attr("cx", 0)
                        .attr("cy", 0)
                        .style("opacity", .5)
                        .style("fill", function(d) { return "gray"; })

        var labels = gPoints_enter.append("text")
                        .attr("x", 10)
                        .attr("y", 0)
                        .attr("dy", ".35em")
                        .style("text-anchor", "start")
                        .attr("transform", "rotate(-30)")
                        .text(function(d) { return d[vars.var_text]; });

        // TODO: dispatch focus event here and highlight nodes
        if(vars.focus.length > 0) {

          dots
            .filter(function(d, i) {
              return i == vars.focus[0];
            })
            .style({"stroke": "black", "stroke-width": "3px", "opacity": 1})

          labels
            .filter(function(d, i) {
              return i == vars.focus[0];
            })
            .style({"stroke": "black", "stroke-width": ".9px", "opacity": 1})

        }            

        var gPoints_exit = gPoints.exit().style("opacity", .1);

        // Update all the remaining dots
        gPoints.style("opacity", 1)    

        if(vars.x_scale == "index") {

          vars.svg.selectAll(".points")
                          .transition()
                          .attr("transform", function(d, i) {
                            return "translate("+d.rank+", "+vars.height/2+")";
                          })

        } else {

          vars.svg.selectAll(".points")
                          .transition()
                          .attr("transform", function(d) {
                            return "translate("+x(d[vars.x_var])+", "+vars.height/2+")";
                          })
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

        // TODO
        // -Use t 

        var force = d3.layout.force()
            .charge(-120)
            .linkDistance(30)
            .size([vars.width, vars.height]);

        //d3.json("../data/product_space_hs4.json", function(raw) {

//          d3.json("../data/network_hs.json", function(graph) {

            var min_x = Infinity, max_x = 0;
            var min_y = Infinity, max_y = 0;

            vars.data.forEach(function(d, i) {

              d.id = i;

              if(d.x < min_x)
                min_x = d.x;

              if(d.y < min_y)
                min_y = d.y;

              if(d.x > max_x)
                max_x = d.x;

              if(d.y > max_y)
                max_y = d.y;

              d.category = d._id.slice(0, 2);   

            })

            vars.links.forEach(function(d, i) {

              d.source = new_data[d.source];
              d.target = new_data[d.target];

            })

            var x = d3.scale.linear()
                .range([0, vars.width]);

            var y = d3.scale.linear()
                .range([vars.height, 0]);

            x.domain([min_x, max_x]);
            y.domain([min_y, max_y]);

            var link = vars.svg.selectAll(".link")
                .data(vars.links)
              .enter().append("line")
                .attr("class", function(d) { 
                  return "link source_"+d.source._id+" target_"+d.target._id;
                })
                .style("stroke-width", function(d) { return Math.sqrt(d.value); })
                .style("opacity", .4);

            var node = vars.svg.selectAll(".node")
                .data(new_data, function(d) { return d._id});

            var node_enter = node.enter().append("circle")
                .attr("class", "node")
                .attr("id", function(d) { return "node_"+d._id; })
                .attr("r", 5)
                .style("fill", function(d) { 
                  return vars.color(d[vars.var_color]); 
                })
                .on("mouseenter",function(d,i){ 

                  // TODO: what is below belongs to the focus interaction!
                  // Shoul be isolated with a proper interface

                  // Highlight nodes
                  d3.selectAll(".node").style("opacity", 0)    
                  d3.select(this).style("opacity", 1)

                  // Highlight Links
                  d3.selectAll(".link").style("opacity", .1);
                  
                  d3.selectAll(".source_"+d._id).each(function(e) {
                    d3.select("#node_"+e.target._id).style("opacity", 1) 
                  })
                  .style("opacity", 1)
                  .style("stroke-width", function(d) { return 3; });

                  d3.selectAll(".target_"+d._id).each(function(e) {
                    d3.select("#node_"+e.source._id).style("opacity", 1) 
                  })
                  .style("opacity", 1)
                  .style("stroke-width", function(d) { return 3; })

                })
                .on("mouseleave",function(){

                  // TODO: what is below belongs to the focus interaction!
                  // Shoul be isolated with a proper interface

                  d3.selectAll(".node").style("opacity", 1)
                  d3.selectAll(".link")
                    .style("opacity", .4)
                    .style("stroke-width", function(d) { return 1; })
                });

            var node_exit = node.exit().remove("circle")

            link.attr("x1", function(d) { return x(d.source.x); })
                .attr("y1", function(d) { return y(d.source.y); })
                .attr("x2", function(d) { return x(d.target.x); })
                .attr("y2", function(d) { return y(d.target.y); })

            node.attr("cx", function(d) { return x(d.x); })
                .attr("cy", function(d) { return y(d.y); });

//          });


      } else if(vars.type == "linechart") {

        var parseDate = d3.time.format("%Y").parse;

        var x = d3.time.scale()
            .range([0, vars.width-100]);

        var y = d3.scale.linear()
            .range([0, vars.height-100]);

        var color = d3.scale.category10();

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        // FIX FOR MISSING VALUES
        // https://github.com/mbostock/d3/wiki/SVG-Shapes
        var line = d3.svg.line()
        // https://gist.github.com/mbostock/3035090
            .defined(function(d) { return d.rank != null; })
            .interpolate("basis")
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.rank); });

        // TODO: flatten the file

        color.domain(d3.keys(new_data[0]).filter(function(key) { return key !== "date"; }));

        new_data.forEach(function(d) {
          d.date = parseDate(d.year);
        });

        
        var min_max_years = d3.extent(new_data, function(d) { return d.date; });
        all_years = d3.set(new_data.map(function(d) { return d.year;})).values();

        // Find unique countrie
        countries = d3.set(new_data.map(function(d) { return d[vars.var_text]; })).values().map(function(c) {
          return {
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
          })
        })

        x.domain(min_max_years);

        y.domain([
          d3.min(countries, function(c) { return d3.min(c.values, function(v) { return v.rank; }); }),
          d3.max(countries, function(c) { return d3.max(c.values, function(v) { return v.rank; }); })
        ]);

        vars.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + vars.height + ")")
            .call(xAxis);

        vars.svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "-1.71em")
            .style("text-anchor", "end")
            .text("ECI Rank");

        var country = vars.svg.selectAll(".country")
            .data(countries)
          .enter()
            .append("g")
            .attr("class", "country");

        country.append("path")
            .attr("class", "country line")
            .attr("d", function(d) {
              console.log(d);
             return line(d.values); })
            .attr("id", function(d) { return d.name; })
            .attr("class", "country line")
            .style("stroke", function(d) { return color(d.name); });

        country.append("text")
            .datum(function(d) { 
              d.values.sort(function(a, b) { return a.year > b.year;}); 
              return {name: d.name, value: d.values[d.values.length - 1]}; 
            })
            .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.rank) + ")"; })
            .attr("x", 3)
            .attr("class", "country text")
            .attr("dy", ".35em")
            .attr("id", function(d) { return d.name; })
            .text(function(d) { return d.name; })

        vars.svg.selectAll(".country").on("mouseover", function(d) {

                d3.selectAll(".line:not(.selected)").style("opacity", 0.1);
                d3.selectAll(".text:not(.selected)").style("opacity", 0.1);

                d3.selectAll("#"+d.name).style("opacity", 1);

            })
            .on("mouseout", function(d) {
      //        if(d3.selectAll(".selected")[0].length == 0)
                d3.selectAll(".country:not(.selected)").style("opacity", 1);

            })

        vars.svg.selectAll("text.country").on("click", function(d) {
          console.log("Country selected", d)
          
          d3.selectAll("#"+d.name).classed("selected", !d3.selectAll("#"+d.name).classed("selected"));

        })

        vars.svg.select("svg").on("click", function(d) {
          console.log("Removing all selected countries")

          d3.selectAll(".selected").classed("selected", false);
          d3.selectAll(".line:not(.selected)").style("opacity", 1);
          d3.selectAll(".text:not(.selected)").style("opacity", 1);


        })

      } else if(vars.type == "geomap") {

        alert(vars.type)


      }

      // BUILDING THE UI elements

      d3.select(vars.container).selectAll(".break").data([vars.id]).enter().append("p").attr("class", "break");

      if(vars.var_group) {

        unique_categories = d3.set(vars.data.map(function(d) { return d[vars.var_group]; })).values();

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

      if(typeof vars.id == "object") {

        var label_radios = d3.select(vars.container).selectAll(".aggregations").data(vars.id)
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

        var label_slider = d3.select(vars.container).selectAll(".slider").data([vars.id])
          .enter()
            .append("label")
            .attr("class", "slider")

        // TODO: find time range
        label_slider.append("input")
                      .attr("type", "range")
                      .attr("class", "slider-random")
                      .property("min", 1995)
                      .property("max", 2013)
                      .property("value", 2013)
                      .attr("step", 1)
                      .on("input", function() {
                        vars.current_time = +this.value;
                        d3.select("#viz").call(visualization);
                      })
                      .style("width", "100px")

      }

      var label_loader = d3.select(vars.container).selectAll(".loader").data([vars.id])
        .enter()
          .append("label")
          .attr("class", "loader")

      label_loader.append("select")
        .attr("id", "select_x_var")
        .on("change", function(d) {
          vars.x_var = this.value;
          ds.update(vars.current_view);
        })
        .selectAll("option")
        .data(["../data/exports_2012.json"])
      .enter()
        .append("option")
        .attr("value", function(d) { return d; })
        .html(function(d) { return d; })


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


	chart.focus = function(x) {
	  if (!arguments.length) return vars.focus;

	  if(x instanceof Array) {
	    vars.focus = x;
	  } else {
	    if(vars.focus.indexOf(x) > -1){
	      vars.focus.splice(vars.focus.indexOf(x), 1)
	    } else {
	      vars.focus.push(x)
	    }
	  }

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

  // DOTPLOT
  chart.x_scale = function(x) {
    if (!arguments.length) return vars.x_scale;
    vars.x_scale = x;
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

	if(vars.dev)   
		console.log("update", chart.year())

  return chart;
}

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