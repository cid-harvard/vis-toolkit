      case "barchart":

        vars.params = {
          x_scale: [{
              name: "linear",
              func: d3.scale.ordinal()
                      .rangeRoundBands([0, vars.width], .1)
                      .domain(vars.data.map(function(d) { return d[vars.var_x]; })),
            }
          ],

          x_ticks: 10,

          y_scale: [{
              name: "linear",
              func: d3.scale.linear()
                      .range([vars.height, 0])
                      .domain([0, d3.max(vars.data, function(d) { return d[vars.var_y]; })]),
            }
          ],

          items: [{
            attr: "country",
            marks: [{
                type: "rect",
                rotate: "0"
              }, {
                type: "text",
                rotate: "90",
                translate: null,
                anchor: "end"
              }]
          }, {
            attr: "continent",
            marks: [{
              // Stacked bar chart
            }]
          }],

          connect: {
            type: null
          },
        };

        vars = vistk.utils.merge(vars, vars.params);

        // REGISTER EVENTS
        vars.evt.register("highlightOn", function(d) { });
        vars.evt.register("highlightOut", function(d) { });
        vars.evt.register("selection", function(d) { });
        vars.evt.register("resize", function(d) { });

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

        // PRE-UPDATE
        gItems = vars.svg.selectAll(".mark__group")
                         .data(vars.new_data, function(d, i) { return i; });

        // ENTER
        var gItems_enter = gItems.enter()
                        .append("g")
                        .each(vistk.utils.items_group)
                        .attr("transform", function(d, i) {
                          return "translate(" + vars.margin.left + ", " + vars.height/2 + ")";
                        });

        // Add graphical marks
        vars.items[0].marks.forEach(function(d) {

          vars.mark.type = d.type;
          vars.mark.rotate = d.rotate;

          gItems_enter.each(vistk.utils.items_mark);

          gItems.each(vistk.utils.items_mark)
            .select("rect")
       //     .attr("x", function(d) { return vars.x_scale[0]["func"](d[vars.var_x]); })
            .attr("width", vars.x_scale[0]["func"].rangeBand())
            .attr("y", function(d) { return - vars.y_scale[0]["func"](d[vars.var_y]); })
            .attr("height", function(d) { return vars.y_scale[0]["func"](d[vars.var_y]); });

        });

        // EXIT
        var gItems_exit = gItems.exit().style("opacity", 0.1);


        // POST-UPDATE
        gItems.transition()
            .delay(function(d, i) { return i / vars.data.length * 100; })
            .duration(vars.duration)
            .attr("transform", function(d, i) {
              return "translate(" + vars.x_scale[0]["func"](d[vars.var_x]) + ", " + (vars.height - vars.margin.top - vars.margin.bottom) + ")";
            });

      break;
