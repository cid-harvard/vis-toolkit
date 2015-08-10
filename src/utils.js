
  utils.items_group = function(d, i) {

    d3.select(this).attr("class", "mark__group mark__group_" + d._index_item)
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

  utils.connect_group = function(d, i) {

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
  utils.draw_mark = function(selection, params) {

    selection.each(function(d) {

      var params_type = params.type;

      // Default id for marks
      var mark_id = params._mark_id;

      // In case a function determines the type of mark to be used
      if(typeof params_type === "function") {
        params_type = params.type(d[params.var_mark]);
      }

      if(typeof params.rotate === "undefined") {
        params.rotate = 0;
      }

      if(typeof params.translate === "undefined" || params.translate == null) {
        params.translate = [0, 0];
      }

      // Use the global accessor
      var accessor_data = vars.accessor_data;

      switch(params_type) {

        case "text":

          if(typeof params.text_anchor === "undefined") {
            params.text_anchor = "start";
          }

          var items_mark_text = d3.select(this).selectAll(".items__mark__text.items_" + mark_id).data([d]);

          items_mark_text.enter().append("text")
              .classed("items__mark__text", true)
              .classed("items_" + mark_id, true)
              .style("text-anchor", params.text_anchor)
              .attr("x", 10)
              .attr("y", 0)
              .attr("dy", ".35em")
              .attr("transform", "translate(" +  params.translate + ")rotate(" +  params.rotate + ")");

          items_mark_text
              .classed("highlighted", function(d, i) { return d.__highlighted; })
              .classed("selected", function(d, i) { return d.__selected; })
              .transition().duration(vars.duration)
              .attr("transform", "translate(" +  params.translate + ")rotate(" +  params.rotate + ")")
              .text(function(d) {

                if(typeof params.text !== "undefined") {
                  return params.text(d);
                } else {
                  return vars.accessor_data(d)[vars.var_text]; 
                }

              });

        items_mark_text.exit().remove();

        break;

        case "divtext":

          var items_mark_divtext = d3.select(this).selectAll(".items__mark__divtext").data([d]);

          items_mark_divtext.enter().append("foreignObject")
                 .classed("items__mark__divtext", true)
                 .classed("items_" + mark_id, true)
                 .attr("width", function(d) {
                   if(typeof d.dx !== "undefined") {
                     return (d.dx - vars.padding) + "px";
                   } else {
                     return "150px";
                   }
                 })
                 .attr("height", function(d) {
                   if(typeof d.dy !== "undefined") {
                      return (d.dy - 2*vars.padding) + "px";
                    } else {
                      return "50px";
                    }
                  })
               .append("xhtml:body")
                 .style("font", "14px 'Helvetica Neue'")
               .append("div")
                 .style("padding-top", function(d) { return (vars.padding/2)+"px"; })
                 .style("width", function(d) { 
                   if(typeof d.dx !== "undefined") {
                     return (d.dx - 2*vars.padding) + "px";
                   } else {
                     return "150px";
                   }
                  })
                 .style("height", function(d) { 
                   if(typeof d.dy !== "undefined") {
                     return (d.dx - 2*vars.padding) + "px";
                   } else {
                    return "50px"; 
                  }
                  })
                 .style({"text-overflow": "ellipsis", "overflow": "hidden"})
                 .html(function(d) {
                   return vars.accessor_data(d)[vars.var_text];
                 });

          items_mark_divtext.exit().remove();

        break;


        case "image":

          var items_mark_image = d3.select(this).selectAll(".items__mark__image").data([d]);

          items_mark_image.enter().append("image")
                 .classed("items__mark__image", true)
                 .classed("items_" + mark_id, true)
             //    .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
                 .attr("xlink:href", params.href) 
                 .attr("x", 0)
                 .attr("y", 0)
                 .attr("width", 60)
                 .attr("height", 30);

          items_mark_image.exit().remove();

        break;

      case "rect":

        var items_mark_rect = d3.select(this).selectAll(".items__mark__rect").data([d]);

        items_mark_rect.enter().append("rect")                            
                  .classed("items__mark__rect", true)
                  .classed("items_" + mark_id, true)
                  .attr("x", params.x || 0)
                  .attr("y", params.y || 0)
                  .attr("height", params.height || 10)
                  .attr("width", params.width || 10)
                  .attr("transform", "rotate(0)")
                  .style("fill", function(d) { return vars.color(vars.accessor_items(d)[vars.var_color]); });

        items_mark_rect
            .classed("highlighted", function(d, i) { return d.__highlighted; })
            .classed("selected", function(d, i) { return d.__selected; })
            .transition().duration(vars.duration)
            .attr("x", params.x || 0)
            .attr("y", params.y || 0)
            .attr("height", params.height || 10)
            .attr("width", params.width || 10)
            .style("fill", function(d) { return vars.color(vars.accessor_items(d)[vars.var_color]); });

        items_mark_rect.exit().remove();

        break;

      case "diamond":

        var items_mark_diamond = d3.select(this).selectAll(".items__mark__diamond.items_" + mark_id).data([d]);

        items_mark_diamond.enter().append("rect")
            .classed("items__mark__diamond", true)
            .classed("items_" + mark_id, true)
            .attr("height", vars.mark.height)
            .attr("width", vars.mark.width)                              
            .attr("x", -vars.mark.width/2)
            .attr("y", -vars.mark.height/2)
            .attr("transform", "rotate(45)");

        items_mark_diamond
            .classed("highlighted", function(d, i) { return d.__highlighted; })
            .classed("selected", function(d, i) { return d.__selected; });

        items_mark_diamond.exit().remove();

        break;

        case "tick":

          var items_mark_tick = d3.select(this).selectAll(".items__mark__tick.items_" + mark_id).data([d]);

          items_mark_tick.enter().append('line')
              .classed('items__mark__tick', true)
              .classed("items_" + mark_id, true)
              .attr("x1", function(d) { return 0; })
              .attr("y1", function(d) { return -20; })
              .attr("x2", function(d) { return 0; })
              .attr("y2", function(d) { return 20; })
              .attr("transform", "translate(0,0)rotate(0)");

          items_mark_tick              
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

          items_mark_tick.exit().remove();

        break;

        case "shape":

          var items_mark_shape = d3.select(this).selectAll(".items__mark__shape").data([d]);

          items_mark_shape.enter().insert("path")
              .classed('items__mark__shape', true)
              .classed("items_" + mark_id, true)
              .attr("class", "country")
              .attr("title", function(d,i) {
                active = d3.select(null); 
                return d.name; 
              })
              .on("click", clicked);

          items_mark_shape
              .classed("highlighted", function(d, i) { return d.__highlighted; })
              .classed("selected", function(d, i) { return d.__selected; })
              .attr("d", vars.path)
              .transition().duration(vars.duration)
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

            items_mark_shape.exit().remove();

          break;

        case "arc":

          var arc = d3.svg.arc().outerRadius(function(d) {

            if(typeof vars.var_r === "undefined") {
              return vars.radius_max*20;
            } else {

              var r_scale = d3.scale.linear()
                .range([vars.radius_min, vars.radius_max*20])
                .domain(d3.extent(vars.new_data, function(d) { return vars.accessor_data(d)[vars.var_r]; }))

              return r_scale(vars.accessor_data(d)[vars.var_r]);
            } 

          }).innerRadius(0);

          var mark = d3.select(this).selectAll(".items__mark__arc").data([d]);

          mark.enter().append("path")
              .classed("items_" + mark_id, true)
              .classed("items__mark__arc", true)
              .attr("fill", function(d, i) {
                return vars.color(vars.accessor_data(d)[vars.var_color]);
              })
              .style("fill-opacity", function(d, i) {
                if(d.i == 0)
                  return .2;
                else
                  return 1;
              });

          mark
              .classed("highlighted", function(d, i) { return d.__highlighted; })
              .classed("selected", function(d, i) { return d.__selected; })
              .transition().duration(vars.duration)
              .attr("d", function(d) {
                return arc(d);
              });

        break;

        case "line":

          var mark = d3.select(this).selectAll(".connect__line").data([d]);

          // Make sure we have data for links
          if(typeof d.source == "undefined"  || typeof d.target == "undefined")
            return;

          mark.enter().append('line')
              .classed('connect__line', true)
              .classed("items_" + mark_id, true)
              .attr("x1", function(d) { return vars.x_scale[0]["func"](d.source.x); })
              .attr("y1", function(d) { return vars.y_scale[0]["func"](d.source.y); })
              .attr("x2", function(d) { return vars.x_scale[0]["func"](d.target.x); })
              .attr("y2", function(d) { return vars.y_scale[0]["func"](d.target.y); });

          mark
              .classed("highlighted", function(d, i) { return d.__highlighted; })
              .classed("selected", function(d, i) { return d.__selected; });

          break;


        case "line_horizontal":

          var mark = d3.select(this).selectAll(".mark__line_horizontal").data([d]);

          mark.enter().append('line')
              .classed('mark__line_horizontal', true)
              .classed("items_" + mark_id, true)
              .attr("x1", function(d) { return vars.x_scale[0]["func"].range()[0]; })
              .attr("y1", function(d) { return vars.y_scale[0]["func"](d[vars.var_y]); })
              .attr("x2", function(d) { return vars.x_scale[0]["func"].range()[1]; })
              .attr("y2", function(d) { return vars.y_scale[0]["func"](d[vars.var_y]); });

          mark
              .classed("highlighted", function(d, i) { return d.__highlighted; })
              .classed("selected", function(d, i) { return d.__selected; });

          break;

        case "path":

          var this_accessor_values = function(d) { return d.values; };
          
          if(typeof params['func'] == 'undefined') {
              params['func'] = d3.svg.line()
               .interpolate('linear')
               .x(function(d) { return vars.x_scale[0]["func"](d[vars.var_x]); })
               .y(function(d) { return vars.y_scale[0]["func"](d[vars.var_y]); });
          }

          var mark = d3.select(this).selectAll(".connect__path_" + mark_id).data([d]);

          mark.enter().append('path')
              .classed('connect__path', true)
              .classed('connect__path_' + mark_id, true)
              .classed("items_" + mark_id, true)
              .style("fill", params.fill)
              .style("stroke", params.stroke);

          mark              
              .classed("highlighted", function(e, j) { return e.__highlighted; })
              .classed("selected", function(e, j) { return e.__selected; })
              .transition().duration(vars.duration)
              .style("fill", params.fill)
              .style("stroke", params.stroke)
              .attr('d', function(e) {
                return params["func"](this_accessor_values(e)); 
              });

        break;

        case "sparkline":

          var scope = {};
          scope = vistk.utils.merge(scope, vars)

          scope = vars.default_params["sparkline"](scope);

          scope.var_x = 'year';
          scope.var_y = vars.var_y;

          scope.width = scope.width / 2;

          // Update scales
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
          }];

          var chart = d3.select(this).selectAll(".items__chart__sparkline").data([d]);

          chart.enter().append('g')
              .classed('items__chart__sparkline', true)
              .call(utils.create_chart, scope, d);

        break;

        case "dotplot":

          scope = {};
          scope = vistk.utils.merge(scope, vars);

          scope = vars.default_params["dotplot"](scope);

          scope.var_x = "realgdp";
          scope.var_y = "realgdp";
          scope.var_id = "dept_name";
          scope.var_text = "dept_name";

          scope.margin = {top: 10, right: 10, bottom: 30, left: 30};

          scope.width = vars.width / 2;
          scope.height = vars.height / 2;

          scope.x_scale[0]["func"].range([scope.height/2, scope.height/2])
            .domain([0, d3.max(vars.old_data, function(d) { return d[scope.var_x]; })])
            .nice();

          scope.y_scale[0]["func"].range([scope.margin.left, scope.width-scope.margin.left-scope.margin.right])
            .domain([0, d3.max(vars.old_data, function(d) { return d[scope.var_y]; })])
            .nice();

          // PRE-UPDATE ITEMS
          var gItems = d3.select(this).selectAll(".mark__group")
                          .data([vars.old_data], function(d, i) { return d[scope.var_id]; });

          // ENTER ITEMS
          var gItems_enter = gItems.enter()
                          .append("g")
                          .each(utils.items_group)

          // APPEND AND UPDATE ITEMS MARK
          scope.items[0].marks.forEach(function(params) {
            gItems_enter.call(utils.draw_mark, params);
            gItems.call(utils.draw_mark, params);
          });

        break;

        case "piechart":

          var scope = {};
          scope = vistk.utils.merge(scope, vars);

          var piechart_params = vars.default_params["piechart"](scope);

          var chart = d3.select(this).selectAll(".items__chart__piechart").data([d]);

          chart.enter().append('g')
              .classed('items__chart__piechart', true)
              .call(utils.create_chart, piechart_params, d);

        break;

        case "star":

          var star = d3.superformula()
              .type("star")
              .size(10 * 50)
              .segments(360);

          var mark = d3.select(this).selectAll(".items__mark__star").data([d]);

          mark.enter().append('path')
              .classed("items_" + mark_id, true)
              .classed('items__mark__star', true)
              .attr('d', star);

          mark              
              .classed("highlighted", function(d, i) { return d.__highlighted; })
              .classed("selected", function(d, i) { return d.__selected; });

          mark.exit().remove();

        break;

        case "polygon":

          var mark = d3.select(this).selectAll('.items__mark__polygon').data([d]);

          mark.enter().append('polygon')
              .classed("items_" + mark_id, true)
              .classed('items__mark__polygon', true)
              .attr('fill', '#ED4036')
              .attr('stroke-width', 0)
              .attr('points','4.569,2.637 0,5.276 -4.569,2.637 -4.569,-2.637 0,-5.276 4.569,-2.637');

          mark
              .classed('highlighted', function(d, i) { return d.__highlighted; })
              .classed('selected', function(d, i) { return d.__selected; });

          mark.exit().remove();

        break;

        case "marker":

          var mark = d3.select(this).selectAll(".items__mark__marker").data([d]);

          mark.enter().append('path')
              .classed("items_" + mark_id, true)
              .classed('items__mark__marker', true)
              .attr("fill", "#ED4036")
              .attr("stroke-width", 0)
              .attr('d', "M10,0L0,10l10,25.4L20,10L10,0z M10,14.6c-2.1,0-3.8-1.7-3.8-3.8c0-2.1,1.7-3.8,3.8-3.8 c2.1,0,3.8,1.7,3.8,3.8C13.8,12.9,12.1,14.6,10,14.6z");

          mark
              .classed("highlighted", function(d, i) { return d.__highlighted; })
              .classed("selected", function(d, i) { return d.__selected; });

          mark.exit().remove();

        break;

        case "none":

          // To make sure we removed __highlighted and __selected nodes
          d3.select(this).selectAll(".items_" + mark_id).remove();

        break;

        case "circle":
        default:

          var mark = d3.select(this).selectAll(".items__mark__circle").data([d]);

          var mark_enter = mark.enter().append("circle")
              .classed("items_" + mark_id, true)
              .classed("items__mark__circle", true)
              .attr("cx", 0)
              .attr("cy", 0)
              .attr("r", function(d) {
                if(typeof params.var_r === "undefined") {
                  return vars.radius;
                } else {
                  var r_scale = d3.scale.linear()
                    .range([vars.radius_min, vars.radius_max])
                    .domain(d3.extent(vars.new_data, function(d) { return d[params.var_r]; }))

                  return r_scale(d[params.var_r]);
                }
              });

          if(typeof params.fill !== "undefined") {

            mark_enter.style("fill", function(d) {
              return params.fill(vars.accessor_items(d)[vars.var_color]);
            });

            mark.style("fill", function(d) {
              return params.fill(vars.accessor_items(d)[vars.var_color]);
            });

          } else if(vars.var_color !== null) {

            mark_enter.style("fill", function(d) { 
              return vars.color(vars.accessor_items(d)[vars.var_color]);
            });
          
            mark.style("fill", function(d) { 
              return vars.color(vars.accessor_items(d)[vars.var_color]);
            });

          }

          if(typeof params.stroke !== "undefined") {

            mark_enter.style("stroke", function(d) {
              return params.stroke(vars.accessor_items(d));
            });

            mark.style("stroke", function(d) {
              return params.stroke(vars.accessor_items(d));
            });

          }

          if(typeof params.stroke_width !== "undefined") {

            mark_enter.style("stroke-width", function(d) {
              return params.stroke_width(vars.accessor_items(d));
            });

            mark.style("stroke-width", function(d) {
              return params.stroke_width(vars.accessor_items(d));
            });

          }

          if(typeof params.title !== "undefined") {

            mark_enter.append("title").text(function(d) {
              return params.title(vars.accessor_items(d));
            });

          }

          if(typeof params.class !== "undefined") {

            mark_enter.classed(params.class(vars.accessor_items(d)), true);

          }

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

  utils.make_zoomable_on_click = function() {

    this.on("click", clicked);

    // http://bl.ocks.org/mbostock/4699541
    function clicked(d) {
      if (active.node() === this) return reset();
      active.classed("active", false);
      active = d3.select(this).classed("active", true);

      // Retrieve parent's node position
      var t = d3.transform(d3.select(this.parentNode).attr("transform")).translate;

      var bounds = d3.select(this).node().getBBox(),
          dx = bounds.width,
          dy = bounds.height,
          x = bounds.x + dx/2 + t[0],
          y = bounds.y + dy/2 + t[1];

          scale = .1 / Math.max(dx / vars.width, dy / vars.height),
          translate = [vars.width / 2 - scale * x, vars.height / 2 - scale * y];

      // Animate the graph
      vars.svg.transition()
          .duration(1750)
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

  }

  utils.zoom_to_nodes = function(nodes) {

    var min_x = vars.width;
    var max_x = 0;
    var min_y = vars.height;
    var max_y = 0;

    // Calculate nodes BBOX
    nodes.forEach(function(node_id) {

       var n = vars.svg.selectAll(".items__mark__circle").filter(function(d) {
         return d[vars.var_id] == node_id;
       });

       if(typeof n === "undefined")
        return;

      // Retrieve parent's node position
      var t = d3.transform(d3.select(n.node().parentNode).attr("transform")).translate;

      var bounds = n.node().getBBox();

      min_x = Math.min(min_x, bounds.x + t[0]);
      max_x = Math.max(max_x, bounds.x + t[0]);

      min_y = Math.min(min_y, bounds.y + t[1]);
      max_y = Math.max(max_y, bounds.y + t[1]);

    })

    var width = (max_x - min_x) + 100;
    var height = (max_y - min_y) + 100;

    var x = min_x + (max_x - min_x) / 2;
    var y = min_y + (max_y - min_y) / 2;

    var scale = 1 / Math.max(width / vars.width, height / vars.height);
    var translate = [vars.width / 2 - scale * x, vars.height / 2 - scale * y];

    // Animate the graph
    vars.svg.transition()
        .duration(1750)
        .style("stroke-width", 1.5 / scale + "px")
        .attr("transform", "translate(" + translate + ")scale(" + scale + ")");

    vars.svg.selectAll("circle").style("stroke-width", (1.5 / scale) + "px")
    vars.svg.selectAll("text").style("font-size", (1/scale) + "rem")

  }

  utils.create_chart = function(_, params, data) {

    if(vars.dev) { 
      console.log("Creating chart with params", params, _, data);
    }

    // PRE-UPDATE CONNECT
    var gConnect = _.selectAll(".connect__group")
                    .data([data], function(d, i) { return i; })
  
    // ENTER CONNECT
    var gConnect_enter = gConnect.enter()
                    .append("g")
                    .attr("class", "connect__group")
                    .attr("transform", "translate(0, 0)")

    // APPEND CONNECT MARK
    if(typeof vars.connect !== "undefined" && typeof vars.connect[0] !== "undefined") {
      params.connect.forEach(function(connect) {
        connect.marks.forEach(function(params) {
          gConnect_enter.call(utils.draw_mark, params);
          gConnect.call(utils.draw_mark, params);
        });
      });
    }
    // PRE-UPDATE ITEMS
    var gItems = _.selectAll(".mark__group")
                    .data([data], function(d, i) { return d[vars.var_id]; });

    // ENTER ITEMS
    var gItems_enter = gItems.enter()
                    .append("g")
                    .each(utils.items_group)
                    .attr("transform", function(d, i) {
                      return "translate(" + vars.x_scale[0]["func"](d[vars.var_x]) + ", " + vars.y_scale[0]["func"](d[vars.var_y]) + ")";
                    });

    // APPEND AND UPDATE ITEMS MARK
    params.items[0].marks.forEach(function(params) {
      gItems_enter.call(utils.draw_mark, params);
      gItems.call(utils.draw_mark, params);
    });

  }

  utils.x_axis = function(d, i) {

    vars.x_axis = utils.make_x_axis();

    vars.svg.selectAll(".x.axis").data([vars.new_data])
      .enter()
        .insert("g", ":first-child")
        .attr("class", "x axis")
        .attr("transform", "translate(" + vars.x_axis_translate + ")")
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
        .style("display", function() { return vars.x_axis_show ? "block": "none"; })
        .call(vars.x_axis);

  }

  utils.y_axis = function(d, i) {

    vars.y_axis = utils.make_y_axis();

    vars.svg.selectAll(".y.axis").data([vars.new_data])
      .enter()
        .insert("g", ":first-child")
        .attr("class", "y axis")
        .attr("transform", "translate(" + vars.y_axis_translate + ")")
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
        .style("display", function() { return vars.y_axis_show ? "block": "none"; })
        .call(vars.y_axis);

  }

  utils.make_x_axis = function() {        
    return d3.svg.axis()
        .scale(vars.x_scale[0]["func"])
        .ticks(vars.x_ticks)
        // Quick fix to get max value
        .tickValues(vars.x_tickValues)
        .tickFormat(vars.x_format)
        .tickSize(vars.x_tickSize)
        .tickPadding(vars.x_tickPadding)
        .orient(vars.x_axis_orient);
  }

  utils.make_y_axis = function() {        
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

  utils.background_label = function() {

    vars.svg.selectAll(".background_label")
        .data([vars.new_data])
      .enter()
        .insert("text")
        .attr("class", "background_label")
        .attr("text-anchor", "middle")
        .attr("y", 0)
        .attr("x", vars.width/2);

    vars.svg.selectAll(".background_label")
        .text(vars.title);

  }

  // One way to wrap text.. but creates too many elements..
  // http://bl.ocks.org/mbostock/7555321

  utils.wrap = function(node) {

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

  utils.update_filters = function(value, add) {
   
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
      if(index > -1) {
        vars.filter.splice(index, 1);
      }
    }
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

  utils.animate_trajectory = function(path, start_time, duration) {

    var totalLength = path.node().getTotalLength();

    path.attr("stroke-width", "5")
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
      .transition()
        .duration(vars.duration)
        .ease("linear")
        .attr("stroke-dashoffset", 0);

  }

  // Credits: http://bl.ocks.org/mbostock/1705868
  utils.translate_along = function(path, duration) {
    var l = path.node().getTotalLength();
    return function(d, i, a) {
      return function(t) {
        var p = path.node().getPointAtLength(t * l);
        return "translate(" + p.x + "," + p.y + ")";
      };
    };
  }
