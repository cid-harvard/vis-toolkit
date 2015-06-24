      default:

       if(typeof vars.default_params[vars.type] === "undefined")
          alert("No params for chart " + vars.type);

        // TODO
        // Contain the parameters in something different than global variable
        // Use the vistk.utils.create_chart()

        console.log("[init.vars.default]", vars)

        // Sparkline is currenlty the only chart that can have a scope as parameter
        if(vars.type == "sparkline" || vars.type == "dotplot" || vars.type == "barchart") {
          //scope = {};
          //scope = vistk.utils.merge(scope, vars)

          scope = vars.default_params[vars.type](vars);
          vars = vistk.utils.merge(vars, scope);
          vars.items = vistk.utils.merge(vars.items, vars.user_vars.items);

        } else {

          // LOAD CHART PARAMS
          vars = vistk.utils.merge(vars, vars.default_params[vars.type]);

          // LOAD USER PARAMS
          vars.items = vistk.utils.merge(vars.items, vars.user_vars.items);
        
        }

        // CREATE AXIS
        vars.svg.call(vistk.utils.x_axis);
        vars.svg.call(vistk.utils.y_axis)

        // GRID
        vars.svg.selectAll(".x.grid").data([vars.new_data])
          .enter()
            .append("g")
            .attr("class", "x grid")
            .style("display", function() { return vars.x_grid_show ? "block": "none"; })
            .attr("transform", "translate(0," + (vars.height-vars.margin.top-vars.margin.bottom) + ")");

        vars.svg.selectAll(".x.grid").transition()
            .duration(vars.duration)
            .call(vistk.utils.make_x_axis()
            .tickSize(-vars.height+vars.margin.top+vars.margin.bottom, 0, 0)
            .tickFormat(""));

        vars.svg.selectAll(".y.grid").data([vars.new_data])
          .enter()
            .append("g")
            .attr("class", "y grid")
            .style("display", function() { return vars.y_axis_show ? "block": "none"; })
            .attr("transform", "translate(" + vars.margin.left + ", 0)");

        vars.svg.selectAll(".y.grid").transition()
            .duration(vars.duration)
            .call(vistk.utils.make_y_axis()
            .tickSize(-vars.width+vars.margin.left+vars.margin.right, 0, 0)
            .tickFormat(""));

        if(typeof vars.connect !== "undefined" && typeof vars.connect[0] !== "undefined") {

          // 1/ Between different items at a given time for one dimension
          // 2/ Between same items at a given time points
          // 2/ Between same items at multiple given times

          // By default, connecting time points
          var connect_data = vars.new_data;

          // Connecting items
          if(vars.connect[0].type == "items" && vars.type == "productspace") {
            connect_data = vars.links;

          // Connecting dimension
          } else if(vars.connect[0].type == "dimension") {

          }

          // PRE-UPDATE CONNECT
          // TOOD: find a common join to al types of connections
          var gConnect = vars.svg.selectAll(".connect__group")
                          .data(connect_data);
        
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

          // EXIT
          var gConnect_exit = gConnect.exit().remove();

        }

        if(typeof vars.items !== "undefined" && vars.items[0] !== "undefined") {

          // PRE-UPDATE ITEMS
          var gItems = vars.svg.selectAll(".mark__group")
                          .data(vars.new_data, function(d, i) { return d[vars.var_id]; });

          // ENTER ITEMS
          var gItems_enter = gItems.enter()
                          .append("g")
                          .each(vistk.utils.items_group)
                          .attr("transform", function(d, i) {
                            return "translate(" + vars.x_scale[0]["func"](d[vars.var_x]) + ", " + vars.y_scale[0]["func"](d[vars.var_y]) + ")";
                          });

           // APPEND AND UPDATE ITEMS MARK
            vars.items[0].marks.forEach(function(params) {
              gItems_enter.call(vistk.utils.draw_mark, params);
              gItems.call(vistk.utils.draw_mark, params);
            });

            /* Should be as below but current params don't match this format

              // APPEND AND UPDATE ITEMS MARK
              vars.items.forEach(function(item) {
                item.marks.forEach(function(params) {
                  gItems_enter.call(vistk.utils.draw_mark, params);
                  gItems.call(vistk.utils.draw_mark, params);
                });
              });

            */

          // POST-UPDATE ITEMS GROUPS
          vars.svg.selectAll(".mark__group")
                          .transition()
                          .duration(vars.duration)
                          .attr("transform", function(d, i) {
                            return "translate(" + vars.x_scale[0]["func"](d[vars.var_x]) + ", " + vars.y_scale[0]["func"](d[vars.var_y]) + ")";
                          });

          // ITEMS EXIT
          var gItems_exit = gItems.exit().remove();


        }
        
        vistk.utils.background_label(vars.title);

      break;
