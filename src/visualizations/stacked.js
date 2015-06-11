      case "stacked":

        vars.params = {

          accessor_values: function(d) { return d.values; },
          accessor_items: function(d) { return d; },

          x_scale: [{
              name: "linear",
              func: d3.time.scale()
                      .range([vars.margin.left, vars.width - vars.margin.left - vars.margin.right])
                      .domain(d3.extent(vars.data, function(d) { return d[vars.time.var_time]; }))
            }
          ],

          y_scale: [{
              name: "linear",
              func: d3.scale.linear()
                      .range([0, vars.height])
                      .domain(d3.extent(vars.new_data, function(d) { return d[vars.var_y]; }))

          }],
          
          connect: [{
            attr: vars.time.var_time,
            marks: [{
                type: "path",
                rotate: "0",
                fill: function(d) { return vars.color(d.name); },
                stroke: function(d) {
                  return vars.color(vars.accessor_items(d)[vars.var_color]); 
                },
                func: d3.svg.area()
                        .interpolate('cardinal')
                        .x(function(d) { return vars.x_scale[0]["func"](d[vars.time.var_time]); })
                        .y0(function(d) { return vars.y_scale(d.y0); })
                        .y1(function(d) { return vars.y_scale(d.y0 + d.y); })
              }]
          }]

        };

        vars = vistk.utils.merge(vars, vars.params);

        // Events handlers
        vars.evt.register("highlightOn", function(d) { });
        vars.evt.register("highlightOut", function(d) { });
        vars.evt.register("selection", function(d) { });
        vars.evt.register("resize", function(d) { });

       // var parseDate = d3.time.format("%y-%b-%d").parse,
        var formatPercent = d3.format(".0%");

        vars.y_scale = d3.scale.linear()
            .range([vars.height, vars.margin.bottom])
            .domain(d3.extent(vars.data, function(d) { return d[vars.var_y]; }));

        vars.x_axis = d3.svg.axis()
            .scale(vars.x_scale[0]["func"])
            .orient("bottom(");

        vars.y_axis = d3.svg.axis()
            .scale(vars.y_scale)
            .orient("left");

        vars.area = d3.svg.area()
            .interpolate('cardinal')
            .x(function(d) { return vars.x_scale[0]["func"](d[vars.time.var_time]); })
            .y0(function(d) { return vars.y_scale(d.y0); })
            .y1(function(d) { return vars.y_scale(d.y0 + d.y); });

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

          // Update
          gConnect.each(vistk.utils.items_mark)
                .select("path")
                .classed("highlighted", function(d, i) { return vars.time_data[i].__highlighted; });

        });

/*
        browser.append("text")
            .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
            .attr("transform", function(d) {
             return "translate(" + vars.x_scale(d.value.date) + "," + y(d.value.y0 + d.value.y / 2) + ")"; })
            .attr("x", -6)
            .attr("dy", ".35em")
            .text(function(d) { return d.name; });
*/
        vars.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (vars.height - vars.margin.bottom) + ")")
            .call(vars.x_axis)
             
        vars.svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + (vars.margin.left) + ",0)")
            .call(vars.y_axis)
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "-1.71em")
            .style("text-anchor", "end")
            .text(vars.y_text);


      break;
      