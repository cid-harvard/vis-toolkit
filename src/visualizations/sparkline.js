      case "sparkline":

        vars.x_scale = d3.scale.linear().range([0, vars.width - 2]);
        vars.y_scale = d3.scale.linear().range([vars.height - 4, 0]);

        vars.x_scale.domain(d3.extent(vars.new_data, function(d) { return d[vars.time.var_time]; }));
        vars.y_scale.domain(d3.extent(vars.new_data, function(d) { return d[vars.var_y]; }));

        vars.line = d3.svg.line()
                     .interpolate(vars.interpolate)
                     .x(function(d) { return vars.x_scale(d[vars.time.var_time]); })
                     .y(function(d) { return vars.y_scale(d[vars.var_y]); });

        // TODO: add all the line and not just the filtered one
        var gConnect = vars.svg.selectAll(".connect__group")
                        .data([vars.new_data], function(d, i) { return i; });
      
        var gConnect_enter = gConnect.enter()
                        .append("g")
                        .attr("class", "connect__group")

        // Enter connect graphical marks
        gConnect_enter.each(vistk.utils.connect_mark);      

        var gItems = vars.svg.selectAll(".items__group")
                        .data(vars.new_data, function(d, i) { return i; });

        // Enter groups for items graphical marks
        var gItems_enter = gItems.enter()
                        .append("g")
                        .filter(function(d, i) {
                          return i === 0 || i === vars.new_data.length - 1;
                        })
                        .attr("class", "items__group")
                        .attr("transform", function(d, i) {
                          return "translate(" + vars.x_scale(d[vars.time.var_time]) + ", " + vars.y_scale(d[vars.var_y]) + ")";
                        });

        // Enter items
        gItems_enter.each(vistk.utils.items_mark);

        // TODO: Update connect

        // Update items
        vars.svg.selectAll(".items__group")
                        .transition().delay(function(d, i) { return i / vars.data.length * 100; })
                        .duration(vars.duration)
                        .attr("transform", function(d, i) {
                          return "translate(" + vars.x_scale(d[vars.time.var_time]) + ", " + vars.y_scale(d[vars.var_y]) + ")";
                        });
        break;