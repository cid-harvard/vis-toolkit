  vistk.utils.items_group = function(d, i) {

    d3.select(this).attr("class", "mark__group")
                    .classed("highlighted", function(d, i) { return d.__highlighted; })
                    .classed("selected", function(d, i) { return d.__selected; })
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

  vistk.utils.connect_group = function(d, i) {

    d3.select(this).attr("class", "connect__group")
                    .classed("highlighted", function(d, i) { return d.__highlighted; })
                    .classed("selected", function(d, i) { return d.__selected; })
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
  /*
    Main function to draw marks 
    Invoked from a .each() call passing in the current datum d and index i, 
    with the this context of the current DOM element

    params contains the parameters for the current graphical mark to draw 
    e.g. scales, type of mark, radius, color function, ..
  */
  vistk.utils.draw_mark = function(selection, params) {

    selection.each(function(d) {

      var params_type = params.type;

      // In case a function determines the type of mark to be used
      if(typeof params_type === "function") {
        params_type = params.type(d[params.var_mark]);
      }

      if(typeof params.rotate === "undefined")
        params.rotate = 0;

      if(typeof params.translate === "undefined") {
        params.translate = [0, 0];
      }

      switch(params_type) {

        case "text":

          if(typeof params.text_anchor === "undefined") {
            params.text_anchor = "start";
          }

          // Supporting multipe text elements
          var mark_id = vars.items[0].marks.indexOf(params);

          var mark = d3.select(this).selectAll(".items__mark__text.items_"+mark_id).data([d]);

          mark.enter().append("text")
              .classed("items__mark__text", true)
              .classed("items_"+mark_id, true)
              .style("text-anchor", params.text_anchor)
              .attr("x", 10)
              .attr("y", 0)
              .attr("dy", ".35em");

          mark
              .classed("highlighted", function(d, i) { return d.__highlighted; })
              .classed("selected", function(d, i) { return d.__selected; })   
              .transition()
              .attr("transform", "translate(" +  params.translate + ")rotate(" +  params.rotate + ")")
              .text(function(d) { 
                return vars.accessor_data(d)[vars.var_text]; 
              });

        break;

      case "rect":

        var mark = d3.select(this).selectAll(".items__mark__rect").data([d]);

        mark.enter()
                .append("rect")                            
                  .attr("x", -vars.mark.width/2)
                  .attr("y", -vars.mark.height/2)
                  .classed("items__mark__rect", true)
                  .attr("transform", "rotate(0)")
                  .style("fill", function(d) { return vars.color(d[vars.var_color]); });

        mark
            .attr("height", params.height)
            .attr("width", params.width)
//            .attr("x", -vars.mark.width/2)
            .attr("y", params.y)
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

        case "tick":

          // Supporting multiple ticks marks
          var mark_id = vars.items[0].marks.indexOf(params);

          var mark = d3.select(this).selectAll(".items__mark__tick.items_"+mark_id).data([d]);

          mark.enter().append('line')
              .classed('items__mark__tick', true)
              .classed("items_"+mark_id, true)
              .attr("x1", function(d) { return 0; })
              .attr("y1", function(d) { return -20; })
              .attr("x2", function(d) { return 0; })
              .attr("y2", function(d) { return 20; })
              .attr("transform", "translate(0,0)rotate(0)");

          mark              
              .classed("highlighted", function(d, i) { return d.__highlighted; })
              .classed("selected", function(d, i) { return d.__selected; })
              .transition().duration(vars.duration)
              .attr("transform", function(d) {

                if(typeof params.translate === "function") {
                  params_translate = params.translate(d);
                } else {
                  params_translate = params.translate;
                }

                return "translate(" +  params_translate + ")rotate(" +  params.rotate + ")";
              });

        break;

        case "shape":

          var mark = d3.select(this).selectAll(".items__mark__shape").data([d]);

          mark.enter().insert("path")
                        .attr("class", "country")
                        .classed('items__mark__shape', true)
                        .attr("title", function(d,i) {
                          active = d3.select(null); 
                          return d.name; 
                        })

          mark
              .classed("highlighted", function(d, i) { return d.__highlighted; })
              .classed("selected", function(d, i) { return d.__selected; })
              .attr("d", vars.path)
              .attr("transform", function(d) {

                // Drawing projects comes with automatic offset
                d.x = d3.select(this).node().getBBox().x;
                d.y = d3.select(this).node().getBBox().y;

                // Update parent with new coordinates
                d3.select(d3.select(this).node().parentNode).attr("transform", "translate("+ d.x +", "+ d.y +")");

                return "translate("+ -d.x +", "+ -d.y +")";
              })
              .style("fill", function(d, i) { 
                return params.fill(vars.accessor_data(d)[vars.var_color]);
              })
              .on("click", clicked);

              // http://bl.ocks.org/mbostock/4699541
              function clicked(d) {
                if (active.node() === this) return reset();
                active.classed("active", false);
                active = d3.select(this).classed("active", true);

                var bounds = vars.path.bounds(d),
                    dx = bounds[1][0] - bounds[0][0],
                    dy = bounds[1][1] - bounds[0][1],
                    x = (bounds[0][0] + bounds[1][0]) / 2,
                    y = (bounds[0][1] + bounds[1][1]) / 2,
                    scale = .9 / Math.max(dx / vars.width, dy / vars.height),
                    translate = [vars.width / 2 - scale * x, vars.height / 2 - scale * y];

                vars.svg.transition()
                    .duration(750)
                    .style("stroke-width", 1.5 / scale + "px")
                    .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
              }

              function reset() {
                active.classed("active", false);
                active = d3.select(null);

                vars.svg.transition()
                    .duration(750)
                    .style("stroke-width", "1.5px")
                    .attr("transform", "");
              }

          break;

        case "line":

          var mark = d3.select(this).selectAll(".connect__line").data([d]);

          mark.enter().append('line')
              .classed('connect__line', true);

          mark              
              .classed("highlighted", function(d, i) { return d.__highlighted; })
              .classed("selected", function(d, i) { return d.__selected; })
              .attr("x1", function(d) { return vars.x_scale[0]["func"](d.source.x); })
              .attr("y1", function(d) { return vars.y_scale[0]["func"](d.source.y); })
              .attr("x2", function(d) { return vars.x_scale[0]["func"](d.target.x); })
              .attr("y2", function(d) { return vars.y_scale[0]["func"](d.target.y); })
              //.attr("class", function(d) {
              //  if(typeof d.source !== "undefined" && typeof d.target !== "undefined")
              //    return "link source_"+d.source.id+" target_"+d.target.id;
              //})

          break;

        case "path":

          var this_accessor_values = function(d) { return d.values; };
          
          var mark = d3.select(this).selectAll(".connect__path").data([d]);

          mark.enter().append('path')
              .classed('connect__path', true)
              .style("fill", params.fill)
              .style("stroke", params.stroke);

          mark              
              .classed("highlighted", function(e, j) { return e.__highlighted; })
              .classed("selected", function(e, j) { return e.__selected; })
              .attr('d', function(e) { return params["func"](e.values); });

        break;

        case "sparkline":

          // TODO: pass custom parameters in there (grid sparkline)
          // LOAD CHART PARAMS

          scope = {};
          scope = vistk.utils.merge(scope, vars)

          scope = vars.default_params["sparkline"](scope);

          scope.var_x = "year"
          scope.var_y = "realgdp"

          scope.width = scope.width / 2;

          scope.x_scale[0]["func"].domain(d3.extent(d.values, function(d) {
           return d[scope.var_x]; 
          }))
          .range([0, 50]);

          scope.y_scale[0]["func"].domain(d3.extent(d.values, function(d) {
           return d[scope.var_y]; 
          }))
          .range([0, 50]);

          scope.connect = [{
            marks: [{
                type: "path",
                rotate: "10",
                stroke: function(d) { return "black"; },
                func: d3.svg.line()
                     .interpolate(scope.interpolate)
                     .x(function(d) { return scope.x_scale[0]["func"](d[scope.var_x]); })
                     .y(function(d) { return scope.y_scale[0]["func"](d[scope.var_y]); }),
              }]
          }]

          // PRE-UPDATE CONNECT
          var gConnect = d3.select(this).selectAll(".connect__group")
                          .data([d], function(d, i) { return i; })
        
          // ENTER CONNECT
          var gConnect_enter = gConnect.enter()
                          .append("g")
                          .attr("class", "connect__group")
                          .attr("transform", "translate(0,0)")
                         // .attr("transform", function(d) {
                         //   return "translate(" + (vars.x_scale[0]["func"](d.values[0][vars.var_x])-5) + ", " + (vars.y_scale[0]["func"](d.values[0][vars.var_y])/1.25-5) + ")";
                         // });

          // APPEND CONNECT MARK
          scope.connect.forEach(function(connect) {
            connect.marks.forEach(function(params) {
              gConnect_enter.call(vistk.utils.draw_mark, params);
              gConnect.call(vistk.utils.draw_mark, params);
            });
          });

        break;

        case "dotplot":

          scope = {};
          scope = vistk.utils.merge(scope, vars);

          scope = vars.default_params["dotplot"](scope);

          scope.var_x = "realgdp";
          scope.var_y = "realgdp";

          scope.margin = {top: 10, right: 10, bottom: 30, left: 30};

          scope.width = vars.width / 2;
          scope.height = vars.height / 2;

          scope.x_scale[0]["func"].range([scope.height/2, scope.height/2])
            .domain([0, d3.max(vars.new_data, function(d) { return d[scope.var_x]; })])
            .nice();

          scope.y_scale[0]["func"].range([scope.margin.left, scope.width-scope.margin.left-scope.margin.right])
            .domain([0, d3.max(vars.new_data, function(d) { return d[scope.var_y]; })])
            .nice();

          // PRE-UPDATE ITEMS
          var gItems = d3.select(this).selectAll(".mark__group")
                          .data(vars.new_data, function(d, i) { return d[scope.var_id]; });

          // ENTER ITEMS
          var gItems_enter = gItems.enter()
                          .append("g")
                          .each(vistk.utils.items_group)
                          .attr("transform", function(d, i) {
                            return "translate(" + scope.x_scale[0]["func"](d[scope.var_x]) + ", " + scope.y_scale[0]["func"](d[scope.var_y]) + ")";
                          });

          // APPEND AND UPDATE ITEMS MARK
          scope.items[0].marks.forEach(function(params) {
            gItems_enter.call(vistk.utils.draw_mark, params);
            gItems.call(vistk.utils.draw_mark, params);
          });

        break;

        case "dotplot_vertical":

          var dotplot_params = vars.default_params["dotplot_vertical"];

          var chart = d3.select(this).selectAll(".items__chart__dotplot").data([d]);

          chart.enter().append('g')
              .classed('items__chart__dotplot', true)
              .call(vistk.utils.create_chart, dotplot_params);

          // Adjust the parameters it inehrited

          // Trigger the cart creation function

        break;

        case "star":

          var star = d3.superformula()
              .type("star")
              .size(10 * 50)
              .segments(360);

          var mark = d3.select(this).selectAll(".items__mark__star").data([d]);

          mark.enter().append('path')
              .classed('items__mark__star', true)
              .attr('d', star);

          mark              
              .classed("highlighted", function(d, i) { return d.__highlighted; })
              .classed("selected", function(d, i) { return d.__selected; });

          mark.exit().remove();

        break;


        case "none":
        break;

        case "circle":
        default:

          var mark = d3.select(this).selectAll(".items__mark__circle").data([d]);

          mark.enter().append("circle")
                      .classed("items__mark__circle", true)
                      .attr("cx", 0)
                      .attr("cy", 0)
                      .attr("transform", "rotate(0)")
                      .attr("r", function(d) {
                        if(typeof params.var_r === "undefined") {
                          return vars.radius;
                        } else {

                          var r_scale = d3.scale.linear()
                            .range([4, 20])
                            .domain(d3.extent(vars.new_data, function(d) { return d[params.var_r]; }))

                          return r_scale(d[params.var_r]);
                        }
                      })
                      .attr("fill", params.fill);

          mark
             // .attr("r", function(d) {return params.radius; })
             // .attr("fill", params.fill)
              .classed("highlighted", function(d, i) { return d.__highlighted; })
              .classed("selected", function(d, i) { return d.__selected; });

          mark.exit().remove();

          break;

      }

    });

  }

  vistk.utils.create_chart = function(_, params) {

    console.log("Creating chart with params", params, _, d3.select(this));

    // PRE-UPDATE ITEMS
    var gItems = _.selectAll(".mark__group")
                    .data(vars.new_data, function(d, i) { return d[vars.var_id]; });

    // ENTER ITEMS
    var gItems_enter = gItems.enter()
                    .append("g")
                    .each(vistk.utils.items_group)
                    .attr("transform", function(d, i) {
                      return "translate(" + vars.x_scale[0]["func"](d[vars.var_x]) + ", " + vars.y_scale[0]["func"](d[vars.var_y]) + ")";
                    });

    // APPEND AND UPDATE ITEMS MARK
    params.items[0].marks.forEach(function(params) {
      gItems_enter.call(vistk.utils.draw_mark, params);
      gItems.call(vistk.utils.draw_mark, params);
    });

  }

  vistk.utils.items_mark = function(d, i) {

    // Default mark if not specified
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
                  .attr("x", -vars.mark.width/2)
                  .attr("y", -vars.mark.height/2)
                  .attr("x", vars.mark.x)
                  .attr("y", vars.mark.y)
                  .classed("items__mark__rect", true)
                  .attr("transform", "rotate(0)")
                  .style("fill", function(d) { return vars.color(d[vars.var_color]); });

        mark
            .attr("height", vars.mark.height)
            .attr("width", vars.mark.width)
            .attr("x", vars.mark.x)
            .attr("y", vars.mark.y)
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
            // .call(drag);

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

        // In case other marks already exist
        d3.select(this).selectAll(".items__mark__rect").remove();
        d3.select(this).selectAll(".items__mark__diamond").remove();

        var mark = d3.select(this).selectAll(".items__mark__circle").data([d]);

        mark.enter().append("circle")
                    .classed("items__mark__circle", true)
                    .attr("cx", 0)
                    .attr("cy", 0)
                    .attr("transform", "rotate(0)");

        mark
            .attr("r", vars.mark.radius)
            .attr("fill", vars.mark.fill)
            .classed("highlighted", function(d, i) { return d.__highlighted; })
            .classed("selected", function(d, i) { return d.__selected; });

        break;

    }

  }

  vistk.utils.connect_mark = function(d) {

    var context = d3.select(this).property("__context__");

    if(typeof vars.connect != "undefined") {

      switch(vars.connect.type) {

        case "line":

          var mark = d3.select(this).selectAll(".connect__line").data([d]);

          mark.enter().append('line')
              .classed('connect__line', true)
              .attr("x1", function(d) { return vars.x_scale[0]["func"](d.source.x); })
              .attr("y1", function(d) { return vars.y_scale[0]["func"](d.source.y); })
              .attr("x2", function(d) { return vars.x_scale[0]["func"](d.target.x); })
              .attr("y2", function(d) { return vars.y_scale[0]["func"](d.target.y); });

          mark              
              .classed("highlighted", function(d, i) { return d.__highlighted; })
              .classed("selected", function(d, i) { return d.__selected; });

          break;

        case "path":
        default:

          var mark = d3.select(this).selectAll(".connect__path").data([d]);

          mark.enter().append('path')
              .classed('connect__path', true)
              .style("fill", vars.mark.fill)
              .style("stroke", vars.mark.stroke);

          mark              
              .classed("highlighted", function(d, i) { return d.__highlighted; })
              .classed("selected", function(d, i) { return d.__selected; })
              .attr('d', function(d) {
                return vars.connect[0].marks[0]["func"](vars.accessor_values(d));
              });

        break;
      }
    }
  }

  vistk.utils.x_axis = function(d, i) {

    vars.x_axis = vistk.utils.make_x_axis();

    vars.svg.selectAll(".x.axis").data([vars.new_data])
      .enter()
        .insert("g", ":first-child")
        .attr("class", "x axis")
        .attr("transform", "translate(" + vars.x_axis_translate + ")")
        .style("display", function() { return vars.x_axis_show ? "block": "none"; })
      .append("text")
        .attr("class", "label")
        .attr("x", vars.width-vars.margin.left-vars.margin.right)
        .attr("y", -6)
        .style({
          "text-anchor": "end",
          "display": function(d) {
            if(vars.x_text)
              return "block";
            else
              return "none";
          }
        })
        .text(vars.var_x);

    vars.svg.selectAll(".x.axis").transition()
        .duration(vars.duration)
        .call(vars.x_axis);

  }

  vistk.utils.y_axis = function(d, i) {

    vars.y_axis = vistk.utils.make_y_axis();

    vars.svg.selectAll(".y.axis").data([vars.new_data])
      .enter()
        .insert("g", ":first-child")
        .attr("class", "y axis")
        .attr("transform", "translate(" + vars.y_axis_translate + ")")
        .style("display", function() { return vars.y_axis_show ? "block": "none"; })
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style({
          "text-anchor": "end",
          "display": function(d) {
            return typeof vars.y_text !== "undefined" && vars.y_text !== null;
          }
        })
        .text(vars.var_y);

    vars.svg.selectAll(".y.axis").transition()
        .duration(vars.duration)
        .call(vars.y_axis);

  }

  vistk.utils.make_x_axis = function() {        
    return d3.svg.axis()
        .scale(vars.x_scale[0]["func"])
        .ticks(vars.x_ticks)
        // Quick fix to get max value
        .tickValues(vars.x_tickValues)
        .tickFormat(vars.x_format)
        .tickSize(vars.tickSize)
        .tickPadding(vars.tickPadding)
        .orient(vars.x_axis_orient);
  }

  vistk.utils.make_y_axis = function() {        
    return d3.svg.axis()
        .scale(vars.y_scale[0]["func"])
        .ticks(vars.y_ticks)
        // Quick fix to get max value
        .tickValues(vars.y_tickValues)
        .tickFormat(vars.y_format)
        .tickSize(vars.y_tickSize)
        .tickPadding(vars.y_tickPadding)
        .orient("left");
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

  // UTILS FUNCTIONS

  // http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically
  vistk.utils.merge = function(d, e) {

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

      if(typeof d3.select(this).data()[0].name == "undefined")
        return;

      var width = d3.select(this).data()[0].dx;

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

    // if(typeof res == "undefined")
     // console.log("id not found", id)

    return res;
  }

  vistk.utils.find_data_by_id = function(id) {
    var res = vars.new_data.filter(function(d) {
      return d[vars.var_id] == +id;
    })[0];

    // if(typeof res == "undefined")
    //  console.log("Data id not found", id)

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

            var current_year = vistk.utils.merge(root, year);
            delete current_year.years;

              //add it to the final flat array
              flat.push(current_year);
          })
      });

      return flat;
  }

  // UTIS FUNCTIONS

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
        .duration(vars.duration)
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

  vistk.utils.find_node_coordinates_by_id = function(nodes, id) {

    var res = nodes.filter(function(d) {
      return d.id == id;
    })[0];

    // If we can't find product in the graph, put it in the corner
    if(typeof res == "undefined") {
      // res = {x: 500+Math.random()*400, y: 1500+Math.random()*400};
       res = {x: 1095, y: 1675};
    }

    return res;
  } 

