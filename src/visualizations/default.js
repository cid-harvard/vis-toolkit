      default:

       if(typeof vars.default_params[vars.type] === "undefined")
          alert("No params for chart " + vars.type);

        // TODO
        // Contain the parameters in something different than global variable
        // Use the vistk.utils.create_chart()

        // LOAD CHART PARAMS
        vars = vistk.utils.merge(vars, vars.default_params[vars.type]);

        // LOAD USER PARAMS
        vars.items = vistk.utils.merge(vars.items, vars.user_vars.items);

        vars.svg.call(vistk.utils.axis);

        // PRE-UPDATE CONNECT
        var gConnect = vars.svg.selectAll(".connect__group")
                        .data(vars.new_data, function(d, i) { return d[vars.var_id]; });
      
        // ENTER CONNECT
        var gConnect_enter = gConnect.enter()
                        .append("g")
                        .attr("class", "connect__group");

        // APPEND AND UPDATE CONNECT MARK
        vars.connect.forEach(function(connect) {
        	connect.marks.forEach(function(params) {
          gConnect_enter.call(vistk.utils.draw_mark, params);
          gConnect.call(vistk.utils.draw_mark, params);
        });

        });

        // PRE-UPDATE ITEMS
        var gItems = vars.svg.selectAll(".mark__group")
                        .data(vars.new_data, function(d, i) { return d[vars.var_id]; });

        // ENTER ITEMS
        var gItems_enter = gItems.enter()
                        .append("g")
                        .each(vistk.utils.items_group)
                        .attr("transform", function(d, i) {
                        	console.log(d, vars.y_scale[0]["func"](d[vars.var_y]), vars.var_y)
                          return "translate(" + vars.x_scale[0]["func"](d[vars.var_x]) + ", " + vars.y_scale[0]["func"](d[vars.var_y]) + ")";
                        });

        // APPEND AND UPDATE ITEMS MARK
        vars.items[0].marks.forEach(function(params) {
          gItems_enter.call(vistk.utils.draw_mark, params);
          gItems.call(vistk.utils.draw_mark, params);
        });

        // POST-UPDATE ITEMS GROUPS
        vars.svg.selectAll(".mark__group")
                        .transition()
                        .duration(vars.duration)
                        .attr("transform", function(d, i) {
                          return "translate(" + vars.x_scale[0]["func"](d[vars.var_x]) + ", " + vars.y_scale[0]["func"](d[vars.var_y]) + ")";
                        });


      break;