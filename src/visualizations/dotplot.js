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
            .filter(function(e, j) { return e === d; });

          selected_node.classed("selected", !selected_node.classed("selected"));

          /*
          var index = vars.selection.indexOf(d);

          if(index <0)
            vars.selection.push(d);
          else
            vars.selection.splice(index, 1);
          */

        });

        if(vars.x_type === "index") {

          vars.x_scale = d3.scale.ordinal()
                .domain(d3.range(vars.new_data.length))
                .rangeBands([vars.margin.left, vars.width - vars.margin.left - vars.margin.right]);

          vars.new_data.sort(function ascendingKey(a, b) {
            return d3.ascending(a[vars.var_x], b[vars.var_x]);
          })
          .forEach(function(d, i) {
            d.rank = vars.x_scale(i);
          });

        } else {

          vars.x_scale = d3.scale.linear()
              .range([vars.margin.left, vars.width-vars.margin.left-vars.margin.right])
              .domain([0, d3.max(vars.new_data, function(d) { return d[vars.var_x]; })])
              .nice();
        
        }

        vars.x_axis = d3.svg.axis()
            .scale(vars.x_scale)
            .ticks(vars.x_ticks)
            // Quick fix to get max value
            .tickValues([0, d3.max(vars.new_data, function(d) { return d[vars.var_x]; })])
            .tickFormat(function(d) { return vars.x_format(d); })
            .tickSize(vars.tickSize)
            .tickPadding(vars.tickPadding)
            .orient("bottom");

        vars.svg.selectAll(".x.axis").data([vars.new_data])
          .enter()
            .append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (vars.height/2) + ")")
          .append("text")
            .attr("class", "label")
            .attr("x", vars.width-vars.margin.left-vars.margin.right)
            .attr("y", -6)
            .style({
              "text-anchor": "end",
              "display": function(d) { 
                return typeof vars.x_text !== "undefined" && vars.x_text !== null;
              }
            })
            .text(vars.var_x);

        vars.svg.selectAll(".x.axis tick line").style("display", "none")

        vars.svg.selectAll(".x.axis").transition()
            .duration(vars.duration)
            .call(vars.x_axis);

        var gPoints = vars.svg.selectAll(".mark__group")
                         .data(vars.new_data, function(d, i) { return i; });

        var gPoints_enter = gPoints.enter()
                        .append("g")
                        .attr("class", "mark__group")
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
                        });

        // Add a graphical mark
        gPoints_enter.each(vistk.utils.items_mark);

        // TODO: turn graphical mark that can be customized
        // gPoints_enter.each(vistk.utils.items_mark);
        // ..the mapping configuration should be in the config file
        gPoints_enter.append("text")
                        .attr("x", 10)
                        .attr("y", 0)
                        .attr("dy", ".35em")
                        .attr("class", "dot__label")
                        .attr("transform", "rotate(-30)")
                        .text(function(d) { return d[vars.var_text]; });

        var gPoints_exit = gPoints.exit().style("opacity", 0.1);

        vars.svg.selectAll(".mark__group")
                        .transition()
                        .delay(function(d, i) { return i / vars.data.length * 100; })
                        .duration(vars.duration)
                        .attr("transform", function(d, i) {
                          if(vars.x_type === "index") {
                            return "translate(" + d[vars.var_x] + ", " + vars.height/2 + ")";
                          } else {
                            return "translate(" + vars.x_scale(d[vars.var_x]) + ", " + vars.height/2 + ")";
                          }
                        });

        // If init, then dispatch those events
        // TODO: dispatch focus event here and highlight nodes
        if(vars.selection.length > 0) {

          var selection_points = gPoints
            .filter(function(d, i) {
              return i === vars.selection[0];
            });

          selection_points.select(".dot__circle")
            .classed("selected", false);

          selection_points.select(".dot__label")
            .filter(function(d, i) {
              return i === vars.selection[0];
            })
            .classed("selected", true);

        }

        if(typeof vars.highlight.length !== undefined) {
          vars.evt.call("highlightOn", vars.new_data[vars.highlight]);
        }

        break;        