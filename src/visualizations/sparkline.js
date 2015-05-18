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

        var line = d3.svg.line()
                     .interpolate("basis")
                     .x(function(d) { return vars.x_scale(d[vars.time.var_time]); })
                     .y(function(d) { return vars.y_scale(d[vars.var_y]); });
        
        vars.x_scale.domain(d3.extent(new_data, function(d) { return d[vars.time.var_time]; }));
        vars.y_scale.domain(d3.extent(new_data, function(d) { return d[vars.var_y]; }));

        vars.svg.selectAll(".sparkline").data([new_data])
          .enter().append('path')
           .attr('class', 'sparkline')
           .attr('d', line);

        vars.svg.append('circle')
           .attr('class', 'start sparkcircle')
           .attr('cx', vars.x_scale(new_data[0][vars.time.var_time]))
           .attr('cy', vars.y_scale(new_data[0][vars.var_y]))
           .attr('r', 1.5);  

        vars.svg.append('circle')
           .attr('class', 'end sparkcircle')
           .attr('cx', vars.x_scale(new_data[new_data.length-1][vars.time.var_time]))
           .attr('cy', vars.y_scale(new_data[new_data.length-1][vars.var_y]))
           .attr('r', 1.5);  

        break;