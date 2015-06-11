        case "grid":

          // Create the x and y scale as index scale
          vars.x_scale = d3.scale.linear()
                    .domain([0, nb_dimension])
                    .range([0, vars.width]);

          vars.y_scale = d3.scale.linear()
                    .domain([0, nb_dimension])
                    .range([0, vars.height]);

          var gPoints = vars.svg.selectAll(".mark__group")
                          .data(vars.new_data, function(d, i) { return d["index"]; });

          // ENTER
          var gPoints_enter = gPoints.enter()
                          .append("g")
                          .each(vistk.utils.items_group);

          // Add a graphical mark
          gPoints_enter.each(vistk.utils.items_mark)
                          .style("fill", "gren");

          // EXIT
          var gPoints_exit = gPoints.exit().remove();

          vars.svg.selectAll(".mark__group")
                .transition()
                .attr("transform", function(d) {
                  return "translate(" +  vars.x_scale(d.x) + ", " + vars.y_scale(d.y) + ")";
                })
                .style("fill", "blue");

        break;