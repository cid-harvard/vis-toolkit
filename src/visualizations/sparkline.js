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
        vars.connect[0].marks.forEach(function(params) {
          console.log("PARAM", params)
          // Enter mark
          gConnect_enter.call(vistk.utils.draw_mark, params);

          // Update mark
          gConnect.call(vistk.utils.draw_mark, params);

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

        // Add graphical marks
        vars.items[0].marks.forEach(function(params) {

          // Enter mark
          gItems_enter.call(vistk.utils.draw_mark, params);

          // Update mark
          gItems.call(vistk.utils.draw_mark, params);

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
