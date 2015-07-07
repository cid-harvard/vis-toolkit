      case "treemap_old":


        var t_params = treemap_params(vars);

        vars = vistk.utils.merge(vars, t_params);

        // LOAD USER PARAMS
        vars.items = vistk.utils.merge(vars.items, vars.user_vars.items);

        // PRE-UPDATE
        var gItems = vars.svg.selectAll("g")
            .data(vars.new_data, function(d, i) { return d[vars.var_id]; });

        // ENTER
        var gItems_enter = gItems.enter()
                      .insert("g", ":first-child")
                        .each(utils.items_group)
                        .attr("transform", function(d) { 
                          return "translate(" + d.x + "," + d.y + ")"; 
                        });

        gItems.transition().duration(vars.duration)
                      .attr("transform", function(d) { 
                        return "translate(" + d.x + "," + d.y + ")"; 
                      });

        // Add graphical marks
        t_params.items[0].marks.forEach(function(params) {

          gItems_enter
                .filter(function(d, j) {
                    return (params.type == "rect" && d.depth == 2) || (params.type == "text" && d.depth == 1);
                })
                .call(utils.draw_mark, params);

          gItems.select("rect")
                .transition().duration(vars.duration)
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", function(d) { return d.dx; })
                .attr("height", function(d) { return d.dy; });

          // Only label the parents
          gItems_enter
                 .filter(function(d, j) {
                   return d.depth == 1 &&  d.dx > 30 && d.dy > 30;
                 })
                 .append("foreignObject")
                 .attr("width", function(d) { return (d.dx - vars.padding) + "px"; })
                 .attr("height", function(d) { return (d.dy - 2*vars.padding) + "px"; })
               .append("xhtml:body")
                 .style("font", "14px 'Helvetica Neue'")
               .append("div")
                 .style("padding-top", function(d) { return (vars.padding/2)+"px"; })
                 .style("width", function(d) { return (d.dx - 2*vars.padding) + "px"; })
                 .style("height", function(d) { return (d.dy - 2*vars.padding) + "px"; })
                 .style({"text-overflow": "ellipsis", "overflow": "hidden"})
                 .html(function(d) {
                   return vars.accessor_data(d)[vars.var_text];
                 });

        });

        // ITEMS EXIT
        var gItems_exit = gItems.exit().remove();

      break;
