      default:

       if(typeof vars.default_params[vars.type] === "undefined") {
          console.log("No params for chart " + vars.type);
       }

        // TODO
        // Contain the parameters in something different than global variable
        // Use the utils.create_chart()

        if(vars.dev) { console.log("[init.vars.default]", vars); }
        
        // Sparkline is currenlty the only chart that can have a scope as parameter
        if(vars.list_params.indexOf(vars.type) >= 0) {

          var scope = {};
          scope = vars.default_params[vars.type](vars);
          vars = vistk.utils.merge(vars, scope);

          if(vars.type !== "stacked")
            vars.items = vistk.utils.merge(vars.items, vars.user_vars.items);

        } else {

          // LOAD CHART PARAMS
          vars = vistk.utils.merge(vars, vars.default_params[vars.type]);

          // LOAD USER PARAMS
          vars.items = vistk.utils.merge(vars.items, vars.user_vars.items);
        
        }

        if(typeof vars.items !== "undefined" && vars.items[0] !== "undefined" && vars.type !== "stacked") {

          // PRE-UPDATE ITEMS
          var gItems = vars.svg.selectAll(".mark__group")
                          .data(vars.new_data, function(d, i) { return vars.accessor_data(d)[vars.var_id]; });

          // ENTER ITEMS
          var gItems_enter = gItems.enter()
                          .insert("g", ":first-child")
                          .attr("transform", function(d, i) {
                            return "translate(" + vars.x_scale[0]["func"](vars.accessor_data(d)[vars.var_x]) + ", " + vars.y_scale[0]["func"](vars.accessor_data(d)[vars.var_y]) + ")";
                          });

           // APPEND AND UPDATE ITEMS MARK
            vars.items[0].marks.forEach(function(params) {
          
              if(typeof params.filter == "undefined")
                params.filter = function() { return true; };

              gItems_enter.filter(params.filter).call(utils.draw_mark, params);
              gItems.filter(params.filter).call(utils.draw_mark, params);
            });

            // Bind events to groups after marks have been created
            gItems.each(utils.items_group);

            /* Should be as below but current params don't match this format

              // APPEND AND UPDATE ITEMS MARK
              vars.items.forEach(function(item) {
                item.marks.forEach(function(params) {
                  gItems_enter.call(utils.draw_mark, params);
                  gItems.call(utils.draw_mark, params);
                });
              });

            */

          // POST-UPDATE ITEMS GROUPS
          vars.svg.selectAll(".mark__group")
                          .transition()
                          .duration(vars.duration)
                          .attr("transform", function(d, i) {
                            return "translate(" + vars.x_scale[0]["func"](vars.accessor_data(d)[vars.var_x]) + ", " + vars.y_scale[0]["func"](vars.accessor_data(d)[vars.var_y]) + ")";
                          });

          // ITEMS EXIT
          var gItems_exit = gItems.exit().remove();

          if(vars.zoom.length > 0) {

            utils.zoom_to_nodes(vars.zoom);

          } else {
            
            vars.svg.transition()
                    .duration(vars.duration)
                    .attr("transform", "translate(" + vars.margin.left + "," + vars.margin.top + ")");

          }

        }

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
                          .insert("g", ":first-child")
                          .attr("class", "connect__group");

          // APPEND AND UPDATE CONNECT MARK
          vars.connect.forEach(function(connect) {

              connect.marks.forEach(function(params) {
            
                if(typeof params.filter == "undefined")
                  params.filter = function() { return true; };

                gConnect_enter.filter(params.filter).call(utils.draw_mark, params);
                gConnect.filter(params.filter).call(utils.draw_mark, params);
              });

          });

          // EXIT
          var gConnect_exit = gConnect.exit().remove();

        }

        // CREATE AXIS
        if(vars.x_axis_show)
          vars.svg.call(utils.x_axis);
  
       if(vars.y_axis_show)
          vars.svg.call(utils.y_axis);

        if(vars.x_grid_show) {
          vars.svg.selectAll(".x.grid").data([vars.new_data])
            .enter()
              .append("g")
              .attr("class", "x grid")
              .style("display", function() { return vars.x_grid_show ? "block": "none"; })
              .attr("transform", "translate(0," + (vars.height-vars.margin.top-vars.margin.bottom) + ")");

          vars.svg.selectAll(".x.grid").transition()
              .duration(vars.duration)
              .call(utils.make_x_axis()
              .tickSize(-vars.height+vars.margin.top+vars.margin.bottom, 0, 0)
              .tickFormat(""));
        }

        if(vars.y_grid_show) {
          vars.svg.selectAll(".y.grid").data([vars.new_data])
            .enter()
              .append("g")
              .attr("class", "y grid")
              .style("display", function() { return vars.y_axis_show ? "block": "none"; })
              .attr("transform", "translate(" + vars.margin.left + ", 0)");

          vars.svg.selectAll(".y.grid").transition()
              .duration(vars.duration)
              .call(utils.make_y_axis()
              .tickSize(-vars.width+vars.margin.left+vars.margin.right, 0, 0)
              .tickFormat(""));
        }

        utils.background_label(vars.title);

      break;
