      case "piechart_old":

        vars.params = {

          x_scale: [{
            name: "linear",
            func: d3.scale.linear()
                    .range([vars.width/2, vars.width/2])
                    .domain([0, d3.max(vars.new_data, function(d) { return d[vars.var_y]; })])
                    .nice()
          }],

          y_scale: [{
            name: "linear",
            func: d3.scale.linear()
                    .range([vars.height/2, vars.height/2])
                    .domain([0, d3.max(vars.new_data, function(d) { return d[vars.var_y]; })])
                    .nice()
          }],

          r_scale: d3.scale.linear()
                      .range([0, vars.width/6])
                      .domain([0, d3.max(vars.new_data, function(d) { return d.data[vars.var_share]; })]),

          items: [{
            marks: [{
              type: "arc",
              rotate: "0",
              fill: function(d) { return vars.color(vars.accessor_items(d)[vars.var_color]); }
            }]
          }],

          accessor_data: function(d) { return d.data; },

          x_axis_show: false,

          y_axis_show: false

        };

        vars.accessor_data = function(d) { return d.data; }

        vars = vistk.utils.merge(vars, vars.params);

        // LOAD USER PARAMS
        vars.items = vistk.utils.merge(vars.items, vars.user_vars.items);

        // PRE-UPDATE ITEMS
        var gItems = vars.svg.selectAll(".mark__group")
                          .data(vars.new_data, function(d, i) { return d.data[vars.var_id]; });

          // ENTER ITEMS
          var gItems_enter = gItems.enter()
                          .append("g")
                          .each(vistk.utils.items_group)
                          .attr("transform", function(d, i) {
                            return "translate(" + vars.x_scale[0]["func"](vars.accessor_data(d)[vars.var_x]) + ", " + vars.y_scale[0]["func"](vars.accessor_data(d)[vars.var_y]) + ")";
                          }); 

       // APPEND AND UPDATE ITEMS MARK
        vars.items[0].marks.forEach(function(params) {
          gItems_enter.call(vistk.utils.draw_mark, params);
          gItems.call(vistk.utils.draw_mark, params);
        });
/*
        // Add a graphical mark
        gPoints_enter.each(vistk.utils.items_mark)
                        .select("*")
                        .attr("transform", function(d) { 
                          return "translate(" + arc.centroid(d) + ")"; 
                        });
*/
        // Add an other graphical mark (e.g. text labels)

        break;
