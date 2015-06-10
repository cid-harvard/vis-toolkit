      case "stacked":

        vars.params = {

          accessor_values: function(d) { return d.values; },

          x_scale: [{
              name: "linear",
              func: d3.time.scale()
                  .range([0, vars.width-100])
                  .domain(d3.extent(vars.new_data, function(d) { return d[vars.var_time]; }))
            }
          ],

          y_scale: [{
              name: "linear",
              func: d3.scale.linear()
                      .range([vars.height - 4, 0])
                      .domain(d3.extent(vars.new_data, function(d) { return d[vars.var_y]; }))
          }],

          items: [],

          connect: [{
            attr: vars.time.var_time,
            marks: [{
                type: "path",
                rotate: "0",
                func: d3.svg.line()
                     .interpolate(vars.interpolate)
                     .x(function(d) { return vars.x_scale[0]["func"](d[vars.time.var_time]); })
                     .y(function(d) { return vars.y_scale(d[vars.var_y]); })
              }]
          }]

        };

        // Events handlers
        vars.evt.register("highlightOn", function(d) { });
        vars.evt.register("highlightOut", function(d) { });
        vars.evt.register("selection", function(d) { });
        vars.evt.register("resize", function(d) { });

       // var parseDate = d3.time.format("%y-%b-%d").parse,
        var formatPercent = d3.format(".0%");

        vars.x_scale = d3.time.scale()
            .range([0, vars.width]);

        vars.y_scale = d3.scale.linear()
            .range([vars.height, 0]);

        vars.xAxis = d3.svg.axis()
            .scale(vars.x_scale)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(vars.y_scale)
            .orient("left")
            .tickFormat(formatPercent);

        vars.x_scale.domain(d3.extent(vars.new_data, function(d) { return d[vars.time.var_time]; }));

        vars.area = d3.svg.area()
            .interpolate('cardinal')
            .x(function(d) { return vars.x_scale(d[vars.time.var_time]); })
            .y0(function(d) { return vars.y_scale(d.y0); })
            .y1(function(d) { return vars.y_scale(d.y0 + d.y); });

        var browser = vars.svg.selectAll(".browser")
            .data(vars.time_data)
          .enter()
            .append("g")
            .attr("class", "browser");

        browser.append("path")
            .attr("class", "area")
            .attr("d", function(d) { return vars.area(d.values); })
            .style("fill", function(d) { return vars.color(d.name); });

/*
        browser.append("text")
            .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
            .attr("transform", function(d) {
                console.log("VVVV", d)
             return "translate(" + vars.x_scale(d.value.date) + "," + y(d.value.y0 + d.value.y / 2) + ")"; })
            .attr("x", -6)
            .attr("dy", ".35em")
            .text(function(d) { return d.name; });
*/
        vars.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + vars.height + ")")
            .call(vars.xAxis);

        vars.svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

      break;
      