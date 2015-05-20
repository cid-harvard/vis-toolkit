      case "custom":

        // Events handlers
        vars.evt.register("highlightOn", function(d) { });
        vars.evt.register("highlightOut", function(d) { });
        vars.evt.register("selection", function(d) { });
        vars.evt.register("resize", function(d) { });

        // Bind data to groups
        var gPoints = vars.svg.selectAll(".mark__group")
                         .data(vars.new_data, function(d, i) { return i; });

        var gPoints_enter = gPoints.enter()
                        .append("g")
                        .each(vistk.utils.items_group);


        // Add a graphical mark
        gPoints_enter.each(vistk.utils.items_mark)

        // Customize it (e.g. add labels)

        // Add a connection mark
        gPoints_enter.each(vistk.utils.connect_mark)

        // Add axis

        // Add decoration layers

        // ... what else?

        // EXIT

        // UPDATE

      break;