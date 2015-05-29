      case "scatterplot":

        vars.params = {

          x_scale: [{
              name: "linear",
              func: d3.scale.linear()
                      .range([vars.margin.left, vars.width-vars.margin.left-vars.margin.right])
                      .domain(d3.extent(vars.new_data, function(d) { return d[vars.var_x]; })).nice()
            }
          ],

          x_ticks: 10,

          y_scale: [{
              name: "linear",
              func: d3.scale.linear()
                      .range([vars.height-vars.margin.top-vars.margin.bottom, vars.margin.top])
                      .domain(d3.extent(vars.data, function(d) { return d[vars.var_y]; })).nice(),
            }
          ],

          r_scale: d3.scale.linear(),

          var_r: "total_piescatter",

          connect: {
            type: null
          },

          items: [{
            attr: "country",
            marks: [{
                type: "circle",
                rotate: "0",
              }, {
                type: "text",
                rotate: "30",
                translate: null
              }]
            }, {
            attr: "continent",
            marks: [{
              type: "arc"
            }, {
                type: "text",
                rotate: "-30",
                translate: null
              }]
          }]

        };

        vars = vistk.utils.merge(vars, vars.params);

        vars.evt.register("highlightOn", function(d) {

          gItems.selectAll(".items_mark").classed("highlighted", function(e, j) { return e === d; });

        });

        vars.evt.register("highlightOut", function(d) {

          gItems.selectAll(".items_mark").classed("highlighted", false);
          gItems.selectAll(".dot__label").classed("highlighted", false);

        });

        // AXIS
        vars.svg.call(vistk.utils.axis)
                .select(".x.axis")
                .attr("transform", "translate(0," + (vars.height - vars.margin.bottom - vars.margin.top) + ")")
              .append("text") // TODO: fix axis labels
                .attr("class", "label")
                .attr("x", vars.width-vars.margin.left-vars.margin.right)
                .attr("y", -6)
                .style("text-anchor", "end")
                .text(function(d) { return vars.var_x; });                

        vars.svg.call(vistk.utils.y_axis);
 
        // GRID
        vars.svg.selectAll(".x.grid").data([vars.new_data])
          .enter()
            .append("g")
            .attr("class", "x grid")
            .attr("transform", "translate(0," + vars.height + ")");

        vars.svg.selectAll(".x.grid").transition()
            .duration(vars.duration)
            .call(vistk.utils.make_x_axis()
            .tickSize(-vars.height, 0, 0)
            .tickFormat(""));

        vars.svg.selectAll(".y.grid").data([vars.new_data])
          .enter()
            .append("g")        
            .attr("class", "y grid")
            .attr("transform", "translate(0, 0)");

        vars.svg.selectAll(".y.grid").transition()
            .duration(vars.duration)
            .call(vistk.utils.make_y_axis()
            .tickSize(-vars.width, 0, 0)
            .tickFormat(""));

        // PRE-UPDATE
        var gItems = vars.svg.selectAll(".mark__group")
                          .data(vars.new_data, function(d, i) { 
                            return d[vars.var_text]; 
                          });

        // ENTER
        var gItems_enter = gItems.enter()
                        .append("g")
                          .each(vistk.utils.items_group)
                          .attr("transform", function(d, i) {
                            return "translate(" + vars.margin.left + ", " + vars.height/2 + ")";
                          });

        if(vars.aggregate === vars.var_group) {

          vars.pie = d3.layout.pie().value(function(d) { return d[vars.var_share]; }); // equal share

          //vars.radius = vars.width/12;
          vars.accessor_data = function(d) { return d.data; };

          vars.r_scale.range([0, vars.width/6])
                    .domain([0, d3.max(vars.new_data, function(d) { return d[vars.var_r]; })]);


          gItems_enter.each(function(d) {

            // Special arc for labels centroids
            var arc = d3.svg.arc().outerRadius(vars.radius).innerRadius(vars.radius);

            // Bind data to groups
            var gItems2 = vars.svg.selectAll(".mark__group2")
                             .data(vars.pie(d.piescatter), function(d, i) { return i; });

            // ENTER

            // Add a group for marks
            var gItems2_enter = gItems2.enter()
                            .append("g")
                              .attr("transform", "translate(" + vars.width/2 + "," + vars.height/2 + ")")
                              .each(vistk.utils.items_group)
                              .attr("transform", function(e, j) {

                                // Needed for the graphical mark
                                e[vars.var_group] = d[vars.var_group];
                                e.i = j;
                                e.total_piescatter = d.piescatter[0] + d.piescatter[1];

                                return "translate(" + vars.params.x_scale[0]["func"](d[vars.var_x]) + ", " + vars.params.y_scale[0]["func"](d[vars.var_y]) + ")";
                              });

            vars.items[1].marks.forEach(function(d) {

              vars.mark.type = d.type;
              vars.mark.rotate = d.rotate;
              gItems2_enter.each(vistk.utils.items_mark);

            });

          });

        } else {

          vars.accessor_data = function(d) { return d; };

            // Add graphical marks
            vars.items[0].marks.forEach(function(d) {

              vars.mark.type = d.type;
              vars.mark.rotate = d.rotate;
              gItems_enter.each(vistk.utils.items_mark);

            });

        }

        // EXIT
        var gItems_exit = gItems.exit().remove();

        // POST-UPDATE
        gItems
          .transition()
          .attr("transform", function(d) {
            return "translate(" + vars.params.x_scale[0]["func"](d[vars.var_x]) + ", " + vars.params.y_scale[0]["func"](d[vars.var_y]) + ")";
          });

      break;
        