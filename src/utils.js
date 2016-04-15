  // LIST OF PRIVATE UTILS FUNCTIONS

  // Create SVG groups for items marks
  utils.items_group = function(d, i) {

    d3.select(this).classed("highlighted", function(d, i) { return d.__highlighted; })
                    .classed("selected", function(d, i) { return d.__selected; })
                    .classed("mark__group", true)
                    .on("mouseover",function(d) {
                      vars.evt.call("highlightOn", d);
                    })
                    .on("mouseleave", function(d) {
                      vars.evt.call("highlightOut", d);
                    })
                    .on("click", function(d) {
                       vars.evt.call("selection", d);
                       d3.event.stopPropagation();
                    });

  }

  // Binds events for items marks
  utils.bind_events = function(d, i) {

    d3.select(this).classed("highlighted", function(d, i) { return d.__highlighted; })
                   .classed("selected", function(d, i) { return d.__selected; })
                   .on("mouseover",function(d) {
                     vars.evt.call("highlightOn", d);
                   })
                   .on("mouseleave", function(d) {
                     vars.evt.call("highlightOut", d);
                   })
                   .on("click", function(d) {
                      vars.evt.call("selection", d);
                      d3.event.stopPropagation();
                   });

  }

  // Create SVG groups for connect marks
  utils.connect_group = function(d, i) {

    d3.select(this).attr("class", "connect__group connect__group_" + d.__index)
                    .classed("highlighted", function(d, i) { return d.__highlighted; })
                    .classed("selected", function(d, i) { return d.__selected; })
                    .on("mouseover",function(d) {
                      if(vars.type !== "productspace") {
                        vars.evt.call("highlightOn", d);
                      }
                    })
                    .on("mouseleave", function(d) {
                      if(vars.type !== "productspace") {
                        vars.evt.call("highlightOut", d);
                      }
                    })
                    .on("click", function(d) {
                      if(vars.type !== "productspace") {
                        vars.evt.call("selection", d);
                      }
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
      console.log("[utils.draw_mark]", params.type);
    }

    selection.each(function(d, i) {

      // Skip the drawing if __redraw flag is false
      if(!d.__redraw) {
        return;
      }

      // Default id for marks
      var mark_id = params._mark_id + "_" + d.__index;

      // params_type is the list of marks to be drawn
      // it is either static (string) or can be computer
      // from the params.var_mark
      // in both case it will result int an array of marks

      var var_mark = [];

      // In case a function determines the type of mark to be used
      if(typeof params.var_mark === "object") {

        params.var_mark.forEach(function(__var_mark) {

          var params_type = "";

          if(typeof params.type === "function") {
            params_type = params.type(d[__var_mark]);
          } else {
            params_type = params.type;
          }

          if(typeof params_type !== "undefined" && params_type !== "none") {
            var_mark = var_mark.concat(params_type)
          }

        });

      } else {

        var params_type = "";

        if(typeof params.type === "function") {
          params_type = params.type(d[params.var_mark]);
        } else {
          params_type = params.type;
        }

        var_mark.push(params_type);

      }

      var params_text = "";

      if(typeof params.text !== "undefined") {
        if(typeof params.text === "function") {
          params_text = params.text(d, i , vars);
        } else if(typeof params.text === "string") {
          params_text = params.text;
        }
      } else if(vars.var_text !== "undefined") {
        params_text = d[vars.var_text];
      }

      var params_source = [0, 0];
      var params_target = [vars.width, vars.height];
      var params_translate = [0, 0];

      if(typeof params.translate !== "undefined" && params.translate !== null) {
        if(typeof params.translate === "function") {
          params_translate = params.translate(d, i, vars);
        } else {
          params_translate = params.translate;
        }
      }
      var params_x = utils.init_params("x", 0, params, d, i, vars);
      var params_y = utils.init_params("y", 0, params, d, i, vars);

      var default_height = params_type === 'div' || params_type === 'divtext' ? "auto": 10;

      var params_height = utils.init_params("height", default_height, params, d, i, vars);
      var params_width = utils.init_params("width", 10, params, d, i, vars);
      var params_rotate = utils.init_params("rotate", 0, params, d, i, vars);
      var params_scale = utils.init_params("scale", 1, params, d, i, vars);

      // var params_fill = utils.init_params("fill", null, params, d, i, vars);
      var params_fill = null;

      if(typeof params.fill !== "undefined") {

        if(typeof params.fill === "function") {

          params_fill = params.fill(d, i, vars);

        } else if(typeof params.fill === "string") {

          params_fill = params.fill;

        } else if(typeof params.fill === "object") {

          params_fill = params.fill(vars.accessor_items(d)[vars.var_color]);

        }

      } else if(vars.var_color !== null) {

        params_fill = vars.color(vars.accessor_items(d)[vars.var_color]);

      }

      var params_fill_opacity = utils.init_params("fill_opacity", null, params, d, i, vars);

      var params_stroke = utils.init_params("stroke", null, params, d, i, vars);
      var params_stroke_width = utils.init_params("stroke_width", null, params, d, i, vars);
      var params_stroke_opacity = utils.init_params("stroke_opacity", null, params, d, i, vars);

      var params_offset_x = utils.init_params("offset_x", 0, params, d, i, vars);
      var params_offset_y = utils.init_params("offset_y", 0, params, d, i, vars);

      var params_offset_right = utils.init_params("offset_right", 0, params, d, i, vars);
      var params_offset_top = utils.init_params("offset_top", 0, params, d, i, vars);

      // Use the default accessor
      var accessor_data = vars.accessor_data;

      var that = this;

      var_mark.forEach(function(params_type) {

      switch(params_type) {

        // Note: removed .style("fill", params_fill)
        case "text":

          if(typeof params.text_anchor === "undefined") {
            params.text_anchor = "start";
          }

          var items_mark_text = d3.select(that).selectAll(".items__mark__text.items_" + mark_id).data([d]);

          var items_mark_text_enter = items_mark_text.enter().append("text")
              .classed("items__mark__text", true)
              .classed("items_" + mark_id, true)
              .style("text-anchor", params.text_anchor)
              .attr("x", params_x)
              .attr("y", params_y)
              .attr("dy", ".35em")
              .on("mouseover",function(d) { // To prevent hovers
                if(typeof params.event !== 'undefined' && params.event === null) {
                  d3.event.stopPropagation();
                  return;
                }
              })
              .on("mouseleave", function(d) {
                if(typeof params.event !== 'undefined' && params.event === null) {
                  d3.event.stopPropagation();
                  return;
                }
              })
              .on("click", function(d) {
                if(typeof params.event !== 'undefined' && params.event === null) {
                  d3.event.stopPropagation();
                  return;
                }
              });

          if(typeof params.rotate_first !== 'undefined' && params.rotate_first) {
            items_mark_text_enter.attr("transform", "rotate(" +  params_rotate + ")translate(" + ([params_translate[0] + params_offset_x, params_translate[1] + params_offset_y]) + ")");
          } else {
            items_mark_text_enter.attr("transform", "translate(" + ([params_translate[0] + params_offset_x, params_translate[1] + params_offset_y]) + ")rotate(" +  params_rotate + ")");
          }

          items_mark_text
              .classed("highlighted", function(d, i) { return d.__highlighted; })
              .classed("selected", function(d, i) { return d.__selected; })
              .transition().duration(vars.duration)
              .style("stroke", params_stroke)
              .text(params_text);

          if(typeof params.rotate_first !== 'undefined' && params.rotate_first) {
            items_mark_text.attr("transform", "rotate(" +  params_rotate + ")translate(" + ([params_translate[0] + params_offset_x, params_translate[1] + params_offset_y]) + ")");
          } else {
            items_mark_text.attr("transform", "translate(" + ([params_translate[0] + params_offset_x, params_translate[1] + params_offset_y]) + ")rotate(" +  params_rotate + ")");
          }

        items_mark_text.exit().remove();

        break;

        // Attach a div to the SVG container
        case "div":

          var items_mark_div = d3.select(d3.select(vars.svg.node().parentNode).node().parentNode)
                .selectAll(".items__mark__div.items_" + mark_id).data([d]);

          var items_mark_div_enter = items_mark_div.enter()
               .append("div")
                 .classed("items__mark__div", true)
                 .classed("items_" + mark_id, true)
                 .style("position", "absolute")
                 .style("text-overflow", "ellipsis")
                 .style("overflow", "hidden");

          items_mark_div
                 .style("width", function(d) {
                   if(typeof params_width !== "undefined" && params_width !== 'auto') {
                     return params_width + "px";
                   } else {
                     return "auto";
                   }
                 })
                 .style("height", function(d) {

                   if(typeof params_height !== "undefined" && params_height !== 'auto') {
                     return params_height + "px";
                   } else {
                     return "auto";
                   }
                 })
                 .style("left", function(d) {
                   if(typeof params_x !== "undefined") {
                     return (params_x + params_translate[0]) + "px";
                   } else {
                     return (vars.x_scale[0]["func"](vars.accessor_data(d)[vars.var_x]) + params_translate[0]) + "px";
                   }
                 })
                 .style("top", function(d) {
                   if(typeof params_y !== "undefined") {
                     return (params_y + params_translate[1]) + "px";
                   } else {
                     return (vars.y_scale[0]["func"](vars.accessor_data(d)[vars.var_y]) + params_translate[1]) + "px";
                   }
                 })
                 .html(params_text);

          if(typeof params.class !== "undefined") {
            items_mark_div_enter.classed(params.class(vars.accessor_items(d)), true);
          }

          items_mark_div.exit().remove();

        break;

        case "divtext":

          var items_mark_divtext = d3.select(that).selectAll(".items__mark__divtext.items_" + mark_id).data([d]);

          var items_mark_divtext_enter = items_mark_divtext.enter().insert("foreignObject")
                .style("pointer-events", "none")
                .classed("items__mark__divtext", true)
                .classed("items_" + mark_id, true)
                .attr("width", function(d) {
                   if(typeof d.dx !== "undefined") {
                     return (Math.max(0, d.dx - 2 * vars.padding - params_translate[0])) + "px";
                   } else {
                     return "auto";
                   }
                 })
                .attr("height", function(d) {
                 if(typeof d.dy !== "undefined") {
                    return (Math.max(0, d.dy - 2 * vars.padding - params_translate[1])) + "px";
                  } else {
                    return "auto";
                  }
                })
               .append("xhtml:body")
               .append("div")
               .style("pointer-events", "none")
               .style("width", function(d) {
                 if(typeof d.dx !== "undefined") {
                   return (Math.max(0, d.dx - 2 * vars.padding - params_translate[0])) + "px";
                 } else {
                   return "auto";
                 }
                })
               .style("height", function(d) {
                 if(typeof d.dy !== "undefined") {
                   return (Math.max(0, d.dy - 2 * vars.padding - params_translate[1])) + "px";
                 }
                })
              .style("margin-left", function(d) {
                 return params_translate[0] + 'px';
               })
              .style("margin-top", function(d) {
                 return params_translate[1] + 'px';
               })
               .style({"text-overflow": "ellipsis", "overflow": "hidden"})
               .html(params_text);

          items_mark_divtext.select('div')
              .transition().duration(vars.duration)
              .style({"pointer-events": "none"})
              .style("margin-left", function(d) {
                 return params_translate[0] + 'px';
               })
              .style("margin-top", function(d) {
                 return params_translate[1] + 'px';
               })
              .style("width", function(d) {
                if(typeof d.dx !== "undefined") {
                  return (Math.max(0, d.dx - 2 * vars.padding - params_translate[0])) + "px";
                } else {
                  return "auto";
                }
               })
              .style("height", function(d) {
                if(typeof d.dy !== "undefined") {
                  return (Math.max(0, d.dy - 2 * vars.padding - params_translate[1])) + "px";
                }
               })

          if(typeof params.class !== "undefined") {

            items_mark_divtext_enter.classed(params.class(vars.accessor_items(d)), true);

          }

          items_mark_divtext.exit().remove();

        break;

        case "image":

          var items_mark_image = d3.select(that).selectAll(".items__mark__image").data([d]);

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

        var items_mark_rect = d3.select(that).selectAll(".items__mark__rect.items_" + mark_id).data([d]);

        items_mark_rect.enter().append("rect")
            .classed("items__mark__rect", true)
            .classed("items_" + mark_id, true)
            .attr("x", params.x || 0)
            .attr("y", params.y || 0)
            .attr("height", params_height)
            .attr("width", params_width)
            .attr("transform", "translate(" +  params_translate + ")rotate(" + params_rotate + ")scale(" + params_scale + ")")
            .style('fill', params_fill)
            .style("stroke", params_stroke)
            .style("stroke-width", params_stroke_width);

        items_mark_rect
            .classed("highlighted", function(d, i) { return d.__highlighted; })
            .classed("selected", function(d, i) { return d.__selected; })
            .transition().duration(vars.duration)
            .attr("x", params.x || 0)
            .attr("y", params.y || 0)
            .attr("height", params_height)
            .attr("width", params_width)
            .attr("transform", "translate(" +  params_translate + ")rotate(" + params_rotate + ")scale(" + params_scale + ")")
            .style('fill', params_fill)
            .style("stroke", params_stroke)
            .style("stroke-width", params_stroke_width);

        items_mark_rect.exit().remove();

        break;

      case "diamond":

        var items_mark_diamond = d3.select(that).selectAll(".items__mark__diamond.items_" + mark_id).data([d]);

        var items_mark_diamond_enter = items_mark_diamond.enter().append("rect")
            .classed("items__mark__diamond", true)
            .classed("items_" + mark_id, true)
            .attr("height", vars.mark.height)
            .attr("width", vars.mark.width)
            .attr("x", -vars.mark.width/2)
            .attr("y", -vars.mark.height/2)
            .attr("transform", "rotate(" + (params_rotate + 45) + ")")
            .style("fill", params_fill);

        if(typeof params.class !== "undefined") {
          items_mark_diamond_enter.classed(params.class(vars.accessor_items(d)), true);
        }

        items_mark_diamond
            .classed("highlighted", function(d, i) { return d.__highlighted; })
            .classed("selected", function(d, i) { return d.__selected; })
            .transition().duration(vars.duration)
            .style("fill", params_fill);
         //   .style("stroke", params_stroke);

        items_mark_diamond.exit().remove();

        break;

        case "tick":

          var items_mark_tick = d3.select(that).selectAll(".items__mark__tick.items_" + mark_id).data([d]);

          items_mark_tick.enter().append('line')
              .classed('items__mark__tick', true)
              .classed("items_" + mark_id, true)
              .style("stroke", params_stroke)
              .style("stroke-width", params_stroke_width)
              .style("stroke-opacity", params_stroke_opacity)
              .attr("y2", function(d) { return -20; })
              .attr("transform", "translate(" +  params_translate + ")rotate(" + params_rotate + ")scale(" + params_scale + ")");

          if(typeof params.class !== "undefined") {
            items_mark_tick.classed(params.classed(vars.accessor_items(d)), true);
          }

          items_mark_tick
              .classed("highlighted", function(d, i) { return d.__highlighted; })
              .classed("selected", function(d, i) { return d.__selected; })
              .transition().duration(vars.duration)
              .attr("transform", "translate(" +  params_translate + ")rotate(" + params_rotate + ")scale(" + params_scale + ")")  ;

          items_mark_tick.exit().remove();

        break;

        case "shape":

          var items_mark_shape = d3.select(that).selectAll(".items__mark__shape.items_" + mark_id).data([d]);

          items_mark_shape.enter().insert("path")
              .classed('items__mark__shape', true)
              .classed("items_" + mark_id, true)
              .attr("transform", function(d) {
                return "translate("+ -d.x +", "+ -d.y +")";
              })
              .style("fill", params_fill);

          items_mark_shape
              .classed("highlighted", function(d, i) { return d.__highlighted; })
              .classed("selected", function(d, i) { return d.__selected; })
              .attr("d", vars.path)
              .attr("transform", function(d) {
                return "translate("+ -d.x +", "+ -d.y +")";
              })
              .style("fill", params_fill);

          items_mark_shape.exit().remove();

        break;

        case "arc":

          var arc = d3.svg.arc().outerRadius(function(d) {

            if(typeof vars.var_r === "undefined") {
              return vars.width / 6;
            } else {

              var r_scale = d3.scale.linear()
                .range([vars.radius_min, vars.radius_max])
                .domain(d3.extent(vars.new_data, function(d) {
                  return vars.accessor_data(d)[vars.var_r];
                }))

              return r_scale(vars.accessor_data(d)[vars.var_r]);
            }

          }).innerRadius(0);

          var mark = d3.select(that).selectAll(".items__mark__arc.items_" + mark_id).data([d]);

          mark.enter().append("path")
              .classed("items__mark__arc", true)
              .classed("items_" + mark_id, true)
              .style("fill-opacity", params_fill_opacity)
              .style("fill", params_fill);

          mark
              .classed("highlighted", function(d, i) { return d.__highlighted; })
              .classed("selected", function(d, i) { return d.__selected; })
              .transition().duration(vars.duration)
              .attr("fill", params_fill)
              .attr("d", arc);

        break;

        case "line":

          var mark = d3.select(that).selectAll(".connect__line").data([d]);

          // Make sure we have data for links
          if(typeof d.source == "undefined"  || typeof d.target == "undefined") {
            if(vars.dev) {
              console.log("[draw line] missing source or target")
            }
            return;
          }

          mark.enter().append('line')
              .classed('connect__line', true)
              .classed("items_" + mark_id, true)
              .attr("x1", function(d) { return vars.x_scale[0]["func"](d.source.x); })
              .attr("y1", function(d) { return vars.y_scale[0]["func"](d.source.y); })
              .attr("x2", function(d) { return vars.x_scale[0]["func"](d.target.x); })
              .attr("y2", function(d) { return vars.y_scale[0]["func"](d.target.y); })
              .style("stroke", params_stroke)
              // .style("stroke-dasharray", ("3, 3"))
              .on("mouseover",function(d) { // FIX to prevent hovers
                d3.event.stopPropagation();
                return;
              })
              .on("mouseleave", function(d) {
                d3.event.stopPropagation();
                return;
              })
              .on("click", function(d) {
                 d3.event.stopPropagation();
                return;
              });

          mark
              .classed("highlighted", function(d, i) { return d.__highlighted; })
              .classed("highlighted__adjacent", function(d, i) { return d.__highlighted__adjacent; })
              .classed("selected", function(d, i) { return d.__selected; })
              .classed("selected__adjacent", function(d, i) { return d.__selected__adjacent; });

          break;

        case "line_horizontal":

          var mark = d3.select(that).selectAll(".mark__line_horizontal.items_" + mark_id).data([d]);

          var t = d3.transform(d3.select(that).attr("transform")).translate;

          mark.enter().append('line')
              .classed('mark__line_horizontal', true)
              .classed("items_" + mark_id, true)
              .on("mouseover",function(d) { // FIX to prevent hovers
                d3.event.stopPropagation();
              })
              .on("mouseleave", function(d) {
                d3.event.stopPropagation();
              })
              .on("click", function(d) {
                 d3.event.stopPropagation();
              });

          mark
              .classed("highlighted", function(d, i) { return d.__highlighted; })
              .classed("selected", function(d, i) { return d.__selected; })
              .attr("x1", function(d) { return -t[0]; })
              .attr("x2", function(d) { return vars.x_scale[0]["func"].range()[1] -t[0] - params_offset_right; })
              .attr("y1", function(d) { return params_offset_y; })
              .attr("y2", function(d) { return params_offset_y; });

          break;

        case "line_vertical":

          var mark = d3.select(that).selectAll(".mark__line_vertical.items_" + mark_id).data([d]);

          var t = d3.transform(d3.select(that).attr("transform")).translate;

          mark.enter().append('line')
              .classed('mark__line_horizontal', true)
              .classed("items_" + mark_id, true)
              .on("mouseover",function(d) { // prevents hovers
                d3.event.stopPropagation();
              })
              .on("mouseleave", function(d) {
                d3.event.stopPropagation();
              })
              .on("click", function(d) {
                 d3.event.stopPropagation();
              });

          mark
              .classed("highlighted", function(d, i) { return d.__highlighted; })
              .classed("selected", function(d, i) { return d.__selected; })
              //.attr("x1", function(d) { return params_offset_x; })
              //.attr("y1", function(d) { return -t[1] - vars.margin.top + params_offset_top; })
              //.attr("x2", function(d) { return params_offset_x; })
              //.attr("y2", function(d) { return vars.y_scale[0]["func"].range()[1]; })
              .attr("y2", params_offset_top)
              .attr("y1", function(d) { return vars.height - vars.margin.top - vars.margin.bottom - t[1]; });

          break;

        case "line_coord":

          var mark = d3.select(that).selectAll(".mark__line_coord.items_" + mark_id).data([d]);

          var t = d3.transform(d3.select(that).attr("transform")).translate;

          mark.enter().append('line')
              .classed('mark__line_coord', true)
              .classed("items_" + mark_id, true)
              .on("mouseover",function(d) { // FIX to prevent hovers
                d3.event.stopPropagation();
              })
              .on("mouseleave", function(d) {
                d3.event.stopPropagation();
              })
              .on("click", function(d) {
                 d3.event.stopPropagation();
              });

          mark
              .classed("highlighted", function(d, i) { return d.__highlighted; })
              .classed("selected", function(d, i) { return d.__selected; })
              .attr("x1", function(d) { return params_source[0]; })
              .attr("y1", function(d) { return params_target[0]; })
              .attr("x2", function(d) { return params_source[1]; })
              .attr("y2", function(d) { return params_target[1]; });

          break;

        case "path":

          var this_accessor_values = function(d) { return d.values; };

          if(vars.type == "radial") {
            this_accessor_values = function(d) { return d; };
          }

          if(typeof params['func'] == 'undefined') {
              params['func'] = d3.svg.line()
               .interpolate('linear')
               .x(function(d) { return vars.x_scale[0]["func"](d[vars.var_x]); })
               .y(function(d) { return vars.y_scale[0]["func"](d[vars.var_y]); });
          }

          var mark = d3.select(that).selectAll(".connect__path_" + mark_id).data([d]);

          mark.enter().append('path')
              .classed('connect__path', true)
              .classed('connect__path_' + mark_id, true)
              .classed("items_" + mark_id, true)
              .style("fill", params_fill)
              .style("stroke", params_stroke)
              .style("stroke-width", params_stroke_width)
              .attr('d', function(e) {
                return params["func"](d3.values(this_accessor_values(e)), i, vars);
              })
              .attr("transform", function(d) {
                return "translate(" +  params_translate + ")rotate(" +  params_rotate + ")";
              });

          mark
              .classed("highlighted", function(e, j) { return e.__highlighted; })
              .classed("selected", function(e, j) { return e.__selected; })
              .transition().duration(vars.duration)
              .attr('d', function(e) {
                return params["func"](d3.values(this_accessor_values(e)), i, vars);
              })
              .style("fill", params_fill)
              .style("stroke", params_stroke)
              .style("stroke-width", params_stroke_width);

          break;

        case "path_coord":

          var this_accessor_values = function(d) { return d.values; };

          if(vars.type == "radial") {
            this_accessor_values = function(d) { return d; };
          }

          if(typeof params['func'] == 'undefined') {
              params['func'] = d3.svg.line()
               .interpolate('linear')
               .x(function(d) { return vars.x_scale[0]["func"](d[vars.var_x]); })
               .y(function(d) { return vars.y_scale[0]["func"](d[vars.var_y]); });
          }

          var mark = d3.select(that).selectAll(".connect__path_" + mark_id).data([d]);

          mark.enter().append('path')
              .classed('connect__path', true)
              .classed('connect__path_' + mark_id, true)
              .classed("items_" + mark_id, true)
              .style("fill", "none")
              .style("stroke", params_stroke)
              .style("stroke-width", params_stroke_width)
              .attr('d', function(e) {
                return params["func"](d3.values(this_accessor_values(e)), i, vars);
              })
              .attr("transform", function(d) {
                return "translate(" +  params_translate + ")rotate(" +  params_rotate + ")";
              });

          mark
              .classed("highlighted", function(e, j) { return e.__highlighted; })
              .classed("selected", function(e, j) { return e.__selected; })
              .transition().duration(vars.duration)
              .attr('d', function(e) {
                return params["func"](d3.values(this_accessor_values(e)), i, vars);
              })
              .style("fill", "none")
              .style("stroke", params_stroke)
              .style("stroke-width", params_stroke_width);

        break;

        case "star":

          var star = d3.superformula()
              .type("star")
              .size(10 * 50)
              .segments(360);

          var mark = d3.select(that).selectAll(".items__mark__star.items_" + mark_id).data([d]);

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

          var mark = d3.select(that).selectAll('.items__mark__polygon.items_' + mark_id).data([d]);

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

        case "triangle":

          var mark = d3.select(that).selectAll('.items__mark__triangle.items_' + mark_id).data([d]);

          mark.enter().append('polygon')
              .classed("items_" + mark_id, true)
              .classed('items__mark__triangle', true)
              .attr('fill', params_fill)
              .attr('stroke-width', 0)
              .attr('points','-10,5 0,-15 10,5');

          mark
              .classed('highlighted', function(d, i) { return d.__highlighted; })
              .classed('selected', function(d, i) { return d.__selected; });

          mark.exit().remove();

        break;

        case "marker":

          var mark = d3.select(that).selectAll(".items__mark__marker.items_" + mark_id).data([d]);

          var mark_enter = mark.enter().append('path')
              .classed("items_" + mark_id, true)
              .classed('items__mark__marker', true)
              .attr("fill", "#ED4036")
              .attr("stroke-width", 0)
              .attr("transform", function(d, i) {
                return "translate(-10, -40)";
              })
              .attr('d', "M10,0L0,10l10,25.4L20,10L10,0z M10,14.6c-2.1,0-3.8-1.7-3.8-3.8c0-2.1,1.7-3.8,3.8-3.8 c2.1,0,3.8,1.7,3.8,3.8C13.8,12.9,12.1,14.6,10,14.6z");

          // IN CASE OF CUSTOM ENTER FOR ITEMS
          if(typeof params.enter !== "undefined") {
            mark_enter.call(params.enter, vars);
          }

          mark
              .classed("highlighted", function(d, i) { return d.__highlighted; })
              .classed("selected", function(d, i) { return d.__selected; });

          d3.select(that).selectAll(".items__mark__marker")
                          .transition()
                          .duration(vars.duration)
                          .ease('bounce')
                          .attr("transform", function(d, i) {
                            return "translate(-10, -40)";
                          });

          mark.exit().remove();

        break;

        case "tween":

          var tween_type = "";

          if(typeof params.tween_type === "undefined") {
            tween_type = "circle";
          } else if(typeof params.tween_type === "function") {
            tween_type = params.tween_type(d[params.var_mark]);
          } else if(d3.superformulaTypes.indexOf(params.tween_type) < 0) {
            tween_type = "star";
          } else {
            tween_type = params.tween_type;
          }

          var path_tween = d3.superformula()
              .type(tween_type)
              .size(100)
              .segments(360);

          var mark = d3.select(that).selectAll(".items__mark__tween.items_" + mark_id).data([d]);

          mark.enter().append('path')
              .classed("items_" + mark_id, true)
              .classed('items__mark__tween', true)
              .style("fill", params_fill)
              .style("stroke", params_stroke)
              .attr("transform", function(d) {
                return "translate("+ d.x +", "+ d.y +")";
              })
              .style("stroke-width", params_stroke_width);

          mark
              .classed("highlighted", function(d, i) { return d.__highlighted; })
              .classed("selected", function(d, i) { return d.__selected; })
              .transition()
              .duration(vars.duration)
              .attr('d', path_tween);

          mark.exit().remove();

        break;


        case "none":

          // To make sure we removed __highlighted and __selected nodes
          d3.select(that).selectAll(".items_" + mark_id).remove();

        break;

        case "piechart":

          if(typeof params.class !== 'undefined') {
            d3.select(that).classed(params.class, true);
          }

          // Create a custom configuration for pie charts
          var scope = vars.default_params['piechart'](vars);

          // Filter dataset to keep non-aggregated data for the current group
          var this_data = vars.new_data.filter(function(e) {
            return e[vars.var_group] === d[vars.var_group] && typeof e.data !== 'undefined' &&  e.data.__aggregated !== true;
          });

          this_data = vistk.utils.aggregate(this_data, vars, vars.var_cutoff, 'sum');

          // Aggregation returns key / values data, only keep values
          this_data = this_data.map(function(d) { return d.values; });

          // Re-generate the pie layout
          scope.pie = d3.layout.pie().value(function(d) {
            return d[vars.var_share];
          });

          // Generate new pie chart data for the current subset
          this_data = scope.pie(this_data);

          // Update item data with pie chart data
          this_data.forEach(function(d) {
            d.values = d.data.values;
            d[vars.var_id] = d.data[vars.var_id];
            d[vars.var_x] = d.data[vars.var_x];
            d[vars.var_y] = d.data[vars.var_y];
            d[vars.var_group] = d.data[vars.var_group];
            d[vars.var_share] = d.data[vars.var_share];
            d[vars.var_r] = d.data[vars.var_r];
          });

          this_data.forEach(function(d) { d.__redraw = true; });

          // Generate a new configuration for the pie chart
          var vars2 = vistk.utils.merge(vars, scope);
          vars.type = 'piescatter';

          // Identify scale for the wedges (while previously was X/Y)
          vars2.x_scale = vistk.utils.scale.none();
          vars2.y_scale = vistk.utils.scale.none();

          vars2.r_scale = d3.scale.linear()
                      .range([0, vars2.width/6])
                      .domain([0, d3.max(this_data, function(d) {
                        return vars2.accessor_data(d)[vars2.var_share];
                      })]);

          vars2.items[0].marks[0].var_fill = vars.var_cutoff;

          vars2.items[0].marks[0].fill = function(vars, d, i) {
            if(d === 0) {
              return vars2.color(vars.data[vars2.var_group]);
            } else {
              return vars2.color(vars.data[vars2.var_group]);
            }
          }

          vars2.items[0].marks[0].fill_opacity = function(vars, d, i) {
            if(d === 0) {
              return .2;
            } else {
              return 1;
            }
          }

          vars2.radius_min = vars.r_scale(d[vars.var_r]);
          vars2.radius_max = vars.r_scale(d[vars.var_r]);

          vars2.z_index = 1;

          d3.select(that).call(utils.draw_chart, vars2, this_data);

        break;

        case "circle":
        default:

          var mark = d3.select(that).selectAll(".items__mark__circle.items_" + mark_id).data([d]);

          var mark_enter = mark.enter().append("circle")
              .classed("items_" + mark_id, true)
              .classed("items__mark__circle", true)
              //.attr("cx", params_translate[0])
              //.attr("cy", params_translate[1])
              .attr("r", function(d) {

                if(typeof vars.var_r === "undefined") {
                  if(typeof params.radius !== "undefined") {
                    return params.radius;
                  } else {
                    return vars.radius;
                  }
                } else {

                  if(typeof params.radius !== "undefined") {
                    return params.radius;
                  }

                  // If custom domain for R-scale and has min/max values
                  if(vars.r_domain !== null && vars.r_domain.length === 2) {
                    vars.r_scale.domain(vars.r_domain);
                  } else {

                  vars.r_scale = d3.scale.linear()
                      .range([vars.radius_min, vars.radius_max])
                      .domain(d3.extent(vars.new_data, function(d) {
                        return vars.accessor_data(d)[vars.var_r];
                      }));
                  }

                  return vars.r_scale(d[vars.var_r]);

                }
              })
              .style("stroke", params_stroke)
              .style("fill", params_fill)
              .style("fill-opacity", params_fill_opacity)
              .style("stroke-width", params_stroke_width)
              .style("stroke-opacity", params_stroke_opacity);

          if(typeof params.opacity !== "undefined") {

            if(typeof params.fill === "function") {

              mark_enter.style("opacity", function(d) {
                return params.opacity(vars.accessor_items(d));
              });

            } else {

              mark.style("opacity", params.opacity);

            }

          }

          if(typeof params.title !== "undefined") {
            mark_enter.append("title").text(function(d) {
              return params.title(vars.accessor_items(d));
            });
          }

          if(typeof params.class !== "undefined") {
            mark_enter.classed(params.class(vars.accessor_items(d)), true);
          }

          if(typeof params.rotate_first !== 'undefined' && params.rotate_first) {
            mark_enter.attr("transform", "rotate(" +  params_rotate + ")translate(" + ([params_translate[0] + params_offset_x, params_translate[1] + params_offset_y]) + ")");
          } else {
            mark_enter.attr("transform", "translate(" + ([params_translate[0] + params_offset_x, params_translate[1] + params_offset_y]) + ")rotate(" +  params_rotate + ")");
          }

          mark
              .classed("highlighted", function(d, i) { return d.__highlighted; })
              .classed("highlighted__adjacent", function(d, i) { return d.__highlighted__adjacent; })
              .classed("selected", function(d, i) { return d.__selected; })
              .classed("selected__adjacent", function(d, i) { return d.__selected__adjacent; })
              .style("fill", params_fill)
              .style("fill-opacity", params_fill_opacity)
              .style("stroke-opacity", params_stroke_opacity);

          if(typeof params.rotate_first !== 'undefined' && params.rotate_first) {
            mark.attr("transform", "rotate(" +  params_rotate + ")translate(" + ([params_translate[0] + params_offset_x, params_translate[1] + params_offset_y]) + ")");
          } else {
            mark.attr("transform", "translate(" + ([params_translate[0] + params_offset_x, params_translate[1] + params_offset_y]) + ")rotate(" +  params_rotate + ")");
          }

          mark.exit().remove();

          break;

        }

      });

    })

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

    if(vars.dev) { console.log("[zooming to nodes]", vars.zoom); }

    if(nodes.length === 0) {
      // Resets scale and viewport to default values

      vars.scale = 1;
      vars.translate = [0, 0];
      vars.translate_x = 0;
      vars.translate_y = 0;

      vars.svg.transition()
              .duration(vars.duration)
              .attr("transform", "translate(" + vars.margin.left + "," + vars.margin.top + ")rotate(" + vars.rotate + ")");
      return;
    }

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

    vars.translate_x = min_x + (max_x - min_x) / 2;
    vars.translate_y = min_y + (max_y - min_y) / 2;

    vars.scale = 1 / Math.max(width / vars.width, height / vars.height);
    vars.translate = [vars.width / 2 - vars.scale * vars.translate_x, vars.height / 2 - vars.scale * vars.translate_y];

    // Animate the graph
    vars.svg.transition()
        .duration(1750)
        .style("stroke-width", 1.5 / vars.scale + "px")
        .attr("transform", "translate(" + vars.translate + ")scale(" + vars.scale + ")");

    // If we want to re-scale the various elements
    // vars.svg.selectAll("circle").style("stroke-width", (1.5 / vars.scale) + "px")

    vars.svg.selectAll("text").style("font-size", (1 / vars.scale) + "rem")

  }

  utils.draw_chart = function(vars_svg, context, params) {

    if(context.dev) {
      console.log("[utils.draw_chart] drawing chart of type", context.type);
    }

    var vars = context;
    vars.new_data = params;

    if(vars.x_invert) {
      vars.x_scale[0]["func"].range([vars.x_scale[0]["func"].range()[1], vars.x_scale[0]["func"].range()[0]]);
    }

    if(vars.y_log) {
      vars.y_scale = [{
        func: d3.scale.log()
                .range([vars.height - vars.margin.top - vars.margin.bottom, vars.margin.top])
                .domain([1, d3.max(vars.new_data, function(d) { return d[vars.var_y]; })]).nice(),
      }];

    }

    if(typeof vars._user_vars.y_invert !== 'undefined' && vars._user_vars.y_invert) {
      vars.y_scale[0]["func"].range([vars.y_scale[0]["func"].range()[1], vars.y_scale[0]["func"].range()[0]]);
    }


    // If custom domain for X-scale and has min/max values
    if(vars.x_domain !== null && vars.x_domain.length === 2) {
      vars.x_scale[0]['func'].domain(vars.x_domain);
    }

    // If custom domain for Y-scale and has min/max values
    if(vars.y_domain !== null && vars.y_domain.length === 2) {
      vars.y_scale[0]['func'].domain(vars.y_domain);
    }

    // If custom domain for R-scale and has min/max values
    if(vars.r_domain !== null && vars.r_domain.length === 2) {
      vars.r_scale.domain(vars.r_domain);
    }

    // In case items are programmatically generated
    if(typeof vars.items == "function") {
      vars.items = vars.items(vars);
    }

    if(typeof vars.items !== "undefined" && vars.items[0] !== "undefined" &&  Object.keys(vars.items).length > 0 && vars.type !== "stacked") {

        vars.items.forEach(function(item, index_item) {

            if(!vars.flat_scene) {

              // Use the global accessor, unless specif one has been set
              var accessor_data = vars.accessor_data;

              // In case of custom static accessor
              if(typeof item.accessor_data !== "undefined") {
                accessor_data = item.accessor_data;
              }

              // PRE-UPDATE ITEMS
              // Join is based on the curren_time value
              var gItems = vars_svg.selectAll(".mark__group" +  "_" + index_item)
                              .data(vars.new_data.filter(function(d) {
                                  return typeof accessor_data(d) !== 'undefined' && typeof accessor_data(d)[vars.var_id] !== 'undefined';
                                }), function(d, i) {
                                  return accessor_data(d)[vars.var_id] + "_" + index_item + d.depth + d.__index;
                              });

              // ENTER ITEMS
              var gItems_enter = null;

              if(typeof vars.z_index !== 'undefined' && vars.z_index === 1) {

                gItems_enter = gItems.enter()
                                .append("g")
                                .attr('class', function(d) {
                                  return "mark__group" +  "_" + index_item;
                                });

              } else {

                gItems_enter = gItems.enter()
                                .insert("g", ":first-child")
                                .attr('class', function(d) {
                                  return "mark__group" +  "_" + index_item;
                                });
              }

              // ITEMS EXIT
              var gItems_exit = gItems.exit();

              // IN CASE OF CUSTOM ENTER FOR ITEMS
              if(typeof item.enter !== "undefined") {

                gItems_enter.call(item.enter, vars);

              } else {

                gItems_enter.attr("transform", function(d, i) {
                  return "translate(" + vars.x_scale[0]["func"](accessor_data(d)[vars.var_x])
                    + ", " + vars.y_scale[0]["func"](accessor_data(d)[vars.var_y]) + ")";
                });
              }

              // IN CASE OF CUSTOM EVENTS FOR ITEMS
              if(vars.init && typeof item.evt !== "undefined") {

                item.evt.forEach(function(e) {
                  vars.evt.register(e.type, e.callback);
                })

              }

            }

           // APPEND AND UPDATE ITEMS MARK
            item.marks.forEach(function(params, index_mark) {

              if(!vars.flat_scene) {

                if(typeof params.filter === "undefined") {
                  params.filter = function() {
                    return true;
                  }
                }

                // Supporting multipe similar elements
                params._mark_id = index_item + "_" + index_mark;

                if(vars.init) {

                  gItems_enter
                      .filter(function(d, i) {
                        return params.filter(d, i, vars);
                      })
                      .filter(utils.filters.redraw_only)
                      .call(utils.draw_mark, params, vars);

                  // Bind events to groups after marks have been created
                  // If params.event is defined, removes all events for the current item
                  if(typeof params.event === 'undefined') {
                    gItems_enter.each(utils.items_group);
                  }

                }

                gItems
                    .filter(params.filter)
                    .filter(utils.filters.redraw_only)
                    .call(utils.draw_mark, params, vars);

                // CUSTOM SELECTION EVENT
                if(vars.init && typeof params.evt !== 'undefined') {
                  vars.evt.register("selection", params.evt[0].func)
                }

              } else { // flat scene graph

                var mark_type = params.type;
                var index_mark = index_mark;

                //  Unique ID for the mark
                var mark_id = mark_type + "_" + index_item+ "_" + index_mark;

                // Get the marks params
                var mark_params = vars.default_marks[mark_type](vars);

                var items = vars.svg.selectAll(mark_type + "." + mark_id)
                    .data(vars.new_data, function(d, i) {
                      return d.__index;
                    });

                // Z-index?
                // .insert("g", ":first-child");
                // Should we re-order the marks to make sure it will appear in right order?
                // Or do it afterwards?

                if(typeof params.filter == "undefined") {
                  params.filter = function() { return true; }
                }

                // Drawing SVG TYPE MARK
                items.enter()
                  .append(mark_type)
                    .filter(params.filter)
                    .filter(utils.filters.redraw_only)
                    .call(mark_params.enter, params, vars, mark_id);

                items
                  .filter(params.filter)
                  .filter(utils.filters.redraw_only)
                  .call(mark_params.update, params, vars, mark_id);

                items.exit()
                  .filter(params.filter)
                  .call(mark_params.exit, params, vars, mark_id);

                if(vars.init) {
                  vars.new_data.forEach(function(d) {
                    if(!d.__selected) { d.__redraw = false; }
                  });
                }

              }

            });

          if(!vars.flat_scene) {

            // IN CASE OF CUSTOM UPDATE FOR ITEMS
            if(typeof item.update !== "undefined") {
              vars_svg.selectAll(".mark__group" + "_" + index_item).call(item.update, vars)
            } else {
            // POST-UPDATE ITEMS GROUPS
              vars_svg.selectAll(".mark__group" + "_" + index_item)
                            .filter(utils.filters.redraw_only)
                            .transition()
                            .duration(vars.duration)
                            //.ease('none')
                            .attr("transform", function(d, i) {
                              return "translate(" + vars.x_scale[0]["func"](accessor_data(d)[vars.var_x]) + ", " + vars.y_scale[0]["func"](accessor_data(d)[vars.var_y]) + ")";
                            });
            }

            // IN CASE OF CUSTOM EXIT FOR ITEMS
            if(typeof item.exit !== "undefined") {

              gItems_exit.call(item.exit, vars);

            } else {

              gItems_exit.remove();

            }

            // Make sure we won't re-draw all nodes next time
            // if(vars.type == "productspace" || vars.type == "treemap" || vars.type == "scatterplot" || vars.type == "geomap") {
            if(vars.init && vars.type !== 'linechart' && vars.type !== 'slopegraph' && vars.type !== 'slopegraph_ordinal' && vars.type !== 'slopegraph_ordinal' && index_item === vars.items.length - 1) {

              vars.new_data.forEach(function(d) {
                if(!d.__selected) {
                  d.__redraw = false;
                }
              });
            }

          }

        });

    }

    if(typeof vars.connect !== "undefined" && typeof vars.connect[0] !== "undefined" && Object.keys(vars.connect).length > 0) {

      // 1/ Between different items at a given time for one dimension
      // 2/ Between same items at a given time points
      // 2/ Between same items at multiple given times

      // By default, connecting time points
      var connect_data = vars.new_data;

      // Connecting items
      if(vars.type == "productspace" || vars.type == "radial") {

        // Assign a var_id value for each link (for join)
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
                          return d[vars.var_id] + "_" + d.__index;
                        });

        // ENTER CONNECT
        var gConnect_enter = gConnect.enter()
                        .insert("g", ":first-child")
                        .attr("class", "connect__group");

        connect.marks.forEach(function(params, index_mark) {

          if(typeof params.filter === "undefined") {
            params.filter = function() { return true; };
          }

          // Supporting multipe similar elements
          params._mark_id = index_item + "_" + index_mark;

          // Only create connections when char inits
          if(vars.init) {

            gConnect_enter
              .filter(params.filter)
              .filter(utils.filters.redraw_only)
              .call(utils.draw_mark, params, vars)
          }

          gConnect
            .filter(params.filter)
            .filter(utils.filters.redraw_only)
            .call(utils.draw_mark, params, vars);

        });

        if(vars.init) {
          // Bind events to groups after marks have been created
          gConnect.each(utils.connect_group);
        }

        // IN CASE OF CUSTOM ENTER FOR ITEMS
        if(typeof connect.enter !== "undefined") {

          gConnect_enter.call(connect.enter, vars);

        }

        // EXIT
        var gConnect_exit = gConnect.exit().remove();

        // Specific to the product space as the structure does not change
        if(vars.init && vars.type === "productspace") {
          connect_data.forEach(function(d) { d.__redraw = false; });
        }

      });

    } else {

      // Remove connect mark if not in config file anymore
      vars_svg.selectAll(".connect__group").remove();

    }

    // If no data then skip axis display
    if(!utils.check_data_display()) {
      return;
    }

    if(typeof vars._user_vars.x_tickValues !== 'undefined') {
      vars.x_tickValues = vars._user_vars.x_tickValues;
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
          .insert("g", ":first-child")
          .attr("class", "x grid")
          .style("display", function() {
            return vars.x_grid_show ? "block": "none";
          })
          .attr("transform", function() {
            if(vars.x_axis_orient == "top") {
              return "translate(0," + (vars.height - vars.margin.top - vars.margin.bottom) + ")";
            } else {
              return "translate(0," + (vars.margin.top) + ")";
            }
          });

      vars_svg.selectAll(".x.grid").transition()
          .duration(vars.duration)
          .call(utils.make_x_axis()
          .tickSize(vars.height - vars.margin.top - vars.margin.bottom, 0, 0)
          .tickFormat(""));

    }

    if(vars.y_grid_show) {

      vars_svg.selectAll(".y.grid").data([vars.new_data])
        .enter()
          .insert("g", ":first-child")
          .attr("class", "y grid")
          .style("display", function() { return vars.y_axis_show ? "block": "none"; })
          .attr("transform", "translate(" + vars.margin.left + ", 0)");

      vars_svg.selectAll(".y.grid").transition()
          .duration(vars.duration)
          .call(utils.make_y_axis()
          .tickSize(-vars.width + vars.margin.right + vars.margin.left, 0, 0)
          .tickFormat(""));

    }

    if(typeof vars._user_vars.y_grid_show !== 'undefined' && !vars._user_vars.y_grid_show) {
      vars_svg.selectAll(".y.grid").remove();
    }

    if(vars.refresh) {
      utils.zoom_to_nodes(vars.zoom);
    }

    utils.background_label(vars.title);

    // Flag that prevent to re-wrangle data by default
    vars.refresh = false;
    vars.init = false;

  }

  utils.x_axis = function(d, i) {

    vars.x_axis = utils.make_x_axis();

    vars.svg.selectAll(".x.axis").data([vars.new_data])
      .enter()
        .insert("g", ":first-child")
        .attr("class", "x axis")
        .attr("transform", "translate(" + vars.x_axis_translate + ")")
      .append("text")
        .attr("class", "axis__label x__axis__label")
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
        .text(function() {
          if(vars.x_text_custom !== "") {
            return vars.x_text_custom;
          } else {
            return vars.var_x;
          }
        });

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
            return vars.x_textAnchor;
          }
        })
        .attr("transform", "rotate(" + vars.x_tickRotate +")");

  }

  utils.y_axis = function(d, i) {

    vars.y_axis = utils.make_y_axis();

    vars.svg.selectAll(".y.axis").data([vars.new_data])
      .enter()
        .insert("g", ":first-child")
        .attr("class", "y axis")
        .attr("transform", "translate(" + vars.y_axis_translate + ")")
      .append("text")
        .attr("class", "axis__label x__axis__label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style({
          "text-anchor": "end",
          "display": function(d) {
            return typeof vars.y_text !== "undefined" && vars.y_text !== null;
          }
        })
        .text(function() {
          if(vars.y_text_custom !== "") {
            return vars.y_text_custom;
          } else {
            return vars.var_y;
          }
        });

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
        .orient(vars.y_axis_orient);
  }

  // Title
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

  utils.filters.redraw_only = function(d) { return d.__redraw; }

  utils.find_adjacent_links = function(d, links) {

      return vars.links.filter(function(e) {
        if(typeof e.source !== 'undefined' && typeof e.target !== 'undefined') {
          return e.source[vars.var_id] === d[vars.var_id] || e.target[vars.var_id] === d[vars.var_id];
        } else {
          return false;
        }
      })
  }

  utils.find_adjacent_nodes = function(d, links) {

      return vars.links.filter(function(e) {
        if(typeof e.source !== 'undefined' && typeof e.target !== 'undefined') {
          return e.source[vars.var_id] === d[vars.var_id] || e.target[vars.var_id] === d[vars.var_id];
        } else {
          return false;
        }
      })
  }

  /**
  * Generates a data structure with 2 levels of hierarchy (root and var_group)
  * -root being the top-level
  * -var_group being the second-level
  * -items being the bottom-level
  * @params
  */
  utils.create_hierarchy = function(vars) {

   // Create the root node
    vars.root = {};
    vars.root[vars.var_text]= "root";
    vars.root.depth = 0;

    vars.root[vars.var_size] = vars.new_data.map(function(d) {
      return d[vars.var_size];
    }).reduce(function(p, c) {
      return p + c;
    }, 0);

    vars.groups = [];

    vars.unique_groups = [];

    // Creates the groups here
    vars.new_data.map(function(d, i) {

      // If group doesn't exist, we create it
      if(vars.unique_groups.indexOf(d[vars.var_group]) < 0) {
        vars.unique_groups.push(d[vars.var_group]);
        vars.groups[vars.unique_groups.indexOf(d[vars.var_group])] = [];
      }

      var n = {year: d[vars.var_time], id: i};

      n[vars.var_size] = d[vars.var_size];
      n[vars.var_group] = d[vars.var_group];
      n[vars.var_id] = d[vars.var_id];
      n[vars.var_text] = d[vars.var_text];
      n[vars.var_color] = d[vars.var_color];
      n[vars.var_text_item] = d[vars.var_text_item];

      vars.groups[vars.unique_groups.indexOf(d[vars.var_group])].push(n);

    });

    // Make sure there is no empty elements
    vars.groups = vars.groups.filter(function(n) { return n !== "undefined"; });

    // Add group elements are root children
    vars.root.children = vars.groups.map(function(d, i) {

      node = {};

      if(typeof vars.var_text_parent !== 'undefined') {
        node[vars.var_text] = d[0][vars.var_text_parent];
      } else {
        node[vars.var_text] = d[0][vars.var_text];
      }

      node[vars.var_group] = d[0][vars.var_group];
      node[vars.var_id] = d[0][vars.var_group];
      node[vars.var_color] = d[0][vars.var_color];

      node[vars.var_sort] = 0;
      node[vars.var_size] = 0;

      // Create the children nodes var
      node.children = d.map(function(e, j) {

        var n = e;

        // For parent element
        node[vars.var_sort] += e[vars.var_sort];
        node[vars.var_size] += e[vars.var_size];

        return n;
      });

      return node;

    });

    if(typeof vars.var_sort_asc !== "undefined" && !vars.var_sort_asc) {
      vars.root.children = vars.root.children.sort(function(a, b) {
        return d3.ascending(a[vars.var_sort], b[vars.var_sort]);
      });
    } else {
      vars.root.children = vars.root.children.sort(function(a, b) {
        return d3.descending(a[vars.var_sort], b[vars.var_sort]);
      });
    }

  }

  utils.check_data_display = function() {
    if(vars.type === 'treemap') {
      return nb_values = vars.new_data.filter(function(d) {
        return d[vars.var_size] > 0;
      }).length > 0;
    } else {
      return vars.new_data.length > 0;
    }
  }

  // http://stackoverflow.com/questions/17500312/is-there-some-way-i-can-join-the-contents-of-two-javascript-arrays-much-like-i/17500836#17500836
  utils.join = function(lookupTable, mainTable, lookupKey, mainKey, select) {
      var l = lookupTable.length,
          m = mainTable.length,
          lookupIndex = [],
          output = [];
      for (var i = 0; i < l; i++) { // loop through l items
          var row = lookupTable[i];
          lookupIndex[row[lookupKey]] = row; // create an index for lookup table
      }
      for (var j = 0; j < m; j++) { // loop through m items
          var y = mainTable[j];
          var x = lookupIndex[y[mainKey]]; // get corresponding row from lookupTable
          var s = select(y, x);
          if(typeof s !== 'undefined')
            output.push(s); // select only the columns you need
      }
      return output;
  };


  utils.init_params = function(v, default_value, params, d, i, vars) {

    var result = default_value;

    if(typeof params[v] !== "undefined") {
      if(typeof params[v] === "function") {
        //if(v === 'stroke' || v === 'stroke') {
        //  result = params[v](d[vars.var_color], i, vars);
        //} else {
          result = params[v](d, i, vars);
        //}
      } else if(typeof params[v] === "string") {
        result = params[v];
      } else if(typeof params[v] === "number") {
        result = params[v];
      } else {
        result = params[v];
      }
    }

    return result;
  }

  utils.init_params_values = function(var_v, default_value, params, d, i, vars) {

    var result = default_value;

    if(typeof params[var_v] !== "undefined") {
      if(typeof params[var_v] === "function") {
        result = params[var_v](d, i, vars);
      } else if(typeof params[var_v] === "string") {
        result = params[var_v];
      } else if(typeof params[var_v] === "number") {
        result = params[var_v];
      } else {
        result = params[var_v];
      }
    }

    return result;
  }

  // Turns parameters into actual values
  utils.mark_params = function(params, vars, d, i) {

    var mark_params = {};

    mark_params.text = "";

    if(typeof params.text !== "undefined") {
      if(typeof params.text === "function") {
        mark_params.text = params.text(d, i , vars);
      } else if(typeof params.text === "string") {
        mark_params.text = params.text;
      }
    } else if(vars.var_text !== "undefined") {
      mark_params.text = vars.accessor_data(d)[vars.var_text];
    }

    mark_params.source = [0, 0];
    mark_params.target = [vars.width, vars.height];
    mark_params.translate = [0, 0];

    if(typeof params.translate !== "undefined" && params.translate !== null) {
      if(typeof params.translate === "function") {
        mark_params.translate = params.translate(d, i, vars);
      } else {
        mark_params.translate = params.translate;
      }
    }

    // Available to all marks
    mark_params.x = utils.init_params("x", 0, params, d, i, vars);
    mark_params.y = utils.init_params("y", 0, params, d, i, vars);
    mark_params.height = utils.init_params("height", 10, params, d, i, vars);
    mark_params.width = utils.init_params("width", 10, params, d, i, vars);
    mark_params.translate[0] += vars.x_scale[0]["func"](vars.accessor_data(d)[vars.var_x]);
    mark_params.translate[1] += vars.y_scale[0]["func"](vars.accessor_data(d)[vars.var_y]);

    // Specific to marks / charts
    mark_params.rotate = utils.init_params("rotate", 0, params, d, i, vars);
    mark_params.fill = utils.init_params("fill", vars.color(vars.accessor_data(d)[vars.var_color]), params, d, i, vars);
    mark_params.stroke = utils.init_params("stroke", 0, params, d, i, vars);
    mark_params.text_anchor = utils.init_params("text_anchor", "end", params, d, i, vars);

    return mark_params;
  }

  utils.mark_params_values = function(params, vars, d, i) {

    var params_values = {};

    params_values.text = utils.init_params_values(vars.var_text, "default", params, d, i, vars);

    // Available to all marks
    params_values.x = utils.init_params_values(vars.var_x, 0, params, d, i, vars);
    params_values.y = utils.init_params_values(vars.var_y, 0, params, d, i, vars);
    params_values.height = utils.init_params_values(vars.var_height, 10, params, d, i, vars);
    params_values.width = utils.init_params_values(vars.var_width, 10, params, d, i, vars);

    params_values.translate = [0, 0];

    params_values.translate[0] += vars.x_scale[0]["func"](vars.accessor_data(d)[vars.var_x]);
    params_values.translate[1] += vars.y_scale[0]["func"](vars.accessor_data(d)[vars.var_y]);

    params_values.rotate = utils.init_params_values(vars.var_rotate, 0, params, d, i, vars);

    return params_values;
  }

  utils.push_array = function(arr, data) {
    var index = -1;
    vars[arr].forEach(function(d, i) {
      if(d === data[vars.var_id]) {
        index = i;
      }
    });

    if(index < 0) {
      vars[arr].push(data[vars.var_id])
    }
  }

  // Find index and removes it
  utils.pop_array = function(arr, data) {
    var index = -1;
    vars[arr].forEach(function(d, i) {
      if(d === data[vars.var_id]) {
        index = i;
      }
    });

    if(index > -1) {
      vars[arr].splice(index, 1);
    }
  }

  utils.empty_array = function(arr, attr) {
    arr[attr] = [];
  }

  utils.duplicate_data = function() {
    vars.all_data = JSON.parse(JSON.stringify(vars.data));
  }
