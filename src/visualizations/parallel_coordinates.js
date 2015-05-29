      case "parallel_coordinates":

        vars = vistk.utils.merge(vars, vars.params["dotplot"]);

        // REGISTER EVENTS
        vars.evt.register("highlightOn", function(d) {

          gItems.selectAll(".items__group").classed("highlighted", function(e, j) { return e === d; });
          gItems.selectAll(".dot__label").classed("highlighted", function(e, j) { return e === d; });
        
        });

        vars.evt.register("highlightOut", function(d) {

          gItems.selectAll(".dot__circle").classed("highlighted", false);
          gItems.selectAll(".dot__label").classed("highlighted", false);

        });

        vars.evt.register("selection", function(d) {

          var selected_node = d3.selectAll(".dot__circle")
            .filter(function(e, j) { return e === d; });

          selected_node.classed("selected", !selected_node.classed("selected"));

        });

        // TODO: should specify this is an horizontal axis
        vars.svg.call(vistk.utils.axis);

        // PRE-UPDATE
        var gItems = vars.svg.selectAll(".mark__group")
                         .data(vars.new_data, function(d, i) { return i; });

        // ENTER
        var gItems_enter = gItems.enter()
                        .append("g")
                        .each(vistk.utils.items_group)
                        .attr("transform", function(d, i) {
                          return "translate(" + vars.margin.left + ", " + vars.height/2 + ")";
                        });

        // Add graphical marks
        vars.items.forEach(function(d) {

          vars.mark.type = d.type;
          vars.mark.rotate = d.rotate;
          gItems_enter.each(vistk.utils.items_mark);

        });

        // EXIT
        var gItems_exit = gItems.exit().style("opacity", 0.1);

        // POST-UPDATE
        vars.svg.selectAll(".mark__group")
                        .transition()
                        .delay(function(d, i) { return i / vars.data.length * 100; })
                        .duration(vars.duration)
                        .attr("transform", function(d, i) {
                          if(vars.x_type === "index") {
                            return "translate(" + d[vars.var_x] + ", " + vars.height/2 + ")";
                          } else {
                            return "translate(" + vars.x_scale[0]["func"](d[vars.var_x]) + ", " + vars.height/2 + ")";
                          }
                        });

        break;
