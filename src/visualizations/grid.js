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
            var_x: "i",
            var_y: "j"
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

          // Enter
          vars.mark.type = d.type;
          vars.mark.rotate = d.rotate;
          gItems_enter.each(vistk.utils.items_mark);

          // Update
          gItems.each(vistk.utils.items_mark);
        });

        gItems.exit().remove();

        break;
