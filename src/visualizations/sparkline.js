
      case "sparkline":

        // From http://www.tnoda.com/blog/2013-12-19
        var x = d3.scale.linear().range([0, vars.width - 2]);
        var y = d3.scale.linear().range([vars.height - 4, 0]);

        var line = d3.svg.line()
                     .interpolate("basis")
                     .x(function(d) { return x(d[vars.var_time]); })
                     .y(function(d) { return y(d[vars.var_y]); });
        
        x.domain(d3.extent(new_data, function(d) { return d[vars.var_time]; }));
        y.domain(d3.extent(new_data, function(d) { return d[vars.var_y]; }));

        vars.svg.selectAll(".sparkline").data([new_data])
          .enter().append('path')
        //   .datum(data)
           .attr('class', 'sparkline')
           .attr('d', line);

        vars.svg.append('circle')
           .attr('class', 'start sparkcircle')
           .attr('cx', x(new_data[0][vars.var_time]))
           .attr('cy', y(new_data[0][vars.var_y]))
           .attr('r', 1.5);  

        vars.svg.append('circle')
           .attr('class', 'end sparkcircle')
           .attr('cx', x(new_data[new_data.length-1][vars.var_time]))
           .attr('cy', y(new_data[new_data.length-1][vars.var_y]))
           .attr('r', 1.5);  


        break;
