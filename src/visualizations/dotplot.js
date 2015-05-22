      case "dotplot":

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

        if(vars.x_type === "index") {

          vars.x_scale = d3.scale.ordinal()
                .domain(d3.range(vars.new_data.length))
                .rangeBands([vars.margin.left, vars.width - vars.margin.left - vars.margin.right]);

          vars.new_data.sort(function ascendingKey(a, b) {
            return d3.ascending(a[vars.var_x], b[vars.var_x]);
          })
          .forEach(function(d, i) {
            d.rank = vars.x_scale(i);
          });

        } else {

          vars.x_scale = d3.scale.linear()
              .range([vars.margin.left, vars.width-vars.margin.left-vars.margin.right])
              .domain([0, d3.max(vars.new_data, function(d) { return d[vars.var_x]; })])
              .nice();
        
        }

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

        // Add a graphical mark (items)
        gItems_enter.each(vistk.utils.items_mark);

        // Add a graphical mark (labels)
        vars.mark.type = "text";
        vars.mark.rotate = "-30";

        gItems_enter.each(vistk.utils.items_mark);

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
                            return "translate(" + vars.x_scale(d[vars.var_x]) + ", " + vars.height/2 + ")";
                          }
                        });

        break;        
