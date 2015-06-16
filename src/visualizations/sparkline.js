      case "sparkline":

        // LOAD CHART PARAMS
        vars = vistk.utils.merge(vars, vars.params["sparkline"]);

        // TODO: LOAD USER PARAMS

        // PRE-UPDATE CONNECT
        var gConnect = vars.svg.selectAll(".connect__group")
                        .data(vars.time_data, function(d, i) { return i; });
      
        // ENTER CONNECT
        var gConnect_enter = gConnect.enter()
                        .append("g")
                        .attr("class", "connect__group");

        // APPEND CONNECT MARK
        vars.connect[0].marks.forEach(function(d) {
          
          vars.mark.type = d.type;
          vars.mark.rotate = d.rotate;
          vars.mark.stroke = d.stroke;
          gConnect_enter.each(vistk.utils.connect_mark);

          // Update
          gConnect.each(vistk.utils.connect_mark);

        });

        // PRE-UPDATE ITEMS
        var gItems = vars.svg.selectAll(".items__group")
                        .data(vars.new_data, function(d, i) { return i; });

        // ENTER ITEMS
        var gItems_enter = gItems.enter()
                        .append("g")
                        .each(vistk.utils.items_group)
                        .attr("transform", function(d, i) {
                          return "translate(" + vars.x_scale[0]["func"](d[vars.time.var_time]) + ", " + vars.y_scale[0]["func"](d[vars.var_y]) + ")";
                        });

        // ITEMS MARKS
        vars.items[0].marks.forEach(function(d) {

          // Enter
          vars.mark.type = d.type;
          vars.mark.rotate = d.rotate;

          gItems_enter.each(vistk.utils.items_mark);

          // Update
          gItems.each(vistk.utils.items_mark);

        });

        // POST-UPDATE ITEMS
        vars.svg.selectAll(".items__group")
                        .transition()
                        .delay(function(d, i) { return i / vars.data.length * 100; })
                        .duration(vars.duration)
                        .attr("transform", function(d, i) {
                          return "translate(" + vars.x_scale[0]["func"](d[vars.time.var_time]) + ", " + vars.y_scale[0]["func"](d[vars.var_y]) + ")";
                        });
        break;
