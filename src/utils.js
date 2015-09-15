  // LIST OF PRIVATE UTILS FUNCTIONS

  // Create SVG groups for items marks
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

  // Create SVG groups for connect marks
  utils.connect_group = function(d, i) {

    d3.select(this).attr("class", "connect__group connect__group_" + d._index_item)
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

  //  Main function to draw marks
  //  Invoked from a .each() call passing in the current datum d and index i,
  //  with the this context of the current DOM element
  //
  //  params contains the parameters for the current graphical mark to draw
  //  e.g. scales, type of mark, radius, color function, ..
  utils.draw_mark = function(selection, params, vars) {

    if(vars.dev) {
      console.log("[utils.draw_mark]", params.type)
    }

    selection.each(function(d, i) {

      if(!d.__redraw) {
        return;
      }

      var params_type = params.type;

      // Default id for marks
      var mark_id = params._mark_id;

      // In case a function determines the type of mark to be used
      if(typeof params_type === "function") {
        params_type = params.type(d[params.var_mark]);
      }

      if(typeof params.text !== "undefined" && typeof params.text === "function") {
        params_text = params.text(d);
      }

      if(typeof params.width !== "undefined") {
        if(typeof params.width === "function") {
          params_width = params.width(d);
        } else if(typeof params.width === "number") {
          params_width = params.width;
        }
      }

      if(typeof params.height !== "undefined") {
        if(typeof params.height === "function") {
          params_height = params.height(d);
        } else if(typeof params.height === "number") {
          params_height = params.height;
        }
      }

      if(typeof params.x !== "undefined") {
        if(typeof params.x === "function") {
          params_x = params.x(d);
        } else if(typeof params.x === "number") {
          params_x = params.x;
        }
      }

      if(typeof params.y !== "undefined") {
        if(typeof params.y === "function") {
          params_y = params.y(d);
        } else if(typeof params.y === "number") {
          params_y = params.y;
        }
      }

      var params_translate = [0, 0];

      if(typeof params.translate !== "undefined" && params.translate !== null) {
        if(typeof params.translate === "function") {
          params_translate = params.translate(d, i, vars);
        } else {
          params_translate = params.translate;
        }
      }

      var params_rotate = 0;

      if(typeof params.rotate !== "undefined" && params.rotate !== null) {
        if(typeof params.rotate === "function") {
          params_rotate = params.rotate(d);
        } else {
          params_rotate = params.rotate;
        }
      }

      // Use the default accessor
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
              .attr("transform", "translate(" +  params_translate + ")rotate(" +  params_rotate + ")");

          items_mark_text
              .classed("highlighted", function(d, i) { return d.__highlighted; })
              .classed("selected", function(d, i) { return d.__selected; })
              .transition().duration(vars.duration)
              .attr("transform", "translate(" +  params_translate + ")rotate(" +  params_rotate + ")")
              .text(function(d) {

                if(typeof params.text !== "undefined") {
                  return params.text(d);
                } else {
                  return vars.accessor_data(d)[vars.var_text];
                }

              });

        items_mark_text.exit().remove();

        break;

        // Attach a div to the SVG container
        case "div":

          var items_mark_div = d3.select(d3.select(vars.svg.node().parentNode).node().parentNode)
                .selectAll(".items__mark__div").data([d]);

          var items_mark_div_enter = items_mark_div.enter()
               .append("div")
                 .classed("items__mark__div", true)
                 .classed("items_" + mark_id, true)
                 .style("position", "absolute")
                 .style({"text-overflow": "ellipsis", "overflow": "hidden"});

          items_mark_div
                 .style("width", function(d) {
                   if(typeof params_width !== "undefined") {
                     return params_width + "px";
                   } else {
                     return "auto";
                   }
                 })
                 .style("height", function(d) {
                   if(typeof params_height !== "undefined") {
                     return params_height + "px";
                   } else {
                    return "auto";
                   }
                 })
                 .style("left", function(d) {
                   if(typeof params_x !== "undefined") {
                     return params_x + "px";
                   } else {
                     return (vars.x_scale[0]["func"](vars.accessor_data(d)[vars.var_x]) + params_translate[0]) + "px";
                   }
                 })
                 .style("top", function(d) {
                   if(typeof params_y !== "undefined") {
                     return params_y + "px";
                   } else {
                     return (vars.y_scale[0]["func"](vars.accessor_data(d)[vars.var_y]) + params_translate[1]) + "px";
                   }
                 })
                 .html(function(d) {
                    if(typeof params_text !== "undefined") {
                      return params_text;
                    } else {
                      return vars.accessor_data(d)[vars.var_text];
                    }
                 });

          if(typeof params.class !== "undefined") {
            items_mark_div_enter.classed(params.class(vars.accessor_items(d)), true);
          }

          items_mark_div.exit().remove();

        break;

        case "divtext":

          var items_mark_divtext = d3.select(this).selectAll(".items__mark__divtext").data([d]);

          var items_mark_divtext_enter = items_mark_divtext.enter().insert("foreignObject")
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
                    return "100%";
                  }
                })
               .append("xhtml:body")
               .append("div")
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
                  return "100%";
                }
                })
               .style({"text-overflow": "ellipsis", "overflow": "hidden"})
               .html(function(d) {
                  if(typeof params_text !== "undefined") {
                    return params_text;
                  } else {
                    return vars.accessor_data(d)[vars.var_text];
                  }
               });

          items_mark_divtext.select('div')
              .transition()
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
                 return "100%";
               }
               });

          if(typeof params.class !== "undefined") {

            items_mark_divtext_enter.classed(params.class(vars.accessor_items(d)), true);

          }

          items_mark_divtext.exit().remove();

        break;


        case "image":

          var items_mark_image = d3.select(this).selectAll(".items__mark__image").data([d]);

          items_mark_image.enter().append("image")
                 .classed("items__mark__image", true)
                 .classed("items_" + mark_id, true)
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
                  .attr("transform", "rotate(" + params_rotate + ")")
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

        var items_mark_diamond_enter = items_mark_diamond.enter().append("rect")
            .classed("items__mark__diamond", true)
            .classed("items_" + mark_id, true)
            .attr("height", vars.mark.height)
            .attr("width", vars.mark.width)
            .attr("x", -vars.mark.width/2)
            .attr("y", -vars.mark.height/2)
            .attr("transform", "rotate(" + (params_rotate + 45) + ")");

          if(typeof params.class !== "undefined") {
            items_mark_diamond_enter.classed(params.class(vars.accessor_items(d)), true);
          }

        items_mark_diamond
            .classed("highlighted", function(d, i) { return d.__highlighted; })
            .classed("selected", function(d, i) { return d.__selected; })
            .transition().duration(vars.duration);

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
              .attr("transform", "translate(0,0)rotate(" + params_rotate + ")");

          items_mark_tick
              .classed("highlighted", function(d, i) { return d.__highlighted; })
              .classed("selected", function(d, i) { return d.__selected; })
              .transition().duration(vars.duration)
              .attr("transform", function(d) {
                return "translate(" +  params_translate + ")rotate(" +  params_rotate + ")";
              });

          items_mark_tick.exit().remove();

        break;

        case "shape":

          var items_mark_shape = d3.select(this).selectAll(".items__mark__shape.items_" + mark_id).data([d]);

          items_mark_shape.enter().insert("path")
              .classed('items__mark__shape', true)
              .classed("items_" + mark_id, true)
              .attr("class", "country")
              .attr("title", function(d,i) {
            //    active = d3.select(null);
                return d.name;
              })
           //   .on("click", clicked);

          items_mark_shape
              .classed("highlighted", function(d, i) { return d.__highlighted; })
              .classed("selected", function(d, i) { return d.__selected; })
              .attr("d", vars.path)
              .style("fill", function(d, i) {
                return params.fill(vars.accessor_data(d)[vars.var_color]);
              })
              .transition().duration(vars.duration)
              /*
              .attr("transform", function(d) {

                // Drawing projects comes with automatic offset
                d.x = d3.select(this).node().getBBox().x;
                d.y = d3.select(this).node().getBBox().y;

                // Update parent with new coordinates
                d3.select(d3.select(this).node().parentNode).attr("transform", "translate("+ d.x +", "+ d.y +")");

                return "translate("+ -d.x +", "+ -d.y +")";
              })
*/
/*
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
*/
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

          var t = d3.transform(d3.select(this).attr("transform")).translate;

          mark.enter().append('line')
              .classed('mark__line_horizontal', true)
              .classed("items_" + mark_id, true);

          mark
              .classed("highlighted", function(d, i) { return d.__highlighted; })
              .classed("selected", function(d, i) { return d.__selected; })
              .attr("x1", function(d) { return -t[0] + vars.margin.left; })
              .attr("y1", function(d) { return 0; })
              .attr("x2", function(d) { return vars.x_scale[0]["func"].range()[1]; })
              .attr("y2", function(d) { return 0; });

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
              .style("stroke", params.stroke)
              .attr('d', function(e) {
                return params["func"](this_accessor_values(e));
              });

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

        case "sparkline2":

          var scope = {};

          scope = vistk.utils.merge(scope, vars);

          /*
          scope.margin = vars.margin;
          scope.time = vars.time;

          scope = vars.default_params["sparkline"](scope);

          scope.margin = vars.margin;
          scope.time = vars.time;

          scope.type = "sparkline";
          scope.var_x = "year";
          scope.var_y = "realgdp";
          scope.svg  = d3.select(this);
          scope.new_data = vars.new_data;
          //scope = vistk.utils.merge(scope, vars)


          scope.x_scale = vars.x_scale;
          scope.y_scale = vars.y_scale;
          scope.zoom = vars.zoom;
          // Update scales
          scope.x_scale[0]["func"].domain(d3.extent(d.values, function(d) {
           return d[scope.var_x];
          }))
          .range([0, 50]);

          scope.y_scale[0]["func"].domain(d3.extent(d.values, function(d) {
           return d[scope.var_y];
          }))
          .range([0, 50]);

          console.log("USING SCOPE", scope.time)
*/
         // utils.draw_chart(scope);

        break;


        case "sparkline":

/*
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

          scope.svg = vars.svg;
*/
          if(vars.dev) {
            console.log("[draw_mark] sparkline");
          }

          var scope = {};
          scope = vars.default_params["sparkline"](vars);

          scope = vistk.utils.merge(vars, scope);

          scope.type = "sparkline";

          var chart = d3.select(this).selectAll(".items__chart__sparkline").data([d]);

          chart.enter().append('g')
              .classed('items__chart__sparkline', true)
              .call(utils.draw_chart, scope, [d]);

        break;

        case "piechart":

          var scope = {};
          scope = vistk.utils.merge(scope, vars);

          var piechart_params = vars.default_params["piechart"](scope);

          var chart = d3.select(this).selectAll(".items__chart__piechart").data([d]);

          chart.enter().append('g')
              .classed('items__chart__piechart', true)
              .call(utils.draw_chart, piechart_params, d);

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

          var mark_enter = mark.enter().append('path')
              .classed("items_" + mark_id, true)
              .classed('items__mark__marker', true)
              .attr("fill", "#ED4036")
              .attr("stroke-width", 0)
              .attr('d', "M10,0L0,10l10,25.4L20,10L10,0z M10,14.6c-2.1,0-3.8-1.7-3.8-3.8c0-2.1,1.7-3.8,3.8-3.8 c2.1,0,3.8,1.7,3.8,3.8C13.8,12.9,12.1,14.6,10,14.6z");

          // IN CASE OF CUSTOM ENTER FOR ITEMS
          if(typeof params.enter !== "undefined") {
            mark_enter.call(params.enter, vars);
          }

          mark
              .classed("highlighted", function(d, i) { return d.__highlighted; })
              .classed("selected", function(d, i) { return d.__selected; });

          d3.select(this).selectAll(".items__mark__marker")
                          .transition()
                          .duration(vars.duration)
                          .ease('bounce')
                          .attr("transform", function(d, i) {
                            return "translate(-10, -40)";
                          });

          mark.exit().remove();

        break;

        case "none":

          // To make sure we removed __highlighted and __selected nodes
          d3.select(this).selectAll(".items_" + mark_id).remove();

        break;

        case "circle":
        default:

          var mark = d3.select(this).selectAll(".items__mark__circle.items_" + mark_id).data([d]);

          var mark_enter = mark.enter().append("circle")
              .classed("items_" + mark_id, true)
              .classed("items__mark__circle", true)
              .attr("cx", 0)
              .attr("cy", 0)
              .attr("r", function(d) {

                if(typeof params.var_r === "undefined") {
                  if(typeof params.radius !== "undefined") {
                    return params.radius;
                  } else {
                    return vars.radius;
                  }
                } else {
                  var r_scale = d3.scale.linear()
                    .range([vars.radius_min, vars.radius_max])
                    .domain(d3.extent(vars.new_data, function(d) { return d[params.var_r]; }))

                  return r_scale(d[params.var_r]);
                }
              });

          if(typeof params.fill !== "undefined") {

            if(typeof params.fill === "function") {

              mark.style("fill", params.fill(d, i, vars));

            } else {

              mark_enter.style("fill", function(d) {
                return params.fill(vars.accessor_items(d)[vars.var_color]);
              });

            }

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
              .classed("highlighted__adjacent", function(d, i) { return d.__highlighted__adjacent; })
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
    vars.svg.selectAll("text").style("font-size", (1 / scale) + "rem")

  }

  utils.draw_chart = function(vars_svg, context, params) {

    if(context.dev) {
      console.log("[utils.draw_chart] drawing chart of type", context.type, context.connect);
    }

    var vars = context;
    vars.new_data = params;

    if(vars.x_invert) {
      vars.x_scale[0]["func"].range([vars.x_scale[0]["func"].range()[1], vars.x_scale[0]["func"].range()[0]]);
    }

    if(vars.y_invert) {
      vars.y_scale[0]["func"].range([vars.y_scale[0]["func"].range()[1], vars.y_scale[0]["func"].range()[0]]);
    }

    // In case items are programmatically generated
    if(typeof vars.items == "function") {
      vars.items = vars.items(vars);
    }

    if(typeof vars.items !== "undefined" && vars.items[0] !== "undefined" &&  Object.keys(vars.items).length > 0 && vars.type !== "stacked") {

      vars.items.forEach(function(item, index_item) {

        // Use the global accessor, unless specif one has been set
        var accessor_data = vars.accessor_data;

        if(typeof item.accessor_data !== "undefined") {
          accessor_data = item.accessor_data;
        }

        // PRE-UPDATE ITEMS
        // Join is based on the curren_time value
        var gItems = vars_svg.selectAll(".mark__group" +  "_" + index_item)
                        .data(vars.new_data, function(d, i) {
                          d._index_item = index_item;
                          return accessor_data(d)[vars.var_id] + "_" + index_item;
                        });

        // ENTER ITEMS
        var gItems_enter = gItems.enter()
                        .insert("g", ":first-child");

        // IN CASE OF CUSTOM ENTER FOR ITEMS
        if(typeof item.enter !== "undefined") {
          gItems_enter.call(item.enter, vars);
        } else {
          gItems_enter.attr("transform", function(d, i) {
            return "translate(" + vars.x_scale[0]["func"](accessor_data(d)[vars.var_x]) + ", " + vars.y_scale[0]["func"](accessor_data(d)[vars.var_y]) + ")";
          });
        }

       // APPEND AND UPDATE ITEMS MARK
        item.marks.forEach(function(params, index_mark) {

          if(typeof params.filter == "undefined") {
            params.filter = function() {
              return true;
            }
          }

          // Supporting multipe similar elements
          params._mark_id = index_item + "_" + index_mark;
          gItems_enter
              .filter(params.filter)
              .filter(utils.filters.redraw_only)
              .call(utils.draw_mark, params, vars);

          gItems
              .filter(params.filter)

              .call(utils.draw_mark, params, vars);
        });

        // Bind events to groups after marks have been created
        gItems.each(utils.items_group);
        /* Should be as below but current params don't match this format
          // APPEND AND UPDATE ITEMS MARK
          vars.items.forEach(function(item) {
            item.marks.forEach(function(params) {
              gItems_enter.call(utils.draw_mark, params);
              gItems.call(utils.draw_mark, params);
            });
          });
        */

        // IN CASE OF CUSTOM UPDATE FOR ITEMS
        if(typeof item.update !== "undefined") {
          vars_svg.selectAll(".mark__group" + "_" + index_item).call(item.update, vars)
        } else {
        // POST-UPDATE ITEMS GROUPS
          vars_svg.selectAll(".mark__group" + "_" + index_item)
                        .transition()
                        .duration(vars.duration)
                        //.ease('none')
                        .attr("transform", function(d, i) {
                          return "translate(" + vars.x_scale[0]["func"](accessor_data(d)[vars.var_x]) + ", " + vars.y_scale[0]["func"](accessor_data(d)[vars.var_y]) + ")";
                        });
        }

        // ITEMS EXIT
        var gItems_exit = gItems.exit();

        // IN CASE OF CUSTOM EXIT FOR ITEMS
        if(typeof item.exit !== "undefined") {
          gItems_exit.call(item.exit, vars)
        } else {
          gItems_exit.remove();
        }

        if(vars.type == "productspace") {
          vars.new_data.forEach(function(d) { d.__redraw = false; });
        }

      });

      if(vars.zoom.length > 0) {

        utils.zoom_to_nodes(vars.zoom);

      } else {

        vars_svg.transition()
                .duration(vars.duration)
                .attr("transform", "translate(" + vars.margin.left + "," + vars.margin.top + ")");

      }

    }

    if(typeof vars.connect !== "undefined" && typeof vars.connect[0] !== "undefined" && Object.keys(vars.connect).length > 0) {

      // 1/ Between different items at a given time for one dimension
      // 2/ Between same items at a given time points
      // 2/ Between same items at multiple given times

      // By default, connecting time points
      var connect_data = vars.new_data;

      // Connecting items
      if(vars.type == "productspace") {

        if(vars.init) {
          vars.links.forEach(function(d, i) {
            d[vars.var_id] = i;
          });
        }

        connect_data = vars.links;

      }

      // APPEND AND UPDATE CONNECT MARK
      vars.connect.forEach(function(connect, index_item) {

        // Use the global accessor, unless specif one has been set
        var accessor_data = vars.accessor_data;

        if(typeof connect.accessor_data !== "undefined") {
          accessor_data = connect.accessor_data;
        }

        // PRE-UPDATE CONNECT
        // TOOD: find a common join to al types of connections

        var gConnect = vars_svg.selectAll(".connect__group")
                        .data(connect_data, function(d, i) {
                          d._index_item = index_item;
                          return d[vars.var_id] + "_" + index_item;
                        });

        // ENTER CONNECT
        var gConnect_enter = gConnect.enter()
                        .insert("g", ":first-child")
                        .attr("class", "connect__group");

        connect.marks.forEach(function(params, index_mark) {

          if(typeof params.filter == "undefined")
            params.filter = function() { return true; };

          // Supporting multipe similar elements
          params._mark_id = index_item + "_" + index_mark;

          // Only create connections when char inits
          if(vars.init) {
            gConnect_enter
              .filter(params.filter)
              .call(utils.draw_mark, params, vars);
          }

          gConnect
            .filter(params.filter)
            .call(utils.draw_mark, params, vars);
        });

        // Bind events to groups after marks have been created
        gConnect.each(utils.connect_group);

        // EXIT
        var gConnect_exit = gConnect.exit().remove();

      });

      // Specific to the product space as the structure does not change
      if(vars.type == "productspace") {
        connect_data.forEach(function(d) { d.__redraw = false; });
      }

    }

    // CREATE / UPDATE / REMOVE AXIS
    if(vars.x_axis_show) {
      context.svg.call(utils.x_axis);
    } else {
      context.svg.selectAll(".x.axis").remove();
    }

    if(vars.y_axis_show) {
       vars_svg.call(utils.y_axis);
    } else {
       vars_svg.selectAll(".y.axis").remove();
    }

    if(vars.x_grid_show) {

      vars_svg.selectAll(".x.grid").data([vars.new_data])
        .enter()
          .append("g")
          .attr("class", "x grid")
          .style("display", function() { return vars.x_grid_show ? "block": "none"; })
          .attr("transform", "translate(0," + (vars.margin.top) + ")");

      vars_svg.selectAll(".x.grid").transition()
          .duration(vars.duration)
          .call(utils.make_x_axis()
          .tickSize(vars.height - vars.margin.top - vars.margin.bottom, 0, 0)
          .tickFormat(""));

    }

    if(vars.y_grid_show) {

      vars_svg.selectAll(".y.grid").data([vars.new_data])
        .enter()
          .append("g")
          .attr("class", "y grid")
          .style("display", function() { return vars.y_axis_show ? "block": "none"; })
          .attr("transform", "translate(" + vars.margin.left + ", 0)");

      vars_svg.selectAll(".y.grid").transition()
          .duration(vars.duration)
          .call(utils.make_y_axis()
          .tickSize(-vars.width+vars.margin.left+vars.margin.right, 0, 0)
          .tickFormat(""));

    }

    // POST-RENDERING STUFF
    // Usually aimed at updating the rendering order of elements
      vars.postrendering.forEach(function(d) {

        if(vars.type == d.type) {
          vars_svg.selectAll(d.selector).sort(function(a, b) { return a[d.attr]; });
        }

      });


    utils.background_label(vars.title);

    // Flag that forces to re-wrangle data
    vars.refresh = false;
    vars.init = false;

/*
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

     vars.connect = vars.default_params.sparkline(params);
     console.log("aasss", vars.connect)

    // APPEND CONNECT MARK
    if(typeof vars.connect !== "undefined" && typeof vars.connect[0] !== "undefined") {
      console.log("DRAWW")
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

*/
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
            if(vars.x_text) {
              return "block";
            } else {
              return "none";
            }
          }
        })
        .text(vars.var_x);

    vars.svg.selectAll(".x.axis").transition()
        .duration(vars.duration)
        .style("display", function() { return vars.x_axis_show ? "block": "none"; })
        .call(vars.x_axis)
        .selectAll(".tick text")
        .style("text-anchor", function(d, i) {
          if(vars.x_ticks === 2) {
            if(i === 0) {
              return "start";
            } else {
              return "end";
            }
          } else {
            return "middle";
          }
        })

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

  // Displays text as a background (e.g. current year in scatterplots)
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

  // One way to wrap text but creates too many elements
  // Alternative is to use the divtext graphical mark which wraps and ellipsis
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

  // Moves a graphical mark along a SVG path
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

  utils.filters = {};

  utils.redraw_only = function(d) { return d.__redraw; }
