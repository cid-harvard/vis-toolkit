  vistk.utils.items_group = function(d, i) {

    d3.select(this).attr("class", "mark__group")
                    .classed("highlighted", function(d, i) { return d.__highlighted; })
                    .on("mouseover",function(d) {
                      vars.evt.call("highlightOn", d);
                    })
                    .on("mouseleave", function(d) {
                      vars.evt.call("highlightOut", d);
                    })
                    .on("click", function(d) {
                       vars.evt.call("selection", d);
                    });

  }

  vistk.utils.items_mark = function(d, i) {

    if(typeof vars.mark === "undefined") {
      vars.mark = {};
      vars.mark.type = "circle";
    }

    var context = d3.select(this).property("__context__");

    switch(vars.mark.type) {

      case "rect":

        // In case the transition comes from a dot/scatter plot
        d3.select(this).selectAll(".items__mark__circle").remove();

        var mark = d3.select(this).selectAll(".items__mark__rect").data([d]);

        mark.enter()
                .append("rect")
                  .attr("height", vars.mark.height)
                  .attr("width", vars.mark.width)                              
                  .attr("x", -vars.mark.width/2)
                  .attr("y", -vars.mark.height/2)
                  .classed("items__mark__rect", true)
                  .attr("transform", "rotate(0)")
                  .style("fill", function(d) { return vars.color(d[vars.var_color]); });

        mark
            .classed("highlighted", function(d, i) { return d.__highlighted; })
            .classed("selected", function(d, i) { return d.__selected; });

        mark.exit().remove();

        break;

      case "diamond":

        var mark = d3.select(this).selectAll(".items__mark__diamond").data([d]);

        mark.enter().append("rect")
                  .attr("height", vars.mark.height)
                  .attr("width", vars.mark.width)                              
                  .attr("x", -vars.mark.width/2)
                  .attr("y", -vars.mark.height/2)
                  .classed("items__mark__diamond", true)
                  .attr("transform", "rotate(45)");

        mark
            .classed("highlighted", function(d, i) { return d.__highlighted; })
            .classed("selected", function(d, i) { return d.__selected; });

        break;

      case "arc":

        var arc = d3.svg.arc().outerRadius(function(d) {
          return vars.mark.radius;
        }).innerRadius(0);
        
        d3.select(this).append("path")
            .attr("fill", function(d, i) {
              return vars.color(d[vars.var_color]);
            })
            .style("fill-opacity", function(d, i) {
              if(d.i == 0)
                return .2;
              else
                return 1;
            })          
            .attr("d", arc);

        break;

      case "shape":

        d3.select(this).insert("path")
                        .attr("class", "country")    
                          .attr("title", function(d,i) { 
                            return d.name; 
                          })
                          .attr("d", vars.path)
                          .style("fill", function(d, i) { 
                            return vars.color(d.data[vars.var_color]);
                          });
        break;

      case "pie":

        d3.select(this).insert("path")
                        .attr("class", "country")    
                          .attr("title", function(d,i) { 
                            return d.name; 
                          })
                          .attr("d", vars.path)
                          /*
                          .style("fill", function(d, i) { 
                            return vars.color(d.data[vars.var_color]);
                          });
                          */
        break;

      case "text":

        if(typeof vars.mark.rotate === "undefined")
          vars.mark.rotate = 0;

        if(typeof vars.mark.translate === "undefined")
          vars.mark.translate = [0, 0];

        var drag = d3.behavior.drag()
            .on("drag", dragmove);

        function dragmove(d) {
            d3.select(this)
            .attr("transform", "translate(" + d3.event.x + "," + d3.event.y + ")rotate(" +  vars.mark.rotate + ")");
        }

       var mark = d3.select(this).selectAll(".items__mark__text").data([d]);

        mark.enter().append("text")
            .classed("items__mark__text", true)         
            .style("text-anchor", "start")
            .attr("x", 10)
            .attr("y", 0)
            .attr("dy", ".35em")
            .call(drag);

        mark
            .classed("highlighted", function(d, i) { return d.__highlighted; })
            .classed("selected", function(d, i) { return d.__selected; })   
            .transition()
            .attr("transform", "translate(" +  vars.mark.translate + ")rotate(" +  vars.mark.rotate + ")")
            .text(function(d) { 
              return vars.accessor_data(d)[vars.var_text]; 
            });

  /*
          // For pie chart wedges..
          arcs.append("text")
              .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
              .attr("dy", ".35em")
              .style("text-anchor", "middle")
              .text(function(d) { return d[vars.var_text]; });
  */

        break;

      case "circle":
      default:

        // In case the transition comes from a bar chart
        d3.select(this).selectAll(".items__mark__rect").remove();
        d3.select(this).selectAll(".items__mark__diamond").remove();      
        d3.select(this).selectAll(".items__mark__circle").remove();

        var mark = d3.select(this).selectAll(".items__mark__circle").data([d]);

        mark.enter().append("circle")
                    .classed("items__mark__circle", true)
                    .attr("r", vars.mark.radius)
                    .attr("cx", 0)
                    .attr("cy", 0)
                    .attr("transform", "rotate(0)")
                    .attr("fill", vars.mark.fill);

        mark
            .classed("highlighted", function(d, i) { return d.__highlighted; })
            .classed("selected", function(d, i) { return d.__selected; });


        break;

    }

  }

  vistk.utils.connect_group = function(d, i) {

    d3.select(this).attr("class", "connect__group")
                    .on("mouseover",function(d) {
                      vars.evt.call("highlightOn", d);
                    })
                    .on("mouseleave", function(d) {
                      vars.evt.call("highlightOut", d);
                    })
                    .on("click", function(d) {
                       vars.evt.call("selection", d);
                    });
  }

  vistk.utils.connect_mark = function(d) {

    var context = d3.select(this).property("__context__");

    if(typeof vars.connect != "undefined") {

      switch(vars.connect.type) {

        case "line":

          var mark = d3.select(this).selectAll(".connect__line").data([d]);

          mark.enter().append('line')
              .attr('class', 'connect__line')
              .attr("x1", function(d) { return vars.x_scale[0]["func"](d.source.x); })
              .attr("y1", function(d) { return vars.y_scale[0]["func"](d.source.y); })
              .attr("x2", function(d) { return vars.x_scale[0]["func"](d.target.x); })
              .attr("y2", function(d) { return vars.y_scale[0]["func"](d.target.y); });

          break;

        case "path":
        default:

          d3.select(this).append('path')
              .attr('class', 'connect__path')
              .style("fill", vars.mark.fill)
              .style("stroke", vars.mark.stroke)            
              .attr('d', function(d) {
                return vars.connect[0].marks[0]["func"](vars.accessor_values(d));
              });

        break;
      }

    }
  }

  vistk.utils.create_chart = function(g, config) {

    // Creates a new chart with the given config

    // Appends it to the current node

    d3.select(this)


  }

  vistk.utils.axis = function(d, i) {

    // TODO:
    // [ ] Find parameters
    // [ ] Type of axis (horizontal, vertical, ..)
    // [ ] Labels

    // TODO: make the X axis re-usable
    vars.x_axis = d3.svg.axis()
        .scale(vars.x_scale[0]["func"])
        .ticks(vars.x_ticks)
        // Quick fix to get max value
        .tickValues(vars.x_tickValues)
        .tickFormat(vars.x_format)
        .tickSize(vars.tickSize)
        .tickPadding(vars.tickPadding)
        .orient("bottom");

    vars.svg.selectAll(".x.axis").data([vars.new_data])
      .enter()
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (vars.height/2) + ")")
      .append("text")
        .attr("class", "label")
        .attr("x", vars.width-vars.margin.left-vars.margin.right)
        .attr("y", -6)
        .style({
          "text-anchor": "end",
          "display": function(d) { 
            return typeof vars.x_text !== "undefined" && vars.x_text !== null;
          }
        })
        .text(vars.var_x);

    vars.svg.selectAll(".x.axis").transition()
        .duration(vars.duration)
        .call(vars.x_axis);

  }

  vistk.utils.y_axis = function(d, i) {

    vars.y_axis = d3.svg.axis()
        .scale(vars.y_scale[0]["func"])
        .orient("left");

    vars.svg.selectAll(".y.axis").data([vars.new_data])
      .enter()
        .append("g")
        .attr("class", "y axis")
        .attr("transform", "translate("+vars.margin.left+", 0)")              
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(function(d) { return vars.var_y; });

    vars.svg.selectAll(".y.axis").transition()
        .duration(vars.duration)
        .call(vars.y_axis);

  }

  vistk.utils.grid = function(d, i) {

    // TODO:
    // [ ] Find parameters
    // [ ] Type of grid

  }

  vistk.utils.make_x_axis = function() {        
    return d3.svg.axis()
        .scale(vars.x_scale[0]["func"])
         .orient("bottom")
         .ticks(10);
  }


  vistk.utils.make_y_axis = function() {        
    return d3.svg.axis()
        .scale(vars.y_scale[0]["func"])
         .orient("left")
         .ticks(10);
  }

  vistk.utils.background_label = function() {

    vars.svg.selectAll(".title")
        .data([vars.new_data])
      .enter()
        .insert("text")
        .attr("class", "title")
        .attr("text-anchor", "middle")
        .attr("y", 0)
        .attr("x", vars.width/2)
        .text(vars.title);

  }


  // UTIS FUNCTIONS

  // http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically
  vistk.utils.merge = function() {
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

  // One way to wrap text.. but creates too many elements..
  // http://bl.ocks.org/mbostock/7555321

  vistk.utils.wrap = function(node) {

    node.each(function() {

      width = d3.select(this).data()[0].dx;

      var text = d3.select(this),
          words = d3.select(this).data()[0].name.split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr("y"),
          dy = 0, //parseFloat(text.attr("dy")),
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

  vistk.utils.find_node_by_id = function(id) {
    var res = vars.nodes.filter(function(d) {
      return d.id == id;
    })[0];

    if(typeof res == "undefined")
      console.log("id not found", id)

    return res;
  }

  vistk.utils.find_data_by_id = function(id) {
    var res = vars.new_data.filter(function(d) {
      return d[vars.var_id] == +id;
    })[0];

    if(typeof res == "undefined")
      console.log("Data id not found", id)

    return res;
  }

  vistk.utils.update_filters = function(value, add) {
    if(vars.dev) {
      console.log("[update_filters]", value);
    }

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

  // TODO: add accessor as argument and var_time
  vistk.utils.flatten_years = function(data) {
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

  vistk.utils.animate_trajectory = function(path, start_time, duration) {

    var totalLength = path.node().getTotalLength();

    path.attr("stroke-width", "5")
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
      .transition()
        .duration(duration)
        .ease("linear")
        .attr("stroke-dashoffset", 0)
  }

  // Credits: http://bl.ocks.org/mbostock/1705868
  vistk.utils.translate_along = function(path, duration) {
    var l = path.node().getTotalLength();
    return function(d, i, a) {
      return function(t) {
        var p = path.node().getPointAtLength(t * l);
        return "translate(" + p.x + "," + p.y + ")";
      };
    };
  }


