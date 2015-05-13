        case "grid":

          nb_dimension =  Math.ceil(Math.sqrt(vars.data.length));

          // Create the x and y scale as index scale
          vars.x_scale = d3.scale.linear()
                    .domain([0, nb_dimension])
                    .range([0, vars.width]);

          vars.y_scale = d3.scale.linear()
                    .domain([0, nb_dimension])
                    .range([0, vars.height]);

          res = [];

          // Create foci for each dimension
          // TOFIX: should update children, not necessary replace
          d3.range(nb_dimension).map(function(d, i) {
             d3.range(nb_dimension).map(function(e, j) {

              // To make sure we don't update more points than necessary
              if(i*nb_dimension+j < vars.data.length) {

                // IMPORTANT to clone the _params here
                var index = i*nb_dimension+j;
                res.push({index: index, x: vars.x_scale(i), y: vars.y_scale(j)});
              }
            })
          })

        var gPoints = vars.svg.selectAll(".points")
                        .data(res, function(d, i) { return d["index"]; });

          // ENTER
          var gPoints_enter = gPoints.enter()
                        .append("g")
                          .attr("class", "points")
                          .on("mouseenter", function(d, i) {
                            vars.evt.call("highlightOn", d);
                          })
                          .on("mouseout", function(d) {
                            vars.evt.call("highlightOut", d);
                          })
                          .on("click", function(d) {
                            vars.evt.call("clicked", d);
                          });

          var dots = gPoints_enter.append("circle")
              .attr("r", 5)
              .attr("cx", 0)
              .attr("cy", 0)
              .attr("class", "dot__circle")
              .style("fill", function(d) { return vars.color(d[vars.var_color]); })

          vars.svg.selectAll(".points")
              .transition()
              .attr("transform", function(d) {
                console.log(d)
                return "translate(" + d.x + ", " + d.y + ")";
              })

        break;