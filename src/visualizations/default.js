      default:

       if(typeof vars.default_params[vars.type] === "undefined")
          alert("No params for chart " + vars.type);

        // TODO
        // Contain the parameters in something different than global variable
        // Use the vistk.utils.create_chart()

        console.log("[init.vars.default]", vars)

        if(vars.type == "sparkline") {
          //scope = {};
          //scope = vistk.utils.merge(scope, vars)

          scope = vars.default_params["sparkline"](vars);
          vars = vistk.utils.merge(vars, scope);

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

        // PRE-UPDATE CONNECT
        var gConnect = vars.svg.selectAll(".connect__group")
                        .data(vars.new_data, function(d, i) { return d[vars.var_id]; });
      
        // ENTER CONNECT
        var gConnect_enter = gConnect.enter()
                        .append("g")
                        .attr("class", "connect__group");

        // APPEND AND UPDATE CONNECT MARK
        vars.connect.forEach(function(connect) {

          if(typeof connect.type == "undefined" || connect.type == "time") {

          	connect.marks.forEach(function(params) {
              gConnect_enter.call(vistk.utils.draw_mark, params);
              gConnect.call(vistk.utils.draw_mark, params);
            });

          }/* else if(connect.type == "items" && vars.type == "productspace") {

            if(vars.links.length > 0 && vars.aggregate != vars.var_group) {

              // Connect marks
              var gConnect = vars.svg.selectAll(".connect__group")
                              .data(vars.links);
            
              var gConnect_enter = gConnect.enter()
                              .append("g")
                              .attr("class", "connect__group");

              connect.marks.forEach(function(d) {
                
                vars.connect.type = d.type;
                vars.connect.rotate = d.rotate;

                gConnect_enter.each(vistk.utils.connect_mark)
                              .attr("class", function(d) {
                                return "link source_"+d.source.id+" target_"+d.target.id;
                              })
                              .style("stroke-width", function(d) { return Math.sqrt(d.value); })
                              .style("opacity", .4);

              });

            }
        
          } 
          */
        });

        // EXIT
        var gConnect_exit = gConnect.exit().remove();




        if(typeof vars.items[0] !== "undefined") {
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
