      case "linechart":

        vars.params = {

          accessor_values: function(d) { return d.values; },

          accessor_items: function(d) { return d; },

          x_scale: [{
              name: "linear",
              func: d3.time.scale()
                  .range([0, vars.width-100])
                  .domain(vars.time.interval)
            }
          ],

          y_scale: [{
              name: "linear",
              func: d3.scale.linear()
                      .range([0, vars.height - 4])
                      .domain(d3.extent(vars.new_data, function(d) { return d[vars.var_y]; }))

          }],

          items: [{
            attr: "year",
            marks: [{
                type: "circle",
                rotate: "0",
                fill: function(d) { return vars.color(vars.accessor_items(d)[vars.var_color]); }
              }, {
                type: "text",
                rotate: "0",
                translate: null
              }]
          }],

          connect: [{
            attr: vars.time.var_time,
            marks: [{
                type: "path",
                rotate: "0",
                stroke: function(d) { 
                  console.log("dd", d);
                  return vars.color(vars.accessor_values(d)[0][vars.var_color]); },
                func: d3.svg.line()
                     .interpolate(vars.interpolate)
                     .x(function(d) { return vars.x_scale[0]["func"](d[vars.time.var_time]); })
                     .y(function(d) { return vars.y_scale[0]["func"](d[vars.var_y]); })
              }]
          }]

        };

        vars = vistk.utils.merge(vars, vars.params);

        vars.evt.register("highlightOn", function(d) {

          vars.svg.selectAll(".connect__group:not(.selected)").style("opacity", 0.2);
          vars.svg.selectAll(".text:not(.selected)").style("opacity", 0.2);

          vars.svg.selectAll("#"+d[vars.var_id]).style("opacity", 1);

          vars.svg.selectAll(".connect__group").filter(function(e, j) { return e === d; }).style("stroke-width", 3);
          vars.svg.selectAll(".text").filter(function(e, j) { return e === d; }).style("text-decoration", "underline");

        });

        vars.evt.register("highlightOut", function(d) {

          vars.svg.selectAll(".country:not(.selected)").style("opacity", 1);

          vars.svg.selectAll(".connect__group").filter(function(e, j) { return e === d; }).style("stroke-width", 1);
          vars.svg.selectAll(".text").filter(function(e, j) { return e === d; }).style("text-decoration", "none");

        });

        vars.evt.register("selection", function(d) {

          vars.svg.selectAll("#"+d[vars.var_id])
                  .classed("selected", !vars.svg.selectAll("#"+d[vars.var_id]).classed("selected"));

        });

        vars.x_axis = d3.svg.axis()
            .scale(vars.x_scale[0]["func"])
            .orient("top");

        vars.y_axis = d3.svg.axis()
            .scale(vars.y_scale[0]["func"])
            .orient("left");

        // TODO: use the connection mark instead of the line
        // FIX FOR MISSING VALUES
        // https://github.com/mbostock/d3/wiki/SVG-Shapes
        vars.line = d3.svg.line()
        // https://gist.github.com/mbostock/3035090
            .defined(function(d) { return d[vars.var_y] != null; })
            .interpolate(vars.interpolate)
            .x(function(d) { return vars.x_scale[0]["func"](d[vars.var_time]); })
            .y(function(d) { return vars.y_scale[0]["func"](d[vars.var_y]); });

        // TODO: fix the color scale
        vars.color.domain(d3.keys(vars.new_data[0]).filter(function(key) { return key !== "date"; }));

        // Grid layout (background)
        vars.svg.append("g")
            .attr("class", "x grid")
            .attr("transform", "translate(0," + vars.height + ")")
            .call(vistk.utils.make_x_axis()
            .tickSize(-vars.height, 0, 0)
            .tickFormat(""));

        vars.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + -5 + ")")
            .call(vars.x_axis);

        vars.svg.append("g")
            .attr("class", "y axis")
            .call(vars.y_axis)
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "-1.71em")
            .style("text-anchor", "end")
            .text(vars.y_text);

        // Connect marks
        var gConnect = vars.svg.selectAll(".connect__group")
                        .data(vars.time_data, function(d, i) { return i; });
      
        var gConnect_enter = gConnect.enter()
                        .append("g")
                        .attr("class", "connect__group")
                        .attr("id", function(d) {
                          return d[vars.var_id];
                        })
                        .style("opacity", 0.2);

        vars.connect[0].marks.forEach(function(d) {
          
          vars.mark.type = d.type;
          vars.mark.rotate = d.rotate;
          vars.mark.fill = d.fill;
          vars.mark.stroke = d.stroke;
          gConnect_enter.each(vistk.utils.connect_mark);

        });

        var gItems = vars.svg.selectAll(".mark__group")
                        .data(vars.new_data, function(d, i) { return i; });

        // ENTER
        var gItems_enter = gItems.enter()
                        .append("g")
                        .each(vistk.utils.items_group)
                        .attr("transform", function(d, i) {
                        //  console.log(d[vars.time.var_time] == vars.time.parse(vars.time.current_time))
                          return "translate(" + vars.x_scale[0]["func"](d[vars.time.var_time]) + ", " + vars.y_scale[0]["func"](d[vars.var_y]) + ")";
                        });

        // Items marks
        vars.items[0].marks.forEach(function(d) {

          vars.mark.type = d.type;
          vars.mark.rotate = d.rotate;
          vars.mark.fill = d.fill;
          gItems_enter.each(vistk.utils.items_mark);

        });

        gItems.transition()
          .attr("transform", function(d, i) {
            return "translate(" + vars.x_scale[0]["func"](d[vars.time.var_time]) + ", " + vars.y_scale[0]["func"](d[vars.var_y]) + ")";
          });


/*
        // Enter groups for items graphical marks
        var gItems_enter = gItems.enter()
                        .append("g")
                        .each(vistk.utils.items_group)
                        .attr("transform", function(d, i) {
                          return "translate(" + vars.x_scale[0]["func"](vars.accessor_values(d)[vars.time.var_time]) + ", " + vars.y_scale(vars.accessor_values(d)[vars.var_y]) + ")";
                        });

        gItems_enter.each(vistk.utils.items_mark)
                        .attr("transform", function(d, i) {
                          return "translate(" + vars.x_scale[0]["func"](vars.accessor_values(d)[vars.time.var_time]) + ", " + vars.y_scale(vars.accessor_values(d)[vars.var_y]) + ")";
                        });


        // TODO: turn into an item mark
        gItems_enter.append("text")
            .datum(function(d) { 
              d.values.sort(function(a, b) { return a.year > b.year;}); 
              return {name: d.name, id: d[vars.var_id], value: d.values[d.values.length - 1]}; 
            })
            .attr("transform", function(d) { 
              return "translate(" + vars.x_scale[0]["func"](vars.accessor_values(d)[vars.var_time]) + "," + vars.y_scale(vars.accessor_values(d)[vars.var_y]) + ")"; 
            })
            .attr("x", 3)
            .attr("class", function(d) {

              var c = "country text";

              if(vars.selection.indexOf(d.name) >= 0)
                c += " selected";

              if(vars.highlight.indexOf(d.name) >= 0)
                c += " highlighted";

              return c;
            })
            .attr("dy", ".35em")
            .attr("id", function(d) { return d[vars.var_id]; })
            .text(function(d) { return d[vars.var_text]; })
*/
        break;
