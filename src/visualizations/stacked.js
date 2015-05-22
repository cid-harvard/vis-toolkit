      case "stacked":

        // Events handlers
        vars.evt.register("highlightOn", function(d) { });
        vars.evt.register("highlightOut", function(d) { });
        vars.evt.register("selection", function(d) { });
        vars.evt.register("resize", function(d) { });

        // PRE-UPDATE
        var gPoints = vars.svg.selectAll(".mark__group")
                         .data(vars.new_data, function(d, i) { return i; });

        // ENTER

        // Add a group for marks
        var gPoints_enter = gPoints.enter()
                        .append("g")
                        .each(vistk.utils.items_group);

        // Add a graphical mark
        gPoints_enter.each(vistk.utils.items_mark);

        // Add an other graphical mark (e.g. text labels)

        // Add a connection mark
        gPoints_enter.each(vistk.utils.connect_mark)

        // Add axis
        gPoints_enter.each(vistk.utils.axis)

        // Add grid layer

        // EXIT
        var gPoints_exit = gPoints.exit();

        // POST-UPDATE
        gPoints
            .transition();

      break;