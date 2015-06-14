        case "grid":

          vars.params = {

            x_scale: [{
                name: "linear",
                func: d3.scale.linear()
                      .domain([0, nb_dimension])
                      .range([0, vars.width])
              }
            ],

            y_scale: [{
                name: "linear",
                func: d3.scale.linear()
                      .domain([0, nb_dimension])
                      .range([0, vars.height])
              }
            ],

            items: [{
              attr: "name",
              marks: [{
                type: "diamond",
                rotate: "0"
              },{
                type: "text",
                rotate: "-30"
              }]
            }],
            var_x: "x",
            var_y: "y",
          };

          vars = vistk.utils.merge(vars, vars.params);

          // PRE-UPDATE
          var gItems = vars.svg.selectAll(".mark__group")
                           .data(vars.new_data, function(d, i) { return i; });

          // ENTER
          var gItems_enter = gItems.enter()
                          .append("g")
                          .each(vistk.utils.items_group)
                          .attr("transform", function(d, i) {
                            return "translate(" + vars.width / 2 + ", " + vars.height / 2 + ")";
                          });

          // Aggregate into sparklines
          if(vars.aggregate !== vars.var_group) {

            // Create a sparkline for the current cell of the grid

            vars.accessor_values = function(d) { return d.values; };

            // PRE-UPDATE CONNECT
            var gConnect = vars.svg.selectAll(".connect__group")
                            .data(vars.time_data, function(d, i) { return i; });
          
            // ENTER CONNECT
            var gConnect_enter = gConnect.enter()
                            .append("g")
                            .attr("class", "connect__group")
                            .attr("transform", "translate(0,0)")
                            .property("__context__", context)
                            .attr("transform", function(d) {
                              return "translate(" + (vars.params.x_scale[0]["func"](vars.accessor_values(d)[0][vars.var_x])-5) + ", " + (vars.y_scale[0]["func"](vars.accessor_values(d)[0][vars.var_y])/1.25-5) + ")";
                            });

            // APPEND CONNECT MARK
            vars.connect[0].marks.forEach(function(d) {

              vars.mark.type = d.type;
              vars.mark.rotate = d.rotate;
              gConnect_enter.each(vistk.utils.connect_mark);

            });



          } else {


            // ITEMS MARKS
            vars.items[0].marks.forEach(function(d) {

              // Enter
              vars.mark.type = d.type;
              vars.mark.rotate = d.rotate;
              gItems_enter.each(vistk.utils.items_mark);

              // Update
              gItems.each(vistk.utils.items_mark);
            });

            // EXIT
            var gItems_exit = gItems.exit().remove();

            // POST-UPDATE
            vars.svg.selectAll(".mark__group")
                            .classed("highlighted", function(d, i) { return d.__highlighted; })
                            .transition()
                            .delay(function(d, i) { return i / vars.data.length * 100; })
                            .duration(vars.duration)
                            .attr("transform", function(d, i) {
                              return "translate(" + vars.x_scale[0]["func"](d[vars.var_x]) + ", " + vars.y_scale[0]["func"](d[vars.var_y]) + ")";
                            });

          }

          break;
