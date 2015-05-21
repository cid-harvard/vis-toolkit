      case "scatterplot":

        vars.evt.register("highlightOn", function(d) {

          gPoints.selectAll(".items_mark").classed("highlighted", function(e, j) { return e === d; });
        //  gPoints.selectAll(".items_mark").classed("highlighted", function(e, j) { return e === d; });

          // Tentative of data driven selection update
          vars.data.forEach(function(e) {
            if(d === e) {
              e.__highlight = true;
            } else {
              e.__highlight = false;
            }

          });

        });

        vars.evt.register("highlightOut", function(d) {

          gPoints.selectAll(".items_mark").classed("highlighted", false);
          gPoints.selectAll(".dot__label").classed("highlighted", false);

          vars.data.forEach(function(e) { d.__highlight = false; });

        });

        vars.x_scale = d3.scale.linear()
            .range([vars.margin.left, vars.width-vars.margin.left-vars.margin.right]);

        vars.y_scale = d3.scale.linear()
            .range([vars.height-vars.margin.top-vars.margin.bottom, vars.margin.top]);

        vars.x_scale.domain([0, d3.max(vars.data, function(d) { return d[vars.var_x]; })]).nice();
        vars.y_scale.domain([0, d3.max(vars.data, function(d) { return d[vars.var_y]; })]).nice();

        // AXIS
        vars.x_axis = d3.svg.axis()
            .scale(vars.x_scale)
            .orient("bottom");

        vars.y_axis = d3.svg.axis()
            .scale(vars.y_scale)
            .orient("left");

        vars.svg.selectAll(".label").data(vars.new_data)
          .enter()
            .append("text")
            .attr("class", "year label")
            .attr("text-anchor", "end");

        vars.svg.selectAll(".x.axis").data([vars.new_data])
          .enter()
            .append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (vars.height-vars.margin.bottom-vars.margin.top) + ")")              
          .append("text")
            .attr("class", "label")
            .attr("x", vars.width-vars.margin.left-vars.margin.right)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text(function(d) { return vars.var_x; });

        vars.svg.selectAll(".y.axis").data([vars.new_data])
          .enter()
            .append("g")
            .attr("class", "y axis")
            .attr("transform", "translate("+vars.margin.left+", 0)")              
          .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(function(d) { return vars.var_y; });

        vars.svg.selectAll(".x.axis").call(vars.x_axis);
        vars.svg.selectAll(".y.axis").call(vars.y_axis);

        // Background year label
        vars.svg.selectAll(".label")
            .attr("y", 124)
            .attr("x", 500)
            .text(vars.current_time);

        var gPoints = vars.svg.selectAll(".items__group")
                        .data(vars.new_data, function(d, i) { return d.name + " " + i; });

        // TODO: create groups this way
        // gPoints = vistk.utils.items_groups

        // Here we want to deal with aggregated datasets
        // TODO
        // [ ] Use gPoints_enter.each(vistk.utils.add_mark);
        // [ ] Animated transition with the non-aggregated points
        if(vars.aggregate === vars.var_group) {

          var gPoints_enter = gPoints.selectAll(".points")
                        .enter()
                          .append("g")
                          .attr("class", "points");

          var dots = gPoints_enter.append("rect")
            .attr("r", 5)
            .attr("height", 10)
            .attr("width", 10)
            .style("fill", function(d) { return vars.color(d[vars.var_color]); });

          var labels = gPoints_enter.append("text")
              .attr("x", 10)
              .attr("y", 0)
              .attr("dy", ".35em")
              .style("text-anchor", "start")
              .text(function(d) { return d[vars.var_text]; });

          var gPoints_exit = gPoints.exit().style("opacity", .1);

          // Update all the remaining dots
          gPoints.style("opacity", 1);

          gPoints
              .transition()
              .attr("transform", function(d) {
                return "translate(" + vars.x_scale(d[vars.var_x])+", " + vars.y_scale(d[vars.var_y]) + ")";
              });

        } else { 

          // ENTER
          var gPoints_enter = gPoints.enter()
                        .append("g")
                          .attr("class", "items__group")
                          .on("mouseenter", function(d, i) {
                            vars.evt.call("highlightOn", d);
                          })
                          .on("mouseout", function(d) {
                            vars.evt.call("highlightOut", d);
                          })
                          .on("click", function(d) {
                            vars.evt.call("clicked", d);
                          });

          gPoints_enter.each(vistk.utils.items_mark);

          // TODO: add this as a graphical mark
          var labels = gPoints_enter.append("text")
              .attr("x", 10)
              .attr("y", 0)
              .attr("dy", ".35em")
              .attr("class", "dot__label")              
              .style("text-anchor", "start")
              .text(function(d) { return d[vars.var_text]; });

          // EXIT
          var gPoints_exit = gPoints.exit().style("opacity", .1);

          // UPDATE
          if(vars.data.filter(function(d) { return d.__highlight;}).length > 0) {

            // Update all the remaining dots
            gPoints.style("opacity", function(d) {
                if(d.__highlight) {
                  return 1;
                } else {
                  return 0.1;
                }
              });

          } else {

            gPoints.style("opacity", 1);
          
          }

          gPoints
            .transition()
            .attr("transform", function(d) {
              return "translate(" + vars.x_scale(d[vars.var_x]) + ", " + vars.y_scale(d[vars.var_y]) + ")";
            });
        }

        break;
        