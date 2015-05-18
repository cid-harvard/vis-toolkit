      case "custom":

        vars.evt.register("highlightOn", function(d) { });
        vars.evt.register("highlightOut", function(d) { });
        vars.evt.register("selection", function(d) { });

        // Bind data to groups
        var gPoints = vars.svg.selectAll(".points")
                  .data(vars.new_data, function(d, i) { return d[vars.var_text]; });


        var gPoints_enter = gPoints.enter()
                        .append("g")
                        .attr("class", "points")
                        .on("mouseover",function(d) {
                          vars.evt.call("highlightOn", d);
                        })
                        .on("mouseleave", function(d) {
                          vars.evt.call("highlightOut", d);
                        })
                        .on("click", function(d) {
                           vars.evt.call("selection", d);
                        });

        // Add a graphical mark
        gPoints_enter.each(vistk.utils.add_mark)

        // Customize it (e.g. add labels)

        // UPDATE

        // EXIT

      break;