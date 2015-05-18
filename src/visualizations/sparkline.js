      case "sparkline":

        var new_data = [];

        // Flatten the data here
        // Or do something to build the temporal data? Should it happen here?
        vars.data.forEach(function(d) {

          if(d.dept_name === "Antioquia") {
            new_data.push({name: d.dept_name, year: vars.time.parse(d.year), realgdp: d.realgdp});
          }

        });

        vars.x_scale = d3.scale.linear().range([0, vars.width - 2]);
        vars.y_scale = d3.scale.linear().range([vars.height - 4, 0]);

        // TODO: put into a connection mark line
        var line = d3.svg.line()
                     .interpolate(vars.interpolate)
                     .x(function(d) { return vars.x_scale(d[vars.time.var_time]); })
                     .y(function(d) { return vars.y_scale(d[vars.var_y]); });
        
        vars.x_scale.domain(d3.extent(new_data, function(d) { return d[vars.time.var_time]; }));
        vars.y_scale.domain(d3.extent(new_data, function(d) { return d[vars.var_y]; }));

        // TODO: turn this into a connection
        vars.svg.selectAll(".sparkline").data([new_data])
          .enter().append('path')
           .attr('class', 'sparkline')
           .attr('d', line);

        var gPoints = vars.svg.selectAll(".points")
                        .data(new_data, function(d, i) {console.log(d); return i; });

        var gPoints_enter = gPoints.enter()
                        .append("g")
                        .filter(function(d, i) {
                          return i === 0 || i === new_data.length - 1;
                        })
                        .attr("class", "points")
                        .attr("transform", function(d, i) {
                          return "translate(" + vars.x_scale(d[vars.time.var_time]) + ", " + vars.y_scale(d[vars.var_y]) + ")";
                        });

        // Add a graphical mark
        gPoints_enter.each(vistk.utils.add_mark);

        vars.svg.selectAll(".points")
                        .transition().delay(function(d, i) { return i / vars.data.length * 100; })
                        .duration(vars.duration)
                        .attr("transform", function(d, i) {
                          return "translate(" + vars.x_scale(d[vars.time.var_time]) + ", " + vars.y_scale(d[vars.var_y]) + ")";
                        });
        break;