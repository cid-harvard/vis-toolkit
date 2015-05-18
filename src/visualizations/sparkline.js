      case "sparkline":

        vars.x_scale = d3.scale.linear().range([0, vars.width - 2]);
        vars.y_scale = d3.scale.linear().range([vars.height - 4, 0]);

        vars.x_scale.domain(d3.extent(vars.new_data, function(d) { return d[vars.time.var_time]; }));
        vars.y_scale.domain(d3.extent(vars.new_data, function(d) { return d[vars.var_y]; }));

        // TODO: put into a connection mark line
        var line = d3.svg.line()
                     .interpolate(vars.interpolate)
                     .x(function(d) { return vars.x_scale(d[vars.time.var_time]); })
                     .y(function(d) { return vars.y_scale(d[vars.var_y]); });
      
        // TODO: turn this into a connection
        vars.svg.selectAll(".sparkline").data([vars.new_data])
          .enter().append('path')
           .attr('class', 'sparkline')
           .attr('d', line);

        var gMarks = vars.svg.selectAll(".mark__group")
                        .data(vars.new_data, function(d, i) { return i; });

        // Enter groups for graphical marks
        var gMarks_enter = gMarks.enter()
                        .append("g")
                        .filter(function(d, i) {
                          return i === 0 || i === vars.new_data.length - 1;
                        })
                        .attr("class", "mark__group")
                        .attr("transform", function(d, i) {
                          return "translate(" + vars.x_scale(d[vars.time.var_time]) + ", " + vars.y_scale(d[vars.var_y]) + ")";
                        });

        // Enter graphical marks
        gMarks_enter.each(vistk.utils.add_mark);

        // Update graphical marks
        vars.svg.selectAll(".mark__group")
                        .transition().delay(function(d, i) { return i / vars.data.length * 100; })
                        .duration(vars.duration)
                        .attr("transform", function(d, i) {
                          return "translate(" + vars.x_scale(d[vars.time.var_time]) + ", " + vars.y_scale(d[vars.var_y]) + ")";
                        });
        break;