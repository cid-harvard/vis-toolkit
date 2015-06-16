      case "linechart":

        vars.params = {

          accessor_values: function(d) { return d.values; },
          accessor_items: function(d) { return d; },

          x_ticks: 10,
          x_format: d3.time.format("%Y"),
          x_tickValues: null,
          x_axis_orient: "top",

          y_grid_show: true,

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
                fill: function() { return "none"; },
                stroke: function(d) {
                  return vars.color(vars.accessor_items(d)[vars.var_color]); 
                },
                func: d3.svg.line()
                     .interpolate(vars.interpolate)
                     .x(function(d) { return vars.x_scale[0]["func"](d[vars.time.var_time]); })
                     .y(function(d) { return vars.y_scale[0]["func"](d[vars.var_y]); })
              }]
          }]

        };

        vars = vistk.utils.merge(vars, vars.params);

        vars.y_axis = d3.svg.axis()
            .scale(vars.y_scale[0]["func"])
            .orient("left");
/*
        // TODO: use the connection mark instead of the line
        // FIX FOR MISSING VALUES
        // https://github.com/mbostock/d3/wiki/SVG-Shapes
        vars.line = d3.svg.line()
        // https://gist.github.com/mbostock/3035090
            .defined(function(d) { return d[vars.var_y] != null; })
            .interpolate(vars.interpolate)
            .x(function(d) { return vars.x_scale[0]["func"](d[vars.var_time]); })
            .y(function(d) { return vars.y_scale[0]["func"](d[vars.var_y]); });
*/
        // TODO: fix the color scale
        vars.color.domain(d3.keys(vars.new_data[0]).filter(function(key) { return key !== "date"; }));

        // Grid layout (background)
        vars.svg.data([vars.new_data]).enter().append("g")
            .attr("class", "x grid")
            .attr("transform", "translate(0," + vars.height + ")")
            .call(vistk.utils.make_x_axis()
            .tickSize(-vars.height, 0, 0)
            .tickFormat(""));

        vars.svg
            .call(vistk.utils.axis)
            .select(".x.axis")
            .attr("transform", "translate(0," + 0+ ")");

        vars.svg.data([vars.new_data]).enter().append("g")
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
                        .attr("id", function(d) { return d[vars.var_id]; })
                        .style("opacity", 0.2);

        vars.connect[0].marks.forEach(function(d) {
          
          vars.mark.type = d.type;
          vars.mark.rotate = d.rotate;
          vars.mark.fill = d.fill;
          vars.mark.stroke = d.stroke;

          gConnect_enter.each(vistk.utils.connect_mark)
            .select("path")
            .attr("id", function(d) {
              return d[vars.var_id]; 
            })
            .style("stroke", d.stroke);

          // Update
          gConnect.each(vistk.utils.connect_mark)
                //.select("path")
                //.classed("highlighted", function(d, i) { return vars.time_data[i].__highlighted; });

        });

        var gItems = vars.svg.selectAll(".mark__group")
                        .data(vars.new_data, function(d, i) { return i; });

        // ENTER
        var gItems_enter = gItems.enter()
                        .append("g")
                        .each(vistk.utils.items_group)
                        .attr("id", function(d) { return d[vars.var_id]; })
                        .attr("transform", function(d, i) {
                        //  console.log(d[vars.time.var_time] == vars.time.parse(vars.time.current_time))
                          return "translate(" + vars.x_scale[0]["func"](d[vars.time.var_time]) + ", " + vars.y_scale[0]["func"](d[vars.var_y]) + ")";
                        })
                        .classed("selected", function(d) {
                          return vars.selection.indexOf(d[vars.var_id]) >= 0;
                        });

        // Items marks
        vars.items[0].marks.forEach(function(d) {

          vars.mark.type = d.type;
          vars.mark.rotate = d.rotate;
          vars.mark.fill = d.fill;
          var new_gItems = gItems_enter.each(vistk.utils.items_mark)

/*          
          new_gItems.select("circle")
                      .attr("id", function(d) { return d[vars.var_id]; })
                      .style("opacity", .2);

          new_gItems.select("text")
                      .attr("id", function(d) { return d[vars.var_id]; })
                      .style("opacity", 0.2)
*/
          gItems.each(vistk.utils.items_mark)
                .select("text")
                .classed("highlighted", function(d, i) { return d.__highlighted; });

          gItems.each(vistk.utils.items_mark)
                .select("circle")
                .classed("highlighted", function(d, i) { return d.__highlighted; });

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
