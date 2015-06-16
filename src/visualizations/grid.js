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
          vars.items = vistk.utils.merge(vars.items, vars.user_vars.items);

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


          // Add graphical marks
          vars.items[0].marks.forEach(function(params) {

            // Enter mark
            gItems_enter.call(vistk.utils.draw_mark, params);

            // Update mark
            gItems.call(vistk.utils.draw_mark, params);

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

          break;
