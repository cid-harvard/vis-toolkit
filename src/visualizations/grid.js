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
            var_text: "index"
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
                          return "translate(" + vars.margin.left + ", " + vars.height/2 + ")";
                        });

        // ITEMS MARKS
        vars.items[0].marks.forEach(function(d) {
          console.log("ADD MARK", d.type)
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

        break;
