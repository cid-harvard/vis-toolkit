      case "custom":

        // Events handlers
        vars.evt.register("highlightOn", function(d) { });
        vars.evt.register("highlightOut", function(d) { });
        vars.evt.register("selection", function(d) { });

        // Bind data to groups
        var gPoints = vars.svg.selectAll(".mark__group")
                  .data(vars.new_data, function(d, i) { return d[vars.var_text]; });


        var gPoints_enter = gPoints.enter()
                        .append("g")
                        .attr("class", "mark__group")
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
        gPoints_enter.each(vistk.utils.item_mark)

        // Customize it (e.g. add labels)

        // Add a connection mark

        // Add axis

        // Add decoration layers

        // ... what else?

        // EXIT

        // UPDATE

      break;