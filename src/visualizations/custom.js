      case "custom":

        // OVERRIDING PARAMETERS
        vars.params = {
        }

        // REGISTER EVENTS
        vars.evt.register("highlightOn", function(d) { });
        vars.evt.register("highlightOut", function(d) { });
        vars.evt.register("selection", function(d) { });
        vars.evt.register("resize", function(d) { });

        // PRE-UPDATE
        var gItems = vars.svg.selectAll(".mark__group")
                         .data(vars.new_data, function(d, i) { return i; });

        // ENTER

        // Add a group for marks
        var gItems_enter = gItems.enter()
                        .append("g")
                        .each(vistk.utils.items_group);

        // Add a graphical mark
        gItems_enter.each(vistk.utils.items_mark);

        // Add an other graphical mark (e.g. text labels)

        // Add a connection mark
        gItems_enter.each(vistk.utils.connect_mark);

        // Add axis
        gItems_enter.each(vistk.utils.axis);

        // Add grid layer

        // EXIT
        var gItems_exit = gItems.exit();

        // POST-UPDATE
        gItems
            .transition();

      break;
      