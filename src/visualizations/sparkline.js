      case "sparkline":

        vars.params = {

          connect: {
            attr: vars.time.var_time,
            marks: [{
                type: "path",
                rotate: "0",
              }]
          },

          x_scale: [{
              name: "linear",
              func: d3.scale.linear()
                      .range([0, vars.width - 2])
                      .domain(d3.extent(vars.new_data, function(d) { return d[vars.time.var_time]; }))
          }],

          y_scale: [{
              name: "linear",
              func: d3.scale.linear()
                      .range([vars.height - 4, 0])
                      .domain(d3.extent(vars.new_data, function(d) { return d[vars.var_y]; }))
          }],

          path: d3.svg.line()
                     .interpolate(vars.interpolate)
                     .x(function(d) { return vars.x_scale[0]["func"](d[vars.time.var_time]); })
                     .y(function(d) { return vars.y_scale[0]["func"](d[vars.var_y]); }),

          items: [{
            attr: "year",
            marks: [{
                type: "diamond",
                rotate: "0",
              }, {
                type: "text",
                rotate: "30",
                translate: null
              }]
          }]

        };

        vars = vistk.utils.merge(vars, vars.params);

        // TODO: add all the line and not just the filtered one
        var gConnect = vars.svg.selectAll(".connect__group")
                        .data([vars.new_data], function(d, i) { return i; });
      
        var gConnect_enter = gConnect.enter()
                        .append("g")
                        .attr("class", "connect__group");

        // Enter connect graphical marks
       // gConnect_enter.each(vistk.utils.connect_mark);

        vars.connect[0].marks.forEach(function(d) {
          
          gItems_enter.each(vistk.utils.connect_mark);

        });

        var gItems = vars.svg.selectAll(".items__group")
                        .data(vars.new_data, function(d, i) { return i; });

        // ENTER
        var gItems_enter = gItems.enter()
                        .append("g")
                        .each(vistk.utils.items_group)
                        .attr("transform", function(d, i) {
                          return "translate(" + vars.x_scale[0]["func"](d[vars.time.var_time]) + ", " + vars.y_scale[0]["func"](d[vars.var_y]) + ")";
                        });

        // Add graphical marks
        vars.items[0].marks.forEach(function(d) {

          vars.mark.type = d.type;
          vars.mark.rotate = d.rotate;
          gItems_enter.each(vistk.utils.items_mark);

        });

        // Update items
        vars.svg.selectAll(".items__group")
                        .transition()
                        .delay(function(d, i) { return i / vars.data.length * 100; })
                        .duration(vars.duration)
                        .attr("transform", function(d, i) {
                          return "translate(" + vars.x_scale[0]["func"](d[vars.time.var_time]) + ", " + vars.y_scale[0]["func"](d[vars.var_y]) + ")";
                        });
        break;
