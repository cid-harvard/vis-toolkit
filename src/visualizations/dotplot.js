      case "dotplot":

        vars.evt.register("highlightOn", function(d) {

          gPoints.selectAll(".dot__circle").classed("highlighted", function(e, j) { return e === d; });
          gPoints.selectAll(".dot__label").classed("highlighted", function(e, j) { return e === d; });
        
        });

        vars.evt.register("highlightOut", function(d) {

          gPoints.selectAll(".dot__circle").classed("highlighted", false);
          gPoints.selectAll(".dot__label").classed("highlighted", false);

        });

        vars.evt.register("selection", function(d) {

          var selected_node = d3.selectAll(".dot__circle")
            .filter(function(e, j) { return e === d; })

          selected_node.classed("selected", !selected_node.classed("selected"));

        });

        if(vars.x_type == "index") {

          vars.x_scale = d3.scale.ordinal()
                .domain(d3.range(new_data.length))
                .rangeBands([vars.margin.left, vars.width-vars.margin.left-vars.margin.right]);

          new_data.sort(function ascendingKey(a, b) {
            return d3.ascending(a[vars.var_x], b[vars.var_x]);
          })
          .forEach(function(d, i) {
            d.rank = vars.x_scale(i);
          });

        } else {

          vars.x_scale = d3.scale.linear()
              .range([vars.margin.left, vars.width-vars.margin.left-vars.margin.right])
              .domain([0, d3.max(new_data, function(d) { return d[vars.var_x]; })]).nice();
        
        }

        vars.x_axis = d3.svg.axis()
            .scale(vars.x_scale)
            .ticks(vars.nb_ticks)
            .orient("bottom");

        vars.svg.selectAll(".label").data(new_data)
          .enter()
            .append("text")
            .attr("text-anchor", "end");

        vars.svg.selectAll(".x.axis").data([new_data])
          .enter()
            .append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (vars.height/2) + ")")              
          .append("text")
            .attr("class", "label")
            .attr("x", vars.width-vars.margin.left-vars.margin.right)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text(function(d) { 
              if(typeof vars.x_text != undefined && vars.x_text != null)
                return vars.var_x;
              else
                return '';
            });

        vars.svg.selectAll(".x.axis").transition().call(vars.x_axis)

        var gPoints = vars.svg.selectAll(".points")
                        .data(new_data, function(d, i) { return d[vars.var_text]; });

        var gPoints_enter = gPoints.enter()
                        .append("g")
                        .attr("class", "points")
                        .attr("transform", function(d, i) {
                          return "translate(" + vars.margin.left + ", " + vars.height/2 + ")";
                        })
                        .on("mouseover",function(d) {
                          vars.evt.call("highlightOn", d);
                        })
                        .on("mouseleave", function(d) {
                          vars.evt.call("highlightOut", d);
                        })
                        .on("click", function(d) {
                           vars.evt.call("selection", d);
                          /*
                          var index = vars.selection.indexOf(d);

                          if(index <0)
                            vars.selection.push(d);
                          else
                            vars.selection.splice(index, 1);
                          */
                        });

        if(typeof vars.mark != "undefined") {

          switch(vars.mark.type) {

            case "circle":
 
              gPoints_enter.append("circle")
                              .attr("r", 5)
                              .attr("cx", 0)
                              .attr("cy", 0)
                              .attr("class", "dot__circle");

              break;

            case "rect":
 
             gPoints_enter.append("rect")
                              .attr("height", vars.mark.height)
                              .attr("width", vars.mark.width)                              
                              .attr("x", -vars.mark.width/2)
                              .attr("y", -vars.mark.height/2)
                              .attr("class", "dot__circle");

              break;

            case "diamond":

             gPoints_enter.append("rect")
                              .attr("height", vars.mark.height)
                              .attr("width", vars.mark.width)                              
                              .attr("x", -vars.mark.width/2)
                              .attr("y", -vars.mark.height/2)
                              .attr("class", "dot__circle")
                              .attr("transform", "rotate(45)")

              break;
          }

        }
 
        gPoints_enter.append("text")
                        .attr("x", 10)
                        .attr("y", 0)
                        .attr("dy", ".35em")
                        .attr("class", "dot__label")
                        .attr("transform", "rotate(-30)")
                        .text(function(d) { return d[vars.var_text]; })

        var gPoints_exit = gPoints.exit().style("opacity", .1);

        vars.svg.selectAll(".points")
                        .transition().delay(function(d, i) { return i / vars.data.length * 100; }).duration(1000)
                        .attr("transform", function(d, i) {
                          if(vars.x_type == "index")
                            return "translate("+d.rank+", "+vars.height/2+")";
                          else
                            return "translate(" + vars.x_scale(d[vars.var_x]) + ", " + vars.height/2 + ")";
                        })

/*      // For some reasons hides the labels
        if(typeof vars.highlight.length != undefined) {
          vars.evt.call("highlightOn", vars.data[vars.highlight]);
        }
*/
        // If init, then dispatch those events
        // TODO: dispatch focus event here and highlight nodes
        if(vars.selection.length > 0) {

          var selection_points = gPoints
            .filter(function(d, i) {
              return i == vars.selection[0];
            })

          selection_points.select(".dot__circle")
            .classed("selected", false)

          selection_points.select(".dot__label")
            .filter(function(d, i) {
              return i == vars.selection[0];
            })
            .classed("selected", true)

        }

        break;        