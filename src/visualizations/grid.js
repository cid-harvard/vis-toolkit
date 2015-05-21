        case "grid":

          nb_dimension =  Math.ceil(Math.sqrt(vars.data.length));

          // Create the x and y scale as index scale
          vars.x_scale = d3.scale.linear()
                    .domain([0, nb_dimension])
                    .range([0, vars.width]);

          vars.y_scale = d3.scale.linear()
                    .domain([0, nb_dimension])
                    .range([0, vars.height]);

          var res = [];

          // Create foci for each dimension
          // TOFIX: should update children, not necessary replace
          d3.range(nb_dimension).map(function(d, i) {
             d3.range(nb_dimension).map(function(e, j) {

              // To make sure we don't update more points than necessary
              if(i * nb_dimension + j < vars.data.length) {
                // IMPORTANT to clone the _params here
                var index = i*nb_dimension+j;
                res.push({index: index, x: i, y: j});
              }
            })
          })

          var gPoints = vars.svg.selectAll(".mark__group")
                          .data(res, function(d, i) { return d["index"]; });

          // ENTER
          var gPoints_enter = gPoints.enter()
                          .append("g")
                          .each(vistk.utils.items_group);

          // Add a graphical mark
          gPoints_enter.each(vistk.utils.items_mark)
                            .style("fill", "gren");

          // EXIT
          var gPoints_exit = gPoints.exit().remove();

          vars.svg.selectAll(".mark__group")
                .transition()
                .attr("transform", function(d) {
                  return "translate(" +  vars.x_scale(d.x) + ", " + vars.y_scale(d.y) + ")";
                })
                .style("fill", "blue");

        break;